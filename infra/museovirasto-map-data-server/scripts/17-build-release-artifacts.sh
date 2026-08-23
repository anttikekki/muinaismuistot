#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ARCHIVE="$PROJECT_DIR/data/poc/museovirasto-poc-compact.pmtiles"

run_step() {
  local description="$1"
  shift
  echo
  echo "==> $description"
  "$@"
}

run_step "Verify locked build tools" "$SCRIPT_DIR/16-verify-build-tools.sh"
run_step "Validate layer mapping" "$SCRIPT_DIR/05-validate-layer-mapping.sh"
run_step "Validate source field contract" "$SCRIPT_DIR/07-validate-field-contract.sh"
run_step "Validate source geometries" "$SCRIPT_DIR/18-validate-source-geometries.sh"
run_step "Compare source with versioned baseline" "$SCRIPT_DIR/20-compare-source-baseline.sh"
run_step "Build compact PMTiles" "$SCRIPT_DIR/13-build-compact-pmtiles-poc.sh"
run_step "Validate compact PMTiles" "$SCRIPT_DIR/11-validate-pmtiles-poc.sh" "$ARCHIVE"
run_step "Validate zoom and tile budgets" "$SCRIPT_DIR/21-validate-tiling-budgets.sh"
run_step "Build D1 feature import" "$SCRIPT_DIR/14-build-feature-details-sql.sh"
run_step "Create checksummed build manifest" "$SCRIPT_DIR/19-create-build-manifest.sh"
run_step "Type-check Worker and browser PoC" npm --prefix "$PROJECT_DIR/poc" run typecheck

echo
echo "Release artifacts built and validated."
echo "PMTiles: $ARCHIVE"
echo "D1 SQL:   $PROJECT_DIR/data/poc/feature-details.sql"
