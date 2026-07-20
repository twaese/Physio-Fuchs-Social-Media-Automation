# Sicherheitsplan: Video-/Reel-Automation in n8n

Stand: 2026-06-12

Ziel: Das Canva-finalisierte Reel `2026-06-13_IMG_7858` soll fuer den automatisierten Workflow bereitstehen, ohne die bestehende Foto-Posting-Automation zu ueberschreiben oder doppelte Postings auszuloesen.

## Ergebnis der Bestandspruefung

Vorhandene aktive Workflows:

- `PF_WF-01_v2_Konsolidiert.json`  
  Formular -> SharePoint + Teams.

- `PF_WF-02_Caption_Generator_v18.3.json`  
  Caption + Foto-Branch fuer Feed-/Foto-Posts. Reels, Stories und Uebungen werden aktuell bewusst uebersprungen.

- `PF_WF-03_Social_Media_Post_v6.json`  
  Postet fertige Foto-Items auf Instagram und Facebook. Der Workflow erwartet Bild-URLs, keine lokalen MP4-Dateien.

## Wichtige Erkenntnis

Der bestehende Workflow ist aktuell NICHT fuer Canva-finalisierte Video-Reels geeignet.

Grund:

- WF-02 verarbeitet `Reel`, `Story`, `Uebung` aktuell nicht weiter.
- WF-03 postet ueber `image_url`/Foto-Posting-Logik.
- Unser Canva-Finalexport liegt als lokale/OneDrive-Datei vor:
  `Content_Socialmedia/Reels_Stories/2026-06-13_IMG_7858/05_Export_fertig/IMG_7858_reel_final_canva_2026-06-13.mp4`
- Meta/n8n braucht fuer automatisches Posting entweder eine oeffentlich abrufbare Video-URL oder einen sauberen Upload-/Publishing-Branch.

## Sicherheitsregel

Die bestehenden Workflows WF-01, WF-02 und WF-03 sollten fuer den ersten Reel-Test NICHT direkt veraendert werden.

Stattdessen:

1. Bestehende Foto-Pipeline unveraendert lassen.
2. Neuen separaten Workflow als Draft anlegen, z. B. `PF_WF-05_Reel_Posting_DRAFT`.
3. Dieser neue Workflow liest nur explizit freigegebene Reel-Metadaten mit Status `ready_to_post`.
4. Testlauf zuerst ohne Live-Posting.
5. Erst nach erfolgreichem Trockenlauf produktiv schalten.

## Bestehender Reel-Status im Dateisystem

Projekt:

`Content_Socialmedia/Reels_Stories/2026-06-13_IMG_7858/`

Workflow-Pool:

`Content_Socialmedia/Videos/Reels/2026/2026-06-13_IMG_7858/`

Wichtige Dateien:

- `IMG_7858_reel_final_canva_2026-06-13.mp4`
- `IMG_7858_reel_cover_canva_2026-06-13.jpg`
- `Posting_Metadata.md`
- `posting_ready.json`
- `INSTAGRAM_POSTING_READY.md`

Aktueller Status in `posting_ready.json`:

`ready_to_post`

Freigaben:

- Ton/Datenschutz: erledigt
- Einverstaendnis sichtbarer Personen: erledigt
- finale Freigabe: erledigt

## Empfohlener neuer n8n-Workflow

Name:

`PF - WF-05 Reel Posting DRAFT`

Trigger fuer ersten Test:

- manuell starten, kein Cron

Spaeterer Trigger:

- Cron, z. B. alle 30 oder 60 Minuten
- nur Items/Dateien mit Status `ready_to_post`

Minimaler Ablauf:

1. `Manual Trigger`
2. `Read/Load posting_ready.json`
3. Pruefen:
   - `status === "ready_to_post"`
   - `content_type === "reel"`
   - finale MP4 vorhanden
   - Cover vorhanden
   - Caption/CTA/Hashtags vorhanden
   - `consent_confirmed === true`
   - `audio_privacy_check_completed === true`
4. Video fuer Meta oeffentlich erreichbar machen oder per Upload-Branch bereitstellen.
5. Instagram Reel erstellen.
6. Optional Facebook Reel/Video erstellen.
7. Bei Erfolg Status auf `posted` setzen und Post-IDs dokumentieren.
8. Bei Fehler Status nicht veraendern, sondern Fehlerlog/Teams-Hinweis erzeugen.

## Kein Doppelposting

Damit nichts doppelt laeuft:

- WF-03 bleibt nur fuer SharePoint-Items mit Status `Bereit` und Bild-URLs zustaendig.
- WF-05 arbeitet nur mit `posting_ready.json` oder einem separaten SharePoint-Status wie `Reel bereit`.
- WF-05 setzt nach erfolgreichem Posting den Status auf `posted`.
- WF-05 ignoriert alles, was nicht `ready_to_post` ist.
- Fuer den ersten Test bleibt WF-05 manuell und nicht per Cron aktiv.

## Offene technische Entscheidung

Vor Live-Posting muss entschieden werden, wie die MP4 fuer Meta bereitgestellt wird:

1. Oeffentliche Video-URL, z. B. ueber einen geeigneten Hosting-Ort.
2. Direkter Upload ueber Meta/n8n, falls der verwendete Meta-Endpunkt und Token das sauber unterstuetzen.
3. Halbautomatisch: Datei und Postingtext werden vorbereitet, finale Veroeffentlichung erfolgt in Meta Business Suite/Instagram manuell.

Fuer den ersten sicheren Schritt ist Variante 3 am risikoaermsten. Fuer Vollautomatik ist Variante 1 oder 2 noetig.

## Naechster sicherer Schritt

1. In n8n keinen bestehenden Workflow ueberschreiben.
2. Bestehende Workflows exportieren/Backup behalten.
3. Neuen Draft-Workflow `PF - WF-05 Reel Posting DRAFT` anlegen.
4. Zuerst nur `posting_ready.json` lesen und einen Teams-/Debug-Output erzeugen.
5. Danach entscheiden, ob Meta-Reel-Posting live automatisiert werden soll.

## Ergaenzung 2026-06-12: Caption Generator vor Posting

Vor dem echten Reel-Posting wird ein separater Caption-Generator genutzt:

```text
PF WF-05 Reel Caption Generator
```

Dieser Workflow verarbeitet nur Items mit `Status = Video eingegangen`, erzeugt Hook, Caption, CTA, Hashtags, Story-Teaser, Alt-Text und Overlay-Vorschlaege und setzt danach `Status = KI-Texte fertig`.

Wichtig: Der Caption Generator postet nicht und setzt nicht auf `Bereit`. Damit bleibt WF-03 unangetastet.

## Ergaenzung 2026-06-12: WF-06 Reel Posting

Der erste Posting-Workflow fuer Reels/Videos liegt als separate Importdatei vor:

```text
Content_Socialmedia/05_Workflows_Automation/n8n-JSON/PF_WF-06_Reel_Posting.json
```

WF-06 darf nur Items mit `Status = Reel freigegeben` und `Freigabe_Person = Judith` verarbeiten. Zusaetzlich muss eine oeffentlich abrufbare `Video_Public_URL` vorhanden sein.

Version 1 postet Instagram als Reel und Facebook als Page-Video. Ein echter Facebook-Reel-Upload kann spaeter separat ergaenzt werden.
