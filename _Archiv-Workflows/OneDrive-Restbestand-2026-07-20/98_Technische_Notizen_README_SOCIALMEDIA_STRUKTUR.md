# Physio Fuchs Social Media - Ordnerstruktur

Stand: 2026-06-12

Diese Struktur fuehrt den bisherigen NAS-Bestand und die neue OneDrive-Ablage zusammen. Der Ordner `00_NAS_Import` bleibt als unveraenderte Importkopie erhalten und dient als Rueckverweis.

## Aktive Arbeitsbereiche

- `Reels_Stories/`  
  Laufende Reel- und Story-Produktionen mit Rohmaterial, Canva-Dateien, Caption-Texten und finalen Exporten.

- `Fotos/`  
  Foto-Pool fuer echte Praxis- und Social-Media-Bilder.

- `Videos/`  
  Allgemeiner Videopool, getrennt nach Reels und Stories.

- `Instafotos Stock/`  
  Vorhandene Bildmotive und Stock-/Praxisbilder fuer Instagram.

## Redaktion und Marke

- `01_Strategie_Konzept/`  
  Tonalitaet, Workflow-Konzept, Status-Flow und Feed-Post-Standards.

- `02_Textbausteine_Prompts/`  
  Caption-, Hashtag-, Story-, Reel- und Freigabe-Prompts inklusive HWG-Blacklist.

- `03_Redaktionsplanung/`  
  Redaktionsplan und Content-Planung.

- `04_Canva_Vorlagen/`  
  Canva-Vorlagen, HTML-Templates, generierte Beispielposts und Asset-Hinweise.

## Technik und Automatisierung

- `05_Workflows_Automation/`  
  n8n-Dokumentation, aktuelle Workflow-JSONs und Formular-HTMLs.

- `06_SharePoint_Dokumentation/`  
  SharePoint-Schema, Feldmapping und Berechtigungen.

- `98_Technische_Notizen/`  
  Technische Notizen aus dem alten Arbeitsbereich, z. B. AGENTS/CLAUDE-Hinweise.

## Recht, Formate und Archiv

- `07_Recht_DSGVO/`  
  DSGVO, Einverstaendnisse und Heilmittelwerbe-Hinweise.

- `08_Avatar_Reel_Konzepte/`  
  Avatar- und Reel-Konzepte sowie Aufnahme-Anleitungen.

- `09_Instagram_Highlights/`  
  Highlight-Symbole fuer Instagram.

- `90_Archiv/`  
  Alte Workflows und sonstige Altbestaende.

- `99_Sessions_Dokumentation/`  
  Session-Zusammenfassungen und naechste Schritte aus der frueheren NAS-Arbeit.

## Importnotiz

Importquelle:
`/Volumes/Physio_Fuchs/SocialMedia`

Importkopie:
`00_NAS_Import/SocialMedia`

Bewusst nicht uebernommen wurden `.git`, `.claude`, `99_Platzhalter-Secrets`, `.DS_Store` und der Symlink `04_Canva-Vorlagen/SP-Praxis-Fotos`.

Der Symlink `SP-Praxis-Fotos` zeigte auf einen anderen OneDrive-Pfad und sollte separat entschieden werden.
