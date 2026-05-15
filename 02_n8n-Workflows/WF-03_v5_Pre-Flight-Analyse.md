# WF-03 v5 – Pre-Flight-Analyse

Stand: 2026-05-14

Vollständige Analyse von `PF_WF-03_Social_Media_Post_v4.json` mit Blick
darauf, was beim Versuch, einen **Standard-Feed-Post** durchlaufen zu
lassen, schief geht.

---

## Bestand: WF-03 v4 in Kurzform

```
Schedule (Mo/Mi/Fr 9:00)
  → SharePoint: Items lesen (simplify=true, listItem)
  → If: field_6 = Freigegeben UND field_1 nicht leer
       ├ true → Felder aufbereiten → Claude+Canva (HTTP) → Bild-URL extrahieren
       │      → IG: Media Container (POST /media)
       │      → Wait 15s
       │      → IG: media_publish    +    FB: /photos
       │      → SharePoint: Status = Veröffentlicht
       │      → Teams: Erfolgsmeldung
       └ false → Set "Kein Content – Ende"
```

---

## Probleme (sortiert nach Schweregrad)

### 🟥 **P1: SharePoint-Read liefert keine Custom-Felder**

WF-03 v4 nutzt `resource: "listItem"` mit `simplify: true`. Aus dem WF-04-
Debug wissen wir: **damit kommen die Custom-Spalten (`field_1`..`field_13`)
nicht im Output an** – nur Top-Level-Metadaten.

**Folge:** der nachfolgende `If: Freigegeben + Thema?` prüft
`$json.fields?.field_6` – das ist `undefined`. Bedingung schlägt fehl,
Branch geht IMMER zu „Kein Content – Ende".

**Fix:** auf `resource: "item"` + `options.fields: ["fields"]` + `simplify: false`
umstellen, **wie WF-02 v16/v17 und WF-04 jetzt aufgebaut sind**.

### 🟥 **P2: Falsche Caption-Quelle**

`Felder aufbereiten` setzt:
```js
caption: $json.fields?.field_3 ?? $json.field_3
```

`field_3` ist der **Content_Brief** (Thema-Beschreibung von Judith), **nicht**
die finale Caption. Die Caption steckt in `field_10`, geschrieben von WF-02 v17.

**Folge:** Instagram + Facebook bekommen den Rohbrief als Posttext.

**Fix:** `caption: $json.fields?.field_10 ?? $json.field_10`.

### 🟥 **P3: Hashtags werden nicht verwendet**

`field_7` (Hashtags, von WF-02 v17 gefüllt) taucht im ganzen Workflow nicht auf.

**Folge:** Posts gehen ohne Hashtags raus.

**Fix:** in `Felder aufbereiten` zusätzlich `hashtags: $json.fields?.field_7`
holen, dann an Caption hängen (IG) bzw. als ersten Kommentar nach FB-Post
absetzen (Best Practice für FB).

### 🟥 **P4: Posting-Datum wird ignoriert**

WF-03 v4 postet alles, was beim nächsten Mo/Mi/Fr 9:00-Trigger den Status
`Freigegeben` hat – sofort, nicht zum Wunsch-Datum aus
`Veröffentlichungsdatum`.

**Folge:** PF-2026-099 (geplant für 19.05.) würde am nächsten Mo/Mi/Fr 9:00
sofort gepostet werden, nicht am 19.05.

**Fix-Optionen:**
- A) IF-Filter ergänzen: `Veröffentlichungsdatum <= heute`. Dann werden nur
  fällige Posts publiziert.
- B) `scheduled_publish_time` der Meta Graph API nutzen (Unix-Timestamp aus
  `Veröffentlichungsdatum + Uhrzeit`, mind. 10 Min in der Zukunft, max 75 Tage).
  Dann übernimmt Meta die Planung.

Empfehlung: **Option A** (einfacher, transparenter, weniger API-Reibung).
Trigger-Frequenz auf täglich 09:00 hochziehen.

### 🟧 **P5: Canva-Template ist hardcoded**

