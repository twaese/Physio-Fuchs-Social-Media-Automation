# WF-06 Reel Posting

Stand: 2026-06-12

## Rolle im Gesamtprozess

WF-06 ist der erste Workflow, der Reels/Videos wirklich veroeffentlichen darf.

Vorherige Schritte:

```text
WF-01: Video eingegangen
WF-05: KI-Texte fertig
Canva/Thomas: Freigabe offen
Judith: Reel freigegeben
WF-06: Veröffentlicht
```

## Trigger

Der Workflow enthaelt:

- `Manual Trigger`
- `Schedule: alle 60 Minuten`

Die Importdatei bleibt `active: false`. Aktivierung erfolgt bewusst in n8n.

## Input-Filter

Verarbeitet wird maximal ein Item pro Lauf.

Pflicht:

```text
field_6 / Status = Reel freigegeben
field_11 / Freigabe_Person = Judith
field_10 / Caption_Variante gefuellt
Video_Public_URL vorhanden
```

Der Zeitplan wird beachtet, falls `Veroeffentlichungsdatum` und Uhrzeit gesetzt sind.

## Datenschutz

Der Workflow liest die Materialnotizen aus `Kommentare`.

Bei:

```text
- Personen sichtbar: ja
```

muss vorhanden sein:

```text
- Einverstaendnis vorhanden: ja
```

Sonst wird das Item uebersprungen.

## Meta-Posting

Instagram:

```text
POST /{ig-business-account-id}/media
media_type = REELS
video_url = Video_Public_URL
caption = Caption + Hashtags
```

Danach:

```text
POST /{ig-business-account-id}/media_publish
```

Facebook:

```text
POST /{page-id}/videos
file_url = Video_Public_URL
description = Caption
```

Das ist in Version 1 ein Facebook-Page-Video. Ein echter Facebook-Reel-Upload kann spaeter separat ergaenzt werden.

## Output

Nach Erfolg:

```text
Status = Veröffentlicht
field_12 = Instagram Post ID
field_13 = Posting-Log
```

## Offener technischer Punkt

Die wichtigste Voraussetzung fuer Live-Posting ist ein stabiler, oeffentlich erreichbarer MP4-Link.

Optionen:

- Hostinger/public media folder
- anderer CDN-/Asset-Ort
- spaeter dedizierter Upload-Flow zur Meta API

SharePoint- oder OneDrive-Links sind meist nicht geeignet, weil Meta sie ohne Login nicht abrufen kann.

## Debug-Verhalten

Der Knoten `Filter: Reel freigegeben + Preflight` gibt bei keinem Treffer nicht mehr leer zurueck, sondern eine Debug-Zeile:

```text
_wf06_ready = false
skipped = Gruende je Item
```

Der nachfolgende Knoten `IF: Posting ready?` laesst nur Items mit `_wf06_ready = true` weiter zum Meta-Posting. Dadurch ist die Debug-Ausgabe fuer Tests nutzbar, ohne versehentlich zu posten.
