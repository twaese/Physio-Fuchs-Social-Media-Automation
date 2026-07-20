# Video-/Reel-Betriebsanleitung

Stand: 2026-06-13

Diese Anleitung beschreibt den aktuellen End-to-End-Ablauf fuer Physio-Fuchs-Reels: von Judiths Einreichung bis zum moeglichen Posting ueber Meta.

## Kurzueberblick

```text
Judith reicht Video ein
  -> WF-01 v4 Foto Video Upload
  -> SharePoint: Video eingegangen
  -> WF-05 Reel Caption Generator
  -> SharePoint: KI-Texte fertig
  -> Canva manuell durch Thomas/Codex oder Judith bearbeiten und MP4 exportieren
  -> MP4 auf Hostinger hochladen
  -> SharePoint: Video_Public_URL in Kommentare
  -> Judith prueft und setzt Reel freigegeben
  -> WF-06 Reel Posting Preflight
  -> nur bei gruener Schleuse: Instagram Reel + Facebook Page Video
  -> SharePoint: Veroeffentlicht
```

## Beteiligte Workflows

| Workflow | Status | Aufgabe | Darf posten? |
| --- | --- | --- | --- |
| `PF WF-01 v4 Foto Video Upload` | aktiv | Formular empfangen, SharePoint-Item anlegen, Material speichern | nein |
| `PF WF-05 Reel Caption Generator` | aktiv/scheduled moeglich | Caption, CTA, Hashtags, Overlay-Vorschlaege erzeugen | nein |
| `PF WF-06 Reel Posting` | erst manuell testen | Nur freigegebene Reels posten | ja, aber nur nach Preflight |

## SharePoint-Statusfluss

```text
Video eingegangen
KI-Texte fertig
Canva in Bearbeitung
Freigabe offen
Reel freigegeben
Veroeffentlicht
```

Empfohlene Verantwortlichkeiten:

| Status | Wer setzt ihn? | Bedeutung |
| --- | --- | --- |
| `Video eingegangen` | WF-01 | Rohvideo ist im System angekommen |
| `KI-Texte fertig` | WF-05 | Caption/Hashtags/Textpaket sind erzeugt |
| `Canva in Bearbeitung` | Thomas/Codex oder Judith | Reel wird in Canva gebaut |
| `Freigabe offen` | Thomas/Codex oder Judith | Reel, Caption und URL sind bereit zur Pruefung |
| `Reel freigegeben` | Judith | Judith hat final freigegeben |
| `Veroeffentlicht` | WF-06 | Meta-Posting war erfolgreich |

Wichtig: `Reel freigegeben` soll in der Regel nur durch Judith gesetzt werden.

## Ablauf im Detail

### 1. Judith reicht Rohvideo ein

Judith nutzt die Webseite `Content einreichen`.

Bei Video/Reel/Story/Uebung:

```text
Material_Typ = video
Status = Video eingegangen
```

WF-01 legt das Item in SharePoint an und speichert den Upload. Foto-Posts laufen weiter durch die Foto-Automation.

### 2. WF-05 erzeugt die Texte

WF-05 verarbeitet Items mit:

```text
Status = Video eingegangen
```

Ergebnis:

```text
Caption_Variante = Hook + Caption + CTA
Hashtag_Thema = Hashtags
Kommentare = WF-05 Textpaket + Overlay-Vorschlaege
Status = KI-Texte fertig
```

WF-05 postet nichts und setzt nicht auf `Bereit`.

### 3. Canva-Bearbeitung

Canva bleibt ein manueller Arbeitsschritt. Er kann durch Thomas/Codex oder Judith erfolgen.

Schritte:

1. Video in Canva bearbeiten.
2. Brand Kit Physio Fuchs verwenden.
3. Textueberlappungen vermeiden.
4. Musik/Ton final pruefen.
5. Als MP4 herunterladen.

Empfohlene Dateibenennung:

```text
PF_YYYY-MM-DD_<Projekt>_reel_final.mp4
```

Beispiel:

```text
PF_2026-06-13_IMG_7858_reel_final.mp4
```

Wenn Judith selbst in Canva bearbeitet, legt sie die exportierte MP4 hier ab:

```text
Content_Socialmedia/Reels_Stories/00_Canva_Exports_von_Judith/
```

Thomas/Codex uebernimmt danach den Hostinger-Upload und die `Video_Public_URL`.

### 4. MP4 auf Hostinger bereitstellen

Meta muss das Video ohne Login abrufen koennen. Ein privater SharePoint-/OneDrive-Link reicht normalerweise nicht.

Zielordner auf Hostinger:

```text
/docker/gt-ui/html/videos/reels/2026/
```

Einmalig anlegen:

```bash
mkdir -p /docker/gt-ui/html/videos/reels/2026
chmod 755 /docker/gt-ui/html/videos /docker/gt-ui/html/videos/reels /docker/gt-ui/html/videos/reels/2026
```

Vom Mac hochladen:

```bash
scp "/lokaler/pfad/zum/video.mp4" root@srv1099163.hstgr.cloud:/docker/gt-ui/html/videos/reels/2026/PF_YYYY-MM-DD_PROJEKT_reel_final.mp4
```

Rechte setzen:

