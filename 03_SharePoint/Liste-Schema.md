# SharePoint-Liste – Schema

**Site:** Physio Fuchs Administration
**Site-URL:** `{{SHAREPOINT_SITE_URL}}`
**Site-GUID:** `{{SHAREPOINT_SITE_GUID}}`
**Listenname:** `PF-Content-Kalender-2026`
**List-GUID:** `{{SHAREPOINT_LIST_GUID}}`

Diese Liste ist die **einzige Quelle der Wahrheit** für alle Posts.
Sie wird aus dem Excel-Export `PF-Content-Kalender-2026.xlsx`
gespeist und wächst durch das HTML-Formular weiter.

---

## Spalten

> **Hinweis Naming:** Die SharePoint-Liste nutzt **sprechende Anzeigenamen**
> (`Post_Typ`, `Status`, `Veröffentlichungsdatum` …). Die in älteren Doku-
> Versionen verwendeten `field_N`-Bezeichnungen sind **nur die internen
> SharePoint-IDs** und in der UI nicht sichtbar. n8n-Workflows greifen über
> die Anzeigenamen / Display-Bindings zu.

| Anzeigename (UI)       | Bisher referenziert als | Typ              | Pflicht | Wer befüllt   |
| ---------------------- | ----------------------- | ---------------- | ------- | ------------- |
| Titel                  | `Title`                 | Text             | ja      | WF-01         |
| Thema                  | `field_1`               | Text             | ja      | WF-01         |
| Post_Typ               | `field_2`               | Choice           | ja      | WF-01         |
| Content_Brief          | `field_3`               | Multiline        | nein    | WF-01         |
| Veröffentlichungsdatum | `field_4`               | **Date** (echtes Datum) | ja  | WF-01 / WF-00 |
| Uhrzeit                | `field_5`               | Text (HH:MM)     | nein    | WF-01 / WF-00 |
| Status                 | `field_6`               | **Choice** (indexiert) | ja  | alle WFs      |
| Hashtag_Thema          | (neu, nicht in alter Doku) | Text          | nein    | WF-01         |
| Hashtags               | `field_7`               | Multiline        | nein    | WF-02         |
| Bild-Dateiname         | `field_8`               | Text             | nein    | WF-01         |
| Vorschau-URL           | `field_9`               | Hyperlink        | nein    | WF-03         |
| Caption                | `field_10`              | Multiline        | nein    | WF-02         |
| Freigabe-Person        | `field_11`              | Text             | ja      | WF-01         |
| Meta_Post_ID           | `field_12`              | Text             | nein    | WF-03         |
| Log                    | `field_13`              | Multiline        | nein    | alle          |

**Zeitzone:** Site-Zeitzone steht seit 2026-05-14 auf
`(UTC+01:00) Amsterdam, Berlin, Bern, Rom, Stockholm, Wien`. Davor PST.
Bestehende Einträge aus der PST-Zeit haben ihre Datums-Anzeige um einen
Kalendertag verschoben — bei den 20 Demo-Einträgen bewusst nicht zurück-
korrigiert, da Test-Daten.

**Indizierte Spalten:** `Status` und `Veröffentlichungsdatum`.

### Konvention: Datum + Uhrzeit getrennt behandeln

`Veröffentlichungsdatum` ist ein **echtes Date-Feld** und enthält
streng genommen einen Datum-Uhrzeit-Wert (intern UTC). Parallel gibt es
das Text-Feld `Uhrzeit` (`HH:MM`).

**Regel für alle Workflows:**

- **Datum** kommt **nur** aus `Veröffentlichungsdatum`, **Datumsanteil only**
  (Zeitanteil verwerfen).
- **Uhrzeit** kommt **nur** aus dem Text-Feld `Uhrzeit`.
- Die Kombination `Datum + Uhrzeit` ist als **lokale Berlin-Zeit** zu
  interpretieren und in einen UTC-Timestamp umzurechnen, bevor sie an
  die Meta Graph API als `scheduled_publish_time` (Unix-Timestamp UTC)
  weitergegeben wird.

**Niemals** den Uhrzeitanteil aus `Veröffentlichungsdatum` als „die
echte Uhrzeit" verwenden — er ist Artefakt aus dem PST→Berlin-Wechsel
und für Altdaten unzuverlässig.

---

## Choice-Werte

### `Post_Typ`

Stand 2026-05-14 (in der Liste):

