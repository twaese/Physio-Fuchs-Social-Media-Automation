# CLAUDE.md – Projektanweisung Physio Fuchs Social Media

Zentrale Arbeitsanweisung für Claude Code in diesem Projekt.
Diese Datei wird bei jedem Start automatisch geladen und gilt für **alle**
Aufgaben in `/Volumes/Physio_Fuchs/SocialMedia/`.

---

## 1. Projektkontext

**Auftraggeberin:** Judith Fuchs, Inhaberin der Physiotherapiepraxis *Physio Fuchs*
**Technischer Umsetzer:** Thomas Waese
**Sprache:** Deutsch (alle Outputs, alle Dateien, alle Captions)
**Zielgruppe:** Patient:innen, Interessent:innen, lokale Community

**Ziel des Projekts:**
Einmal pro Woche werden automatisiert Social-Media-Inhalte für Instagram und
Facebook vorbereitet:

- Feed-Post (Bild + Caption + Hashtags)
- Story
- Reel (Skript + Storyboard, später Avatar-Video)
- Caption + Hashtags
- Veröffentlichungsplanung über SharePoint

**Wiederkehrendes Format:** „Übung der Woche" mit Judith Fuchs als digitaler
Avatar-Sprecherin – ohne dass sie jedes Mal selbst vor der Kamera stehen muss.

---

## 2. Tech-Stack

| Komponente              | Rolle                                                |
| ----------------------- | ---------------------------------------------------- |
| **Microsoft 365**       | Zentrale Datenbasis (SharePoint, Teams, OneDrive)    |
| **SharePoint-Liste**    | `PF-Content-Kalender-2026` – einzige Wahrheit        |
| **n8n**                 | Automatisierungsplattform (Workflows WF-00 bis WF-03)|
| **Canva**               | Grafik-Vorlagen, Reels, Story-Templates              |
| **Instagram (Business)**| Zielkanal 1                                          |
| **Facebook Page**       | Zielkanal 2                                          |
| **Teams**               | Benachrichtigungen, Freigabe-Channel                 |
| **HTML-Formular**       | Eingabe von Judith → Webhook → SharePoint            |

Spätere Erweiterungen: TikTok, YouTube Shorts, LinkedIn (geplant, noch nicht aktiv).

---

## 3. Status-Flow eines Posts

```
Entwurf → Bereit → Freigegeben → Geplant → Veröffentlicht
```

- **Entwurf** – Frisch aus dem Formular, Caption/Grafik fehlen noch.
- **Bereit** – Caption + Grafik sind fertig, **wartet auf Judiths Freigabe**.
- **Freigegeben** – Judith hat in Teams/SharePoint „OK" gegeben.
- **Geplant** – n8n hat den Post bei Meta zur Veröffentlichung eingestellt.
- **Veröffentlicht** – Post ist live, IG-Post-ID ist im SharePoint hinterlegt.

Claude darf **niemals selbstständig** den Status auf „Freigegeben",
„Geplant" oder „Veröffentlicht" setzen. `Entwurf → Bereit` darf
WF-02 automatisiert setzen (sobald Caption + Grafik fertig sind),
alle anderen Übergänge brauchen Judith oder den Posting-Workflow.

