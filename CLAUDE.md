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
Entwurf → Bereit → Geplant → Veröffentlicht
    │         └──► Geblockt              (HWG-Filter-Match, Judith prüft)
    └──► Wartet-auf-Avatar               (Reel/Übung/Story, Avatar-Flag = off)
```

- **Entwurf** – Frisch aus dem Formular, Caption/Bild/Video fehlen noch.
- **Wartet-auf-Avatar** – Reel/Übung/Story, parkt bis `AVATAR_ENABLED=true` in WF-02.
- **Bereit** – Caption + Bild/Video sind fertig, HWG-Filter sauber, **24h-Karenz** läuft.
- **Geblockt** – HWG-Filter hat eine verdächtige Caption erkannt, Judith prüft.
- **Geplant** – n8n hat den Post bei Meta zur Veröffentlichung eingestellt.
- **Veröffentlicht** – Post ist live, IG-Post-ID ist im SharePoint hinterlegt.

**Grundprinzip – Vollautomatik:** Judith macht ausschließlich Einträge
über das HTML-Formular. Alle weiteren Schritte (Caption, Bild, Planung,
Posting) laufen **ohne manuelle Freigabe**. Zwei Notbremsen sichern ab:

1. **HWG-Filter** in WF-02: Caption-Blacklist auf Heilversprechen
   (`heilt`, `kuriert`, `garantiert`, `schmerzfrei in X Tagen`, …).
   Match → Status `Geblockt`, Teams-Card an Judith. Kein Posting.
2. **24h-Karenz** in WF-03: Posts gehen frühestens 24h nach Erreichen von
   `Bereit` live. Judith kann in der SharePoint-Ansicht „Geht morgen live"
   jederzeit einen Post zurück auf `Entwurf` setzen.

Claude darf **niemals selbstständig** den Status auf `Geplant` oder
`Veröffentlicht` setzen – das macht WF-03 nach erfolgreicher Meta-API-Antwort.
`Entwurf → Bereit` darf WF-02 automatisiert setzen (Caption + Bild fertig
UND HWG-Filter grün). Details: `00_Konzept/Status-Flow.md`,
`01_Prompts/HWG-Blacklist.md`.

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
├── physio_fuchs_form_v4_live.html     ← Eingabeformular für Judith
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
laufend      Judith trägt Themen/Ideen ins Formular ein  (manuell)
             → Webhook → WF-01 → SharePoint (Status: Entwurf)

stündl. Cron WF-02 verarbeitet alle Entwürfe:
             - Caption + Hashtags via LLM
             - HWG-Filter: Match → Status `Geblockt` + Teams-Card
             - Bild via Gotenberg (HTML-Template → PNG/JPG)
             - alles fertig + HWG sauber → Status `Bereit`,
               24h-Karenz beginnt

stündl. Cron WF-03 verarbeitet alle Bereit-Items:
             - Karenz erreicht (>=24h seit `Bereit`)? Sonst skip.
             - Post bei Meta einplanen → Status `Geplant`
             - Nach Live-Schaltung → Status `Veröffentlicht`,
               IG-Post-ID in field_12
```

Judith ist nur involviert, wenn der HWG-Filter zugeschlagen hat
(Status `Geblockt`) oder sie während der 24h-Karenz aktiv einen
Post zurückzieht. Im Normalfall: 0 Klicks pro Post.

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
| 2026-05-16  | Vollautomatik: Freigabe-Schritt entfernt, Status    | Claude / Thomas|
|             | `Geblockt` neu, HWG-Filter + 24h-Karenz als         |                |
|             | Notbremsen. Canva-Pipeline → Gotenberg+HTML.        |                |
| 2026-05-16  | Status `Wartet-auf-Avatar` ergänzt — Avatar-Branch  | Claude / Thomas|
|             | Avatar-ready, via `AVATAR_ENABLED`-Flag aktivierbar |                |
| 2026-05-17  | Layout v12 final (Foto + Banner + Ginkgo + Logo)    | Claude / Thomas|
| 2026-05-17  | WF-02 v18.2 live: GitHub-Push als public Bild-      | Claude / Thomas|
|             | Hosting (statt SP-URL, da Meta SP-Auth nicht kann). |                |
|             | `GITHUB_TOKEN` als neue Env-Var ergänzt.            |                |
| 2026-05-17  | WF-03 v6 live: Karenz + Schedule-Filter + Meta      | Claude / Thomas|
|             | Graph IG/FB Posting + SP-Status-Update. Erster      |                |
|             | echter Post auf @physio_fuchs_lintorf + FB Page.    |                |
|             | `FB_PAGE_ID`, `META_APP_ID` als Env-Vars ergänzt.   |                |
| 2026-05-17  | Doku komplett aktualisiert (WF-02, WF-03, README,   | Claude         |
|             | Workflow-Konzept, Session 18.5.)                    |                |
| 2026-05-18  | Erster vollautomatischer Post: PF-2026-001 ohne     | Claude / Thomas|
|             | manuellen Eingriff durch WF-02 → WF-03 → IG+FB live.|                |
|             | Timezone-Bug in FilterKZ behoben (Berlin-Offset).   |                |
| 2026-05-18  | WF-02 Merge-Code Doppel-Bug behoben: `.item`        | Claude / Thomas|
|             | → `.first()` + field_9 → field_8. Bild_Dateiname    |                |
|             | wird nun automatisch befüllt. Mit PF-2026-007       |                |
|             | verifiziert. Pipeline 100% selbstheilend.           |                |
| 2026-05-18  | Hashtag-Dopplung in IG-Caption gefixt: WF-02        | Claude / Thomas|
|             | schreibt nur reine Caption in field_10, Hashtags    |                |
|             | nur in field_7. WF-03 hängt für IG einmalig dran.   |                |
| 2026-06-08  | WF-02 v18.3 live: variable Praxis-Fotos pro Content | Claude / Thomas|
|             | via SP-Foto-Branch + GitHub-Push + Fallback-Kaskade.|                |
|             | Tests mit PF-2026-010/-011/-017 erfolgreich.        |                |
| 2026-06-08  | WF-01 v2 live: Teams-Card mit Item-ID + Foto-       | Claude / Thomas|
|             | Reminder an Judith nach jeder Formular-Einreichung. |                |
|             | HTTP-Response liefert item_id ans Formular zurück.  |                |
| 2026-06-21  | Formular v4 live: Material-Quelle (Foto/Video/      | Claude / Thomas|
|             | Stock/Ohne) + Sofort-Posten-Checkbox. WF-01 v4 +    |                |
|             | neue SP-Spalte `Sofort_Posten` (Bool). HWG-/Karenz- |                |
|             | Bypass via FilterKZ in WF-03 v7 (Spec).             |                |
| 2026-06-21  | Workflow-Chain live: WF-01 → WF-02 direkt nach SP-  | Claude / Thomas|
|             | Eintrag (Execute-Workflow-Node nach Teams-Notify),  |                |
|             | WF-02 hat Execute-Workflow-Trigger parallel zum     |                |
|             | Cron. End-to-End-Test grün mit Item #68. Wartezeit  |                |
|             | für Caption+Bild reduziert von ~1h auf ~2s.         |                |
| 2026-06-21  | n8n-Workflow-JSONs versioniert in `02_n8n-Work-     | Claude / Thomas|
|             | flows/`, Pre-Eingriff-Snapshots in `_Backups/`.     |                |
|             | Rollback per `n8n import:workflow` aus Backup-JSON. |                |
