# Session 2026-06-21 — Sofort-Posten + WF-Chain live

**Beteiligte:** Thomas Waese · Claude (Opus 4.7)
**Dauer:** ca. 4 h
**Status am Ende:** alles live, Repo + n8n synchron, NAS ↔ GitHub identisch (HEAD `e63059f`)

---

## Was erledigt wurde

### 1. Formular v4 mit Sofort-Posten
- `physio_fuchs_form_v4_live.html` ersetzt v2 (v2 + v3 ins lokale `_Archiv/Formulare/` verschoben, gitignored)
- Neuer Webhook: `/sharepoint-content-v4-test` (WF-01 v4)
- Sofort-Posten-Checkbox (🚀) zwischen Datum-Block und Material-Section
- Hochgeladen auf Hostinger: `/docker/gt-ui/html/content-form.html` + `/root/frontend/content-form.html` (live-URL: https://gt-assistent.srv1099163.hstgr.cloud/content-form.html)
- Backups beider Server-Pfade: `*.bak_2026-06-21`

### 2. SharePoint-Spalte `Sofort_Posten`
- Bool, manuell in SP-UI angelegt
- Durchgereicht von Form → WF-01 → SP

### 3. WF-01 v4 Bug-Fix
- `Sofort_Posten`-Feld hatte `=={{ ... }}` mit doppeltem `=` im SharePoint-Item-Erstellen-Node → SP-500. Fix in n8n-UI: ein `=` raus.

### 4. WF-01 → WF-02 Chain live
- WF-01: neuer `Execute Workflow`-Node nach „Teams: Eingang melden" → ruft WF-02 direkt auf
- WF-02: neuer `Execute Workflow Trigger` parallel zum Cron, `inputSource: passthrough`
- Wartezeit für Caption+Bild von ~1 h (Cron) auf ~2 s reduziert
- End-to-End-Test grün mit Item #68 (Execution 55244 → 55245)

### 5. Versionierte Workflow-Backups
- `02_n8n-Workflows/_Backups/` mit Pre-Eingriff-Snapshots
- Naming: `PF_WF-NN_vX_YYYY-MM-DD_HHMM_<eingriff>.json`
- README dokumentiert Rollback-Befehl
- Live-Stände auch im Repo: `PF_WF-01_Foto_Video_Upload_v4.json`, `PF_WF-02_Caption_Generator_v18.3.json`, `PF_WF-03_Social_Media_Post_v6.json`

### 6. WF-03 v7 Spec
- `02_n8n-Workflows/WF-03_v7_Sofort-Posten_Teams-Notify_Spec.md`
- FilterKZ-Code bypasst Karenz + Datum bei `Sofort_Posten=true`
- Teams-Adaptive-Card nach Live-Schaltung (Workflow „Webhookwarnungen an Socialmedia senden")
- **Status:** implementiert in n8n, nicht End-to-End-getestet (Teams-Card-Test fehlt noch)

### 7. GitHub-Cleanup
- 8 Test-Bilder via `gh api` gelöscht (#64, #66, #67, #68 jeweils ig+fb)
- 3 untracked v3-Reste lokal gelöscht (Vorschlag, Session-Notiz, Test-JSON)

---

## Offene Punkte für nächste Session

### 🔴 Hoch — funktional unvollständig

1. **WF-02 Stock-Pool-Bug**
   - Im Formular gewählt „🌿 Stockfoto" → WF-02 zieht trotzdem den Default `judith-behandlung-01.png`
   - Foto-Branch sucht aktuell nur nach `PF_{Jahr}_{ItemID}_*.jpg` und fällt direkt auf Fallback
   - Mittlere Stufe der Kaskade (Stock-Pool) **gar nicht implementiert**
   - Lösungs-Optionen:
     - A) `PF_STOCK_*.jpg` im selben SP-Ordner, zufällige Auswahl
     - B) Separater SP-Ordner `/Content_Socialmedia/Stockfotos/`, thematisch sortiert (`bewegung_*`, `praxis_*`)
   - **Input von Judith benötigt:** welche Stockfotos parat? Wie viele? Themen?

2. **WF-02 → WF-03 Chain bei Sofort=true**
   - Aktuell: WF-02 läuft sofort nach WF-01, aber WF-03 wartet weiter auf den stündl. Cron
   - Für echtes „60s live": WF-02 ruft WF-03 direkt auf, wenn `Sofort_Posten=true`
   - Selbes Muster wie WF-01 → WF-02 (Execute-Workflow-Trigger in WF-03 + Execute-Workflow-Node am Ende von WF-02 mit IF-Sofort-Bedingung)

### 🟡 Mittel — Verifikation

3. **WF-03 v7 + Teams-Card-Test**
   - Implementiert, aber noch nie ein echter Sofort-Post live gegangen
   - Teams-Adaptive-Card mit „🚀 SOFORT-Post live!" vs „🎉 Neuer Post live!" Conditional ungeprüft
   - Nächster echter Post (mit Sofort=true gesendet) wird's zeigen

### 🟢 Niedrig — Refactoring

4. **WF-02 Caption-Generator-Versionen aufräumen** — Im Repo liegen noch `_Archiv-Workflows/` Sachen und im n8n viele alte v1–v17 Varianten. Cleanup-Pass irgendwann.

5. **n8n source-control auf Community-Tier** — n8n hat ab v1.x eingebaute Git-Integration, aber wahrscheinlich nicht in Self-Hosted Community. Falls doch, könnte das unser halbautomatischer Export-Workflow ablösen.

---

## Wichtige technische Erinnerungen

- **n8n-Import via CLI:** `docker exec n8n-n8n-1 n8n import:workflow --input=/home/node/.n8n/<file>.json`
- **Permission-Gotcha:** Nach `scp root@…:/docker/n8n/n8n_data/` immer `chown 1000:1000 <file>` — n8n läuft als user `node` (uid 1000) und kann root-files nicht lesen
- **Trigger-Reload:** Nach `update:workflow --active=true` braucht n8n einen Restart (`docker compose restart n8n`), sonst sind Webhooks/Cron nicht re-registriert
- **Execute-Workflow-Trigger braucht `inputSource: "passthrough"`** — sonst gelbe Warnung „nicht für Eingaben konfiguriert"
- **Webhook antwortet 200 *vor* SP-Call** wenn kein `respondToWebhook`-Node davor sitzt → Formular zeigt „Erfolg" auch bei SP-Fehler. Pre-Validierung wäre nice-to-have.

---

## Status der Live-Systeme

- **Formular:** v4 live ✓
- **WF-01 v4:** chain → WF-02 ✓
- **WF-02 v18.3:** Execute-Trigger + Cron parallel ✓
- **WF-03 v6/v7:** Sofort-Bypass-Logik in FilterKZ ✓, Teams-Notify ✓, aber Sofort-Pfad noch nicht *real* gefeuert
- **SP-Spalte:** `Sofort_Posten` ✓
- **Repo:** sync mit Remote, working tree clean ✓
- **n8n-Backups:** in `_Backups/` versioniert ✓
