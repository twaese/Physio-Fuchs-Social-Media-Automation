# Codex-Uebergabe: Video-Workflow fuer Physio Fuchs Social Media

Stand: 2026-06-12

Diese Datei uebernimmt den Claude-Stand vom 2026-06-08 und fuehrt ihn in den neuen Codex-Arbeitsbereich fuer Videos, Reels und Stories weiter.

## Ausgangspunkt aus Claude

Die bisherige Pipeline war vor allem fuer Foto-Posts aufgebaut:

- `WF-01`: Formular, SharePoint und Teams-Reminder.
- `WF-02 v18.3`: Caption-/Post-Generator mit variablem Praxis-Foto.
- `WF-03 v6`: Social-Media-Post-Ausgabe.
- Canva-/HTML-Templates mit `{{BACKGROUND_PHOTO}}`.
- Foto-Fallback: Item-Foto, Stock-Foto, Default-Foto.

Der Stand ist dokumentiert in:

`00_NAS_Import/SocialMedia/SESSION-Naechste-Schritte_2026-06-08.md`

Die uebernommenen Workflow-Dateien liegen jetzt unter:

- `05_Workflows_Automation/n8n-Dokumentation/`
- `05_Workflows_Automation/n8n-JSON/`
- `05_Workflows_Automation/Formulare_HTML/`

## Neuer Schwerpunkt mit Codex

Codex uebernimmt ab jetzt den Video-Strang:

1. Rohvideo in OneDrive ablegen.
2. Video technisch und inhaltlich analysieren.
3. Reel-/Story-Idee ableiten.
4. Rough Cut erstellen.
5. Hook, Text-Overlays, Caption, CTA und Hashtags vorbereiten.
6. Canva-Umsetzung begleiten.
7. Export und Posting-Unterlagen ablegen.

Der aktive Videobereich ist:

`Reels_Stories/`

## Standardstruktur pro Video

Jedes Video-Projekt bekommt einen eigenen Ordner:

```text
Reels_Stories/
  YYYY-MM-DD_DATEINAME/
    01_Rohmaterial/
    02_Auswahl_Standbilder/
    03_Canva/
    04_Captions_Texte/
    05_Export_fertig/
```

### Ordnerlogik

- `01_Rohmaterial/`  
  Originalvideo, Technikdaten, Shotlist und Timecodes.

- `02_Auswahl_Standbilder/`  
  Standbilder, Kontaktboegen, Cover-Optionen und visuelle Auswahl.

- `03_Canva/`  
  Canva-Briefing, Designlinks, Brand-Kit-Hinweise und Umsetzungsschritte.

- `04_Captions_Texte/`  
  Hook, Storyline, Caption, CTA, Hashtags und Postingtext.

- `05_Export_fertig/`  
  Rough Cuts, finale Exporte, Exportcheckliste und ggf. Preview-Dateien.

## Erstes Video-Projekt: IMG_7858

Projektordner:

`Reels_Stories/2026-06-13_IMG_7858/`

Vorhandene Arbeitsdateien:

- Rohvideo: `01_Rohmaterial/IMG_7858.MOV`
- Technikdaten: `01_Rohmaterial/video_technik.txt`
- Shotlist: `01_Rohmaterial/shotlist_mit_timecodes.md`
- Standbildnotizen: `02_Auswahl_Standbilder/standbild_export_notizen.md`
- Canva-Uebergabe: `03_Canva/Canva_Uebergabe.md`
- Canva-Briefing: `03_Canva/Canva_Vorlage_Briefing.md`
- Social-Media-Paket: `04_Captions_Texte/Social_Media_Paket_IMG_7858.md`
- Exportcheckliste: `05_Export_fertig/Export_Checkliste.md`

Wichtigster aktueller Videoexport:

`05_Export_fertig/IMG_7858_reel_roughcut_originalton_timed_text_clean_v2.mp4`

Dieser Export ist die bereinigte Version mit Originalton und getakteten Texteinblendungen. Die fruehere Version mit ueberlappendem Text sollte nicht mehr verwendet werden.

## Canva-Stand fuer IMG_7858

Canva Brand Kit:

`Physio Fuchs`

