# Foto-Convention für Social-Media-Posts

**Für:** Judith Fuchs
**Stand:** 2026-06-08
**Verwendet ab:** WF-02 v18.3

---

## Worum geht's

Damit jeder Social-Media-Post sein passendes Foto bekommt, sucht der automatisierte Workflow **per Dateiname** das richtige Bild in SharePoint.

Wenn das Foto richtig benannt ist und am richtigen Ort liegt → WF-02 findet es automatisch und baut es ins Layout ein. Kein extra Klick nötig.

---

## Wohin die Fotos legen

```
Physio Fuchs Administration - Socialmedia
   └── Content_Socialmedia
       └── Fotos
           ├── 2026/                ← Item-spezifische Fotos
           │    ├── PF_2026_010_schuhe_fuesse.jpg
           │    ├── PF_2026_011_atmung.jpg
           │    └── PF_2026_017_nacken.jpg
           ├── 2027/                ← nächstes Jahr automatisch
           └── Instafotos Stock/    ← Fallback-Pool (generische Praxis-Bilder)
```

- **Jahresordner:** WF-02 schaut automatisch in den Ordner des Veröffentlichungs-Jahres
- **Item-Foto:** name beginnt mit `PF_{Jahr}_{ItemID}_...`
- **Stock-Pool:** wird verwendet wenn kein item-spezifisches Foto da ist

---

## Naming-Regeln

### Format

```
PF_{Jahr}_{ItemID-3stellig}_{Thema-lowercase}.{jpg|png}
```

### Konkret

| Was | Beispiel | Warum |
|---|---|---|
| **Präfix** | `PF_` | Standard für Praxis-Fotos |
| **Jahr** | `2026` | aus Veröffentlichungsdatum |
| **ItemID** | `010` (nicht `10`) | 3-stellig mit führenden Nullen — sortiert sich richtig, hält bis 999 Posts pro Jahr |
| **Thema** | `schuhe_fuesse` | beschreibt was zu sehen ist, kleingeschrieben, mit Unterstrichen |
| **Endung** | `.jpg` oder `.png` | beides erlaubt |

### Was kommt in die ItemID?

Die ItemID ist die Nummer aus dem SharePoint-Eintrag — siehst du in der Spalte „Title": `PF-2026-010` → ItemID = `010`.

### Beispiele richtig

```
✓ PF_2026_001_nacken_uebung.jpg
✓ PF_2026_010_schuhe_fuesse.jpg
✓ PF_2026_010_schuhe_v2.jpg            (Variante für gleiche Item-ID)
✓ PF_2026_017_nacken.jpg
✓ PF_2026_117_atmung_morgens.png
✓ PF_2027_001_jahresstart.jpg
```

### Beispiele falsch

```
✗ PF_2026_10_xxx.jpg               → fehlende Null (muss 3-stellig)
✗ PF-2026-010-xxx.jpg              → Bindestriche statt Unterstriche
✗ PF_2026_010 Schuhe Füße.jpg      → Leerzeichen + Umlaute
✗ pf_2026_010_xxx.jpg              → kleines pf am Anfang
✗ 2026_010_nacken.jpg              → fehlendes PF-Präfix
✗ PF_2026_010.jpg                  → fehlendes Thema-Suffix (Unterstrich vor .jpg!)
```

---

## Umlaute & Sonderzeichen

Bitte ersetzen:

| Was | Wie | Beispiel |
|---|---|---|
| ä | ae | `ruecken` |
| ö | oe | `koerper` |
| ü | ue | `uebung` |
| ß | ss | `fuesse` |
| Leerzeichen | `_` | `schuhe_fuesse` |
| `&`, `+`, `'` | weglassen | — |

**Warum?** Browser und URLs haben Probleme mit Umlauten und Sonderzeichen. Wenn die im Dateinamen sind, kann Instagram/Facebook das Foto später eventuell nicht laden.

---

## Mehrere Fotos für eine Item-ID?

**Ja, geht.** WF-02 nimmt das alphabetisch erste.

