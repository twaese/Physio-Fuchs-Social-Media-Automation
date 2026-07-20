# Formular v4 Testnotiz

Stand: 2026-06-12

Datei:

`physio_fuchs_form_v4_video_upload.html`

N8N-Testdatei:

`physio_fuchs_form_v4_video_upload_N8N_TEST.html`

Status:

Vorbereitet, noch nicht produktiv live schalten.

SharePoint:

- Status-Choice `Video eingegangen` wurde am 2026-06-12 ergaenzt.
- Der sichtbare Button `Video` speichert intern als `Reel`.

## Was neu ist

- neuer Post-Typ `Reel`
- sichtbarer Button `Video`, der intern als `Reel` gespeichert wird
- Materialauswahl fuer Foto, Video, Stockfoto oder ohne Upload
- Video-Upload fuer MP4/MOV
- Video-Hinweis fuer Schnitt, Hook und KI-Caption
- Tonhinweis `Ton_enthaelt_Sprache`
- Datenschutz-/Einverstaendnis-Sperre bleibt aktiv
- Payload unterscheidet `foto-feed-post` und `video-reel-story`
- Video-Uploads bekommen Status `Video eingegangen`

## Aktueller Test-Webhook

```text
https://n8n.srv1099163.hstgr.cloud/webhook/sharepoint-content-v4-test
```

Dieser Webhook ist fuer spaeteren Produktivbetrieb, wenn der Workflow aktiv ist.

Fuer n8n "Listen for test event" muss die Test-URL verwendet werden:

```text
https://n8n.srv1099163.hstgr.cloud/webhook-test/sharepoint-content-v4-test
```

Dafuer gibt es die separate lokale Datei:

`physio_fuchs_form_v4_video_upload_N8N_TEST.html`

## Testfaelle vor Live-Schaltung

1. Standard-Post ohne Upload
2. Standard-Post mit Foto-Upload
3. Reel mit MOV-Upload
4. Story mit MP4-Upload
5. Uebung mit Video-Upload
6. sichtbare Personen ohne Einverstaendnis muss blockieren
7. Video-Item darf nicht in WF-03 Foto-Posting laufen

## Erwarteter Payload fuer Video

```json
{
  "Post_Typ": "Reel",
  "Material_Typ": "video",
  "Status": "Video eingegangen",
  "_workflowZiel": "video-reel-story"
}
```

Die Videodatei wird separat als Multipart-Feld `video` gesendet.

## Naechster Schritt

In n8n einen neuen Workflow `PF WF-01 v4 Foto Video Upload` anlegen und den Test-Webhook `sharepoint-content-v4-test` bedienen lassen.
