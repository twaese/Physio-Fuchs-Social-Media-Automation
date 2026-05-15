# WF-04: Monats-Scheduler Standard-Post

Eigenständiger Workflow, der **einmal pro Monat** einen Standard-Feed-Post
für IG + FB einplant – unabhängig vom bestehenden Wochen-Rhythmus (Reels,
Stories, `Übung`).

**Status:** Implementierung als `PF_WF-04_Monats_Scheduler_v1.json` im
Repo-Root vorhanden. Noch **nicht aktiviert** in n8n (`active: false`).
Vor Aktivierung Test-Plan in Abschnitt 8 durchlaufen.

**Import in n8n:** Datei per Drag&Drop in den n8n-Editor ziehen oder
über `Workflows → Import from File → PF_WF-04_Monats_Scheduler_v1.json`.

**Voraussetzungen für den Import:**
- Credentials `PF Microsoft SharePoint account` und
  `PF Microsoft Teams account` sind in n8n bereits angelegt
  (aus WF-01/02/03 vorhanden).
- Env-Variablen `SHAREPOINT_SITE_ID` und `SHAREPOINT_LIST_ID` sind in
  n8n gesetzt (siehe `99_Platzhalter-Secrets/.env.example`).

**Aufbau (10 Nodes):**
- 2× Sticky Note (Doku im Workflow + Konfiguration)
- 1× Schedule Trigger (Cron, 1. d. Monats 06:00)
- 1× SharePoint `getAll` (alle Items lesen)
- 1× Code `Plan: Kandidat + freier Tag` (Filter, Kollisions-Check, Datum)
- 1× Switch (`OK` / `NO_CANDIDATE` / `NO_FREE_DAY`)
- 1× SharePoint `update` (Kandidat planen)
- 3× Teams (Erfolg, kein Pool, kein freier Tag)

---

## 1. Zweck

- Pro Monat genau **1 zusätzlicher** Standard-Feed-Post (Tipp, FAQ, Aktion,
  Praxis-News, BTS, Team, Standard, Mitarbeiter:in).
- Posting-Tag wird **automatisch auf einen freien Tag** im Monat gelegt,
  damit kein Reel oder keine Story am selben Tag konkurriert.
