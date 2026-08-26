#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DATA_DIR="$PROJECT_DIR/data/tutkija"
BUILD_DIR="$PROJECT_DIR/data/build/feature-details"
OUTPUT_FILE="$PROJECT_DIR/data/build/feature-details.sql"
REPORT_FILE="$PROJECT_DIR/data/build/feature-details-report.json"
IDENTITY_FILE="$PROJECT_DIR/data/build/feature-details-identities.tsv"
IDENTITY_FILE_PART="$IDENTITY_FILE.part"
CONFIG="$PROJECT_DIR/processing/config/layers.json"
MAPPING_FILE="$PROJECT_DIR/contract/layer-mapping.json"
VOCABULARY="$PROJECT_DIR/contract/filter-vocabulary.json"
TRANSFORMER="$SCRIPT_DIR/lib/compact-filter-data.mjs"
BUILD_PLAN="$SCRIPT_DIR/lib/layer-build-plan.mjs"

for command_name in jq ogr2ogr node wc; do
  command -v "$command_name" >/dev/null 2>&1 || { echo "Required command not found: $command_name" >&2; exit 1; }
done
mkdir -p "$BUILD_DIR"
printf "DELETE FROM feature_details;\n" > "$OUTPUT_FILE"
: > "$IDENTITY_FILE_PART"

total_count=0
source_total_count=0
layers='[]'
while IFS=$'\t' read -r layer_id file_name source_layer _transform_profile _low_zoom_centroid excluded_null_geometries sql_base64 _centroid_sql_base64; do
  source_file="$DATA_DIR/$file_name"
  raw_file="$BUILD_DIR/$layer_id.geojsonseq"
  layer_sql="$BUILD_DIR/$layer_id.sql"
  sql="$(printf '%s' "$sql_base64" | base64 --decode)"
  rm -f "$raw_file" "$layer_sql"
  ogr2ogr -f GeoJSONSeq "$raw_file" "$source_file" -dialect SQLite -sql "$sql" -t_srs EPSG:4326 -nln "$layer_id" -overwrite
  node "$TRANSFORMER" details "$MAPPING_FILE" "$layer_id" < "$raw_file" > "$layer_sql"
  jq -r --arg layer "$layer_id" '[$layer, (.properties.gpkg_fid | tostring)] | @tsv' "$raw_file" >> "$IDENTITY_FILE_PART"

  source_count="$(ogrinfo -ro -so -json "$source_file" "$source_layer" | jq '.layers[0].featureCount')"
  expected_count="$((source_count - excluded_null_geometries))"
  actual_count="$(rg -o '^\(' "$layer_sql" | wc -l | tr -d ' ')"
  [[ "$actual_count" -eq "$expected_count" ]] || {
    echo "Feature detail count mismatch for $layer_id: expected=$expected_count actual=$actual_count" >&2; exit 1;
  }
  total_count="$((total_count + actual_count))"
  source_total_count="$((source_total_count + source_count))"
  layer_report="$(jq -cn --arg id "$layer_id" --argjson sourceRows "$source_count" \
    --argjson excludedNullGeometries "$excluded_null_geometries" --argjson d1Rows "$actual_count" \
    '{id:$id,sourceRows:$sourceRows,excludedNullGeometries:$excludedNullGeometries,d1Rows:$d1Rows}')"
  layers="$(jq -c --argjson layer "$layer_report" '. + [$layer]' <<<"$layers")"
  sed -n '1,$p' "$layer_sql" >> "$OUTPUT_FILE"
done < <(node "$BUILD_PLAN" "$MAPPING_FILE" "$CONFIG" "$VOCABULARY")

LC_ALL=C sort -u "$IDENTITY_FILE_PART" > "$IDENTITY_FILE"
rm -f "$IDENTITY_FILE_PART"

jq -n --argjson sourceRows "$source_total_count" --argjson d1Rows "$total_count" --argjson layers "$layers" \
  '{schemaVersion:2,status:"ok",sourceRows:$sourceRows,d1Rows:$d1Rows,geometryCrs:"EPSG:4326",layers:$layers}' > "$REPORT_FILE"
echo "Built D1 feature details import: $OUTPUT_FILE"
echo "Feature rows: $total_count"
echo "SQL bytes: $(wc -c < "$OUTPUT_FILE" | tr -d ' ')"
echo "Report: $REPORT_FILE"
echo "D1 identities: $IDENTITY_FILE"
