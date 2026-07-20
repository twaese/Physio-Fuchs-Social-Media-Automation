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
| `05_datenschutz-einwilligungen.js` | `Datenschutz-in-Social-Media.docx`, `Einwilligung-digitaler-Avatar.docx`, `Einwilligung-Patientinnen-und-Patienten.docx` | `07_Datenschutz-DSGVO/DSGVO-Leitfaden.md`, `07_Datenschutz-DSGVO/Einverstaendniserklaerungen.md` |

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
- **Einwilligungen:** alle drei Formulare umgesetzt (Mitarbeitende, Avatar,
  Patient:innen) — je ein eigenes Dokument, damit nur das Nötige gedruckt wird.
- **DSGVO-Leitfaden:** Abschnitt „Konkrete Regeln für Claude / n8n" entfernt
  (rein technisch). Die AVV-Statustabelle ebenfalls — das ist Verwaltung,
  keine Alltagshilfe.

---

## Gestaltung

Alle Dokumente nutzen die Praxis-Farben: Grün `#809B3D` für Tabellenköpfe
und Akzente, Braun `#5D4739` für Überschriften, Creme `#F4EFE2` für
hervorgehobene Kästen. Schrift durchgängig Calibri, damit sie überall
ohne Nachinstallation korrekt dargestellt wird.

---

## Prüfstand

- **Struktur:** maschinell geprüft (Tabellen, Textinhalt, Umlaute, keine
  Platzhalter-Reste)
- **Layout:** von Thomas in Word gesichtet, Tabellen sitzen sauber
  (2026-07-20)

Hinweis für später: Auf diesem Mac ist kein LibreOffice installiert, ein
automatisches Rendern zur Sichtprüfung ist daher nicht möglich. Nach
Änderungen an den Skripten bitte ein Dokument von Hand öffnen — am besten
`Datenschutz-in-Social-Media.docx`, das hat die breiteste Tabelle.

---

## Änderungshistorie

| Datum | Was | Wer |
| --- | --- | --- |
| 2026-07-20 | Initialversion — 7 Word-Dokumente für `00_Fuer_Judith/` | Claude / Thomas |
| 2026-07-20 | Ergänzt: Datenschutz-Übersicht + Einwilligungen Avatar/Patient:innen (jetzt 10 Dokumente). Markdown-Quellen auf SharePoint archiviert. | Claude / Thomas |
| 2026-07-20 | Layout in Word gesichtet und freigegeben. | Thomas |
