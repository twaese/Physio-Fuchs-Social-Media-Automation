# Workflow-Konzept – Physio Fuchs Social Media

End-to-End-Beschreibung des automatisierten Wochen-Workflows.
**Stand: 2026-05-17** (Vollautomatik, Pipeline live in Produktion)

---

## 1. Big Picture

```
┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐   ┌──────────────┐
│ Eingabe      │ → │ SharePoint   │ → │ Content-Erstellung   │ → │ Posting      │
│ (Judith)     │   │ Liste        │   │ + Bild-Render        │   │ IG / FB      │
│              │   │              │   │ (Claude + Gotenberg) │   │              │
│ HTML-Formular│   │ PF-Content-  │   │ + GitHub-Push        │   │ Meta Graph   │
│ Webhook      │   │ Kalender-    │   │ (public Bild-URLs)   │   │ API via n8n  │
│              │   │ 2026         │   │                      │   │              │
└──────────────┘   └──────────────┘   └──────────────────────┘   └──────────────┘
       │                  │                     │                       │
       └─ WF-01 ──────────┘                     │                       │
                                       WF-02 v18.2                      │
                                       (stündl. Cron)                   │
                                                └─ WF-03 v6 ────────────┘
                                                   (stündl. Cron,
                                                    24h-Karenz, Schedule-Check)

Status-Flow:  Entwurf  →  [HWG-Filter]  →  Bereit  →  [24h-Karenz + Datum]  →  Veröffentlicht
                              │
                              └── bei Heilversprechen ──► Geblockt (Teams-Alert)
```

**Vollautomatik:** Judith macht ausschließlich Einträge übers Formular. Alle weiteren Schritte laufen ohne manuelle Freigabe. Sicherheitsnetze: **HWG-Filter** in WF-02 + **24h-Karenz** in WF-03.

---

## 2. Beteiligte Komponenten

| Schicht          | Tool                                       | Aufgabe                                    |
| ---------------- | ------------------------------------------ | ------------------------------------------ |
| Eingabe          | HTML-Formular (`physio_fuchs_form_v2.html`) | Judith trägt Themen ein                   |
| Transport        | n8n Webhook                                | Empfängt Formular-POST                     |
| Datenbasis       | SharePoint-Liste `PF-Content-Kalender-2026`| Einzige Wahrheit für alle Posts           |
| Caption          | Anthropic Claude (claude-sonnet-4-6)       | Caption, Hashtags, post-typ-spezifisch     |
| HWG-Filter       | n8n Code-Node + Blacklist-Regex            | Blockt Heilversprechen → Status Geblockt   |
| Bild-Render      | Gotenberg-Sidecar (HTML → PNG)             | Layout v12 (Foto + Banner + Logo-Karte)    |
| Bild-Hosting     | **GitHub public Repo** (raw.githubusercontent) | Meta-zugängliche Bild-URLs            |
| Audit-Backup     | SharePoint Doc-Library                     | Parallel-Upload (nicht Meta-zugänglich)    |
| Avatar/Video     | (Roadmap Track 2) D-ID + Voice-Clone       | Judith-Avatar für „Übung der Woche"        |
| Veröffentlichung | Meta Graph API v25.0 via n8n               | Auto-Posting auf IG + FB                   |
| Monitoring       | Teams-Channel                              | HWG-Alerts, Fehler, Wochenreport (geplant) |

**Was rausgeflogen ist (vs. Konzept 2026-05-14):**
- ❌ Canva Connect API → ersetzt durch HTML-Templates + Gotenberg (mehr Kontrolle, kostenlos)
- ❌ Teams-Approval-Card → ersetzt durch HWG-Filter + 24h-Karenz (Vollautomatik)
- ❌ WF-04 Monats-Scheduler → derzeit inaktiv (Vollautomatik macht Karenz/Scheduling überflüssig)

---

## 3. Prozess Schritt für Schritt

### Schritt 1 – Themen-Eingabe (jederzeit)

**Akteur:** Judith
**Tool:** `physio_fuchs_form_v2.html` (in Teams eingebettet)

Felder: Thema, Post-Typ, Content-Brief, Datum + Uhrzeit, Hashtag-Thema, ggf. Bild-Idee.

Submit → POST an `{{N8N_WEBHOOK_URL}}/webhook/sharepoint-content`.

### Schritt 2 – WF-01: Formular → SharePoint

**Trigger:** Webhook
**Output:** Neues SP-Item, Status `Entwurf`

### Schritt 3 – WF-02 v18.2: Caption + Bild + GitHub-Push (stündlicher Cron)

**Trigger:** Cron, jede Stunde
**Filter:** `field_6 = Entwurf`, max. 1 Item pro Lauf (Multi-Item-Bremse, siehe v19-Roadmap)

Ablauf:
1. Claude erzeugt Caption + Hashtags (post-typ-spezifischer Prompt)
2. **HWG-Filter** blockt Heilversprechen → Status `Geblockt` + Teams-Alert
3. HTML-Template Layout v12 mit Daten befüllen
4. Gotenberg rendert: IG 1080×1350 + FB 1080×1080 PNG
5. GitHub-Push: `raw.githubusercontent.com/.../generated-posts/{id}_ig_{ts}.png`
6. SP-Upload (Audit-Backup)
7. SharePoint-Item updaten + Status auf `Bereit`

