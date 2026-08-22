#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="${1:-$PROJECT_DIR/data/tutkija}"
MAPPING_FILE="${2:-$PROJECT_DIR/layer-mapping.json}"
UI_LAYER_TYPES_FILE="$PROJECT_DIR/../../src/common/layers.types.ts"

for command_name in jq sqlite3; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Error: '$command_name' is required." >&2
    exit 1
  fi
done

if [[ ! -d "$SOURCE_DIR" || ! -f "$MAPPING_FILE" ]]; then
  echo "Error: source directory or mapping file is missing." >&2
  exit 1
fi

jq empty "$MAPPING_FILE"

physical_count="$(jq '.physicalLayers | length' "$MAPPING_FILE")"
logical_count="$(jq '.logicalLayers | length' "$MAPPING_FILE")"

[[ "$physical_count" -eq 12 ]] || { echo "Error: expected 12 physical layers, got $physical_count." >&2; exit 1; }
[[ "$logical_count" -eq 26 ]] || { echo "Error: expected 26 logical layers, got $logical_count." >&2; exit 1; }

for selector in '.physicalLayers[].id' '.physicalLayers[].mvtSourceLayer' '.logicalLayers[].id'; do
  value_count="$(jq -r "$selector" "$MAPPING_FILE" | wc -l | tr -d ' ')"
  unique_count="$(jq -r "$selector" "$MAPPING_FILE" | LC_ALL=C sort -u | wc -l | tr -d ' ')"
  [[ "$value_count" -eq "$unique_count" ]] || { echo "Error: duplicate values for $selector." >&2; exit 1; }
done

while IFS=$'\t' read -r id gpkg_file gpkg_layer geometry_type; do
  source_file="$SOURCE_DIR/$gpkg_file"
  [[ -f "$source_file" ]] || { echo "Error: missing GeoPackage for $id: $source_file" >&2; exit 1; }

  actual_geometry="$(sqlite3 "$source_file" "SELECT geometry_type_name FROM gpkg_geometry_columns WHERE table_name = '$gpkg_layer';")"
  [[ -n "$actual_geometry" ]] || { echo "Error: layer '$gpkg_layer' not found in $gpkg_file." >&2; exit 1; }
  [[ "$actual_geometry" == "$geometry_type" ]] || { echo "Error: geometry mismatch for $id: expected $geometry_type, got $actual_geometry." >&2; exit 1; }

  while IFS= read -r required_field; do
    [[ -z "$required_field" ]] && continue
    field_count="$(sqlite3 "$source_file" "SELECT COUNT(*) FROM pragma_table_info('$gpkg_layer') WHERE lower(name) = lower('$required_field');")"
    [[ "$field_count" -eq 1 ]] || { echo "Error: field '$required_field' missing from $gpkg_file/$gpkg_layer." >&2; exit 1; }
  done < <(jq -r --arg id "$id" '.physicalLayers[] | select(.id == $id) | [.logicalIdFields[], .parentIdFields[]?, (.featureIdentity.inspireIdField // empty), .featureIdentity.fallbackFields[]?, (.derivedFields // {} | to_entries[] | .value.sourceField)] | .[]' "$MAPPING_FILE")
done < <(jq -r '.physicalLayers[] | [.id, .geoPackageFile, .geoPackageLayer, .geometryType] | @tsv' "$MAPPING_FILE")

while IFS=$'\t' read -r logical_id source_layer filter_field filter_value; do
  source_exists="$(jq --arg source "$source_layer" '[.physicalLayers[] | select(.mvtSourceLayer == $source)] | length' "$MAPPING_FILE")"
  [[ "$source_exists" -eq 1 ]] || { echo "Error: logical layer '$logical_id' references unknown source '$source_layer'." >&2; exit 1; }

  if [[ -n "$filter_field" ]]; then
    mapping_count="$(jq --arg source "$source_layer" --arg field "$filter_field" --arg value "$filter_value" '[.physicalLayers[] | select(.mvtSourceLayer == $source) | .derivedFields[$field].values[] | select(. == $value)] | length' "$MAPPING_FILE")"
    [[ "$mapping_count" -eq 1 ]] || { echo "Error: filter '$filter_field=$filter_value' for '$logical_id' is not defined exactly once." >&2; exit 1; }
  fi
done < <(jq -r '.logicalLayers[] | [.id, .sourceLayer, (.filter.field // ""), (.filter.equals // "")] | @tsv' "$MAPPING_FILE")

while IFS=$'\t' read -r id gpkg_file gpkg_layer source_field expected_json; do
  source_file="$SOURCE_DIR/$gpkg_file"
  actual_json="$(sqlite3 -json "$source_file" "SELECT DISTINCT lower(trim(\"$source_field\")) AS value FROM \"$gpkg_layer\" WHERE nullif(trim(\"$source_field\"), '') IS NOT NULL ORDER BY value;" | jq -c '[.[].value]')"
  [[ "$actual_json" == "$expected_json" ]] || {
    echo "Error: observed values for $id/$source_field differ from layer-mapping.json." >&2
    echo "Expected: $expected_json" >&2
    echo "Actual:   $actual_json" >&2
    exit 1
  }
done < <(jq -r '.physicalLayers[] | select(.derivedFields != null) as $layer | $layer.derivedFields | to_entries[] | [$layer.id, $layer.geoPackageFile, $layer.geoPackageLayer, .value.sourceField, (.value.values | keys | sort | tojson)] | @tsv' "$MAPPING_FILE")

mapped_physical_count="$(jq '.logicalLayers as $logical | [.physicalLayers[].mvtSourceLayer | . as $source | select(any($logical[]; .sourceLayer == $source))] | length' "$MAPPING_FILE")"
[[ "$mapped_physical_count" -eq 12 ]] || { echo "Error: every physical source layer must have at least one logical layer." >&2; exit 1; }

if [[ -f "$UI_LAYER_TYPES_FILE" ]]; then
  enum_values="$(sed -n '/export enum MuseovirastoLayer {/,/^}/p' "$UI_LAYER_TYPES_FILE" | sed -n 's/^[^=]*= "\([^"]*\)".*/\1/p' | LC_ALL=C sort)"
  mapping_values="$(jq -r '.logicalLayers[].id' "$MAPPING_FILE" | LC_ALL=C sort)"
  [[ "$enum_values" == "$mapping_values" ]] || {
    echo "Error: logical layer IDs differ from MuseovirastoLayer enum in $UI_LAYER_TYPES_FILE." >&2
    diff -u <(printf '%s\n' "$enum_values") <(printf '%s\n' "$mapping_values") >&2 || true
    exit 1
  }
fi

echo "Layer mapping is valid: $physical_count physical layers and $logical_count logical layers."