- Kein Freigabe-Schritt durch Judith (siehe Abschnitt 6 „Optionale
  Freigabe-Pflicht").

---

## 2. Trigger

- **Cron-Node:** jeden 1. eines Monats, 06:00 Uhr lokale Zeit.
- Manuell auslösbar für Tests („Execute Workflow"-Button in n8n).

---

## 3. Ablauf

```
[Cron 1. d. Monats, 06:00]
        │
        ▼
[Schritt 1: Kandidat suchen] ──── kein Treffer ───► [Teams-Card: kein Vorrat]
        │ Kandidat gefunden
        ▼
[Schritt 2: Belegte Tage des Monats laden]
        │
        ▼
[Schritt 3: Freien Tag berechnen] ─── kein freier Tag ───► [Teams-Card: manuell planen]
        │ Tag gefunden
        ▼
[Schritt 4: SharePoint-Update auf Kandidat]
        │  field_4 = freier Tag (TTMMJJJJ)
        │  field_5 = 09:00
        │  field_13 += "[AUTO_RELEASE] WF-04: auto-geplant auf {Datum}"
        │  Status bleibt Entwurf
        ▼
[Pipeline-Übergabe]
        │
        ▼
   WF-02 picks ihn auf (Caption + Hashtags) → Status = Bereit
        │
        ▼
   WF-03 Phase A erkennt [AUTO_RELEASE] → Status direkt = Freigegeben
   (kein Teams-Card-Schritt für Standard-Posts)
        │
        ▼
   WF-03 Phase B/C plant + postet zu IG + FB → Status = Geplant / Veröffentlicht
```

---

## 4. Schritt-Details

### Schritt 1: Standard-Post-Kandidat suchen

**SharePoint-Query** auf Liste `PF-Content-Kalender-2026`:

```
$filter=
  (Post_Typ eq 'Standard'
   or Post_Typ eq 'Tipp'
   or Post_Typ eq 'FAQ'
   or Post_Typ eq 'Praxis-News'
   or Post_Typ eq 'Aktion'
   or Post_Typ eq 'Mitarbeiter:in'
   or Post_Typ eq 'Behind-the-Scenes'
   or Post_Typ eq 'Team'
   or Post_Typ eq 'Promo'
   or Post_Typ eq 'Zitat')
  and Status eq 'Entwurf'
  and Veröffentlichungsdatum eq null
$orderby=Created asc
$top=1
```

`Übung` ist **bewusst nicht** im Kandidaten-Filter – das ist das
Wochen-Format und wird über WF-01/02/03 manuell durch Judith eingebracht.

**Wenn leer:**
- Teams-Card an Channel „Social Media (meeting)":
  „Hi Judith, für **{Monat}** ist kein Standard-Post in der Pipeline. Bitte
  einen Entwurf einreichen, sonst veröffentlichen wir diesen Monat nichts
  zusätzlich zum Wochenformat."
- Workflow endet.

### Schritt 2: Belegte Tage des Monats ermitteln

`Veröffentlichungsdatum` ist ein echtes Date-Feld – sauberes `ge`/`lt`-
Filter möglich.

**SharePoint-Query:** alle Einträge mit Datum im laufenden Monat, deren
Status bereits aktiv ist (alles außer `Entwurf`), oder die ein Format mit
Tag-Bindung sind (Reel/Story, auch wenn noch `Entwurf`):

```
$filter=
  Veröffentlichungsdatum ge {MONTH_START}
  and Veröffentlichungsdatum lt {NEXT_MONTH_START}
  and (
    Status eq 'Bereit'
    or Status eq 'Freigegeben'
    or Status eq 'Geplant'
    or Status eq 'Veröffentlicht'
    or Post_Typ eq 'Reel'
    or Post_Typ eq 'Story'
  )
$select=Post_Typ,Veröffentlichungsdatum,Status
```

`MONTH_START` und `NEXT_MONTH_START` als ISO-8601-Strings, z. B.
`2026-05-01T00:00:00Z` und `2026-06-01T00:00:00Z`.

→ Ergebnis-Set: Liste belegter Datumswerte. **Zwingend** auf reines
Datum (Zeitanteil verwerfen) normalisieren vor dem Vergleich in
Schritt 3 — siehe Konvention `Datum + Uhrzeit getrennt behandeln`
in `03_SharePoint/Liste-Schema.md`.

> **Zeitzone:** Site-Zeitzone steht seit 2026-05-14 auf
> Europe/Berlin (UTC+01:00). Für Altdaten aus der PST-Phase kann der
> Zeitanteil in `Veröffentlichungsdatum` verfälscht sein — daher
> niemals direkt verwenden, immer nur das Datum extrahieren.

### Schritt 3: Freien Tag berechnen

- **Präferenz-Wochentag:** Dienstag (Engagement-Empirik laut Redaktionsplan).
- Alle Dienstage des laufenden Monats berechnen.
- Ersten Dienstag wählen, der **nicht** in der Belegt-Liste vorkommt.
- **Fallback 1:** kein freier Dienstag → nimm den ersten freien Werktag
  (Mo–Fr) ab heute, Wochenende ausschließen.
- **Fallback 2:** auch kein freier Werktag → Teams-Card: „Monat ist voll,
  bitte manuell planen." Workflow endet ohne Schreiben.
- **Mindestabstand:** gefundener Tag muss ≥ 3 Tage in der Zukunft liegen
  (damit WF-02 + WF-03 Zeit haben).

**Konstanten in Sticky-Note:**

```
PREFERENCE_WEEKDAY = "Tuesday"      # zulässig: Monday..Sunday
ALTERNATE_WEEKDAY  = "Thursday"     # für Fallback 0.5 (optional, vor Fallback 1)
MIN_LEAD_DAYS      = 3
POSTING_TIME       = "09:00"
REQUIRE_APPROVAL_FOR_STANDARD = false
```

### Schritt 4: SharePoint-Update auf Kandidat

PATCH auf den Kandidaten-Eintrag:

```json
{
  "Veröffentlichungsdatum":  "2026-MM-TTT00:00:00",
  "Uhrzeit":                  "09:00",
  "Log":                      "{vorhandener Text}\n[AUTO_RELEASE] WF-04: auto-geplant auf {TT.MM.JJJJ} ({Wochentag}). Freier Tag, keine Reels/Stories an dem Tag."
}
```

`Veröffentlichungsdatum` bekommt **00:00:00 UTC** als Zeitanteil –
nicht die spätere Posting-Zeit. Die echte Posting-Zeit steht im
separaten Text-Feld `Uhrzeit` und wird erst in WF-03 Phase C beim
Bau des `scheduled_publish_time` aus den beiden kombiniert (als
Berlin-Lokalzeit → UTC-Unix-Timestamp).

**Außerdem setzt WF-04** (notwendig, weil WF-02 v17 auf `Status = Bereit` filtert):
- `Status` = `Bereit`

**Strikt nicht setzen** (Sicherheitsregel):
- `Caption`
- `Hashtags`
- `Vorschau-URL`
- `Meta_Post_ID`

**Hintergrund:** Im ursprünglichen Konzept setzte WF-04 nur Datum/Uhrzeit/Log
und ließ Status auf `Entwurf`. Der Bestands-Workflow WF-02 v16 filtert
aber explizit auf `Status = Bereit` (nicht `Entwurf`). Ohne den
Statuswechsel würde der Eintrag nie weiterverarbeitet. Deshalb setzt
WF-04 jetzt direkt auf `Bereit` – und WF-02 v17 erkennt am
`[AUTO_RELEASE]`-Marker im Log, dass kein Teams-Wait nötig ist.

---

## 5. Übergabe an WF-02 und WF-03

Nach Schritt 4 endet WF-04. Die weitere Verarbeitung läuft über den
bestehenden Pipeline-Flow:

1. **WF-02** (regelmäßiger Trigger oder SharePoint-Subscription) findet
   den Eintrag mit Status `Entwurf` + ausgefülltem `field_4`, generiert
   Caption + Hashtags, setzt Status auf `Bereit`.
2. **WF-03 Phase A** prüft beim Statuswechsel auf `Bereit`:
   - `field_2` ∈ Standard-Post-Typen UND `field_13` enthält
     `[AUTO_RELEASE]` UND `REQUIRE_APPROVAL_FOR_STANDARD == false`
     → Status direkt auf `Freigegeben`, **keine** Teams-Card.
   - sonst → bisheriger Pfad (Teams-Card an Judith).
3. **WF-03 Phase B/C** plant über Meta Graph API mit
   `scheduled_publish_time` und postet zu IG + FB.

---

## 6. Optionale Freigabe-Pflicht

Wenn Judith bei sensiblen Themen (neue Aktion, neue Preise, Praxis-News,
Personalwechsel) doch eine Freigabe will, ohne den Workflow umzubauen:

- **Variante A (dauerhaft):** Konstante `REQUIRE_APPROVAL_FOR_STANDARD`
  in der Sticky-Note auf `true`. WF-03 Phase A schickt dann auch für
  Standard-Posts mit `[AUTO_RELEASE]` die Teams-Card.
- **Variante B (pro Eintrag):** Judith schreibt im Formular in das
  Notizen-Feld den Marker `[NEEDS_APPROVAL]`. WF-04 erkennt das und setzt
  `[AUTO_RELEASE]` **nicht**, sodass WF-03 die normale Freigabe-Route fährt.

Reels, Stories und `Übung` behalten **immer** den manuellen
Freigabe-Schritt – die Sonderregel gilt nur für Standard-Feed-Posts.

---

## 7. Sicherheits-Regeln (Pflicht)

- WF-04 schreibt **nur** `field_4`, `field_5`, `field_6` (= „Bereit"), `field_13`.
- WF-04 setzt `field_6` **ausschließlich** auf `Bereit` (nie auf
  `Freigegeben`/`Geplant`/`Veröffentlicht`).
- WF-04 erzeugt **nie** Inhalte (Caption, Hashtags, Bilder).
- WF-04 löst **nie** ein Meta-API-Posting aus.
- Bei jedem unklaren Zustand (keine Kandidaten, kein freier Tag, mehrere
  Treffer mit gleichem `Created`-Timestamp) → Teams-Card, Workflow endet.

---

## 8. Test-Plan

1. Test-Eintrag manuell in SharePoint anlegen:
   - `Post_Typ` = `Tipp`
   - `Status` = `Entwurf`
   - `Veröffentlichungsdatum` = leer
   - `Content_Brief` = Test-Brief
2. WF-04 manuell triggern.
3. Erwartung:
   - `field_4` ist auf den nächsten freien Dienstag im laufenden Monat
     gesetzt (oder Fallback-Tag).
   - `field_13` enthält `[AUTO_RELEASE] WF-04: …`.
   - Status bleibt `Entwurf`.
4. WF-02 manuell triggern → Caption + Hashtags + Status `Bereit`.
5. WF-03 Phase A triggern → Status `Freigegeben` ohne Teams-Card.
6. WF-03 Phase B/C bis zum **Vorschau-Schritt** durchlaufen (NICHT
   live posten). `field_9` enthält Canva-Vorschau-URL.
7. Erst nach erfolgreicher Trockenrunde echten Test-Post zu einem
   privaten Test-Account.

---

## 9. Platzhalter / Umgebungsvariablen

Werte aus `~/secrets/physio-fuchs/.env` (siehe
`99_Platzhalter-Secrets/Platzhalter-Liste.md`):

- `{{SHAREPOINT_SITE_URL}}`, `{{SHAREPOINT_SITE_GUID}}`,
  `{{SHAREPOINT_LIST_GUID}}`
- `{{TEAMS_WEBHOOK_URL}}` (für Reminder-Cards)
- `{{N8N_WEBHOOK_URL}}` (interner Trigger, falls WF-04 WF-02 explizit
  anstößt statt auf Polling zu warten)

Keine Hardcodes im JSON.

---

## 10. Änderungshistorie

| Datum       | Änderung                                         | Wer    |
| ----------- | ------------------------------------------------ | ------ |
| 2026-05-14  | Initialversion (Bauanleitung, noch nicht in n8n) | Claude |
