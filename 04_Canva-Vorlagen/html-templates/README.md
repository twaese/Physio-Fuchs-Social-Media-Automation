# HTML-Templates für Social-Media-Posts

Ersatz für die Canva-Pipeline. Templates werden von WF-02 v18 mit Daten aus
SharePoint befüllt und per Gotenberg-Sidecar zu PNG/JPG gerendert.

---

## Ordnerstruktur

```
html-templates/
├── README.md                           ← diese Datei
├── assets/                             ← geteilt über alle Plattformen
│   ├── pf-logo-medaillon.png           ← Praxis-Logo (Ginkgo-Medaillon)
│   ├── judith-byline-circle.png        ← Judith-Portrait (rund, 400×400)
│   └── judith-portrait-bw-original.jpg ← Original-Foto (Backup)
│
├── instagram/                          ← 1080×1350 (4:5 Portrait)
│   └── PF_Feed_Standard.html
│
├── facebook/                           ← 1080×1080 (1:1 Square)
│   └── PF_Feed_FB_Standard.html
│
├── linkedin/                           ← später (1200×1200 oder 1200×627)
│   └── .gitkeep
│
├── tiktok/                             ← später (1080×1920 für Cover/Slides)
│   └── .gitkeep
│
└── _tests/                             ← Mockups + Vorschau-Dateien
    ├── _test-mit-content.html              IG mit Beispieltext
    ├── _test-PF-2026-100.html              IG, echter SP-Eintrag
    ├── _test-PF-2026-100_facebook.html     FB, echter SP-Eintrag
    └── _test-instagram-vollpost.html       IG-Mockup mit Caption
```

---

## Platzhalter

Alle Templates nutzen dieselben Platzhalter (WF-02 ersetzt vor Gotenberg-Call):

| Platzhalter   | Quelle (SharePoint) | Beispiel |
|---------------|---------------------|----------|
| `{{TITEL}}`   | von WF-02 aus `field_2`/`field_11` verkürzt | „Drei Mini-Übungen für die Mittagspause" |
| `{{TEXT}}`    | von WF-02 aus Body abgeleitet | „Direkt am Schreibtisch, ohne Equipment: 1. … 2. … 3. …" |
| `{{CTA}}`     | von WF-02 aus Caption-CTA abgeleitet | „Speichern für die nächste Pause" |
| `{{DATUM}}`   | `field_4` (Veröffentlichungsdatum) | „16.05.2026" |

---

## Plattform-Spezifika

### Instagram (`instagram/`)
- Format: **1080×1350 (4:5 Portrait)** — maximaler Feed-Anteil
- Caption-Position bei Post: **unter** dem Bild
- Hashtags: **am Ende der Caption** (8–15)

### Facebook (`facebook/`)
- Format: **1080×1080 (1:1 Square)** — universell anzeigbar
- Caption-Position bei Post: **über** dem Bild
- Hashtags: **als 1. Kommentar** vom Posting-Account (laut CLAUDE.md /
  Tonalität-Richtlinien — Hashtags wirken auf FB schwach)

### LinkedIn (später)
- Format wahrscheinlich: 1200×1200 (Square) oder 1200×627 (Link-Card)
- Tonalität: formaler, weniger Emojis, B2B-orientiert (Praxis-Inhaber-Netzwerk?)

### TikTok (später)
- Format: 1080×1920 (9:16 Hochformat) für Cover/Slides
- TikTok ist primär Video — Cover als Standbild, Hauptinhalt = Reel-Video

---

## Wartung

### Asset austauschen (Logo, Portrait)

Datei in `assets/` ersetzen unter gleichem Namen → alle Templates ziehen
automatisch nach.

### Neues Plattform-Template anlegen

1. Ordner `<plattform>/` anlegen (falls noch nicht da)
2. HTML basierend auf `instagram/PF_Feed_Standard.html` kopieren
3. `width`/`height` in `:root`, `html, body` und `.canvas` anpassen
4. Padding und Schriftgrößen für neues Format kalibrieren
5. Asset-Pfade als `../assets/...` (relative von Unterordner)

### Neuen Platzhalter ergänzen

1. HTML-Block mit `{{NEUER_NAME}}` einfügen
2. WF-02 v18 Code-Node muss das Substitutions-Mapping erweitern
3. SharePoint-Feld referenzieren (oder LLM-generieren)

---

## Lokal anschauen

Doppelklick auf eine `.html`-Datei im Finder öffnet sie im Browser.
Templates mit `{{...}}`-Platzhaltern zeigen die Klammern als Text.
Für realistische Vorschau: `_tests/*.html` öffnen (Platzhalter bereits gefüllt).

---

## Änderungshistorie

| Datum       | Änderung                                                     | Wer    |
| ----------- | ------------------------------------------------------------ | ------ |
| 2026-05-16  | Initial: Instagram + Facebook Templates, plattform-getrennt  | Claude |
