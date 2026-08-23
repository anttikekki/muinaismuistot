#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ARCHIVE="${1:-$PROJECT_DIR/data/poc/museovirasto-poc.pmtiles}"
PMTILES="${PMTILES:-$PROJECT_DIR/data/tools/pmtiles}"
MAPPING_FILE="$PROJECT_DIR/layer-mapping.json"

for command_name in jq stat tippecanoe-decode; do
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

if [[ "$(basename "$ARCHIVE")" == *compact* ]]; then
  actual_fields="$(jq -S -c '[.vector_layers[] | {key: .id, value: .fields}] | from_entries' <<<"$metadata")"
  expected_fields="$(jq -n -S -c --argjson layers "$expected_layers" '
    reduce $layers[] as $layer ({}; .[$layer] = {})
    | .archaeological_areas = {laji_key: "String"}
    | .archaeological_points = {dating_mask: "Number", laji_key: "String", subtype_codes: "String", type_mask: "Number"}
  ')"
  [[ "$actual_fields" == "$expected_fields" ]] || {
    echo "Compact archive field schema does not match the documented minimum" >&2
    diff <(echo "$expected_fields") <(echo "$actual_fields") || true
    exit 1
  }

  z0_area_summary="$(
    tippecanoe-decode "$ARCHIVE" 0 0 0 |
      jq -S -c '[.features[] | select(.properties.layer | endswith("_areas")) | {key:.properties.layer, value:{count:(.features|length), geometryTypes:([.features[].geometry.type]|unique)}}] | from_entries'
  )"
  while IFS=$'\t' read -r layer_id metadata_count; do
    expected_count="$((metadata_count / 2))"
    actual_count="$(jq -r --arg layer "$layer_id" '.[$layer].count // 0' <<<"$z0_area_summary")"
    geometry_types="$(jq -c --arg layer "$layer_id" '.[$layer].geometryTypes // []' <<<"$z0_area_summary")"
    [[ "$actual_count" == "$expected_count" && "$geometry_types" == '["Point"]' ]] || {
      echo "Low-zoom centroid mismatch for $layer_id: expected=$expected_count actual=$actual_count geometryTypes=$geometry_types" >&2
      exit 1
    }
  done < <(jq -r '.tilestats.layers[] | select(.layer | endswith("_areas")) | [.layer, .count] | @tsv' <<<"$metadata")
fi

unknown_laji_count="$(
  for layer in archaeological_areas archaeological_points archaeological_subsites_points; do
    jq --arg layer "$layer" '[.tilestats.layers[] | select(.layer == $layer) | .attributes[]? | select(.attribute == "laji_key") | .values[]? | select(. == "unknown")] | length' <<<"$metadata"
  done | awk '{ total += $1 } END { print total + 0 }'
)"
[[ "$unknown_laji_count" == "0" ]] || {
  echo "Archive metadata contains unknown archaeological laji_key values" >&2
  exit 1
}

z0_counts="$(
  tippecanoe-decode "$ARCHIVE" 0 0 0 |
    jq -c 'reduce .features[] as $layer ({}; .[$layer.properties.layer] = ($layer.features | length))'
)"

while IFS=$'\t' read -r layer_id expected_count; do
  actual_count="$(jq -r --arg layer "$layer_id" '.[$layer] // 0' <<<"$z0_counts")"
  [[ "$actual_count" == "$expected_count" ]] || {
    echo "Point retention mismatch at zoom 0 for $layer_id: metadata=$expected_count z0=$actual_count" >&2
    exit 1
  }
done < <(
  jq -r --argjson metadata "$metadata" '
    .physicalLayers[]
    | select(.geometryType == "POINT")
    | .mvtSourceLayer as $id
    | [$id, ($metadata.tilestats.layers[] | select(.layer == $id) | .count)]
    | @tsv
  ' "$MAPPING_FILE"
)

echo "PMTiles PoC is structurally valid."
echo "Archive: $ARCHIVE"
echo "Archive bytes: $(stat -f '%z' "$ARCHIVE")"
echo "Source layers: $layer_count"
echo "All point features retained at zoom 0: yes"
if [[ "$(basename "$ARCHIVE")" == *compact* ]]; then
  echo "Compact field schema: valid"
  echo "All area layers represented by centroids at zoom 0: yes"
fi
echo "Layers: $(jq -r '[.vector_layers[].id] | sort | join(", ")' <<<"$metadata")"
echo "PMTiles CLI: $("$PMTILES" version)"
