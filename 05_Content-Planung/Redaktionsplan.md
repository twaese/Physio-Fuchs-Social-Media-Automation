# Redaktionsplan – Physio Fuchs Social Media

Stand: 2026-05-14
Snapshot der Excel-Datei: `PF-Content-Kalender-2026.xlsx` (Root)

---

## 1. Posting-Frequenz

| Slot                     | Frequenz                                 | Plattform        | Steuerung |
| ------------------------ | ---------------------------------------- | ---------------- | --------- |
| Wochenformat             | **1× pro Woche**, Samstag 09:00          | IG + FB          | WF-01/02/03 (Formular-Eingabe Judith) |
| Standard-Feed-Post       | **1× pro Monat** zusätzlich, freier Tag  | IG + FB          | WF-04 (automatisch) |
| Phase 2 (Roadmap)        | Wochenformat 2× pro Woche (Mi + Sa)      | IG + FB          | – |
| Phase 3 (Roadmap)        | + Reels regelmäßig, Stories 2× pro Woche | + Reels/Stories  | – |

> Standard-Feed-Posts und Wochenformat dürfen **nicht** auf denselben
> Tag fallen. WF-04 sucht in der SharePoint-Liste einen Tag, an dem kein
> Reel und keine Story geplant ist (Details:
> `02_n8n-Workflows/WF-04_Monats-Scheduler-Standard-Post.md`).

---

## 2. Format-Mix

- **Wochenformat:** Judith wählt frei pro Woche (Übung der Woche als
  Default-Empfehlung, Tipp/Aktion/Praxis-News/BTS als Alternativen).
  Keine starre Reihenfolge.
- **Standard-Feed-Post (1×/Monat):** WF-04 nimmt den ältesten passenden
  Entwurf aus dem „Standard-Post-Pool" (siehe Abschnitt 2a).

### 2a. Standard-Post-Pool

Damit WF-04 jeden Monat einen Kandidaten findet, hält Judith einen
kleinen Vorrat in SharePoint:

- **Empfehlung:** immer **2–3 Standard-Post-Entwürfe** im Status
  `Entwurf` ohne `field_4` bereithalten.
- Erlaubte Post-Typen für den Pool: `Standard`, `Tipp`, `FAQ`,
  `Praxis-News`, `Aktion`, `Mitarbeiter:in`, `Behind-the-Scenes`,
  `Team`, `Promo`, `Zitat`.
- Themen-Pool unten (Abschnitt 3) dient als Inspirationsquelle, **nicht**
  als Pflicht-Rotation.
- Reihenfolge: WF-04 nimmt FIFO über `Created`-Spalte (ältester zuerst).
- **Reminder:** Findet WF-04 am Monatsersten keinen Kandidaten, schickt
  er eine Teams-Card an Judith.

---

## 3. Themen-Pool

Die Pool-Themen werden im Formular von Judith ausgewählt oder als
Vorschlag generiert.

### 3.1 Wirbelsäule / Rücken
- Mobilisation der LWS (Katze/Kuh, Beckenkippen)
- Faszienrolle für den unteren Rücken
- Mythos: „Bandscheibenvorfall = OP" – nein, oft konservativ behandelbar
- Bürorücken: Tipps für die Schreibtisch-Pause

### 3.2 Schulter / Nacken
- Schulterkreisen am Türrahmen
- Nackendehnung 60-Sek-Übung
- Tipp: Headset statt Schultergeklemmtes Telefon

### 3.3 Knie / Hüfte / Bein
- Quadriceps-Stretch im Stand
- Knie sicher beim Treppensteigen
- Hüftöffner für Vielsitzer:innen

### 3.4 Allgemein / Lifestyle
- Wasser trinken & Faszien
- Schlafposition & Rücken
- Spaziergang als Therapie
- 5-Minuten-Routine vor dem Bildschirm

### 3.5 Praxis-bezogen
- Vorstellung Team
- Geräte & Ausstattung (z. B. neue Therapieliege)
- Aktionen / freie Termine
- Urlaub / Öffnungszeiten

---

## 4. Saisonkalender (Anregungen)

| Monat       | Anlass / Saisonthema                              |
| ----------- | ------------------------------------------------- |
| Januar      | Neujahrsvorsätze realistisch umsetzen             |
| Februar     | Faschings-Tipp: nach langem Sitzen aufwärmen      |
| März        | Frühjahrsmüdigkeit / leichter Wiedereinstieg Sport|
| April       | Tag der Rückengesundheit (15.03., nachholen)      |
| Mai         | Gartenarbeit ohne Kreuzschmerz                    |
| Juni        | Wandern & Sprunggelenk                            |
| Juli        | Reisen & langes Sitzen                            |
| August      | Hitze & Kreislauf (vorsichtige Bewegung)          |
| September   | Schulanfang: Kinderhaltung & Schulrucksack        |
| Oktober     | Welt-Osteoporose-Tag (20.10.)                     |
| November    | Dunkelheit, Stimmung, Bewegung als Booster        |
| Dezember    | Weihnachts-Stress & Schulter                      |

---

## 5. Wochen-Rhythmus (Standard)

| Tag         | Aktion                                                      |
| ----------- | ----------------------------------------------------------- |
| Mo          | Judith trägt 1–2 Themen ins Formular ein                    |
| Di          | WF-02 erzeugt Caption + Hashtags                            |
| Mi          | WF-03 erzeugt Canva-Grafik / Reel-Skript                    |
| Do          | Judith gibt frei (Teams-Card)                               |
| Fr          | n8n plant ein                                               |
| Sa          | 09:00 Veröffentlichung                                      |
| So          | Auswertung in Teams (kurzer Bot-Report)                     |

## 5a. Monats-Rhythmus für Standard-Feed-Post

| Tag                | Aktion                                                      |
| ------------------ | ----------------------------------------------------------- |
| 1. d. Monats 06:00 | WF-04 sucht Pool-Kandidat, freien Tag, schreibt `field_4`   |
| nächster Lauf      | WF-02 erzeugt Caption + Hashtags → Status `Bereit`          |
| sofort danach      | WF-03 Phase A erkennt `[AUTO_RELEASE]` → `Freigegeben`      |
| gewählter Tag 09:00| WF-03 Phase B/C postet zu IG + FB                           |

Keine manuelle Freigabe durch Judith im Standardfall – siehe
„Optionale Freigabe-Pflicht" in
`02_n8n-Workflows/WF-04_Monats-Scheduler-Standard-Post.md`.

---

## 6. Pflege des Plans

- Excel-Datei `PF-Content-Kalender-2026.xlsx` ist ein Snapshot, nicht
  die aktive Quelle. Aktiv arbeitet ihr in der SharePoint-Liste.
- Der Snapshot wird (manuell oder per WF-04, Roadmap) wöchentlich
  aus SharePoint exportiert, um eine Offline-Sicht zu haben.
- Alte Snapshots: in `_Archiv/` mit Datum versionieren
  (`PF-Content-Kalender-2026_YYYY-MM-DD.xlsx`).

---

## 7. Eskalation bei Themen-Flaute

Wenn am Mo kein Thema im Formular liegt:
1. n8n-Reminder an Judith via Teams
2. Wenn am Di immer noch nichts: Claude generiert 3 Themen-Vorschläge
   aus dem Pool oben, schickt sie als Teams-Card; Judith wählt eines
3. Erst nach Auswahl läuft WF-02 weiter
