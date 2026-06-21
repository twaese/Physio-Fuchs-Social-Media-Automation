# WF-03 v7 – Sofort-Posten + Teams-Erfolgs-Notification

Bauplan für 2 Erweiterungen an WF-03 v6, die zusammen v7 ergeben.

**Status:** Spec, noch nicht in n8n umgesetzt
**Erstellt:** 2026-06-07
**Voraussetzungen:**
- SharePoint-Spalte `Sofort_Posten` (Ja/Nein, Default: Nein) — manuell anlegen
- Teams-Webhook-URL — manuell erstellen, als `TEAMS_WEBHOOK_URL` in `/docker/n8n/.env`
- HTML-Formular v2 mit Checkbox „Sofort posten" — ✓ schon umgesetzt
- WF-01 v4: muss `Sofort_Posten` aus Webhook-Payload in SP schreiben

---

## 1. FilterKZ-Code-Update (Sofort-Check)

**WF-03 v6 → FilterKZ-Node → kompletter Code (drop-in replace):**

```javascript
// WF-03 v7 FilterKZ: Karenz + Schedule + Sofort-Posten-Bypass
const items = $input.all();
const now = new Date();
const KARENZ_HOURS = 24;
const results = [];
const skipped = [];

for (const item of items) {
  const j = item.json;
  const f = j.fields || {};
  const status = f.field_6;
  const modified = j.lastModifiedDateTime || j.Modified;
  const datumRaw = f.Ver_x00f6_ffentlichungsdatum;
  const uhrzeit = (f.field_5 || '09:00').trim();
  const itemId = j.id || j.Ausweis || f.AUSWEIS;
  const title = f.Title || f.Titel || '';

  // Sofort-Posten Flag (SP-Spalte: Sofort_Posten, kann auch field_15 o.ä. heißen je nach SP-Schema)
  const sofort = f.Sofort_Posten === true || f.SofortPosten === true || f.Sofort === true;

  const reasons = [];

  // Status MUSS Bereit sein (immer, auch bei Sofort)
  if (status !== 'Bereit') reasons.push(`status=${status}`);

  // Karenz + Schedule nur prüfen wenn NICHT Sofort-Posten
  if (!sofort) {
    // Karenz-Check
    if (modified) {
      const modifiedDate = new Date(modified);
      const hoursSinceModified = (now - modifiedDate) / (1000 * 60 * 60);
      if (hoursSinceModified < KARENZ_HOURS) {
        reasons.push(`karenz_läuft (${hoursSinceModified.toFixed(1)}h von ${KARENZ_HOURS}h)`);
      }
    } else {
      reasons.push('modified_fehlt');
    }

    // Schedule-Check (timezone-aware: uhrzeit = Berlin local time)
    if (datumRaw) {
      const dateOnly = String(datumRaw).split('T')[0];
      const [yyyy, mo, dd] = dateOnly.split('-').map(Number);
      const [hh, mm] = uhrzeit.split(':').map(Number);
      const offsetHours = (mo >= 4 && mo <= 10) ? 2 : 1;  // Berlin DST grob
      const scheduledTime = new Date(Date.UTC(yyyy, mo - 1, dd, hh - offsetHours, mm, 0));
      if (isNaN(scheduledTime)) {
        reasons.push(`schedule_invalid (${dateOnly} ${uhrzeit})`);
      } else if (scheduledTime > now) {
        reasons.push(`scheduled_future (Berlin: ${dateOnly} ${uhrzeit})`);
      }
    } else {
      reasons.push('veröffentlichungsdatum_leer');
    }
  }

  // Bild-URLs müssen IMMER da sein (auch bei Sofort)
  const igUrl = f.field_8 || f.field_9 || '';
  const fbUrl = f.Bild_FB_Dateiname || '';
  if (!igUrl.startsWith('https://')) reasons.push(`IG_keine_url (field_8: "${f.field_8 || ''}" / field_9: "${f.field_9 || ''}")`);
  if (!fbUrl.startsWith('https://')) reasons.push(`Bild_FB_Dateiname_keine_url (wert: "${fbUrl}")`);

  if (reasons.length > 0) {
    skipped.push({ id: itemId, title, status, sofort, modified, datum: datumRaw, reasons });
    continue;
  }

  const hashtags = f.field_7 || '';
  const caption = (f.field_10 || '').trim();

  results.push({
    json: {
      item_id: itemId,
      title,
      sofort_posten: sofort,
      image_url_ig: igUrl,
      image_url_fb: fbUrl,
      caption,
      hashtags,
      caption_with_hashtags: caption + (hashtags ? '\n\n' + hashtags : ''),
      sp_fields: f,
    }
  });
}

return results.slice(0, 1);
```

