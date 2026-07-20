# README WF-06 Reel Posting

Datei:

```text
PF_WF-06_Reel_Posting.json
```

## Zweck

WF-06 postet freigegebene Reels/Videos nach Meta.

Erste Version:

- Instagram: Reel
- Facebook: Page-Video

Facebook-Reels koennen spaeter als eigener Upload-Flow ergaenzt werden.

## Harte Posting-Schleuse

Der Workflow verarbeitet nur SharePoint-Items mit:

```text
Status = Reel freigegeben
Freigabe_Person = Judith
Caption_Variante gefuellt
Video_Public_URL vorhanden
```

Zusaetzlich prueft der Workflow in den Kommentaren:

```text
- Personen sichtbar: ja/nein
- Einverstaendnis vorhanden: ja/nein
```

Wenn Personen sichtbar sind, muss Einverstaendnis `ja` sein.

## Public Video URL

Meta muss die MP4/MOV-Datei oeffentlich abrufen koennen. Private SharePoint-/OneDrive-Links reichen normalerweise nicht.

Der Workflow akzeptiert die URL entweder in einem Feld wie `Video_Public_URL`/`field_9` oder als Kommentarzeile:

```text
Video_Public_URL: https://example.com/video.mp4
```

Praktisch fuer den Start: In der SharePoint-Liste die Spalte `Kommentare` bearbeiten und die Zeile unten anhaengen. Es muss eine echte oeffentlich erreichbare MP4/MOV-URL sein, kein privater OneDrive-/SharePoint-Link.

## Preflight-Debug

Der Preflight gibt bei fehlender Freigabe/URL/etc. eine Debug-Ausgabe aus:

```text
_wf06_ready = false
skipped = Liste der uebersprungenen Items mit Gruenden
```

Direkt danach sitzt ein IF-Knoten `IF: Posting ready?`. Nur wenn `_wf06_ready = true` ist, laeuft der Workflow weiter zu Instagram/Facebook. Debug-Ausgaben werden nicht gepostet.

## Nach erfolgreichem Posting

Der Workflow schreibt zurueck:

```text
Status = Veröffentlicht
Instagram_Post_ID = field_12
Kommentare = Log inklusive IG/FB-ID und Video_Public_URL
```

## Import- und Testempfehlung

1. Workflow importieren.
2. Nicht sofort aktivieren.
3. Erst manuell mit einem Test-Item laufen lassen.
4. Danach erst entscheiden, ob der Schedule alle 60 Minuten aktiv bleiben soll.

Wichtig: Ein erneuter Lauf nach erfolgreichem IG-Posting kann doppelte Posts erzeugen, falls der SharePoint-Status nicht aktualisiert wurde. Deshalb zuerst manuell testen.
