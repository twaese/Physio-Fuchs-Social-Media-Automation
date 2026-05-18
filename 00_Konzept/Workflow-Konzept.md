# Workflow-Konzept – Physio Fuchs Social Media

End-to-End-Beschreibung des automatisierten Wochen-Workflows.
Stand: 2026-05-14

---

## 1. Big Picture

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌────────────┐    ┌──────────────┐
│ Eingabe      │ →  │ SharePoint   │ →  │ Content-     │ →  │ Freigabe   │ →  │ Posting      │
│ (Judith)     │    │ Liste        │    │ Erstellung   │    │ (Judith)   │    │ IG / FB      │
│              │    │              │    │ (Claude/n8n) │    │            │    │              │
│ HTML-Formular│    │ PF-Content-  │    │ Caption +    │    │ Teams-Card │    │ Meta Graph   │
│ Webhook      │    │ Kalender-    │    │ Canva +      │    │ + Status   │    │ API via n8n  │
│              │    │ 2026         │    │ Reel-Skript  │    │ in SP      │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └────────────┘    └──────────────┘
       │                   │                   │                   │                   │
       └─ WF-01 ───────────┘                   │                   │                   │
                                               │                   │                   │
                                       WF-02   │           manuell │           WF-03   │
                                       Caption │           Klick   │       Phase C/D   │
                                       Generator                                       │
                                               └─ WF-03 Phase A ───┘                   │
                                                  (setzt Status: Bereit)               │

