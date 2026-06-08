# Nächste Session – Stand 2026-06-08

**Großer Meilenstein heute:** WF-02 v18.3 live mit variablen Praxis-Fotos pro Content. End-to-End-Test mit PF-2026-010 erfolgreich (Schuhe-Foto als Hintergrund + Claude-generierter Titel „Starke Füsse – Starkes Fundament").

---

## Heute (2026-06-08) erreicht

- ✅ **GitHub-Repo Crisis behoben** — Repo war versehentlich Private + umbenannt → wieder Public + alter Name
- ✅ **HTML-Templates v13 (IG) / v2 (FB)** mit `{{BACKGROUND_PHOTO}}`-Platzhalter live im Repo
- ✅ **WF-02 v18.3 Foto-Branch** implementiert + getestet:
  - SP-Foto-Suche per Item-ID (PF_{year}_{id-3stellig}_*.jpg)
  - GitHub-Push des Praxis-Fotos
  - HTML-Render mit Item-spezifischem Foto
  - Fallback-Kaskade (Item → Stock → Default)
- ✅ **Foto-Convention.md** für Judith dokumentiert (Naming, Pfad, Workflow)
- ✅ **Mac-Symlink** `04_Canva-Vorlagen/SP-Praxis-Fotos` → OneDrive (in .gitignore)
- ✅ **Repo-Aufräumen:** Em-Dash-Duplikate ins Archiv, Sessions sortiert, .DS_Store weg
- ✅ **`generated-posts/` lokal entlastet** via Git Skip-Worktree (~107 MB frei, Remote bleibt vollständig)

## Track 2 (D-ID Avatar) — Status
- ✅ Foto, Pro-Plan, Voice-Sample fertig
- ⚠️ **D-ID Voice-Cloning rejected 3× trotz korrektem Text** (Whisper verifiziert)
- ⏳ Support-Mail entworfen, noch nicht abgeschickt
- ⏳ Plan B: In-Browser-Mikrofon-Aufnahme oder ElevenLabs als Alternative

---

## Quick-Check Sessionstart

- [ ] WF-02 v18.2 (alte) deaktivieren wenn nicht schon → v18.3 ist die aktive Pipeline
- [ ] v18.3 als „Active" markieren wenn noch nicht
- [ ] Foto-Convention an Judith schicken (Datei → Teams-Chat)
- [ ] Test mit Item ohne SP-Foto (Fallback-Pfad verifizieren)

---

## Offene Punkte / Backlog

### Kurzfristig (1-2 Sessions)

1. **D-ID Voice-Cloning Support-Mail** abschicken — Entwurf in Chat-History 2026-06-08, an support@d-id.com
2. **Fallback-Test** mit Item das KEIN spezifisches Foto in SP hat — Erwartung: Stock-Pool oder Default-Foto greift, Log-Eintrag
3. **PF-2026-010 Status zurücksetzen** falls Test-State unsauber
4. **WF-02 v18.2 archivieren** sobald v18.3 ~2 Wochen ohne Fehler läuft (→ `_Archiv-Workflows/`)

### Mittelfristig

1. **Foto-Upload im Formular (Weg B)** — content-form.html erweitern um File-Input, WF-01 erweitern für Photo-Push direkt zu SP `Fotos/{year}/` mit korrekt vergebener Item-ID
2. **Stock-Pool kuratieren** im SP-Ordner `Fotos/Instafotos Stock/` — 10-20 generische Praxis-Bilder als Fallback
3. **WF-02 v19 (paired-items)** für Multi-Item-Modus — `slice(0, 1)` entfernen, jeder Code-Node mit `pairedItem: { item: idx }`

### Langfristig

- LinkedIn-Template auf Foto-Layout (Square 1200×1200)
- Track 2: D-ID Avatar-Branch live (sobald Voice-Clone klappt)
- Strategie-Shift Recruiting
- Wochen-Report-Workflow (IG/FB Insights → SP)

---

## Onboarding-Prompt für nächste Session

> Working directory: `/Volumes/Physio_Fuchs/SocialMedia/`.
> Lies zuerst `CLAUDE.md`, dann `SESSION-Naechste-Schritte_2026-06-08.md` (diese Datei).
> Letzte Session: WF-02 v18.3 mit Foto-Branch live, End-to-End verifiziert mit PF-2026-010.
> Pipeline-Status: WF-01 ✓, WF-02 v18.3 ✓, WF-03 v6 ✓ — alle in Produktion.
> Wahrscheinlich heute: D-ID-Voice-Support-Antwort verarbeiten ODER Weg B (Foto-Upload im Formular) ODER Stock-Pool kuratieren.

---

## Änderungshistorie

| Datum       | Was                                                       | Wer    |
| ----------- | --------------------------------------------------------- | ------ |
| 2026-06-08  | Initial nach v18.3 Live + GitHub-Repo-Fix + Cleanup       | Claude / Thomas |
