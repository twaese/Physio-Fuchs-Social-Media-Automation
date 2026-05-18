# Nächste Session – WF-03 v6 (Karenz + Meta Graph Posting)

**Stand:** 2026-05-16, mittags
**Heutiger Meilenstein:** Pipeline Formular → SharePoint → Bild+Caption E2E grün.

---

## 1. Was heute erreicht wurde

| Komponente | Status |
|---|---|
| Gotenberg-Sidecar auf Hostinger-VPS | ✅ läuft, n8n erreicht via `http://gotenberg:3000` |
| HTML-Templates (Instagram 1080×1350, Facebook 1080×1080, LinkedIn 1200×1200) | ✅ im Repo, mit echtem Logo + Judith-Portrait + Garamond + Salbei/Creme |
| GitHub-Repo `Physio-Fuchs-Social-Media-Automation` public | ✅ Raw-URLs für Templates+Assets von n8n erreichbar |
| SharePoint Doc-Library `Social-Media-Assets` | ✅ angelegt, GUID `c1f0a171-5df2-4c8b-9ab4-db3ed8e76266` |
| SharePoint-Spalte `Bild_FB_Dateiname` (Typ Text) | ✅ |
| WF-02 v18 (25 Nodes) — Caption + Bild-Generierung | ✅ E2E grün, Testdurchläufe für PF-2026-100, -002, -003, -004 erfolgreich |
| WF-01 — Formular → SharePoint | ✅ Datum-Mapping korrigiert (Veröffentlichungsdatum → ISO YYYY-MM-DD) |
| Formular auf `gt-assistent.srv1099163.hstgr.cloud/content-form.html` | ✅ Webhook-URL aktualisiert, Checkbox „Direkt für Caption" entfernt |
| Formular in Teams als Tab eingebunden | ✅ Judith klickt „Content einreichen" im Socialmedia-Channel |

---

## 2. Was als Nächstes ansteht

### 2.0 Image-Hosting für Meta-Posting (BLOCKER vor 2.1)

**Problem entdeckt am Nachmittag:** SharePoint-Library `Social-Media-Assets` ist trotz Tenant + Site auf „Jeder mit Link" konfiguriert nicht ohne Anmeldung erreichbar — Test im Incognito gab immer Login-Prompt. Vermutung: M365-Group-Privacy von „Privat Team"-Site überschreibt Site-Sharing-Settings.

**Plan B (entschieden):** Bilder zusätzlich nach GitHub pushen → URL = `raw.githubusercontent.com/...` → garantiert public.

**Du machst (Setup ~10 Min):**
1. GitHub PAT erzeugen (Settings → Developer settings → PAT → Fine-grained):
   - Repository: `Physio-Fuchs-Social-Media-Automation`
   - Permission: `Contents: Read and write`
2. Token kopieren
3. Auf VPS: `/docker/n8n/.env` → `GITHUB_TOKEN=ghp_xxxxxx` ergänzen
4. `docker compose restart n8n` damit Env-Var greift

**Claude macht (~30 Min):** WF-02 v18.2 erweitern:
- Pro Bild nach Gotenberg-Render: HTTP-Node `PUT /repos/twaese/Physio-Fuchs-Social-Media-Automation/contents/04_Canva-Vorlagen/generated-posts/{itemId}_ig.png`
- Body: `{"message": "Auto-post bild", "content": "<base64-encoded PNG>"}`
- Response: GitHub-Raw-URL
- In `field_9` / `Bild_FB_Dateiname` statt SP-URL die GitHub-URL speichern
- SP-Upload bleibt parallel (Backup-Archiv)

### 2.1 WF-03 v6 bauen (1–1,5 h)

Pipeline-Abschluss: Karenz-Wartung + Posting auf Instagram + Facebook.

**Architektur:**

