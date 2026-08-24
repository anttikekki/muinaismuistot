#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
POC_DIR="$PROJECT_DIR/poc"
BACKUP_DIR="${1:-$PROJECT_DIR/data/poc/local-rollback}"
wrangler_global=()
if [[ -n "${WRANGLER_CWD:-}" ]]; then wrangler_global+=(--cwd "$WRANGLER_CWD"); fi

mkdir -p "$BACKUP_DIR"
cd "$POC_DIR"
./node_modules/.bin/wrangler "${wrangler_global[@]}" r2 object get museovirasto-map-data-poc/current.pmtiles \
  --file "$BACKUP_DIR/current.pmtiles" --local >/dev/null
./node_modules/.bin/wrangler "${wrangler_global[@]}" r2 object get museovirasto-map-data-poc/current.json \
  --file "$BACKUP_DIR/current.json" --local >/dev/null
./node_modules/.bin/wrangler "${wrangler_global[@]}" d1 export museovirasto-map-features-poc --local \
  --table feature_details --no-schema --output "$BACKUP_DIR/feature-details-data.sql" >/dev/null
[[ -s "$BACKUP_DIR/current.pmtiles" && -s "$BACKUP_DIR/current.json" && -s "$BACKUP_DIR/feature-details-data.sql" ]] || {
  echo "Local backup is incomplete: $BACKUP_DIR" >&2; exit 1;
}
jq -e '.version | test("^[0-9]{8}T[0-9]{6}Z$")' "$BACKUP_DIR/current.json" >/dev/null
echo "Local active data backed up: $BACKUP_DIR"
