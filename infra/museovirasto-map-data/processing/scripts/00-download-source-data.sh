#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DATA_DIR="$PROJECT_DIR/data"
ZIP_URL="https://mverkkodatashare.blob.core.windows.net/share/tutkija.zip"
ZIP_FILE="$DATA_DIR/tutkija.zip"
ZIP_HEADERS="$DATA_DIR/tutkija-http-headers.txt"
EXTRACT_DIR="$DATA_DIR/tutkija"
DESCRIPTION_URL="https://museovirasto-craft-assets-production.s3.eu-north-1.amazonaws.com/Tietotuotemaarittely_kulttuuriymparisto_kaikki.pdf"
DESCRIPTION_FILE="$DATA_DIR/Tietotuotemaarittely_kulttuuriymparisto_kaikki.pdf"

for command_name in curl unzip; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Error: '$command_name' is required." >&2
    exit 1
  fi
done

mkdir -p "$DATA_DIR"

if [[ ! -f "$ZIP_FILE" ]]; then
  echo "Downloading $ZIP_URL"
  curl --fail --location --retry 3 --dump-header "$ZIP_HEADERS.part" --output "$ZIP_FILE.part" "$ZIP_URL"
  mv "$ZIP_FILE.part" "$ZIP_FILE"
  mv "$ZIP_HEADERS.part" "$ZIP_HEADERS"
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

if [[ ! -f "$DESCRIPTION_FILE" ]]; then
  echo "Downloading $DESCRIPTION_URL"
  curl --fail --location --retry 3 --output "$DESCRIPTION_FILE.part" "$DESCRIPTION_URL"
  mv "$DESCRIPTION_FILE.part" "$DESCRIPTION_FILE"
else
  echo "$DESCRIPTION_FILE already exists; skipping download."
fi

echo "Source data is available in $EXTRACT_DIR"
echo "Data description is available at $DESCRIPTION_FILE"
