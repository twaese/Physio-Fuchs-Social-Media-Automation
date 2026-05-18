# Prompt: Reel-Skript

Verwendet in: WF-03 für Instagram- und Facebook-Reels.
Ziel: 15–45 Sekunden Video, geeignet für Avatar-Sprecher (Judith) **oder**
echte Aufnahme.

---

## System-Prompt

```
Du bist ein Reel-Drehbuch-Autor für die Physiotherapiepraxis "Physio Fuchs".
Inhaberin Judith Fuchs ist die Sprecherin – entweder real vor der Kamera
oder als digitaler Avatar.

Reel-Regeln:
- Länge: 15–45 Sekunden (max. 90 Wörter Sprechtext)
- Hook in den ersten 3 Sekunden, sonst scrollt das Publikum weg
- Eine klare Botschaft pro Reel
- Visuelle Wechsel alle 2–3 Sekunden
- Kein Heilversprechen, keine Diagnose, keine Patient:innen-Daten
- Sprache: Deutsch, "du"-Form ist erlaubt (Reel ist casual)
- Untertitel zwingend (Sound-off-Tauglichkeit)
- Endet mit klarem CTA
```

---

## User-Prompt-Vorlage

```
Erstelle ein Reel-Skript zu folgendem Thema:

- Thema: {{THEMA}}
- Reel-Format: {{FORMAT}}             # "Übung der Woche", "Mythos-Check",
                                      # "3 Tipps", "Behind the Scenes",
                                      # "Praxis-Tour", "FAQ-Antwort"
- Hauptbotschaft: {{BOTSCHAFT}}
- Ziel: {{ZIEL}}                      # Speichern, Teilen, DM, Termin
- Sprecher:in: {{SPRECHER}}           # "Judith real" oder "Judith Avatar"
- Avatar-Tool: {{AVATAR_TOOL}}        # leer, "HeyGen", "Synthesia", "D-ID"
- Länge: {{LAENGE_SEC}} Sek.
- Spezielle Wünsche: {{NOTIZEN}}

Liefere folgende Bausteine:

1. TITEL (max. 60 Zeichen, wird auch im Cover-Frame verwendet)

2. HOOK (Sprechtext + visuelle Anweisung, 0–3 Sek.)

3. STORYBOARD als Tabelle:
| Sek. | Sprechtext | Visuelles | On-Screen-Text |
|------|-----------|-----------|----------------|
| 0–3  | …         | …         | …              |
| 3–8  | …         | …         | …              |
| …    | …         | …         | …              |

4. CTA (letzte 2 Sek.: Sprechtext + visuell)

5. UNTERTITEL-VOLLTEXT (wortwörtlich, für SRT-Datei oder Auto-Caption)

6. AVATAR-PROMPT (nur wenn Sprecher = "Judith Avatar")
   Stichworte für das Avatar-Tool:
   - Pose / Gestik
   - Stimmung
   - Hintergrund
   - Outfit
   - Tonalität (ruhig, motivierend, …)

7. COVER-FRAME (Vorschlag für Standbild + Cover-Text, max. 6 Wörter)

8. HASHTAGS (8–15 Stück, einer davon Format-spezifisch wie #ReelderWoche)
```

---

## Beispiel-Output (Format „3 Tipps", 30 Sek., Avatar)

```
1. TITEL
3 Tipps gegen den Bürorücken

2. HOOK
Sprechtext: "Sitzt du auch zu lange? Diese 3 Tipps brauchst du jetzt."
Visuell: Judith-Avatar hebt den Zeigefinger, Mimik: freundlich-entschlossen.

3. STORYBOARD
| Sek. | Sprechtext                                           | Visuelles                              | On-Screen-Text       |
|------|------------------------------------------------------|----------------------------------------|----------------------|
| 0–3  | Sitzt du auch zu lange? Diese 3 Tipps brauchst du.   | Avatar Judith, Praxis-Hintergrund      | "3 Tipps. Bürorücken"|
| 3–10 | Tipp 1: Bildschirm auf Augenhöhe. Ohne Buckel.       | Cut zu Schreibtisch-Setup, Hand zoomt  | "1 · Bildschirm hoch"|
| 10–18| Tipp 2: Alle 30 Minuten kurz aufstehen, Schultern.   | Person steht auf, dreht Schultern      | "2 · Alle 30 Min auf"|
| 18–26| Tipp 3: Trink Wasser. Klingt simpel, wirkt unterstützend. | Glas Wasser, Detailaufnahme         | "3 · Wasser trinken" |
| 26–30| Speichere dir das Reel und teile es deiner Kollegin. | Avatar Judith winkt, Logo wird sichtbar| "💾 Speichern"        |

4. CTA
Sprechtext: "Speichere dir das Reel und teile es deiner Kollegin."
Visuell: Avatar Judith winkt, Logo "Physio Fuchs" wird unten eingeblendet.

5. UNTERTITEL-VOLLTEXT
"Sitzt du auch zu lange? Diese 3 Tipps brauchst du.
Tipp 1: Bildschirm auf Augenhöhe – ohne Buckel.
Tipp 2: Alle 30 Minuten kurz aufstehen und die Schultern kreisen.
Tipp 3: Trink Wasser. Klingt simpel, wirkt unterstützend.
Speichere dir das Reel und teile es deiner Kollegin."

6. AVATAR-PROMPT
- Pose: Halbtotale, leicht zur Kamera gewandt
- Gestik: Hände sichtbar, betont Zahlen mit Fingerzeichen
- Stimmung: ruhig, motivierend, leichtes Lächeln
- Hintergrund: heller Praxisraum, leicht unscharf
- Outfit: schlichtes T-Shirt in Markenfarbe
- Tonalität: warm, klare Aussprache, ca. 130 Wörter/Min.

7. COVER-FRAME
Standbild: Avatar Judith mit erhobener "3" (Drei-Finger-Geste)
Cover-Text: "3 Tipps gegen Bürorücken"

8. HASHTAGS
#PhysioFuchs #ReelderWoche #Bürogesundheit #Bürorücken #Physiotherapie
#Gesundheitstipp #Schreibtisch #Bewegungspause #PhysioTippp #PraxisFuchs
```

---

## Hinweise zur Avatar-Erzeugung

- Avatar-Tools (Auswahl, siehe `06_Avatar-Reel-Konzepte/Avatar-Konzept-Judith.md`):
  HeyGen, Synthesia, D-ID
- Judith braucht **einmalig** ein Trainingsvideo (3–5 Min., ruhige Sprache,
  neutraler Hintergrund) und gibt eine **schriftliche Einwilligung**
  zur Avatar-Nutzung (siehe `07_Datenschutz-DSGVO/Einverstaendniserklaerungen.md`).
- Stimme: lieber Voice-Clone der echten Judith als generische TTS-Stimme.
- Avatar-Output landet als MP4 in einem OneDrive-/SharePoint-Ordner und
  wird in `field_9` referenziert.
- Untertitel werden separat als `.srt` mitgeliefert.
