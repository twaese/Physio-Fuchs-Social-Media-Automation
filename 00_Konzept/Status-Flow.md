# Status-Flow eines Posts

Der Status eines Eintrags in der SharePoint-Liste `PF-Content-Kalender-2026`
steuert den gesamten Workflow. Er wird im Feld `field_6` gespeichert.

---

## 1. Die fünf Status

```
Entwurf  ──►  Bereit  ──►  Freigegeben  ──►  Geplant  ──►  Veröffentlicht
```

| Status            | Wer setzt ihn          | Wann                                          |
| ----------------- | ---------------------- | --------------------------------------------- |
| **Entwurf**       | WF-01 (Webhook)        | Sofort nach Formular-Eingang                  |
| **Bereit**        | WF-03 (Phase A, n8n)   | Caption + Grafik fertig, wartet auf Judith    |
| **Freigegeben**   | Judith (manuell)       | Nach Sichtprüfung in Teams oder SharePoint    |
| **Geplant**       | WF-03 (Phase C, n8n)   | Sobald Post bei Meta eingeplant ist           |
| **Veröffentlicht**| WF-03 (Phase D, n8n)   | Nach erfolgreicher Veröffentlichung           |

`Bereit` ist der einzige Status, in dem ein Item aktiv auf eine
**menschliche** Aktion wartet.

---

## 2. Erlaubte Übergänge

| Von             | Nach              | Trigger                                  |
| --------------- | ----------------- | ---------------------------------------- |
| –               | Entwurf           | WF-01 (Formular-Submit)                  |
| Entwurf         | Bereit            | WF-03 Phase A (Caption + Grafik fertig)  |
| Bereit          | Freigegeben       | Judith klickt „Freigeben"                |
| Bereit          | Entwurf           | Judith klickt „Änderung wünschen" (Re-Loop) |
| Freigegeben     | Geplant           | WF-03 Phase C reicht bei Meta ein        |
| Freigegeben     | Bereit            | Manueller Rückzug zur Re-Prüfung         |
| Geplant         | Veröffentlicht    | Meta meldet Live-Status (WF-03 Phase D)  |
| Geplant         | Freigegeben       | Manueller Stopp vor Veröffentlichung     |
| Veröffentlicht  | (final)           | – kein automatischer Übergang            |

Nicht erlaubt:
- direkt von **Entwurf** auf **Freigegeben**, **Geplant** oder **Veröffentlicht**
- direkt von **Bereit** auf **Geplant** oder **Veröffentlicht**
- automatisches Setzen auf **Freigegeben** durch Claude oder n8n
  (nur Judith oder ein expliziter manueller Override durch Thomas) –
  **mit folgender Ausnahme: Auto-Release für Standard-Feed-Posts** (s. u.)

### 2a. Sonderregel: Auto-Release für Standard-Feed-Posts

Für monatlich automatisch eingeplante Standard-Feed-Posts (gesteuert
durch **WF-04**, siehe `02_n8n-Workflows/WF-04_Monats-Scheduler-Standard-Post.md`)
gilt eine bewusst lockerere Freigabe-Regel:

- WF-04 setzt beim Einplanen den Marker `[AUTO_RELEASE]` in `field_13`.
- WF-03 Phase B2 prüft beim Statuswechsel auf `Bereit`:
  - `field_2` ∈ `Standard`, `Tipp`, `Zitat`, `FAQ`, `Praxis-News`,
    `Aktion`, `Mitarbeiter:in`, `Behind-the-Scenes`, `Team`, `Promo`
  - UND `field_13` enthält `[AUTO_RELEASE]`
  - UND `REQUIRE_APPROVAL_FOR_STANDARD == false` (Default)
  - → Status direkt auf `Freigegeben`, ohne Teams-Card.
- **Reels, Stories und `Übung` sind ausgenommen** – sie
  durchlaufen immer die manuelle Freigabe durch Judith.

