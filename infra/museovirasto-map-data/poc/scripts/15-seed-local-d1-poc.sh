#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
POC_DIR="$PROJECT_DIR/poc"
IMPORT_FILE="$PROJECT_DIR/data/poc/feature-details.sql"

[[ -s "$IMPORT_FILE" ]] || { echo "D1 import not found: $IMPORT_FILE" >&2; exit 1; }
cd "$POC_DIR"
CI=1 ./node_modules/.bin/wrangler d1 migrations apply museovirasto-map-features-poc --local >/dev/null
./node_modules/.bin/wrangler d1 execute museovirasto-map-features-poc --local --file="$IMPORT_FILE" >/dev/null
echo "Replaced local D1 feature details."
