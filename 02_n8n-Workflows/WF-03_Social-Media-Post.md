# WF-03 – Social Media Post (Grafik, Freigabe, Posting)

**JSON:** `PF_WF-03_Social_Media_Post_v4.json` (Root, aktive Version)
**Trigger:** Schedule + Status-getriebene Branches
**Status-Effekte:**
- Phase A setzt `Bereit` (sobald Caption + Grafik vollständig)
- Phase C setzt `Geplant` (nach Posting-Planung bei Meta)
- Phase D setzt `Veröffentlicht` (nach Live-Check)
- Freigabe-Webhook kann `Bereit → Entwurf` zurücksetzen (Änderungswunsch)

---

## Zweck

WF-03 macht aus einem Eintrag mit fertiger Caption einen veröffentlichungs­
fähigen Post:

1. **Grafik / Reel** in Canva erzeugen oder befüllen
2. **Vorschau-Link** in `field_9` speichern
3. **Freigabe-Card** in Teams an Judith senden
4. Bei Freigabe: **Posting-Planung** über Meta Graph API
5. Veröffentlichung tracken, Post-IDs speichern

---

## Drei Phasen

### Phase A – Grafik-Erzeugung
Trigger: Schedule oder Re-Run, Filter:
`field_6 = Entwurf` UND `field_10` befüllt UND `field_9` leer

```
[A1] SP: Items lesen
[A2] Switch nach Post-Typ:
        - "Übung" → Canva-Template "PF_Feed_Uebung" (Format „Übung der Woche")
        - "Story"           → Canva-Template "PF_Story_Standard"
        - "Reel"            → Reel-Skript-Renderer (siehe Phase A')
        - sonst             → Canva-Template "PF_Feed_Standard"
[A3] Canva Connect API: Design erzeugen / befüllen
       - Platzhalter ersetzen: {Hook}, {Body}, {CTA}, {Datum}
       - Logo-Asset wird automatisch eingebunden
[A4] Vorschau-URL extrahieren → field_9
[A5] Vollständigkeits-Check:
       field_7 ≠ leer UND field_9 ≠ leer UND field_10 ≠ leer ?
       → ja: field_6 = "Bereit"
       → nein: field_6 bleibt "Entwurf"
[A6] SP: Item update
```

### Phase A' – Reel-Erzeugung (optional, ab Roadmap-Phase 3)
Wenn Post-Typ `Reel` und Sprecher = `Judith Avatar`:

```
[A'1] OneDrive/SP: Avatar-Skript .txt ablegen
[A'2] HTTP-Node → Avatar-Tool (HeyGen/Synthesia/D-ID)
[A'3] Polling, bis MP4 fertig
[A'4] MP4 nach SharePoint/OneDrive
[A'5] field_9 = MP4-Link, field_13 += "Reel-Render: ok"
```

### Phase B – Freigabe
Trigger: Items mit `field_6 = Bereit`

```
[B1] SP: Items lesen, Filter field_6 = "Bereit"
[B2] Auto-Release-Check (NEU, Sonderregel für Standard-Posts):
       Wenn field_2 ∈ Standard-Post-Typen
            UND field_13 enthält "[AUTO_RELEASE]"
            UND REQUIRE_APPROVAL_FOR_STANDARD == false
       → direkt: field_6 = "Freigegeben"
       → field_13 += "[AUTO_RELEASE confirmed by WF-03 at {ts}]"
       → KEINE Teams-Card, weiter zu Phase C
       Sonst → Pfad B3 (manuelle Freigabe).
[B3] Code: Freigabe-Text aus Prompt 01_Prompts/Freigabe-Judith.md
[B4] Teams: Adaptive Card senden
       - Buttons: "Freigeben" / "Änderung wünschen" / "Verschieben"
       - Action.Submit → Webhook /pf-wf03-freigabe
[B5] Wartet auf Webhook-Antwort (separater Sub-Workflow)
       - "Freigeben" → field_6 = "Freigegeben"
       - "Änderung" → field_6 = "Entwurf", field_13 += Kommentar,
                       WF-02 re-trigger (loopt zurück)
       - "Verschieben" → field_4 update, field_6 bleibt "Bereit"
```

**Standard-Post-Typen für Auto-Release** (alle außer `Übung`, `Reel`, `Story`):
`Standard`, `Tipp`, `Zitat`, `FAQ`, `Praxis-News`, `Aktion`,
`Mitarbeiter:in`, `Behind-the-Scenes`, `Team`, `Promo`.

**Reels, Stories und `Übung` gehen IMMER über B3/B4/B5** –
unabhängig vom `[AUTO_RELEASE]`-Marker. Sicherheitsregel.

### Phase C – Posting
Trigger: Items mit `field_6 = Freigegeben`

```
[C1] SP: Items lesen, sortiert nach field_4
[C2] Switch nach Plattform (aus Item oder Default):
       - Instagram: /{ig-id}/media → /media_publish
       - Facebook:  /{fb-page-id}/feed (oder /photos)
       - beide:     parallel
[C3] Meta Graph API:
       - scheduled_publish_time = Unix-Timestamp aus Veröffentlichungsdatum (NUR Datumsanteil!) + Uhrzeit (Textfeld HH:MM), als Berlin-Lokalzeit → UTC
       - access_token: {{META_ACCESS_TOKEN}}
       - WICHTIG: NIE den Zeitanteil aus Veröffentlichungsdatum verwenden — siehe Konvention in 03_SharePoint/Liste-Schema.md
[C4] Container/Post-ID → field_12
[C5] SP: Item update, field_6 = "Geplant"
[C6] Teams: "X Posts geplant"
```

