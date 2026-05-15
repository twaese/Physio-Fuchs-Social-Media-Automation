# Nächste Session – WF-03 v6 mit direkter Canva REST API

**Stand:** 2026-05-15, mittags
**Letzter Punkt:** OAuth-Setup steht, Anthropic+MCP-Connector scheitert an Token-Typ-Mismatch.

---

## 1. Was heute erreicht wurde

| Komponente | Stand |
|---|---|
| n8n-Server: Env-Vars `CANVA_CLIENT_ID/SECRET`, `ANTHROPIC_API_KEY`, `NODE_FUNCTION_ALLOW_BUILTIN=crypto` | ✅ in `/docker/n8n/.env` + `env_file:`-Direktive in `docker-compose.yml` |
| `~/secrets/physio-fuchs/.env` lokal mit gleichen Werten | ✅ |
| `PF_WF-08_Canva_OAuth_v2.json` (Webhook-Init + Callback + Refresh + Lookup) | ✅ läuft, in n8n aktiv |
| Canva Developer Portal: Redirect-URL + Scopes konfiguriert | ✅ |
| OAuth-Flow durchgelaufen, Token in `staticData` (4h gültig, Refresh alle 3h) | ✅ |
| Token-Lookup-Webhook `/webhook/canva-token-current` liefert valid Token | ✅ |
| `PF_WF-03_Social_Media_Post_v5.json` mit Token-Übergabe an Anthropic+MCP | ⚠️ läuft bis Anthropic-Call, dann 401 vom Canva-MCP |

---

## 2. Warum WF-03 v5 mit Anthropic+MCP nicht klappt

**Diagnose:**

Anthropic's MCP-Connector reicht das `authorization_token`-Feld an den Canva-MCP-Server (`mcp.canva.com/mcp`) durch. Canva-MCP antwortet aber mit `401 Authentication`.

Wahrscheinlichste Ursachen:

1. **Token-Typ-Mismatch:** Unser OAuth-Token gilt für Canva Connect REST API (`api.canva.com`). Der MCP-Server unter `mcp.canva.com` nutzt evtl. einen separaten Auth-Mechanismus (Server-Side OAuth Discovery, Workspace-spezifische Connection, anderes Header-Format).
2. **Anthropic MCP-Connector Beta-Header outdated** (`mcp-client-2025-04-04`).
3. **Scopes** unzureichend für MCP-spezifische Operationen.

Beweise gegen einfache Fixes:
- Mit und ohne `Bearer ` Prefix → beides 401
- Token-Lookup-Endpoint zeigt `is_expired: false`
- Anthropic-API-Key ist sauber (sonst käme Anthropic-Auth-Fehler)

---

## 3. Empfehlung: WF-03 v6 mit direkter Canva REST API

Anthropic+MCP komplett übergehen. Die LLM-Vermittlung ist überdimensioniert für „Template öffnen → Text ersetzen → exportieren". Caption ist schon da (von WF-02 v17). Direkt-API ist transparenter, debugbarer, billiger.

**Architektur-Skizze:**

```
SharePoint Read + Filter (übernehmen aus v5)
   ↓
Canva-Token holen (übernehmen aus v5)
   ↓
[NEU] HTTP POST  /rest/v1/designs/{template-id}/draft        – Editing-Session öffnen
   ↓
[NEU] HTTP PATCH /rest/v1/designs/{id}/text-elements/...     – [THEMA], [DATUM] ersetzen
   ↓
[NEU] HTTP POST  /rest/v1/exports                            – JPG-Export starten
   ↓
[NEU] HTTP GET   /rest/v1/exports/{job-id} (Polling)         – Warten bis status=success
   ↓
[NEU] Code: Bild-URL extrahieren
   ↓
Instagram/Facebook-Posting (übernehmen aus v5)
```

**Vorteile:**

- Kein Anthropic-Cost für Bilderzeugung
- Jeder API-Call einzeln debugbar
- Kein Beta-Endpoint
- Token-Setup von heute bleibt nutzbar

