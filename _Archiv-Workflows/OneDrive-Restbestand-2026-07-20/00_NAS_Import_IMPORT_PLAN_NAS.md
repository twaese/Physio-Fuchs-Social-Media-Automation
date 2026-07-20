# Importplan NAS SocialMedia

Quelle:
`/Volumes/Physio_Fuchs/SocialMedia`

Ziel:
`Content_Socialmedia/00_NAS_Import/SocialMedia`

Stand:
2026-06-12

Importstatus:
abgeschlossen

## Ergebnis Trockenlauf

Der NAS-Ordner ist erreichbar und umfasst ca. 205 MB.

Der rsync-Trockenlauf wuerde 191 Eintraege pruefen. Nach den gesetzten Ausschluessen ergibt sich fuer den geplanten Import eine Nutzdatenmenge von ca. 36 MB.

## Bewusst ausgeschlossen

- `.git/`
- `.claude/`
- `99_Platzhalter-Secrets/`
- `.DS_Store`
- `04_Canva-Vorlagen/SP-Praxis-Fotos`

## Hinweis zu SP-Praxis-Fotos

`04_Canva-Vorlagen/SP-Praxis-Fotos` ist kein normaler Ordner, sondern ein Symlink auf:

`/Users/twaese/Library/CloudStorage/OneDrive2-PhysioFuchs/Physio Fuchs Administration - Socialmedia/Content_Socialmedia/Fotos`

Diesen Link sollte man nicht blind in den neuen OneDrive-Arbeitsbereich uebernehmen. Besser ist spaeter eine bewusste Entscheidung:

1. Fotos als echten Ordner in den aktuellen OneDrive-Arbeitsbereich uebernehmen.
2. Oder den bestehenden OneDrive-Ort als offiziellen Foto-Pool dokumentieren.
3. Oder den Symlink nach dem Umzug neu und korrekt setzen.

## Empfohlener Importbefehl

```bash
rsync -avh \
  --exclude '.git/' \
  --exclude '.claude/' \
  --exclude '99_Platzhalter-Secrets/' \
  --exclude '.DS_Store' \
  --exclude '04_Canva-Vorlagen/SP-Praxis-Fotos' \
  /Volumes/Physio_Fuchs/SocialMedia/ \
  Content_Socialmedia/00_NAS_Import/SocialMedia/
```

## Durchgefuehrter Import

Der Import wurde am 2026-06-12 ausgefuehrt.

Ergebnis der Nachkontrolle:

- Zielordner: `Content_Socialmedia/00_NAS_Import/SocialMedia`
- Groesse: ca. 36 MB
- Dateien: 160
- Ausgeschlossene Bereiche wurden im Ziel nicht gefunden.

## Naechster Schritt

Die importierten Inhalte koennen nun gesichtet und anschliessend in die dauerhafte OneDrive-Struktur ueberfuehrt werden. Der Sonderfall `SP-Praxis-Fotos` sollte separat entschieden werden.
