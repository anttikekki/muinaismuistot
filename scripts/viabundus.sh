#!/bin/bash

# Check for input and output file arguments
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 input.geojson output.geojson"
  exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"
TEMP_FILE="temp_reprojected.geojson"

# Bounding box in EPSG:3067
BBOX="50199.4814 6582464.0358 761274.6247 7799839.8902"

# Step 1: Reproject to EPSG:3067
ogr2ogr \
  -f GeoJSON \
  -t_srs EPSG:3067 \
  "$TEMP_FILE" \
  "$INPUT_FILE"

# Step 2: Clip to bounding box (in EPSG:3067)
ogr2ogr \
  -f GeoJSON \
  -spat $BBOX \
  "$OUTPUT_FILE" \
  "$TEMP_FILE"

# Step 3: Clean up temp file
rm "$TEMP_FILE"
