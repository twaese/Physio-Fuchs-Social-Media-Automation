# SESSION-Naechste-Schritte 2026-06-14 - Reel-Posting Laeuferprophylaxe

Stand: 2026-06-14, 18:08 CEST

## Kurzstatus

Der Reel-Workflow wurde heute fuer den SharePoint-Eintrag **Laeuferprophylaxe** praktisch bis zum Instagram-Posting durchgespielt.

Wichtigster Stand:

- Instagram-Reel ist laut Sichtkontrolle bereits veroeffentlicht.
- Facebook-Posting ist noch nicht erfolgreich durchgelaufen.
- WF-06 muss vor Live-Automatik noch sicherer gemacht werden, damit Instagram nicht versehentlich doppelt gepostet wird.

## Projekt / Dateien

Projektordner:

`Content_Socialmedia/Reels_Stories/2026-06-16_IMG_5593-5595/`

Finaler Canva-Export:

`Content_Socialmedia/Reels_Stories/2026-06-16_IMG_5593-5595/05_Export_fertig/PF_2026-06-16_outdoor_stabilitaet_reel_final.mp4`

Finale Public URL:

`https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/PF_2026-06-16_outdoor_stabilitaet_reel_final.mp4`

Facebook-kompatiblere Testdatei:

`Content_Socialmedia/Reels_Stories/2026-06-16_IMG_5593-5595/05_Export_fertig/pf-laufprophylaxe-fb.mp4`

Facebook-Test-URL:

`https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/pf-laufprophylaxe-fb.mp4`

## SharePoint-Eintrag

Der passende SharePoint-Listeneintrag heisst:

`Laeuferprophylaxe`

In `Kommentare` gehoert bzw. gehoerte der technische Block:

```text
Video_Public_URL: https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/PF_2026-06-16_outdoor_stabilitaet_reel_final.mp4
Finaler Canva-Export: PF_2026-06-16_outdoor_stabilitaet_reel_final.mp4
Canva/Export geprueft: ja
Ton/Musik enthalten: ja
Personen sichtbar: ja
Einverstaendnis vorhanden: ja
Freigabe durch Judith erforderlich: ja
```

Caption und Hashtags waren laut Thomas bereits in SharePoint vorhanden.

## Heute erledigt

1. Rohmaterial `IMG_5593.MOV`, `IMG_5594.MOV`, `IMG_5595.MOV` abgelegt.
2. Kontaktboegen, Preview-Frames und Favoritenbilder erstellt.
3. Shotlist und Rough-Cut-Plan geschrieben.
4. Rough-Cut-Preview erstellt.
5. Overlay-Preview erstellt.
6. Canva-Finalexport von Thomas heruntergeladen.
7. Finalexport sauber benannt und im Projektordner abgelegt.
8. Finalexport auf Hostinger hochgeladen.
9. Public URL erfolgreich getestet: `HTTP/2 200`, `video/mp4`.
10. SharePoint-Zuordnung auf Eintrag `Laeuferprophylaxe` geklaert.
11. WF-06 Preflight lief durch.
12. Instagram-Container wurde erstellt.
13. Instagram-Post/Reel wurde laut Thomas sichtbar veroeffentlicht.
14. Facebook-Posting wurde getestet, laeuft aber noch nicht sauber.

## n8n WF-06 Erkenntnisse

### IG: Reel Container erstellen

Der Node hatte anfangs leere Body-Parameter. Korrekt sind:

```text
media_type = REELS
video_url = ={{ $json.video_url }}
caption = ={{ $json.caption_with_hashtags }}
share_to_feed = true
```

Wenn Meta `image_url` verlangt, sind die Body-Parameter leer oder `media_type` wurde nicht uebergeben.

### IG: Reel Publish

Instagram ist bereits raus. Nicht erneut ausfuehren.

Korrekt fuer spaetere Workflow-Reparatur:

```text
creation_id = ={{ $('IG: Reel Container erstellen').item.json.id }}
```

Problem aus der Session:

