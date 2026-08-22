#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
POC_DIR="$PROJECT_DIR/poc"
ARCHIVE="$PROJECT_DIR/data/poc/museovirasto-poc.pmtiles"

[[ -s "$ARCHIVE" ]] || {
  echo "PMTiles archive not found: $ARCHIVE" >&2
  echo "Run scripts/10-build-pmtiles-poc.sh first." >&2
  exit 1
}
[[ -x "$POC_DIR/node_modules/.bin/wrangler" ]] || {
  echo "PoC dependencies missing. Run npm install in $POC_DIR first." >&2
  exit 1
}

cd "$POC_DIR"
./node_modules/.bin/wrangler r2 object put \
  museovirasto-map-data-poc/museovirasto-poc.pmtiles \
  --file="$ARCHIVE" \
  --content-type=application/vnd.pmtiles \
  --local

echo "Seeded local R2 object: museovirasto-poc.pmtiles"
