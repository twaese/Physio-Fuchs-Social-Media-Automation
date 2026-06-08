# WF-02 – Caption-Generator + Bild-Render + GitHub-Push

**JSON:** `PF_WF-02_Caption_Generator_v18.2.json` (Root, **aktive Version**)
**In Vorbereitung:** v18.3 mit Foto-Branch — Spec siehe `WF-02_v18.3_Foto-Branch_Spec.md`
**Vorgänger:** v17 (vor Gotenberg-Pipeline, archiviert), v16 (vor Auto-Release)

**Trigger:** stündlicher Cron
**Status-Filter (Input):** `field_6 = Entwurf`
**Status-Effekt (Output):** `field_6 = Bereit` (wenn Caption+Bild OK + HWG-Filter grün)

**Live in Produktion seit:** 2026-05-17 (v18.2 mit GitHub-Push als Bild-Hosting)

---

## Zweck

WF-02 v18.2 nimmt frische `Entwurf`-Items aus SharePoint und macht sie posting-fertig:

1. Caption generieren via Claude (post-typ-spezifischer Prompt)
2. HWG-Filter: Heilversprechen blockieren → Status `Geblockt` bei Treffer
3. HTML-Template (Layout v12) mit Daten füllen
4. Gotenberg-Sidecar rendert HTML → PNG (IG 1080×1350 + FB 1080×1080)
5. PNG nach GitHub pushen → öffentliche `raw.githubusercontent.com`-URL
6. PNG zusätzlich in SP-Library (Audit-Backup)
7. SharePoint-Item updaten: Caption, Hashtags, GitHub-URLs, Status `Bereit`

---

## Architektur

```
[Cron: stündlich]
        │
        ▼
[SP: Items lesen]   Filter: field_6 = Entwurf
        │
        ▼
[Code: Validieren + Weiterleiten]
        - Status, Post-Typ-Validierung
        - Avatar-Skip: Reel/Übung/Story/Uebung → continue (warten auf Avatar-Pipeline)
        - Multi-Item-Bremse: return results.slice(0, 1)
        - Routing: _branch = 'feed' (avatar-Branch existiert architektonisch, ist aber leer)
        │
        ▼
[Switch: Feed/Avatar]   → feed-Branch
        │
        ▼
[Code: Caption-Prompt bauen]   nach Post-Typ
        │
        ▼
[Anthropic: Claude]   claude-sonnet-4-6, generiert Caption + Hashtags
        │
        ▼
[Code: HWG-Filter]   prüft auf "heilt", "kuriert", "garantiert", ...
        │  bei Treffer: status=Geblockt + Teams-Alert
        ▼
[Code: HTML-Template befüllen]   Layout v12 (Standard.html)
        │
        ├──► [HTTP: Gotenberg IG]   1080×1350 PNG
        │       │
        │       ├──► [SP: IG-Bild hochladen]   SP-Library (Audit)
        │       │
        │       └──► [Code: IG → GitHub Body]
        │              │
        │              ▼
        │           [HTTP: GitHub Push IG]
        │              PUT /repos/twaese/Physio-Fuchs-Social-Media-Automation/
        │                  contents/04_Canva-Vorlagen/generated-posts/{id}_ig_{ts}.png
        │              Auth: Bearer $env.GITHUB_TOKEN
        │              Body: { message, content (base64) }
        │              returns: public raw.githubusercontent URL
        │
        └──► [HTTP: Gotenberg FB]   1080×1080 PNG
                │
                ├──► [SP: FB-Bild hochladen]   SP-Library
                │
                └──► [Code: FB → GitHub Body] → [HTTP: GitHub Push FB]
                       analog für FB-Variante
        │
        ▼
[Merge IG + FB Outputs]
        │
        ▼
[Code: SP-Update]   schreibt:
        - field_7  = Hashtags
        - field_8  = GitHub IG URL  ← (neu seit v18.2, ersetzt SP-URL in field_9)
        - field_10 = Caption
        - field_13 = Log-Eintrag
        - Bild_FB_Dateiname = GitHub FB URL
        - field_6 = Bereit
```

---

## Konfiguration

### Env-Vars (`/docker/n8n/.env`)

