#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DATA_DIR="$PROJECT_DIR/data"
ZIP_URL="https://mverkkodatashare.blob.core.windows.net/share/tutkija.zip"
ZIP_FILE="$DATA_DIR/tutkija.zip"
EXTRACT_DIR="$DATA_DIR/tutkija"

for command_name in curl unzip; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Error: '$command_name' is required." >&2
    exit 1
  fi
done

mkdir -p "$DATA_DIR"

if [[ ! -f "$ZIP_FILE" ]]; then
  echo "Downloading $ZIP_URL"
  curl --fail --location --retry 3 --output "$ZIP_FILE.part" "$ZIP_URL"
  mv "$ZIP_FILE.part" "$ZIP_FILE"
else
  echo "$ZIP_FILE already exists; skipping download."
fi

if [[ ! -d "$EXTRACT_DIR" ]]; then
  echo "Extracting $ZIP_FILE"
  mkdir -p "$EXTRACT_DIR"
  unzip -q "$ZIP_FILE" -d "$EXTRACT_DIR"
else
  echo "$EXTRACT_DIR already exists; skipping extraction."
fi

echo "Source data is available in $EXTRACT_DIR"