```
PF_2026_010_schuhe_fuesse.jpg       ← wird verwendet (1. alphabetisch)
PF_2026_010_schuhe_v2.jpg
PF_2026_010_schuhe_v3.jpg
```

Wenn du eine andere Variante als Hauptfoto willst:
- Variante 1 umbenennen (z.B. zu `PF_2026_010_schuhe_alt.jpg`)
- Gewünschte Variante umbenennen ohne Suffix oder mit `a` davor

Tipp: Vor der Veröffentlichung im SP-Ordner kurz checken welches Foto „erste" ist (sortiert sich alphabetisch nach Dateiname).

---

## Foto-Qualität & Format

| Eigenschaft | Empfohlen |
|---|---|
| **Format** | JPG (kleiner) oder PNG (verlustfrei) |
| **Größe** | mind. 1080×1350 px (für IG-Portrait) oder 1080×1080 (FB-Square) |
| **Maximalgröße** | ≤ 10 MB (GitHub-Limit) |
| **Orientierung** | hochkant oder quadratisch bevorzugt |
| **Personen** | nur mit Einverständnis (DSGVO!), siehe `07_Datenschutz-DSGVO/` |
| **Bildbearbeitung** | gerne — aber kein Logo/Schriftzug ins Foto kleben, das macht der Workflow automatisch oben drüber |

---

## Was passiert wenn kein Foto da ist?

WF-02 läuft trotzdem durch, **es passiert nichts Schlimmes:**

1. **Stufe 1:** Suche nach `PF_2026_{ItemID}_*.jpg/png` — kein Treffer
2. **Stufe 2:** Suche im `Instafotos Stock/`-Ordner — wenn da was drin ist, wird ein zufälliges genommen
3. **Stufe 3:** wenn auch kein Stock-Foto da: Standard-Foto aus dem Code

In jedem Fall bekommst du eine **Teams-Notiz** mit dem Hinweis welche Item-ID gerade ohne eigenes Foto gepostet wurde — dann kannst du beim nächsten Mal eins nachreichen.

---

## Schnell-Workflow für Judith

1. **Item im Formular einreichen** (wie bisher) → bekommt SharePoint-ID `PF-2026-XXX`
2. **Foto raussuchen** (Handy, Praxis-Bilder, oder Stock)
3. **Foto umbenennen** nach Schema: `PF_2026_XXX_thema.jpg`
4. **In SP-Ordner ablegen:** `Content_Socialmedia/Fotos/2026/`
5. Fertig — beim nächsten WF-02-Lauf wird's automatisch verwendet

**Tipp:** Du kannst Fotos auch **nachträglich** hinzufügen, solange das Item noch nicht den Status `Veröffentlicht` hat. Solange Status `Entwurf` ist, läuft WF-02 beim nächsten Cron-Lauf nochmal drüber.

---

## Lokaler Zugriff vom Mac (für Thomas)

Im Projekt-Ordner ist ein Symlink auf den OneDrive-synchronisierten Fotos-Ordner:

```
/Volumes/Physio_Fuchs/SocialMedia/04_Canva-Vorlagen/SP-Praxis-Fotos
```

→ Direkter Finder-Zugriff zur Vorschau und Organisation. Wird **nicht** ins Git-Repo gepusht.

---

## Stock-Pool kuratieren

Im Ordner `Content_Socialmedia/Fotos/Instafotos Stock/` können generische Praxis-Fotos liegen, die als Fallback dienen. Empfehlung:

- 10-20 verschiedene Praxis-Stimmungsbilder
- Innenräume, Behandlungssituationen (anonymisiert!), Außenaufnahmen der Praxis
- Naming kann frei sein, z.B. `praxis_eingang.jpg`, `behandlungsraum_01.jpg`
- WF-02 wählt zufällig

---

## Änderungshistorie

| Datum       | Was                                                       | Wer    |
| ----------- | --------------------------------------------------------- | ------ |
| 2026-06-08  | Initial-Version mit Naming-Convention                     | Claude / Thomas |
