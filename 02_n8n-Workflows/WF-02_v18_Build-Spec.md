# WF-02 v18 – Build Spec

Vollautomatischer Caption- und Bild-Generator. Ersetzt v17 vollständig.

**Architektur-Prinzip:** Cron stündlich → SharePoint-Entwürfe lesen →
Caption via LLM → HWG-Filter → HTML-Template + Gotenberg-Render → Status
`Bereit`/`Geblockt`/`Wartet-auf-Avatar`. Kein Teams-Wait. Karenz und
Posting macht WF-03.

**Scope MVP (dieser Bau):**
- Instagram-Image-Rendering (1080×1350)
- Caption + Hashtags via Claude
- HWG-Filter inline (Blacklist hardcoded in Sticky Note, später aus Repo)
- Avatar-Branch: nur Parking, kein D-ID-Call (Flag `AVATAR_ENABLED=false`)

**Out-of-Scope (v19):**
- Facebook + LinkedIn Render
- Hashtag-Comment für FB
- D-ID-Integration im Avatar-Branch
- Recruiting-Caption-Variante

---

## 1. Node-Liste (in Reihenfolge)

| # | Name | Typ | Zweck |
|---|------|-----|-------|
| 1 | Sticky: Konstanten | stickyNote | `AVATAR_ENABLED`, Template-URLs, etc. |
| 2 | Sticky: HWG-Blacklist | stickyNote | Regex-Liste |
| 3 | Cron-Trigger | scheduleTrigger | stündlich, alle Wochentage |
| 4 | SharePoint: Entwürfe holen | microsoftSharePoint | Get many, Filter `Status=Entwurf` |
| 5 | Code: Validate + Route | code | Filter ohne Caption + Switch nach Post-Typ |
| 6 | Switch: Feed oder Avatar | switch | Routing |
| **Feed-Branch:** | | | |
| 7 | Build Claude Payload | code | Prompt-Building für Caption |
| 8 | HTTP: Claude Caption | httpRequest | Anthropic-API |
| 9 | Parse Claude Response | code | JSON extrahieren |
| 10 | Code: HWG-Filter | code | Regex-Blacklist gegen Caption |
| 11 | If: HWG-Match? | if | Verzweigung Bereit/Geblockt |
| **HWG-OK-Pfad:** | | | |
| 12 | Code: HTML-Template bauen | code | Fetch IG-Template + Substitute |
| 13 | HTTP: Gotenberg Render IG | httpRequest | Multipart-POST |
| 14 | SharePoint: Update als Bereit | httpRequest | field_9/10/7/6 + field_13 Log |
| **HWG-Match-Pfad:** | | | |
| 15 | SharePoint: Update als Geblockt | httpRequest | field_6 + field_13 mit Match-Detail |
| **Avatar-Branch:** | | | |
| 16 | Code: AVATAR_ENABLED Check | code | Read Sticky-Constant |
| 17 | If: Avatar aktiv? | if | true/false |
| 18 | SharePoint: Update als Wartet-auf-Avatar | httpRequest | field_6 + Log |
| 19 | (später) Avatar-Skript + D-ID-Calls | | placeholder |

---

## 2. Sticky-Notes (Konstanten)

### Sticky 1: Feature-Flags
```javascript
/* WF-02 v18 KONSTANTEN
 * Diese Werte werden von Code-Nodes via $node["Sticky: Konstanten"]
 * NICHT direkt gelesen — sie sind nur Doku. Werte müssen in den
 * Code-Nodes selbst dupliziert werden (n8n-Limit für Sticky-Werte).
 */
const AVATAR_ENABLED   = false;
const AVATAR_PROVIDER  = "d-id";
const AVATAR_API_KEY_ENV = "DID_API_KEY";
const AVATAR_ID        = "judith_v1";

const GOTENBERG_URL    = "http://gotenberg:3000/forms/chromium/screenshot/html";
const IG_TEMPLATE_URL  = "https://raw.githubusercontent.com/twaese/Physio-Fuchs-Social-Media-Automation/main/04_Canva-Vorlagen/html-templates/instagram/PF_Feed_Standard.html";

const SP_SITE_GUID = "{{SHAREPOINT_SITE_GUID}}";
const SP_LIST_GUID = "{{SHAREPOINT_LIST_GUID}}";
```

### Sticky 2: HWG-Blacklist
Liste der Regex-Patterns aus `01_Prompts/HWG-Blacklist.md`. Werden in
Code-Node 10 hardcoded.

---

## 3. Cron-Trigger

```json
{
  "rule": {
    "interval": [{"field": "hours", "hoursInterval": 1}]
  }
}
```

