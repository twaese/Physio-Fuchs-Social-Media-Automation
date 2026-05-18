# Felder-Mapping (Formular ⇄ SharePoint ⇄ n8n)

Übersicht, wie Felder aus dem HTML-Formular auf die SharePoint-Spalten
abgebildet werden und wo n8n sie liest oder schreibt.

---

## Formular → SharePoint (WF-01)

| HTML-Formular-Feld          | SharePoint-Spalte | Pflicht | Default-Wert        |
| --------------------------- | ----------------- | ------- | ------------------- |
| `Thema`                     | `Title`, `field_1`| ja      | –                   |
| `Post_Typ`                  | `field_2`         | ja      | `Standard`          |
| `Content_Brief`             | `field_3`         | nein    | `""`                |
| `Veroeffentlichungsdatum`   | `field_4`         | ja      | (leer → WF-00)      |
| `Uhrzeit`                   | `field_5`         | nein    | `09:00`             |
| – (intern)                  | `field_6`         | ja      | `Entwurf`           |
| `Hashtag_Thema`             | `field_7`         | nein    | `""`                |
| `Bild_Dateiname`            | `field_8`         | nein    | `""`                |
| – (n8n füllt)               | `field_9`         | nein    | `""` → WF-03        |
| – (n8n füllt)               | `field_10`        | nein    | `""` → WF-02        |
| `Freigabe_Person`           | `field_11`        | ja      | `Judith`            |
| – (n8n füllt)               | `field_12`        | nein    | `""` → WF-03        |
| `Kommentare`                | `field_13`        | nein    | `""`                |

Datum-Konvertierung: ISO `YYYY-MM-DD` → `TTMMJJJJ` (Code-Node, WF-01).

---

## SharePoint → n8n-Variablen (in den Workflows)

In den Code-Nodes wird das SP-Item meist auf folgende Aliase gemappt,
um die Prompts lesbar zu halten:

| n8n-Variable        | Quelle (SP-Feld) | Zweck                                |
| ------------------- | ---------------- | ------------------------------------ |
| `THEMA`             | `field_1`        | Prompt-Variable                      |
| `POST_TYP`          | `field_2`        | Switch-Routing                       |
| `BRIEF`             | `field_3`        | Prompt-Variable                      |
| `DATUM`             | `field_4`        | Prompt-Variable + Posting-Schedule   |
| `UHRZEIT`           | `field_5`        | Posting-Schedule                     |
| `STATUS`            | `field_6`        | Filter-Logik                         |
| `HASHTAG_THEMA`     | `field_7`        | Eingabe für Hashtag-Prompt           |
| `BILD_DATEI`        | `field_8`        | Canva-Asset-Suche                    |
| `PREVIEW_URL`       | `field_9`        | Freigabe-Card                        |
| `CAPTION`           | `field_10`       | Posting + Vorschau                   |
| `FREIGEBER`         | `field_11`       | Adressat der Teams-Card              |
| `META_POST_ID`      | `field_12`       | Tracking                             |
| `KOMMENTARE`        | `field_13`       | Log + Notizen                        |

---

## n8n → SharePoint (Schreibrichtung)

| Workflow | Schreibt in              | Bedingung                                                |
| -------- | ------------------------ | -------------------------------------------------------- |
| WF-00    | `field_4`, `field_5`     | nur wenn beide leer                                      |
| WF-01    | alle Felder (siehe oben) | beim Anlegen, setzt `field_6 = Entwurf`                  |
| WF-02    | `field_7`, `field_10`, `field_13` | wenn `field_10` leer und `field_6=Entwurf`      |
| WF-03 (Phase A) | `field_9`, `field_6` | wenn `field_10` befüllt, `field_9` leer; setzt `field_6 = Bereit`, sobald `field_7 + field_9 + field_10` vollständig |
| WF-03 (Freigabe-Webhook) | `field_6` (`Bereit → Entwurf` bei Änderungswunsch) | nach Klick „Änderung wünschen" |
| WF-03 (Phase C) | `field_6`, `field_12` | wenn `field_6=Freigegeben`; setzt `field_6 = Geplant`|
| WF-03 (Phase D) | `field_6`, `field_12` | wenn `field_6=Geplant` und Live im Feed; setzt `field_6 = Veröffentlicht` |

---

## Sonderfall: Mehrere Plattformen pro Item

Aktuell läuft Instagram **und** Facebook synchron mit demselben Inhalt.
Wenn das später getrennt werden soll, gibt es zwei Optionen:

1. **Plattform-Spalte** ergänzen (`field_14 = Choice "IG / FB / Beide"`)
   und WF-03 darauf basieren.
2. **Pro Plattform ein eigenes Item** anlegen (sauberer, aber mehr Pflege).

Empfehlung für jetzt: synchron lassen, einfache Erweiterung um `field_14`
einplanen.