**Ausnahme – Auto-Release für Standard-Feed-Posts:** Für monatlich von
WF-04 automatisch eingeplante Standard-Feed-Posts (Tipp, FAQ, BTS,
Praxis-News, Aktion, …) darf WF-03 Phase B2 den Status `Bereit → Freigegeben`
ohne Teams-Card durchschalten. Reels, Stories und `Übung` (Format
„Übung der Woche") sind **immer** ausgenommen – dort bleibt die manuelle Freigabe durch Judith
verbindlich. Details: `00_Konzept/Status-Flow.md` Abschnitt 2a und
`02_n8n-Workflows/WF-04_Monats-Scheduler-Standard-Post.md`.

---

## 4. Ordnerstruktur

```
/Volumes/Physio_Fuchs/SocialMedia/
├── CLAUDE.md                          ← diese Datei
├── 00_Konzept/                        ← Workflow-Konzept, Tonalität, Status
├── 01_Prompts/                        ← LLM-Prompts (Übung, Story, Reel, …)
├── 02_n8n-Workflows/                  ← Markdown-Doku zu jedem WF
├── 03_SharePoint/                     ← Listen-Schema, Feldmapping
├── 04_Canva-Vorlagen/                 ← Vorlagen-Übersicht, IDs
├── 05_Content-Planung/                ← Redaktionsplan, Themen-Pool
├── 06_Avatar-Reel-Konzepte/           ← Judith-Avatar, Reel-Formate
├── 07_Datenschutz-DSGVO/              ← DSGVO, HWG, Einverständnisse
├── 99_Platzhalter-Secrets/            ← Liste aller Platzhalter
├── _Archiv/                           ← alte Versionen (nicht anfassen)
├── Symbole-Instagramm/                ← Highlight-Cover (nicht anfassen)
├── PF_WF-*.json                       ← aktive n8n-Workflows
├── physio_fuchs_form_v2.html          ← Eingabeformular für Judith
├── physio_fuchs_templates.html        ← Vorlagen-Übersicht (HTML)
└── PF-Content-Kalender-2026.xlsx      ← Backup/Snapshot des Redaktionsplans
```

---

## 5. Inhaltliche Leitplanken (verbindlich)

### 5.1 Tonalität

- **professionell, sympathisch, motivierend**
- patientennah, freundlich, auf Augenhöhe
- niemals belehrend, niemals einschüchternd
- kein Marketing-Sprech, keine leeren Superlative
- „Sie"-Form als Standard (Praxis-Kontext), in Reels/Stories darf auch „du"
  verwendet werden, wenn Judith es so wünscht – einheitlich pro Format

### 5.2 Fachliche Seriosität

- Keine **Heilversprechen** – weder direkt noch impliziert.
  - ❌ „diese Übung heilt Ihren Rücken"
  - ✅ „diese Übung kann helfen, die Rückenmuskulatur zu mobilisieren"
- Keine **Diagnosen** über Social Media.
- Bei Beschwerden immer der Hinweis: „Bei anhaltenden Beschwerden bitte
  ärztlich/physiotherapeutisch abklären lassen."
- HWG (Heilmittelwerbegesetz) beachten – Details siehe
  `07_Datenschutz-DSGVO/Heilmittelwerbe-Hinweise.md`.

### 5.3 DSGVO

- **Keine** patientenbezogenen Daten (Namen, Bilder, Beschwerden) verwenden.
- Beispiele und Geschichten immer **anonymisiert** und **fiktiv** kennzeichnen
  („Beispielsituation:", „Stellen Sie sich vor:").
- Mitarbeiter:innen-Bilder nur mit schriftlicher Einverständniserklärung
  (Vorlage in `07_Datenschutz-DSGVO/`).
- Tracking-Pixel, externe Skripte etc. nicht ohne Rücksprache einbauen.

### 5.4 Inklusive Sprache

- gendergerecht, aber **nicht** mit Sonderzeichen (kein Stern, kein Doppelpunkt)
  in Captions – stattdessen Paarformen oder neutrale Begriffe
  („Patientinnen und Patienten", „das Team", „alle, die …")
- Ausnahme: Wenn Judith ausdrücklich Gender-Stern wünscht, wird der konsistent
  pro Format verwendet.

---

## 6. Arbeitsregeln für Claude Code

### 6.1 Sicherheit zuerst

- **Nichts löschen.** Auch keine vermeintlich veralteten Dateien.
- **Keine Datei überschreiben**, ohne vorher eine versionierte Sicherung
  anzulegen (`*_vN.json`, `*_YYYY-MM-DD.bak`).
- Bestehende n8n-Workflows (`PF_WF-*.json`) und das HTML-Formular bleiben
  unangetastet, solange Thomas oder Judith nicht ausdrücklich eine Änderung
  wünschen.
- `_Archiv/` ist tabu – read-only behandeln.

### 6.2 Nachvollziehbarkeit

- Jede neue Datei bekommt einen sprechenden Namen.
- Größere Änderungen werden in der jeweiligen Markdown-Datei am Ende unter
  „Änderungshistorie" dokumentiert (Datum, was, warum).
- Beispielwerte und Platzhalter werden immer als solche markiert.

### 6.3 Keine Secrets im Klartext

Alle sensiblen Werte werden ausschließlich als Platzhalter eingesetzt:

| Platzhalter                       | Bedeutung                                  |
| --------------------------------- | ------------------------------------------ |
| `{{SHAREPOINT_SITE_URL}}`         | URL der SharePoint-Site                    |
| `{{SHAREPOINT_SITE_GUID}}`        | Site-GUID                                  |
| `{{SHAREPOINT_LIST_GUID}}`        | List-GUID `PF-Content-Kalender-2026`       |
| `{{INSTAGRAM_BUSINESS_ACCOUNT_ID}}` | IG Business Account ID                   |
| `{{FACEBOOK_PAGE_ID}}`            | FB Page ID                                 |
| `{{META_ACCESS_TOKEN}}`           | Meta Graph API Token                       |
| `{{CANVA_API_KEY}}`               | Canva Connect API Key                      |
| `{{N8N_WEBHOOK_URL}}`             | n8n Webhook für Formular-Einreichungen     |
| `{{TEAMS_WEBHOOK_URL}}`           | Teams-Channel Webhook                      |
| `{{OPENAI_API_KEY}}`              | OpenAI Key (falls genutzt)                 |
| `{{ANTHROPIC_API_KEY}}`           | Anthropic Key (falls genutzt)              |

Vollständige Liste: `99_Platzhalter-Secrets/Platzhalter-Liste.md`.

Echte Werte liegen ausschließlich im n8n Credential-Store bzw. in einer lokalen
`.env`-Datei, die **nicht** in dieses Verzeichnis gehört.

### 6.4 Vor jedem größeren Schritt

1. Kurz beschreiben, was geplant ist.
2. Auf Rückfragen warten, wenn etwas mehrdeutig ist – lieber einmal mehr
   nachfragen als raten.
3. Nach Abschluss: kurze Zusammenfassung, was getan wurde und was als
   nächstes ansteht.

### 6.5 MCP-Werkzeuge

Wenn relevant, dürfen folgende MCP-Werkzeuge genutzt werden – jeweils mit
Bestätigung von Thomas:

- `Microsoft 365` – SharePoint-/Outlook-Recherche (read)
- `Canva` – Vorlagen anlegen, Designs generieren
- `n8n` – Workflows nachschlagen
- `Context7` – aktuelle API-Dokus (Meta Graph, Canva Connect, n8n)

---

## 7. Wöchentlicher Standardablauf

```
Montag       Judith trägt Themen/Ideen ins Formular ein  (manuell)
             → Webhook → WF-01 → SharePoint (Status: Entwurf)

Dienstag     WF-02 erzeugt Caption + Hashtags + Bildbrief
             → SharePoint aktualisiert (Status bleibt Entwurf)

Mittwoch     WF-03 (Phase A) erzeugt Canva-Grafik / Reel-Skript
             → Vorschau-Link in field_9
             → Status: Bereit  (= wartet auf Judith)
             → Teams-Card an Judith

Donnerstag   Judith klickt Freigabe (Teams-Karte oder SharePoint)
             → Status: Freigegeben

Freitag      n8n plant Post bei Meta ein
             → Status: Geplant

Samstag/So.  Veröffentlichung gemäß Redaktionsplan
             → Status: Veröffentlicht, IG-Post-ID gespeichert
```

Genauer beschrieben in `00_Konzept/Workflow-Konzept.md`.

---

## 8. Wichtige Referenzen

- **Workflow-Konzept (technisch):** `00_Konzept/Workflow-Konzept.md`
- **Status-Flow:** `00_Konzept/Status-Flow.md`
- **Tonalität & Markenrichtlinien:** `00_Konzept/Tonalitaet-Markenrichtlinien.md`
- **n8n-Workflow-Doku:** `02_n8n-Workflows/README.md`
- **SharePoint-Schema:** `03_SharePoint/Liste-Schema.md`
- **DSGVO/HWG:** `07_Datenschutz-DSGVO/`
- **Avatar-Konzept Judith:** `06_Avatar-Reel-Konzepte/Avatar-Konzept-Judith.md`

---

## 9. Was Claude **nicht** ohne Rückfrage tun darf

- bestehende Dateien überschreiben oder löschen
- Workflows live in n8n deployen
- Posts wirklich veröffentlichen (nur Vorbereitung, nie Live-Schaltung)
- Inhalte mit echten Patient:innen-Daten erzeugen
- Heilversprechen oder medizinische Diagnosen formulieren
- neue Tools/Plattformen anbinden ohne Absprache
- Tokens, API-Keys oder Credentials in Dateien schreiben

---

## 10. Änderungshistorie

| Datum       | Änderung                                            | Wer            |
| ----------- | --------------------------------------------------- | -------------- |
| 2026-05-14  | Initialversion der CLAUDE.md und Ordnerstruktur     | Claude / Thomas|
| 2026-05-14  | Status `Bereit` als 5. Status aufgenommen           | Claude / Thomas|
| 2026-05-14  | WF-04 (Monats-Scheduler) + Auto-Release-Sonderregel | Claude / Thomas|
