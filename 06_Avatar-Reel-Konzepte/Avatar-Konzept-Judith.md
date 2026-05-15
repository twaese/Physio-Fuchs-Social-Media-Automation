# Avatar-Konzept – Judith Fuchs

Stand: 2026-05-14

Ziel: Judith soll als wiederkehrende „digitale Sprecherin" auftreten,
ohne jedes Mal selbst vor der Kamera stehen zu müssen.
Einsatzbereiche: „Übung der Woche", „3 Tipps", FAQ-Antworten,
saisonale Hinweise.

---

## 1. Grundidee

Ein **persönlicher KI-Avatar** mit Judiths echtem Gesicht und ihrer
echten Stimme („Voice Clone") spricht kurze Reels (15–45 Sek.).
Die Inhalte werden in n8n + Claude vorbereitet (Skript) und über
ein Avatar-Tool in MP4 gerendert.

Wichtig:
- Avatar ist **klar als digitale Darstellung** erkennbar (Hinweis im
  Video-/Caption-Text), um Vertrauen nicht zu beschädigen.
- Avatar darf **niemals** Diagnosen oder Heilversprechen aussprechen.
- Avatar wird nur für **eigene Inhalte** verwendet, nicht für
  Patient:innen-Aussagen oder Testimonials.

---

## 2. Tool-Optionen (zum Vergleich)

| Tool           | Stärken                                  | Schwächen / Risiken                         | DSGVO-Hosting          |
| -------------- | ---------------------------------------- | ------------------------------------------- | ---------------------- |
| **HeyGen**     | sehr realistisch, gute API, Voice-Clone  | US-Hosting, AVV nötig                       | EU-Server optional     |
| **Synthesia**  | Enterprise-grade, Avatar-Studio, AVV     | teurer, weniger spontan                     | EU-Server (UK/EU)      |
| **D-ID**       | sehr schnell, gut für „Sprechende Bilder"| weniger natürlich bei langen Sätzen         | US-Hosting             |
| **ElevenLabs + Wav2Lip** (Eigenbau) | volle Kontrolle           | viel Eigenarbeit, weniger stabil             | flexibel               |

**Empfehlung als Start:** HeyGen oder Synthesia,
beide mit AVV (Auftragsverarbeitungsvertrag) und EU-Hosting-Option.

---

## 3. Setup-Schritte (einmalig)

1. **Auswahl** des Tools (Entscheidung Thomas/Judith)
2. **AVV** abschließen, in `07_Datenschutz-DSGVO/` ablegen
3. **Trainingsvideo** mit Judith aufnehmen:
   - 3–5 Min., neutraler Hintergrund
   - klare Aussprache, ruhige Mimik
   - verschiedene Tonlagen (freundlich, ernst, motivierend)
4. **Voice Clone** anlegen (10–30 Min. saubere Audio-Aufnahme)
5. **Schriftliche Einwilligung** Judith → Avatar-Nutzung
   (Vorlage: `07_Datenschutz-DSGVO/Einverstaendniserklaerungen.md`)
6. **Kennzeichnungs-Element** im Canva-Reel-Cover hinterlegen
   (z. B. kleines Label „🤖 Digitaler Avatar")

---

## 4. Markenrichtlinien für den Avatar

- **Outfit** in Markenfarbe oder dezent neutral, nie schreiende Muster
- **Hintergrund** entweder echter Praxisraum (Standbild) oder generisches
  helles Setting; kein offensichtlich KI-generiertes Setting
- **Mimik** ruhig, freundlich, max. ein Lächeln pro Satz
- **Gestik** Hände sichtbar, betont Zahlen mit Fingern
- **Sprechtempo** ca. 130–140 Wörter/Min.
- **Pausen** zwischen Bausteinen → 0,3 Sek. eingebaut

---

## 5. Inhaltliche Leitplanken

| Inhalt                              | Avatar erlaubt? | Hinweis                              |
| ----------------------------------- | --------------- | ------------------------------------ |
| Übungsanleitungen (allgemein)       | ja              | mit Vorsichts-Satz                   |
| FAQ-Antworten                       | ja              |                                      |
| Mythen-Aufklärung                   | ja              |                                      |
| Praxis-Aktion / Saison-Hinweis      | ja              |                                      |
| Mitarbeiter:innen-Vorstellung Dritter| **nein**       | echte Person, keine Avatar-Darstellung |
| Patient:innen-Stimmen               | **nein**        | nie als Avatar; nur echte Personen mit Einwilligung |
| Diagnostische Aussagen              | **nein**        | grundsätzlich nicht, weder Avatar noch real |

---

## 6. Pipeline (vereinfacht)

```
1. Skript-Generierung
   01_Prompts/Reel-Skript.md  →  Claude/LLM
                                   │
                                   ▼
2. Skript-Freigabe durch Judith    │
                                   ▼
3. Avatar-Render (Tool-API)        │
   - Skript (TXT) + Avatar-ID + Voice-ID + Hintergrund-Setting
   - Output: MP4 720p oder 1080p
                                   │
                                   ▼
4. Untertitel (.srt) erzeugen
   (manuell oder via Tool, "Burn-In" optional)
                                   │
                                   ▼
5. Cover-Frame in Canva
   PF_Reel_Cover, Headline + Avatar-Standbild
                                   │
                                   ▼
6. Upload nach SharePoint/OneDrive
   field_9 = Vorschau-URL
                                   │
                                   ▼
7. Posting via Meta Graph API (Reels-Endpoint)
```

---

## 7. Kosten / Quoten (Richtwerte)

| Tool       | Modell                       | Anhaltspunkt                            |
| ---------- | ---------------------------- | --------------------------------------- |
| HeyGen     | Creator-Plan                 | mehrere Minuten/Monat im Abo            |
| Synthesia  | Personal/Enterprise          | Minuten-basiert, höher                  |
| ElevenLabs | Voice-Clone Add-on           | nach Zeichen / Audio-Minuten            |

Konkrete Tarife regelmäßig prüfen, sind in Bewegung.

---

## 8. Was im Repo gehört

- Konzept (diese Datei)
- Reel-Format-Definitionen (`Reel-Formate.md`)
- Avatar-bezogene Einwilligungs-Vorlagen
  (`../07_Datenschutz-DSGVO/Einverstaendniserklaerungen.md`)

**Was nicht hier liegen sollte:**
- Trainings-Videos / Original-Aufnahmen → eigener verschlüsselter Ordner
  in OneDrive
- Avatar-IDs / Voice-IDs / API-Keys → n8n-Credential-Store
