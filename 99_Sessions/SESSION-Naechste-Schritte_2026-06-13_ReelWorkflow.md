# SESSION-Naechste-Schritte 2026-06-13 - Reel-Workflow

Stand: 2026-06-13, 10:27 CEST

## Kurzstatus

Der Physio-Fuchs-Workflow fuer Foto- und Videoeinreichungen ist grundsaetzlich lauffaehig. Das HTML-Formular ist live auf Hostinger erreichbar, Foto- und Video-Uploads laufen ueber WF-01 in die SharePoint-Liste, WF-05 erzeugt fuer Videoeintraege automatisch Caption/CTA/Hashtags, und WF-06 wurde bis zum Preflight fuer freigegebene Reels getestet.

Wichtig: Ein echtes automatisches Posting auf Instagram/Facebook wurde noch nicht final freigeschaltet. WF-06 soll vorerst kontrolliert getestet werden.

## Aktive/live Komponenten

- Live-Formular:
  `https://gt-assistent.srv1099163.hstgr.cloud/content-form.html`
- Hostinger-Webroot:
  `/docker/gt-ui/html`
- Oeffentlicher Reel-Ordner auf Hostinger:
  `/docker/gt-ui/html/videos/reels/2026/`
- Getestete oeffentliche MP4-URL:
  `https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/PF_2026-06-13_IMG_7858_reel_final.mp4`
- Canva-Exportordner fuer Judith:
  `Content_Socialmedia/Reels_Stories/00_Canva_Exports_von_Judith/`

## n8n-Workflow-Stand

### WF-01 - Foto/Video Upload

Name in n8n:
`PF WF-01 v4 Foto Video Upload`

Status:
Aktiv/live. Der Workflow nimmt das Formular entgegen und schreibt Eintraege in die SharePoint-Liste.

Hinweis:
Der Teams-Text wurde in n8n manuell angepasst. WF-01 muss nicht neu importiert werden, solange der aktuelle aktive Flow funktioniert.

Lokale JSON:
`Content_Socialmedia/05_Workflows_Automation/n8n-JSON/PF_WF-01_v4_FotoVideoUpload.json`

### WF-05 - Reel Caption Generator

Name in n8n:
`PF WF-05 Reel Caption Generator`

Status:
Importiert und getestet. Bei Videoeintraegen mit `Status = Video eingegangen` erzeugt der Workflow Caption, CTA, Hashtags und Kommentare. Danach wird `Status = KI-Texte fertig` gesetzt.

Der Workflow hat zusaetzlich eine Teams-Meldung:
`Teams: Reel-Texte fertig melden`

Lokale JSON:
`Content_Socialmedia/05_Workflows_Automation/n8n-JSON/PF_WF-05_Reel_Caption_Generator.json`

### WF-06 - Reel Posting

Name in n8n:
`PF WF-06 Reel Posting`

Status:
Importiert und bis Preflight getestet. Der Preflight liefert `_wf06_ready = true`, wenn alle Freigabebedingungen stimmen, und `_wf06_ready = false`, wenn etwas fehlt.

Voraussetzungen fuer Preflight true:

- `Status = Reel freigegeben`
- `Freigabe_Person = Judith`
- Caption/Hashtags vorhanden
- `Video_Public_URL` vorhanden und oeffentlich erreichbar
- URL endet auf `.mp4` oder `.mov`
- Veroeffentlichungsdatum/Uhrzeit liegen nicht in der Zukunft
- Bei sichtbaren Personen ist Einverstaendnis dokumentiert

Der Workflow hat zusaetzlich eine Teams-Meldung:
`Teams: Reel veroeffentlicht melden`

Wichtig:
WF-06 noch nicht als unkontrollierten Live-Posting-Automatismus laufen lassen. Erst mit einem bewussten Testeintrag vollstaendig pruefen.

Lokale JSON:
`Content_Socialmedia/05_Workflows_Automation/n8n-JSON/PF_WF-06_Reel_Posting.json`

## Getesteter Reel-Fall IMG_7858

Finaler Canva-Export:
`Content_Socialmedia/Reels_Stories/2026-06-13_IMG_7858/05_Export_fertig/PF_2026-06-13_IMG_7858_reel_final.mp4`

Oeffentliche Hostinger-URL:
`https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/PF_2026-06-13_IMG_7858_reel_final.mp4`

HTTP-Test:
Die URL antwortet mit `HTTP/2 200`, `Content-Type: video/mp4`.

## SharePoint-Regeln

Judith soll in der Regel die Freigabe fuer Reels setzen.

Empfohlener Ablauf in der SharePoint-Liste:

1. Neuer Videoeintrag kommt ueber das Formular rein.
2. Status steht auf `Video eingegangen`.
3. WF-05 erzeugt Texte und setzt Status auf `KI-Texte fertig`.
4. Video wird in Canva bearbeitet.
5. Finales MP4 wird oeffentlich auf Hostinger abgelegt.
6. Die oeffentliche MP4-Adresse wird in der SharePoint-Liste dokumentiert, aktuell im Feld `Kommentare` als Zeile:
   `Video_Public_URL: https://...mp4`