Stündlich. Bei späterem Lastproblem auf 2h erhöhen.

---

## 4. SharePoint: Entwürfe holen

Microsoft SharePoint Node, Resource `Item`, Operation `Get many`:
- Site: `{{SHAREPOINT_SITE_GUID}}`
- List: `{{SHAREPOINT_LIST_GUID}}`
- Filter: `fields/Status eq 'Entwurf'`
- Options: `fields: ["fields"]`

Output: alle Entwurf-Items mit allen Feldern.

---

## 5. Code: Validate + Route

```javascript
// Items prüfen, Post-Typ extrahieren
const items = $input.all();
const results = [];

for (const item of items) {
  const fields = item.json.fields || item.json;
  const postTyp = fields.Post_Typ || fields.field_2;

  if (!postTyp) {
    // Skip: kein Post-Typ
    continue;
  }

  // Avatar-Typen = Reel, Übung, Story
  const isAvatar = ["Reel", "Übung", "Story"].includes(postTyp);

  results.push({
    json: {
      ...fields,
      _post_typ: postTyp,
      _branch: isAvatar ? "avatar" : "feed",
      _sp_item_id: item.json.id,
    }
  });
}

return results;
```

---

## 6. Switch: Feed oder Avatar

n8n Switch-Node, Mode `Expression`, Value: `{{ $json._branch }}`
- Output 0: `feed`
- Output 1: `avatar`

---

## 7. Build Claude Payload (Feed-Branch)

```javascript
const f = $json;

const PROMPT = `Du bist Texter für die Physio Fuchs Praxis in Ratingen-Lintorf.
Erzeuge eine Instagram-Caption für folgenden Post-Brief:

Post-Typ: ${f._post_typ}
Thema: ${f.Thema || ''}
Content-Brief: ${f.Content_Brief || ''}
Hashtag-Thema: ${f.Hashtag_Thema || ''}

Tonalität:
- "Sie"-Form, professionell, sympathisch, motivierend
- KEINE Heilversprechen (kein "heilt", "garantiert", "kuriert", "schmerzfrei in X Tagen")
- KEINE Diagnosen
- Maximal 3 Emojis, sparsam
- Bei Übungen: Hinweis "Bei anhaltenden Beschwerden bitte ärztlich abklären"

Antworte AUSSCHLIESSLICH als JSON mit dieser Struktur:
{
  "titel": "<Hook, max 50 Zeichen, für Bild-Headline>",
  "text": "<Body 2-3 Sätze, max 200 Zeichen, für Bild-Untertitel>",
  "cta": "<Call-to-Action, max 50 Zeichen, für Bild-Footer>",
  "caption": "<längere Caption für Instagram, 80-250 Zeichen Hook + 2-3 Absätze>",
  "hashtags": ["#tag1", "#tag2", ...]  // 8-15 Hashtags, lokal + thematisch
}`;

return [{
  json: {
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: PROMPT }]
  },
  binary: $json._sp_item_id ? { sp_id: { data: $json._sp_item_id } } : undefined,
  // Karry-Daten für nachfolgende Nodes:
  passthrough: f
}];
```

---

## 8. HTTP: Claude Caption

```
POST https://api.anthropic.com/v1/messages
Headers:
  x-api-key: {{ANTHROPIC_API_KEY}} (aus Credentials)
  anthropic-version: 2023-06-01
  content-type: application/json
Body: $json (von Node 7)
```

---

## 9. Parse Claude Response

```javascript
const resp = $json;
const raw = resp.content?.[0]?.text || resp.completion || "";

let parsed;
try {
  // Claude antwortet manchmal mit ```json ... ``` wrapping
  const match = raw.match(/\{[\s\S]*\}/);
  parsed = JSON.parse(match ? match[0] : raw);
} catch (e) {
  throw new Error("Claude-Response nicht JSON-parsebar: " + raw.slice(0, 200));
}

// Passthrough aus Node 7 wieder dran hängen
const passthrough = $node["Build Claude Payload"].json.passthrough || {};

return [{
  json: {
    ...passthrough,
    titel:    parsed.titel,
    text:     parsed.text,
    cta:      parsed.cta,
    caption:  parsed.caption,
    hashtags: parsed.hashtags || [],
  }
}];
```

---

## 10. Code: HWG-Filter

