#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DATA_DIR="$PROJECT_DIR/data/tutkija"
BUILD_DIR="$PROJECT_DIR/data/poc"
INTERMEDIATE_DIR="$BUILD_DIR/compact-intermediate"
OUTPUT_FILE="$BUILD_DIR/museovirasto-poc-compact.pmtiles"
POC_CONFIG="$PROJECT_DIR/poc-layer-config.json"
VOCABULARY="$PROJECT_DIR/poc/web/filter-vocabulary.json"
TRANSFORMER="$SCRIPT_DIR/compact-filter-data.mjs"

for command_name in jq ogr2ogr ogrinfo tippecanoe node; do
  command -v "$command_name" >/dev/null 2>&1 || { echo "Required command not found: $command_name" >&2; exit 1; }
done

mkdir -p "$INTERMEDIATE_DIR"
node "$TRANSFORMER" vocabulary \
  "$DATA_DIR/arkeologiset_kohteet_piste_t.gpkg" arkeologiset_kohteet_piste_t "$VOCABULARY"

TIPPECANOE_INPUTS=()
while IFS=$'\t' read -r layer_id file_name source_layer excluded_null_geometries excluded_duplicate_features sql_base64; do
  source_file="$DATA_DIR/$file_name"
  output_file="$INTERMEDIATE_DIR/$layer_id.geojsonseq"
  sql="$(printf '%s' "$sql_base64" | base64 --decode)"
  sql="${sql/SELECT /SELECT fid AS gpkg_fid, }"
  echo "Exporting compact $source_layer as $layer_id"
  ogr2ogr -f GeoJSONSeq /vsistdout/ "$source_file" -dialect SQLite -sql "$sql" \
    -t_srs EPSG:4326 -nln "$layer_id" |
    node "$TRANSFORMER" transform "$VOCABULARY" "$layer_id" > "$output_file"

  source_count="$(ogrinfo -ro -so -json "$source_file" "$source_layer" | jq '.layers[0].featureCount')"
  output_count="$(wc -l < "$output_file" | tr -d ' ')"
  expected_output_count="$((source_count - excluded_null_geometries - excluded_duplicate_features))"
  [[ "$expected_output_count" -eq "$output_count" ]] || {
    echo "Feature count mismatch for $layer_id: expected=$expected_output_count output=$output_count" >&2; exit 1;
  }
  TIPPECANOE_INPUTS+=("--named-layer=$layer_id:$output_file")

  if [[ "$layer_id" == *_areas ]]; then
    centroid_file="$INTERMEDIATE_DIR/$layer_id-centroids.geojsonseq"
    centroid_sql="${sql/, geom FROM/, ST_Centroid(geom) AS geom FROM}"
    [[ "$centroid_sql" != "$sql" ]] || { echo "Could not derive centroid SQL for $layer_id" >&2; exit 1; }
    echo "Exporting low-zoom centroids for $layer_id"
    ogr2ogr -f GeoJSONSeq /vsistdout/ "$source_file" -dialect SQLite -sql "$centroid_sql" \
      -t_srs EPSG:4326 -nln "$layer_id" |
      node "$TRANSFORMER" transform "$VOCABULARY" "$layer_id" centroid > "$centroid_file"
    centroid_count="$(wc -l < "$centroid_file" | tr -d ' ')"
    [[ "$expected_output_count" -eq "$centroid_count" ]] || {
      echo "Centroid count mismatch for $layer_id: expected=$expected_output_count output=$centroid_count" >&2; exit 1;
    }
    TIPPECANOE_INPUTS+=("--named-layer=$layer_id:$centroid_file")
  fi
done < <(jq -r '.layers[] | [.id, .geoPackageFile, .geoPackageLayer, (.excludedNullGeometries // 0), 0, (.sql | @base64)] | @tsv' "$POC_CONFIG")

tippecanoe --output="$OUTPUT_FILE" --force --name="Museovirasto compact map data PoC" \
  --description="Compact filter-field comparison; 12 physical source layers" --attribution="Museovirasto" \
  --minimum-zoom=0 --maximum-zoom=14 --drop-rate=1 --no-feature-limit --no-tile-size-limit \
  --no-tiny-polygon-reduction --use-attribute-for-id=source_fid --read-parallel --quiet \
  "${TIPPECANOE_INPUTS[@]}"

echo "Built compact PMTiles PoC: $OUTPUT_FILE"
echo "Baseline bytes: $(stat -f '%z' "$BUILD_DIR/museovirasto-poc.pmtiles")"
echo "Compact bytes:  $(stat -f '%z' "$OUTPUT_FILE")"
