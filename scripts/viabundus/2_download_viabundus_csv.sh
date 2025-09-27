#!/usr/bin/env bash
set -euo pipefail

ZIP_URL="https://www.landesgeschichte.uni-goettingen.de/handelsstrassen/data/Viabundus-2-csv.zip"
ZIP_FILE="Viabundus-2-csv.zip"
CSV_DIR="viabundus_csv"

# Step 0: Download CSV zip if not present
if [ ! -f "$ZIP_FILE" ]; then
  echo "Downloading CSV ZIP..."
  curl -fsSL -o "$ZIP_FILE" "$ZIP_URL"
else
  echo "$ZIP_FILE already exists, skipping download."
fi

# Step 1: Unzip into $CSV_DIR
if [ ! -d "$CSV_DIR" ]; then
  echo "Unzipping CSV files..."
  mkdir -p "$CSV_DIR"
  unzip -o "$ZIP_FILE" -d "$CSV_DIR"
else
  echo "CSV directory already exists, skipping unzip."
fi

echo "CSV data ready in $CSV_DIR/"