```javascript
const HWG_PATTERNS = [
  /\bheilt\b/i,
  /\bheilung\b/i,
  /\bkuriert\b/i,
  /\bgarantiert\b/i,
  /\bgewährleistet?\b/i,
  /\bverspricht\b/i,
  /\bversprechen wir\b/i,
  /\b(schmerzfrei|beschwerdefrei) in (\d+|wenigen|kürzester) (tag|tage|tagen|woche|wochen)\b/i,
  /\bwirkt (100 ?%|sicher|garantiert)\b/i,
  /\bbeseitigt (schmerz|beschwerd|leiden)\b/i,
  /\b(stellt|stellen wir) (ihre )?diagnose\b/i,
  /\bbehandelt erfolgreich\b/i,
  /\b(nebenwirkungsfrei|ohne nebenwirkungen)\b/i,
  /\bbesser als (ärzt|operation|medikament)\b/i,
  /\b(ersetzt|statt) (arzt|ärzt|operation|medikament)\b/i,
];

const f = $json;
const fullText = [f.titel, f.text, f.cta, f.caption].filter(Boolean).join(" ");

const matches = HWG_PATTERNS
  .map(re => ({ re: re.source, match: fullText.match(re) }))
  .filter(x => x.match);

return [{
  json: {
    ...f,
    _hwg_matches: matches.map(m => m.match[0]),
    _hwg_clean: matches.length === 0,
  }
}];
```

---

## 11. If: HWG-Match?

n8n If-Node:
- Value 1: `{{ $json._hwg_clean }}` boolean true
- True → Node 12 (HTML bauen + Render)
- False → Node 15 (SP-Update Geblockt)

---

## 12. Code: HTML-Template bauen

```javascript
const f = $json;

// HTML-Template von GitHub Raw fetchen
const TEMPLATE_URL = "https://raw.githubusercontent.com/twaese/Physio-Fuchs-Social-Media-Automation/main/04_Canva-Vorlagen/html-templates/instagram/PF_Feed_Standard.html";

const tmplResp = await this.helpers.httpRequest({
  method: "GET",
  url: TEMPLATE_URL,
  returnFullResponse: false,
});
let html = typeof tmplResp === "string" ? tmplResp : tmplResp.body;

// Asset-Pfade auf absolute GitHub-Raw-URLs umschreiben
const ASSETS_BASE = "https://raw.githubusercontent.com/twaese/Physio-Fuchs-Social-Media-Automation/main/04_Canva-Vorlagen/html-templates/assets/";
html = html.replace(/src="\.\.\/assets\//g, `src="${ASSETS_BASE}`);

// Platzhalter ersetzen
const datum = new Date().toLocaleDateString("de-DE", {
  day: "2-digit", month: "2-digit", year: "numeric"
});
html = html.replace(/\{\{TITEL\}\}/g, f.titel || "");
html = html.replace(/\{\{TEXT\}\}/g, f.text || "");
html = html.replace(/\{\{CTA\}\}/g, f.cta || "");
html = html.replace(/\{\{DATUM\}\}/g, datum);

return [{
  json: { ...f, _html: html, _datum: datum }
}];
```

---

## 13. HTTP: Gotenberg Render IG

```
POST http://gotenberg:3000/forms/chromium/screenshot/html
Content-Type: multipart/form-data
Body (Form-Data, multiPart):
  files: [Filename: index.html, Content: $json._html]
  format: png
  width: 1080
  height: 1350
  optimizeForSpeed: false
Response Format: File (Binary)
```

Wichtig in n8n: Body-Type `n8n Binary File`, das Binary-Field-Property im
HTTP-Node nutzen. Output ist `data` (binary) → fließt in Node 14.

---

## 14. SharePoint: Update als Bereit

```
PATCH https://{{SHAREPOINT_SITE_URL}}/_api/web/lists(guid'{{LIST_GUID}}')/items({{ITEM_ID}})
Headers:
  X-HTTP-Method: MERGE
  IF-MATCH: *
  Content-Type: application/json;odata=verbose
