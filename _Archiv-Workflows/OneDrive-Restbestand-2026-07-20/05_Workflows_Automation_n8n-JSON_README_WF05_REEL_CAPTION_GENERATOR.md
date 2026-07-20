# README WF-05 Reel Caption Generator

Datei:

```text
PF_WF-05_Reel_Caption_Generator.json
```

## Was der Workflow macht

WF-05 liest Video-Items aus SharePoint mit Status `Video eingegangen`, erzeugt per Claude ein Reel-Textpaket und schreibt Caption, Hashtags und Hinweise zurueck in die SharePoint-Liste.

## Was er nicht macht

- Kein Instagram-Posting
- Kein Facebook-Posting
- Kein Canva-Export
- Kein Wechsel auf `Bereit`

## Vor Import pruefen

1. SharePoint-Status-Choice `KI-Texte fertig` anlegen.
2. `ANTHROPIC_API_KEY` Credential in n8n vorhanden lassen wie bei WF-02.
3. SharePoint-/Microsoft-Credential aus WF-02/WF-01 uebernehmen.
4. Erst manuell testen, nicht aktivieren.

## Testablauf

1. In SharePoint ein Item mit Status `Video eingegangen` bereithalten.
2. Workflow in n8n importieren.
3. Manuell ausfuehren.
4. SharePoint-Zeile pruefen:
   - `Caption_Variante`
   - `Hashtag_Thema`
   - `Kommentare`
   - `Status`

## Erwartetes Ergebnis

Bei sauberem Text:

```text
Status = KI-Texte fertig
```

Bei HWG-Treffer:

```text
Status = Geblockt
```

Danach kann Judith/Thomas die Texte pruefen und das Reel in Canva/finalem Postingprozess freigeben.