`Claude + Canva: Design exportieren` schreibt Template-ID `DAHJW-GJz68` direkt
in den User-Prompt. Egal welcher `Post_Typ` → immer das gleiche Template
(„Standard").

**Folge:** „Tipp", „FAQ", „Übung", „Aktion" usw. nutzen alle das Standard-
Layout. Inhaltlich falsch.

**Fix:** Template-ID dynamisch aus dem `canva_template_id`-Feld auswählen
(WF-02 v17 setzt das schon in `field_9`). Mapping ist in WF-02 v17
bereits drin.

### 🟧 **P6: Item-ID-Pfad fragil**

`Felder aufbereiten` nutzt `$json.id`. Bei `resource: "item"` heißt das Feld
**`Ausweis`** im n8n-Output (deutsche Lokalisierung, wie wir bei WF-04 sahen).

**Fix:** `item_id: $json.id ?? $json.Ausweis ?? $json.fields?.AUSWEIS`.

### 🟧 **P7: Caption-Variable nur im Prompt, nicht in der Grafik**

Der Claude+Canva-Prompt ersetzt nur `[THEMA]` im Template – `[BODY]`, `[CTA]`,
`[HOOK]`, `[DATUM]` aus dem Canva-Vorlagen-Konzept werden nicht befüllt.

**Folge:** Grafik enthält nur Thema-Text. Das Layout vermutlich brüchig.

**Fix:** Prompt erweitern um die anderen Platzhalter, oder Hook + Body aus
WF-02 v17 mitliefern (sind als `final_hook`, `final_caption` schon
generiert, aber **nicht** in SharePoint persistiert – bisher landet nur
`final_caption` in `field_10`).

### 🟨 **P8: FB-Cross-Posting ohne Hashtag-Kommentar**

Der FB-Posting-Node setzt `message = caption`. Hashtags werden also entweder
(falsch) am Ende der Caption mitgeschickt, oder (wie aktuell) gar nicht.

**Best Practice FB:** Hashtags als **erster Kommentar** unter dem Post.

**Fix:** nach erfolgreichem FB-Post einen zweiten HTTP-Call an
`/{post-id}/comments` mit `message = hashtags`.

### 🟨 **P9: Keine Sicherheits-Stops**

- Wenn Claude-Call fehlschlägt → Bild-URL leer → Folge-Posts crashen
- Wenn IG-Container nicht ready nach 15s → `media_publish` schlägt fehl
- Wenn Canva-Quota überschritten → Bilderzeugung leise broken

**Fix:** „Continue on Fail" + Error-Branch mit Teams-Alarm an Thomas.

### 🟨 **P10: Status `Bereit` und Auto-Release-Marker werden ignoriert**

WF-03 v4 weiß nichts von Auto-Release. Phase B2 (laut Doku in
`WF-03_Social-Media-Post.md`) existiert in v4 nicht.

**Aktuell egal,** weil WF-02 v17 selbst bei Auto-Release direkt auf
`Freigegeben` springt – WF-03 v4 sieht das Item dann ohnehin im richtigen
Status. **Aber:** falls später WF-04 mal ohne Auto-Release laufen soll,
müsste WF-03 v5 eine eigene Phase B haben.

---

## Empfehlung

**WF-03 v5 als neue JSON anlegen, mit folgenden Mindest-Fixes:**

1. SharePoint-Read auf `resource: "item"` + `options.fields: ["fields"]` + `simplify: false`
2. `Felder aufbereiten` – richtige Felder lesen (`field_10` Caption, `field_7` Hashtags, `field_9` Canva-ID, `Ausweis` für Item-ID, `Ver_x00f6_ffentlichungsdatum` für Datum)
3. IF-Filter erweitern: `Veröffentlichungsdatum <= heute`
4. Trigger auf täglich 9:00
5. Canva-Template-ID aus `field_9` statt hardcoded
6. Hashtags an Caption (IG) bzw. als FB-Kommentar
7. Error-Branches mit Teams-Alarm

Optional in einer späteren v6:
- Multi-Image-Posts (Carousel)
- Reels (eigener Branch via IG Reels Endpoint)
- `scheduled_publish_time` über Meta Graph API

---

## Was wir jetzt konkret tun

1. **PF-2026-099 entschärfen** – Datum auf 2099 setzen, damit kein versehentliches Live-Posting passiert.
2. **Frischen Test-Eintrag** PF-2026-100 anlegen.
3. **WF-03 v5 als JSON aufbauen** und importieren.
4. **Trockenlauf** mit deaktivierten Posting-Nodes (IG `/media`, FB `/photos`).
5. **Verifikation:** Canva-Grafik korrekt? Caption korrekt? Hashtags korrekt?
6. **Erst dann** echtes Live-Posting freigeben.

---

## Änderungshistorie

| Datum       | Änderung                          | Wer    |
| ----------- | --------------------------------- | ------ |
| 2026-05-14  | Initial Pre-Flight-Analyse        | Claude |