**Aufwand:** ~1–2 h Bauzeit beim nächsten Mal.

---

## 4. Konkrete Schritte für die nächste Session

### 4.1 Vorab-Checks (5 Min)

- [ ] Token-Lookup `/webhook/canva-token-current` aufrufen → muss `ok: true` und `is_expired: false` liefern.
  Falls expired: WF-08 „Trigger: Refresh alle 3h"-Node manuell triggern.
- [ ] PF-2026-100 in SharePoint: Status zurück auf `Freigegeben`, Datum auf heute.

### 4.2 Canva REST API Endpoints recherchieren (15 Min)

Doku: https://www.canva.dev/docs/connect/api-reference/

Konkret klären:
- Wie öffne ich eine Editing-Session für ein bestehendes Design?
- Wie ersetze ich Text-Elemente per ID? (Template muss vorher die `[THEMA]`-Element-IDs liefern)
- Wie starte ich einen Export-Job mit `quality=jpeg`?
- Wie polle ich den Job-Status?

### 4.3 WF-03 v6 als JSON aufbauen (45 Min)

Basis: WF-03 v5 kopieren als v6, dann:
- Anthropic-Call-Node entfernen
- 4 neue HTTP-Nodes einsetzen (siehe Skizze oben)
- Bild-URL-Extrahieren-Code anpassen für REST-Response-Format

### 4.4 Trockentest (15 Min)

- Posting-Nodes (IG/FB) deaktiviert lassen
- WF-03 v6 manuell triggern
- Erwartung: in der Pipeline kommt am Ende eine Bild-URL aus Canva
- URL im Browser öffnen → Bild visuell prüfen

### 4.5 Falls grün: Live-Test (15 Min)

- Posting-Nodes für Instagram aktivieren (Facebook erst danach)
- Erst auf einem **Test-Account**, nicht der Live-Page
- Datum auf 2030 setzen → `scheduled_publish_time` weit in der Zukunft → Post wird erst geplant, nicht sofort live
- Im Test-Account-IG den geplanten Post prüfen

---

## 5. Known Issues / kleinere Punkte

- **Alter Anthropic-Key (`...MgAA`)** existiert noch in der Anthropic-Console. Sobald neuer Key (`...3qPgAA`) in allen WFs verwendet wird, alten revoken. Aktuell unklar ob noch andere WFs den alten Key hardcoded haben — vor Revoke checken.
- **Refresh-Workflow `Trigger: Refresh alle 3h`** läuft im Hintergrund. Falls Token mal expired wird trotzdem: Refresh manuell triggern oder Cron-Frequenz auf 2h erhöhen.
- **n8n staticData ist pro Workflow-Instanz** — wenn WF-08 mal komplett gelöscht und neu erstellt wird, ist Token weg. Dann OAuth-Init nochmal durchspielen.
- **PF-2026-100 "entschärft"** (vermutlich Status=Entwurf oder Datum=2099) — vor nächstem Test wieder scharf machen.

---

## 6. Onboarding-Prompt für die nächste Session

> Working directory: `/Volumes/Physio_Fuchs/SocialMedia/`.
> Lies bitte zuerst `CLAUDE.md`, dann `SESSION-Naechste-Schritte_2026-05-15.md`.
> Wir bauen heute WF-03 v6 mit direkter Canva REST API (statt Anthropic+MCP),
> weil der MCP-Connector trotz korrektem OAuth-Token 401 vom Canva-MCP bekommt.
> Vorab: Token-Lookup `/webhook/canva-token-current` prüfen, PF-2026-100 wieder
> scharf machen.

---

## 7. Änderungshistorie

| Datum       | Was                                                  | Wer    |
| ----------- | ---------------------------------------------------- | ------ |
| 2026-05-15  | OAuth-Setup komplett, MCP-Connector-Bug dokumentiert | Claude |
