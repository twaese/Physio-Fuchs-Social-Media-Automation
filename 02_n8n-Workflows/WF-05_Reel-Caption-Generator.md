# WF-05 Reel Caption Generator

Stand: 2026-06-12

## Zweck

WF-05 erzeugt fuer eingegangene Video-/Reel-Items ein Textpaket:

- Hook
- Caption
- CTA
- Hashtags
- Story-Teaser
- Alt-Text
- Vorschlaege fuer Text-Overlays
- kurzer Qualitaetscheck

Der Workflow postet nichts und startet keinen Canva-Export.

## Eingabe

SharePoint-Liste aus dem bestehenden Physio-Fuchs-Content-Plan.

Verarbeitet werden nur Items mit:

```text
Status = Video eingegangen
```

Der Workflow verarbeitet pro manueller Ausfuehrung bewusst nur ein Item. So bleibt der erste Test kontrolliert.

## Ausgabe

Bei sauberem HWG-Check:

```text
field_10 / Caption_Variante = Hook + Caption + CTA
field_7  / Hashtag_Thema    = Hashtag-Block
field_13 / Kommentare       = Log + Textpaket + Overlay-Vorschlaege
Status                       = KI-Texte fertig
```

Bei HWG-Treffer:

```text
Status = Geblockt
field_13 enthaelt den Filter-Hinweis
```

## SharePoint-Voraussetzung

Der Status-Choice sollte vor dem ersten echten Lauf erweitert werden:

```text
KI-Texte fertig
```

`Geblockt` existiert im bestehenden Workflow-Setup bereits. Falls nicht, ebenfalls als Status-Choice ergaenzen.

## Sicherheitsregeln

- Workflow bleibt zunaechst manuell.
- Kein Cron.
- Kein Posting.
- Kein Status `Bereit`.
- Kein Zugriff auf WF-03.
- Nach jedem Test SharePoint-Zeile pruefen: Caption, Hashtags, Kommentare, Status.

## Import

JSON-Datei:

```text
Content_Socialmedia/05_Workflows_Automation/n8n-JSON/PF_WF-05_Reel_Caption_Generator.json
```

In n8n importieren, Credentials pruefen, manuell ausfuehren.
