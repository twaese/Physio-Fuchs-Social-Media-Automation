# Teams-Benachrichtigungen Socialmedia

Stand: 2026-06-13

## Ziel

Teams-Benachrichtigungen informieren Judith und Thomas im Kanal `Socialmedia`, ohne Freigaben oder Postings automatisch auszulösen.

Empfohlener Kanal:

```text
Team: Physio Fuchs Administration
Kanal: Socialmedia
```

## WF-01: Eingang melden

Knoten:

```text
Teams: Eingang melden
```

Auslöser:

```text
Neue Formular-Einreichung wurde in SharePoint angelegt.
```

Inhalt:

- Item-ID
- Thema
- Post-Typ
- Status
- Materialtyp
- Foto-/Video-Dateiname
- Hinweis, ob Foto- oder Video-Workflow weiterläuft

Zweck:

Judith/Thomas sehen direkt, dass ein Beitrag eingegangen ist.

## WF-05: Reel-Texte fertig

Knoten:

```text
Teams: Reel-Texte fertig melden
```

Auslöser:

```text
WF-05 hat Caption, CTA und Hashtags erzeugt und SharePoint aktualisiert.
```

Inhalt:

- SharePoint Item-ID
- Status `KI-Texte fertig`
- Hinweis: Canva-Bearbeitung kann starten
- Hinweis auf Judiths Ablageordner:

```text
Content_Socialmedia/Reels_Stories/00_Canva_Exports_von_Judith/
```

Zweck:

Judith kann optional selbst in Canva bearbeiten. Thomas weiß, dass der technische Folgeprozess vorbereitet werden kann.

## WF-06: Reel veröffentlicht

Knoten:

```text
Teams: Reel veroeffentlicht melden
```

Auslöser:

```text
WF-06 hat Meta-Posting abgeschlossen und SharePoint auf Veröffentlicht gesetzt.
```

Inhalt:

- SharePoint Item-ID
- Instagram Post-ID
- Facebook Video-ID
- Hinweis: SharePoint wurde aktualisiert

Zweck:

Der Kanal bekommt eine Abschlussmeldung nach erfolgreichem Posting.

## Was bewusst nicht gepostet wird

WF-06 Preflight-Blocker werden nicht automatisch in Teams gepostet.

Grund:

Der Schedule kann regelmäßig laufen. Automatische Fehler-/Debug-Posts würden den Kanal unnötig füllen.

Preflight-Details bleiben im n8n-Knoten:

```text
Filter: Reel freigegeben + Preflight
```

## Hinweis zum Import

Nach Import oder Re-Import der JSONs in n8n bei jedem Teams-Knoten prüfen:

```text
Credential: PF Microsoft Teams account
Team: Physio Fuchs Administration
Kanal: Socialmedia
Inhaltstyp: HTML
```
