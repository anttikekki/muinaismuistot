#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
IDENTITY_MODE=registry "$PROJECT_DIR/processing/scripts/13-build-compact-pmtiles-poc.sh"
FID_ARCHIVE="$PROJECT_DIR/data/poc/museovirasto-poc-compact.pmtiles"
REGISTRY_ARCHIVE="$PROJECT_DIR/data/poc/museovirasto-poc-registry.pmtiles"
PMTILES="$PROJECT_DIR/data/tools/pmtiles"

fid_bytes="$(stat -f '%z' "$FID_ARCHIVE")"
registry_bytes="$(stat -f '%z' "$REGISTRY_ARCHIVE")"
fid_z0="$("$PMTILES" tile "$FID_ARCHIVE" 0 0 0 | wc -c | tr -d ' ')"
registry_z0="$("$PMTILES" tile "$REGISTRY_ARCHIVE" 0 0 0 | wc -c | tr -d ' ')"

jq -n --argjson fidBytes "$fid_bytes" --argjson registryBytes "$registry_bytes" \
  --argjson fidZoomZeroBytes "$fid_z0" --argjson registryZoomZeroBytes "$registry_z0" \
  '{schemaVersion:1,fid:{archiveBytes:$fidBytes,zoomZeroTileBytes:$fidZoomZeroBytes},registry:{archiveBytes:$registryBytes,zoomZeroTileBytes:$registryZoomZeroBytes},difference:{archiveBytes:($registryBytes-$fidBytes),zoomZeroTileBytes:($registryZoomZeroBytes-$fidZoomZeroBytes)}}' \
  > "$PROJECT_DIR/data/poc/identity-model-comparison.json"

archive_change="$(awk -v fid="$fid_bytes" -v registry="$registry_bytes" 'BEGIN { printf "%.1f", (registry-fid)*100/fid }')"
z0_change="$(awk -v fid="$fid_z0" -v registry="$registry_z0" 'BEGIN { printf "%.1f", (registry-fid)*100/fid }')"
echo "Identity comparison built: fid=$fid_bytes registry=$registry_bytes archive_change=${archive_change}% z0_change=${z0_change}%"
