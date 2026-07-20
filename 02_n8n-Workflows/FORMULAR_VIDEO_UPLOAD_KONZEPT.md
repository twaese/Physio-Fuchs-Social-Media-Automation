# Konzept: Video-Upload ueber "Content einreichen"

Stand: 2026-06-12

Ziel: Judith soll nur die bekannte Webseite `Content einreichen` nutzen. Sie soll dort sowohl Foto-/Feed-Posts als auch Rohvideos fuer Reels/Stories einreichen koennen, ohne OneDrive-, Canva-, SharePoint- oder n8n-Details kennen zu muessen.

## Grundprinzip

Eine Oberflaeche, zwei Pfade:

```text
Content einreichen
  |
  +-- Foto-/Feed-Post
  |     -> bestehende WF-01/WF-02/WF-03 Foto-Pipeline
  |
  +-- Reel/Story/Video
        -> neuer Video-Eingang
        -> Rohvideo speichern
        -> KI-Briefing/Caption vorbereiten
        -> Canva-Bearbeitung
        -> Finalexport
        -> Postingbereit
```

Judith sieht nur:

- Content-Typ
- Thema
- Content-Brief
- geplantes Datum/Uhrzeit
- optional Foto oder Video
- Datenschutz-/Einverstaendnis-Abfrage
- Hinweise zu Ton und Personen

Alles andere passiert im Workflow.

## Formular-Erweiterung

Bestehende Datei:

`05_Workflows_Automation/Formulare_HTML/physio_fuchs_form_v3_foto_upload.html`

Diese Datei sollte zu einer kombinierten Version weiterentwickelt werden, z. B.:

`physio_fuchs_form_v4_video_upload.html`

### Neue oder erweiterte Felder

| Feld | Typ | Sichtbar bei | Zweck |
| --- | --- | --- | --- |
| `Post_Typ` | Karten/Radio | immer | `Standard`, `Tipp`, `FAQ`, `Reel`, `Story`, `Uebung` |
| `Thema` | Text | immer | Hauptthema |
| `Content_Brief` | Textarea | immer | Inhaltliche Idee |
| `Veroeffentlichungsdatum` | Datum | immer | Planung |
| `Uhrzeit` | Uhrzeit | immer | Planung |
| `Material_Typ` | Radio | immer | `kein_upload`, `foto`, `video` |
| `Foto_Upload` | Datei | Foto | JPG/PNG/WebP |
| `Video_Upload` | Datei | Video/Reel/Story | MP4/MOV |
| `Video_Hinweis` | Textarea | Video | Was ist im Video wichtig? |
| `Ton_enthaelt_Sprache` | Radio | Video | Datenschutz/Tonpruefung |
| `Personen_sichtbar` | Radio | Foto/Video | Datenschutz |
| `Einverstaendnis_vorhanden` | Checkbox | wenn Personen sichtbar | Absende-Sperre ohne Einverstaendnis |
| `Canva_erforderlich` | hidden/default | Video | ja |

## UI-Regeln

- Wenn `Post_Typ = Reel` oder `Story`, wird `Video_Upload` sichtbar.
- Wenn `Material_Typ = video`, wird `Video_Upload` Pflichtfeld.
- Wenn Personen sichtbar sind und kein Einverstaendnis bestaetigt wurde, darf das Formular nicht absenden.
- Bei Video sollte clientseitig ein Limit angezeigt werden, z. B. MP4/MOV, max. 500 MB.
- Judith bekommt nach Absenden eine einfache Bestaetigung: "Video ist angekommen. Wir bereiten das Reel vor."

## Technische Umstellung

Das Formular muss fuer Datei-Uploads `multipart/form-data` senden.

Der bestehende JSON-Webhook reicht fuer reine Textdaten, aber nicht fuer Rohvideos.

Schema:

```javascript
const formData = new FormData();
formData.append("payload", JSON.stringify(buildPayload()));

if (fotoFile) {
  formData.append("foto", fotoFile);
}

if (videoFile) {
  formData.append("video", videoFile);
}

await fetch(N8N_WEBHOOK_URL, {
  method: "POST",
  body: formData
});
```