| Variable | Wert | Verwendung |
|---|---|---|
| `GITHUB_TOKEN` | Fine-grained PAT, Contents:Read+Write | GitHub Push IG/FB |
| `ANTHROPIC_API_KEY` | im n8n Credential | Claude Caption-Call |

⚠️ **Env-File wird nur bei Container-CREATE geladen.** Nach Token-Tausch:
```bash
docker compose up -d --force-recreate n8n
```

### Hardcoded

| Wert | Stelle |
|---|---|
| `claude-sonnet-4-6` | Anthropic-Node Model |
| GitHub-Repo `twaese/Physio-Fuchs-Social-Media-Automation` | GitHub-Push URLs |
| Gotenberg-Sidecar URL `http://gotenberg:3000/forms/chromium/screenshot/url` | Gotenberg-HTTP-Nodes |

### Spalten-Zuordnung in SharePoint (Soll-Stand 2026-05-18)

| SP-Feld (intern) | Anzeigename | Inhalt | Quelle |
|---|---|---|---|
| `field_8` | Bild_Dateiname | GitHub-Raw-URL für IG-Bild | WF-02 Merge |
| `Bild_FB_Dateiname` | Bild_FB_Dateiname | GitHub-Raw-URL für FB-Bild | WF-02 Merge |
| `field_10` | Caption_Variante | **nur Caption-Text**, keine Hashtags | WF-02 Merge |
| `field_7` | Hashtag_Thema | **nur Hashtag-Block** (Leerzeichen-getrennt) | WF-02 Merge |
| `field_6` | Status | `Entwurf` / `Bereit` / `Veröffentlicht` / `Geblockt` | WF-02 / WF-03 |
| `field_13` | Kommentare | Log-History (append-only) | WF-02, WF-03 |

WF-03 v6 hängt für IG `caption + '\n\n' + hashtags` zusammen. FB bekommt nur `caption`, Hashtags als 1. Comment.

### Prompts (Inhalts-Generierung)

| Post-Typ | Prompt-Datei |
|---|---|
| `Standard`, `Tipp`, `FAQ`, `Praxis-News`, `Aktion`, `Behind-the-Scenes`, `Mitarbeiter:in`, `Team`, `Promo`, `Zitat` | `01_Prompts/Caption.md` |
| `Übung`, `Reel`, `Story` | **derzeit übersprungen** (Avatar-Skip im Validate) |

---

## Bild-Hosting: warum GitHub, nicht SharePoint?

**Problem (Sitzung 16.05.):** SharePoint-Library-Bilder sind nicht öffentlich erreichbar — auch nach Tenant- und Site-Sharing auf „Jeder mit Link" verlangt SP einen Login. Meta-Bots können die Bilder nicht laden → IG/FB-Posting schlägt fehl mit „Only photo or video can be accepted as media".

**Lösung (Sitzung 17.05.):** GitHub-Push pro Bild. Das Repo `Physio-Fuchs-Social-Media-Automation` ist public → `raw.githubusercontent.com/.../generated-posts/{id}_ig_{ts}.png` ist garantiert von jedem Bot abrufbar.

**SP-Library bleibt parallel** als Audit-Backup. Beide Uploads passieren in jedem Lauf.

---

## Avatar-Skip (temporär)

Im `Code: Validieren + Weiterleiten` (v18.2):

```javascript
const avatarTypes = ['Reel', 'Übung', 'Story', 'Uebung'];
if (avatarTypes.includes(postTyp)) continue;
const branch = 'feed';
```

→ Reel/Story/Übung-Items werden **nicht verarbeitet**, bleiben im Status `Entwurf`. Sobald Track 2 (D-ID Avatar) bereit ist, wird die `continue`-Zeile entfernt und ein Avatar-Branch via Switch-Node ergänzt.

---

## Multi-Item-Bremse: `slice(0, 1)`

Aktuell verarbeitet WF-02 **1 Item pro Cron-Lauf** (max 1 Post pro Stunde). Grund: die n8n-Expression `$('NodeName').item.json` funktioniert nur bei 1:1-Mapping. Bei Multi-Item-Verarbeitung in parallelen Branches (Gotenberg IG + FB + GitHub-Push + SP-Upload) kann n8n den Item-Kontext nicht eindeutig zuordnen.

