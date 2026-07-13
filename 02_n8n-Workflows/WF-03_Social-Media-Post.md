# WF-03 – Social Media Post (Karenz + Posting IG + FB)

**JSON:** `PF_WF-03_Social_Media_Post_v7.1.json` (Root, **aktive Version**)
**Vorgänger:** v4 (Canva-basiert, archiviert), v5 (Pre-Flight-Spec, nie deployed), v6 (archiviert 2026-07-13)

**Trigger:** stündlicher Cron
**Status-Filter (Input):** `field_6 = Bereit`
**Status-Effekt (Output):** `field_6 = Veröffentlicht`, IG-Post-ID in `field_12`, Log in `field_13`

**Live in Produktion seit:** 2026-05-17 (erster echter Post auf @physio_fuchs_lintorf und FB-Page „Physio Fuchs Lintorf")

---

## Zweck

WF-03 v6 nimmt fertige `Bereit`-Items aus SharePoint und postet sie auf Instagram + Facebook über die Meta Graph API:

1. Karenz-Check: ≥ 24h seit Statuswechsel auf `Bereit`
2. Schedule-Check: geplantes Datum + Uhrzeit erreicht
3. Instagram: Container erstellen → 15 s warten → Veröffentlichen
4. Facebook: Foto-Post + Hashtag-Kommentar (Best-Practice: Hashtags als 1. Kommentar, nicht in Caption)
5. SharePoint zurückschreiben: Status `Veröffentlicht` + Post-ID

**Vollautomatik:** Kein Teams-Approval. Sicherheitsnetze sind der HWG-Filter in WF-02 (kann auf `Geblockt` setzen) und die 24h-Karenz hier in WF-03 (Judith kann während der Karenz manuell zurückziehen).

---

## Architektur

```
[Cron: stündlich]
        │
        ▼
[SP: Bereit-Items holen]
        │  alle Items mit Status=Bereit (default 33 items)
        ▼
[FilterKZ — Code-Node]
        │  prüft je Item:
        │   - Karenz: lastModifiedDateTime + KARENZ_HOURS ≤ now ?
        │   - Schedule: Ver_x00f6_ffentlichungsdatum + field_5 (Uhrzeit) ≤ now ?
        │   - IG-URL vorhanden (f.field_8 || f.field_9) ?
        │   - FB-URL vorhanden (f.Bild_FB_Dateiname) ?
        │  pusht qualifizierende Items, returnt results.slice(0, 1)
        │
        ├──────────────────────────────────┐
        │                                  │
        ▼ (IG-Branch)                      ▼ (FB-Branch)
[IG_Container]                     [FB_Photo]
   POST /{ig-id}/media                POST /{fb-page-id}/photos
   - image_url = field_8/9            - url     = Bild_FB_Dateiname
   - caption   = caption_with_hashtags - caption = caption (ohne Hashtags!)
   returns container-id               - published = true
        │                              returns post_id
        ▼                                  │
[15 Sekunden warten]                       ▼
        │                            [FB_Comment]
        ▼                              POST /{post-id}/comments
[IG_Publish]                           - message = hashtags
   POST /{ig-id}/media_publish              │
   - creation_id = $json.id                 │
   returns final IG post-id                 │
        │                                  │
        └──────────────────┬───────────────┘
                           ▼
                  [Code: SP-Update Payload]
                   - safe('IG_Publish') / safe('FB_Photo')
                   - Trockenlauf-Stop: wenn beide IDs leer → return []
                   - Item-ID-Auflösung robust (Id/ID/item_id/sp_fields.Id)
                   - baut PATCH-Payload:
                     { field_6: 'Veröffentlicht',
                       field_12: igPostId,
                       field_13: existingLog + neuer Eintrag }
                           │
                           ▼
                  [SP: Status veröffentlicht]
                   POST mit Header X-HTTP-Method: MERGE (SP-PATCH-Workaround)
                   URL: …/items({{ $json._sp_item_id }})
                   Body: {{ JSON.stringify($json.payload) }}
```

---

## Konfiguration

### Env-Vars (im n8n-Container `/docker/n8n/.env`)

| Variable | Wert | Verwendung |
|---|---|---|
| `FB_PAGE_ID` | `104383336093043` | FB Photos + Comments URL |
| `META_APP_ID` | `1311080664328669` | Meta App-Referenz |
| `GITHUB_TOKEN` | Fine-grained PAT | (nur WF-02, hier nur informativ) |

⚠️ **`docker compose restart n8n` reicht nicht** für Env-Var-Änderungen — Env-File wird nur bei Container-CREATE geladen. Stattdessen:
```bash
docker compose up -d --force-recreate n8n
```

### Hardcoded im Workflow

| Wert | Stelle | Hinweis |
|---|---|---|
| IG Business Account ID `17841461169626096` | URL in IG_Container + IG_Publish | Account `@physio_fuchs_lintorf` |
| FB Page ID `104383336093043` | URL in FB_Photo (auch via Env möglich) | Page „Physio Fuchs Lintorf" |
| Meta Graph API `v25.0` | alle Meta-URLs | bei Token-Refresh prüfen |
| `KARENZ_HOURS` | Konstante in FilterKZ-Code | für Test heute auf 0; Produktion → 24 |

### Credentials (im n8n Credential Store)

- `PF Microsoft SharePoint account` (OAuth2) — für SP-Read + SP-PATCH
- `PF Facebook Graph account` — für alle IG/FB-Calls

---

## Karenz + Schedule-Logik (FilterKZ)

```javascript
// Pseudocode
const KARENZ_HOURS = 24; // in Produktion. War heute zum Test 0.
const now = new Date();

for (const item of items) {
  const f = item.json.fields;
  const reasons = [];

  if (f.field_6 !== 'Bereit') {
    reasons.push(`status=${f.field_6}`);
    continue;
  }

  // Karenz: 24h seit letzter Änderung
  const modified = new Date(item.json.lastModifiedDateTime);
  const karenzReached = (now - modified) >= KARENZ_HOURS * 3600 * 1000;
  if (!karenzReached) reasons.push(`karenz_pending`);

  // Schedule: geplantes Datum + Uhrzeit erreicht
  const datum = new Date(f.Ver_x00f6_ffentlichungsdatum);
  const [hh, mm] = (f.field_5 || '00:00').split(':');
  datum.setHours(parseInt(hh), parseInt(mm), 0, 0);
  if (datum > now) reasons.push(`scheduled_future (${datum.toISOString()})`);

  // Bild-URLs vorhanden (Fallback field_8 → field_9 wegen SP-Spalten-History)
  const igUrl = f.field_8 || f.field_9 || '';
  const fbUrl = f.Bild_FB_Dateiname || '';
  if (!igUrl.startsWith('https://')) reasons.push(`IG_keine_url`);
  if (!fbUrl.startsWith('https://')) reasons.push(`FB_keine_url`);

  if (reasons.length === 0) results.push({ json: { ...item.json } });
  else skipped.push({ id: f.LinkTitle, reasons });
}

return results.slice(0, 1); // 1 Post pro Cron-Lauf (Rate-Limit-Schutz)
```

---

## Bekannte Quirks (Lessons Learned aus 2026-05-17)

### 1. SP-Hyperlink vs Text-Spalten

Die SharePoint-Spalte `Bild_Dateiname` hat **zwei interne Namen**: `field_9` (alt, Hyperlink-Typ, von früheren SP-URLs) und `field_8` (neu, Text-Typ, von GitHub-URLs ab WF-02 v18.2). FilterKZ liest beide mit Fallback `f.field_8 || f.field_9`.

### 2. Umlauten + Doppelpunkte in n8n-Node-Namen

Knotennamen wie `IG: Veröffentlichen` oder `FB: Foto` **brechen** Expressions à la `$('IG: Veröffentlichen')` — n8n meldet „Der referenzierte Knoten existiert nicht". Lösung: ASCII-only-Namen (`IG_Publish`, `FB_Photo`).

### 3. `.item` vs `.first()` bei Multi-Branch-Merge

Im `Code: SP-Update Payload` (das nach IG- und FB-Branch zusammenführt) muss `$(nodeName).first().json` statt `$(nodeName).item.json` benutzt werden, sonst kann n8n den Item-Kontext nicht zuordnen.

### 4. `media_publish` braucht aktuellen `creation_id`

`IG_Publish` muss `creation_id` per Expression aus `IG_Container` ziehen (`{{ $json.id }}`), nicht als Hardcode. Sonst wird ein abgelaufener Container referenziert → API gibt zwar erfolgreiche Response zurück, aber Post landet nirgendwo sichtbar.

### 5. Schedule-Check Timezone (2026-05-18 gefixt)

`new Date('2026-05-18T08:35:00')` ohne TZ-Suffix wird in Node.js je nach Container-TZ unterschiedlich geparsed. n8n-Container läuft typischerweise in UTC → `field_5`-Zeitstring wurde als UTC interpretiert, nicht als Berlin-Zeit → Items wurden 2h zu spät durchgelassen. Fix: Schedule-Time explizit per `Date.UTC(yyyy, mo-1, dd, hh - berlinOffset, mm, 0)` bauen. DST-Heuristik (Apr-Okt +2, sonst +1) ist für Posting-Workflow ausreichend.

### 6. SP-PATCH-Workaround

SharePoint REST kennt kein direktes PATCH. n8n sendet:
- Methode: POST
- Header `X-HTTP-Method: MERGE`
- Header `IF-MATCH: *`
- URL: `.../items({{ _sp_item_id }})` (Items-COLLECTION ist nicht patchbar, ITEM mit ID schon)

### 7. Caption-Split für FB

Auf Facebook gehören Hashtags als **erster Kommentar** unter den Post, nicht in die Caption (Best-Practice). Daher:
- IG-Caption: `caption_with_hashtags` (Caption + \n\n + Hashtags)
- FB-Caption: nur `caption`
- FB-Comment: nur `hashtags`

---

## Versionierung

- `PF_WF-03_Social_Media_Post_v6.json` — **aktiv**
- v4 (Canva-Pipeline) — im Root als Backup
- v5 — nie deployed, war Pre-Flight-Analyse (siehe `WF-03_v5_Pre-Flight-Analyse.md`)

Ältere Versionen nicht löschen, bis v6 ≥ 4 Wochen stabil läuft.

---

## Sicherheits-Regeln (zwingend)

- Status `Veröffentlicht` setzt **ausschließlich** WF-03 v6 nach erfolgreicher Meta-API-Antwort
- Vor IG/FB-Live-Call **immer**: Filter hat das Item explizit durchgelassen (Karenz + Schedule)
- Max 1 Post pro Cron-Lauf (`results.slice(0, 1)`) → Rate-Limit-Schutz
- Bei Trockenlauf (IG/FB-Nodes deaktiviert): SP-Update wird übersprungen (`return []` im Payload-Code)
- Vor jeder größeren Änderung: `KARENZ_HOURS = 0` setzen → Filter im Trockenlauf prüfen → erst dann auf 24 zurück

---

## Roadmap

- WF-02 v19 (paired-items): erlaubt Multi-Item-Modus, dann kann hier `.slice(0, 5)` o.ä. genutzt werden
- LinkedIn-Branch ergänzen (sobald Foto-Template fertig ist)
- D-ID-Avatar-Integration: zusätzlicher Branch für Reel-Items mit Video-URL

---

## Verwandte Dateien

- `02_n8n-Workflows/WF-02_Caption-Generator.md` (Vorgänger-Workflow, schreibt GitHub-URLs)
- `02_n8n-Workflows/Gotenberg-Setup.md` (HTML-Render-Sidecar)
- `00_Konzept/Status-Flow.md`
- `04_Canva-Vorlagen/html-templates/README.md` (Layout v12, Live-Template)

---

## Änderungshistorie

| Datum       | Was                                                                 | Wer             |
| ----------- | ------------------------------------------------------------------- | --------------- |
| 2026-07-13  | **v7.1 — Schedule-Datum-Fix (Berlin-TZ):** FilterKZ nahm das UTC-Datum aus `Veröffentlichungsdatum` (`split('T')[0]`). SharePoint speichert das Datum aber als „Vortag 22:00Z" (Berlin-Mitternacht in UTC) → geplanter Termin wurde 1 Tag zu früh berechnet; Item #73 („Haltungsschulung") ging um 13:01 statt 18:00 live (Karenz war die einzige verbleibende Bremse). Fix: `toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' })`. Verifiziert per Simulation (Sommer + Winter). Backup: `_Backups/PF_WF-03_v7_2026-07-13_1335_pre-datefix.json` | Claude / Thomas |