**Optional-Schalter:**
- `REQUIRE_APPROVAL_FOR_STANDARD = true` in der WF-04-Sticky-Note →
  auch Standard-Posts brauchen wieder Judiths Freigabe.
- Pro Eintrag deaktivierbar: Judith schreibt `[NEEDS_APPROVAL]` in
  `field_3` (Notizen) – WF-04 setzt dann den `[AUTO_RELEASE]`-Marker
  nicht.

Warum diese Sonderregel? Standard-Feed-Posts (Tipps, FAQs, BTS) sind
inhaltlich vergleichsweise risikoarm. Judith hat den Pool bereits
manuell vor-kuratiert. Der zusätzliche Freigabe-Schritt würde nur
Verzögerung ohne nennenswerten Sicherheitsgewinn bringen. Sensible
Themen (Aktionen mit Preisen, Personal, medizinische Aussagen) können
via `[NEEDS_APPROVAL]`-Marker weiterhin manuell freigegeben werden.

---

## 3. Verantwortlichkeiten

| Status            | Verantwortlich für nächsten Schritt          |
| ----------------- | -------------------------------------------- |
| Entwurf           | n8n (Caption WF-02 + Grafik WF-03 Phase A)   |
| **Bereit**        | **Judith** (Freigabe via Teams-Card oder SP) |
| Freigegeben       | n8n (Posting-Planung WF-03 Phase C)          |
| Geplant           | Meta API                                     |
| Veröffentlicht    | n8n (Logging + Reporting WF-03 Phase D)      |

---

## 4. Zusatzfelder, die mit dem Status wandern

| Feld       | Bedeutung                                  | Wird gefüllt in     |
| ---------- | ------------------------------------------ | ------------------- |
| `field_9`  | Canva-Design-URL / Vorschau                | WF-03 Phase A → Bereit |
| `field_10` | Caption-Text                               | WF-02               |
| `field_7`  | Hashtag-Block                              | WF-02               |
| `field_12` | Meta Media-/Container-/Post-ID             | WF-03 Phase C/D     |
| `field_13` | Kommentare (Judith / Claude)               | jederzeit           |

---

## 5. Visualisierung in SharePoint

Empfohlene Ansicht in SharePoint:
- Gruppierung nach `field_6` (Status)
- Sortierung nach `field_4` (Datum)
- farbige Spalten-Formatierung:
  - Entwurf → grau
  - **Bereit → gelb** (visuell auffällig, „Judith bitte freigeben")
  - Freigegeben → blau
  - Geplant → orange
  - Veröffentlicht → grün

Empfohlene benannte Ansichten:
- **„Wartet auf mich"** – Filter `field_6 = Bereit`, Sortierung nach Datum.
  Diese Ansicht ist Judiths tägliche To-do-Liste.

---

## 6. Was Claude beim Status beachten muss

- **Niemals** Status auf `Freigegeben`, `Geplant` oder `Veröffentlicht` setzen –
  außer im klar definierten Auto-Release-Pfad (Abschnitt 2a), und auch dort
  nur durch **WF-03 Phase B2**, nicht durch Claude direkt.
- `Entwurf → Bereit` darf der Workflow setzen, sobald **alle** Pflicht-Felder
  fertig sind: `field_7` (Hashtags), `field_9` (Vorschau), `field_10` (Caption).
  Vor dieser Vollständigkeit kein Statuswechsel.
- Bei Re-Generierung einer Caption/Grafik: alten Inhalt nicht überschreiben,
  sondern als Version speichern (z. B. `field_10_v2` oder im Kommentarfeld).
- Statusänderungen werden immer mit Zeitstempel und Akteur in `field_13`
  protokolliert (Format: `YYYY-MM-DD HH:MM Akteur: Aktion`).

---

## Änderungshistorie

| Datum       | Änderung                                                  | Wer    |
| ----------- | --------------------------------------------------------- | ------ |
| 2026-05-14  | Sonderregel Auto-Release für Standard-Feed-Posts ergänzt  | Claude |
