# Nächste Session – Avatar-Track (D-ID Test)

**Stand:** 2026-05-15, abends
**Letzter Punkt:** D-ID-Account angelegt, Onboarding durch, im Video-Studio.
Test wurde noch nicht gerendert (User-Pause).

---

## 1. Was bisher erreicht ist

| Schritt | Stand |
|---|---|
| Aufnahme-Anleitung für Judith erstellt | ✅ `06_Avatar-Reel-Konzepte/Aufnahme-Anleitung-Judith.md` |
| Trainings-Material-Ordner mit `.gitignore`-Schutz | ✅ `06_Avatar-Reel-Konzepte/Judith-Trainings-Material/` |
| Schriftliche Einwilligung Judith | ✅ (laut User vorliegend) |
| Messe-Videos analysiert + beste Frontal-Frames extrahiert | ✅ |
| Portrait für D-ID Talking Photo gecroppt | ✅ `Judith-Trainings-Material/_vorschau/judith_portrait_v3.jpg` (900×900, Kopf+Schultern, SpineFitter sichtbar) |
| HeyGen-Alternativen recherchiert | ✅ D-ID gewählt (~6 $/Monat statt 30 $) |
| D-ID Account angelegt + Onboarding durchgeklickt | ✅ |
| Erstes Test-Video gerendert | ⏳ offen |
| Lip-Sync-Qualität bewertet | ⏳ offen |
| Voice-Clone-Audio-Files geprüft (ist Judith Sprecherin?) | ⏳ offen |

---

## 2. Konkrete nächste Schritte

### 2.1 D-ID Test-Video rendern (10 Min)

1. studio.d-id.com → **Videostudio** → **Video erstellen** → **„Beginnen Sie mit einem leeren Blatt"**
2. Im Editor: Default-Presenter entfernen, **eigenes Foto hochladen**:
   ```
   /Volumes/Physio_Fuchs/SocialMedia/06_Avatar-Reel-Konzepte/Judith-Trainings-Material/_vorschau/judith_portrait_v3.jpg
   ```
3. Skript einfügen:
   > Hallo, mein Name ist Judith Fuchs. Ich bin Inhaberin der Physiotherapiepraxis Physio Fuchs. Heute zeige ich Ihnen eine einfache Übung gegen Rückenschmerzen im Büro.
4. Stimme: **Deutsch (Deutschland) → „Vicki"** (Fallback: Katja, Amala)
5. **„Generate Video"** → ~30 Sek warten → Vorschau ansehen.

### 2.2 Bewertung

Kriterien für „D-ID ist gut genug":
- Lip-Sync passt zum deutschen Text (kein nervöses Mund-Zucken)
- SpineFitter im Vordergrund **stört nicht** (er ist statisch, dürfte OK sein)
- Stimme klingt natürlich, nicht roboterhaft
- Bild bewegt sich nicht zu wild (Talking Photo bleibt Foto, nicht Fake-Bewegung)

### 2.3 Falls Test gut → Setup-Anleitung anlegen

Neue Datei `06_Avatar-Reel-Konzepte/D-ID-Setup.md`:
- Account-Setup-Schritte
- Foto-Anforderungen (Frontal, scharf, Augen offen, kein Schatten)
- Voice-Auswahl Deutsch
- Export-Workflow → in Repo `Judith-Trainings-Material/`
- Kosten + Free-Tier-Limits dokumentieren

### 2.4 Falls Test schlecht → Alternativen

Reihenfolge prüfen:
1. **HeyGen** (~30 $/Monat, trainierter Avatar aus 2-Min-Video, dann unbegrenzt) — Aufnahme-Anleitung steht schon
2. **Hedra Character-3** (kostenloses Tier, ähnlich D-ID)
3. **Pippit** (ByteDance, günstig)

### 2.5 Voice-Clone-Track (parallel, ElevenLabs)

Vor dem ElevenLabs-Upload prüfen:
- Sind die Audio-Files aus `voiceclone/IMG_3216_audio.wav` und `IMG_3627_audio.wav` wirklich **Judith** als Sprecherin oder eine andere Person? (User soll kurz reinhören)
- Falls Judith: → ElevenLabs Voice Clone aufsetzen (Free-Tier reicht für Test mit 1 Min)
- Falls jemand anderes: neue saubere Stimm-Aufnahme von Judith nötig (1 Min reicht)

---

## 3. Parallel offen (anderer Track)

Siehe `SESSION-Naechste-Schritte_2026-05-15.md` (Vormittags-Session):
- WF-03 v6 mit direkter Canva REST API statt Anthropic+MCP (MCP-Connector liefert 401)
- Alten Anthropic-Key (`...MgAA`) revoken sobald neuer Key überall läuft

---

## 4. Sicherheits-Reminder

- PAT-Token war kurz im Screenshot sichtbar → bei Gelegenheit rotieren (Settings → Developer settings → Personal access tokens)
- Avatar-Videos und Audio-Files bleiben **lokal** (`.gitignore` schützt den Ordner)

---

## 5. Onboarding-Prompt für nächste Avatar-Session

> Working directory: `/Volumes/Physio_Fuchs/SocialMedia/`.
> Lies zuerst `CLAUDE.md`, dann `SESSION-Naechste-Schritte_2026-05-15_Avatar.md`.
> Wir machen heute den D-ID Talking-Photo-Test mit `judith_portrait_v3.jpg`
> und der Vicki-Stimme. Falls schon getestet: Ergebnis bewerten und ggf.
> Setup-Anleitung anlegen oder Alternative (HeyGen) testen.

---

## 6. Änderungshistorie

| Datum       | Änderung                                  | Wer    |
| ----------- | ----------------------------------------- | ------ |
| 2026-05-15  | Initial – Avatar-Track-Stand dokumentiert | Claude |
