#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DATA_DIR="$PROJECT_DIR/data/tutkija"
BUILD_DIR="$PROJECT_DIR/data/poc"
INTERMEDIATE_DIR="$BUILD_DIR/intermediate"
OUTPUT_FILE="$BUILD_DIR/museovirasto-poc.pmtiles"
MAPPING_FILE="$PROJECT_DIR/layer-mapping.json"
POC_CONFIG="$PROJECT_DIR/poc-layer-config.json"

for command_name in jq ogr2ogr ogrinfo tippecanoe tippecanoe-decode; do
  command -v "$command_name" >/dev/null 2>&1 || {
    echo "Required command not found: $command_name" >&2
    exit 1
  }
done

[[ -d "$DATA_DIR" ]] || { echo "Source data not found: $DATA_DIR" >&2; exit 1; }

EXPECTED_IDS="$(jq -S -c '[.physicalLayers[].mvtSourceLayer] | sort' "$MAPPING_FILE")"
CONFIGURED_IDS="$(jq -S -c '[.layers[].id] | sort' "$POC_CONFIG")"
[[ "$EXPECTED_IDS" == "$CONFIGURED_IDS" ]] || {
  echo "PoC layer configuration does not match layer-mapping.json" >&2
  diff <(echo "$EXPECTED_IDS") <(echo "$CONFIGURED_IDS") || true
  exit 1
}

mkdir -p "$INTERMEDIATE_DIR"
TIPPECANOE_INPUTS=()

while IFS=$'\t' read -r layer_id file_name source_layer excluded_null_geometries sql_base64; do
  source_file="$DATA_DIR/$file_name"
  output_file="$INTERMEDIATE_DIR/$layer_id.fgb"
  sql="$(printf '%s' "$sql_base64" | base64 --decode)"

  [[ -f "$source_file" ]] || { echo "Missing source file: $source_file" >&2; exit 1; }
  if [[ -f "$output_file" ]]; then
    rm -- "$output_file"
  fi
  echo "Exporting $source_layer as $layer_id"
  ogr2ogr -f FlatGeobuf "$output_file" "$source_file" \
    -dialect SQLite -sql "$sql" -t_srs EPSG:4326 -nln "$layer_id"

  source_count="$(ogrinfo -ro -so -json "$source_file" "$source_layer" | jq '.layers[0].featureCount')"
  output_count="$(ogrinfo -ro -so -json "$output_file" "$layer_id" | jq '.layers[0].featureCount')"
  expected_output_count="$((source_count - excluded_null_geometries))"
  [[ "$expected_output_count" -eq "$output_count" ]] || {
    echo "Feature count mismatch for $layer_id: source=$source_count excluded_null=$excluded_null_geometries output=$output_count" >&2
    exit 1
  }
  TIPPECANOE_INPUTS+=("--named-layer=$layer_id:$output_file")
done < <(jq -r '.layers[] | [.id, .geoPackageFile, .geoPackageLayer, (.excludedNullGeometries // 0), (.sql | @base64)] | @tsv' "$POC_CONFIG")

echo "Building $OUTPUT_FILE"
tippecanoe \
  --output="$OUTPUT_FILE" \
  --force \
  --name="Museovirasto map data PoC" \
  --description="Phase 1 proof of concept; 12 physical source layers" \
  --attribution="Museovirasto" \
  --minimum-zoom=0 \
  --maximum-zoom=14 \
  --drop-rate=1 \
  --no-feature-limit \
  --no-tile-size-limit \
  --no-tiny-polygon-reduction \
  --use-attribute-for-id=source_fid \
  --read-parallel \
  --quiet \
  "${TIPPECANOE_INPUTS[@]}"

[[ -s "$OUTPUT_FILE" ]] || { echo "PMTiles output is empty" >&2; exit 1; }

echo "Built PMTiles PoC: $OUTPUT_FILE"
echo "Archive bytes: $(stat -f '%z' "$OUTPUT_FILE")"
echo "GDAL: $(ogr2ogr --version)"
echo "Tippecanoe: $(tippecanoe --version 2>&1)"