7. Judith prueft Inhalt, Caption und Datenschutz.
8. Judith setzt:
   `Freigabe_Person = Judith`
   und `Status = Reel freigegeben`
9. WF-06 darf erst dann posten bzw. im Test bis Preflight weiterlaufen.

## Judith-Ablauf

Judith soll nur die fachlichen und Canva-nahen Schritte sehen:

- Content ueber das Formular einreichen
- Bei Bedarf Video in Canva bearbeiten
- Finales MP4 exportieren
- Export in OneDrive ablegen unter:
  `Content_Socialmedia/Reels_Stories/00_Canva_Exports_von_Judith/`
- Caption/Hashtags pruefen
- Freigabe in SharePoint setzen

Judith soll nicht direkt Hostinger, n8n, technische URLs oder Meta-API-Schritte bearbeiten.

## Thomas/Codex-Technikablauf

Wenn Judith ein finales Canva-Video bereitstellt:

1. Datei sinnvoll benennen:
   `PF_YYYY-MM-DD_KURZTHEMA_reel_final.mp4`
2. Auf Hostinger hochladen nach:
   `/docker/gt-ui/html/videos/reels/2026/`
3. Rechte setzen:
   `chmod 644 /docker/gt-ui/html/videos/reels/2026/DATEINAME.mp4`
4. Public URL pruefen:
   `curl -I https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/DATEINAME.mp4`
5. In SharePoint-Kommentar ergaenzen:
   `Video_Public_URL: https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/DATEINAME.mp4`
6. WF-06 Preflight pruefen.
7. Erst nach bewusstem Go den kompletten Posting-Schritt laufen lassen.

## Teams-Benachrichtigungen

Empfohlen und teilweise bereits umgesetzt:

- WF-01: Eingang melden
- WF-05: Reel-Texte fertig melden
- WF-06: Reel veroeffentlicht melden

Teams-Konfiguration in n8n jeweils pruefen:

- Credential: `PF Microsoft Teams account`
- Team: `Physio Fuchs Administration`
- Kanal: `Socialmedia`
- Inhaltstyp: `HTML`

## Wichtige Dokumente

- Hauptdokumentation:
  `Content_Socialmedia/05_Workflows_Automation/n8n-Dokumentation/README_CODEX_VIDEO_WORKFLOW.md`
- Betriebsanleitung:
  `Content_Socialmedia/05_Workflows_Automation/n8n-Dokumentation/VIDEO_REEL_BETRIEBSANLEITUNG.md`
- Judith-Ablauf:
  `Content_Socialmedia/05_Workflows_Automation/n8n-Dokumentation/VIDEO_REEL_ABLAUF_JUDITH.md`
- Thomas-Technikablauf:
  `Content_Socialmedia/05_Workflows_Automation/n8n-Dokumentation/VIDEO_REEL_TECHNIKABLAUF_THOMAS.md`
- Teams-Benachrichtigungen:
  `Content_Socialmedia/05_Workflows_Automation/n8n-Dokumentation/TEAMS_BENACHRICHTIGUNGEN_SOCIALMEDIA.md`
- WF-05 Doku:
  `Content_Socialmedia/05_Workflows_Automation/n8n-Dokumentation/WF-05_Reel-Caption-Generator.md`
- WF-06 Doku:
  `Content_Socialmedia/05_Workflows_Automation/n8n-Dokumentation/WF-06_Reel-Posting.md`

## Naechste sinnvolle Schritte

1. WF-05 mit einem echten neuen Videoeintrag beobachten:
   Pruefen, ob Caption/Hashtags sauber gefuellt werden und die Teams-Meldung ankommt.

2. Judith-Export einmal praktisch durchspielen:
   Finales Canva-MP4 in `00_Canva_Exports_von_Judith` ablegen lassen.

3. Hostinger-Upload als festen Mini-Prozess testen:
   Upload, `chmod 644`, `curl -I`, URL in SharePoint-Kommentar.

4. WF-06 nur bis Preflight ausfuehren:
   Sicherstellen, dass genau ein freigegebener Reel-Kandidat durchkommt.

5. Vor echtem Posting entscheiden:
   Soll WF-06 manuell gestartet bleiben oder mit Schedule laufen?

6. Erst danach Meta-Posting live testen:
   Ein bewusst freigegebenes Reel posten, Ergebnis in Instagram/Facebook pruefen, SharePoint-Status auf `Veroeffentlicht` pruefen.

## Bekannte Caveats

- `Video_Public_URL` darf keine private SharePoint-/OneDrive-Datei sein. Meta braucht eine oeffentlich abrufbare MP4/MOV-URL.
- Facebook-Teil ist technisch ein Facebook Page Video, nicht zwingend ein echter Facebook Reel.
- Der Workflow darf nicht doppelt aktiv sein. Alte Versionen nur archivieren, wenn der neue Workflow aktiv und getestet ist.
- OneDrive-JSONs sind die Quelle der Wahrheit fuer WF-05 und WF-06.
- WF-01 nicht ohne Grund neu importieren, weil der aktive n8n-Flow manuell angepasst wurde.
