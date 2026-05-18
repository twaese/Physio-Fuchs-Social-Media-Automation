# Nächste Session – Pipeline-Finish: Bild-Hosting + WF-03 v6

**Stand:** 2026-05-17, mittags
**Heute erreicht:** Foto-dominantes Layout v12 (Hintergrund-Foto + grüner Titel-Banner + Ginkgo + Logo-Karte) ist final, alle Plattform-Mockups sync.

---

## 1. Was als Nächstes ansteht

### 1.0 BLOCKER: Bild-Hosting für Meta-Posting

**Problem aus Sitzung 16.05.:** SharePoint-Library-Bilder sind nicht öffentlich erreichbar (auch nach Tenant + Site-Sharing auf „Jeder", Login-Prompt im Incognito blieb). Meta kann sie nicht laden.

**Plan B (entschieden):** GitHub-Push pro Bild → URL = `raw.githubusercontent.com/...` (garantiert public, da Repo public ist).

**User-Schritte (10 Min):**
1. GitHub PAT erzeugen:
   - github.com → Settings → Developer settings → Personal access tokens → Fine-grained
   - Repository: nur `Physio-Fuchs-Social-Media-Automation`
   - Permissions: **Contents: Read and write**
   - Token kopieren
2. Auf VPS in `/docker/n8n/.env` ergänzen:
   ```
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxx
   ```
3. `docker compose restart n8n` damit Env-Var greift

### 1.1 WF-02 v18.2 — GitHub-Push erweitern (~30 Min Claude-Arbeit)

Nach jedem Gotenberg-Render (IG + FB) zusätzlich:

```
HTTP-Node: PUT https://api.github.com/repos/twaese/Physio-Fuchs-Social-Media-Automation/contents/04_Canva-Vorlagen/generated-posts/{itemId}_ig.png
Headers:
  Authorization: Bearer {{ $env.GITHUB_TOKEN }}
  Accept: application/vnd.github+json
Body (JSON):
  {
    "message": "Auto-post Bild {itemId}_ig",
    "content": "<base64-encoded PNG-Bytes>"
  }
```

Response liefert die Datei-URL. Konvertieren zu Raw-URL:
```
https://raw.githubusercontent.com/twaese/Physio-Fuchs-Social-Media-Automation/main/04_Canva-Vorlagen/generated-posts/{itemId}_ig.png
```

Diese URL kommt in `field_9` (IG) bzw. `Bild_FB_Dateiname` (FB) statt der internen SharePoint-URL. SharePoint-Doc-Library bleibt parallel als Audit-Backup.

### 1.2 WF-03 v6 — Karenz + Meta Graph Posting (~1 h)

Bauen ab v5-Architektur (Posting-Logik funktionierte schon), aber:
- Canva-MCP komplett raus (Bilder kommen jetzt aus GitHub)
- Filter auf Status `Bereit` (statt v5: `Freigegeben`)
- 24h-Karenz: prüfen ob seit Status-Wechsel auf `Bereit` >24h vergangen (aus `field_13` Log parsen)
- Geplantes Datum: `field_4` + `field_5` erreicht?
- IG-Container + Wait 15s + Publish (aus v5 übernehmen)
- FB-Photo POST + danach FB-Comment mit Hashtags (Best-Practice)
- Status → `Geplant` → `Veröffentlicht`
- IG-Post-ID + FB-Post-ID in SharePoint zurückschreiben

**Test-Account:** Erst auf privatem IG/FB-Account, nicht Live-Page.

---

## 2. Was heute erreicht wurde

| Komponente | Stand |
|---|---|
| **Layout v12** (Foto + Banner + Ginkgo + Logo-Karte) | ✅ FINAL |
| Logo 210px innerhalb kompakter Karte | ✅ |
| „PHYSIO FUCHS" einzeilig Garamond 44px | ✅ |
| 12 Versions-Snapshots in `_alt/instagram/` archiviert | ✅ |
| 3 Plattform-Mockups (IG/FB/LinkedIn) iframen `_active-preview.html` | ✅ |
| Mockup-Sync-Workflow dokumentiert in README | ✅ |
| Repo committed + gepusht | ✅ |

---

## 3. Bekannte Quirks / Hausaufgaben

- **Bild_FB_Dateiname**: Spalte ist Text-Typ (vorher Hyperlink umgebaut). Funktioniert.
- **WF-02 v18 hat aktuell `slice(0,1)`** → verarbeitet nur 1 Item pro Cron-Lauf. Vor Live-Aktivierung entfernen (todo v18.1).
- **GitHub-Repo ist public** — alle Workflow-Files + Doku + Bilder weltweit lesbar. Keine echten Credentials drin (alle in n8n + VPS-.env).
- **Tenant-Sharing-Settings** auf SharePoint sind auf „Jeder mit Link" gestellt, aber Site-Privacy verhindert das anonyme Sharing. Egal — wir gehen via GitHub.

---

## 4. Pipeline-Architektur (Endzustand nach WF-03 v6)

```
Judith → HTML-Formular (Teams)
   ↓ Webhook
WF-01 (Formular → SharePoint) → Eintrag mit Status `Entwurf`
   ↓ stündlicher Cron
WF-02 v18.2 (Caption + Bild)
   - Caption via Claude
   - HWG-Filter
   - HTML-Template + Gotenberg-Render (IG + FB Bilder)
   - GitHub-Push für public URLs
   - SharePoint Upload (Audit-Backup)
   - Status → `Bereit`
   ↓ 24h-Karenz
WF-03 v6 (Posting)
   - Meta Graph: IG Container + Publish
   - Meta Graph: FB Photo + Hashtag-Comment
   - Status → `Geplant` → `Veröffentlicht`
   - Post-IDs in SharePoint
```

---

## 5. Onboarding-Prompt für nächste Session

> Working directory: `/Volumes/Physio_Fuchs/SocialMedia/`.
> Lies zuerst `CLAUDE.md`, dann diese Datei (`SESSION-Naechste-Schritte_2026-05-17.md`).
> Heute Vorbereitet: Layout v12 final + dokumentiert.
> Heute zu tun:
> 1. (User-Vorbereitung) GitHub-PAT in `/docker/n8n/.env` als `GITHUB_TOKEN`
> 2. (Claude) WF-02 v18.2 erweitern um GitHub-Push-Nodes
> 3. (Claude) WF-03 v6 bauen mit Karenz + Meta Graph Posting
> 4. (Gemeinsam) Live-Test auf privatem Test-Account

---

## 6. Änderungshistorie

| Datum       | Was                                                       | Wer    |
| ----------- | --------------------------------------------------------- | ------ |
| 2026-05-17  | Layout v12 final, alle Mockups sync, aufgeräumt          | Claude |
