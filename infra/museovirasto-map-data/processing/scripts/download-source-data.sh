#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DATA_DIR="$PROJECT_DIR/data"
ZIP_URL="https://mverkkodatashare.blob.core.windows.net/share/tutkija.zip"
ZIP_FILE="$DATA_DIR/tutkija.zip"
ZIP_HEADERS="$DATA_DIR/tutkija-http-headers.txt"
EXTRACT_DIR="$DATA_DIR/tutkija"
REUSE_SOURCE=false

usage() {
  echo "Usage: $0 [--reuse-source]" >&2
}

case "${1:-}" in
  "") ;;
  --reuse-source) REUSE_SOURCE=true ;;
  *) usage; exit 2 ;;
esac
[[ $# -le 1 ]] || { usage; exit 2; }

for command_name in curl unzip; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Error: '$command_name' is required." >&2
    exit 1
  fi
done

mkdir -p "$DATA_DIR"

if [[ "$REUSE_SOURCE" == true ]]; then
  [[ -s "$ZIP_FILE" && -d "$EXTRACT_DIR" ]] || {
    echo "Cannot reuse source: $ZIP_FILE and $EXTRACT_DIR must already exist." >&2
    exit 1
  }
  echo "Reusing source data from $EXTRACT_DIR"
else
  echo "Downloading $ZIP_URL"
  rm -f "$ZIP_FILE.part" "$ZIP_HEADERS.part"
  curl --fail --location --retry 3 --dump-header "$ZIP_HEADERS.part" --output "$ZIP_FILE.part" "$ZIP_URL"
  mv "$ZIP_FILE.part" "$ZIP_FILE"
  mv "$ZIP_HEADERS.part" "$ZIP_HEADERS"

  echo "Extracting $ZIP_FILE"
  rm -rf "$EXTRACT_DIR.part"
  mkdir -p "$EXTRACT_DIR.part"
  unzip -q "$ZIP_FILE" -d "$EXTRACT_DIR.part"
  rm -rf "$EXTRACT_DIR"
  mv "$EXTRACT_DIR.part" "$EXTRACT_DIR"
fi

echo "Source data is available in $EXTRACT_DIR"
