#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
ARCHIVE="${1:-$PROJECT_DIR/data/build/museovirasto.pmtiles}"
D1_LAYER_DIR="${2:-$PROJECT_DIR/data/build/feature-details}"
D1_REPORT="${3:-$PROJECT_DIR/data/build/feature-details-report.json}"
PMTILES_INPUT_DIR="$PROJECT_DIR/data/build/compact-intermediate"
CONFIG="$PROJECT_DIR/processing/config/layers.json"
OUTPUT="$PROJECT_DIR/data/build/pmtiles-d1-identity-report.json"

for command_name in diff jq rg sort tippecanoe-decode; do
  command -v "$command_name" >/dev/null 2>&1 || { echo "Required command not found: $command_name" >&2; exit 1; }
done
[[ -s "$ARCHIVE" ]] || { echo "PMTiles archive not found: $ARCHIVE" >&2; exit 1; }
[[ -s "$D1_REPORT" ]] || { echo "D1 build report not found: $D1_REPORT" >&2; exit 1; }

work_dir="$(mktemp -d "${TMPDIR:-/tmp}/museovirasto-identities.XXXXXX")"
trap 'rm -rf "$work_dir"' EXIT
pmtiles_ids="$work_dir/pmtiles.tsv"
d1_ids="$work_dir/d1.tsv"
pmtiles_input_ids="$work_dir/pmtiles-input.tsv"

tippecanoe-decode "$ARCHIVE" 0 0 0 |
  jq -r '.features[] as $layer | $layer.features[] | [$layer.properties.layer, (.id | tostring)] | @tsv' |
  sort -u > "$pmtiles_ids"

rg --no-filename -o "^\\('[^']+', [0-9]+" "$D1_LAYER_DIR"/*.sql |
  sed -E "s/^\\('([^']+)', ([0-9]+)/\\1\\t\\2/" |
  sort -u > "$d1_ids"

while IFS= read -r layer; do
  jq -r --arg layer "$layer" '[$layer, (.properties.source_fid | tostring)] | @tsv' "$PMTILES_INPUT_DIR/$layer.geojsonseq"
done < <(jq -r '.layers[].id' "$CONFIG") | sort -u > "$pmtiles_input_ids"

if ! diff -u "$d1_ids" "$pmtiles_input_ids" > "$work_dir/input-difference.txt"; then
  echo "PMTiles build inputs and D1 source-layer + fid identities differ:" >&2
  sed -n '1,80p' "$work_dir/input-difference.txt" >&2
  exit 1
fi

comm -23 "$pmtiles_ids" "$d1_ids" > "$work_dir/missing-from-d1.tsv"
if [[ -s "$work_dir/missing-from-d1.tsv" ]]; then
  echo "PMTiles contains source-layer + fid identities missing from D1:" >&2
  sed -n '1,80p' "$work_dir/missing-from-d1.tsv" >&2
  exit 1
fi

pmtiles_rows="$(wc -l < "$pmtiles_ids" | tr -d ' ')"
pmtiles_input_rows="$(wc -l < "$pmtiles_input_ids" | tr -d ' ')"
d1_rows="$(wc -l < "$d1_ids" | tr -d ' ')"
reported_d1_rows="$(jq '.d1Rows' "$D1_REPORT")"
[[ "$d1_rows" -eq "$reported_d1_rows" ]] || {
  echo "D1 identity count differs from D1 build report: identities=$d1_rows report=$reported_d1_rows" >&2
  exit 1
}

pmtiles_layer_counts="$(awk -F '\t' '{ counts[$1]++ } END { for (layer in counts) print layer "\t" counts[layer] }' "$pmtiles_ids" |
  sort |
  jq -Rn '[inputs | split("\t") | {key:.[0],value:(.[1]|tonumber)}] | from_entries')"
d1_layer_counts="$(jq '[.layers[] | {key:.id,value:.d1Rows}] | from_entries' "$D1_REPORT")"

jq -n --argjson pmtilesRows "$pmtiles_rows" --argjson pmtilesInputRows "$pmtiles_input_rows" --argjson d1Rows "$d1_rows" \
  --argjson pmtilesLayers "$pmtiles_layer_counts" --argjson d1Layers "$d1_layer_counts" \
  '{schemaVersion:1,status:"ok",pmtilesBuildInputIdentities:$pmtilesInputRows,d1Identities:$d1Rows,buildInputIdentityDifference:0,pmtilesZoomZeroIdentities:$pmtilesRows,pmtilesIdentitiesMissingFromD1:0,layers:{pmtilesZoomZero:$pmtilesLayers,d1:$d1Layers}}' > "$OUTPUT"
echo "PMTiles build inputs and D1 identities match: $pmtiles_input_rows"
echo "Every zoom 0 PMTiles identity has a D1 row: $pmtiles_rows"
echo "Report: $OUTPUT"
