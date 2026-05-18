# Status-Flow eines Posts

Der Status eines Eintrags in der SharePoint-Liste `PF-Content-Kalender-2026`
steuert den gesamten Workflow. Er wird im Feld `field_6` gespeichert.

**Grundprinzip ab v2:** Vollautomatik. Judith macht ausschließlich Einträge
über das HTML-Formular. Alle weiteren Schritte (Caption, Bild, Planung,
Posting) laufen ohne manuelle Freigabe — abgesichert durch HWG-Filter und
24-Stunden-Karenz. Details siehe `CLAUDE.md §3`.

---

## 1. Die Status

```
Entwurf  ──►  Bereit  ──►  Geplant  ──►  Veröffentlicht
    │         └──►  Geblockt          (HWG-Filter-Match)
    └──►  Wartet-auf-Avatar           (Reel/Übung/Story, Avatar-Flag = off)
```

| Status                  | Wer setzt ihn          | Wann                                          |
| ----------------------- | ---------------------- | --------------------------------------------- |
| **Entwurf**             | WF-01 (Webhook)        | Sofort nach Formular-Eingang                  |
| **Wartet-auf-Avatar**   | WF-02 (n8n)            | Reel/Übung/Story, aber `AVATAR_ENABLED=false` |
| **Bereit**              | WF-02 (n8n)            | Caption + Bild/Video fertig, HWG-Filter sauber|
| **Geblockt**            | WF-02 (n8n)            | HWG-Filter hat verdächtige Caption erkannt    |
| **Geplant**             | WF-03 (n8n)            | Posting-Slot bei Meta eingereicht             |
| **Veröffentlicht**      | WF-03 (n8n)            | Meta hat erfolgreich live geschaltet          |

`Geblockt` ist der einzige Status, in dem ein Item aktiv auf eine
**menschliche** Aktion wartet (Judith prüft und entscheidet: Re-Generieren oder freigeben).

---

## 2. Erlaubte Übergänge

| Von             | Nach              | Trigger                                  |
| --------------- | ----------------- | ---------------------------------------- |
| –               | Entwurf           | WF-01 (Formular-Submit)                  |
| Entwurf         | Bereit            | WF-02 (Caption + Bild/Video fertig, HWG-Filter sauber) |
| Entwurf         | Geblockt          | WF-02 (HWG-Filter-Match)                 |
| Entwurf         | Wartet-auf-Avatar | WF-02 (Reel/Übung/Story, Avatar-Flag aus) |
| Wartet-auf-Avatar | Entwurf         | WF-02 nach Avatar-Flag-Flip (Re-Loop)    |
| Geblockt        | Bereit            | Judith setzt manuell zurück (nach Sichtprüfung) |
| Geblockt        | Entwurf           | Judith fordert Re-Generierung an         |
| Bereit          | Geplant           | WF-03 reicht Post bei Meta ein (frühestens 24h nach Erreichen von `Bereit`) |
| Bereit          | Entwurf           | Judith setzt zurück (24h-Karenz-Notbremse) |
| Geplant         | Veröffentlicht    | Meta meldet Live-Status                  |
| Geplant         | Bereit            | Manueller Stopp vor Veröffentlichung     |
| Veröffentlicht  | (final)           | – kein automatischer Übergang            |

Nicht erlaubt:
- direkt von **Entwurf** auf **Geplant** oder **Veröffentlicht** (Karenz wird umgangen)
- Posting eines Items im Status **Geblockt**

---

## 3. Die zwei Notbremsen

### 3.1 Notbremse 1: HWG-Filter (WF-02)

Code-Node in WF-02 prüft die generierte Caption gegen eine Blacklist
regulärer Ausdrücke:

```
heilt, kuriert, garantiert, beseitigt, verspricht, gewährleistet,
schmerzfrei in (X|\d+) (Tagen|Wochen), wirkt (100|sicher),
Diagnose, behandelt erfolgreich
```

Match → Status `Geblockt`, Teams-Card an Judith mit Caption-Auszug und
Treffer. Kein Posting bis Judith eingreift.

Die Wortliste lebt zentral in `01_Prompts/HWG-Blacklist.md` und kann
ohne Workflow-Änderung erweitert werden.

### 3.2 Notbremse 2: 24-Stunden-Karenz (WF-03)

