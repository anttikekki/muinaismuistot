#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
VERSIONS_FILE="$PROJECT_DIR/processing/config/build-tool-versions.json"
PMTILES="$PROJECT_DIR/data/tools/pmtiles"
WRANGLER="$PROJECT_DIR/poc/node_modules/.bin/wrangler"

for command_name in jq gdal-config ogr2ogr ogrinfo tippecanoe tippecanoe-decode node npm rg; do
  command -v "$command_name" >/dev/null 2>&1 || { echo "Required command not found: $command_name" >&2; exit 1; }
done
[[ -x "$PMTILES" ]] || { echo "PMTiles CLI not found: $PMTILES" >&2; exit 1; }
[[ -x "$WRANGLER" ]] || { echo "Wrangler not installed; run npm ci in $PROJECT_DIR/poc" >&2; exit 1; }

check_version() {
  local tool="$1" actual="$2" expected
  expected="$(jq -r --arg tool "$tool" '.[$tool]' "$VERSIONS_FILE")"
  [[ "$actual" == "$expected" ]] || {
    echo "Tool version mismatch: $tool expected=$expected actual=$actual" >&2
    exit 1
  }
  printf '%-12s %s\n' "$tool" "$actual"
}

check_version gdal "$(gdal-config --version)"
check_version tippecanoe "$(tippecanoe --version 2>&1 | sed -E 's/^tippecanoe v//')"
check_version node "$(node --version | sed 's/^v//')"
check_version npm "$(npm --version)"
check_version jq "$(jq --version | sed 's/^jq-//')"
check_version pmtiles "$("$PMTILES" version | sed -E 's/^pmtiles ([^,]+).*/\1/')"
check_version wrangler "$(WRANGLER_LOG_PATH="${TMPDIR:-/tmp}/museovirasto-wrangler-version.log" "$WRANGLER" --version | tail -n 1)"

echo "Build tool versions match $VERSIONS_FILE"
