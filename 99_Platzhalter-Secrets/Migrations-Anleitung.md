# Migrations-Anleitung – Hartkodierte Werte → Platzhalter

Stand: 2026-05-14

Ziel: Die in den vorhandenen n8n-Workflow-JSONs hartkodierten Identifier
(Site-GUID, List-GUID, IG-Business-ID, Canva-Template-IDs etc.) durch
`$env.*`-Referenzen ersetzen, damit Werte nur noch an **einer** Stelle
gepflegt werden.

**Wichtig:** Diese Anleitung beschreibt den Migrationspfad – die
Workflow-JSONs werden hier **nicht automatisch** geändert. Jede Änderung
soll als neue Version (`_v17`, `_v5`, …) gespeichert werden, ohne die
bestehenden Stände zu überschreiben.

---

## 1. Quelle der Wahrheit (nach Migration)

```
~/secrets/physio-fuchs/.env       ← echte Werte (Permissions 600)
SocialMedia/99_Platzhalter-Secrets/.env.example  ← Strukturvorlage
```

In n8n werden die Werte als **Environment Variables** verfügbar gemacht
(Docker: `--env-file`, Self-Hosted: `n8n.env`, Cloud: in den Settings).

---

## 2. Heute hartkodierte Werte (gefunden 2026-05-14)

| Wo                          | Aktueller harter Wert                                 | Soll werden                                |
| --------------------------- | ----------------------------------------------------- | ------------------------------------------ |
| WF-01, WF-02, WF-03 SP-Site | `physiofuchs889.sharepoint.com,c74040a2-…,7a7842d6-…` | `={{ $env.SHAREPOINT_SITE_COMPOSITE }}`   |
| WF-01, WF-02, WF-03 SP-List | `d17a6a6f-e6ef-457d-a2a9-4c30ea56120f`                | `={{ $env.SHAREPOINT_LIST_ID }}`           |
| WF-02 (REST-URL)            | `…/sites/PhysioFuchsTW/_api/web/lists(guid'd17a6a6f-…')` | URL aus `SHAREPOINT_SITE_URL` + `LIST_ID` |
| WF-03 IG Endpoint           | `…/v25.0/17841461169626096/media`                     | `={{ $env.META_API_VERSION }}/{{ $env.INSTAGRAM_BUSINESS_ACCOUNT_ID }}/media` |
| WF-03 IG Publish            | `…/v25.0/17841461169626096/media_publish`             | analog                                     |
| WF-03 Meta-Version          | `v25.0` (mehrere Stellen)                             | `={{ $env.META_API_VERSION }}`            |
| WF-02 Anthropic-Header      | `2023-06-01`                                          | `={{ $env.ANTHROPIC_VERSION_HEADER }}`     |
| WF-02 Canva-Templates       | `DAHJW-GJz68`, `DAHJW_-mBBk`, `DAHJWxhg9M0`, …        | `={{ $env.CANVA_TPL_<TYP> }}`             |
| WF-03 Teams-Channel         | `19:meeting_MWViMzNlYmYtNTY1OS00NzM1…@thread.v2`      | `={{ $env.TEAMS_CHANNEL_ID }}`            |

Bereits sauber referenziert (→ schon ok):
- `={{ $env.SHAREPOINT_LIST_ID }}` (an mind. einer Stelle)
- `={{ $env.FB_PAGE_ID }}` (FB Photos-Endpoint)
- `={{ $env.ANTHROPIC_API_KEY }}`

---

## 3. Mapping Canva-Templates (aus WF-02 v16 Sticky)

| Post-Typ in `field_2` | Canva-Template-ID | Env-Variable           |
| --------------------- | ----------------- | ---------------------- |
| Standard              | `DAHJW-GJz68`     | `CANVA_TPL_STANDARD`   |
| Tipp                  | `DAHJW_-mBBk`     | `CANVA_TPL_TIPP`       |
| Zitat                 | `DAHJWxhg9M0`     | `CANVA_TPL_ZITAT`      |
| Story                 | `DAHJWzFnwHA`     | `CANVA_TPL_STORY`      |
| Team                  | `DAHJWy7evpI`     | `CANVA_TPL_TEAM`       |
| Übung                 | `DAHJW870Xvk`     | `CANVA_TPL_UEBUNG`     |
| Promo                 | `DAHJW9j8uts`     | `CANVA_TPL_PROMO`      |

