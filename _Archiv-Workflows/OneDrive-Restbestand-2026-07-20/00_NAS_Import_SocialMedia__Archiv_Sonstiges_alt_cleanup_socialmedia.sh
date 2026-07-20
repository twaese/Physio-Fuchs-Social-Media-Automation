#!/bin/bash
# ============================================================
# Physio Fuchs – SocialMedia Ordner Aufräumen
# Erstellt: 2026-05-11
# Ausführen: chmod +x cleanup_socialmedia.sh && ./cleanup_socialmedia.sh
# ============================================================

# Pfad zum SocialMedia Ordner anpassen falls abweichend
BASE="$HOME/Library/CloudStorage/OneDrive-Shared/Physio_Fuchs/SocialMedia"
# Falls dein Pfad anders ist, z.B.:
# BASE="/Users/thomaswaese/OneDrive - Physio Fuchs/SocialMedia"

ARCHIVE="$BASE/_Archiv"

echo "================================================"
echo "  PF SocialMedia Aufräumen"
echo "  Basis: $BASE"
echo "  Archiv: $ARCHIVE"
echo "================================================"

# Archiv-Unterordner anlegen
mkdir -p "$ARCHIVE/WF-02_Caption_Generator"
mkdir -p "$ARCHIVE/WF-03_Grafik_Generator_alt"
mkdir -p "$ARCHIVE/Sonstiges_alt"

echo ""
echo "▶ Archiviere ältere WF-02 Versionen..."

# WF-02 – alle außer v16 ins Archiv
for f in \
  "PF__WF-02_Caption_Generator_v2.json" \
  "PF__WF-02_Caption_Generator_v3.json" \
  "PF__WF-02_Caption_Generator_v5.json" \
  "PF__WF-02_Caption_Generator_v6.json" \
  "PF__WF-02_Caption_Generator_v7.json" \
  "PF__WF-02_Caption_Generator_v9.json" \
  "PF__WF-02_Caption_Generator_v10.json" \
  "PF__WF-02_Caption_Generator_v11.json" \
  "PF__WF-02_Caption_Generator_v12.json" \
  "PF__WF-02_Caption_Generator_v14_FINAL.json" \
  "PF_WF-02_Caption_Generator_v15.json" \
  "PF-WF-02-Caption-Generator.json"; do
  if [ -f "$BASE/$f" ]; then
    mv "$BASE/$f" "$ARCHIVE/WF-02_Caption_Generator/$f"
    echo "  ✅ $f → Archiv/WF-02"
  fi
done

echo ""
echo "▶ Archiviere ältere WF-03 Versionen (hcti.io / Layout B)..."

# WF-03 alt – alle Layout_B und alte Grafik-Generatoren
for f in \
  "PF___WF-03_Canva_Grafik_Generator_v1.json" \
  "PF___WF-03_Canva_Grafik_Generator_v2.json" \
  "PF___WF-03_Grafik_Generator_v3.json" \
  "PF___WF-03_Grafik_Generator_v4.json" \
  "PF___WF-03_Grafik_Generator_v6.json" \
  "PF___WF-03_Layout_B_v8_FINAL.json" \
  "PF___WF-03_Layout_B_v9.json" \
  "PF___WF-03_Layout_B_v11.json" \
  "PF___WF-03_Layout_B_v12.json" \
  "PF___WF-03_Layout_B_v13.json"; do
  if [ -f "$BASE/$f" ]; then
    mv "$BASE/$f" "$ARCHIVE/WF-03_Grafik_Generator_alt/$f"
    echo "  ✅ $f → Archiv/WF-03_alt"
  fi
done

echo ""
echo "▶ Archiviere sonstige alte Dateien..."

for f in \
  "physio_fuchs_social_media_workflow.json"; do
  if [ -f "$BASE/$f" ]; then
    mv "$BASE/$f" "$ARCHIVE/Sonstiges_alt/$f"
    echo "  ✅ $f → Archiv/Sonstiges_alt"
  fi
done

echo ""
echo "================================================"
echo "  Verbleibende Dateien im Root:"
echo "================================================"
ls -1 "$BASE"/*.json "$BASE"/*.xlsx "$BASE"/*.html 2>/dev/null | xargs -I{} basename {}

echo ""
echo "✅ Aufräumen abgeschlossen."
echo "   Archiv liegt unter: $ARCHIVE"
