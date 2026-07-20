# Video-/Reel-Technikablauf fuer Thomas

Stand: 2026-06-13

Diese Anleitung beschreibt die technischen Schritte fuer Thomas/Codex nach Judiths Einreichung.

## Ziel

Ein Reel soll erst dann gepostet werden, wenn:

- Judith final freigegeben hat
- die finale MP4 oeffentlich erreichbar ist
- WF-06 Preflight gruen ist

## 1. Eingang pruefen

Nach Judiths Einreichung legt WF-01 ein SharePoint-Item an.

Erwartung bei Video:

```text
Status = Video eingegangen
Material_Typ = video
```

WF-05 erzeugt danach automatisch Caption/Hashtags.

Erwartung:

```text
Status = KI-Texte fertig
Caption_Variante gefuellt
Hashtag_Thema gefuellt
Kommentare enthalten WF-05 Textpaket
```

## 2. Canva bearbeiten

In Canva:

1. Video in passendem Reel-Format bearbeiten
2. Brand Kit `Physio Fuchs` verwenden
3. Textueberlappungen vermeiden
4. Ton/Musik pruefen
5. als MP4 herunterladen

Empfohlener Dateiname:

```text
PF_YYYY-MM-DD_PROJEKT_reel_final.mp4
```

Beispiel:

```text
PF_2026-06-13_IMG_7858_reel_final.mp4
```

Alternative: Judith bearbeitet selbst in Canva.

Dann legt sie die MP4 hier ab:

```text
Content_Socialmedia/Reels_Stories/00_Canva_Exports_von_Judith/
```

Thomas/Codex uebernimmt danach ab Schritt 3.

## 3. MP4 auf Hostinger hochladen

Zielordner:

```text
/docker/gt-ui/html/videos/reels/2026/
```

Einmalig/bei Bedarf auf Hostinger:

```bash
mkdir -p /docker/gt-ui/html/videos/reels/2026
chmod 755 /docker/gt-ui/html/videos /docker/gt-ui/html/videos/reels /docker/gt-ui/html/videos/reels/2026
```

Vom Mac aus hochladen:

```bash
scp "/lokaler/pfad/zum/video.mp4" root@srv1099163.hstgr.cloud:/docker/gt-ui/html/videos/reels/2026/PF_YYYY-MM-DD_PROJEKT_reel_final.mp4
```

Auf Hostinger Rechte setzen:

```bash
chmod 644 /docker/gt-ui/html/videos/reels/2026/PF_YYYY-MM-DD_PROJEKT_reel_final.mp4
```

URL pruefen:

```bash
curl -I https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/PF_YYYY-MM-DD_PROJEKT_reel_final.mp4
```

Erwartung:

```text
HTTP/2 200
content-type: video/mp4
```

## 4. Video_Public_URL in SharePoint eintragen

Im passenden SharePoint-Item in `Kommentare` unten anhaengen:

```text
Video_Public_URL: https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/PF_YYYY-MM-DD_PROJEKT_reel_final.mp4
```

Bestehende Kommentare nicht loeschen.

Danach Status setzen:

```text
Status = Freigabe offen
```

## 5. Judith-Freigabe abwarten

Judith setzt bei finaler Freigabe:

```text
Freigabe_Person = Judith
Status = Reel freigegeben
```

Wenn Judith zurueckstellt, bleibt der Status z. B.:

```text
Freigabe offen
```

Dann darf WF-06 nicht posten.

## 6. WF-06 Preflight testen

In n8n Workflow:

```text
PF WF-06 Reel Posting
```

Nur bis zum Preflight testen:

1. `SP: Reel-Freigaben holen`
2. `Filter: Reel freigegeben + Preflight`

Gruen:

```text
_wf06_ready = true
```

Blockiert:

```text
_wf06_ready = false
skipped = Gruende je Item
```

Typische Blocker:

```text
status=...
freigabe=...
caption_fehlt
video_public_url_fehlt
scheduled_future=...
einverstaendnis_fehlt
```

## 7. Posting nur bewusst starten

Wenn `_wf06_ready = true`, ist die Schleuse bereit.

Dann gibt es zwei Optionen:

1. Stoppen, wenn nur getestet werden soll.
2. Workflow komplett laufen lassen, wenn wirklich gepostet werden soll.

Bei echtem Lauf postet WF-06:

- Instagram Reel
- Facebook Page Video

Nach Erfolg schreibt WF-06 zurueck:

```text
Status = Veroeffentlicht
Instagram_Post_ID = field_12
Kommentare = WF-06 Posting-Log
```

## Sicherheitsregel

WF-06 nie komplett laufen lassen, wenn nicht wirklich gepostet werden soll.

Fuer Tests reicht:

```text
SP holen -> Preflight pruefen -> stoppen
```

## Teams-Benachrichtigung fuer Judith

Umgesetzt/geplant in den JSONs:

```text
WF-01: Teams: Eingang melden
WF-05: Teams: Reel-Texte fertig melden
WF-06: Teams: Reel veroeffentlicht melden
```

Nach WF-05, wenn `Status = KI-Texte fertig` gesetzt wurde, sendet n8n eine Teams-Nachricht in den passenden Kanal.

Inhalt der Nachricht:

```text
Neues Reel ist textlich vorbereitet.

Thema: ...
SharePoint-Item: ...
Status: KI-Texte fertig

Naechster Schritt:
- Thomas/Codex bearbeitet in Canva
oder
- Judith bearbeitet selbst in Canva und legt die MP4 hier ab:
  Content_Socialmedia/Reels_Stories/00_Canva_Exports_von_Judith/

Bitte erst nach finaler Pruefung Status auf Reel freigegeben setzen.
```

Diese Benachrichtigung postet nichts. Sie ist nur eine Aufgaben-/Uebergabeinfo.
