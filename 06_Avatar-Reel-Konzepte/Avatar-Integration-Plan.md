# Avatar-Integration-Plan

Dieses Dokument beschreibt, **wie der Avatar-Branch im WF-02 v18 später
aktiviert wird**, sobald D-ID oder HeyGen produktionsreif sind.

**Grundprinzip:** WF-02 v18 wird **Avatar-ready** gebaut — Branch existiert
strukturell, ist aber per Feature-Flag deaktiviert. Aktivierung = ein
Sticky-Note-Wert ändern + WF speichern. Kein neuer WF-Bau nötig.

---

## 1. Wo der Schalter sitzt

In WF-02 v18 gibt es eine **Sticky-Note** mit:

```javascript
// AVATAR-FEATURE-FLAG
// false = Reel/Übung/Story-Items gehen in Status "Wartet-auf-Avatar"
// true  = Reel/Übung/Story-Items werden mit D-ID/HeyGen verarbeitet
const AVATAR_ENABLED = false;
const AVATAR_PROVIDER = "d-id";  // "d-id" | "heygen"
const AVATAR_API_KEY_ENV = "DID_API_KEY";  // bzw. "HEYGEN_API_KEY"
const AVATAR_ID = "judith_v1";  // wird gesetzt nach Avatar-Training
```

Ein Code-Node ganz vorne in der Pipeline liest diese Konstanten und
routet entsprechend.

---

## 2. WF-02 v18 Branch-Struktur (Avatar-ready)

```
Trigger: Cron (stündlich)
   ↓
SharePoint Read: alle Items mit Status = Entwurf
   ↓
Switch nach field_2 (Post-Typ)
   ├── Feed-Typen: Standard, Tipp, FAQ, BTS, Praxis-News, Mitarbeiter:in, Aktion
   │      ↓
   │      Caption-LLM → HWG-Filter → Gotenberg-Bild → Status: Bereit
   │
   └── Avatar-Typen: Reel, Übung, Story
          ↓
          Switch: AVATAR_ENABLED?
             ├── false (aktuell)
             │      ↓
             │      SharePoint-Update: Status = "Wartet-auf-Avatar"
             │      Log in field_13: "WF-02: Avatar-Pipeline deaktiviert, Item parkt"
             │      ENDE
             │
             └── true (später)
                    ↓
                    Reel-Skript-LLM (anderer Prompt als Caption)
                    ↓
                    HWG-Filter auf Skript
                    ↓
                    POST → D-ID/HeyGen API: Talking Photo + Voice
                    ↓
                    Polling: Job fertig?
                    ↓
                    MP4-URL in field_9
                    ↓
                    Status: Bereit
```

---

## 3. Schritte zur Aktivierung (Future-Session-Checklist)

Wenn Avatar-Test (D-ID oder HeyGen) erfolgreich war:

### 3.1 Voraussetzungen

- [ ] Avatar-Provider entschieden (D-ID = günstig, HeyGen = realistischer)
- [ ] API-Key in `~/secrets/physio-fuchs/.env` UND `/docker/n8n/.env`:
      ```
      DID_API_KEY=<key>     # oder HEYGEN_API_KEY
      ```
- [ ] Docker-compose neu starten damit n8n Env-Var sieht
- [ ] Avatar-ID erfasst (D-ID Foto-Asset-ID oder HeyGen Avatar-ID)
- [ ] Optional: ElevenLabs Voice-Clone fertig (`ELEVENLABS_VOICE_ID_JUDITH`)

### 3.2 WF-02 v18 öffnen

1. n8n-UI öffnen, WF-02 v18 öffnen
2. Sticky-Note „AVATAR-FEATURE-FLAG" finden
3. `AVATAR_ENABLED = false` → `AVATAR_ENABLED = true`
4. `AVATAR_ID` mit echter Avatar-ID füllen
5. Workflow speichern + aktivieren

### 3.3 Test mit einem geparkten Item

1. SharePoint öffnen → Item mit Status `Wartet-auf-Avatar` finden
2. Status manuell zurück auf `Entwurf` setzen (damit WF-02 ihn wieder aufgreift)
3. WF-02 manuell triggern oder warten auf nächsten Cron
4. Erwartung:
   - Reel-Skript wird generiert
   - D-ID/HeyGen-Job startet
   - Nach 1–3 Min: MP4-URL in `field_9`, Status `Bereit`
5. WF-03 sieht das Item, wartet 24 h Karenz, postet

### 3.4 Backlog abarbeiten

Sobald der Test passt: alle `Wartet-auf-Avatar`-Items in SharePoint
auf `Entwurf` setzen (Bulk-Aktion in SP-Ansicht). WF-02 arbeitet sie
beim nächsten Cron-Lauf ab.

---

## 4. Was während der Wartezeit (Avatar OFF) passiert

- Judith kann **jederzeit** über das Formular Reel/Übung/Story-Ideen einreichen
- Items landen in SharePoint mit Status `Entwurf`
- WF-02 picks sie auf → erkennt: Avatar-Typ + Flag = OFF → setzt `Wartet-auf-Avatar`
- **Caption + Hashtags werden trotzdem generiert** (kann WF-02 schon, kostet nichts)
  und in `field_10` / `field_7` gespeichert — spart später Zeit
- Items bleiben sichtbar in SharePoint-Ansicht „Wartet auf Avatar"
- Kein Verlust an Content-Ideen während der Bauphase

---

## 5. Roll-Back-Plan

Falls Avatar nach Aktivierung Probleme macht (schlechte Qualität,
API-Down, zu teuer):

1. Sticky-Note: `AVATAR_ENABLED = true` → `false`
2. WF speichern
3. Laufende Avatar-Items mit Status `Bereit` (aber problematischem MP4)
   manuell auf `Entwurf` zurücksetzen
4. Neue Items werden wieder geparkt
5. Untersuchen, fixen, später erneut aktivieren

Kein Daten-Verlust, keine Pipeline-Schäden.

---

## 6. Konsequenzen für andere Workflows

- **WF-01** (Formular-Webhook): unverändert
- **WF-03** (Posting): unverändert — wartet auf `Bereit`, egal ob Bild oder Video
- **WF-04** (Monats-Scheduler): unverändert
- **WF-08** (Canva-OAuth): bleibt deprecated, im Archiv

---

## 7. Offene Fragen vor Aktivierung

- [ ] Avatar-Provider final entschieden? (D-ID Test steht aus, siehe Avatar-Session-Doc)
- [ ] Voice: Standard-TTS (Vicki) oder ElevenLabs-Clone von Judith?
- [ ] Reel-Skript-Prompt: schon vorhanden in `01_Prompts/Reel-Skript.md`?
- [ ] Welches Reel-Format: 9:16 (Instagram-Standard)?
- [ ] Dauer-Limit: max. 60 Sek? (D-ID/HeyGen-Quota-Verbrauch beachten)

---

## Änderungshistorie

| Datum       | Änderung                                   | Wer    |
| ----------- | ------------------------------------------ | ------ |
| 2026-05-16  | Initial — Avatar-Integration-Plan          | Claude |
