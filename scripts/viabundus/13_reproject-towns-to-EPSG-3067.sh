#!/usr/bin/env bash
set -euo pipefail

RES_DIR="results"
INPUT_FILE="$RES_DIR/12_Viabundus-towns.geojson"
OUTPUT_FILE="$RES_DIR/13_Viabundus-towns.geojson"


if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: $INPUT_FILE not found in $RES_DIR. Run 12_towns-to-geojson.mjs first."
  exit 1
fi

echo "Reprojecting $INPUT_FILE to EPSG:3067..."
ogr2ogr \
  -f GeoJSON \
  -t_srs EPSG:3067 \
  "$OUTPUT_FILE" \
  "$INPUT_FILE"

echo "Done. Output saved as $OUTPUT_FILE"