Wichtig: keinen `Content-Type`-Header manuell setzen.

## n8n-Organisation

Nicht die produktive Foto-Pipeline kaputt umbauen.

Empfohlene Versionierung:

- `WF-01 v2`: aktiv, bestehendes Formular ohne Datei-Upload
- `WF-01 v3`: Foto-Upload, bereits als Vorschlag dokumentiert
- `WF-01 v4`: Foto + Video Upload
- `WF-05`: Reel Caption/Briefing Generator
- `WF-06`: Reel Posting oder Posting-Vorbereitung

## WF-01 v4 Ablauf

```text
[Webhook multipart/form-data]
        |
        v
[Payload lesen + validieren]
        |
        v
[SharePoint-Item erstellen: Status Entwurf]
        |
        +-- Foto -> Foto speichern -> Foto-Pipeline
        |
        +-- Video -> Video speichern -> Status Video eingegangen
        |
        v
[Teams-Bestaetigung an Judith/Thomas]
```

## Ablage fuer Videos

Automatisch erzeugter Projektordner:

```text
Content_Socialmedia/Reels_Stories/
  YYYY-MM-DD_ITEM-ID_THEMENSLUG/
    01_Rohmaterial/
    02_Auswahl_Standbilder/
    03_Canva/
    04_Captions_Texte/
    05_Export_fertig/
```

Beispiel:

```text
Content_Socialmedia/Reels_Stories/
  2026-06-13_PF-2026-010_bewegungsanalyse/
```

Der Upload landet in:

`01_Rohmaterial/`

## Statusmodell fuer Video

Empfohlen fuer SharePoint oder `posting_ready.json`:

```text
Entwurf
Video eingegangen
Analyse offen
Analyse fertig
Canva offen
Canva fertig
KI-Texte fertig
Freigabe offen
ready_to_post
posted
archiviert
```

Wichtig: Die alte Foto-Pipeline nutzt `Bereit` und `Veröffentlicht`. Fuer Videos sollte anfangs bewusst ein anderer Status oder eigener Workflow genutzt werden, damit WF-03 nicht versehentlich anspringt.

## KI fuer Caption und Hashtags

Die KI sollte nicht nur aus dem Upload-Dateinamen arbeiten, sondern aus strukturierten Informationen:

- Thema
- Content-Brief
- Video-Hinweis von Judith
- automatisch erzeugte Shotlist
- Text-Overlays
- Tonalitaet Physio Fuchs
- HWG-Blacklist

Output der KI:

```json
{
  "caption": "...",
  "cta": "...",
  "hashtags": ["#physiofuchs", "#physiotherapie"],
  "story_teaser": "...",
  "alt_text": "...",
  "hwg_check": "ok"
}
```

Dieser Output wird in `posting_ready.json` und optional SharePoint gespeichert.

## Was Judith sieht

Judith sieht nur die Webseite:

1. Content-Typ auswaehlen.
2. Thema eingeben.
3. Kurz beschreiben, was gezeigt/gesagt werden soll.
4. Foto oder Video hochladen.
5. Datenschutz/Einverstaendnis bestaetigen.
6. Absenden.

Danach bekommt sie nur eine Bestaetigung, keine Ordner- oder Workflow-Anweisungen.

## Was intern passiert

- SharePoint-Item wird erzeugt.
- Datei wird gespeichert.
- Teams informiert Thomas/Judith.
- Bei Foto laeuft die bestehende Foto-Pipeline.
- Bei Video startet der neue Video-Prozess.
- Codex/Automation bereitet Schnitt, Canva-Briefing, Caption, Hashtags und Postingdaten vor.

## Sicherheitsregeln

- Bestehende WF-02/WF-03 Foto-Workflows nicht direkt fuer Videos umbauen.
- Video-Items duerfen nicht mit Status `Bereit` in WF-03 landen, solange WF-03 nur Foto-Posting kann.
- Erste Video-Automation immer als Draft und manuell testen.
- Erst nach erfolgreichem Test Cron aktivieren.
- Jeder Video-Post braucht Statuswechsel auf `posted`, damit nichts doppelt laeuft.
