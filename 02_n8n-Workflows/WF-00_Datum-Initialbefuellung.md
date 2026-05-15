# WF-00 – Datum-Initialbefüllung

**JSON:** `PF_WF-00_Datum_Initialbefllung_v1.json` (Root)
**Status:** einmalig / bei Bedarf manuell ausführen
**Zweck:** Befüllt leere Datumsfelder (`field_4`) im SharePoint-Kalender
mit sinnvollen Default-Werten (z. B. „nächster Samstag"), damit kein
Item ohne Veröffentlichungsdatum hängenbleibt.

---

## Trigger

- **Manueller Trigger** in n8n – kein Schedule, kein Webhook.

## Ablauf

```
Manueller Trigger
    │
    ▼
SharePoint: Items lesen (Filter: field_4 leer ODER ungültig)
    │
    ▼
Code-Node: nächstes passendes Datum berechnen
            (Standard: nächster Samstag, 09:00)
    │
    ▼
SharePoint: Item updaten (field_4, ggf. field_5)
    │
    ▼
Teams: Bericht "X Items aktualisiert"
```

## Felder

| Feld     | Bedeutung    | Bei Leere wird gesetzt auf    |
| -------- | ------------ | ----------------------------- |
| `field_4`| Datum        | nächster Samstag (`TTMMJJJJ`) |
| `field_5`| Uhrzeit      | `09:00` (falls auch leer)     |

## Hinweise

- Wird **nicht automatisch** ausgeführt – Judith oder Thomas startet
  diesen Workflow gezielt nach Befüllung neuer Themen.
- Zur Sicherheit: Workflow listet vor dem Update alle betroffenen Items
  und schickt sie an Teams; nur bei Bestätigung läuft er weiter
  (alternativ Dry-Run-Schalter).
- Default „Samstag 09:00" stammt aus der aktuellen Posting-Strategie
  (1× pro Woche). Anpassbar über Variable `DEFAULT_DAY_OF_WEEK` und
  `DEFAULT_TIME` im Code-Node.

## Verwandte Dateien

- `03_SharePoint/Felder-Mapping.md`
- `05_Content-Planung/Redaktionsplan.md`
