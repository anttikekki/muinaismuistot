#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DATA_DIR="$PROJECT_DIR/data/tutkija"
BUILD_DIR="$PROJECT_DIR/data/build"
INTERMEDIATE_DIR="$BUILD_DIR/compact-intermediate"
OUTPUT_FILE="$BUILD_DIR/museovirasto.pmtiles"
IDENTITY_FILE="$BUILD_DIR/pmtiles-input-identities.tsv"
IDENTITY_FILE_PART="$IDENTITY_FILE.part"
CONFIG="$PROJECT_DIR/processing/config/layers.json"
MAPPING="$PROJECT_DIR/contract/layer-mapping.json"
VOCABULARY="$PROJECT_DIR/contract/filter-vocabulary.json"
TRANSFORMER="$SCRIPT_DIR/lib/compact-filter-data.mjs"
BUILD_PLAN="$SCRIPT_DIR/lib/layer-build-plan.mjs"

for command_name in jq ogr2ogr ogrinfo tippecanoe node; do
  command -v "$command_name" >/dev/null 2>&1 || { echo "Required command not found: $command_name" >&2; exit 1; }
done

mkdir -p "$INTERMEDIATE_DIR"
[[ -s "$VOCABULARY" ]] || { echo "Version-controlled filter vocabulary missing: $VOCABULARY" >&2; exit 1; }
: > "$IDENTITY_FILE_PART"

TIPPECANOE_INPUTS=()
polygon_min_zoom="$(jq -r '.tiling.polygonMinimumZoom' "$CONFIG")"
centroid_max_zoom="$(jq -r '.tiling.lowZoomCentroidMaximumZoom' "$CONFIG")"
while IFS=$'\t' read -r layer_id file_name source_layer transform_profile low_zoom_centroid excluded_null_geometries sql_base64 centroid_sql_base64; do
  source_file="$DATA_DIR/$file_name"
  output_file="$INTERMEDIATE_DIR/$layer_id.geojsonseq"
  sql="$(printf '%s' "$sql_base64" | base64 --decode)"
  echo "Exporting compact $source_layer as $layer_id"
  if [[ "$low_zoom_centroid" == true ]]; then representation="polygon"; representation_zoom="$polygon_min_zoom"; else representation="default"; representation_zoom=""; fi
  ogr2ogr -f GeoJSONSeq /vsistdout/ "$source_file" -dialect SQLite -sql "$sql" \
    -t_srs EPSG:4326 -nln "$layer_id" |
    node "$TRANSFORMER" transform "$VOCABULARY" "$layer_id" "$transform_profile" "$representation" "$representation_zoom" > "$output_file"

  source_count="$(ogrinfo -ro -so -json "$source_file" "$source_layer" | jq '.layers[0].featureCount')"
  output_count="$(wc -l < "$output_file" | tr -d ' ')"
  expected_output_count="$((source_count - excluded_null_geometries))"
  [[ "$expected_output_count" -eq "$output_count" ]] || {
    echo "Feature count mismatch for $layer_id: expected=$expected_output_count output=$output_count" >&2; exit 1;
  }
  jq -r --arg layer "$layer_id" '[$layer, (.properties.source_fid | tostring)] | @tsv' "$output_file" >> "$IDENTITY_FILE_PART"
  TIPPECANOE_INPUTS+=("--named-layer=$layer_id:$output_file")

  if [[ "$low_zoom_centroid" == true ]]; then
    centroid_file="$INTERMEDIATE_DIR/$layer_id-centroids.geojsonseq"
    centroid_sql="$(printf '%s' "$centroid_sql_base64" | base64 --decode)"
    [[ -n "$centroid_sql" ]] || { echo "Missing centroid SQL for $layer_id" >&2; exit 1; }
    echo "Exporting low-zoom centroids for $layer_id"
    ogr2ogr -f GeoJSONSeq /vsistdout/ "$source_file" -dialect SQLite -sql "$centroid_sql" \
      -t_srs EPSG:4326 -nln "$layer_id" |
      node "$TRANSFORMER" transform "$VOCABULARY" "$layer_id" "$transform_profile" centroid "$centroid_max_zoom" > "$centroid_file"
    centroid_count="$(wc -l < "$centroid_file" | tr -d ' ')"
    [[ "$expected_output_count" -eq "$centroid_count" ]] || {
      echo "Centroid count mismatch for $layer_id: expected=$expected_output_count output=$centroid_count" >&2; exit 1;
    }
    TIPPECANOE_INPUTS+=("--named-layer=$layer_id:$centroid_file")
  fi
done < <(node "$BUILD_PLAN" "$MAPPING" "$CONFIG" "$VOCABULARY")

LC_ALL=C sort -u "$IDENTITY_FILE_PART" > "$IDENTITY_FILE"
rm -f "$IDENTITY_FILE_PART"

minimum_zoom="$(jq -r '.tiling.minimumZoom' "$CONFIG")"
maximum_zoom="$(jq -r '.tiling.maximumZoom' "$CONFIG")"
drop_rate="$(jq -r '.tiling.dropRate' "$CONFIG")"
TIPPECANOE_OPTIONS=(--output="$OUTPUT_FILE" --force --name="Museovirasto map data"
  --description="12 physical Museovirasto source layers" --attribution="Museovirasto"
  --minimum-zoom="$minimum_zoom" --maximum-zoom="$maximum_zoom" --drop-rate="$drop_rate" --no-feature-limit --no-tile-size-limit
  --no-tiny-polygon-reduction --read-parallel --quiet)
TIPPECANOE_OPTIONS+=("--use-attribute-for-id=source_fid")
tippecanoe "${TIPPECANOE_OPTIONS[@]}" "${TIPPECANOE_INPUTS[@]}"

echo "Built PMTiles archive: $OUTPUT_FILE"
echo "Archive bytes: $(wc -c < "$OUTPUT_FILE" | tr -d ' ')"
echo "PMTiles input identities: $IDENTITY_FILE"