- Es war zeitweise versehentlich `fb_description` im Feld `creation_id` eingetragen.
- Meta meldete dann: `creation_id muss eine Zahl sein`.

### FB: Page Video

Facebook Page ID:

```text
104383336093043
```

Diese ID steht in `/docker/n8n/.env` als:

```text
FB_PAGE_ID=104383336093043
```

Und im Container:

```text
docker exec n8n-n8n-1 printenv FB_PAGE_ID
104383336093043
```

Trotzdem wurde in n8n zeitweise die URL mit leerem Env gerendert:

```text
https://graph.facebook.com/v25.0//videos
```

Fuer den Test wurde empfohlen, hart zu setzen:

```text
https://graph.facebook.com/v25.0/104383336093043/videos
```

Body-Parameter:

```text
file_url = ={{ $('Filter: Reel freigegeben + Preflight').item.json.video_url }}
description = ={{ $('Filter: Reel freigegeben + Preflight').item.json.fb_description }}
```

Body Content Type:

`Form URL Encoded`

Aktueller Fehler:

```text
Die Videodatei konnte nicht von der URL abgerufen werden.
```

Die originale MP4 ist aber oeffentlich erreichbar. Deshalb wurde eine kleinere, Facebook-kompatiblere MP4 erzeugt:

```text
https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/pf-laufprophylaxe-fb.mp4
```

Naechster Test:

Im Node `FB: Seitenvideo` bei `file_url` testweise hart diese URL eintragen:

```text
https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/pf-laufprophylaxe-fb.mp4
```

Dann nur den Facebook-Node ausfuehren.

## Wichtige Warnung fuer naechste Session

Instagram ist bereits gepostet.

Nicht erneut ausfuehren:

- `IG: Reel Container erstellen`
- `IG: Reel Publish`
- kompletter WF-06 ab Start

Sonst droht Doppelposting.

Naechste Tests nur:

- Facebook-Node isoliert
- danach SharePoint-Status/Log aktualisieren

## Naechste konkrete Schritte

1. In Instagram pruefen:
   Ist das Reel final korrekt sichtbar, Caption/Hashtags ok?

2. In WF-06 den IG-Zweig fuer diesen Test nicht mehr ausfuehren.

3. Facebook-Node separat testen:

   ```text
   URL: https://graph.facebook.com/v25.0/104383336093043/videos
   Body Content Type: Form URL Encoded
   file_url: https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/pf-laufprophylaxe-fb.mp4
   description: ={{ $('Filter: Reel freigegeben + Preflight').item.json.fb_description }}
   ```

4. Wenn Facebook erfolgreich ist:
   SharePoint-Status auf `Veroeffentlicht` setzen.

5. SharePoint-Kommentar/Log ergaenzen:

   ```text
   2026-06-14 WF-06: Instagram Reel veroeffentlicht. Facebook separat getestet.
   Video_Public_URL: https://gt-assistent.srv1099163.hstgr.cloud/videos/reels/2026/PF_2026-06-16_outdoor_stabilitaet_reel_final.mp4
   ```

6. WF-06 technisch nachziehen:
   - Body-Parameter in IG/FB dauerhaft korrigieren.
   - FB Page ID entweder hart oder korrekt via Env rendern.
   - Doppelposting-Schutz einbauen: Wenn IG-Post-ID oder Log bereits vorhanden, IG nicht erneut publishen.
   - Optional: IG und FB in getrennte Statusfelder / Logmarker aufteilen.

## Offene technische Entscheidung

WF-06 sollte vor Aktivierung als echter Schedule-Workflow eine Schutzlogik bekommen:

- `Status = Reel freigegeben` allein reicht nicht.
- Zusaetzlich pruefen:
  - Wurde IG schon gepostet?
  - Wurde FB schon gepostet?
  - Gibt es bereits `Meta_Post_ID` oder Logeintrag?

Empfehlung:

WF-06 erst dann wieder aktiv im Schedule laufen lassen, wenn diese Schutzlogik eingebaut und getestet ist.