Status-Flow:  Entwurf  →  Bereit  →  Freigegeben  →  Geplant  →  Veröffentlicht
```

---

## 2. Beteiligte Komponenten

| Schicht        | Tool                          | Aufgabe                                    |
| -------------- | ----------------------------- | ------------------------------------------ |
| Eingabe        | HTML-Formular (`physio_fuchs_form_v2.html`) | Judith trägt Themen ein     |
| Transport      | n8n Webhook                   | Empfängt Formular-POST                     |
| Datenbasis     | SharePoint-Liste              | Einzige Wahrheit für alle Posts            |
| Generierung    | n8n + LLM (Claude / OpenAI)   | Caption, Hashtags, Bildbrief, Reel-Skript  |
| Grafik         | Canva Connect API             | Feed-Bild, Story, Reel-Cover               |
| Avatar/Video   | (geplant) HeyGen / D-ID / Synthesia | Judith-Avatar für „Übung der Woche"   |
| Freigabe       | Teams Adaptive Card + SP      | Judith bestätigt mit einem Klick           |
| Veröffentl.    | Meta Graph API via n8n        | Auto-Posting auf IG + FB                   |
| Monitoring     | Teams-Channel                 | Statusmeldungen, Fehler, Wochenreport      |

---

## 3. Prozess Schritt für Schritt

### Schritt 1 – Themen-Eingabe (Mo)

**Akteur:** Judith
**Tool:** `physio_fuchs_form_v2.html`

Judith öffnet das Formular und trägt für die kommende Woche ein:
- Thema (z. B. „Übung der Woche – Rumpfstabilität")
- Post-Typ (Standard, Story, Reel, Übung der Woche, Tipp, FAQ, Praxis-News)
- Content-Brief (Stichworte, Wunschbotschaft)
- Wunschdatum + Uhrzeit
- Hashtag-Thema (z. B. „Rücken", „Schulter")
- Bild-Idee oder Dateiname
- Freigeber:in (default: Judith)
- Kommentare

Submit → POST an `{{N8N_WEBHOOK_URL}}/webhook/sharepoint-content`.

### Schritt 2 – WF-01: Formular → SharePoint (Mo)

**Trigger:** Webhook
**Output:** Neues SharePoint-Item, Status `Entwurf`

- Webhook empfängt JSON
- Code-Node validiert Pflichtfelder, formatiert Datum
- SharePoint-Node legt Item in `PF-Content-Kalender-2026` an
- Teams-Notification an Judith: „Eingang gespeichert"
- HTTP-Response 200 ans Formular

Felder-Mapping siehe `03_SharePoint/Felder-Mapping.md`.

### Schritt 3 – WF-02: Caption-Generator (Di)

**Trigger:** Schedule (täglich) **oder** SharePoint-Trigger auf neue Items
mit Status `Entwurf` und leerem Caption-Feld.
**Output:** Caption + Hashtags + Bildbrief im SharePoint-Item

- Holt offene Items aus SP
- Baut Prompt aus `01_Prompts/Caption.md` + Brief + Tonalität
- Ruft LLM
- Schreibt Ergebnis in `field_10` (Caption) und ergänzt `field_7` (Hashtags)
- Bildbrief landet als Notiz im Kommentarfeld

### Schritt 4 – WF-03 Phase A: Grafik / Reel (Mi)

**Trigger:** Schedule **oder** Status `Entwurf` UND Caption vorhanden
**Output:** Canva-Designs (Feed, Story, ggf. Reel-Cover) + Vorschau-URL,
Status wechselt auf `Bereit`

Je nach Post-Typ:

- **Standard / Übung der Woche / Tipp** → Canva-Feed-Template befüllen
- **Story** → Canva-Story-Template
- **Reel** → Reel-Skript erzeugen + Storyboard, Avatar-Placeholder

Vorschau-URLs werden in `field_9` gespeichert.
Sobald `field_7`, `field_9` und `field_10` befüllt sind, setzt der
Workflow `field_6 = Bereit`. Anschließend geht eine Adaptive Card
an Judith in Teams mit den Buttons „Freigeben" / „Änderung wünschen".

### Schritt 5 – Freigabe (Do)

**Akteur:** Judith
**Tool:** Teams-Card oder SP-Liste (Ansicht „Wartet auf mich",
Filter `field_6 = Bereit`)

- „Freigeben" → Status wechselt von `Bereit` auf `Freigegeben`
- „Änderung wünschen" → Status fällt zurück auf `Entwurf`,
  Kommentar wird in `field_13` ergänzt, WF-02/WF-03 re-triggern;
  Loop bis Freigabe

### Schritt 6 – Planung (Fr)

**Trigger:** Status `Freigegeben`
**Output:** Post bei Meta eingeplant, Status `Geplant`

- n8n nutzt Meta Graph API:
  `POST /{ig-business-id}/media` (Container)
  `POST /{ig-business-id}/media_publish` (geplant via `scheduled_publish_time`)
- FB Page analog
- Post-Container-IDs werden in `field_12` gespeichert

### Schritt 7 – Veröffentlichung & Logging (Sa/So)

- Meta veröffentlicht zum geplanten Zeitpunkt
- n8n holt sich nach Veröffentlichung die finale `media_id`
- Status → `Veröffentlicht`
- Wochenreport in Teams: was lief, was nicht

---

## 4. Fehler- und Sonderfälle

| Fall                                  | Verhalten                                 |
| ------------------------------------- | ----------------------------------------- |
| Pflichtfeld fehlt im Formular         | WF-01 antwortet 400, Teams-Hinweis        |
| LLM-Antwort enthält Heilversprechen   | Filter-Regex blockt, Re-Prompt mit Hinweis|
| Canva-API down                        | Retry 3×, dann manuelle Aufgabe in Teams  |
| Meta-Token abgelaufen                 | Workflow stoppt, Teams-Alert an Thomas    |
| Judith antwortet nicht bis Fr morgens | Reminder, Post wird nicht ausgespielt     |

---

## 5. Erweiterungen (Roadmap)

| Phase | Feature                                              |
| ----- | ---------------------------------------------------- |
| 1     | aktueller Stand: Caption + Canva-Grafik + manuell IG |
| 2     | Auto-Posting IG + FB                                 |
| 3     | Avatar-Reels mit Judith (HeyGen / Synthesia)         |
| 4     | TikTok + YouTube Shorts                              |
| 5     | Wochen-Performance-Report aus IG-Insights            |

---

## 6. Verweise

- Status-Flow im Detail: `Status-Flow.md`
- Tonalität: `Tonalitaet-Markenrichtlinien.md`
- n8n-Workflows einzeln: `../02_n8n-Workflows/README.md`
- SharePoint-Schema: `../03_SharePoint/Liste-Schema.md`
- Avatar-Konzept: `../06_Avatar-Reel-Konzepte/Avatar-Konzept-Judith.md`