Hinweis: In `04_Canva-Vorlagen/Vorlagen-Uebersicht.md` standen die
Codes noch sprechend (`PF_Feed_Standard`, `PF_Feed_Uebung`, …) als
Wunschnamen. Nach der Migration:
- entweder die obigen IDs in der Vorlagen-Übersicht ergänzen
- oder Canva-Templates umbenennen + neue IDs eintragen.
Empfehlung: Mapping wie oben **eins zu eins** behalten und in der
Übersicht beide Spalten führen (Wunschname + Realname + Env-Variable).

---

## 4. Status `Bereit` – verbindlich (geklärt 2026-05-14)

Der Status-Flow ist offiziell **fünfstufig**:

```
Entwurf → Bereit → Freigegeben → Geplant → Veröffentlicht
```

`Bereit` markiert „Caption + Grafik fertig, wartet auf Judiths Freigabe".

Konsequenzen für die Migration der JSONs:

- WF-03 Phase A muss nach erfolgreicher Grafik-Erzeugung **explizit**
  `field_6 = "Bereit"` setzen (sobald `field_7`, `field_9`, `field_10`
  alle befüllt sind).
- WF-03 Phase B (Freigabe-Card-Trigger) filtert auf `field_6 = "Bereit"`,
  nicht mehr kombiniert auf `Entwurf` + `field_9 ≠ leer`.
- Beim Klick „Änderung wünschen" wird `field_6` zurück auf `"Entwurf"`
  gesetzt, damit WF-02 wieder anziehen kann.
- WF-02 v16 nutzt `Bereit` bereits intern (Sticky-Note) – das passt;
  bei der nächsten Versionsnummer (v17) explizit dokumentieren.

Quellen-Doku zum Übergang:
`00_Konzept/Status-Flow.md`, `03_SharePoint/Liste-Schema.md`,
`03_SharePoint/Felder-Mapping.md`, `CLAUDE.md`.

---

## 5. Vorgehensweise pro Workflow

Pro Workflow (z. B. WF-02):

1. JSON kopieren: `cp PF_WF-02_Caption_Generator_v16.json PF_WF-02_Caption_Generator_v17.json`
2. Im neuen v17 alle Vorkommen aus der Tabelle Abschnitt 2 ersetzen.
3. Alte Sticky-Note aktualisieren: „v17 – Werte über $env, Migration 2026-05-…"
4. v17 in n8n importieren, **Dry-Run** mit Test-Item.
5. Wenn ok: aktive Version in n8n auf v17 umstellen.
6. v16 weiterhin im Root liegen lassen (Backup), nach 2 Wochen Stabilität
   nach `_Archiv/` verschieben.

Niemals die alte Versionsdatei direkt überschreiben.

---

## 6. n8n-Setup

**Self-hosted Docker:**
```bash
docker run -d \
  --name n8n \
  --env-file ~/secrets/physio-fuchs/.env \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**Self-hosted via systemd / pm2:**
- `n8n.env` mit `EnvironmentFile=` einbinden
- Datei-Permissions: `chmod 600`, Owner: n8n-User

**n8n Cloud:**
- Settings → Variables → manuell pflegen.
  Reihenfolge: oben aus `.env`-Datei eintippen.
  Nach jedem Wert: „Save" klicken.

In jedem Fall danach: in einem beliebigen Workflow-Node eine kurze
Expression `={{ $env.SHAREPOINT_LIST_ID }}` testen.

---

## 7. Token-Rotation

Wenn ein Token (z. B. `META_ACCESS_TOKEN`) abläuft:

1. Neuen Token in Meta Business Suite erzeugen (Long-lived)
2. In `~/secrets/physio-fuchs/.env` ersetzen
3. n8n neu starten oder Variable im UI updaten
4. **Niemals** Tokens in Workflow-JSONs oder Sticky-Notes notieren.

---

## 8. Was nicht migriert werden muss

- Webhook-IDs / Webhook-Pfade (`pf-wf01-content-einreichung`,
  `wf03-wait-export`, …) – die sind n8n-intern und kein Geheimnis.
- SharePoint-Feldnamen (`field_1` … `field_13`, `Title`).
- Statisch-strukturelle Konstanten (z. B. `application/json`-Header).

---

## 9. Verweise

- Echte `.env`: `~/secrets/physio-fuchs/.env`
- Beispiel im Repo: `99_Platzhalter-Secrets/.env.example`
- Platzhalter-Liste: `99_Platzhalter-Secrets/Platzhalter-Liste.md`
- SP-Schema: `03_SharePoint/Liste-Schema.md`
- Canva-Vorlagen: `04_Canva-Vorlagen/Vorlagen-Uebersicht.md`
