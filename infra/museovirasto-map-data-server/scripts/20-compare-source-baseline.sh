#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DATA_DIR="$PROJECT_DIR/data/tutkija"
CONFIG="$PROJECT_DIR/poc-layer-config.json"
BASELINE="$PROJECT_DIR/source-data-baseline.json"
VOCABULARY_BASELINE="$PROJECT_DIR/poc/web/filter-vocabulary.json"
CURRENT_VOCABULARY="$PROJECT_DIR/data/poc/current-filter-vocabulary.json"
REPORT="$PROJECT_DIR/data/poc/source-baseline-report.json"

warning_percent="$(jq -r '.countWarningPercent' "$BASELINE")"
layers='[]'
warning_count=0
while IFS=$'\t' read -r id file layer; do
  current="$(ogrinfo -ro -so -json "$DATA_DIR/$file" "$layer" | jq '.layers[0].featureCount')"
  baseline="$(jq -r --arg id "$id" '.layerCounts[$id]' "$BASELINE")"
  [[ "$current" -gt 0 ]] || { echo "Source layer is empty: $id" >&2; exit 1; }
  change="$(awk -v current="$current" -v baseline="$baseline" 'BEGIN { printf "%.3f", ((current-baseline)/baseline)*100 }')"
  warning="$(awk -v change="$change" -v threshold="$warning_percent" 'BEGIN { if (change < 0) change=-change; if (change > threshold) print "true"; else print "false" }')"
  [[ "$warning" == false ]] || warning_count=$((warning_count + 1))
  entry="$(jq -cn --arg id "$id" --argjson baseline "$baseline" --argjson current "$current" --argjson change "$change" --argjson warning "$warning" '{id:$id,baselineCount:$baseline,currentCount:$current,changePercent:$change,warning:$warning}')"
  layers="$(jq -c --argjson entry "$entry" '. + [$entry]' <<<"$layers")"
done < <(jq -r '.layers[] | [.id,.geoPackageFile,.geoPackageLayer] | @tsv' "$CONFIG")

vocabulary_file="$(jq -r '.filterVocabularySource.geoPackageFile' "$CONFIG")"
vocabulary_layer="$(jq -r '.filterVocabularySource.geoPackageLayer' "$CONFIG")"
node "$SCRIPT_DIR/compact-filter-data.mjs" vocabulary "$DATA_DIR/$vocabulary_file" "$vocabulary_layer" "$CURRENT_VOCABULARY"

vocabulary_changes="$(jq -n --slurpfile baseline "$VOCABULARY_BASELINE" --slurpfile current "$CURRENT_VOCABULARY" '
  def difference(a;b): [a[] | select(. as $value | b | index($value) | not)];
  {newTypes:difference($current[0].types;$baseline[0].types), removedTypes:difference($baseline[0].types;$current[0].types),
   newDatings:difference($current[0].datings;$baseline[0].datings), removedDatings:difference($baseline[0].datings;$current[0].datings),
   newSubtypes:difference($current[0].subtypes;$baseline[0].subtypes), removedSubtypes:difference($baseline[0].subtypes;$current[0].subtypes)}
')"
vocabulary_warning_count="$(jq '[.newTypes,.newDatings,.newSubtypes | length] | add' <<<"$vocabulary_changes")"

jq -n --argjson layers "$layers" --argjson vocabulary "$vocabulary_changes" \
  --argjson warningCount "$((warning_count + vocabulary_warning_count))" \
  '{schemaVersion:1,status:(if $warningCount == 0 then "ok" else "warning" end),warningCount:$warningCount,layers:$layers,vocabulary:$vocabulary}' > "$REPORT"

echo "Source baseline comparison: $(jq -r '.status' "$REPORT"), warnings=$(jq -r '.warningCount' "$REPORT")"
echo "Report: $REPORT"
