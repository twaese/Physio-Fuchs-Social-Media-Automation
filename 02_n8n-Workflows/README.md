# n8n-Workflows – Übersicht

Dokumentation aller n8n-Workflows für den Physio Fuchs Social-Media-Workflow.
Die JSON-Definitionen liegen im Projekt-Root (`/Volumes/Physio_Fuchs/SocialMedia/`),
diese Markdowns beschreiben Zweck, Trigger, Nodes und Felder.

---

## Workflow-Liste

| ID    | Name                            | JSON-Datei                                  | Zweck                                                   |
| ----- | ------------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| WF-00 | Datum-Initialbefüllung          | `PF_WF-00_Datum_Initialbefllung_v1.json`    | Einmaliges Befüllen leerer Datumsfelder im SP-Kalender  |
| WF-01 | Formular → SharePoint + Teams   | `PF_WF-01_v2_Konsolidiert.json`             | Webhook-Empfang, neues SP-Item mit Status `Entwurf`, Teams-Card mit Item-ID + Foto-Reminder an Judith |
| WF-02 | Caption-Generator + Bild + GitHub-Push | `PF_WF-02_Caption_Generator_v18.3.json` | LLM-Caption, Foto-Branch (variables Praxis-Foto), Gotenberg-Render (IG+FB), GitHub-Push als public Bild-Hosting, HWG-Filter, Status→Bereit |
| WF-03 | Social Media Post (Karenz + Posting) | `PF_WF-03_Social_Media_Post_v6.json`      | Karenz 24h, Schedule-Check, Meta Graph Posting IG+FB, SP-Status→Veröffentlicht |
| WF-04 | Monats-Scheduler Standard-Post  | `PF_WF-04_Monats_Scheduler_v1.json`         | Plant 1× pro Monat einen Standard-Feed-Post auf freien Tag |

**Archivierte Workflow-Versionen** liegen in `_Archiv-Workflows/` (im Git
versioniert, mit eigener README). **Sehr alte Workflows** vor der
aktuellen Strukturierung liegen in `_Archiv/` (read-only, nicht im Git).

---

## Datenfluss (Stand 2026-05-17, Vollautomatik)

### Standard-Pipeline (Tipp / Standard / FAQ / Promo / Aktion / etc.)

```
Judith ──► HTML-Formular ──► WF-01 ──► SharePoint (Status: Entwurf)
                                          │
                                  WF-02 v18.3 (stündl. Cron, 1 Item/Lauf):
                                  - Claude erzeugt Caption + Hashtags
                                  - HWG-Filter → bei Treffer: Status `Geblockt` + Teams-Alert
                                  - HTML-Template + Gotenberg → IG+FB PNG
                                  - GitHub-Push → public raw.githubusercontent URLs
                                  - SP-Upload (Audit-Backup)
                                  - Status: Bereit
                                          │
                                          ▼ 24h-Karenz läuft
                                          │
                                  WF-03 v6 (stündl. Cron, 1 Item/Lauf):
                                  - FilterKZ prüft: Karenz erfüllt + Datum erreicht
                                  - IG: Container → Wait 15s → Publish
                                  - FB: Photo → Hashtag-Comment (1. Kommentar)
                                  - Status: Veröffentlicht + IG-Post-ID
```

### Reel / Übung / Story

```
Judith ──► HTML-Formular ──► WF-01 ──► SharePoint (Status: Entwurf)
                                          │
                                  WF-02 v18.3 Avatar-Skip:
                                  - Validate: continue → kein Processing
                                  - Item bleibt im Status `Entwurf`, wartet auf Avatar-Pipeline
                                          │
                                          ▼
                                  (geplant Track 2: D-ID Avatar + Voice-Clone)
                                  AVATAR_ENABLED-Flag aktiviert dann eigenen Branch
```

**Sicherheitsnetze (statt manueller Freigabe):**
1. **HWG-Filter** in WF-02 (Heilversprechen-Blacklist) → Status `Geblockt`
2. **24h-Karenz** in WF-03 (Filter Karenz+Schedule) → Judith kann während Karenz manuell zurückziehen

WF-04 (Monats-Scheduler) und Auto-Release-Mechanismen sind in der aktuellen Vollautomatik-Architektur **nicht mehr aktiv** — die manuellen Workflows wurden in den letzten Sessions durch HWG-Filter + Karenz ersetzt. WF-04-Doku bleibt vorerst für Referenz/Rollback liegen.

---

## Konventionen

### Naming
- Dateinamen: `PF_WF-<NN>_<ShortName>_v<X>.json`
- Workflow-Name in n8n: `PF – WF-<NN> <Anzeigename>`
- Webhook-Pfade: `pf-wf<NN>-<thema>` (lowercase, bindestrich-separiert)

### Credentials (Platzhalter, nicht echte Werte!)
| Name (in n8n)                       | Verwendet in              |
| ----------------------------------- | ------------------------- |
| `PF Microsoft SharePoint account`   | WF-01, WF-02, WF-03       |
| `PF Microsoft Teams`                | WF-01, WF-02 (HWG-Alert)  |
| `PF Anthropic` (Claude)             | WF-02                     |
| `PF Facebook Graph account`         | WF-03 (IG+FB Posting)     |

### Env-Vars (`/docker/n8n/.env`)
| Name              | Verwendet in           |
| ----------------- | ---------------------- |
| `GITHUB_TOKEN`    | WF-02 GitHub-Push      |
| `FB_PAGE_ID`      | WF-03 FB-Posting       |
| `META_APP_ID`     | WF-03 (Referenz)       |

**Wichtig:** Nach Env-Tausch immer `docker compose up -d --force-recreate n8n` (restart reicht NICHT).
Echte Tokens **nur** im n8n Credential Store bzw. in der `.env`, niemals in JSON oder hier.

### Sticky Notes in n8n
Jeder Workflow startet mit einer großen gelben Sticky-Note, die enthält:
- Zweck
- Trigger
- Status-Effekt (welcher Status wird gesetzt)
- Abhängigkeiten zu anderen Workflows

### Fehler-Handling
- Jeder Workflow hat einen `Error Trigger`-Subflow oder einen
  `On Error`-Branch, der eine Teams-Nachricht an Thomas schickt.
- Retries: 3× mit 30 s Pause für externe APIs (Canva, Meta).

---

## Reihenfolge der Doku-Dateien

- `WF-00_Datum-Initialbefuellung.md`
- `WF-01_Formular-SharePoint.md`
- `WF-02_Caption-Generator.md`
- `WF-03_Social-Media-Post.md`
- `WF-04_Monats-Scheduler-Standard-Post.md`

---

## Roadmap

- **WF-02 v19**: paired-items-Refactor → Multi-Item-Modus (mehrere Posts pro Cron-Lauf)
- **WF-02 v20 / WF-Avatar**: D-ID-Avatar-Branch live (Reel/Übung/Story) — bisher übersprungen
- **WF-03 v7**: LinkedIn als 3. Plattform (sobald LinkedIn-Template fertig)
- WF-05: Insights-Sync (Reach/Likes/Saves zurück in SharePoint)
- WF-06: Kommentar-Monitor (DM/Comment-Triage in Teams)
