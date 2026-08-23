#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DATA_DIR="$PROJECT_DIR/data/tutkija"
BUILD_DIR="$PROJECT_DIR/data/poc"
CONFIG="$PROJECT_DIR/poc-layer-config.json"
MANIFEST="$BUILD_DIR/build-manifest.json"
MANIFEST_TMP="$MANIFEST.tmp"

sha256() { shasum -a 256 "$1" | awk '{print $1}'; }
file_entry() {
  local path="$1" label="$2"
  jq -cn --arg path "$label" --arg sha256 "$(sha256 "$path")" --argjson bytes "$(stat -f '%z' "$path")" '{path:$path,sha256:$sha256,bytes:$bytes}'
}

sources='[]'
while IFS= read -r file_name; do
  sources="$(jq -c --argjson entry "$(file_entry "$DATA_DIR/$file_name" "$file_name")" '. + [$entry]' <<<"$sources")"
done < <(jq -r '[.layers[].geoPackageFile] | unique | sort[]' "$CONFIG")

artifacts="$(jq -cn \
  --argjson pmtiles "$(file_entry "$BUILD_DIR/museovirasto-poc-compact.pmtiles" "museovirasto-poc-compact.pmtiles")" \
  --argjson vocabulary "$(file_entry "$PROJECT_DIR/poc/web/filter-vocabulary.json" "filter-vocabulary.json")" \
  --argjson d1 "$(file_entry "$BUILD_DIR/feature-details.sql" "feature-details.sql")" \
  --argjson d1Report "$(file_entry "$BUILD_DIR/feature-details-report.json" "feature-details-report.json")" \
  --argjson identityReport "$(file_entry "$BUILD_DIR/pmtiles-d1-identity-report.json" "pmtiles-d1-identity-report.json")" \
  --argjson geometry "$(file_entry "$BUILD_DIR/source-geometry-report.json" "source-geometry-report.json")" \
  --argjson baseline "$(file_entry "$BUILD_DIR/source-baseline-report.json" "source-baseline-report.json")" \
  --argjson tiling "$(file_entry "$BUILD_DIR/tiling-budget-report.json" "tiling-budget-report.json")" \
  '[$pmtiles,$vocabulary,$d1,$d1Report,$identityReport,$geometry,$baseline,$tiling]')"

d1_rows="$(jq -r '.d1Rows' "$BUILD_DIR/feature-details-report.json")"

jq -n \
  --arg createdAt "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
  --arg sourceDigest "$(printf '%s' "$sources" | shasum -a 256 | awk '{print $1}')" \
  --arg buildConfigSha256 "$(sha256 "$CONFIG")" \
  --arg layerMappingSha256 "$(sha256 "$PROJECT_DIR/layer-mapping.json")" \
  --arg filterVocabularySha256 "$(sha256 "$PROJECT_DIR/poc/web/filter-vocabulary.json")" \
  --argjson tools "$(cat "$PROJECT_DIR/build-tool-versions.json")" \
  --argjson sources "$sources" --argjson artifacts "$artifacts" --argjson d1Rows "$d1_rows" \
  '{schemaVersion:1,createdAt:$createdAt,sourceDigest:$sourceDigest,configuration:{buildConfigSha256:$buildConfigSha256,layerMappingSha256:$layerMappingSha256,filterVocabularySha256:$filterVocabularySha256},tools:$tools,sources:$sources,artifacts:$artifacts,counts:{physicalLayers:12,logicalLayers:26,d1Rows:$d1Rows}}' > "$MANIFEST_TMP"
mv "$MANIFEST_TMP" "$MANIFEST"
echo "Build manifest created: $MANIFEST"
