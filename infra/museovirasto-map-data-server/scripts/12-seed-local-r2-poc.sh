#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
POC_DIR="$PROJECT_DIR/poc"
ARCHIVE="${1:-$PROJECT_DIR/data/poc/museovirasto-poc-compact.pmtiles}"
RELEASE_DESCRIPTOR="$PROJECT_DIR/data/poc/release-descriptor.json"

[[ -s "$ARCHIVE" ]] || {
  echo "PMTiles archive not found: $ARCHIVE" >&2
  echo "Run scripts/13-build-compact-pmtiles-poc.sh first." >&2
  exit 1
}
[[ -s "$RELEASE_DESCRIPTOR" ]] || {
  echo "Release descriptor not found: $RELEASE_DESCRIPTOR" >&2
  echo "Run scripts/25-create-release-descriptor.sh first." >&2
  exit 1
}
archive_key="current.pmtiles"
metadata_file="$PROJECT_DIR/data/poc/current-metadata.json"
[[ -s "$metadata_file" ]] || { echo "Current metadata not found: $metadata_file" >&2; exit 1; }
[[ -x "$POC_DIR/node_modules/.bin/wrangler" ]] || {
  echo "PoC dependencies missing. Run npm install in $POC_DIR first." >&2
  exit 1
}

cd "$POC_DIR"
./node_modules/.bin/wrangler r2 object put \
  "museovirasto-map-data-poc/$archive_key" \
  --file="$ARCHIVE" \
  --content-type=application/vnd.pmtiles \
  --local
./node_modules/.bin/wrangler r2 object put \
  "museovirasto-map-data-poc/current.json" \
  --file="$metadata_file" \
  --content-type=application/json \
  --local

echo "Seeded local R2 objects: $archive_key and current.json"
