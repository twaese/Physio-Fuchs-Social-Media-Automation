# n8n-Workflows – Übersicht

Dokumentation aller n8n-Workflows für den Physio Fuchs Social-Media-Workflow.
Die JSON-Definitionen liegen im Projekt-Root (`/Volumes/Physio_Fuchs/SocialMedia/`),
diese Markdowns beschreiben Zweck, Trigger, Nodes und Felder.

---

## Workflow-Liste

| ID    | Name                            | JSON-Datei                                  | Zweck                                                   |
| ----- | ------------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| WF-00 | Datum-Initialbefüllung          | `PF_WF-00_Datum_Initialbefllung_v1.json`    | Einmaliges Befüllen leerer Datumsfelder im SP-Kalender  |
| WF-01 | Formular → SharePoint           | `PF_WF-01_Formular_SharePoint_v1.json`      | Webhook-Empfang, neues SP-Item mit Status `Entwurf`     |
| WF-02 | Caption-Generator               | `PF_WF-02_Caption_Generator_v17.json` (aktiv, v16 als Backup) | LLM erzeugt Caption + Hashtags + Bildbrief; Auto-Release-Branch für Standard-Posts ab v17 |
| WF-03 | Social Media Post               | `PF_WF-03_Social_Media_Post_v4.json`        | Canva-Grafik, Vorschau, Freigabe-Card, Posting          |
| WF-04 | Monats-Scheduler Standard-Post  | `PF_WF-04_Monats_Scheduler_v1.json`         | Plant 1× pro Monat einen Standard-Feed-Post auf freien Tag |

Alte Versionen liegen in `_Archiv/` (read-only, nicht löschen!).

---

## Datenfluss (vereinfacht)

### Wochenformat (Übung / Reel / Story)

```
Judith ──► HTML-Formular ──► WF-01 ──► SharePoint (Status: Entwurf)
                                          │
                                  WF-02 erzeugt Caption + Hashtags
                                          │  (Status bleibt Entwurf)
                                          ▼
                                  WF-03 Phase A erzeugt Canva-Design
                                          │  setzt Status: Bereit
                                          ▼
                                  Teams-Card an Judith
                                          │
                                  Judith klickt "Freigeben"
                                          │  Status: Freigegeben
                                          ▼
                                  WF-03 Phase C plant bei Meta ein
                                          │  Status: Geplant
                                          ▼
                                  WF-03 Phase D Live-Check
                                          │  Status: Veröffentlicht
```

### Monatlicher Standard-Feed-Post (automatisch via WF-04)

```
Cron 1. d. Monats ──► WF-04 sucht Kandidat im Pool
                        │  field_2 ∈ Standard-Post-Typen, Status: Entwurf,
                        │  field_4 leer
                        ▼
                      WF-04 lädt belegte Tage des Monats
                        │  (Reels/Stories/freigegebene Posts)
                        ▼
                      WF-04 wählt freien Dienstag (Fallbacks s. Doku)
                        │
                        ▼
                      SharePoint-Update: field_4 + field_5 + [AUTO_RELEASE]
                        │  Status bleibt Entwurf
                        ▼
                      WF-02 erzeugt Caption + Hashtags
                        │  Status: Bereit
                        ▼
                      WF-03 Phase B2 erkennt [AUTO_RELEASE]
                        │  Status direkt: Freigegeben (keine Teams-Card)
                        ▼
                      WF-03 Phase C/D wie oben → Veröffentlicht
```

Reels, Stories und `Übung` laufen **nie** über Auto-Release –
für sie gilt immer die manuelle Freigabe durch Judith.

---

## Konventionen

### Naming
- Dateinamen: `PF_WF-<NN>_<ShortName>_v<X>.json`
- Workflow-Name in n8n: `PF – WF-<NN> <Anzeigename>`
- Webhook-Pfade: `pf-wf<NN>-<thema>` (lowercase, bindestrich-separiert)

### Credentials (Platzhalter, nicht echte Werte!)
| Name (in n8n)               | Verwendet in              |
| --------------------------- | ------------------------- |
| `PF Microsoft SharePoint`   | WF-01, WF-02, WF-03       |
| `PF Microsoft Teams`        | WF-01, WF-03              |
| `PF Anthropic / OpenAI`     | WF-02, WF-03              |
| `PF Canva Connect`          | WF-03                     |
| `PF Meta Graph API`         | WF-03                     |

Echte Tokens **nur** im n8n Credential Store, niemals in JSON oder hier.

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

- WF-05: Insights-Sync (Reach/Likes/Saves zurück in SharePoint)
- WF-06: Kommentar-Monitor (DM/Comment-Triage in Teams)
- WF-07: Avatar-Render-Bridge (HeyGen-API → MP4 → SharePoint)
