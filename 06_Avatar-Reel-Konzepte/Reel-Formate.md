# Reel-Formate – Physio Fuchs

Sammlung wiederkehrender Reel-Formate, die in WF-03 ausgelöst werden
können. Pro Format: Zweck, Länge, Aufbau, Avatar-Eignung.

---

## 1. „Übung der Woche" 🏋️

| Eigenschaft        | Wert                                    |
| ------------------ | --------------------------------------- |
| Länge              | 25–45 Sek.                              |
| Aufbau             | Hook → Demo → Tipp → CTA                |
| Avatar-Eignung     | bedingt (besser echte Aufnahme der Übung) |
| Zielmetrik         | Saves                                   |

Aufbau:
1. **Hook (0–3 s):** „Diese Übung in 60 Sek. – probier sie aus."
2. **Demo (3–25 s):** echte Aufnahme der Bewegung (z. B. Judith in der
   Praxis), eingeblendete Schritte
3. **Tipp (25–35 s):** häufiger Fehler + Korrektur
4. **CTA (35–45 s):** „Speichere dir das Reel – für die nächste Pause."

---

## 2. „3 Tipps" ✨

| Eigenschaft        | Wert                                    |
| ------------------ | --------------------------------------- |
| Länge              | 20–30 Sek.                              |
| Aufbau             | Hook → 3 Tipps → CTA                    |
| Avatar-Eignung     | sehr gut                                |
| Zielmetrik         | Shares, Saves                           |

Aufbau (Avatar oder real):
1. **Hook (0–3 s):** „3 Tipps gegen <Problem>."
2. **Tipps (3–24 s):** je 5–7 Sek., klar nummeriert (`1 ·`, `2 ·`, `3 ·`)
3. **CTA (24–30 s):** „Welcher Tipp ist neu für dich?"

---

## 3. „Mythos vs. Fakt" 🤔

| Eigenschaft        | Wert                                    |
| ------------------ | --------------------------------------- |
| Länge              | 20–30 Sek.                              |
| Aufbau             | Mythos → „falsch" → Fakt → CTA          |
| Avatar-Eignung     | sehr gut                                |
| Zielmetrik         | Comments                                |

Aufbau:
1. **Mythos (0–5 s):** „Knacken im Knie ist immer schlecht?"
2. **Reaktion (5–8 s):** kurzes „Falsch."
3. **Fakt (8–25 s):** medizinisch sauber erklärt
4. **CTA (25–30 s):** „Was hast du immer geglaubt?"

---

## 4. „FAQ-Antwort" 💬

| Eigenschaft        | Wert                                    |
| ------------------ | --------------------------------------- |
| Länge              | 15–30 Sek.                              |
| Aufbau             | Frage → Antwort → CTA                   |
| Avatar-Eignung     | sehr gut                                |
| Zielmetrik         | DMs, Termin                             |

Aufbau:
1. **Frage (0–4 s):** wörtliches Zitat einer typischen Patient:innen-Frage
2. **Antwort (4–25 s):** sachliche Erklärung
3. **CTA (25–30 s):** „Mehr Fragen? Schreib uns in die DMs."

---

## 5. „Behind the Scenes" 🎬

| Eigenschaft        | Wert                                    |
| ------------------ | --------------------------------------- |
| Länge              | 15–30 Sek.                              |
| Aufbau             | Mehrere kurze Real-Clips + Musik        |
| Avatar-Eignung     | nein – authentische Aufnahmen           |
| Zielmetrik         | Reach, Profil-Besuche                   |

Hinweis: Hier **keine** Patient:innen filmen – nur Praxis, Räume,
Hände am Behandlungstisch (anonym), Mitarbeiter:innen mit Einwilligung.

---

## 6. „Praxis-News / Aktion" 📣

| Eigenschaft        | Wert                                    |
| ------------------ | --------------------------------------- |
| Länge              | 10–20 Sek.                              |
| Aufbau             | News-Statement → Detail → CTA Termin    |
| Avatar-Eignung     | gut (kurze Ansage)                      |
| Zielmetrik         | Termin                                  |

---

## 7. Format-Auswahl-Logik in WF-03

Pseudocode:

```
switch (item.field_2) {
  case "Übung der Woche":
    if (avatar_only_mode || keine_real_aufnahme) → "3 Tipps"-Variante als Avatar
    else                                          → klassisches Real-Reel
  case "Story":  → kein Reel
  case "Reel":   → frei wählbar gemäß Brief
  case "Tipp":   → "3 Tipps"
  case "FAQ":    → "FAQ-Antwort"
  case "Aktion", "Praxis-News": → "Praxis-News"
  default:       → Standard-Feed-Post (kein Reel)
}
```

---

## 8. Cover-Frame Konvention

Jedes Reel braucht ein **eigenes Cover** (statisches Bild, das im
Profil-Grid sichtbar ist). Cover-Texte folgen diesem Schema:

```
Zeile 1 (groß):  3–5 Wörter, Hauptaussage
Zeile 2 (klein): Format-Label (z. B. "Übung der Woche")
```

Beispiel:
```
ZEILE 1: 60 Sek. gegen Bürorücken
ZEILE 2: Übung der Woche
```

Cover wird in Canva mit Template `PF_Reel_Cover` befüllt.

---

## 9. Nicht erlaubte Reel-Inhalte

- Trends mit fragwürdigen Übungen („viraler Pose-Trend"), die Judith
  fachlich nicht verantworten kann
- Songs / Musik ohne kommerzielle Lizenz (Meta erlaubt keine kommerzielle
  Nutzung der „Original-Audio"-Library für Praxis-Accounts in jedem Land
  – im Zweifel die lizenzfreie Auswahl nutzen)
- humorige Imitation echter Personen
- Übungen, die ohne Anleitung Verletzungsrisiko bergen
