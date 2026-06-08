# Nächste Session – Aufräumen + Roadmap-Fortsetzung

**Stand:** 2026-05-18 (Vortag-Abend geschrieben nach erstem Live-Post)
**Gestern abgeschlossen:** WF-02 v18.2 + WF-03 v6 live, erster echter Post auf IG+FB. Pipeline funktioniert E2E.

---

## 1. Quick-Check zum Sessionstart (5 Min)

- [ ] **IG-Feed @physio_fuchs_lintorf** angeschaut — irgendwas seit gestern Abend automatisch live gegangen? (Sollte nicht — alle `Bereit`-Items haben Datum in Zukunft.)
- [ ] **SP PF-2026-100** auf Status `Bereit` zurücksetzen (war auf `Veröffentlicht` vom Live-Test). `field_12` leeren. Eintrag in `field_13`: „2026-05-17 TESTLAUF — ignorieren".
- [ ] **Test-Posts gelöscht?** (User hat IG schon gelöscht — FB-Page-Post + Hashtag-Comment auch?)
- [ ] **KARENZ_HOURS in WF-03 v6 FilterKZ wieder auf 24 setzen** (war zum Test auf 0)
- [ ] **WF-02 + WF-03 Toggle** auf „Active" stehen? Wenn ja: Pipeline läuft ab nächstem Cron-Tick automatisch

---

## 2. Was als Nächstes ansteht

### 2.1 WF-02 v19 — paired-items Refactor (~2h)

**Problem:** Aktuell verarbeitet WF-02 v18.2 max. 1 Item pro Cron-Lauf (`return results.slice(0, 1)`). Bei mehreren `Entwurf`-Items dauert es Stunden bis alle durch sind. Multi-Item-Modus scheitert am n8n-`.item`-Kontext-Problem.

**Lösung:** Alle `Code`-Nodes in WF-02 müssen `pairedItem: { item: idx }` mitliefern. Damit kann n8n die Item-Zuordnung über parallele Branches (Gotenberg IG + FB, GitHub-Push, SP-Upload) auflösen.

**Skeleton:**

```javascript
// Validieren + Weiterleiten (und ALLE folgenden Code-Nodes)
for (let idx = 0; idx < items.length; idx++) {
  const item = items[idx];
  const f = item.json.fields || {};
  // ... bestehende Logik ...
  results.push({
    json: { _sp_item_id: itemId, _branch: branch, sp_fields: f, ... },
    pairedItem: { item: idx }   // ← NEU, KRITISCH
  });
}
return results;  // KEIN slice mehr
```

**Nodes die geändert werden müssen:**
- `Code: Validieren + Weiterleiten`
- `Code: Caption-Prompt bauen`
- `Code: HWG-Filter`
- `Code: HTML-Template befüllen`
- `Code: IG → GitHub Body`
- `Code: FB → GitHub Body`
- `Code: SP-Update`

**Test-Plan:**
1. v18.2 als `_v18.2.bak.json` sichern
2. In v18.2 alle pairedItem-Zeilen ergänzen, slice(0,1) entfernen → speichern als v19
3. **Vorsichtig:** Testfilter `if (title !== 'PF-2026-100') continue;` temporär einbauen
4. Manuell triggern → 1 Item durch → grün → Testfilter raus → mit 2-3 Items testen → grün → 10 Items
5. Erst dann live aktivieren

### 2.2 LinkedIn-Template (~1h)

LinkedIn ist die 3. Plattform (Square 1200×1200). Foto-Layout v12 adaptieren analog FB.

**Datei:** `04_Canva-Vorlagen/html-templates/linkedin/PF_Feed_LI_Standard.html`

**Schritte:**
1. `facebook/PF_Feed_FB_Standard.html` kopieren als `linkedin/PF_Feed_LI_Standard.html`
2. `:root`, `html`, `body`, `.canvas`: 1080×1080 → 1200×1200
3. Padding und Schriftgrößen für neues Format kalibrieren
4. Mockup `_tests/_test-PF-2026-100_linkedin.html` aktualisieren (iframet das neue Template, Skalierung anpassen)
5. **WF-03 v7 anlegen:** zusätzlichen LinkedIn-Branch parallel zu IG/FB. LinkedIn nutzt eigene API (`https://api.linkedin.com/v2/...`), nicht Meta Graph.
6. Credentials für LinkedIn anlegen (OAuth2-App in LinkedIn Developer Console)

