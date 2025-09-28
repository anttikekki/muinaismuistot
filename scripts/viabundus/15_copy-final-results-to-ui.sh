#!/usr/bin/env bash
set -euo pipefail

SRC_FILE="results/14_Viabundus-final.geojson"
DEST_DIR="../../src/viabundus"
DEST_FILE="$DEST_DIR/Viabundus-finland.geojson"

# Check if source exists
if [ ! -f "$SRC_FILE" ]; then
  echo "Error: source file $SRC_FILE not found. Run join script first." >&2
  exit 1
fi

# Ensure destination folder exists
mkdir -p "$DEST_DIR"

# Copy with overwrite
cp -f "$SRC_FILE" "$DEST_FILE"

echo "Copied $SRC_FILE → $DEST_FILE"