Bekannter Canva-Designlink:

`https://www.canva.com/design/DAHMWwjuGsk/woKnwR1W8JQT7fh40BVBfQ/edit`

Wichtiger Hinweis:

In Canva sollten keine alten statischen Textfelder ueber dem Video stehen, wenn bereits ein Video mit eingebrannten getakteten Texten verwendet wird. Sonst entstehen Textueberlappungen.

Empfohlener Canva-Ablauf:

1. Neue oder bereinigte Reel-Seite im Format 1080 x 1920 verwenden.
2. Video als Vollflaechen-Element platzieren.
3. Brand Kit `Physio Fuchs` fuer Farben und Schrift nutzen.
4. Wenn das Video bereits Text enthaelt: keine weiteren Canva-Textfelder auf das Bild legen.
5. Optional dezentes Musikbett in Canva ergaenzen.
6. Export als MP4 fuer Instagram Reel.

## Text- und Caption-Logik

Die bisherigen Prompt-Grundlagen liegen unter:

`02_Textbausteine_Prompts/`

Relevante Dateien:

- `Caption.md`
- `Hashtags.md`
- `Reel-Skript.md`
- `Story.md`
- `HWG-Blacklist.md`

Fuer Videos werden diese Vorlagen nicht 1:1 als Foto-Post genutzt, sondern als redaktionelle Grundlage fuer:

- Reel-Hook
- Text-Overlays
- Caption
- CTA
- Hashtags
- Story-Variante

## Posting-Logik

Fuer ein fertiges Reel sollte pro Projekt mindestens vorliegen:

- finale MP4-Datei
- Caption
- CTA
- Hashtags
- Cover-/Standbildauswahl
- Canva-Link
- kurzer interner Freigabestatus

Empfohlener Statusfluss:

```text
Rohmaterial erhalten
Analyse fertig
Rough Cut erstellt
Canva umgesetzt
Caption fertig
Freigabe offen
Freigegeben
Gepostet
Archiviert
```

## Verbindung zur alten Automation

Die bestehende Foto-Automation bleibt zunaechst unveraendert. Video/Reel wird als neuer manueller oder halbautomatischer Strang ergaenzt.

Moegliche spaetere Erweiterung:

- Formular um Video-Upload erweitern.
- SharePoint-Liste um Felder fuer Reel/Story ergaenzen.
- WF-02 um Video-spezifische Caption- und Hook-Generierung ergaenzen.
- WF-03 um Reel-Export-/Canva-Status ergaenzen.
- Eigener `WF-Video-Reel` fuer Rohmaterial, Analyse, Canva-Briefing und Caption-Paket.

Aktueller Workflow fuer Video-Captions:

```text
Content_Socialmedia/05_Workflows_Automation/n8n-JSON/PF_WF-05_Reel_Caption_Generator.json
```

Der Workflow liest `Status = Video eingegangen`, schreibt Caption/Hashtags/Textpaket zurueck und setzt danach `Status = KI-Texte fertig`. Kein Posting.

## Offene Entscheidungen

1. Soll `Reels_Stories/` der fuehrende Ort fuer alle Video-Projekte bleiben?
2. Soll `Videos/Reels/2026/` nur als fertiger Exportpool genutzt werden?
3. Wie wird der Foto-Pool `SP-Praxis-Fotos` neu angebunden, nachdem der alte NAS-Symlink ausgeschlossen wurde?
4. Soll Canva die finale Textgestaltung uebernehmen oder sollen Text-Overlays bevorzugt direkt in den Rough Cut eingebrannt werden?
5. Soll ein eigener n8n-Workflow fuer Video-Reels aufgebaut werden?

## Naechster sinnvoller Schritt

Fuer `IMG_7858`:

1. Bereinigten Export `IMG_7858_reel_roughcut_originalton_timed_text_clean_v2.mp4` in Canva nutzen.
2. In Canva pruefen, dass keine ueberlappenden statischen Textfelder aktiv sind.
3. Musikbett dezent ergaenzen.
4. Caption aus `Social_Media_Paket_IMG_7858.md` finalisieren.
5. Freigabe- und Postingstatus in der Projekt-README dokumentieren.
