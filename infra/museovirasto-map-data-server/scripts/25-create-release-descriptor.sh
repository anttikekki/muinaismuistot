#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BUILD_DIR="$PROJECT_DIR/data/poc"
BUILD_MANIFEST="$BUILD_DIR/build-manifest.json"
OUTPUT="$BUILD_DIR/release-descriptor.json"
CURRENT_CANDIDATE="$BUILD_DIR/current-candidate.json"

for command_name in jq shasum; do
  command -v "$command_name" >/dev/null 2>&1 || { echo "Required command not found: $command_name" >&2; exit 1; }
done
[[ -s "$BUILD_MANIFEST" ]] || { echo "Build manifest not found: $BUILD_MANIFEST" >&2; exit 1; }

release_input="$(jq -cS '{schemaVersion:1,sourceDigest,configuration,artifacts:[.artifacts[] | select(.path == "museovirasto-poc-compact.pmtiles" or .path == "feature-details.sql" or .path == "filter-vocabulary.json") | {path,sha256}]}' "$BUILD_MANIFEST")"
release_digest="$(printf '%s' "$release_input" | shasum -a 256 | awk '{print $1}')"
release_id="museovirasto-${release_digest:0:20}"

pmtiles="$(jq -c '.artifacts[] | select(.path == "museovirasto-poc-compact.pmtiles")' "$BUILD_MANIFEST")"
d1="$(jq -c '.artifacts[] | select(.path == "feature-details.sql")' "$BUILD_MANIFEST")"
vocabulary="$(jq -c '.artifacts[] | select(.path == "filter-vocabulary.json")' "$BUILD_MANIFEST")"

jq -n \
  --arg releaseId "$release_id" --arg releaseDigest "$release_digest" \
  --arg createdAt "$(jq -r '.createdAt' "$BUILD_MANIFEST")" \
  --arg sourceDigest "$(jq -r '.sourceDigest' "$BUILD_MANIFEST")" \
  --argjson pmtiles "$pmtiles" --argjson d1 "$d1" --argjson vocabulary "$vocabulary" \
  --argjson counts "$(jq -c '.counts' "$BUILD_MANIFEST")" \
  '{schemaVersion:1,releaseId:$releaseId,releaseDigest:$releaseDigest,state:"built",createdAt:$createdAt,sourceDigest:$sourceDigest,
    compatibility:{mvtSchemaVersion:1,filterVocabularySchemaVersion:2,apiSchemaVersion:1},counts:$counts,
    artifacts:{
      pmtiles:($pmtiles + {r2Key:("datasets/"+$releaseId+"/map.pmtiles"),contentType:"application/vnd.pmtiles"}),
      d1Import:($d1 + {releaseId:$releaseId}),
      filterVocabulary:($vocabulary + {r2Key:("datasets/"+$releaseId+"/filter-vocabulary.json"),contentType:"application/json"}),
      releaseMetadata:{r2Key:("datasets/"+$releaseId+"/release.json"),contentType:"application/json"}
    },
    endpoints:{pmtiles:("/pmtiles/"+$releaseId+".pmtiles"),metadata:("/api/releases/"+$releaseId),featureBatch:"/api/features/batch",registryBatch:"/api/features/by-register",search:"/api/search"}}
  ' > "$OUTPUT"

jq -n --arg releaseId "$release_id" \
  --arg metadataUrl "/api/releases/$release_id" \
  --arg pmtilesUrl "/pmtiles/$release_id.pmtiles" \
  '{schemaVersion:1,state:"candidate",releaseId:$releaseId,metadataUrl:$metadataUrl,pmtilesUrl:$pmtilesUrl}' > "$CURRENT_CANDIDATE"

[[ "$(jq -r '.releaseId' "$OUTPUT")" == "$release_id" ]] || { echo "Release descriptor validation failed" >&2; exit 1; }
[[ "$(jq -r '.artifacts.pmtiles.sha256' "$OUTPUT")" == "$(shasum -a 256 "$BUILD_DIR/museovirasto-poc-compact.pmtiles" | awk '{print $1}')" ]] || {
  echo "Release PMTiles digest differs from the built artifact" >&2; exit 1;
}
[[ "$(jq -r '.artifacts.d1Import.sha256' "$OUTPUT")" == "$(shasum -a 256 "$BUILD_DIR/feature-details.sql" | awk '{print $1}')" ]] || {
  echo "Release D1 digest differs from the built artifact" >&2; exit 1;
}

echo "Release descriptor created: $release_id"
echo "Descriptor: $OUTPUT"
echo "Inactive current candidate: $CURRENT_CANDIDATE"
