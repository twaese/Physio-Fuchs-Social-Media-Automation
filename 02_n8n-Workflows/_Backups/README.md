# n8n-Backups

Snapshots der n8n-Workflow-JSONs **vor** jedem schreibenden Eingriff.
Dient als Rollback-Punkt, falls eine API-Änderung in n8n Probleme verursacht.

## Namensschema

```
PF_WF-<NN>_<version>_<YYYY-MM-DD>_<HHMM>_<eingriff>.json
```

Beispiele:
- `PF_WF-01_v4_2026-06-21_2105_pre-chain.json`
- `PF_WF-02_v18.3_2026-06-21_2105_pre-execTrigger.json`

## Rollback

```bash
# JSON aus _Backups via n8n REST API zurückspielen:
curl -X PUT "https://n8n.srv1099163.hstgr.cloud/api/v1/workflows/<workflowId>" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d @PF_WF-01_v4_2026-06-21_2105_pre-chain.json
```

Alternativ direkt in n8n UI: Workflow öffnen → ⋯-Menü → **Import from File**
→ Backup-JSON auswählen → **Save**.

## Wichtig

- Backups enthalten **keine Tokens** (n8n speichert Secrets im Credential-Store,
  nicht im Workflow-JSON). Sicher zu committen.
- Aber: Credential-IDs (UUIDs) sind instanzspezifisch — ein Backup aus dieser
  n8n-Instanz lässt sich nicht 1:1 in eine andere n8n importieren ohne
  Credential-Remapping.

## Eingriffshistorie

| Datum/Uhrzeit       | Workflow         | Eingriff                                                                 | Backup-Datei |
| ------------------- | ---------------- | ------------------------------------------------------------------------ | ------------ |
| 2026-06-21 21:05    | WF-01 v4         | Execute-Workflow-Node nach „Teams: Eingang melden" → ruft WF-02 direkt auf | `PF_WF-01_v4_2026-06-21_2105_pre-chain.json` |
| 2026-06-21 21:05    | WF-02 v18.3      | Execute-Workflow-Trigger als zweiter Eingang (parallel zum Cron)         | `PF_WF-02_v18.3_2026-06-21_2105_pre-execTrigger.json` |