### 2.3 Track 2: D-ID Avatar + Voice-Clone (Zeitaufwand offen)

Avatar-Pipeline für Reel/Übung/Story. Items werden derzeit in WF-02 v18.2 mit `continue` übersprungen.

**Plattform-Entscheidung (2026-05-18):** **D-ID** als Avatar-Anbieter — Begründung:
- API-first (REST), saubere n8n-HTTP-Node-Integration
- Voice-Clone integriert, kein 2. Anbieter nötig
- 1 Foto + 30-90s Voice-Sample reichen für Custom Avatar (HeyGen braucht 5-Min-Training-Video)
- Render-Zeit 1-3 Min für 30s Video → passt in stündlichen Cron
- Pricing: $5/Monat Lite oder Pay-as-go ~$0,10-0,30/Min — geringes Einstiegsrisiko
- DSGVO: EU-Server-Option im Pro-Plan
- Alternativen evaluiert: HeyGen (Premium aber teurer + Training-Video aufwendig), Synthesia (Enterprise-Tier zu teuer), Tavus (eher Conversational-Use-Case), ElevenLabs+SyncSo (2 Anbieter, mehr Komplexität)

Default-Provider in `06_Avatar-Reel-Konzepte/Avatar-Integration-Plan.md` ist bereits auf `"d-id"` gesetzt.

**Setup-Reihenfolge:**
1. **D-ID Account** anlegen, API-Key generieren
2. **Voice-Clone** von Judith: 60 Sekunden Audio-Sample → D-ID Voice-Clone-Endpoint
3. **Test-Avatar** mit 30 Sekunden Text-Skript → MP4-Output prüfen
4. **n8n Avatar-Branch** in WF-02 v18.2 ergänzen:
   - Switch-Node: wenn `_branch == 'avatar'` → D-ID-API-Call statt Gotenberg
   - Polling bis MP4 fertig
   - MP4 nach GitHub pushen (wie bei Bildern)
   - SP-Update mit Video-URL
5. **`continue`-Zeile in Validate entfernen** + AVATAR_ENABLED-Flag in Sticky-Note
6. WF-03 v6 IG-Branch erweitern: bei Video-URL stattdessen `/{ig-id}/media?media_type=REELS` benutzen

**Aufwand:** Setup 2-3h, Integration 4-6h. Eigene Session.

### 2.4 Strategie-Shift Recruiting (Zeitaufwand offen)

(Aus Backlog — wenn Zeit ist, sonst verschoben.)

---

## 3. Bekannte Backlog-Items / Nice-to-have

- Wochenreport in Teams: jeden Freitag-Abend Übersicht „X Posts veröffentlicht, Y Items in Pipeline, Z Geblockt"
- WF-05: Insights-Sync (Reach/Likes aus Meta zurück in SP)
- WF-06: Kommentar-Monitor (DMs/Comments in Teams)
- Karenz-Logik auf SP-Custom-Field umstellen statt `lastModifiedDateTime` (robuster gegen unbeabsichtigte Status-Edits)
- HWG-Filter erweitern um „kurz vor Verboten"-Heuristik (LLM-basiert)

---

## 4. Sicherheits-Checkliste vor Aktivierung von v19 (paired-items)

- [ ] `slice(0, 1)` nur entfernen wenn pairedItem in ALLEN Nodes vorhanden
- [ ] Test-Run mit 1, dann 3, dann 10 Items
- [ ] Rate-Limit-Check: Claude API + GitHub API + SP API + Meta Graph
- [ ] Bei >5 Items pro Lauf: kurze `wait`-Nodes zwischen API-Calls erwägen
- [ ] HWG-Filter auch bei Bulk-Verarbeitung sauber? Logs prüfen

---

## 5. Onboarding-Prompt für nächste Session

