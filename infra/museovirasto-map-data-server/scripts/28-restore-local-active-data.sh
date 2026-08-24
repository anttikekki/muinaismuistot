#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
POC_DIR="$PROJECT_DIR/poc"
BACKUP_DIR="${1:-$PROJECT_DIR/data/poc/local-rollback}"
RESTORE_SQL="$BACKUP_DIR/restore-feature-details.sql"
wrangler_global=()
if [[ -n "${WRANGLER_CWD:-}" ]]; then wrangler_global+=(--cwd "$WRANGLER_CWD"); fi

for file in current.pmtiles current.json feature-details-data.sql; do
  [[ -s "$BACKUP_DIR/$file" ]] || { echo "Backup file missing: $BACKUP_DIR/$file" >&2; exit 1; }
done
jq -e '.version | test("^[0-9]{8}T[0-9]{6}Z$")' "$BACKUP_DIR/current.json" >/dev/null

{
  printf 'DELETE FROM feature_details;\n'
  sed -E '/^(PRAGMA defer_foreign_keys|BEGIN TRANSACTION|COMMIT);/d' "$BACKUP_DIR/feature-details-data.sql"
} > "$RESTORE_SQL"

cd "$POC_DIR"
./node_modules/.bin/wrangler "${wrangler_global[@]}" r2 object put museovirasto-map-data-poc/current.pmtiles \
  --file "$BACKUP_DIR/current.pmtiles" --content-type application/vnd.pmtiles --local >/dev/null
./node_modules/.bin/wrangler "${wrangler_global[@]}" r2 object put museovirasto-map-data-poc/current.json \
  --file "$BACKUP_DIR/current.json" --content-type application/json --local >/dev/null
./node_modules/.bin/wrangler "${wrangler_global[@]}" d1 execute museovirasto-map-features-poc --local --file "$RESTORE_SQL" >/dev/null
echo "Local active data restored: $BACKUP_DIR"
