# HWG-Blacklist – Caption-Filter für WF-02

Diese Datei ist die **Single Source of Truth** für den HWG-Filter
(Notbremse 1 im Status-Flow). WF-02 lädt die Liste und prüft jede
generierte Caption gegen die Patterns. Match → Status `Geblockt`,
Teams-Card an Judith, kein Posting.

**Rechtsgrundlage:** Heilmittelwerbegesetz (HWG), insbesondere §§ 3, 11.
Vollständigere Doku: `07_Datenschutz-DSGVO/Heilmittelwerbe-Hinweise.md`.

---

## 1. Pattern-Liste (case-insensitive)

Jeder Eintrag ist ein **Regex** (JavaScript-Syntax, Flag `i`).

```regex
\bheilt\b
\bheilung\b
\bkuriert\b
\bgarantiert\b
\bgewährleistet?\b
\bverspricht\b
\bversprechen wir\b
\b(schmerzfrei|beschwerdefrei) in (\d+|wenigen|kürzester) (tag|tage|tagen|woche|wochen)\b
\bwirkt (100 ?%|sicher|garantiert)\b
\bbeseitigt (schmerz|beschwerd|leiden)\b
\b(stellt|stellen wir) (ihre )?diagnose\b
\bbehandelt erfolgreich\b
\b(nebenwirkungsfrei|ohne nebenwirkungen)\b
\bbesser als (ärzt|operation|medikament)\b
\b(ersetzt|statt) (arzt|ärzt|operation|medikament)\b
\b(diese (übung|methode|behandlung)) (heilt|beseitigt|wirkt)\b
```

---

## 2. Beispiele

| Caption-Auszug | Treffer? | Begründung |
|---|---|---|
| „Diese Übung **heilt** Ihren Rücken" | ✅ Match | `\bheilt\b` |
| „… kann helfen, die Muskulatur zu mobilisieren" | ❌ | kein Pattern |
| „**Schmerzfrei in 7 Tagen** – garantiert" | ✅ Match | doppelt: Zeit-Schema + `\bgarantiert\b` |
| „Wir **versprechen**: Sie spüren den Unterschied" | ✅ Match | `\bverspricht\b`-Variante über `\bversprechen wir\b` (Treffer nur, wenn Caption „versprechen wir" enthält – Beispiel-Caption greift nicht; siehe Hinweis unten) |
| „Bei anhaltenden Beschwerden bitte ärztlich abklären" | ❌ | erlaubter Hinweis |
| „Hilft vielen unserer Patient:innen" | ❌ | weich formuliert |

**Hinweis:** Die Liste ist bewusst eng gefasst (Precision > Recall).
Lieber ein paar echte Heilversprechen filtern als jede zweite legitime
Caption blockieren. Wenn Judith im Geblockt-Status häufig „false positive"
sieht: Pattern entfernen. Wenn etwas durchrutscht und gepostet wird:
Pattern ergänzen.

---

## 3. Wartung

- **Erweitern:** Neues Regex in §1 ergänzen. WF-02 lädt die Datei beim
  nächsten Cron-Lauf automatisch (kein Workflow-Reload nötig).
- **Testen:** Vor jedem Push einer neuen Pattern: gegen letzte 20 Captions
  in `field_10` aller `Veröffentlicht`-Items in SharePoint laufen lassen.
  Wenn dort plötzlich Treffer wären → Pattern zu weit.
- **Versionierung:** Änderungen unten in der Änderungshistorie eintragen.

---

## 4. Implementierungs-Hinweis für WF-02

Code-Node Pseudo-Code:

```javascript
const blacklist = await loadBlacklistFromRepo(); // Patterns aus §1
const caption = $json.caption_text;
const matches = blacklist
  .map(re => ({ re, match: caption.match(re) }))
  .filter(x => x.match);

if (matches.length > 0) {
  return {
    status: 'Geblockt',
    hwg_matches: matches.map(m => m.match[0]),
    teams_alert: true,
  };
}
return { status: 'Bereit', hwg_matches: [] };
```

Treffer werden in `field_13` (Log) angehängt:
`2026-05-16 14:30 WF-02: HWG-Filter MATCH → "heilt" → Status Geblockt`

---

## Änderungshistorie

| Datum       | Änderung           | Wer    |
| ----------- | ------------------ | ------ |
| 2026-05-16  | Initial-Liste, 16 Patterns | Claude |
