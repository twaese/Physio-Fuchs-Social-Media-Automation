# Prompt: Freigabetext an Judith

Verwendet in: WF-03. Nach Caption- und Grafik-Generierung wird Judith
über Microsoft Teams (Adaptive Card) **oder** per E-Mail um Freigabe gebeten.

Ziel: Judith soll in **unter 60 Sekunden** entscheiden können:
„Freigeben" – „Änderung wünschen" – „Verschieben".

---

## System-Prompt

```
Du formulierst eine kurze, freundliche Freigabe-Nachricht an
Judith Fuchs (Inhaberin Physio Fuchs).
Sie soll auf einen Blick sehen:

- Welcher Post steht an?
- Wann soll er live gehen?
- Was sind Caption + Hashtags?
- Wo ist die Vorschau?
- Was muss sie tun?

Tonalität: kollegial, knapp, klar. Sprache: Deutsch.
Anrede: "Hallo Judith,"
Keine Floskeln, keine Werbung, kein Marketing-Sprech.
Nicht länger als 12 Zeilen.
```

---

## User-Prompt-Vorlage

```
Erstelle eine Freigabe-Nachricht an Judith mit folgenden Daten:

- Thema: {{THEMA}}
- Post-Typ: {{POST_TYP}}
- Geplantes Datum/Uhrzeit: {{DATUM}} / {{UHRZEIT}}
- Plattform(en): {{PLATTFORM}}
- Caption-Vorschau (Hook + 1 Satz): {{CAPTION_PREVIEW}}
- Hashtag-Anzahl: {{HASHTAG_COUNT}}
- Vorschau-Link (Canva/MP4): {{PREVIEW_URL}}
- Item-Link in SharePoint: {{SHAREPOINT_ITEM_URL}}
- Besonderheiten / Hinweise: {{NOTIZEN}}

Liefere zwei Varianten:

VARIANTE_TEAMS_CARD
(strukturiert, mit den Buttons "Freigeben", "Änderung wünschen", "Verschieben",
 jeweils mit kurzer Beschreibung des Effekts)

VARIANTE_EMAIL
(Text-Mail mit Betreff und Body)
```

---

## Beispiel-Output

### Variante Teams Card

```
TITEL
Freigabe nötig: "Übung der Woche – Rumpfstabilität"

KOPF
Geplant für Sa, 23.05.2026 um 09:00 auf Instagram + Facebook.

CAPTION-VORSCHAU
"Stechender Schmerz im unteren Rücken? Diese 60-Sekunden-Übung kann helfen."

VORSCHAU
[Vorschau im Canva öffnen]({{PREVIEW_URL}})
[Item in SharePoint öffnen]({{SHAREPOINT_ITEM_URL}})

DETAILS
- Hashtags: 12 Stück, davon 2 lokal
- Bildbrief: hinterlegt
- Hinweis: noch kein Reel, nur Feed-Post

ACTIONS
[ ✅ Freigeben ]              → Status: Freigegeben, n8n plant ein
[ ✏️ Änderung wünschen ]      → öffnet Kommentar-Feld, Status bleibt Entwurf
[ ⏸️ Verschieben ]             → öffnet Datums-Picker
```

### Variante E-Mail

```
BETREFF
[Physio Fuchs] Freigabe nötig – "Übung der Woche – Rumpfstabilität" (Sa 23.05.)

BODY
Hallo Judith,

der Post für Samstag, 23.05. um 09:00 ist vorbereitet.

Thema: Übung der Woche – Rumpfstabilität
Plattformen: Instagram + Facebook

Hook der Caption:
"Stechender Schmerz im unteren Rücken? Diese 60-Sekunden-Übung kann helfen."

Vorschau und Details:
- Canva-Vorschau: {{PREVIEW_URL}}
- SharePoint-Item: {{SHAREPOINT_ITEM_URL}}

Bitte zurückmelden mit:
1) "OK" → wird so eingeplant
2) Was geändert werden soll (Caption, Bild, Datum)
3) "Stop" → wird vorerst nicht ausgespielt

Danke!
Liebe Grüße,
dein Workflow 🤖
```

---

## Hinweise zur Umsetzung

- In Teams: Adaptive Card v1.5, drei `Action.Submit`-Buttons.
- Antworten landen wieder in n8n (Webhook), das den Status entsprechend
  in SharePoint setzt:
  - „Freigeben" → `field_6 = Freigegeben`
  - „Änderung wünschen" → kein Statuswechsel, Kommentar wird in `field_13`
    angefügt, WF-02 wird mit dem Hinweis re-triggered
  - „Verschieben" → `field_4` aktualisieren, Status bleibt
- Reminder-Logik: Wenn nach 24 h keine Antwort, neue Karte mit „Freundliche
  Erinnerung". Nach 48 h Eskalation an Thomas.