> Working directory: `/Volumes/Physio_Fuchs/SocialMedia/`.
> Lies zuerst `CLAUDE.md`, dann `00_Konzept/Workflow-Konzept.md` (Stand 2026-05-17), dann diese Datei.
> Gestern Pipeline E2E live gebracht: WF-02 v18.2 + WF-03 v6 + erster echter Post auf IG+FB.
> Heute fokussiert auf:
> 1. Quick-Check (Karenz auf 24h, SP-100 zurücksetzen, Test-Posts gelöscht)
> 2. WF-02 v19 (paired-items Multi-Item)  ODER
> 3. LinkedIn-Template + WF-03 v7  ODER
> 4. Track 2: D-ID-Avatar-Setup beginnen
> Bitte fragen, welche Priorität.

---

## 2026-06-08 ergänzt — Foto-Branch vorbereitet

- ✅ **GitHub-Repo wieder Public** (war versehentlich Private + umbenannt → Pipeline 404)
- ✅ **HTML-Templates v13 (IG) / v2 (FB)** mit `{{BACKGROUND_PHOTO}}`-Platzhalter erstellt
- ✅ **Foto-Convention.md** für Judith dokumentiert (Naming, Pfad, Fallback-Strategie)
- ✅ **WF-02 v18.3 Spec** als Implementierungs-Anleitung geschrieben (`02_n8n-Workflows/WF-02_v18.3_Foto-Branch_Spec.md`)
- ✅ **Mac-Symlink** auf SP-Praxis-Fotos angelegt (`04_Canva-Vorlagen/SP-Praxis-Fotos`)
- ⏳ **n8n-Umbau** auf v18.3 noch ausstehend (~50 Min nach Spec)

## Heute (2026-05-18) erreicht

- ✅ **PF-2026-001 (Tipp „Nacken & Schultern") vollautomatisch live gepostet**
  - IG: https://www.instagram.com/physio_fuchs_lintorf/ (Post-ID `17876643156601182`)
  - FB: Page Physio Fuchs Lintorf (Post-ID `104383336093043_779334805261610`)
  - SP Status → `Veröffentlicht`, Log in field_13 sauber geschrieben
- ✅ **FilterKZ Timezone-Bug gefixt**: Schedule-Check verglich UTC-implizite Zeit mit `now` (UTC). Berlin-Sommer-Offset (+02:00) jetzt explizit über `Date.UTC(yyyy, mo-1, dd, hh-offset, mm, 0)` reingerechnet. DST-Heuristik: Apr-Okt +2, sonst +1 (genau genug für Posting-Workflow).
- ✅ **WF-02 Merge-Code Bug gefixt** (zwei Bugs gleichzeitig):
  - `.item` → `.first()` für GitHub-Push-Lookups (Multi-Branch-Merge-Problem)
  - `payload.field_9` → `payload.field_8` (aktive Spalte, nicht die alte Hyperlink-Spalte)
  - Verifiziert mit PF-2026-007: field_8 + Bild_FB_Dateiname automatisch gefüllt, Log zeigt `IG✓/FB✓`
- ✅ **Pipeline jetzt 100% selbstheilend** — keine manuellen URL-Nachträge mehr nötig
- ✅ **Hashtag-Dopplung gefixt**: WF-02 Merge schreibt jetzt nur reine Caption in field_10 (Hashtags separat in field_7). WF-03 hängt für IG genau einmalig an. Strikte Spalten-Trennung dokumentiert in `02_n8n-Workflows/WF-02_Caption-Generator.md`.
- ⚠️ **Altlasten:** Bestehende `Bereit`-Items in SP (vor 18.05. mittags) haben Hashtags noch in field_10. Werden mit Doppel-Hashtags posten, wenn ihr Datum kommt. Entscheidung: **Variante C akzeptiert** — keine Massenbereinigung, ~5-10 Posts mit kosmetischem Doppel-Tag. Ab neuen Items ist's sauber.
- ✅ **KARENZ_HOURS zurück auf 24** in FilterKZ

## Änderungshistorie

| Datum       | Was                                                       | Wer    |
| ----------- | --------------------------------------------------------- | ------ |
| 2026-05-17  | Initial nach Live-Pipeline                                | Claude |
| 2026-05-18  | PF-2026-001 vollautomatisch live; Timezone-Fix FilterKZ   | Claude / Thomas |