```bash
chmod 644 /docker/gt-ui/html/videos/reels/2026/PF_YYYY-MM-DD_PROJEKT_reel_final.mp4
```

Pruefen:

```bash
curl -I https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/PF_YYYY-MM-DD_PROJEKT_reel_final.mp4
```

Erwartung:

```text
HTTP/2 200
content-type: video/mp4
```

### 5. Video_Public_URL in SharePoint eintragen

Im passenden SharePoint-Item in der Spalte `Kommentare` unten anhaengen:

```text
Video_Public_URL: https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/PF_YYYY-MM-DD_PROJEKT_reel_final.mp4
```

Nichts aus den bestehenden Kommentaren loeschen.

### 6. Freigabe durch Judith

Vor Freigabe pruefen:

- finales MP4 ist korrekt
- Caption passt
- Hashtags passen
- Datenschutz/Einverstaendnis ist dokumentiert
- Datum/Uhrzeit ist erreicht oder liegt in der Vergangenheit

Dann setzt Judith:

```text
Freigabe_Person = Judith
Status = Reel freigegeben
```

Wenn die Freigabe zurueckgenommen wird, Status wieder auf einen nicht-postingfaehigen Wert setzen, z. B.:

```text
Freigabe offen
```

Dann muss WF-06 im Preflight wieder `_wf06_ready = false` liefern. Das ist korrekt.

## WF-06 Preflight

WF-06 darf nur weiterlaufen, wenn alle Bedingungen erfuellt sind:

```text
Status = Reel freigegeben
Freigabe_Person = Judith
Caption_Variante gefuellt
Video_Public_URL vorhanden und endet auf .mp4/.mov
Datum/Uhrzeit nicht in der Zukunft
Wenn Personen sichtbar: Einverstaendnis vorhanden = ja
```

Der Knoten `Filter: Reel freigegeben + Preflight` gibt im Testfall Debug-Daten aus.

Gruene Schleuse:

```text
_wf06_ready = true
```

Blockiert:

```text
_wf06_ready = false
skipped = Gruende je Item
```

Typische Gruende:

| Grund | Bedeutung |
| --- | --- |
| `status=...` | Status ist nicht `Reel freigegeben` |
| `freigabe=...` | Freigabe ist nicht exakt `Judith` |
| `caption_fehlt` | Caption_Variante ist leer |
| `video_public_url_fehlt` | keine oeffentliche MP4/MOV-URL gefunden |
| `scheduled_future=...` | geplantes Datum/Uhrzeit liegt in der Zukunft |
| `einverstaendnis_fehlt` | Personen sichtbar, aber Einverstaendnis nicht ja |

Direkt danach sitzt `IF: Posting ready?`. Nur `_wf06_ready = true` geht weiter zu Meta.

## Posting

Wenn WF-06 voll durchlaeuft:

1. Instagram Reel Container erstellen
2. 90 Sekunden warten
3. Instagram Reel publishen
4. Facebook Page Video posten
5. SharePoint aktualisieren:

```text
Status = Veroeffentlicht
Instagram_Post_ID = field_12
Kommentare = WF-06 Posting-Log
```

Hinweis: Version 1 postet auf Facebook als Page-Video. Echter Facebook-Reel-Upload kann spaeter separat ergaenzt werden.

## Testprotokoll vom 2026-06-13

Erfolgreich getestet:

- Hostinger-Upload fuer `PF_2026-06-13_IMG_7858_reel_final.mp4`
- Public URL liefert `HTTP/2 200` und `content-type: video/mp4`
- SharePoint-Kommentar mit `Video_Public_URL`
- WF-06 Preflight erkennt das Item und setzt `_wf06_ready = true`
- Ruecknahme der Freigabe setzt Preflight wieder auf `_wf06_ready = false`

Public URL aus dem Test:

```text
https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/PF_2026-06-13_IMG_7858_reel_final.mp4
```

## Sicherheitsregel

WF-06 erst komplett laufen lassen, wenn wirklich gepostet werden soll.

Fuer Tests:

1. Nur bis `Filter: Reel freigegeben + Preflight` ausfuehren.
2. `_wf06_ready` pruefen.
3. Bei `true` stoppen, wenn kein Live-Posting gewuenscht ist.

## Teams-Benachrichtigung

Teams-Kanalbenachrichtigungen sind im Ablauf vorgesehen:

```text
WF-01: Eingang melden
WF-05: Reel-Texte fertig melden
WF-06: Reel veröffentlicht melden
```

Kanal:

```text
Physio Fuchs Administration / Socialmedia
```

Nach WF-05:

```text
Status = KI-Texte fertig
```

Die Nachricht soll Judith/Thomas informieren:

- neues Reel ist textlich vorbereitet
- Caption/Hashtags liegen in SharePoint
- Canva-Bearbeitung kann starten
- Judith kann optional selbst in Canva bearbeiten
- fertige MP4 gehoert in `Content_Socialmedia/Reels_Stories/00_Canva_Exports_von_Judith/`
- finale Freigabe erfolgt erst mit `Status = Reel freigegeben`

Die Teams-Nachricht ist nur eine Aufgabeninfo und loest kein Posting aus.

Details stehen in:

```text
TEAMS_BENACHRICHTIGUNGEN_SOCIALMEDIA.md
```
