# Template-Previews

Statische HTML-Kopien der aktiven Post-Templates mit **Dummy-Inhalten**, um
das Layout ohne Test-Post durch die volle n8n-Pipeline schicken zu müssen
anschauen zu können.

## Dateien

| Datei | Format | Zeigt |
|---|---|---|
| `preview_IG_neue_Farbe.html` | Instagram Feed 1080×1350 | Titel-Kachel in `#809B3D` (Brand-Grün) |
| `preview_FB_neue_Farbe.html` | Facebook Feed 1080×1080 | Titel-Kachel in `#809B3D` (Brand-Grün) |

## Öffnen

Doppelklick im Finder → öffnet im Standard-Browser. Assets (Ginkgo-Ast, Logo,
Hintergrundfoto) werden per absolute GitHub-URL geladen — funktioniert also
auch aus jedem Ordner heraus, benötigt aber Internet-Verbindung.

## Bezug zu den aktiven Templates

Quellen: `04_Canva-Vorlagen/html-templates/instagram/PF_Feed_v13.html`
und `.../facebook/PF_Feed_FB_v2.html`.

**Unterschied zu Live-Templates:** Diese Kopien haben die Platzhalter
`{{TITEL}}` und `{{BACKGROUND_PHOTO}}` mit Dummy-Werten ersetzt und die
relativen Asset-Pfade (`../assets/…`) in absolute GitHub-URLs umgeschrieben.
Bei Layout-Änderungen an den Live-Templates müssen diese Previews von Hand
nachgezogen werden.
