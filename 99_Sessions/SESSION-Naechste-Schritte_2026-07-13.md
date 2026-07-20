# Nächste Session – Stand 2026-07-13

**Kern der Session (04.07.–13.07.):** Repo-Aufräumen, Strategie-Pivot auf
**Personalrecruiting**, erster Post mit Judiths Formular-Foto-Upload
(Item #73 „Haltungsschulung"), und ein **Timezone-Bug in WF-03 gefunden
und gefixt** (Post ging 5h zu früh raus).

---

## Erledigt in dieser Session

### Repo / Aufräumen
- ✅ WF-02 v18.2 + WF-01 v2 JSONs nach `_Archiv-Workflows/` (abgelöst durch v18.3 / v4)
- ✅ `physio_fuchs_templates.html` endgültig gelöscht (alte Farbpalette, ersetzt durch `_Previews/` + form_v4_live); CLAUDE.md-Ordnerstruktur aktualisiert
- ✅ `.gitignore`: `Thumbs.db` / `desktop.ini` (Windows-Artefakte via SMB)
- ✅ Symbole-Instagramm: neues Icon-Set (10 PNG, CI-Grün `#809B3D`) committed, alte JPG-Cover raus
- ✅ NAS ↔ GitHub mehrfach abgeglichen — synchron

### Strategie
- ✅ Briefing v1.0 (docx) in `00_Konzept/` übernommen
- ✅ **Strategie v1.1 Recruiting-Fokus** erstellt: `00_Konzept/PF-Strategie_Social-Media_v1.1_Recruiting-Fokus.md`
  — Leitziel = Bewerbungen, Säulen: Team 30 % / Karriere 20 % (NEU) / Übungen 25 % / Fachwissen 15 % / Saisonales 10 %; Patientenstimmen-Säule ersetzt durch Mitarbeiterstimmen (HWG-sicher); LinkedIn aufgewertet; KPIs auf Bewerber-Kontakte
- ✅ Instagram-Highlights-Doku: `05_Content-Planung/Instagram-Highlights-Setup_2026-07-04.md`

### Pipeline / Item #73 („Haltungsschulung")
- ✅ Erster kompletter Durchlauf mit Judiths Foto-Upload aus dem Formular:
  WF-01 → Foto als `PF_2026_073_haltungsschulung.png` in SP `Fotos/2026/` →
  WF-02 (Caption, HWG grün, Bild mit Foto gerendert, GitHub-Push) →
  WF-03 gepostet (IG + FB live, 13.07. 13:01)
- ✅ **Bug gefunden:** Post ging 13:01 statt 18:00 raus.
  Ursache: FilterKZ nahm UTC-Datum (`split('T')[0]`) aus `Veröffentlichungsdatum`;
  SP speichert Berlin-Mitternacht als „Vortag 22:00Z" → Schedule feuerte 1 Tag zu früh,
  nur die 24h-Karenz bremste noch.
- ✅ **Fix live (WF-03 v7.1):** `toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' })`.
  Prozess: Backup (`_Backups/PF_WF-03_v7_2026-07-13_1335_pre-datefix.json`) →
  Patch via API → Verify (Simulation Sommer+Winter grün, n8n-Validierung 0 Fehler) →
  Commit (`PF_WF-03_Social_Media_Post_v7.1.json` im Root, v6 archiviert)

---

## Nachtrag 2026-07-20 — CI-Farbe & Titel-Umbruch

- ✅ **Alle 34 Bilder der 17 wartenden Posts tragen jetzt `#809B3D`.**
  Nach deinen 24 Bildern (`b4d5c66`) trugen noch 15 Items (Termine
  03.08.–21.12.) das alte Salbei `#7E9963` — wären also monatelang im
  alten Grün live gegangen. Nachgezogen per gezielter Farbersetzung im
  Bild (`baa857f`), gleiche Methode wie bei deinen 24: Dateinamen und
  Bildinhalte unverändert, dadurch SharePoint-URLs und Captions
  unberührt. Verifiziert: 34/34 exakt `#809B3D`, keine Änderung in
  Fotozonen.
- ✅ **Titel-Umbruch gefixt** (`a24c2e5`): Lange Wörter liefen bei
  Instagram über den Textrahmen und überlappten den Ginkgo (sichtbar bei
  Item #72 „Wasserbahnhof"). `hyphens: auto` + `overflow-wrap: break-word`
  in IG-, FB- und LinkedIn-Template. Wirkt nur auf **neue** Renderings.
- ℹ️ **Merkposten:** Bereits veröffentlichte Posts lassen sich nachträglich
  nicht umfärben — Meta kopiert das Bild beim Posten auf den eigenen CDN.
  Farbänderungen am Template müssen also *vor* dem Posting greifen.

---

## Nachtrag 2026-07-20 — Datenschutz-Vorfall abgeschlossen

**Vorfall:** Ein Screenshot einer privaten Kontoübersicht lag als
`PF_2026_059_fghfghfghfjfgj.png` seit 12.06. im öffentlichen Repo —
plus zwei daraus gerenderte Post-Bilder (59_ig / 59_fb), die den
Screenshot als Hintergrund zeigten. Insgesamt 5,5 Wochen öffentlich.

**Bereinigt:**
- Backup als Bundle gesichert (`~/PF-Repo-Backup-vor-DSGVO-Rewrite-2026-07-20.bundle`)
- Historie mit `git filter-repo` bereinigt, `main` force-gepusht
  → neuer HEAD `00e6a7395c9904a58b179870add6fe74623f4272`
- Verifiziert: 3 Dateien entfernt, 271 verbliebene Dateien inhaltlich
  unverändert (Blob-Hash-Vergleich), 195 → 192 Commits
- NAS nachgezogen, skip-worktree wiederhergestellt
- GitHub-Ticket #4586849 („Clear Cached Views") → **am 20.07. gelöst**,
  Cache-Clearance + Garbage Collection durchgeführt
- **Endkontrolle 20.07.:** alle drei SHA-URLs HTTP 404, Commits über
  API 422, `main` weiterhin 200 ✓

**Lehren:**
- Der Virtual-Agent im Support-Formular **kürzt lange Texte ab** — von
  drei genannten Commits kam nur einer an. GC lief zum Glück
  repository-weit. Bei künftigen Tickets: kurz fassen, Details ins Ticket
  nachreichen.
- Force-Push allein genügt nicht: Objekte bleiben über direkte SHA-URLs
  abrufbar, bis GitHub die GC ausführt.

**Noch offen (außerhalb der Technik):** Klärung mit der Bank — die Daten
waren 5,5 Wochen öffentlich abrufbar.

---

## Offene Punkte

### Muss beobachtet werden
1. **Live-Verifikation Datum-Fix:** Beim nächsten terminierten Post müssen
   die Stunden-Läufe vor der Uhrzeit `scheduled_future` melden und der Post
   pünktlich rausgehen. (Judith-Eintrag abwarten, WF-03-Executions prüfen.)
   → Nächste Gelegenheit: **Item #11 am 27.07., 10:00 Uhr**.

### Judith (manuell, Instagram)
2. Highlights anlegen + neue Icons als Titelbilder setzen
   (Empfehlung Reihenfolge mit Recruiting-Fokus: Team, **Jobs**, Praxis, Tipps, Kontakt)
3. Praxisvorstellungs-Video posten → Highlight „Praxis"
4. Storys für Kontakt/Jobs produzieren (Foto + Textoverlay reicht)

### Strategie-Umsetzung (Prio 1 aus v1.1, Kap. 7)
5. **WF-02-Caption-Prompt-Update:** Hook-Formeln, CTA-Rotation (recruiting-lastig),
   Hashtag-Set-Rotation inkl. Recruiting-Set — zuerst als Spec in `01_Prompts/`
6. Formular: Kategorie „Karriere/Team" ergänzen
7. DSGVO-Vorbereitung Team-Content: Einverständniserklärungen einsammeln
   (Vorlage `07_Datenschutz-DSGVO/`) — Voraussetzung für Team-Säule 30 %

### Bekanntes Verhalten (kein Bug, aber wissen)
- 24h-Karenz rechnet ab **letzter Item-Änderung** — jede manuelle Korrektur
  startet die Uhr neu.
- SP-Log in `field_13` schreibt UTC-Zeiten (2h hinter Berlin im Sommer).
- CLAUDE.md-Ordnerstruktur erwähnt noch `PF-Content-Kalender-2026.xlsx`
  (Datei liegt aktuell nicht im Root, ist per .gitignore ausgeschlossen) — klären ob Zeile raus soll.

### Backlog unverändert
- D-ID Voice-Cloning (hing bei 3× rejected; Alternativen: ElevenLabs, Browser-Aufnahme)
- WF-02 v19 Multi-Item-Modus, Stock-Pool kuratieren, LinkedIn-Anbindung (jetzt Prio 2 statt langfristig!), Analytics-Loop

---

## Onboarding-Prompt für nächste Session

> Working directory: `/Volumes/Physio_Fuchs/SocialMedia/`.
> Lies zuerst `CLAUDE.md`, dann `99_Sessions/SESSION-Naechste-Schritte_2026-07-13.md`.
> Strategie-Leitplanke: **Recruiting-Fokus** — maßgeblich ist
> `00_Konzept/PF-Strategie_Social-Media_v1.1_Recruiting-Fokus.md`.
> Pipeline: WF-01 v4 ✓, WF-02 v18.3 ✓, WF-03 **v7.1** ✓ (Datum-Fix 13.07., Live-Verifikation ausstehend).
> Wahrscheinlich heute: WF-02-Prompt-Spec (Recruiting-CTAs + Hashtag-Rotation) ODER Datum-Fix-Verifikation ODER Formular-Kategorie „Karriere/Team".

---

## Änderungshistorie

| Datum       | Was                                    | Wer             |
| ----------- | -------------------------------------- | --------------- |
| 2026-07-13  | Initialversion (Übergabe Session 04.–13.07.) | Claude / Thomas |