Body:
{
  "Caption_Variante": "{{ $json.caption }}\n\n{{ $json.hashtags.join(' ') }}",
  "Hashtag_Thema": "{{ $json.hashtags.join(' ') }}",
  "Status": "Bereit",
  "Bild_Dateiname": "<URL of stored image - siehe TODO unten>",
  "Kommentare": "{{ $json.Kommentare || '' }}\n{{ $now.toFormat('yyyy-MM-dd HH:mm') }} WF-02: Caption + Bild fertig, HWG sauber, Status Bereit"
}
```

**TODO Bild-Speicherung:** Das Binary-PNG aus Gotenberg muss irgendwo
abgelegt werden, damit `field_9` eine URL referenzieren kann.

Optionen:
- **(A) SharePoint Document-Library** — n8n hat ein Upload-Node, Bild
  landet im Site-eigenen Dokument-Ordner, URL ist sharepoint-intern.
- **(B) eigener Mini-Storage** auf VPS via traefik gerouted — komplexer.
- **(C) Imgur / Cloudinary** — externer Dienst, einfache URL, aber neuer
  Account + 3rd-Party-Abhängigkeit.

Empfehlung: **A** (SharePoint-intern, gleiche Auth, kein neuer Dienst).
Wird in v18.1 ergänzt — für MVP-Test reicht zunächst, dass Gotenberg
sauber rendert, die Persistenz ist ein eigener Build-Schritt.

---

## 15. SharePoint: Update als Geblockt

```
PATCH ...
Body:
{
  "Status": "Geblockt",
  "Kommentare": "{{ $json.Kommentare || '' }}\n{{ $now.toFormat('yyyy-MM-dd HH:mm') }} WF-02: HWG-Filter MATCH → {{ $json._hwg_matches.join(', ') }} → Status Geblockt"
}
```

Caption wird trotzdem in `field_10` gespeichert, damit Judith sehen kann,
was der LLM erzeugt hat und entscheiden kann (re-generieren oder mit
kleinen Edits freigeben).

---

## 16-18. Avatar-Branch

### 16. Code: AVATAR_ENABLED Check

```javascript
const AVATAR_ENABLED = false;  // ← später auf true ändern wenn D-ID läuft

return [{
  json: { ...$json, _avatar_enabled: AVATAR_ENABLED }
}];
```

### 17. If: Avatar aktiv?

True → später D-ID-Call (v19+)
False → Node 18

### 18. SharePoint: Update als Wartet-auf-Avatar

```
PATCH ...
Body:
{
  "Status": "Wartet-auf-Avatar",
  "Kommentare": "{{ $json.Kommentare || '' }}\n{{ $now.toFormat('yyyy-MM-dd HH:mm') }} WF-02: Post-Typ {{ $json._post_typ }} braucht Avatar-Pipeline (AVATAR_ENABLED=false) → geparkt"
}
```

---

## 19. Connections

```
Cron-Trigger
  → SharePoint: Entwürfe holen
    → Code: Validate + Route
      → Switch: Feed oder Avatar
        ├─[feed]→ Build Claude Payload
        │         → HTTP: Claude Caption
        │           → Parse Claude Response
        │             → Code: HWG-Filter
        │               → If: HWG-Match?
        │                 ├─[clean]→ Code: HTML-Template bauen
        │                 │           → HTTP: Gotenberg Render IG
        │                 │             → SharePoint: Update als Bereit
        │                 └─[match]→ SharePoint: Update als Geblockt
        │
        └─[avatar]→ Code: AVATAR_ENABLED Check
                    → If: Avatar aktiv?
                      ├─[true]→ (v19+: D-ID-Pipeline)
                      └─[false]→ SharePoint: Update als Wartet-auf-Avatar
```

---

## 20. Test-Plan

1. **Trockenlauf 1 (Feed, HWG OK):**
   - Test-Eintrag in SharePoint, Status `Entwurf`, Post-Typ `Tipp`,
     Content-Brief „Wassertrinken im Alltag"
   - Cron manuell triggern in n8n
   - Erwartung: Status `Bereit`, Caption in `field_10`, Bild-URL in `field_9`

2. **Trockenlauf 2 (Feed, HWG Match):**
   - Caption manuell „test heilt heilt" in Prompt erzwingen (oder Test-Code)
   - Erwartung: Status `Geblockt`, Log-Eintrag mit Match-Detail

3. **Trockenlauf 3 (Avatar, Flag off):**
   - Test-Eintrag, Post-Typ `Übung`
   - Erwartung: Status `Wartet-auf-Avatar`, Log-Eintrag

4. **Render-Test visuell:**
   - Bild-URL aus `field_9` im Browser öffnen
   - Erwartung: korrektes Layout, Logo + Judith-Portrait + Caption-Texte

---

## 21. Was offen bleibt (für v18.1 / v19)

- **Bild-Persistenz** (siehe Node 14 TODO) — SharePoint Document-Library
- **Facebook-Render** (PF_Feed_FB_Standard.html, 1080×1080)
- **LinkedIn-Render** (PF_Feed_LI_Standard.html, 1200×1200)
- **D-ID-Integration** im Avatar-Branch
- **Recruiting-Caption-Variante** mit eigenem Prompt
- **HWG-Blacklist aus Repo-Datei laden** (statt hardcoded)

---

## Änderungshistorie

| Datum       | Was                            | Wer    |
| ----------- | ------------------------------ | ------ |
| 2026-05-16  | Initial Build-Spec für v18     | Claude |
