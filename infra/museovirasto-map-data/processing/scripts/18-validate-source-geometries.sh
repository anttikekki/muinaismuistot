#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DATA_DIR="$PROJECT_DIR/data/tutkija"
CONFIG="$PROJECT_DIR/processing/config/layers.json"
REPORT="$PROJECT_DIR/data/build/source-geometry-report.json"
REPORT_TMP="$REPORT.tmp"

for command_name in jq ogrinfo; do
  command -v "$command_name" >/dev/null 2>&1 || { echo "Required command not found: $command_name" >&2; exit 1; }
done

[[ "$(jq -r '.geometryPolicy.invalidGeometry' "$CONFIG")" == "fail" ]] || { echo "Unsupported invalid geometry policy" >&2; exit 1; }
[[ "$(jq -r '.geometryPolicy.repair' "$CONFIG")" == "none" ]] || { echo "Unsupported geometry repair policy" >&2; exit 1; }

printf '{"schemaVersion":1,"policy":' > "$REPORT_TMP"
jq -c '.geometryPolicy' "$CONFIG" >> "$REPORT_TMP"
printf ',"layers":[' >> "$REPORT_TMP"
separator=""
while IFS=$'\t' read -r layer_id file_name source_layer allowed_null; do
  source_file="$DATA_DIR/$file_name"
  [[ -s "$source_file" ]] || { echo "Missing source GeoPackage: $source_file" >&2; exit 1; }
  counts="$(ogrinfo -ro -json -features -dialect SQLite -sql "SELECT COUNT(*) AS total_count, SUM(CASE WHEN geom IS NULL THEN 1 ELSE 0 END) AS null_count, SUM(CASE WHEN geom IS NOT NULL AND ST_IsValid(geom) = 0 THEN 1 ELSE 0 END) AS invalid_count FROM \"$source_layer\"" "$source_file")"
  total="$(jq -r '.layers[0].features[0].properties.total_count' <<<"$counts")"
  nulls="$(jq -r '.layers[0].features[0].properties.null_count // 0' <<<"$counts")"
  invalid="$(jq -r '.layers[0].features[0].properties.invalid_count // 0' <<<"$counts")"
  [[ "$nulls" -eq "$allowed_null" ]] || { echo "Unexpected null geometries in $layer_id: expected=$allowed_null actual=$nulls" >&2; exit 1; }
  [[ "$invalid" -eq 0 ]] || { echo "Invalid geometries in $layer_id: $invalid" >&2; exit 1; }
  printf '%s' "$separator" >> "$REPORT_TMP"
  jq -cn --arg id "$layer_id" --arg file "$file_name" --arg layer "$source_layer" --argjson total "$total" --argjson nulls "$nulls" --argjson invalid "$invalid" \
    '{id:$id,geoPackageFile:$file,geoPackageLayer:$layer,totalCount:$total,nullGeometryCount:$nulls,invalidGeometryCount:$invalid}' >> "$REPORT_TMP"
  separator=","
done < <(jq -r '.layers[] | [.id, .geoPackageFile, .geoPackageLayer, (.excludedNullGeometries // 0)] | @tsv' "$CONFIG")
printf ']}' >> "$REPORT_TMP"
mv "$REPORT_TMP" "$REPORT"
echo "Source geometries are valid. Report: $REPORT"
