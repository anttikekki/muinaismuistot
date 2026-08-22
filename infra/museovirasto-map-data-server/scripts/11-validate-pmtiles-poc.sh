#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ARCHIVE="${1:-$PROJECT_DIR/data/poc/museovirasto-poc.pmtiles}"
PMTILES="${PMTILES:-$PROJECT_DIR/data/tools/pmtiles}"
MAPPING_FILE="$PROJECT_DIR/layer-mapping.json"

for command_name in jq stat; do
  command -v "$command_name" >/dev/null 2>&1 || {
    echo "Required command not found: $command_name" >&2
    exit 1
  }
done

[[ -x "$PMTILES" ]] || {
  echo "PMTiles CLI not found: $PMTILES" >&2
  echo "Run scripts/09-download-pmtiles-cli.sh first." >&2
  exit 1
}
[[ -s "$ARCHIVE" ]] || { echo "PMTiles archive not found or empty: $ARCHIVE" >&2; exit 1; }

"$PMTILES" verify "$ARCHIVE"

metadata="$("$PMTILES" show --metadata "$ARCHIVE")"
expected_layers="$(jq -S -c '[.physicalLayers[].mvtSourceLayer] | sort' "$MAPPING_FILE")"
actual_layers="$(jq -S -c '[.vector_layers[].id] | sort' <<<"$metadata")"

[[ "$actual_layers" == "$expected_layers" ]] || {
  echo "PMTiles source layers do not match layer-mapping.json" >&2
  diff <(echo "$expected_layers") <(echo "$actual_layers") || true
  exit 1
}

layer_count="$(jq -r '.tilestats.layerCount' <<<"$metadata")"
[[ "$layer_count" == "12" ]] || {
  echo "Expected 12 layers in tilestats, found $layer_count" >&2
  exit 1
}

unknown_laji_count="$(
  for layer in archaeological_areas archaeological_points archaeological_subsites_points; do
    jq --arg layer "$layer" '[.tilestats.layers[] | select(.layer == $layer) | .attributes[]? | select(.attribute == "laji_key") | .values[]? | select(. == "unknown")] | length' <<<"$metadata"
  done | awk '{ total += $1 } END { print total + 0 }'
)"
[[ "$unknown_laji_count" == "0" ]] || {
  echo "Archive metadata contains unknown archaeological laji_key values" >&2
  exit 1
}

echo "PMTiles PoC is structurally valid."
echo "Archive: $ARCHIVE"
echo "Archive bytes: $(stat -f '%z' "$ARCHIVE")"
echo "Source layers: $layer_count"
echo "Layers: $(jq -r '[.vector_layers[].id] | sort | join(", ")' <<<"$metadata")"
echo "PMTiles CLI: $("$PMTILES" version)"
