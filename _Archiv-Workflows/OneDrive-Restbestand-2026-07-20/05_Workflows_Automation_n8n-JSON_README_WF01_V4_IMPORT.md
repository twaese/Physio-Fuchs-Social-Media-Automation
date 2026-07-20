# Importhinweis: PF WF-01 v4 Foto Video Upload

Stand: 2026-06-12

Workflow-Datei:

`PF_WF-01_v4_FotoVideoUpload.json`

Workflow-Name in n8n:

`PF WF-01 v4 Foto Video Upload`

Status:

Importdatei, `active: false` als Sicherheit

Webhook:

`POST /webhook/sharepoint-content-v4-test`

## Zweck

Dieser Workflow nimmt das neue Formular v4 entgegen:

- `payload` als JSON in `multipart/form-data`
- optional `foto`
- optional `video`

Foto-Posts gehen weiter in die bestehende Foto-Pipeline. Video-/Reel-/Story-/Uebung-Uploads werden separat als Video-Eingang behandelt.

## Wichtige Sicherheitshinweise vor dem Test

1. Bestehenden produktiven WF-01 nicht ueberschreiben.
2. Workflow in n8n importieren, aber nicht aktivieren.
3. Manuell mit Testdaten ausfuehren.
4. Erst nach erfolgreichen Tests den Formular-Deploy gegen diesen Webhook testen.

## SharePoint-Choice-Hinweise

Der Workflow setzt fuer Video-Uploads:

`field_6 = Video eingegangen`

Status-Choice wurde am 2026-06-12 in SharePoint ergaenzt.

Das Formular hat ausserdem einen sichtbaren Button `Video`. Dieser speichert intern als `Post_Typ = Reel`, damit in SharePoint kein zusaetzlicher Choice-Wert `Video` noetig ist.

## Erwartete Tests

- Standard + Foto hochladen
- Tipp + Foto hochladen
- Reel + MOV hochladen
- Story + MP4 hochladen
- Video + MP4 hochladen; erwartet wird `Post_Typ = Reel`
- sichtbare Personen ohne Einverstaendnis blockiert bereits im Formular

## Nicht produktiv schalten, bevor

- Foto-Test erfolgreich in SharePoint ankommt
- Video-Test erfolgreich in SharePoint/Dateiablage ankommt
- Teams-Meldung korrekt ist
- kein Video-Item in WF-03 Foto-Posting laufen kann