**Avatar-Skip:** Reel/Story/Übung-Items werden derzeit übersprungen (`continue` im Validate), warten auf Track 2 (D-ID-Pipeline).

### Schritt 4 – WF-03 v6: Posting (stündlicher Cron)

**Trigger:** Cron, jede Stunde
**Filter:** `field_6 = Bereit`, Karenz ≥ 24h, Schedule erreicht

Ablauf:
1. SP-Items mit Status `Bereit` lesen
2. **FilterKZ**: Karenz + geplantes Datum/Uhrzeit prüfen → max. 1 Item durch
3. Parallel:
   - **IG-Branch:** Container erstellen → 15s warten → Veröffentlichen
   - **FB-Branch:** Foto posten → Hashtags als 1. Kommentar
4. SP-Update: Status `Veröffentlicht`, IG-Post-ID in `field_12`, Log in `field_13`

---

## 4. Bild-Hosting-Strategie: warum GitHub statt SharePoint?

**Problem (2026-05-16):** SP-Library-Bilder verlangen auch nach Tenant- und Site-Sharing auf „Jeder mit Link" einen Login. Meta-Bots können die Bilder nicht laden → IG/FB-Posts schlagen mit „Only photo or video can be accepted as media" fehl.

**Lösung (2026-05-17):** Pro Bild ein PUT auf das **public** GitHub-Repo `twaese/Physio-Fuchs-Social-Media-Automation`. Die `raw.githubusercontent.com`-URLs sind garantiert öffentlich abrufbar.

**Konsequenz:**
- Das Repo enthält alle generierten Bilder (im Ordner `04_Canva-Vorlagen/generated-posts/`)
- Bilder sind öffentlich einsehbar, müssen also DSGVO-sauber sein (keine Patient:innen-Bilder etc. — was eh nie passieren würde)
- GitHub PAT (fine-grained, Contents:Read+Write, nur dieses Repo) als `GITHUB_TOKEN` in der n8n-`.env`

---

## 5. Status-Flow im Detail

```
Entwurf
   │
   │ WF-02: Caption + Bild + HWG-Check
   │
   ├──[HWG-Treffer]──► Geblockt (Teams-Alert, Judith prüft)
   │
   ▼
Bereit
   │
   │ WF-03: 24h-Karenz + Datum-Check
   │ (Judith kann während Karenz manuell → Entwurf zurückziehen)
   │
   ▼
Veröffentlicht
```

**Wartet-auf-Avatar** (Status, vorgesehen für Track 2): Reel/Story/Übung-Items, derzeit übersprungen.

Details: `Status-Flow.md`

---

## 6. Fehler- und Sonderfälle

| Fall                                | Verhalten                                    |
| ----------------------------------- | -------------------------------------------- |
| Pflichtfeld fehlt im Formular       | WF-01 antwortet 400, Teams-Hinweis           |
| Claude-Antwort enthält Heilversprechen | HWG-Regex blockt → Status `Geblockt`, Alert |
| Gotenberg-Sidecar down              | Retry 3×, dann Item bleibt `Entwurf`         |
| GitHub-Push 401                     | Token in `.env` prüfen → `docker compose up -d --force-recreate n8n` |
| Meta-Token abgelaufen               | IG/FB-Posts schlagen fehl, SP-Update wird übersprungen → Item bleibt `Bereit` |
| field_9 vs field_8 (SP-Spalten-History) | FilterKZ in WF-03 liest beide mit Fallback |

---

## 7. Erweiterungen (Roadmap)

| Track | Feature                                                       | Status        |
| ----- | ------------------------------------------------------------- | ------------- |
| 1     | Vollautomatik IG+FB (Layout v12, GitHub-Push, Karenz)         | ✅ **live**   |
| 1b    | WF-02 v19: paired-items → Multi-Item-Modus                    | offen         |
| 1c    | LinkedIn-Template auf Foto-Layout (Square 1200×1200)          | offen         |
| 2     | D-ID Avatar + Voice-Clone → Reel/Übung/Story-Pipeline         | offen         |
| 3     | TikTok + YouTube Shorts                                       | später        |
| 4     | Wochen-Performance-Report aus IG-Insights                     | später        |

---

## 8. Verweise

- Status-Flow: `Status-Flow.md`
- Tonalität: `Tonalitaet-Markenrichtlinien.md`
- Workflow-Details: `../02_n8n-Workflows/README.md`
- WF-02 v18.2: `../02_n8n-Workflows/WF-02_Caption-Generator.md`
- WF-03 v6: `../02_n8n-Workflows/WF-03_Social-Media-Post.md`
- Layout v12: `../04_Canva-Vorlagen/html-templates/README.md`
- SharePoint-Schema: `../03_SharePoint/Liste-Schema.md`
- Avatar-Konzept (Roadmap): `../06_Avatar-Reel-Konzepte/Avatar-Konzept-Judith.md`

---

## Änderungshistorie

| Datum       | Was                                                                          | Wer    |
| ----------- | ---------------------------------------------------------------------------- | ------ |
| 2026-05-14  | Initialversion                                                               | Claude / Thomas |
| 2026-05-16  | Vollautomatik: Freigabe raus, HWG+Karenz als Sicherheitsnetze. Canva → Gotenberg+HTML. | Claude / Thomas |
| 2026-05-17  | Pipeline E2E live: WF-02 v18.2 (GitHub-Push) + WF-03 v6 (Karenz+Posting), erster echter Post auf IG+FB | Claude / Thomas |
