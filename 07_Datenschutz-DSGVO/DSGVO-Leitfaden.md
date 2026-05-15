# DSGVO-Leitfaden – Physio Fuchs Social Media

Stand: 2026-05-14

Dieser Leitfaden ist eine **interne Arbeitshilfe** und ersetzt keine
juristische Beratung. Bei Unsicherheiten Rücksprache mit dem
Datenschutzbeauftragten der Praxis.

---

## 1. Grundsätze

1. **Datensparsamkeit** – wir verwenden nur Daten, die wir wirklich brauchen.
2. **Transparenz** – wer in unseren Inhalten erkennbar ist, weiß das und
   hat schriftlich eingewilligt.
3. **Zweckbindung** – Daten aus der Patient:innenakte werden **niemals**
   für Marketing-Inhalte verwendet.
4. **Sicherheit** – Zugangsdaten, Tokens und Patient:innen-bezogene
   Informationen werden verschlüsselt aufbewahrt und niemals in
   Repos / Markdown / Workflows gespeichert.

---

## 2. Was darf veröffentlicht werden?

| Kategorie                                       | OK?    | Bedingung                              |
| ----------------------------------------------- | ------ | -------------------------------------- |
| Allgemeine Übungsanleitungen                    | ja     | mit Vorsichts-Hinweis                  |
| Räume, Geräte, Außenansicht der Praxis          | ja     | keine Patient:innen erkennbar          |
| Mitarbeiter:innen mit Bild                      | ja     | schriftliche Einwilligung vorliegend   |
| Mitarbeiter:innen mit Name                      | ja     | schriftliche Einwilligung vorliegend   |
| Hände am Behandlungstisch                       | ja     | wenn Person nicht identifizierbar      |
| Patient:innen-Portrait                          | nein   | außer mit ausdrücklicher Einwilligung  |
| Patient:innen-Geschichten / „Erfolgsstorys"     | nein   | außer in anonymisierter Form **und** Einwilligung |
| Vorher/Nachher-Bilder                           | sehr restriktiv | nur mit Einwilligung + HWG-Check |
| KI-generierte Avatar-Inhalte (Judith)           | ja     | Einwilligung Judith + Kennzeichnung    |
| KI-generierte Avatar-Inhalte Dritter            | nein   | grundsätzlich nicht                    |
| Screenshots aus Praxis-Software                 | nein   | enthält praktisch immer pers. Daten    |

---

## 3. Einwilligungen

### 3.1 Mitarbeiter:innen
Vor jedem Bild / Reel mit erkennbarer Person:
- Vorlage in `Einverstaendniserklaerungen.md`
- unterschrieben aufbewahren (digital + gegengezeichnet ok)
- jederzeit widerrufbar – widerrufene Inhalte zeitnah von SM nehmen

### 3.2 Avatar-Nutzung Judith
- separate Einwilligungserklärung (siehe Vorlage)
- Beschreibt: Tool, Zweck, Speicherdauer, Voice-Clone-Nutzung
- Widerruf jederzeit möglich → Avatar wird deaktiviert

### 3.3 Patient:innen
- nur in absoluten Ausnahmefällen
- schriftlich, mit klarem Widerrufshinweis
- keine medizinischen Details ohne Einzelfreigabe

---

## 4. Drittanbieter / Auftragsverarbeitung

Für jeden externen Dienst, der personenbezogene Daten verarbeiten könnte,
muss ein **AVV (Auftragsverarbeitungsvertrag)** vorliegen:

| Anbieter             | Zweck                       | AVV nötig | Status      |
| -------------------- | --------------------------- | --------- | ----------- |
| Microsoft 365        | SharePoint, Teams, Mail     | ja        | (vorhanden) |
| Meta (Facebook/IG)   | Posting, Insights           | ja, MGS   | siehe Meta  |
| Canva                | Grafik-Generierung          | ja        | prüfen      |
| HeyGen / Synthesia   | Avatar-Erstellung           | ja        | prüfen      |
| Anthropic / OpenAI   | Caption-Generierung         | ja        | prüfen      |
| n8n (self-hosted)    | Automatisierung             | je nach Hosting | klären |

Verträge / Bestätigungen werden in einem separaten Praxis-Ordner
außerhalb dieses Repos abgelegt. Hier nur Verweise / Status.

---

## 5. Konkrete Regeln für Claude / n8n

- **Niemals** Patient:innen-Daten in Prompts oder Logs schreiben.
- **Nicht** echte Krankenakten, Termine oder DM-Nachrichten als
  Trainings- oder Beispielmaterial verwenden.
- **Nicht** SharePoint-Listen außerhalb von `PF-Content-Kalender-2026`
  ohne Rücksprache durchsuchen oder verarbeiten.
- Wenn ein Inhalt zufällig Patient:innen-Bezug enthält
  (z. B. „Frau Müller hat gefragt …"), → sofort markieren, nicht
  weiterverarbeiten, Hinweis an Thomas.
- Logs in n8n: keine personenbezogenen Inhalte loggen
  (Nachrichten-Body kürzen oder maskieren, falls jemand Patient:innen
  in den Brief schreibt).

---

## 6. Speicher- und Löschfristen

| Inhalt                              | Aufbewahrung                | Verantwortlich  |
| ----------------------------------- | --------------------------- | --------------- |
| SP-Items „Veröffentlicht"           | 24 Monate, dann archivieren | Praxis          |
| Canva-Designs                       | unbegrenzt (Marken-Asset)   | Judith          |
| Avatar-Trainingsvideos              | so lange Avatar im Einsatz  | Thomas          |
| Voice-Clone-Audio                   | so lange Avatar im Einsatz  | Thomas          |
| Einwilligungen                      | 3 Jahre nach Widerruf       | Praxis          |
| Workflow-Logs in n8n                | 30 Tage                     | Thomas          |
| Webhook-Payloads                    | 14 Tage, dann anonymisiert  | n8n-Konfig      |

---

## 7. Datenschutz-Hinweis im Praxis-Impressum

Die folgenden Punkte sollten im Web-Impressum / der Datenschutzerklärung
auftauchen (Hinweis an Web-Anbieter, **kein** Auto-Update durch Claude):

- Nutzung von Instagram / Facebook (Meta-Datenschutz)
- Nutzung von KI für Content-Erstellung (allgemein)
- Hinweis auf KI-generierten Avatar
- Kontaktmöglichkeit für Widerruf

---

## 8. Krisenfall

Wenn versehentlich personenbezogene Daten gepostet wurden:
1. Beitrag sofort entfernen.
2. Vorfall in Teams an Judith und Thomas melden.
3. Datenschutzbeauftragten der Praxis informieren.
4. Vorfall protokollieren (intern, nicht öffentlich).
5. Wenn Drittpersonen betroffen → ggf. Meldepflicht prüfen
   (72 h nach Kenntnis an Aufsichtsbehörde).