```
Cron stündlich
   ↓
SharePoint: Items mit Status=Bereit holen
   ↓
Code: Karenz-Check
   - Wann wurde Status=Bereit gesetzt? (aus field_13 Log parsen)
   - Wenn < 24h her → skip
   - Sonst → weiter
   ↓
Switch: Instagram aktivieren?
   ↓
Instagram-Branch:
   - POST /{ig-user-id}/media → Container mit image_url (field_9) + caption (field_10 + field_7)
   - POST /{ig-user-id}/media_publish → Container ID
   - Status → Veröffentlicht, field_12 = Instagram-Post-ID
   ↓
Facebook-Branch (parallel):
   - POST /{fb-page-id}/photos → Container mit url (Bild_FB_Dateiname) + caption
   - Direkt published
   - Comment hinzufügen mit Hashtags (FB-Best-Practice)
   - Status → Veröffentlicht, Post-ID in field
```

**Vorbereitungen:**
- `INSTAGRAM_BUSINESS_ACCOUNT_ID` aus Meta Business Suite holen
- `FACEBOOK_PAGE_ID` aus Meta Business Suite holen
- `META_ACCESS_TOKEN` mit Scopes `instagram_basic, instagram_content_publish, pages_show_list, pages_read_engagement, pages_manage_posts` erzeugen (Long-Lived Token, ~60 Tage gültig)
- Diese als Env-Vars in `/docker/n8n/.env` setzen

### 2.2 WF-02 v18.1 — Multi-Item-Modus (15 Min)

In `Code: Validate + Route` aktuell:
```javascript
return results.slice(0, 1);  // TROCKENLAUF-Limit
```

Vor Live-Cron entfernen → `return results;`. Dann müssen aber die Paired-Items in der Pipeline funktionieren, sonst greifen die Merge-Codes auf falsche Items.

**Lösungsweg:** Merge-Node vor „Code: Merge + Update-Payload" einsetzen mit Mode „Combine by Position".

### 2.3 Live-Test (15 Min)

Wenn WF-03 v6 fertig:
- Test-Account auf Instagram (nicht Live-Page)
- Datum auf 2030 setzen → Karenz schluckt 24h, Post wird geplant aber nicht sofort live
- WF-03 manuell triggern
- Posting auf Test-IG prüfen

---

## 3. Was noch offen ist (mittel/lang)

- **Recruiting-Strategie** (Post-Typ + Caption-Prompt + Hashtag-Set + Foto-Bib)
- **Avatar-Track**: D-ID Test-Video rendern, Voice-Clone-Audio-Files prüfen
- **Avatar in WF-02 aktivieren** wenn D-ID läuft (`AVATAR_ENABLED = true`)
- **Schöne Subdomain** für das Formular (optional, derzeit gt-assistent)

---

## 4. Bekannte Quirks

- **`Veröffentlichungsdatum`-Spalte** in SharePoint hat internen Namen `Ver_x00f6_ffentlichungsdatum` (URL-encoded ö). Mapping läuft, aber komisch. Falls neue Spalten mit Umlaut: Vorsicht.
- **`Bild_FB_Dateiname`** ist Typ Text, nicht Hyperlink (haben wir bewusst so gewählt für einfacheres SP-Payload).
- **GitHub-Repo ist jetzt public** — alle Workflow-Files + Doku weltweit lesbar. Keine echten Credentials drin (alle in n8n + VPS-`.env`).
- **WF-02 verarbeitet 1 Item pro Cron-Lauf** (slice(0,1)) — bei Live-Aktivierung entfernen, sonst stündlich nur 1 Eintrag.

---

## 5. Onboarding-Prompt für nächste Session

> Working directory: `/Volumes/Physio_Fuchs/SocialMedia/`.
> Lies zuerst `CLAUDE.md`, dann diese Datei (`SESSION-Naechste-Schritte_2026-05-16_v2.md`).
> Heutiger Stand: WF-01 + WF-02 v18 + Gotenberg + Formular E2E grün.
> Heute zu tun: WF-03 v6 bauen (24h-Karenz + Meta Graph Posting Instagram + Facebook).
> Vorab-Check: Meta-Tokens vorhanden, Test-Account bereit, IG_BUSINESS_ACCOUNT_ID + FACEBOOK_PAGE_ID notiert.

---

## 6. Änderungshistorie

| Datum       | Was                                                         | Wer    |
| ----------- | ----------------------------------------------------------- | ------ |
| 2026-05-16  | WF-02 v18 E2E grün; Formular live; WF-01 Datum-Fix          | Claude |
