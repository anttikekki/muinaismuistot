#!/usr/bin/env bash
set -euo pipefail

RES_DIR="results"
INPUT_FILE="$RES_DIR/4_Viabundus-nodes.geojson"
OUTPUT_FILE="$RES_DIR/5_Viabundus-nodes.geojson"
TEMP_FILE="$RES_DIR/temp_reprojected.geojson"

# Bounding box for Finland in EPSG:3067
BBOX="50199.4814 6632464.0358 761274.6247 7799839.8902"

if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: $INPUT_FILE not found in $RES_DIR. Run 4_settlemets_to_geojson.mjs first."
  exit 1
fi

# Clean up from previous runs
rm -f "$TEMP_FILE" "$OUTPUT_FILE"

echo "Reprojecting $INPUT_FILE to EPSG:3067..."
ogr2ogr \
  -f GeoJSON \
  -t_srs EPSG:3067 \
  "$TEMP_FILE" \
  "$INPUT_FILE"

echo "Clipping to Finland bounding box..."
ogr2ogr \
  -f GeoJSON \
  -spat $BBOX \
  "$OUTPUT_FILE" \
  "$TEMP_FILE"

rm -f "$TEMP_FILE"

echo "Done. Output saved as $OUTPUT_FILE"
