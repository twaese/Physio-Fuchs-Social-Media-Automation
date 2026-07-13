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

## Offene Punkte

### Muss beobachtet werden
1. **Live-Verifikation Datum-Fix:** Beim nächsten terminierten Post müssen
   die Stunden-Läufe vor der Uhrzeit `scheduled_future` melden und der Post
   pünktlich rausgehen. (Judith-Eintrag abwarten, WF-03-Executions prüfen.)

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
