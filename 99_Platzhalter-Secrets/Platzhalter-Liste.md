# Platzhalter-Liste

Vollständige Liste aller Platzhalter, die in diesem Repo verwendet werden.
**Echte** Werte gehören in den n8n Credential-Store, in eine lokale
`.env`-Datei außerhalb dieses Repos oder in Microsoft Entra –
**niemals** in dieses Verzeichnis.

---

## 1. Microsoft 365 / SharePoint

| Platzhalter                       | Was es ist                                 |
| --------------------------------- | ------------------------------------------ |
| `{{SHAREPOINT_TENANT}}`           | M365-Tenant (z. B. `physiofuchs889.onmicrosoft.com`) |
| `{{SHAREPOINT_SITE_URL}}`         | URL der SharePoint-Site                    |
| `{{SHAREPOINT_SITE_GUID}}`        | Site-GUID                                  |
| `{{SHAREPOINT_LIST_NAME}}`        | Listenname (`PF-Content-Kalender-2026`)    |
| `{{SHAREPOINT_LIST_GUID}}`        | List-GUID                                  |
| `{{ENTRA_TENANT_ID}}`             | Entra Tenant-ID für n8n-App                |
| `{{ENTRA_CLIENT_ID}}`             | App-Registration Client-ID                 |
| `{{ENTRA_CLIENT_SECRET}}`         | App-Registration Secret (nur Vault)        |

---

## 2. Microsoft Teams

| Platzhalter                       | Was es ist                                 |
| --------------------------------- | ------------------------------------------ |
| `{{TEAMS_TEAM_ID}}`               | Team-ID „Physio Fuchs Workflow"            |
| `{{TEAMS_FREIGABE_CHANNEL_ID}}`   | Channel für Freigabe-Cards                 |
| `{{TEAMS_ALERT_CHANNEL_ID}}`      | Channel für Fehler-Alerts                  |
| `{{TEAMS_WEBHOOK_URL}}`           | (optional) Incoming Webhook                |

---

## 3. n8n

| Platzhalter                       | Was es ist                                 |
| --------------------------------- | ------------------------------------------ |
| `{{N8N_BASE_URL}}`                | Basis-URL der n8n-Instanz                  |
| `{{N8N_WEBHOOK_URL}}`             | Webhook-Basis (`{{N8N_BASE_URL}}/webhook`) |
| `{{N8N_API_KEY}}`                 | n8n-API-Key (nur Vault)                    |

---

## 4. Meta (Instagram + Facebook)

| Platzhalter                          | Was es ist                              |
| ------------------------------------ | --------------------------------------- |
| `{{META_APP_ID}}`                    | Meta-App-ID (Business Suite)            |
| `{{META_APP_SECRET}}`                | App-Secret (nur Vault)                  |
| `{{META_ACCESS_TOKEN}}`              | Long-lived Access Token (nur Vault)     |
| `{{META_API_VERSION}}`               | z. B. `v19.0`                           |
| `{{INSTAGRAM_BUSINESS_ACCOUNT_ID}}`  | IG Business Account ID                  |
| `{{FACEBOOK_PAGE_ID}}`               | FB-Page-ID                              |

---

## 5. Canva

| Platzhalter                       | Was es ist                                 |
| --------------------------------- | ------------------------------------------ |
| `{{CANVA_API_KEY}}`               | Canva Connect API Key (nur Vault)          |
| `{{CANVA_BRAND_KIT_ID}}`          | Brand Kit ID                               |
| `{{CANVA_TPL_FEED_STANDARD}}`     | Template-ID Feed-Standard                  |
| `{{CANVA_TPL_FEED_UEBUNG}}`       | Template-ID Feed-Übung                     |
| `{{CANVA_TPL_FEED_MYTHOS}}`       | Template-ID Feed-Mythos                    |
| `{{CANVA_TPL_FEED_TEAM}}`         | Template-ID Feed-Team                      |
| `{{CANVA_TPL_FEED_NEWS}}`         | Template-ID Feed-News                      |
| `{{CANVA_TPL_STORY_STANDARD}}`    | Template-ID Story-Standard                 |
| `{{CANVA_TPL_STORY_TIPP}}`        | Template-ID Story-Tipp                     |
| `{{CANVA_TPL_REEL_COVER}}`        | Template-ID Reel-Cover                     |

---

## 6. LLM-Provider

| Platzhalter                       | Was es ist                                 |
| --------------------------------- | ------------------------------------------ |
| `{{ANTHROPIC_API_KEY}}`           | Claude / Anthropic Key (nur Vault)         |
| `{{ANTHROPIC_MODEL}}`             | aktuelles Modell (Sonnet / Opus)           |
| `{{OPENAI_API_KEY}}`              | optional, falls genutzt                    |
| `{{OPENAI_MODEL}}`                | z. B. `gpt-4o`                             |

---

## 7. Avatar-/Voice-Tools (optional, ab Roadmap-Phase 3)

| Platzhalter                       | Was es ist                                 |
| --------------------------------- | ------------------------------------------ |
| `{{HEYGEN_API_KEY}}`              | HeyGen API Key (nur Vault)                 |
| `{{HEYGEN_AVATAR_ID_JUDITH}}`     | Avatar-ID                                  |
| `{{HEYGEN_VOICE_ID_JUDITH}}`      | Voice-Clone-ID                             |
| `{{SYNTHESIA_API_KEY}}`           | Synthesia API Key (nur Vault)              |
| `{{ELEVENLABS_API_KEY}}`          | ElevenLabs API Key (nur Vault)             |
| `{{ELEVENLABS_VOICE_ID_JUDITH}}`  | Voice-ID                                   |

---

## 8. Storage / OneDrive

| Platzhalter                       | Was es ist                                 |
| --------------------------------- | ------------------------------------------ |
| `{{ONEDRIVE_REELS_FOLDER_PATH}}`  | OneDrive-Pfad für gerenderte Reels         |
| `{{ONEDRIVE_AVATAR_TRAINING_PATH}}`| Pfad für Avatar-Trainings-Material        |

---

## 9. Hinweis zur Speicherung echter Werte

- **Lokal beim Hosting:** `.env`-Datei außerhalb dieses Repos
  (z. B. `~/secrets/physio_fuchs.env`)
- **In n8n:** ausschließlich der Credential-Store
  - Naming-Konvention: `PF <Service> <Zweck>`
    (z. B. `PF Microsoft SharePoint`, `PF Meta Graph API`)
- **In Microsoft Entra:** Client-Secret der App-Registration
- **Niemals** in:
  - dieser Datei
  - Markdown-Dateien
  - exportierten n8n-Workflows (JSON enthält nur Credential-IDs, keine
    Secrets – beim Export prüfen!)
  - Git-Repos / Cloud-Sync-Ordnern ohne Verschlüsselung

---

## 10. Pflege

Wenn ein neuer Platzhalter eingeführt wird:
1. Ergänze die Zeile in der passenden Sektion oben.
2. Verwende den Platzhalter konsistent in allen Markdown- und JSON-Dateien.
3. Notiere in der Änderungshistorie, wer und wann.

| Datum       | Änderung                                          | Wer            |
| ----------- | ------------------------------------------------- | -------------- |
| 2026-05-14  | Initialliste erstellt                             | Claude / Thomas|