**Was sich ggü. v6 ändert:**
- Sofort-Flag wird gelesen
- Bei Sofort=true werden Karenz + Schedule-Check übersprungen
- Bild-URLs + Status=Bereit bleiben Pflicht (HWG/Validierung darf nicht umgangen werden)
- Sofort-Flag wird ins Output-JSON durchgereicht (für Logging/Teams-Card)

---

## 2. Teams-Erfolgs-Notification (HTTP-Node am Ende)

**Position im Workflow:** Nach `SP: Status veröffentlicht` als neuen HTTP-Node anhängen, Name: **`Teams: Erfolgs-Card`**

### Node-Settings

| Feld | Wert |
|---|---|
| Method | POST |
| URL | `={{ $env.TEAMS_WEBHOOK_URL }}` |
| Authentication | None |
| Send Headers | AN |
| Header Content-Type | `application/json` |
| Send Body | AN |
| Body Content Type | JSON |
| JSON | (siehe unten) |
| Always Output Data | AN (damit Workflow nicht abbricht falls Teams-Webhook hängt) |

### Adaptive Card JSON (Body)

```javascript
={{ ({
  type: "message",
  attachments: [{
    contentType: "application/vnd.microsoft.card.adaptive",
    contentUrl: null,
    content: {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.4",
      msTeams: { width: "Full" },
      body: [
        {
          type: "Container",
          style: "good",
          items: [
            {
              type: "TextBlock",
              text: ($('FilterKZ').first().json.sofort_posten ? "🚀 SOFORT-Post live!" : "🎉 Neuer Post ist live!"),
              weight: "Bolder",
              size: "Large",
              color: "Light"
            }
          ]
        },
        {
          type: "TextBlock",
          text: $('FilterKZ').first().json.title,
          weight: "Bolder",
          size: "Medium",
          spacing: "Medium"
        },
        {
          type: "FactSet",
          facts: [
            { title: "Item-ID:", value: String($('FilterKZ').first().json.item_id) },
            { title: "Zeit:", value: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
            { title: "Instagram:", value: ($('IG_Publish').first().json.id || '(nicht gepostet)') },
            { title: "Facebook:", value: ($('FB_Photo').first().json.post_id || '(nicht gepostet)') },
            { title: "Modus:", value: ($('FilterKZ').first().json.sofort_posten ? "Sofort (Karenz übersprungen)" : "Regulär (24h-Karenz erfüllt)") }
          ]
        },
        {
          type: "TextBlock",
          text: "**Caption-Vorschau:**",
          spacing: "Medium",
          weight: "Bolder",
          size: "Small"
        },
        {
          type: "TextBlock",
          text: ($('FilterKZ').first().json.caption || '').substring(0, 200) + ($('FilterKZ').first().json.caption.length > 200 ? '…' : ''),
          wrap: true,
          size: "Small",
          color: "Default"
        },
        {
          type: "Image",
          url: $('FilterKZ').first().json.image_url_ig,
          size: "Medium",
          horizontalAlignment: "Center",
          spacing: "Medium"
        }
      ],
      actions: [
        {
          type: "Action.OpenUrl",
          title: "📷 Instagram",
          url: "https://www.instagram.com/physio_fuchs_lintorf/"
        },
        {
          type: "Action.OpenUrl",
          title: "📘 Facebook",
          url: "https://www.facebook.com/" + ($('FB_Photo').first().json.post_id || '').split('_')[0]
        },
        {
          type: "Action.OpenUrl",
          title: "📋 SharePoint-Eintrag",
          url: "https://physiofuchs889.sharepoint.com/sites/PhysioFuchsTW/Lists/PFContentKalender2026/AllItems.aspx"
        }
      ]
    }
  }]
}) }}
```

