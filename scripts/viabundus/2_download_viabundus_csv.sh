#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="source-data"
ZIP_URL="https://www.landesgeschichte.uni-goettingen.de/handelsstrassen/data/Viabundus-2-csv.zip"
ZIP_FILE="$SRC_DIR/Viabundus-2-csv.zip"
CSV_DIR="$SRC_DIR/viabundus_csv"

# Step 0: Ensure source-data folder exists
mkdir -p "$SRC_DIR"

# Step 1: Download CSV zip if not present
if [ ! -f "$ZIP_FILE" ]; then
  echo "Downloading $ZIP_FILE..."
  curl -fSL -o "$ZIP_FILE" "$ZIP_URL"
else
  echo "$ZIP_FILE already exists, skipping download."
fi

# Step 2: Unzip into $CSV_DIR
if [ ! -d "$CSV_DIR" ]; then
  echo "Unzipping CSV files into $CSV_DIR..."
  mkdir -p "$CSV_DIR"
  unzip -o "$ZIP_FILE" -d "$CSV_DIR"
else
  echo "CSV directory already exists, skipping unzip."
fi

echo "CSV data ready in $CSV_DIR/"
