# Gotenberg-Sidecar – Setup auf Hostinger-VPS

Gotenberg ist ein Docker-Service, der HTML → PNG/JPG/PDF konvertiert. Wir
nutzen ihn als Sidecar neben n8n, um Instagram-/Facebook-/LinkedIn-Posts
aus unseren HTML-Templates zu rendern. Ersatz für die Canva-API-Pipeline.

**Voraussetzungen:**
- Bestehendes Docker-Compose-Setup unter `/docker/n8n/` auf der Hostinger-VPS
- ~500 MB freier RAM (Gotenberg hält einen Chromium-Prozess warm)
- ~300 MB Disk für das Image

---

## 1. docker-compose.yml ergänzen

Auf der VPS bearbeiten: `/docker/n8n/docker-compose.yml`

Innerhalb von `services:` einen neuen Block hinzufügen:

```yaml
  gotenberg:
    image: gotenberg/gotenberg:8
    container_name: gotenberg
    restart: unless-stopped
    # Kein "ports:" — Gotenberg ist nur intern für n8n erreichbar.
    # Falls du ihn von außen testen willst, vorübergehend:
    # ports:
    #   - "127.0.0.1:3001:3000"
    networks:
      - n8n_default          # ← Netzwerk-Name muss zum n8n-Service passen
    command:
      - "gotenberg"
      - "--api-timeout=60s"
      - "--chromium-disable-javascript=false"
```

**Wichtig zu Netzwerk:** den exakten Namen prüfen mit:
```bash
docker network ls | grep n8n
```
Falls das Netzwerk z. B. `n8n-stack_default` heißt, den Wert oben anpassen.

---

## 2. Deployen

```bash
cd /docker/n8n
docker compose pull gotenberg
docker compose up -d gotenberg
docker compose logs -f gotenberg     # Erwartung: "Application started"
```

---

## 3. Health-Check (von der VPS aus)

```bash
docker exec n8n curl -sf http://gotenberg:3000/health
# Erwartung: {"status":"up", ...}
```

→ Wenn `up`: n8n erreicht Gotenberg sauber über internes Docker-DNS.

---

## 4. Render-Test (von der VPS aus)

```bash
docker exec n8n curl -s -o /tmp/test.png \
  -X POST http://gotenberg:3000/forms/chromium/screenshot/html \
  -F "files=@-;filename=index.html" \
  -F "format=png" \
  -F "width=1080" \
  -F "height=1350" <<EOF
<!DOCTYPE html><html><body style="background:#7E9963;color:#F4EFE2;font-family:Georgia;padding:60px;font-size:80px;">Gotenberg läuft.</body></html>
EOF

docker exec n8n ls -lh /tmp/test.png
# Erwartung: PNG-Datei ~10-30KB
```

Wenn die Datei entsteht → Gotenberg ist einsatzbereit für n8n.

---

## 5. Endpoint-Referenz (für WF-02 v18)

Die Bilder erzeugen wir mit dem **Screenshot-Endpoint**:

```
POST http://gotenberg:3000/forms/chromium/screenshot/html
Content-Type: multipart/form-data
```

**Multipart-Felder:**

| Field           | Wert                                              |
|-----------------|---------------------------------------------------|
| `files`         | HTML-Datei (Filename: `index.html`)               |
| `files`         | Asset-Dateien (Logo, Portrait, …) — gleicher Pfad |
| `format`        | `png` oder `jpeg`                                 |
| `width`         | `1080` (IG/FB) oder `1200` (LinkedIn)             |
| `height`        | `1350` (IG) / `1080` (FB) / `1200` (LinkedIn)     |
| `optimizeForSpeed` | `false` (höhere Qualität)                      |

Response: Binary PNG/JPG direkt im Body.

**Asset-Handling:**
WF-02 muss bei jedem Render alle referenzierten Asset-Dateien (Logo,
Judith-Portrait) als zusätzliche `files`-Felder mitschicken, oder die
HTML-Datei mit Base64-eingebetteten Bildern bauen. Variante A (separate
Files) ist sauberer, weil Templates wartbar bleiben.

---

## 6. Ressourcen-Verbrauch

- **RAM idle:** ~150 MB
- **RAM während Render:** ~400 MB Peak (Chromium-Instanz)
- **Render-Zeit pro Post:** ~1-2 Sekunden
- **Concurrent Renders:** 4 Default (pro Worker)

Bei der erwarteten Last (1–3 Posts pro Tag) absolut unkritisch.

---

## 7. Troubleshooting

| Problem | Lösung |
|---|---|
| `connection refused` von n8n | Netzwerk-Name in compose stimmt nicht — `docker network inspect <name>` prüfen |
| Render bleibt weiß | JavaScript ist deaktiviert (Google Fonts laden via JS) — `--chromium-disable-javascript=false` setzen (siehe oben) |
| Fonts wirken anders | Google Fonts braucht Internet-Zugang aus dem Container — `docker exec gotenberg curl -I https://fonts.googleapis.com` testen |
| Bild wird abgeschnitten | `width`/`height` in Form-Data stimmen nicht zum HTML-`html, body`-Wert — beide auf 1080/1350 setzen |

---

## 8. Sicherheits-Note

Gotenberg ist **nicht** öffentlich erreichbar (kein `ports:`-Mapping nach außen).
Nur n8n im selben Docker-Netzwerk kann ihn aufrufen. Das ist Absicht — Gotenberg
würde sonst beliebige URLs rendern können, was eine SSRF-Schwachstelle wäre.

Falls du Gotenberg für lokales Testen kurzfristig öffnen willst:
```yaml
    ports:
      - "127.0.0.1:3001:3000"   # nur localhost, nicht 0.0.0.0
```
Nach dem Test wieder entfernen.

---

## Änderungshistorie

| Datum       | Änderung                                | Wer    |
| ----------- | --------------------------------------- | ------ |
| 2026-05-16  | Initial – Sidecar-Deploy + Render-Test  | Claude |
