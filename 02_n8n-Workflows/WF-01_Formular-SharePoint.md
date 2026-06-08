# WF-01 – Formular → SharePoint

**JSON:** `PF_WF-01_v2_Konsolidiert.json` (Root, **aktiv seit 2026-06-08**)
**Vorgänger:** `_Archiv-Workflows/PF_WF-01_Formular_SharePoint_v1.json`
**Trigger:** Webhook (POST)
**Endpoint:** `{{N8N_WEBHOOK_URL}}/webhook/sharepoint-content`
**Webhook-ID:** `pf-wf01-content-einreichung`
**Status-Effekt:** legt neues Item mit `field_6 = Entwurf` an

---

## Zweck

Empfängt eine Formular-Einreichung von Judith aus
`physio_fuchs_form_v2.html` und legt daraus einen neuen Eintrag in der
SharePoint-Liste `PF-Content-Kalender-2026` an.

---

## Ablauf

```
[1] Webhook (POST /sharepoint-content)
        │
        ▼
[2] Code-Node "Felder mappen"
        │  - Pflichtfeld "Thema" prüfen
        │  - Datum ISO → "TTMMJJJJ"
        │  - Defaults: Status=Entwurf, Freigabe=Judith
        ▼
[3] SharePoint: Item create
        │  - Site:  {{SHAREPOINT_SITE_GUID}}
        │  - Liste: {{SHAREPOINT_LIST_GUID}}
        ▼
[4] Teams: Eingang melden (HTML-Card an Judith, Channel "Socialmedia")
        │  - Item-ID + Thema + Post-Typ + Datum/Uhrzeit
        │  - Foto-Reminder mit vorgeschlagenem Dateinamen
        │    PF_{year}_{itemId-3stellig}_thema.jpg
        │  - Hinweis: Fallback auf Default-Bild wenn kein Foto
        ▼
[5] HTTP-Response 200 ans Formular
        │  { ok: true, status: "Entwurf",
        │    item_id: <SP-ID>, thema: "<Thema>" }
```

Bei Fehler in [2] oder [3]:
- HTTP-Response 4xx/5xx ans Formular mit Fehlermeldung
- Teams-Alert an Thomas

---

## Feld-Mapping (Formular → SharePoint)

| Formular-Feld              | SharePoint-Feld | Default / Hinweis            |
| -------------------------- | --------------- | ---------------------------- |
| `Thema`                    | `Title` + `field_1` | Pflichtfeld              |
| `Post_Typ`                 | `field_2`       | Default `Standard`           |
| `Content_Brief`            | `field_3`       |                              |
| `Veroeffentlichungsdatum`  | `field_4`       | Konvertierung zu `TTMMJJJJ`  |
| `Uhrzeit`                  | `field_5`       |                              |
| –                          | `field_6`       | hardcoded: `Entwurf`         |
| `Hashtag_Thema`            | `field_7`       |                              |
| `Bild_Dateiname`           | `field_8`       |                              |
| –                          | `field_9`       | leer (WF-03 füllt)           |
| –                          | `field_10`      | leer (WF-02 füllt)           |
| `Freigabe_Person`          | `field_11`      | Default `Judith`             |
| –                          | `field_12`      | leer (WF-03 füllt)           |
| `Kommentare`               | `field_13`      |                              |

Detailliert: `03_SharePoint/Felder-Mapping.md`

---

## Beispiel-Request

```bash
curl -X POST "{{N8N_WEBHOOK_URL}}/webhook/sharepoint-content" \
  -H "Content-Type: application/json" \
  -d '{
    "Thema": "Übung der Woche – Rumpfstabilität",
    "Post_Typ": "Übung",
    "Content_Brief": "Plank-Variante mit angehobenem Bein, 3x30 Sek.",
    "Veroeffentlichungsdatum": "2026-05-23",
    "Uhrzeit": "09:00",
    "Hashtag_Thema": "Rumpf",
    "Bild_Dateiname": "PF_Plank_2026-05-23.jpg",
    "Freigabe_Person": "Judith",
    "Kommentare": "Bitte mit kurzem Hinweis auf richtige Atmung",
    "_eingereichtVon": "Judith"
  }'
```

---

## Sticky-Notes (Empfehlung in n8n)

- **Haupt-Sticky** oben: Zweck, Trigger, Status-Effekt, Ablauf in 4 Zeilen.
- **Mapping-Sticky** links: das obige Feld-Mapping.
- **Credential-Sticky** rechts: Welche Credential-Namen, keine Tokens.

---

## Häufige Fehler & Behebung

| Fehler                         | Ursache                       | Behebung                          |
| ------------------------------ | ----------------------------- | --------------------------------- |
| HTTP 400 „Pflichtfeld Thema"   | Formular hat `Thema` leer     | Validierung im Formular schärfen  |
| HTTP 401 von SharePoint        | Token abgelaufen              | Credential erneuern               |
| Item ohne `field_4`            | Datum-Parser hat versagt      | Roh-Wert prüfen, Code-Node loggen |
| Doppel-Einreichungen           | Browser-Refresh durch Judith  | Idempotenz-Key (`_eingereichtAm`) |

---

## Verwandte Dateien

- HTML-Formular: `physio_fuchs_form_v2.html`
- SharePoint-Schema: `03_SharePoint/Liste-Schema.md`
- Status-Flow: `00_Konzept/Status-Flow.md`
- Foto-Naming-Konvention: `04_Canva-Vorlagen/Foto-Convention.md`

---

## Änderungshistorie

| Datum       | Version | Was                                                       |
| ----------- | ------- | --------------------------------------------------------- |
| 2026-05-11  | v1      | Initial: Webhook → Code → SP-Create → Response            |
| 2026-06-08  | v2      | Teams-Node aktiviert + HTML-Card mit Item-ID + Foto-      |
|             |         | Reminder. HTTP-Response inkl. `item_id` + `thema`.        |
|             |         | Sticky Notes auf aktuellen Status-Flow aktualisiert.      |
