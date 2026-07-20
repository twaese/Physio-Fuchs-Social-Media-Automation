# n8n-Exporte — Stand 2026-07-20

Frische Exporte **aller** Physio-Fuchs-Workflows, direkt aus der laufenden
n8n-Instanz über die REST-API gezogen. Damit existiert erstmals ein
vollständiges, aktuelles Backup — vorher fehlten WF-05 und WF-06 komplett.

---

## Inhalt

| Datei | Nodes | in n8n aktiv | zuletzt in n8n geändert |
| --- | --- | --- | --- |
| `PF_WF-00_Datum_Initialbefuellung.json` | 6 | nein | 2026-05-17 |
| `PF_WF-01_v4_Foto_Video_Upload.json` | 17 | **ja** | 2026-06-21 |
| `PF_WF-02_Caption_Generator_v18.3.json` | 39 | **ja** | 2026-06-21 |
| `PF_WF-03_Social_Media_Post_v7.1.json` | 12 | **ja** | 2026-07-13 |
| `PF_WF-04_Monats_Scheduler.json` | 11 | nein | 2026-05-17 |
| `PF_WF-05_Reel_Caption_Generator.json` | 14 | **ja** | 2026-06-13 |
| `PF_WF-06_Reel_Posting.json` | 14 | nein | 2026-06-14 |
| `PF_WF-08_Canva_OAuth_v2.json` | 16 | **ja** | 2026-05-17 |

---

## Was in den Dateien steht

Reduziert auf das, was für einen Import nötig ist: `name`, `nodes`,
`connections`, `settings`, `staticData`. Entfernt wurden Instanz-Metadaten
wie `id`, `versionId`, `shared`, `tags` und Nutzerangaben — die sind beim
Wiederherstellen wertlos und würden nur Rauschen erzeugen.

**Keine Geheimnisse enthalten.** Credentials stehen ausschließlich als
Referenz (`id` + `name`) drin, nicht deren Inhalt — geprüft. API-Keys
liegen im n8n Credential-Store und werden über `$env`-Variablen gelesen.

---

## Wiederherstellen

Über die n8n-Oberfläche: Workflow öffnen → ⋯-Menü → **Import from File**.

Oder per API:

```bash
curl -X PUT "$N8N_API_URL/api/v1/workflows/<workflowId>" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d @PF_WF-05_Reel_Caption_Generator.json
```

Nach dem Import prüfen, ob die Credentials korrekt zugeordnet sind — die
IDs müssen in der Zielinstanz existieren.

---

## Verhältnis zu den anderen JSONs im Repo

Im Ordner darüber (`02_n8n-Workflows/`) und im Wurzelverzeichnis liegen
weiterhin ältere, teils handgepflegte Stände. Diese hier sind die
**maßgeblichen Backups**; die anderen sind historische Snapshots.

`_Backups/` enthält weiterhin die Pre-Eingriff-Snapshots, die vor
schreibenden Änderungen angelegt werden — die haben einen anderen Zweck
und bleiben bestehen.

---

## Auffrischen

Die Exporte veralten mit jeder Änderung in n8n. Empfehlung: nach jedem
Eingriff an einem Workflow den betreffenden Export neu ziehen. Das Skript
dafür steht in der Änderungshistorie dieses Commits; Zugangsdaten kommen
aus der MCP-Konfiguration, nicht aus dem Repo.

---

## Änderungshistorie

| Datum | Was | Wer |
| --- | --- | --- |
| 2026-07-20 | Erstexport aller 8 Workflows direkt aus n8n | Claude / Thomas |
