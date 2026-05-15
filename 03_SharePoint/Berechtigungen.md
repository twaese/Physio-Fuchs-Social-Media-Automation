# SharePoint-Berechtigungen

Stand: 2026-05-14

---

## Rollenmodell

| Rolle              | Personen / Konten                | Rechte auf Liste            |
| ------------------ | -------------------------------- | --------------------------- |
| **Owner**          | Judith Fuchs, Thomas Waese       | Vollzugriff                 |
| **Editor**         | (perspektivisch: Praxisteam)     | Lesen + Bearbeiten          |
| **n8n Service**    | Application-Registration in Entra| Lesen + Schreiben + Anlegen |
| **Reader**         | Mitarbeiter:innen, die nur sehen | nur Lesen                   |

---

## Service-Account / App-Registration

n8n verwendet eine eigene Microsoft-Entra-App-Registrierung mit:

- Application Permission: `Sites.Selected`
  (engster Scope, nur diese Site darf bearbeitet werden)
- Site-spezifische Berechtigung: `write`
- Client-Secret im n8n-Credential `PF Microsoft SharePoint`

**Niemals** Delegated-Permissions mit Judiths persönlichem Account –
sonst läuft alles unter ihr und sperrt sich bei MFA-Refreshs aus.

---

## Schreibschutz für sensible Felder

Empfehlung: Folgende Felder **nicht** durch normale Editoren ändern lassen
(über SharePoint-Berechtigungen oder eine Power-Automate-Validierung):

- `Title`, `field_1` – ID-Brücke
- `field_6` (Status) – nur durch Workflows oder explizite Freigabe
- `field_12` (Meta Post-ID) – nur durch n8n

---

## Audit / Logging

- Versionierung der Liste **aktiv** (mind. 50 Versionen).
- Aktivitätsprotokoll in M365 (Audit Log) eingeschaltet.
- Bei Änderungen am Status-Feld schreibt n8n einen Log-Eintrag in `field_13`.

---

## Backup

- `PF-Content-Kalender-2026.xlsx` (im Root) ist ein Wochen-Snapshot.
  Aktualisierung manuell oder per WF-04 (Roadmap).
- Microsoft 365-Recycle-Bin reicht für versehentliches Löschen
  (93 Tage Aufbewahrung).
