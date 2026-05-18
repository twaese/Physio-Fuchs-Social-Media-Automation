# Archiv-Workflows – ältere Versionen

Hier liegen vorherige Versionen der n8n-Workflows, die durch eine neuere
Version im Root abgelöst wurden. Die aktuellen aktiven Versionen liegen
weiterhin in `/Volumes/Physio_Fuchs/SocialMedia/` (Repo-Root).

**Anders als der `_Archiv/`-Ordner** (der read-only ist und auch im Git
ignoriert wird) ist `_Archiv-Workflows/` Teil des Repos und versioniert.

---

## Welche Version ist aktiv?

| WF    | Aktive Version (Root)                          | Im Archiv (hier)                                                                                            |
| ----- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| WF-00 | `PF_WF-00_Datum_Initialbefllung_v1.json`       | –                                                                                                           |
| WF-01 | `PF_WF-01_Formular_SharePoint_v1.json`         | –                                                                                                           |
| WF-02 | `PF_WF-02_Caption_Generator_v17.json`          | `PF_WF-02_Caption_Generator_v16.json`                                                                       |
| WF-03 | `PF_WF-03_Social_Media_Post_v5.json` *)        | `PF_WF-03_Social_Media_Post_v2.json`, `_v3.json`, `_v4.json`                                                |
| WF-04 | `PF_WF-04_Monats_Scheduler_v1.json`            | –                                                                                                           |
| WF-08 | `PF_WF-08_Canva_OAuth_v2.json`                 | `PF_WF-08_Canva_OAuth_v1.json`                                                                              |

*) WF-03 v5 ist die aktuelle Version, aber wegen MCP-Connector-Problem
nicht produktiv. WF-03 v6 (mit direkter Canva REST API) ist in Planung,
siehe `SESSION-Naechste-Schritte_2026-05-15.md`.

---

## Warum getrennt von `_Archiv/`?

- `_Archiv/` (Repo-Root, im `.gitignore`): historische Workflows von vor
  der aktuellen Strukturierung, teils mit veralteten Klartext-Secrets.
  Nicht im Git.
- `_Archiv-Workflows/` (dieser Ordner): saubere ältere Versionen ohne
  Secrets, im Git versioniert für Rollback und Vergleich.

---

## Rollback auf eine ältere Version

Falls eine aktuelle Version Probleme macht und du auf eine ältere
zurückwillst:

1. Die aktuelle Version aus dem Root sicherheitshalber als Backup ablegen
   (z.B. `cp PF_WF-XX_v17.json _Archiv-Workflows/`).
2. Die gewünschte ältere Version aus `_Archiv-Workflows/` zurück ins
   Root kopieren oder verschieben.
3. In n8n den Workflow neu importieren.
4. Aktivieren.

---

## Was hier NICHT abgelegt wird

- `*.bak`-Dateien (im `.gitignore`)
- Test-Workflows
- Workflows mit hartkodierten Klartext-Secrets (vor Archivierung in
  `~/secrets/physio-fuchs/.env` migrieren oder Secrets revoken)