**Fix für später (WF-02 v19):** Jeder Code-Node muss `pairedItem: { item: idx }` mitliefern. Dann kann `.slice(0, 1)` entfernt werden und WF-02 verarbeitet alle Entwürfe pro Lauf parallel.

```javascript
// v19-Skeleton
for (let idx = 0; idx < items.length; idx++) {
  const item = items[idx];
  // ... existing logic ...
  results.push({
    json: { _sp_item_id: itemId, _branch: branch, sp_fields: f, ... },
    pairedItem: { item: idx }   // ← KEY für Multi-Item-Modus
  });
}
return results;  // statt results.slice(0, 1)
```

---

## HWG-Filter (Heilmittelwerbegesetz)

Blacklist-Regex auf Caption-Output:
- `heilt`, `kuriert`, `garantiert`
- `schmerzfrei in X Tagen`
- `Wunder`, `100%`
- (vollständige Liste in `01_Prompts/HWG-Blacklist.md`)

Bei Match:
- Status → `Geblockt`
- Teams-Card an Judith mit Caption + Match-Begründung
- Kein weiterer Processing

---

## Versionierung

- `PF_WF-02_Caption_Generator_v18.2.json` — **aktiv**
- v17 — Auto-Release-Variante (vor Gotenberg-Pipeline)
- v16 — vor Auto-Release

Roadmap:
- **v19** — paired-items + Multi-Item-Modus (siehe oben)
- **v20** — Avatar-Branch live (sobald D-ID integriert ist)

---

## Bekannte Quirks (Lessons Learned 2026-05-16/17)

1. **GitHub-Push 401**: nach Token-Tausch in `.env` zwingend `docker compose up -d --force-recreate n8n` (restart reicht NICHT)
2. **`.item` vs `.first()`**: Nodes mit mehreren Input-Branches müssen `.first()` verwenden. Im `Code: Merge + Update-Payload` waren die GitHub-Push-Lookups auf `.item` — schlugen still fehl, igUrl/fbUrl wurden leer geschrieben, Log zeigte `IG✗/FB✗`. **2026-05-18 gefixt:** alle Refs auf `.first()` + `console.log` im catch statt stummem Schlucken.
3. **Umlauten in Node-Namen**: ASCII-only nutzen (verhindert „Knoten existiert nicht"-Fehler in Expressions)
4. **field_8 vs field_9**: GitHub-URL landet in `field_8` (Text-Typ, aktive Spalte), nicht `field_9` (Hyperlink-Typ alt). Bis 2026-05-18 schrieb der Merge-Code fälschlich nach `field_9` → field_8 blieb leer → User musste manuell nachtragen. **Gefixt:** `payload.field_8 = igUrl;`. WF-03 v6 FilterKZ liest beide mit Fallback, deshalb Altdaten kompatibel.
5. **Send Body bei Query-Parameter-Calls**: explizit AUS, sonst landet `fieldsBelow` als Müll-String im Body
6. **Hashtag-Dopplung in IG-Caption** (2026-05-18 gefixt): Merge-Code schrieb `field_10 = caption + '\n\n' + hashtags`. Dann hat WF-03 FilterKZ nochmal `caption_with_hashtags = field_10 + '\n\n' + field_7` gebaut → Hashtags doppelt auf IG. **Fix:** `field_10` enthält nur die reine Caption (`captionPure = f.caption`), Hashtags landen nur in `field_7`. WF-03 hängt sie für IG genau einmalig dran. Trennung: `field_10` = Caption, `field_7` = Hashtag-Block.

---

## Verwandte Dateien

- `01_Prompts/Caption.md` (Caption-Prompt)
- `01_Prompts/HWG-Blacklist.md` (Heilmittelwerbe-Filter)
- `02_n8n-Workflows/Gotenberg-Setup.md` (HTML→PNG-Sidecar)
- `02_n8n-Workflows/WF-03_Social-Media-Post.md` (Nachfolger-Workflow)
- `04_Canva-Vorlagen/html-templates/instagram/PF_Feed_Standard.html` (live template v12)
- `04_Canva-Vorlagen/html-templates/facebook/PF_Feed_FB_Standard.html` (live template)
