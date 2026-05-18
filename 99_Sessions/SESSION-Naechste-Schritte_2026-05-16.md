# Nächste Session – Vollautomatik mit Gotenberg + HWG-Filter + 24h-Karenz

**Stand:** 2026-05-16, abends
**Entscheidung heute:** Canva-API-Pipeline aufgegeben (Autofill = Enterprise-only,
in-place-Editing nicht möglich). Neuer Plan: HTML-Templates + Gotenberg-Sidecar,
**komplette Vollautomatik** ohne Judith-Freigabe.

---

## 1. Heute entschieden / dokumentiert

| Änderung | Datei |
|---|---|
| Status-Flow auf Vollautomatik umgestellt | `00_Konzept/Status-Flow.md` v2 |
| CLAUDE.md §3 + §7 entsprechend angepasst | `CLAUDE.md` |
| Neue Notbremsen: HWG-Filter + 24h-Karenz | dokumentiert in beiden Dateien |
| HWG-Blacklist mit 16 Patterns | `01_Prompts/HWG-Blacklist.md` (neu) |
| Status `Freigegeben` entfernt | – |
| Status `Geblockt` neu (HWG-Match) | – |

---

## 2. Was beim nächsten Mal gebaut werden muss

### 2.1 Gotenberg-Sidecar deployen (15 Min)

Auf Hostinger-VPS in `/docker/n8n/docker-compose.yml`:

```yaml
gotenberg:
  image: gotenberg/gotenberg:8
  container_name: gotenberg
  restart: unless-stopped
  ports:
    - "3001:3000"   # 3001 außen, 3000 intern (n8n erreicht es als http://gotenberg:3000)
  networks:
    - n8n_default
```

(genaue Netzwerk-Namen je nach existierender Compose-Datei anpassen)

`docker compose up -d gotenberg` → Test: `curl http://localhost:3001/health` → muss `{"status":"up"}` liefern.

### 2.2 HTML-Template `PF_Feed_Standard.html` bauen (1–2 h)

Pfad: `04_Canva-Vorlagen/html-templates/PF_Feed_Standard.html`
(Ordner `html-templates/` neu anlegen, Canva-Vorlagen bleiben als Style-Referenz)

Anforderungen:
- Format **1080 × 1350 px** (Instagram Portrait)
- Markenfarben Physio Fuchs (siehe `00_Konzept/Tonalitaet-Markenrichtlinien.md`)
- Schrift: System-Sicher (z. B. Inter, Open Sans) oder via Google-Fonts-CDN eingebunden
- Logo oben rechts (Asset-Pfad relativ einbinden, an Gotenberg per Multipart mitgeben)
- Platzhalter:
  - `{{TITEL}}` – Hook, max. 60 Zeichen, große Schrift
  - `{{TEXT}}` – Body, 3–5 Sätze, mittlere Schrift
  - `{{CTA}}` – Call to Action, unten, klein
  - `{{DATUM}}` – Datum als kleine Zeile

### 2.3 WF-02 v18 bauen (1,5 h, **Avatar-ready**)

Basis: WF-02 v17 kopieren als v18. Änderungen:
- **Auto-Release wird Default** für alle Typen (kein Teams-Wait mehr)
- **Switch nach Post-Typ** ganz vorne:
  - **Feed-Typen** (Standard, Tipp, FAQ, BTS, Praxis-News, Mitarbeiter:in, Aktion):
    → Caption-LLM → HWG-Filter → Gotenberg-Bild → Status `Bereit`
  - **Avatar-Typen** (Reel, Übung, Story):
    → Switch auf Sticky-Note-Flag `AVATAR_ENABLED`:
      - `false` (jetzt): Caption + Hashtags trotzdem generieren (kostet nichts,
        spart später Zeit), Status `Wartet-auf-Avatar`, Log in `field_13`
      - `true` (später): Reel-Skript → D-ID/HeyGen API → MP4 in `field_9`, Status `Bereit`
- **Sticky-Note „AVATAR-FEATURE-FLAG"** mit Konstanten:
  ```javascript
  const AVATAR_ENABLED = false;
  const AVATAR_PROVIDER = "d-id";
  const AVATAR_API_KEY_ENV = "DID_API_KEY";
  const AVATAR_ID = "judith_v1";
  ```
- **HWG-Filter-Code-Node** nach Caption-Generierung:
  - Lädt Patterns aus `01_Prompts/HWG-Blacklist.md`
  - Match → setze Status `Geblockt`, Teams-Card, beende Branch
- **Gotenberg-HTTP-Node** (nur Feed-Branch):
  - Lädt `PF_Feed_Standard.html` als Multipart, füllt Platzhalter via Code-Node
  - POST → `http://gotenberg:3000/forms/chromium/convert/html`
- **SharePoint-Update:** `field_9` mit Bild/Video-URL, Status, Zeitstempel in `field_13`

**Wichtig:** Avatar-Branch wird **strukturell vollständig** angelegt (alle Nodes
existieren), aber die D-ID/HeyGen-API-Node bleibt **inaktiv** durch den Flag-Switch.
Aktivierung später = ein Sticky-Note-Wert flippen. Siehe
`06_Avatar-Reel-Konzepte/Avatar-Integration-Plan.md`.

