# Judith Trainings-Material – HeyGen Avatar

Video-Files in diesem Ordner werden zum Trainieren des HeyGen-Avatars
und/oder ElevenLabs-Voice-Clones verwendet.

⚠️ **Diese Dateien sind via `.gitignore` aus dem Repo ausgeschlossen.**
Grund: Größe + personenbezogene Daten (Bild + Stimme von Judith).
Schriftliche Einwilligung von Judith liegt vor.

---

## Anforderungen für HeyGen Instant Avatar

| Kriterium       | Soll                                          |
| --------------- | --------------------------------------------- |
| Länge           | mindestens 2 Min, maximal 5 Min               |
| Auflösung       | mindestens 720p, ideal 1080p                  |
| Aspect Ratio    | 16:9 (Querformat) für Avatar-Training         |
| Gesicht         | frontal in Kamera, nicht halb-profil          |
| Mimik           | ruhig, freundlich, neutral                    |
| Sprache         | durchgehend sprechen, klare Aussprache        |
| Hintergrund     | ruhig, nicht ablenkend                        |
| Beleuchtung     | gleichmäßig, kein starker Schatten im Gesicht |
| Audio           | klar, kein Hall, kein Hintergrund-Geräusch    |

## Anforderungen für ElevenLabs Voice Clone (alternativ/zusätzlich)

| Kriterium       | Soll                                          |
| --------------- | --------------------------------------------- |
| Länge           | mindestens 1 Min reines Audio (3+ Min besser) |
| Audio-Qualität  | klar, ohne Hall, ohne Hintergrund-Geräusche   |
| Gesprochene Sprache | identisch zur späteren Caption-Sprache (Deutsch) |
| Tonlage         | ruhig, natürlich, kein Schreien/Flüstern      |

---

## Datei-Naming-Konvention

```
judith_<format>_<datum>_<dauer>_<beschreibung>.<ext>

Beispiele:
judith_avatar-training_2026-05-15_120sec_neutraler-hintergrund.mp4
judith_voiceclone_2026-04-30_180sec_praxis-erklaerung.wav
judith_b-roll_2026-03-12_30sec_uebung-rumpfstabilitaet.mov
```

---

## Was wo hin gehört

- `avatar-training/` – Frontal-Aufnahmen für HeyGen-Avatar-Training
- `voiceclone/` – reine Audio-Aufnahmen oder Audio-Extrakte für ElevenLabs
- `b-roll/` – B-Material für spätere Reels (Übungen, Praxis-Atmo)
- `unsorted/` – noch nicht gesichtet

---

## Workflow

1. Files in `unsorted/` ablegen
2. Claude Code analysiert Format, Länge, Audio (`ffprobe`)
3. Sortierung in die richtigen Unter-Ordner
4. Beste Files für HeyGen hochladen
5. Avatar trainieren → Avatar-ID nach `~/secrets/physio-fuchs/.env` als `HEYGEN_AVATAR_ID_JUDITH`
6. Optional: Voice-Clone bei ElevenLabs → `ELEVENLABS_VOICE_ID_JUDITH`
