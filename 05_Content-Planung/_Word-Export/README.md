# Word-Dokumente für Judith

Judith arbeitet in SharePoint/OneDrive und kann mit Markdown nichts anfangen.
Die für sie bestimmten Dokumente liegen deshalb als **Word-Dateien** unter:

```
Physio Fuchs Administration - Socialmedia
   └── Content_Socialmedia
       └── 00_Fuer_Judith/
```

Dieser Ordner enthält die **Generator-Skripte**, mit denen diese Word-Dateien
erzeugt werden. Damit sind sie reproduzierbar und nicht von Hand gepflegt.

---

## Grundregel

**Die Markdown-Datei im Repo ist die Quelle. Das Word-Dokument ist das
Erzeugnis.** Niemals das Word-Dokument direkt bearbeiten — sonst laufen
beide auseinander und niemand weiß, was gilt.

Ablauf bei einer Änderung:

1. Markdown-Quelle im Repo ändern
2. passendes Skript neu laufen lassen
3. erzeugte `.docx` nach `00_Fuer_Judith/` kopieren

---

## Welches Skript erzeugt was

| Skript | Erzeugt | Quelle im Repo |
| --- | --- | --- |
| `01_foto-liste.js` | `Fotos-fuer-die-naechsten-Beitraege.docx` | `05_Content-Planung/Foto-Bedarf-Judith_2026-07-20.md` (Daten aus SharePoint-Liste) |
| `02_foto-convention-einwilligung.js` | `Fotos-richtig-benennen.docx`, `Einwilligung-Bild-und-Tonaufnahmen.docx` | `04_Canva-Vorlagen/Foto-Convention.md`, `07_Datenschutz-DSGVO/Einverstaendniserklaerungen.md` |
| `03_tonalitaet-hwg-aufnahme.js` | `So-schreiben-wir.docx`, `Was-wir-schreiben-duerfen.docx`, `Videoaufnahmen-Anleitung.docx` | `00_Konzept/Tonalitaet-Markenrichtlinien.md`, `07_Datenschutz-DSGVO/Heilmittelwerbe-Hinweise.md`, `06_Avatar-Reel-Konzepte/Aufnahme-Anleitung-Judith.md` |
| `04_themen-saisonkalender.js` | `Themen-Ideen-und-Saisonkalender.docx` | `05_Content-Planung/Redaktionsplan.md` (nur Themen-Pool + Saisonkalender) |

---

## Ausführen

```bash
cd <arbeitsverzeichnis>
npm install docx          # einmalig
node 01_foto-liste.js     # legt die .docx im aktuellen Verzeichnis ab
```

Die Skripte schreiben in das aktuelle Arbeitsverzeichnis, nicht direkt nach
OneDrive — das Kopieren ist bewusst ein eigener Schritt.

---

## Bewusste Abweichungen von den Quellen

Die Word-Fassungen sind **keine 1:1-Übersetzungen**. Entfernt wurde alles,
was für Judith irrelevant oder irreführend wäre:

- **Technik raus:** keine Workflow-Namen, Feldbezeichner, n8n-Interna
- **Redaktionsplan:** nur Themen-Pool und Saisonkalender übernommen. Die
  Abschnitte zu Wochen-Rhythmus und Freigabe beschreiben einen Stand von
  Mai 2026 (Donnerstags-Freigabe durch Judith, Canva-Grafiken) — beides
  gilt seit der Umstellung auf Vollautomatik nicht mehr.
- **Foto-Convention:** die Stock-Pool-Stufe ist bewusst nicht erwähnt,
  weil sie in WF-02 v18.3 nicht implementiert ist (siehe Änderungshistorie
  in `04_Canva-Vorlagen/Foto-Convention.md`).
- **Einwilligungen:** bisher nur das Formular für Mitarbeitende umgesetzt.
  Die Varianten für Avatar-Nutzung und Patient:innen liegen noch nur als
  Markdown vor.

---

## Gestaltung

Alle Dokumente nutzen die Praxis-Farben: Grün `#809B3D` für Tabellenköpfe
und Akzente, Braun `#5D4739` für Überschriften, Creme `#F4EFE2` für
hervorgehobene Kästen. Schrift durchgängig Calibri, damit sie überall
ohne Nachinstallation korrekt dargestellt wird.

---

## Noch offen

- `07_Recht_DSGVO/DSGVO-Leitfaden.md` — noch nicht als Word umgesetzt
- Einwilligungs-Varianten Avatar und Patient:innen
- Optische Endkontrolle: Auf diesem Mac ist kein LibreOffice installiert,
  die Dokumente wurden nur strukturell geprüft (Tabellen, Textinhalt,
  Umlaute), nicht gerendert.

---

## Änderungshistorie

| Datum | Was | Wer |
| --- | --- | --- |
| 2026-07-20 | Initialversion — 7 Word-Dokumente für `00_Fuer_Judith/` | Claude / Thomas |