WF-03 prüft beim Aufgreifen eines `Bereit`-Items: Wann wurde der Status
gesetzt? Wenn weniger als 24 Stunden her → skip, später erneut versuchen
(Cron läuft stündlich).

Damit hat Judith **24 Stunden Zeit**, in der SharePoint-Ansicht
„Geht morgen live" einen Post zurück auf `Entwurf` zu setzen, falls
ihr etwas auffällt. Im Normalfall macht sie nichts.

Karenz ist konfigurierbar: Sticky-Note `CARENCE_HOURS = 24` in WF-03.
Für besonders unkritische Typen (z. B. `Behind-the-Scenes`) kann sie
auf 4 h reduziert werden — pro Typ in Sticky-Note konfigurierbar.

---

## 4. Verantwortlichkeiten

| Status            | Verantwortlich für nächsten Schritt          |
| ----------------- | -------------------------------------------- |
| Entwurf           | n8n (WF-02: Caption + Bild/Video + HWG-Check)|
| Wartet-auf-Avatar | parkt, bis `AVATAR_ENABLED=true` gesetzt wird |
| Bereit            | n8n (WF-03: Karenz-Wartung + Posting)        |
| **Geblockt**      | **Judith** (Sichtprüfung, Re-Generieren oder Freigabe) |
| Geplant           | Meta API                                     |
| Veröffentlicht    | n8n (Logging in `field_13`)                  |

---

## 5. Zusatzfelder, die mit dem Status wandern

| Feld       | Bedeutung                                  | Wird gefüllt in     |
| ---------- | ------------------------------------------ | ------------------- |
| `field_9`  | Bild-URL (Vorschau, Gotenberg-Output)      | WF-02               |
| `field_10` | Caption-Text                               | WF-02               |
| `field_7`  | Hashtag-Block                              | WF-02               |
| `field_12` | Meta Media-/Container-/Post-ID             | WF-03               |
| `field_13` | Log + Kommentare + HWG-Match-Detail        | jederzeit           |

---

## 6. Visualisierung in SharePoint

Empfohlene Ansicht:
- Gruppierung nach `field_6` (Status)
- Sortierung nach `field_4` (Datum)
- farbige Spalten-Formatierung:
  - Entwurf → grau
  - Wartet-auf-Avatar → hellgrau (geparkt)
  - Bereit → blau
  - **Geblockt → rot** (visuell auffällig, „Judith bitte prüfen")
  - Geplant → orange
  - Veröffentlicht → grün

Empfohlene benannte Ansichten:
- **„Geht morgen live"** – Filter `field_6 = Bereit`, Sortierung nach
  Datum. Judiths optionale Karenz-Übersicht.
- **„Wartet auf mich"** – Filter `field_6 = Geblockt`. Nur befüllt,
  wenn HWG-Filter zugeschlagen hat.

---

## 7. Was Claude beim Status beachten muss

- **Niemals** Status manuell auf `Geplant` oder `Veröffentlicht` setzen –
  das macht WF-03 nach erfolgreicher Meta-API-Antwort.
- `Entwurf → Bereit` setzt WF-02 erst, wenn **alle** Pflicht-Felder fertig
  sind: `field_7` (Hashtags), `field_9` (Bild), `field_10` (Caption) UND
  HWG-Filter grün.
- Bei Re-Generierung einer Caption/Grafik: alten Inhalt nicht überschreiben,
  sondern als Version speichern (z. B. `field_10_v2`).
- Statusänderungen werden immer mit Zeitstempel und Akteur in `field_13`
  protokolliert (Format: `YYYY-MM-DD HH:MM Akteur: Aktion`).

---

## Änderungshistorie

| Datum       | Änderung                                                       | Wer    |
| ----------- | -------------------------------------------------------------- | ------ |
| 2026-05-14  | Sonderregel Auto-Release für Standard-Feed-Posts ergänzt       | Claude |
| 2026-05-16  | v2: Vollautomatik für alle Typen, Status `Bereit` als Karenz-  | Claude |
|             | Puffer, Status `Freigegeben` entfernt, neuer Status `Geblockt`,|        |
|             | HWG-Filter + 24h-Karenz als Notbremsen                         |        |
| 2026-05-16  | Status `Wartet-auf-Avatar` ergänzt — Reels/Übungen/Stories     | Claude |
|             | parken, bis `AVATAR_ENABLED`-Flag in WF-02 auf true steht      |        |
