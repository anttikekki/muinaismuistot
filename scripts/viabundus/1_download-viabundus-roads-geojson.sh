#!/bin/bash
set -euo pipefail

# URLs and filenames
URL="https://www.landesgeschichte.uni-goettingen.de/handelsstrassen/data/Viabundus-2-edges.geojson"
INPUT_FILE="Viabundus-2-edges.geojson"
FILTERED_FILE="temp_filtered.geojson"
REPROJECTED_FILE="temp_reprojected.geojson"
OUTPUT_FILE="Viabundus-roads-finland.geojson"

# Step 0: Download the GeoJSON file only if it does not exist
if [ ! -f "$INPUT_FILE" ]; then
  echo "Downloading $INPUT_FILE..."
  curl -fsSL -o "$INPUT_FILE" "$URL"
else
  echo "$INPUT_FILE already exists, skipping download."
fi

# Step 1: Filter features by section == 'FIN'
echo "Filtering features where section == 'FIN'..."
ogr2ogr \
  -f GeoJSON \
  -where "section = 'FIN'" \
  "$FILTERED_FILE" \
  "$INPUT_FILE"

# Step 2: Reproject to EPSG:3067
echo "Reprojecting to EPSG:3067..."
ogr2ogr \
  -f GeoJSON \
  -t_srs EPSG:3067 \
  "$REPROJECTED_FILE" \
  "$FILTERED_FILE"

# Step 3: Drop selected properties (requires jq) and compact JSON
echo "Dropping properties: length, fromnode, tonode, slopemultiplier, section..."
if ! command -v jq >/dev/null 2>&1; then
  echo "Error: 'jq' is required to drop fields but was not found. Please install jq and re-run." >&2
  exit 1
fi
jq -c '.features[].properties |= del(.length, .fromnode, .tonode, .slopemultiplier, .section)' \
  "$REPROJECTED_FILE" > "$OUTPUT_FILE"

# Step 4: Clean up temp files
rm -f "$FILTERED_FILE" "$REPROJECTED_FILE"

echo "Processing complete. Output saved as $OUTPUT_FILE"
