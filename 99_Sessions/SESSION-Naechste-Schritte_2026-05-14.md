# Nächste Session – Standard-Posts produktiv machen

**Stand:** 2026-05-14, abends
**Letzter erreichter Punkt:** WF-03 v5 läuft bis kurz vor dem Canva-MCP-Call. Canva-OAuth-Token fehlt.

---

## 1. Was beim Wiedereinstieg zuerst zu tun ist

### 1.1 Sicherheit
- [ ] **Canva Client Secret rotieren** – das im Chat geleakte Secret im Canva Developer Portal revoken und neu generieren.
- [ ] Neues Secret nur lokal in `~/secrets/physio-fuchs/.env` ablegen als
  ```
  CANVA_CLIENT_ID=OC-AZ4XK6wyGCWN
  CANVA_CLIENT_SECRET=<neues geheimes Secret>
  ```
  (Client ID darf bleiben – ist nicht sensitiv.)

### 1.2 SharePoint-Liste aufräumen
- [ ] Test-Eintrag **PF-2026-100** wieder auf `Status = Entwurf` setzen, **damit er beim nächsten Lauf nicht versehentlich live gepostet wird**.
- [ ] Oder: Datum auf 2099-12-31 setzen.

---

## 2. Canva OAuth-Flow einrichten (zentrales Thema)

Anthropic erreicht in WF-03 v5 den Canva MCP-Server, bekommt aber 401, weil im Body kein `authorization_token` mitgeschickt wird.

### Möglichkeit A – n8n Canva-Credential nutzen (Recommended, prüfen!)
1. n8n öffnen → `Credentials` → `Add credential` → suchen nach `Canva`.
2. Falls vorhanden: Credential-Type wählen → Client ID + Secret eintragen → OAuth-Authorize-Button klicken → bei Canva zustimmen → fertig.
3. Vorteil: n8n verwaltet Refresh-Tokens automatisch.
4. Im Workflow: Credential im HTTP-Request-Node referenzieren.

### Möglichkeit B – Manueller OAuth-Flow
1. Browser öffnen mit Authorize-URL:
   ```
   https://www.canva.com/api/oauth/authorize
     ?client_id=OC-AZ4XK6wyGCWN
     &redirect_uri=http://localhost:8000/callback
     &response_type=code
     &scope=design:meta:read design:content:read design:content:write asset:read
     &state=physio-fuchs-init
   ```
2. Bei Canva zustimmen → `code` aus URL extrahieren.
3. Curl-Call zum Token-Endpoint:
   ```bash
   curl -X POST https://api.canva.com/rest/v1/oauth/token \
     -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
     -d 'grant_type=authorization_code' \
     -d 'code=<CODE_VON_OBEN>' \
     -d 'redirect_uri=http://localhost:8000/callback'
   ```
4. Response liefert `access_token` (4h gültig) und `refresh_token`.
5. Token in `~/secrets/physio-fuchs/.env`:
   ```
   CANVA_ACCESS_TOKEN=<...>
   CANVA_REFRESH_TOKEN=<...>
   CANVA_TOKEN_EXPIRES_AT=<ISO-Timestamp>
   ```
6. Refresh-Logik: separater n8n-Workflow „WF-08 Canva-Token-Refresh", der alle 3h das Token erneuert.

### Möglichkeit C – Anthropic MCP-Connector mit OAuth-Discovery
- Anthropic MCP-Connector unterstützt OAuth-Flow direkt (siehe Anthropic-Docs zu MCP).
- Im `mcp_servers`-Body kein `authorization_token` setzen, sondern den Server selbst den Flow initiieren lassen.
- Erfordert eingehende Konfiguration – am besten Anthropic-Docs konsultieren.

---

## 3. Sobald Canva-Token läuft: WF-03 v5 fertig testen

1. Im Claude+Canva-HTTP-Node `JSON`-Body anpassen:
   ```json
   "mcp_servers": [
     {
       "type": "url",
       "url": "https://mcp.canva.com/mcp",
       "name": "canva",
       "authorization_token": "Bearer {{ $env.CANVA_ACCESS_TOKEN }}"
     }
   ]
   ```
2. PF-2026-100 wieder auf `Status = Freigegeben` (oder einen frischen Test-Eintrag PF-2026-101 anlegen).
3. WF-03 v5 manuell triggern.
4. Erwartung:
   - Filter-Code-Node lässt PF-2026-100 durch.
   - Claude+Canva-Call läuft, MCP authentifiziert sich gegen Canva, ersetzt `[THEMA]` durch „Schreibtisch-Mobilisation" im Template `DAHJW_-mBBk`, exportiert JPG.
   - `Bild-URL extrahieren` parst die URL.
5. Posting-Nodes (IG/FB) bleiben **deaktiviert** für den Trockenlauf.
6. Wenn Bild-URL kommt → manuell im Browser öffnen → prüfen ob Layout/Text passt.
7. Bei OK: Posting-Nodes aktivieren, einmal mit privater Test-IG/FB-Seite posten.

---

## 4. Wenn alle vorigen Schritte grün

1. WF-04 in n8n aktivieren (`active: true`) – dann läuft monatlich automatisch.
2. WF-02 v17 aktivieren.
3. WF-03 v5 aktivieren mit täglichem Trigger.
4. Pool-Inventar in SharePoint sicherstellen: 2–3 Standard-Post-Entwürfe (Status `Entwurf`, Datum leer).
5. Beobachten beim 1. Juni 06:00 Uhr-Lauf von WF-04.

---

## 5. Was wir heute alles geschafft haben

- ✅ **WF-04 Monats-Scheduler** komplett gebaut, getestet, produktionsreif.
- ✅ **WF-02 v17 Auto-Release-Branch** gebaut, getestet, produktionsreif.
- ✅ **WF-03 v5 als JSON** vorbereitet mit allen Pre-Flight-Fixes (10 identifizierte Bugs aus v4 adressiert).
- ✅ **WF-03 v5 IF-Node durch Code-Filter** ersetzt (robuster, mit Debug-Output).
- ✅ **SharePoint-Liste:** Post_Typ um 6 Choices ergänzt, Status auf Choice umgebaut, Indizes gesetzt, Site-Zeitzone auf Berlin korrigiert.
- ✅ **Doku synchronisiert:** Liste-Schema, WF-04-Doku, WF-03-v5-Pre-Flight-Analyse, „Übung der Woche" → „Übung" Naming-Konsistenz.

---

## 6. Bekannte offene Themen (für eine spätere Session)

- WF-03 v6: Hashtags als 1. FB-Kommentar (statt in Caption)
- WF-03 v6: Error-Branches mit Teams-Alarm bei Anthropic/Canva/Meta-API-Fails
- WF-08: Canva-Token-Refresh-Workflow
- WF-05/06/07: Avatar-Reels (HeyGen oder Synthesia – siehe `06_Avatar-Reel-Konzepte/`)
- Excel-Snapshot `PF-Content-Kalender-2026.xlsx` regelmäßig regenerieren

---

## 7. Onboarding-Prompt für die nächste Session

> Working directory: `/Volumes/Physio_Fuchs/SocialMedia/`.
> Lies bitte zuerst `CLAUDE.md`, `SESSION-Zusammenfassung_2026-05-14.md`, und
> `SESSION-Naechste-Schritte_2026-05-14.md`. Dann arbeiten wir an Punkt 1
> (Canva-Secret rotieren) und Punkt 2 (OAuth-Flow einrichten) weiter.
