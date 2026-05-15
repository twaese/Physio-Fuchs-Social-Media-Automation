# Canva-Vorlagen – Übersicht

Liste aller Canva-Templates, die in WF-03 angesprochen werden.
Echte Template-IDs werden ausschließlich im n8n-Credential / in einer
zentralen Konfiguration gepflegt – hier stehen nur Platzhalter.

---

## Template-Liste

| Code                        | Format          | Maße           | Zweck                                  | Canva Template ID Platzhalter      |
| --------------------------- | --------------- | -------------- | -------------------------------------- | ---------------------------------- |
| `PF_Feed_Standard`          | Instagram-Feed  | 1080×1350      | generischer Tipp / FAQ / News          | `{{CANVA_TPL_FEED_STANDARD}}`      |
| `PF_Feed_Uebung`            | Instagram-Feed  | 1080×1350      | „Übung der Woche"                      | `{{CANVA_TPL_FEED_UEBUNG}}`        |
| `PF_Feed_Mythos`            | Instagram-Feed  | 1080×1350      | „Mythos vs. Fakt"                      | `{{CANVA_TPL_FEED_MYTHOS}}`        |
| `PF_Story_Standard`         | Story           | 1080×1920      | klassische Story-Slides                | `{{CANVA_TPL_STORY_STANDARD}}`     |
| `PF_Story_Tipp`             | Story           | 1080×1920      | Tipp-Reihe (3–5 Slides)                | `{{CANVA_TPL_STORY_TIPP}}`         |
| `PF_Reel_Cover`             | Reel-Cover      | 1080×1920      | Standbild für Reel-Cover               | `{{CANVA_TPL_REEL_COVER}}`         |
| `PF_Highlight_Cover`        | Highlight-Cover | 1080×1920      | Highlight-Bubble (siehe Symbole-Ordner)| – nicht über Workflow              |
| `PF_Mitarbeiter_Vorstellung`| Feed            | 1080×1350      | „Wir stellen vor: …"                   | `{{CANVA_TPL_FEED_TEAM}}`          |
| `PF_Praxis_News`            | Feed            | 1080×1350      | Öffnungszeiten / Urlaub / Aktion       | `{{CANVA_TPL_FEED_NEWS}}`          |

Die im Repo bereits vorhandenen Highlight-Cover (`Symbole-Instagramm/`)
werden manuell hochgeladen und brauchen kein Template.

---

## Template-Platzhalter (in Canva-Designs)

In jedem Template gibt es Text- und Bild-Platzhalter mit festen Namen,
damit n8n via Canva Connect API gezielt befüllen kann:

| Platzhalter-Name | Inhalt                              | Vorkommen in           |
| ---------------- | ----------------------------------- | ---------------------- |
| `{{HEADLINE}}`   | Hook (max. 60 Zeichen)              | alle Feed-Templates    |
| `{{SUBLINE}}`    | Untertitel / Erklärsatz             | Feed                   |
| `{{BODY}}`       | Lange Textzeile / Schritte          | `PF_Feed_Uebung`       |
| `{{CTA}}`        | Call-to-Action                      | Feed + Story           |
| `{{DATUM}}`      | Datum (TT.MM.JJJJ)                  | Feed (klein)           |
| `{{LOGO}}`       | Logo-Bild (Brand Kit)               | überall                |
| `{{AVATAR}}`     | Bild Judith / Praxis                | Feed                   |
| `{{ICON_*}}`     | Symbole für Übungsschritte          | `PF_Feed_Uebung`       |

Der Code-Node in WF-03 ersetzt vor dem API-Call diese Platzhalter mit
den Werten aus dem SharePoint-Item.

---

## Brand Kit

Das Canva Brand Kit (`{{CANVA_BRAND_KIT_ID}}`) enthält:
- Logo (mehrere Varianten)
- Farbpalette
- Schriften (Headline + Body)
- Wiederkehrende Grafik-Elemente (z. B. abgerundete Cards)

Alle Templates nutzen Brand-Kit-Bindings. Wenn Judith dort eine Farbe
ändert, schlägt das automatisch in alle Templates durch.

---

## Anlage neuer Templates

1. Judith oder Thomas baut ein Template in Canva (Größe gemäß Tabelle).
2. Platzhalter mit `{{NAME}}` benennen (genau diese Schreibweise).
3. Template in den Brand-Ordner „PF Workflow" verschieben.
4. Template-ID aus der URL kopieren und in der n8n-Konfiguration
   `CANVA_TEMPLATES` hinterlegen (nicht hier!).
5. Eintrag in der obigen Tabelle ergänzen.

---

## Was nicht in dieses Verzeichnis gehört

- echte Canva-Template-IDs (gehören in n8n-Konfiguration / .env)
- Canva API-Keys (Credential-Store)
- Originalgrafiken oder Quelldateien (`.canva`-Exports → eigener
  OneDrive-Ordner)
