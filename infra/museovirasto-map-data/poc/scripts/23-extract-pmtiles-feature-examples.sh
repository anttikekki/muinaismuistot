#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
ARCHIVE="${1:-$PROJECT_DIR/data/poc/museovirasto-poc-compact.pmtiles}"
OUTPUT="${2:-$PROJECT_DIR/data/poc/pmtiles-feature-examples.json}"

for command_name in jq tippecanoe-decode; do
  command -v "$command_name" >/dev/null 2>&1 || { echo "Required command not found: $command_name" >&2; exit 1; }
done
[[ -s "$ARCHIVE" ]] || { echo "PMTiles archive not found: $ARCHIVE" >&2; exit 1; }

tippecanoe-decode "$ARCHIVE" 0 0 0 |
  jq '[.features[] | {
    sourceLayer: .properties.layer,
    id: .features[0].id,
    geometryType: .features[0].geometry.type,
    properties: .features[0].properties
  }]' > "$OUTPUT"

[[ "$(jq 'length' "$OUTPUT")" == 12 ]] || {
  echo "Expected examples from 12 physical layers" >&2
  exit 1
}

echo "Extracted real zoom 0 examples: $OUTPUT"
