# Deploy: Content-Formular v4

Stand: 2026-06-12

Live-URL:

`https://gt-assistent.srv1099163.hstgr.cloud/content-form.html`

## Bestand

Die aktuell live erreichbare Seite wurde lokal gesichert als:

`content-form_LIVE_BACKUP_2026-06-12.html`

Die neue v4-Deploy-Datei liegt hier:

`content-form.html`

## Was neu ist

- Reel- und Video-Einreichung
- Foto-/Video-Materialauswahl mit automatischer Vorauswahl
- MP4/MOV-Upload
- Video-Hinweis fuer Schnitt/KI/Canva
- Tonhinweis
- Datenschutz-/Einverstaendnis-Sperre
- Payload-Feld `Material_Typ`
- Video-Status `Video eingegangen`
- Routing-Feld `_workflowZiel`

## Wichtiger Webhook-Hinweis

Die v4 zeigt aktuell auf:

`https://n8n.srv1099163.hstgr.cloud/webhook/sharepoint-content-v4-test`

SharePoint ist vorbereitet:

- Status-Choice `Video eingegangen` ist ergaenzt.
- Kein zusaetzlicher Post-Typ `Video` noetig, da der Button intern als `Reel` speichert.

Vor Produktivstellung muss in n8n ein passender Test-Workflow existieren:

`PF WF-01 v4 Foto Video Upload`

Wenn die v4 direkt live hochgeladen wird, ohne dass dieser Webhook existiert, kann Judith das Formular zwar oeffnen, aber Absenden wird fehlschlagen.

## Sichere Reihenfolge

1. In n8n Draft-Workflow fuer `/webhook/sharepoint-content-v4-test` anlegen.
2. `content-form.html` aus diesem Ordner testweise hochladen.
3. Test im Browser:
   - Standard -> Foto hochladen
   - Tipp -> Foto hochladen
   - Reel -> Video hochladen
   - Video -> Video hochladen
   - Story -> Video hochladen
   - Personen sichtbar ohne Einverstaendnis blockiert
4. Wenn Tests sauber sind, Teams-Webseitenregister weiterhin auf die gleiche Live-URL zeigen lassen:
   `https://gt-assistent.srv1099163.hstgr.cloud/content-form.html`

## Rollback

Falls etwas nicht funktioniert:

`content-form_LIVE_BACKUP_2026-06-12.html`

wieder als:

`content-form.html`

auf den Webserver laden.
