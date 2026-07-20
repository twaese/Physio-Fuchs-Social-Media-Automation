# Einsortierung NAS-Import

Stand: 2026-06-12

Der importierte NAS-Bestand wurde thematisch in die neue OneDrive-Struktur kopiert. Die Importkopie bleibt unter `00_NAS_Import/SocialMedia` erhalten.

## Zuordnung

| NAS-Quelle | OneDrive-Ziel |
| --- | --- |
| `00_Konzept/` | `01_Strategie_Konzept/` |
| `01_Prompts/` | `02_Textbausteine_Prompts/` |
| `05_Content-Planung/` | `03_Redaktionsplanung/` |
| `04_Canva-Vorlagen/` | `04_Canva_Vorlagen/` |
| `02_n8n-Workflows/` | `05_Workflows_Automation/n8n-Dokumentation/` |
| `PF_WF-*.json` | `05_Workflows_Automation/n8n-JSON/` |
| `physio_fuchs_*.html` | `05_Workflows_Automation/Formulare_HTML/` |
| `03_SharePoint/` | `06_SharePoint_Dokumentation/` |
| `07_Datenschutz-DSGVO/` | `07_Recht_DSGVO/` |
| `06_Avatar-Reel-Konzepte/` | `08_Avatar_Reel_Konzepte/` |
| `Symbole-Instagramm/` | `09_Instagram_Highlights/` |
| `_Archiv-Workflows/` | `90_Archiv/Workflows_alt/` |
| `_Archiv/` | `90_Archiv/Sonstiges_alt/` |
| `99_Sessions/` | `99_Sessions_Dokumentation/` |
| `AGENTS.md`, `CLAUDE.md`, `.gitignore`, Session-Hinweis | `98_Technische_Notizen/` |

## Nicht automatisch einsortiert

- `99_Platzhalter-Secrets/`: bewusst ausgeschlossen.
- `.git/` und `.claude/`: technische Arbeitsordner, bewusst ausgeschlossen.
- `SP-Praxis-Fotos`: war ein Symlink auf einen anderen OneDrive-Pfad und wurde bewusst nicht uebernommen.