- `Standard`
- `Tipp`
- `Team`
- `Übung` (deckt das Format „Übung der Woche" ab)
- `Promo`
- `Zitat`
- `Story`
- `FAQ`
- `Aktion`
- `Behind-the-Scenes`
- `Mitarbeiter:in`
- `Praxis-News`
- `Reel`

**Wichtig:** Choice „Kann Werte manuell hinzufügen" ist deaktiviert –
Workflows müssen exakt einen der oben gelisteten Werte schreiben, sonst
weist SharePoint den Eintrag zurück.

### `Status`

- `Entwurf` (Default)
- `Bereit`
- `Freigegeben`
- `Geplant`
- `Veröffentlicht`

Reihenfolge bewusst aufsteigend nach Workflow-Phase. Details zu
Übergängen: `../00_Konzept/Status-Flow.md`.

---

## Empfohlene Ansichten

| Ansicht                  | Filter                              | Sortierung           |
| ------------------------ | ----------------------------------- | -------------------- |
| Kalender 2026            | alle                                | `field_4` aufsteigend|
| Redaktions-Kalender      | alle (Kalender-View, s. u.)         | nach `field_4`       |
| Wartet auf mich (Judith) | `field_6 = Bereit`                  | `field_4`            |
| In Arbeit (n8n)          | `field_6 = Entwurf`                 | `field_4`            |
| Geplant                  | `field_6 = Geplant`                 | `field_4`            |
| Veröffentlicht           | `field_6 = Veröffentlicht`          | `field_4` absteigend |
| Heute                    | `field_4 = HEUTE`                   | `field_5`            |

### Detail: Ansicht „Redaktions-Kalender"

Visuelle Übersicht des Monats für Judith – zeigt, welche Tage durch
Reels/Stories/Übungen belegt sind. WF-04 wählt automatisch einen freien
Tag, der hier sichtbar wird.

- **Ansichtstyp:** Kalender (SharePoint-Bordmittel)
- **Datumsfeld:** `field_4`
  - **Achtung:** `field_4` ist Text im Format `TTMMJJJJ`. Die
    Kalender-Ansicht erwartet ein echtes Date-Feld.
  - **Empfehlung:** zusätzliche Spalte `field_4_date` (Typ: `Date`)
    anlegen, in WF-01 / WF-00 parallel zu `field_4` befüllen. Erst
    danach Kalender-Ansicht aktivieren.
  - Übergangslösung ohne neue Spalte: Listen-Ansicht „Kalender 2026"
    (oben) reicht visuell für den Anfang.
- **Farbkodierung** (über bedingte Spalten-Formatierung auf `field_2`):
  | Post-Typ                    | Farbe          |
  | --------------------------- | -------------- |
  | Übung der Woche             | Grün           |
  | Reel                        | Lila           |
  | Story                       | Orange         |
  | Standard / Tipp / FAQ       | Blau           |
  | Aktion / Praxis-News        | Rot            |
  | Behind-the-Scenes / Team    | Grau           |
- **Hover-Felder:** `field_2` (Typ), `field_6` (Status), `field_11`
  (Freigabe-Person)
- **Filter:** keiner – kompletter Monat sichtbar, inkl.
  `Entwurf` (mit gepflegtem `field_4`) und `Veröffentlicht`.

### Detail: Choice-Wert `Bereit` aktivieren

Falls noch nicht passiert:

1. SharePoint-Liste im Browser öffnen → Spalte `field_6` →
   `Spalteneinstellungen` → `Bearbeiten`.
2. In der Liste der Auswahlmöglichkeiten `Bereit` zwischen `Entwurf`
   und `Freigegeben` einfügen.
3. Speichern. Reihenfolge sollte sein:
   `Entwurf → Bereit → Freigegeben → Geplant → Veröffentlicht`.
4. Spalten-Formatierung gelb für `Bereit` (signalisiert „wartet").

---

## Bearbeitungs-Regeln

- **Niemals** ein bestehendes Item löschen. Stattdessen Status auf
  einen separaten Wert wie `Verworfen` (eigener Choice) setzen –
  oder einen Sub-Status im Kommentarfeld vermerken.
- **Niemals** `Title` / `field_1` nachträglich ändern – das ist die
  ID-Brücke für n8n.
- Manuelle Änderungen werden in `field_13` mit Zeitstempel und Kürzel
  dokumentiert (z. B. `2026-05-14 14:30 J: Caption manuell überarbeitet`).

---

## Verweise

- Felder-Mapping (Formular → SP): `Felder-Mapping.md`
- Berechtigungen: `Berechtigungen.md`
- Status-Flow: `../00_Konzept/Status-Flow.md`
