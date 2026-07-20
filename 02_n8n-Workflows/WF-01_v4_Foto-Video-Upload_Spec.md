# WF-01 v4 Spec - Foto- und Video-Upload ueber "Content einreichen"

Stand: 2026-06-12

Status: Spezifikation, noch nicht live

SharePoint-Vorbereitung:

- Status-Choice `Video eingegangen` wurde am 2026-06-12 ergaenzt.
- Kein zusaetzlicher Post-Typ `Video` noetig; der sichtbare Formularbutton `Video` speichert intern als `Reel`.

Basis:

- `physio_fuchs_form_v4_video_upload.html`
- `PF_WF-01_v2_Konsolidiert.json`
- `WF-01_v3_Foto-Upload_Vorschlag.md`
- `FORMULAR_VIDEO_UPLOAD_KONZEPT.md`

## Ziel

Judith nutzt nur noch die Webseite "Content einreichen". Dort kann sie Foto-/Feed-Posts und Rohvideos fuer Reels, Stories oder Uebungen einreichen.

Die bestehende Foto-Automation bleibt erhalten. Video-Uploads werden in einen separaten Video-Prozess geroutet, damit WF-02/WF-03 nicht versehentlich doppelt oder falsch posten.

## Neue Formularversion

Datei:

`05_Workflows_Automation/Formulare_HTML/physio_fuchs_form_v4_video_upload.html`

Webhook-Testpfad im Formular:

`/webhook/sharepoint-content-v4-test`

Das Formular sendet `multipart/form-data`:

- `payload`: JSON mit Textfeldern
- `foto`: optionales Foto
- `video`: optionales Video

## Relevante Payload-Felder

| Feld | Bedeutung |
| --- | --- |
| `Post_Typ` | Standard, Tipp, FAQ, Reel, Story, Uebung usw. |
| `Thema` / `Title` | Thema und SharePoint-Titel |
| `Content_Brief` | Briefing fuer KI/Caption |
| `Hashtag_Thema` | thematische Kategorie |
| `Material_Typ` | `foto`, `video`, `stock`, `kein_upload` |
| `Foto_Quelle` | altes Feld, bleibt fuer Kompatibilitaet |
| `Video_Hinweis` | Hinweise fuer Schnitt/Caption |
| `Ton_enthaelt_Sprache` | Datenschutz-/Tonhinweis |
| `Personen_sichtbar` | Datenschutz |
| `Einverstaendnis_vorhanden` | Freigabe |
| `Status` | `Entwurf` oder `Video eingegangen` |
| `_workflowZiel` | `foto-feed-post` oder `video-reel-story` |

## WF-01 v4 Zielablauf

```text
Webhook multipart/form-data
  |
  v
Payload aus body.payload parsen
  |
  v
Pflichtfelder pruefen
  |
  v
SharePoint-Item erstellen
  |
  +-- Material_Typ = foto
  |     Foto speichern: Content_Socialmedia/Fotos/{year}/
  |     Status: Entwurf
  |     Teams: Foto-Eingang bestaetigen
  |
  +-- Material_Typ = video
        Projektordner anlegen:
        Content_Socialmedia/Reels_Stories/YYYY-MM-DD_ITEMID_slug/
        Video speichern:
        01_Rohmaterial/
        Status: Video eingegangen
        Teams: Video-Eingang bestaetigen
```

## Wichtig fuer Sicherheit

- Video-Items duerfen nicht als `Bereit` in WF-03 landen.
- WF-03 v6 ist aktuell Foto-Posting und erwartet Bild-URLs.
- Video-Items bekommen deshalb `Status = Video eingegangen`.
- Caption/Hashtags fuer Videos sollen spaeter durch einen separaten Workflow erzeugt werden, z. B. `WF-05 Reel Caption Generator`.
- Der sichtbare Formularbutton `Video` speichert intern als `Post_Typ = Reel`, damit in SharePoint kein zusaetzlicher Choice-Wert `Video` noetig ist.

## Dateinamen fuer Video

Empfohlenes Schema:

```text
PF_{year}_{itemId-3stellig}_{slug}_raw.{ext}
```

Beispiel:

```text
PF_2026_010_bewegungsanalyse_raw.mov
```

Projektordner:

```text
Content_Socialmedia/Reels_Stories/2026-06-13_PF-2026-010_bewegungsanalyse/
```

## Teams-Bestaetigung

### Video

```html
<h2>Neues Rohvideo eingegangen</h2>
<p><b>Item-ID:</b> 10<br>
<b>Thema:</b> Bewegungsanalyse<br>
<b>Status:</b> Video eingegangen</p>
<p>Das Video wurde im Reel-/Story-Projektordner gespeichert. Caption, Schnittidee und Canva-Briefing werden separat vorbereitet.</p>
```

### Foto

Bestehende v3-Logik beibehalten.

## Naechste Implementierungsschritte in n8n

1. Bestehenden WF-01 v2 exportieren und als Backup behalten.
2. Neuen Workflow `PF WF-01 v4 Foto Video Upload` importieren oder duplizieren.
3. Webhook auf `sharepoint-content-v4-test` setzen.
4. Multipart-Parsing fuer `payload`, `foto`, `video` einbauen.
5. Erst mit Test-SharePoint-Item testen.
6. Erst danach produktiven Webhook im Formular setzen.

## Kein Live-Schalten ohne Test

Vor Produktivstellung pruefen:

- Foto ohne Upload
- Foto mit Upload
- Reel mit MOV
- Story mit MP4
- sichtbare Personen ohne Einverstaendnis blockiert clientseitig
- Video-Item bleibt bei `Video eingegangen` und wird nicht von WF-03 gepostet
