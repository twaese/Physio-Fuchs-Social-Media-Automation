# Session-Zusammenfassung – Physio Fuchs Social Media

**Datum:** 2026-05-14
**Session-Name:** `socialmedia`
**Modell:** Claude Opus 4.7 (1M context)
**Working Directory:** `/Volumes/Physio_Fuchs/SocialMedia/`
**Beteiligte:** Thomas Waese (technischer Umsetzer), Judith Fuchs (Praxisinhaberin, Auftraggeberin)

> **Zweck dieser Datei:** Übergabe-Dokument. In einer neuen Session als
> Kontext mitgeben („Lies diese Datei zuerst"), damit nahtlos
> weitergearbeitet werden kann. Die `CLAUDE.md` im selben Verzeichnis
> bleibt die verbindliche Arbeitsanweisung.

---

## 1. Projekt in 3 Sätzen

Automatisierter Social-Media-Workflow für die Physiotherapiepraxis
**Physio Fuchs**: einmal pro Woche werden Feed-Post, Story, Reel,
Caption, Hashtags und Veröffentlichungsplanung für Instagram + Facebook
vorbereitet. Zentrale Datenbasis ist eine SharePoint-Liste
(`PF-Content-Kalender-2026`), Automatisierung läuft über **n8n**, Grafiken
über **Canva**. Judith Fuchs soll perspektivisch als wiederkehrender
**digitaler Avatar** in „Übung der Woche"-Reels auftreten.

---

## 2. Ausgangslage zu Sessionbeginn

Bestehende Dateien im Root (alle **unverändert** belassen):

| Datei | Rolle |
|---|---|
| `PF_WF-00_Datum_Initialbefllung_v1.json` | n8n: Datum-Initialbefüllung |
| `PF_WF-01_Formular_SharePoint_v1.json` | n8n: Formular → SharePoint |
| `PF_WF-02_Caption_Generator_v16.json` | n8n: Caption-Generator (LLM) |
| `PF_WF-03_Social_Media_Post_v2.json` … `_v4.json` | n8n: Posting (3 Versionen, v4 aktiv) |
| `physio_fuchs_form_v2.html` | Eingabeformular für Judith |
| `physio_fuchs_templates.html` | HTML-Vorlagenübersicht |
| `PF-Content-Kalender-2026.xlsx` | Snapshot des Redaktionsplans |
| `_Archiv/` | Alte WF-Versionen (read-only) |
| `Symbole-Instagramm/` | 7 Highlight-Cover (PF_Highlight_*.jpg) |

---

## 3. Was in dieser Session erledigt wurde

### 3.1 Strukturierung (Phase 1)

Neue Ordnerstruktur angelegt, **ohne** Bestandsdateien anzufassen:

```
00_Konzept/                   Workflow-Konzept · Status-Flow · Tonalitaet-Markenrichtlinien
01_Prompts/                   Uebung-der-Woche · Story · Reel-Skript · Caption · Hashtags · Freigabe-Judith
02_n8n-Workflows/             README + WF-00 / WF-01 / WF-02 / WF-03 (je eine .md)
03_SharePoint/                Liste-Schema · Felder-Mapping · Berechtigungen
04_Canva-Vorlagen/            Vorlagen-Uebersicht
05_Content-Planung/           Redaktionsplan
06_Avatar-Reel-Konzepte/      Avatar-Konzept-Judith · Reel-Formate
07_Datenschutz-DSGVO/         DSGVO-Leitfaden · Heilmittelwerbe-Hinweise · Einverstaendniserklaerungen
99_Platzhalter-Secrets/       Platzhalter-Liste · .env.example · Migrations-Anleitung
```

Plus die zentrale **`CLAUDE.md`** im Root als verbindliche Projektanweisung
(Tech-Stack, Status-Flow, Tonalität, DSGVO/HWG, Sicherheits-Regeln,
„was Claude nicht ohne Rückfrage darf").

### 3.2 Werte-Inventur und Secrets-Trennung (Phase 2)

Alle bestehenden Workflow-JSONs nach hartkodierten Werten durchsucht.
Ergebnisse:

- **SharePoint:** Site-Composite, Site-/Web-/List-GUID, Site-Pfad
  `/sites/PhysioFuchsTW`, Listenname `PF-Content-Kalender-2026`
- **Instagram Business Account ID** (15-stellige Zahl)
- **Meta Graph Version:** `v25.0`
- **7 Canva-Template-IDs** für Standard / Tipp / Zitat / Story / Team /
  Übung / Promo
- **Teams-Channel-ID** für „Social Media (meeting)"
- **Webhook-Pfade** (`pf-wf01-content-einreichung`, `wf03-wait-export`,
  `wf03-wait-ig`, …)

Anschließend angelegt:

- **`~/secrets/physio-fuchs/.env`** (außerhalb des Volumes!) –
  Permissions `600`, mit allen extrahierten realen Werten +
  `TODO_FILL`-Markern für noch fehlende Tokens (Meta, Canva, Anthropic,
  Entra-Client-Secret, …)
- **`99_Platzhalter-Secrets/.env.example`** – sichere Strukturvorlage
  ohne reale Werte (darf im Repo bleiben)
- **`99_Platzhalter-Secrets/Migrations-Anleitung.md`** –
  Schritt-für-Schritt-Anleitung, wie die hartkodierten Werte in den
  JSONs durch `$env.*`-Referenzen ersetzt werden, **ohne** Versionen zu
  überschreiben (immer `vX → vX+1`).

### 3.3 Status-Flow von 4 auf 5 erweitert (Phase 3)

Beim Werte-Scan zeigte sich, dass WF-02 v16 bereits einen 5. Status
**`Bereit`** verwendet. Empfehlung gegeben + umgesetzt:

```
Entwurf  →  Bereit  →  Freigegeben  →  Geplant  →  Veröffentlicht
```

`Bereit` = „Caption + Grafik fertig, wartet auf Judiths Freigabe".

**Vorteil:** Judith hat eine eigene SharePoint-Ansicht „Wartet auf mich"
mit reinem Statusfilter, statt einer kombinierten Filterlogik
(`Status=Entwurf` UND `field_9` ≠ leer).

Angepasst wurden:

- `CLAUDE.md` (Diagramm, Beschreibungen, Wochenrhythmus)
- `00_Konzept/Status-Flow.md` (komplette Überarbeitung)
- `00_Konzept/Workflow-Konzept.md` (Schritte 4 & 5, Big-Picture-Diagramm)
- `03_SharePoint/Liste-Schema.md` (Choice-Werte + neue Ansicht)
- `03_SharePoint/Felder-Mapping.md` (Schreibrichtung WF-02/WF-03)
- `02_n8n-Workflows/README.md` (Datenfluss-Diagramm)
- `02_n8n-Workflows/WF-02_Caption-Generator.md` (Hinweis: setzt Status nicht)
- `02_n8n-Workflows/WF-03_Social-Media-Post.md` (Phase A bekommt
  Vollständigkeits-Check + Statuswechsel auf `Bereit`; Phase B filtert
  auf `Bereit`; Sicherheits-Regeln erweitert)
- `99_Platzhalter-Secrets/Migrations-Anleitung.md` (Klärungs-Hinweis
  ersetzt durch verbindliche Regel)

---

## 4. Verbindliche Konventionen (Quintessenz)

Diese Regeln gelten für Claude Code in jedem Projekt-Verzeichnis-Kontakt.
Vollständig in `CLAUDE.md`, hier nur die kritischsten:

1. **Nichts löschen.** Auch nicht aus `_Archiv/`.
2. **Keine Datei überschreiben** ohne versionierte Sicherung
   (Workflow-JSONs: immer `vX → vX+1`).
3. **Niemals Tokens, IDs, Secrets in Dateien des Repos** – nur
   Platzhalter aus `99_Platzhalter-Secrets/Platzhalter-Liste.md`.
4. **Status-Übergänge:**
   - `Entwurf → Bereit` darf WF-03 Phase A automatisch setzen
   - `Bereit → Freigegeben` ausschließlich Judith (Teams-Card oder SP)
   - `Freigegeben → Geplant → Veröffentlicht` ausschließlich WF-03
5. **Inhaltlich:** keine Heilversprechen, keine Diagnosen, keine echten
   Patient:innen-Daten. HWG-/DSGVO-Leitfäden in `07_Datenschutz-DSGVO/`
   sind verbindlich.
6. **Sprache:** Deutsch, „Sie"-Form im Feed, Tonalität
   professionell-sympathisch-motivierend.

---

## 5. Datei-Speicherorte

| Was | Wo |
|---|---|
| Repo-Root | `/Volumes/Physio_Fuchs/SocialMedia/` |
| Verbindliche Anweisung | `/Volumes/Physio_Fuchs/SocialMedia/CLAUDE.md` |
| Echte Tokens / IDs (`.env`) | `~/secrets/physio-fuchs/.env` (Permissions `600`) |
| `.env`-Template ohne Secrets | `…/99_Platzhalter-Secrets/.env.example` |
| Migrations-Anleitung | `…/99_Platzhalter-Secrets/Migrations-Anleitung.md` |
| Memory-System (Claude) | `~/.claude/projects/-Volumes-Physio-Fuchs-SocialMedia/memory/` |

Memory enthält:
- `MEMORY.md` (Index)
- `project_context.md` (Tech-Stack, Akteure, Status-Flow)
- `feedback_arbeitsregeln.md` (kritische Do's & Don'ts)

---

## 6. SharePoint-Listen-Schema (Kurzfassung)

Liste: `PF-Content-Kalender-2026` auf Site `PhysioFuchsTW`

| Spalte | Anzeige | Typ | Wer befüllt |
|---|---|---|---|
| `Title` + `field_1` | Thema | Text | WF-01 |
| `field_2` | Post-Typ | Choice | WF-01 |
| `field_3` | Content-Brief | Multiline | WF-01 |
| `field_4` | Datum (TTMMJJJJ) | Text | WF-01 / WF-00 |
| `field_5` | Uhrzeit (HH:MM) | Text | WF-01 / WF-00 |
| `field_6` | **Status** | Choice | alle WFs (Regeln s. o.) |
| `field_7` | Hashtags | Multiline | WF-02 |
| `field_8` | Bild-Dateiname | Text | WF-01 |
| `field_9` | Vorschau-URL | Hyperlink | WF-03 Phase A |
| `field_10` | Caption | Multiline | WF-02 |
| `field_11` | Freigabe-Person | Text | WF-01 |
| `field_12` | Meta Post-/Container-ID | Text | WF-03 Phase C/D |
| `field_13` | Kommentare / Log | Multiline | alle |

Choice-Werte `field_2`: Standard, Übung der Woche, Tipp, FAQ, Story,
Reel, Praxis-News, Aktion, Mitarbeiter:in, Behind-the-Scenes.

Choice-Werte `field_6`: Entwurf, Bereit, Freigegeben, Geplant, Veröffentlicht.

---

## 7. Offene Punkte / nächste sinnvolle Schritte

Diese sind **nicht** automatisch zu erledigen – sie warten auf
explizite Freigabe in der nächsten Session:

1. **Tokens in `~/secrets/physio-fuchs/.env` ergänzen**
   (alle Felder mit `TODO_FILL`): Meta App-ID/Secret/Access-Token,
   Canva API-Key + Brand-Kit-ID, Anthropic-Key, Entra-Client-Secret,
   FB Page-ID, n8n-Base-URL + API-Key, optional HeyGen-Avatar.

2. **n8n mit der `.env` verbinden**
   (Self-hosted: `--env-file` oder `n8n.env`; Cloud: Variables-UI).
   Test-Expression `={{ $env.SHAREPOINT_LIST_ID }}` in einem Node.

3. **WF-02 nach v17 migrieren** (alte v16 als Backup behalten):
   - Site-Composite, List-GUID, Anthropic-Header, Canva-Template-IDs
     auf `$env.*` umstellen
   - Sticky-Note auf 5-Status-Flow aktualisieren

4. **WF-03 nach v5 migrieren**:
   - Phase A bekommt Vollständigkeits-Check + setzt `field_6 = Bereit`
   - Phase B-Trigger ändert sich auf `field_6 = Bereit`
   - „Änderung wünschen" setzt `field_6 = Entwurf` zurück
   - IG Business Account ID, Meta API Version auf `$env.*` umstellen

5. **WF-01** (kann bleiben): nur Sticky-Note auf den 5-Status-Flow
   aktualisieren, keine Logik-Änderung nötig (setzt weiterhin `Entwurf`).

6. **SharePoint-Ansichten anlegen** (Browser, manuell):
   - „Wartet auf mich (Judith)" mit Filter `field_6 = Bereit`
   - „In Arbeit (n8n)" mit Filter `field_6 = Entwurf`
   - Choice-Wert `Bereit` zur Spalte `field_6` hinzufügen
   - Spalten-Formatierung gelb für `Bereit`

7. **AVVs prüfen** für Canva, Anthropic/OpenAI, HeyGen/Synthesia
   (siehe `07_Datenschutz-DSGVO/DSGVO-Leitfaden.md` Abschnitt 4).

8. **Avatar-Setup (Roadmap-Phase 3)**:
   - Tool-Entscheidung HeyGen vs. Synthesia
   - Trainingsvideo Judith aufnehmen (3–5 Min., neutraler Hintergrund)
   - Voice-Clone anlegen
   - Einwilligungserklärung aus
     `07_Datenschutz-DSGVO/Einverstaendniserklaerungen.md` ausfüllen

---

## 8. So startet die nächste Session

Empfohlener Auftakt-Prompt für eine frische Session:

> „Working directory: `/Volumes/Physio_Fuchs/SocialMedia/`.
> Lies bitte `SESSION-Zusammenfassung_2026-05-14.md` und `CLAUDE.md`,
> dann arbeiten wir an Punkt N aus der Liste „Offene Punkte" weiter."

Wichtige Dateien, die jede neue Session als Erstes lesen sollte:

1. `CLAUDE.md` (verbindliche Anweisung)
2. diese Datei (`SESSION-Zusammenfassung_2026-05-14.md`)
3. `00_Konzept/Status-Flow.md` (5-Status-Modell)
4. `99_Platzhalter-Secrets/Migrations-Anleitung.md` (Werte-Mapping)

Das Memory-System unter
`~/.claude/projects/-Volumes-Physio-Fuchs-SocialMedia/memory/` wird
automatisch geladen.

---

## 9. Was diese Session **nicht** angefasst hat

- Keine bestehende `PF_WF-*.json` wurde verändert.
- Keine `.html`-, `.xlsx`-, oder Bild-Datei wurde verändert.
- Der Ordner `_Archiv/` wurde nur gelesen, nichts entfernt.
- Es wurde nichts in n8n live deployed.
- Keine Posts wurden veröffentlicht.
- Keine echten API-Tokens wurden generiert oder eingetragen
  (nur Platzhalter `TODO_FILL`).

---

## 10. Statistik

- **Neu angelegt:** 1× CLAUDE.md, 26× Markdown-Doku, 1× `.env.example`,
  1× `.env` außerhalb des Volumes, 3× Memory-Dateien
- **Modifiziert (nur eigene neue Dateien dieser Session):** Status-Flow-
  und Mapping-Anpassungen quer durch 9 Markdown-Dateien
- **Bestand unverändert:** 7 JSON-Workflows, 2 HTML-Dateien, 1 XLSX,
  7 JPG-Highlights, kompletter `_Archiv/`-Ordner

---

## 11. Erweiterung am Abend (2026-05-14, Phase 2: Standard-Posts)

Nach der initialen Strukturierung wurde am selben Tag der komplette
Standard-Post-Pfad gebaut. Detail-Stand siehe
`SESSION-Naechste-Schritte_2026-05-14.md`.

### 11.1 Was zusätzlich entstanden ist

| Datei | Stand |
|---|---|
| `PF_WF-04_Monats_Scheduler_v1.json` | **neu, getestet, produktionsreif** |
| `PF_WF-02_Caption_Generator_v17.json` | **neu, getestet, produktionsreif** (v16 als Backup) |
| `PF_WF-03_Social_Media_Post_v5.json` | **neu, läuft bis Canva-Step**, OAuth fehlt noch |
| `02_n8n-Workflows/WF-04_Monats-Scheduler-Standard-Post.md` | komplette Bauanleitung |
| `02_n8n-Workflows/WF-03_v5_Pre-Flight-Analyse.md` | 10 Bugs in v4 dokumentiert |
| `00_Konzept/Feed-Post-Standard.md` | Anatomie/Cross-Posting/Matrix |
| `physio_fuchs_form_v2.html` | 3 neue Post-Typen (FAQ, Aktion, BTS) |
| `01_Prompts/Caption.md` | Post-Typ-Leitplanken FAQ/Aktion/BTS |

### 11.2 SharePoint-Liste angepasst (manuell von Thomas im Browser)

- `Post_Typ` Choice: 13 Werte (FAQ, Aktion, Behind-the-Scenes, Mitarbeiter:in, Praxis-News, Reel ergänzt)
- `Status` von Text auf Choice umgestellt mit 5 Werten
- Indizes: `Status` und `Veröffentlichungsdatum`
- Site-Zeitzone von UTC-08:00 (PST) auf Europe/Berlin (UTC+01:00)

### 11.3 Auto-Release-Kette funktioniert E2E (verifiziert)

```
WF-04 (1. d. Monats) → setzt field_4/5/6=Bereit/13[AUTO_RELEASE]
WF-02 v17           → erkennt Marker, Variante 1 auto, field_6=Freigegeben
WF-03 v5 Filter     → picks PF-2026-100, alle Felder korrekt
WF-03 v5 Canva      → ⚠️ Canva-OAuth-Token fehlt
```

### 11.4 Naming-Konvention vereinheitlicht

- Choice-Wert „Übung der Woche" → **„Übung"** (Liste ist Single Source of Truth)
- Konzept-Name „Übung der Woche" bleibt als Format-Bezeichnung erhalten
- Alle WF-Dokus + CLAUDE.md angepasst

### 11.5 Bekannte Bugs in n8n's IF-Node-UI (für die Akte)

- `?? $json.Felder?.field_X`-Chain mit `+ ''` Coercion: liefert nicht zuverlässig die erwarteten Werte
- Right-Value-Feld defaultet auf „Ausdruck"-Mode statt „Behoben"/Literal
- **Empfehlung für künftige Workflows:** statt komplexen IF-Bedingungen lieber Code-Node mit JS verwenden (siehe `Filter: Bereit zum Posten` in WF-03 v5)

---

## 12. Onboarding für die nächste Session

> Working directory: `/Volumes/Physio_Fuchs/SocialMedia/`.
> Lies bitte zuerst `CLAUDE.md`, diese Datei, und
> `SESSION-Naechste-Schritte_2026-05-14.md`. Dann starten wir bei
> Punkt 1 (Canva-Secret rotieren) der „Nächsten Schritte".
