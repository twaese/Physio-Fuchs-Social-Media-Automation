# WF-02 – Caption-Generator

**JSON:** `PF_WF-02_Caption_Generator_v17.json` (Root, aktive Version)
Vorgänger: `PF_WF-02_Caption_Generator_v16.json` (Backup, nicht löschen).

**Trigger:** Manueller Test-Trigger (Schedule kommt später)
**Status-Filter:** Items mit `field_6 = Entwurf`
**Status-Effekt:** WF-02 setzt selbst `field_6 = Freigegeben`, nachdem
- Judith eine Variante (1/2/3) in der Teams-Card gewählt hat, **oder**
- der **Auto-Release-Branch** (ab v17) greift: Marker `[AUTO_RELEASE]` im
  `field_13` UND Post-Typ ∉ {Übung, Reel, Story} → Variante 1 automatisch,
  kein Teams-Wait.

**Wichtig:** Der ursprünglich konzipierte Status `Bereit` existiert in
der echten Pipeline aktuell **nicht**. WF-02 springt direkt von `Entwurf`
auf `Freigegeben`. Die Doku-Stellen, die `Bereit` als Zwischenstop
beschreiben, sind als künftiger Zustand zu verstehen, sobald WF-03 eine
explizite Phase A bekommt.

---

## Zweck

Erzeugt für jeden offenen Entwurf:
1. Caption (`field_10`)
2. Hashtags (`field_7` – ergänzt das vom Formular eingegebene Thema)
3. Bildbrief + Alt-Text (in `field_13` als Notiz)

Der konkrete Prompt richtet sich nach dem `Post_Typ`:

| Post_Typ-Choice           | Prompt-Datei                          |
| ------------------------- | ------------------------------------- |
| `Übung`                   | `01_Prompts/Uebung-der-Woche.md` (Format „Übung der Woche") |
| `Story`                   | `01_Prompts/Story.md`                 |
| `Reel`                    | `01_Prompts/Reel-Skript.md`           |
| `Standard`, `Tipp`, `FAQ`,| `01_Prompts/Caption.md`               |
| `Praxis-News`, `Aktion`, `Behind-the-Scenes`, `Mitarbeiter:in`, `Team`, `Promo`, `Zitat` | `01_Prompts/Caption.md` |

Hashtag-Set wird in einem zweiten LLM-Call mit `01_Prompts/Hashtags.md` erzeugt.

---

## Ablauf

```
[1] Schedule Trigger (z. B. täglich 06:00)
        │
        ▼
[2] SharePoint: Items lesen
        Filter: field_6 = "Entwurf" AND field_10 IS NULL
        │
        ▼
[3] Loop "Per Item"
        │
        ├──► [3a] Code: Prompt-Variante wählen (Post-Typ)
        │
        ├──► [3b] LLM-Call (Anthropic / OpenAI)
        │           - System-Prompt aus 01_Prompts/<Variante>.md
        │           - User-Prompt mit Item-Feldern
        │
        ├──► [3c] Code: Output parsen + Qualitäts-Filter
        │           - Verbots-Wörter prüfen
        │           - Pflicht-Bausteine prüfen
        │           - bei Fail: Re-Prompt 1× mit Hinweis
        │
        ├──► [3d] LLM-Call: Hashtags erzeugen
        │           (Prompt aus 01_Prompts/Hashtags.md)
        │
        ├──► [3e] Code: Felder mappen
        │           - Caption  → field_10
        │           - Hashtags → field_7 (mergen mit field_7-Input)
        │           - Bildbrief + Alt-Text → field_13 (anhängen)
        │
        └──► [3f] SharePoint: Item update
        │
        ▼
[4] Teams: Sammelreport "X Captions erzeugt"
```

---

## Konfigurationspunkte

| Variable                  | Wert / Hinweis                                |
| ------------------------- | --------------------------------------------- |
| `LLM_PROVIDER`            | `anthropic` (Default) oder `openai`           |
| `LLM_MODEL`               | aktuelles Sonnet/Opus (Anthropic) bzw. GPT-4o |
| `LLM_MAX_TOKENS`          | 1500                                          |
| `LLM_TEMPERATURE`         | 0.6 (etwas Variation, aber kontrolliert)      |
| `MAX_RE_PROMPTS`          | 1                                             |
| `BLOCKED_WORDS`           | `["heilt","garantiert","100%","Wunder", …]`   |

---

## Qualitäts-Filter (Code-Node)

Reihenfolge der Checks:
1. Längen-Check (Caption ≤ 1500 Zeichen, Hashtags 8–15)
2. Pflichtbausteine (HOOK, CAPTION, ALT-TEXT)
3. Verbots-Wörter via Regex
4. Doppelte Hashtags raus
5. ALT-TEXT vorhanden

Bei Fail:
- Re-Prompt mit Begründung („Bitte überarbeiten: enthält Heilversprechen.")
- nach `MAX_RE_PROMPTS` ohne Erfolg → Item bleibt im Status `Entwurf`,
  Teams-Alert „Manuelle Überarbeitung nötig: <Thema>"

---

## Verwandte Dateien

- `01_Prompts/*.md`
- `00_Konzept/Tonalitaet-Markenrichtlinien.md`
- `03_SharePoint/Felder-Mapping.md`