### 2.4 WF-03 v6 bauen (1 h)

Basis: WF-03 v5 stark vereinfachen. Änderungen:
- **Anthropic-MCP-Node entfernen** (komplette Canva-Logik raus)
- **Phase A (Teams-Wait) entfernen**
- **Karenz-Check-Node** am Anfang:
  - Lade `field_13`-Log → finde Zeitstempel von Status-Wechsel auf `Bereit`
  - Wenn (jetzt - Zeitstempel) < 24 h → skip
  - Sonst → weiter mit Posting
- **Meta-Graph-Posting** wie bisher (übernehmen aus v5)
- **Status-Updates:** nach Erfolg → `Geplant` → `Veröffentlicht`

### 2.5 WF-04 anpassen (15 Min)

WF-04 Monats-Scheduler bleibt, aber:
- `[AUTO_RELEASE]`-Marker-Logik kann raus (Default jetzt sowieso auto)
- Setzt weiter `field_4` (Datum), `field_5` (Uhrzeit), `field_13` (Log)

### 2.6 Test-Plan

1. **Gotenberg-Health-Check** – `curl /health` grün
2. **HTML-Template visuell** – via Browser direkt öffnen, Layout passt
3. **WF-02 v18 Trockenlauf** – Test-Eintrag mit harmloser Caption → Status `Bereit`, Bild in `field_9` korrekt
4. **WF-02 v18 HWG-Test** – Test-Eintrag mit Caption „diese Übung heilt Ihren Rücken" → Status `Geblockt`, Teams-Card erscheint
5. **WF-03 v6 Karenz-Test** – Bereit-Item < 24 h alt → skip; Bereit-Item > 24 h alt → posten
6. **Live-Test auf Test-Account** mit Datum 2030

---

## 3. Was ins Archiv kann

Sobald WF-02 v18 + WF-03 v6 laufen:
- `PF_WF-03_Social_Media_Post_v5.json` → `_Archiv-Workflows/`
- `PF_WF-02_Caption_Generator_v17.json` → `_Archiv-Workflows/`
- `PF_WF-08_Canva_OAuth_v2.json` → `_Archiv-Workflows/` (Canva-Token nicht mehr nötig)
- Env-Vars `CANVA_CLIENT_ID/SECRET`, `ANTHROPIC_API_KEY` in `/docker/n8n/.env` können bleiben (eventuell wird Anthropic noch für Caption-Generierung genutzt — Check beim WF-02-Bau)

---

## 4. Parallel offen: Avatar-Track (NICHT VERGESSEN)

Der Avatar-Track läuft **parallel** zur Pipeline-Vollautomatik und ist
**Pflicht**, sobald Reels / „Übung der Woche" automatisiert werden sollen.
Ohne Avatar bleibt die Vollautomatik auf **Feed-Posts beschränkt** —
Reels & Übungen bleiben dann faktisch manuell.

**Aktueller Stand:** D-ID Account aktiv, im Studio.
**Letzter Schritt:** Test-Video mit `judith_portrait_v3.jpg` und Vicki-Stimme
rendern (User-Pause vor Sport).

**Volle Details:** `SESSION-Naechste-Schritte_2026-05-15_Avatar.md`

**Konkrete nächste Schritte Avatar-Track:**
1. D-ID Talking-Photo-Test rendern (10 Min, siehe Avatar-Session-Doc)
2. Lip-Sync + Stimme bewerten
3. Falls gut → `06_Avatar-Reel-Konzepte/D-ID-Setup.md` anlegen
4. Voice-Clone (ElevenLabs) als Stretch-Goal — vorher Audio-Files
   in `voiceclone/` anhören (Ist es wirklich Judith?)
5. Avatar in WF-02 v18 integrieren (Reel-Branch: Skript → D-ID API → MP4)

**Empfehlung Reihenfolge nächste Sessions:**
- Session A (~3 h): Pipeline-Track komplett (Gotenberg + WF-02 v18 + WF-03 v6)
- Session B (~1 h): D-ID-Test + Bewertung
- Session C (~2 h): Avatar in WF-02 v18 integrieren — falls D-ID gut

Tracks dürfen sich nicht gegenseitig blockieren. Pipeline-Track liefert
schon ohne Avatar nutzbare Feed-Posts.

---

## 5. Onboarding-Prompt für nächste Session

> Working directory: `/Volumes/Physio_Fuchs/SocialMedia/`.
> Lies zuerst `CLAUDE.md`, dann `SESSION-Naechste-Schritte_2026-05-16.md`.
> Wir bauen heute: Gotenberg-Sidecar, HTML-Template `PF_Feed_Standard.html`,
> WF-02 v18 (mit HWG-Filter), WF-03 v6 (mit 24h-Karenz). Vorab-Check:
> `curl https://n8n.srv1099163.hstgr.cloud/webhook/canva-token-current`
> kann ignoriert werden (Canva-Pipeline ist deprecated).

---

## 6. Änderungshistorie

| Datum       | Was                                                         | Wer    |
| ----------- | ----------------------------------------------------------- | ------ |
| 2026-05-16  | Plan-Switch: Canva-API → Gotenberg+HTML, Vollautomatik      | Claude |