### Karten-Vorschau (so sieht es in Teams aus)

```
┌─────────────────────────────────────────────────┐
│ 🎉 Neuer Post ist live!                          │  ← grün bei regulär, orange bei Sofort
├─────────────────────────────────────────────────┤
│ Entspannt in Woche                              │
│                                                  │
│ Item-ID:    PF-2026-XXX                         │
│ Zeit:       07.06.2026, 16:35                   │
│ Instagram:  17897123456789012                   │
│ Facebook:   104383336093043_77933480526161...   │
│ Modus:      Regulär (24h-Karenz erfüllt)        │
│                                                  │
│ Caption-Vorschau:                                │
│ Montags neu durchstarten – aber bitte mit       │
│ Leichtigkeit. Ein bewusster Wochenstart…       │
│                                                  │
│ [Bild-Thumbnail aus GitHub-URL]                  │
│                                                  │
│ [📷 Instagram] [📘 Facebook] [📋 SharePoint]   │
└─────────────────────────────────────────────────┘
```

---

## 3. WF-01 v4 — Sofort_Posten-Field-Mapping

WF-01 v4 muss den `Sofort_Posten` aus dem Webhook-Body in die SP-Spalte schreiben. Position: im **`Code: Material-Dateinamen bauen`** oder dem Pre-Mapping-Code-Node.

**Code-Snippet zum Einfügen** (im SP-Eintragserstellen-Node bzw. zugehörigem Mapping-Code):

```javascript
// In dem Field-Mapping-Object zusätzlich:
Sofort_Posten: $input.first().json.body?.Sofort_Posten === true || $input.first().json.body?.Sofort_Posten === 'true'
```

Wichtig: SP-Spalte muss den exakten internen Namen haben (z.B. `Sofort_Posten`). Falls SP einen anderen internen Namen generiert (z.B. `field_15`), entsprechend mappen.

---

## 4. SharePoint-Spalten-Konfiguration

| Property | Wert |
|---|---|
| Spalten-Name | `Sofort_Posten` |
| Typ | Ja/Nein (Boolean) |
| Default | Nein |
| Position | Idealerweise nach `Uhrzeit`, vor `Status` |
| Beschreibung | „Wenn aktiv: WF-03 ignoriert Karenz + Datum/Uhrzeit, postet beim nächsten Cron sofort" |
| Pflichtfeld | Nein (False default reicht) |

---

## 5. Test-Plan

1. SP-Spalte anlegen, neue Test-Datei `PF-2026-TEST` erstellen mit `Sofort_Posten = Ja`
2. WF-02 v18.3 manuell triggern → Status wird `Bereit`
3. WF-03 v7 (mit neuem FilterKZ) manuell triggern → Item geht durch obwohl Datum/Karenz nicht passen
4. IG + FB visuell prüfen → Post live
5. Teams-Channel prüfen → Erfolgs-Card erscheint mit „🚀 SOFORT-Post live!"
6. Regulär-Test: zweites Item mit `Sofort_Posten = Nein` und gültigem Datum/Karenz → Card erscheint mit „🎉 Neuer Post ist live!"

---

## 6. Roll-Back falls Probleme

| Was kaputt | Fix |
|---|---|
| Sofort-Items werden nicht erkannt | SP-Spalten-Name prüfen, ggf. `field_X` statt `Sofort_Posten` lesen |
| Teams-Card kommt nicht | `TEAMS_WEBHOOK_URL` in `.env`, dann `docker compose up -d --force-recreate n8n` |
| Teams-Card-JSON-Fehler | n8n Execution-Log prüfen, Adaptive-Card-Validator: https://adaptivecards.io/designer/ |
| Workflow hängt bei Teams-Webhook-Timeout | „Always Output Data" + „Continue On Fail" in HTTP-Node aktivieren |

---

## Änderungshistorie

| Datum       | Was                                                | Wer    |
| ----------- | -------------------------------------------------- | ------ |
| 2026-06-07  | Initial Spec für Sofort-Posten + Teams-Notify (v7) | Claude |