### Phase D – Veröffentlichungs-Check
Trigger: Schedule (alle 30 Min)

```
[D1] SP: Items mit field_6 = "Geplant"
[D2] Meta Graph API: Status checken
[D3] Wenn live: field_6 = "Veröffentlicht", field_12 update mit finaler Post-ID
[D4] Teams: Wochen-Report (Freitag-Abend)
```

---

## Konfigurationspunkte

| Variable                          | Wert / Hinweis                            |
| --------------------------------- | ----------------------------------------- |
| `CANVA_BRAND_KIT_ID`              | Platzhalter, in Canva angelegt            |
| `CANVA_TEMPLATES`                 | siehe `04_Canva-Vorlagen/`                |
| `META_API_VERSION`                | `v19.0` (regelmäßig prüfen)               |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID`   | `{{INSTAGRAM_BUSINESS_ACCOUNT_ID}}`       |
| `FACEBOOK_PAGE_ID`                | `{{FACEBOOK_PAGE_ID}}`                    |
| `META_ACCESS_TOKEN`               | nur in Credential                         |
| `TEAMS_FREIGABE_CHANNEL`          | nur in Credential                         |

---

## Versionierung

- aktive Version im Root: `PF_WF-03_Social_Media_Post_v4.json`
- ältere Versionen v2/v3 ebenfalls im Root – **nicht löschen**, dienen
  als Rollback-Backup, bis v4 stabil läuft (nach Absprache mit Thomas
  in `_Archiv/` verschieben)

---

## Sicherheits-Regeln (zwingend)

- Status `Bereit`, `Geplant` und `Veröffentlicht` werden **ausschließlich**
  durch diesen Workflow gesetzt – nie manuell, nie durch Claude.
- Status `Freigegeben` setzt **nur Judith** – mit folgender **Ausnahme**:
  WF-03 Phase B2 (Auto-Release) darf `Freigegeben` setzen für Standard-
  Feed-Posts (alle Post-Typen außer Reel/Story/Übung), wenn
  `[AUTO_RELEASE]`-Marker in `field_13` vorhanden ist und
  `REQUIRE_APPROVAL_FOR_STANDARD == false`. Diese Sonderregel ist in
  `00_Konzept/Status-Flow.md` und `CLAUDE.md` dokumentiert.
- Reels, Stories und `Übung` gehen **nie** über Auto-Release.
- Vor Phase C **immer** prüfen: `field_6 = Freigegeben`. Sonst Branch stoppen.
- Vor Posting auf Live-Account: optionaler Dry-Run-Modus
  (`DRY_RUN=true` → keine Meta-Calls, nur Log).
- Maximal 2 Posts pro Tag pro Plattform (Spam-Schutz).

---

## Verifikations-Checkliste (vor der nächsten n8n-Session)

Vor jeder größeren Erweiterung muss geprüft werden, ob WF-03 v4 die
folgenden Voraussetzungen bereits erfüllt. Falls nicht: Migrations-Item
für **WF-03 v5** anlegen.

- [ ] Postet WF-03 v4 für die Post-Typen `Standard`, `Tipp`, `FAQ`,
  `Aktion`, `Behind-the-Scenes`, `Mitarbeiter:in`, `Team`, `Promo`,
  `Zitat`, `Praxis-News` zu **beiden** Kanälen (IG + FB)? Oder läuft
  irgendwo ein impliziter Filter, der nur `Übung` durchlässt?
- [ ] Werden Hashtags auf **Facebook** als **erster Kommentar** unter
  dem Post gesetzt (Graph API `/{post-id}/comments`)? Oder kleben sie
  in der Caption? Gemäß `00_Konzept/Feed-Post-Standard.md` Abschnitt 3
  müssen sie auf FB als Kommentar.
- [ ] Funktioniert `scheduled_publish_time` unabhängig vom Post-Typ
  (auch ohne Übung-spezifische Assets)?
- [ ] Greift Phase A5 (`field_6 = Bereit`) korrekt bei allen
  Post-Typen, oder nur wenn ein bestimmtes Canva-Template verwendet
  wird?
- [ ] **Auto-Release (Phase B2):** existiert noch nicht in v4 – muss in
  v5 nachgerüstet werden, wenn WF-04 produktiv geht.
- [ ] **`REQUIRE_APPROVAL_FOR_STANDARD`-Schalter:** in v5 als Sticky-
  Note-Konstante (Default `false`).
- [ ] **Kollisions-Sicherheits-Netz:** Phase C prüft kurz vor
  `scheduled_publish_time`, ob am selben Tag ein anderer Eintrag mit
  Status ≥ `Geplant` existiert (Reel/Story). Wenn ja → Stop +
  Teams-Alarm, weil WF-04 etwas übersehen hat.

Ergebnis dokumentieren in einem Migrations-Item:
`02_n8n-Workflows/WF-03_v5_Migration.md` (anlegen, sobald Punkte oben
geprüft sind).

---

## Verwandte Dateien

- `01_Prompts/Freigabe-Judith.md`
- `04_Canva-Vorlagen/Vorlagen-Uebersicht.md`
- `06_Avatar-Reel-Konzepte/Avatar-Konzept-Judith.md`
- `00_Konzept/Status-Flow.md`
