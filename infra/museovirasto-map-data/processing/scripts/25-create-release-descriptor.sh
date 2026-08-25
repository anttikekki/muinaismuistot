#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
BUILD_DIR="$PROJECT_DIR/data/poc"
BUILD_MANIFEST="$BUILD_DIR/build-manifest.json"
OUTPUT="$BUILD_DIR/release-descriptor.json"
CURRENT_METADATA="$BUILD_DIR/current-metadata.json"

for command_name in jq shasum unzip; do
  command -v "$command_name" >/dev/null 2>&1 || { echo "Required command not found: $command_name" >&2; exit 1; }
done
[[ -s "$BUILD_MANIFEST" ]] || { echo "Build manifest not found: $BUILD_MANIFEST" >&2; exit 1; }

release_version="$(node "$SCRIPT_DIR/release-version.mjs")"
version="$(jq -r '.version' <<<"$release_version")"
published_at="$(jq -r '.publishedAt' <<<"$release_version")"
pmtiles="$(jq -c '.artifacts[] | select(.path == "museovirasto-poc-compact.pmtiles")' "$BUILD_MANIFEST")"
d1="$(jq -c '.artifacts[] | select(.path == "feature-details.sql")' "$BUILD_MANIFEST")"
vocabulary="$(jq -c '.artifacts[] | select(.path == "filter-vocabulary.json")' "$BUILD_MANIFEST")"

jq -n \
  --arg version "$version" --arg publishedAt "$published_at" \
  --arg createdAt "$(jq -r '.createdAt' "$BUILD_MANIFEST")" \
  --arg sourceDigest "$(jq -r '.sourceDigest' "$BUILD_MANIFEST")" \
  --argjson pmtiles "$pmtiles" --argjson d1 "$d1" --argjson vocabulary "$vocabulary" \
  --argjson counts "$(jq -c '.counts' "$BUILD_MANIFEST")" \
  '{schemaVersion:2,version:$version,publishedAt:$publishedAt,state:"built",createdAt:$createdAt,sourceDigest:$sourceDigest,
    compatibility:{mvtSchemaVersion:1,filterVocabularySchemaVersion:2,apiSchemaVersion:1},counts:$counts,
    artifacts:{
      pmtiles:($pmtiles + {activeR2Key:"current.pmtiles",backupR2Key:("releases/"+$version+"/map.pmtiles"),contentType:"application/vnd.pmtiles"}),
      d1Import:$d1,
      filterVocabulary:($vocabulary + {backupR2Key:("releases/"+$version+"/filter-vocabulary.json"),contentType:"application/json"}),
      metadata:{activeR2Key:"current.json",backupR2Key:("releases/"+$version+"/release.json"),contentType:"application/json"}
    },
    endpoints:{pmtiles:"/api/museovirasto/pmtiles",metadata:"/api/museovirasto/meta",health:"/api/museovirasto/health",featureBatch:"/api/museovirasto/features/batch",registryBatch:"/api/museovirasto/features/by-register",search:"/api/museovirasto/search"}}' > "$OUTPUT"

jq '{schemaVersion,version,publishedAt,createdAt,sourceDigest,compatibility,counts,endpoints,integrity:{pmtilesSha256:.artifacts.pmtiles.sha256,d1ImportSha256:.artifacts.d1Import.sha256}}' \
  "$OUTPUT" > "$CURRENT_METADATA"

[[ "$(jq -r '.version' "$OUTPUT")" == "$version" ]] || { echo "Release descriptor validation failed" >&2; exit 1; }
[[ "$(jq -r '.artifacts.pmtiles.sha256' "$OUTPUT")" == "$(shasum -a 256 "$BUILD_DIR/museovirasto-poc-compact.pmtiles" | awk '{print $1}')" ]] || {
  echo "Release PMTiles digest differs from the built artifact" >&2; exit 1;
}
[[ "$(jq -r '.artifacts.d1Import.sha256' "$OUTPUT")" == "$(shasum -a 256 "$BUILD_DIR/feature-details.sql" | awk '{print $1}')" ]] || {
  echo "Release D1 digest differs from the built artifact" >&2; exit 1;
}

echo "Release descriptor created: $version"
echo "Descriptor: $OUTPUT"
echo "Optional current metadata: $CURRENT_METADATA"
