#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
ARCHIVE="$PROJECT_DIR/data/build/museovirasto.pmtiles"

mkdir -p "$PROJECT_DIR/data/build"

run_step() {
  local description="$1"
  shift
  echo
  echo "==> $description"
  "$@"
}

run_step "Download source data" "$SCRIPT_DIR/01-download-source-data.sh"
run_step "Validate downloaded source data" node "$SCRIPT_DIR/validation/validate-source-data.mjs"
run_step "Build compact PMTiles" "$SCRIPT_DIR/02-build-pmtiles.sh"
run_step "Validate compact PMTiles" node "$SCRIPT_DIR/validation/validate-pmtiles.mjs" "$ARCHIVE"
run_step "Validate zoom and tile budgets" "$SCRIPT_DIR/validation/validate-tiling-budgets.sh"
run_step "Build D1 feature import" "$SCRIPT_DIR/03-build-feature-details-sql.sh"
run_step "Validate PMTiles and D1 identities" node "$SCRIPT_DIR/validation/validate-pmtiles-d1-identities.mjs"
run_step "Create checksummed build manifest" "$SCRIPT_DIR/04-create-build-manifest.sh"
run_step "Create timestamped release descriptor" "$SCRIPT_DIR/05-create-release-descriptor.sh"

echo
echo "Release artifacts built and validated."
echo "PMTiles: $ARCHIVE"
echo "D1 SQL:   $PROJECT_DIR/data/build/feature-details.sql"
