#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DATA_DIR="$PROJECT_DIR/data/tutkija"
CONFIG="$PROJECT_DIR/processing/config/layers.json"
MAPPING="$PROJECT_DIR/contract/layer-mapping.json"

for command_name in jq ogrinfo; do
  command -v "$command_name" >/dev/null 2>&1 || { echo "Required command not found: $command_name" >&2; exit 1; }
done

while IFS=$'\t' read -r layer_id file_name source_layer expected_geometry allowed_null; do
  source_file="$DATA_DIR/$file_name"
  [[ -s "$source_file" ]] || { echo "Missing source GeoPackage: $source_file" >&2; exit 1; }

  metadata="$(ogrinfo -ro -so -json "$source_file" "$source_layer")"
  total="$(jq -r '.layers[0].featureCount // 0' <<<"$metadata")"
  actual_geometry="$(jq -r '.layers[0].geometryFields[0].type // empty | ascii_upcase | gsub(" "; "")' <<<"$metadata")"
  authority="$(jq -r '.layers[0].geometryFields[0].coordinateSystem.projjson.id | select(.authority == "EPSG") | .code // empty' <<<"$metadata")"
  [[ "$total" -gt 0 ]] || { echo "Source layer is empty: $layer_id" >&2; exit 1; }
  [[ "$actual_geometry" == "$expected_geometry" ]] || {
    echo "Geometry type changed in $layer_id: expected=$expected_geometry actual=$actual_geometry" >&2; exit 1;
  }
  [[ "$authority" == "3067" ]] || {
    echo "Coordinate system changed in $layer_id: expected EPSG:3067" >&2; exit 1;
  }

  counts="$(ogrinfo -ro -json -features -dialect SQLite -sql "SELECT COUNT(*) AS total_count, SUM(CASE WHEN geom IS NULL THEN 1 ELSE 0 END) AS null_count, SUM(CASE WHEN geom IS NOT NULL AND ST_IsValid(geom) = 0 THEN 1 ELSE 0 END) AS invalid_count FROM \"$source_layer\"" "$source_file")"
  nulls="$(jq -r '.layers[0].features[0].properties.null_count // 0' <<<"$counts")"
  invalid="$(jq -r '.layers[0].features[0].properties.invalid_count // 0' <<<"$counts")"
  [[ "$nulls" -eq "$allowed_null" ]] || { echo "Unexpected null geometries in $layer_id: expected=$allowed_null actual=$nulls" >&2; exit 1; }
  [[ "$invalid" -eq 0 ]] || { echo "Invalid geometries in $layer_id: $invalid" >&2; exit 1; }
done < <(jq -r --slurpfile config "$CONFIG" '.physicalLayers[] | . as $layer | [$layer.id, $layer.geoPackageFile, $layer.geoPackageLayer, $layer.geometryType, ($config[0].layers[] | select(.id == $layer.id) | (.excludedNullGeometries // 0))] | @tsv' "$MAPPING")

layer_count="$(jq '.physicalLayers | length' "$MAPPING")"
echo "Source data is valid: $layer_count non-empty EPSG:3067 layers with expected geometry types."
