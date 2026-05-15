# Konzept: Standard-Feed-Post (Instagram + Facebook)

Verbindliche Anatomie und Format-Regeln für klassische Feed-Posts (Bild + Caption)
außerhalb der Spezialformate „Übung der Woche", „Story" und „Reel".

Gilt für die Post-Typen: `Standard`, `Tipp`, `Zitat`, `FAQ`, `Praxis-News`,
`Aktion`, `Mitarbeiter:in`, `Behind-the-Scenes`, `Team`, `Promo`.

---

## 1. Anatomie eines Feed-Posts

| Block | Inhalt | Limit |
|---|---|---|
| **Hook** (Zeile 1) | Aufmerksamkeit, ohne „mehr anzeigen" lesbar | max. 80 Zeichen |
| **Body** | 2–4 kurze Absätze, ein Gedanke pro Absatz | max. 1500 Zeichen gesamt |
| **CTA** | genau ein konkreter Call-to-Action | 1 Satz |
| **Frage** | Einladung zur Interaktion am Ende | 1 Satz |
| **Disclaimer** (optional) | bei körperlichen Empfehlungen | 1 Satz |
| **Hashtags** | 5–10 Tags, fachlich + lokal gemischt | erster Kommentar (FB), Caption-Ende (IG) |

Generierung: System-Prompt und User-Vorlage in `01_Prompts/Caption.md`.

---

## 2. Bildformat

- **Maße:** 1080 × 1350 px (Portrait 4:5)
- **Begründung:** IG bevorzugt Portrait im Feed (mehr Bildschirmfläche, höheres
  Engagement). FB rendert Portrait-Bilder ebenfalls sauber.
- **Sicherheitszone:** mindestens 100 px Abstand zum oberen und unteren Rand
  für Profilanzeige-Overlap auf IG.
- **Vorlagen:** alle Standard-Feed-Templates in Canva liegen bereits in
  dieser Größe (`04_Canva-Vorlagen/Vorlagen-Uebersicht.md`).

---

## 3. Cross-Posting Instagram ↔ Facebook

Identisches Bild, identische Caption, identische Hashtags – aber:

- **Instagram:** Hashtags am Ende der Caption (5–10 Tags, durch Leerzeile vom
  Body getrennt).
- **Facebook:** Hashtags **nicht** in der Caption, sondern als **erster
  Kommentar** unter dem Post. FB-Algorithmus mag keine Hashtag-Wolken in der
  Caption, IG-Algorithmus braucht sie.

WF-03 v4 setzt das bereits um (Graph API `/comments`-Call nach `/feed`-Post).
Wenn das nicht zuverlässig läuft → Punkt in WF-03 Verifikations-Checkliste.

---

## 4. Post-Typ-Matrix

Übersicht: welcher Post-Typ nutzt welches Canva-Template, welche
typische Caption-Länge, welche Hook-Muster.

| Post-Typ (`field_2`) | Canva-Template | Caption-Länge | Hook-Beispiel |
|---|---|---|---|
| Standard | `PF_Feed_Standard` | 800–1200 Z. | „Was hilft Ihrem Rücken im Büroalltag wirklich?" |
| Tipp | `PF_Feed_Tipp` (oder `PF_Feed_Standard`) | 600–1000 Z. | „3 Mini-Übungen, die in jede Mittagspause passen" |
| Zitat | `PF_Feed_Zitat` | 200–400 Z. | „‚Bewegung ist die beste Medizin.' – Hippokrates" |
| FAQ | `PF_Feed_Standard` | 600–900 Z. | „Wie oft sollten Sie am Tag aufstehen?" |
| Praxis-News | `PF_Feed_Standard` | 500–800 Z. | „Ab April: neue Sprechzeiten am Freitag" |
| Aktion | `PF_Feed_Standard` | 500–800 Z. | „Neuer Kurs ab März: Rücken-Mobility am Donnerstag" |
| Mitarbeiter:in / Team | `PF_Feed_Team` | 400–700 Z. | „Heute stellen wir Ihnen Sarah aus dem Team vor" |
| Behind-the-Scenes | `PF_Feed_Standard` | 400–700 Z. | „So sieht ein Morgen in der Praxis aus" |
| Promo | `PF_Feed_Standard` (HWG-konform!) | 400–700 Z. | „Neuer Kursplan für das Frühjahr ist online" |
| Übung (= „Übung der Woche") | `PF_Feed_Uebung` | siehe `01_Prompts/Uebung-der-Woche.md` | spezialisiert |

Template-IDs sind in WF-02 v16 verdrahtet (siehe `04_Canva-Vorlagen/Vorlagen-Uebersicht.md`).

---

## 5. Posting-Rhythmus

- **Wochen-Rhythmus** (unverändert): 1× pro Woche entweder „Übung der Woche",
  Reel oder Story. Steuerung über das Formular und WF-02/WF-03.
- **Monats-Rhythmus** (neu): 1× pro Monat zusätzlich ein Standard-Feed-Post,
  automatisch eingeplant durch WF-04 auf einen freien Tag (kein Reel, keine
  Story am selben Tag).
- Details: `02_n8n-Workflows/WF-04_Monats-Scheduler-Standard-Post.md`.

---

## 6. Qualitäts-Check vor Veröffentlichung

Im Code-Node von WF-02 (Caption-Output) wird geprüft:

- [ ] keine Heilversprechen (Regex auf `heilt`, `garantiert`, `wirkt zu 100%`, …)
- [ ] keine Diagnose-Begriffe ohne Disclaimer
- [ ] keine echten Patient:innen-Namen
- [ ] Hook ≤ 80 Zeichen
- [ ] genau 1 CTA
- [ ] Frage am Ende
- [ ] Alt-Text vorhanden

Bei Treffer → automatisches Re-Prompt mit Hinweis, kein Schreiben in SharePoint.

---

## 7. Änderungshistorie

| Datum       | Änderung                                            | Wer    |
| ----------- | --------------------------------------------------- | ------ |
| 2026-05-14  | Initialversion: Anatomie, Cross-Posting, Matrix     | Claude |
