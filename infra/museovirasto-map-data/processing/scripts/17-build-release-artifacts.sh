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

run_step "Validate downloaded source data" "$SCRIPT_DIR/10-validate-source-data.sh"
run_step "Build compact PMTiles" "$SCRIPT_DIR/13-build-pmtiles.sh"
run_step "Validate compact PMTiles" "$SCRIPT_DIR/11-validate-pmtiles.sh" "$ARCHIVE"
run_step "Validate zoom and tile budgets" "$SCRIPT_DIR/21-validate-tiling-budgets.sh"
run_step "Build D1 feature import" "$SCRIPT_DIR/14-build-feature-details-sql.sh"
run_step "Validate PMTiles and D1 identities" "$SCRIPT_DIR/24-validate-pmtiles-d1-identities.sh"
run_step "Create checksummed build manifest" "$SCRIPT_DIR/19-create-build-manifest.sh"
run_step "Create timestamped release descriptor" "$SCRIPT_DIR/25-create-release-descriptor.sh"

echo
echo "Release artifacts built and validated."
echo "PMTiles: $ARCHIVE"
echo "D1 SQL:   $PROJECT_DIR/data/build/feature-details.sql"
