#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
ARCHIVE="${1:-$PROJECT_DIR/data/build/museovirasto.pmtiles}"
MAPPING_FILE="$PROJECT_DIR/contract/layer-mapping.json"

for command_name in jq pmtiles tippecanoe-decode; do
  command -v "$command_name" >/dev/null 2>&1 || {
    echo "Required command not found: $command_name" >&2
    exit 1
  }
done

[[ -s "$ARCHIVE" ]] || { echo "PMTiles archive not found or empty: $ARCHIVE" >&2; exit 1; }

pmtiles verify "$ARCHIVE"

metadata="$(pmtiles show --metadata "$ARCHIVE")"
expected_layers="$(jq -S -c '[.physicalLayers[].mvtSourceLayer] | sort' "$MAPPING_FILE")"
actual_layers="$(jq -S -c '[.vector_layers[].id] | sort' <<<"$metadata")"

[[ "$actual_layers" == "$expected_layers" ]] || {
  echo "PMTiles source layers do not match layer-mapping.json" >&2
  diff <(echo "$expected_layers") <(echo "$actual_layers") || true
  exit 1
}

layer_count="$(jq -r '.tilestats.layerCount' <<<"$metadata")"
expected_layer_count="$(jq '.physicalLayers | length' "$MAPPING_FILE")"
[[ "$layer_count" == "$expected_layer_count" ]] || {
  echo "Expected $expected_layer_count layers in tilestats, found $layer_count" >&2
  exit 1
}

actual_fields="$(jq -S -c '[.vector_layers[] | {key: .id, value: .fields}] | from_entries' <<<"$metadata")"
expected_fields="$(jq -n -S -c --argjson layers "$expected_layers" '
  reduce $layers[] as $layer ({}; .[$layer] = {})
  | .archaeological_areas = {laji_key: "Number"}
  | .archaeological_points = {dating_mask: "Number", laji_key: "Number", subtype_codes: "String", type_mask: "Number"}
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

kind_count="$(jq '.kinds | length' "$PROJECT_DIR/contract/filter-vocabulary.json")"
invalid_laji_count="$(
  jq --argjson maximum "$kind_count" '[.tilestats.layers[] | select(.layer == "archaeological_areas" or .layer == "archaeological_points") | .attributes[]? | select(.attribute == "laji_key") | .values[]? | select(type != "number" or . < 1 or . > $maximum)] | length' <<<"$metadata"
)"
[[ "$invalid_laji_count" == "0" ]] || {
  echo "Archive metadata contains invalid archaeological laji_key codes" >&2
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

echo "PMTiles archive is structurally valid."
echo "Archive: $ARCHIVE"
echo "Archive bytes: $(wc -c < "$ARCHIVE" | tr -d ' ')"
echo "Source layers: $layer_count"
echo "All point features retained at zoom 0: yes"
echo "Compact field schema: valid"
echo "All area layers represented by centroids at zoom 0: yes"
echo "Layers: $(jq -r '[.vector_layers[].id] | sort | join(", ")' <<<"$metadata")"
echo "PMTiles CLI: $(pmtiles version)"
