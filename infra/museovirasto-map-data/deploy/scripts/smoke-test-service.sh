#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:8787}"
API_PREFIX="${2:-/api/museovirasto}"
HEALTH_PATH="$API_PREFIX/health"
PMTILES_PATH="$API_PREFIX/pmtiles"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/museovirasto-smoke.XXXXXX")"
trap 'rm -rf "$WORK_DIR"' EXIT

for command_name in curl jq grep; do
  command -v "$command_name" >/dev/null 2>&1 || { echo "Required command not found: $command_name" >&2; exit 1; }
done

request_json() {
  local name="$1" method="$2" path="$3" body="${4:-}"
  local output="$WORK_DIR/$name.json" status
  if [[ -n "$body" ]]; then
    status="$(curl --silent --show-error --output "$output" --write-out '%{http_code}' \
      --request "$method" --header 'Content-Type: application/json' --data "$body" "$BASE_URL$path")"
  else
    status="$(curl --silent --show-error --output "$output" --write-out '%{http_code}' \
      --request "$method" "$BASE_URL$path")"
  fi
  [[ "$status" == "200" ]] || { echo "$name failed with HTTP $status: $(cat "$output")" >&2; exit 1; }
  jq -e . "$output" >/dev/null
}

request_json health GET "$HEALTH_PATH"
jq -e '.ok == true and (.version | test("^[0-9]{8}T[0-9]{6}Z$")) and .checks.pmtiles.ok and .checks.metadata.ok and .checks.d1.ok' "$WORK_DIR/health.json" >/dev/null

range_status="$(curl --silent --show-error --output "$WORK_DIR/header.bin" --dump-header "$WORK_DIR/header.txt" \
  --write-out '%{http_code}' --header 'Range: bytes=0-126' "$BASE_URL$PMTILES_PATH")"
[[ "$range_status" == "206" ]] || { echo "PMTiles Range request failed with HTTP $range_status" >&2; exit 1; }
grep -Eqi '^content-range: bytes 0-126/' "$WORK_DIR/header.txt" || { echo "PMTiles response lacks the expected Content-Range" >&2; exit 1; }
[[ "$(LC_ALL=C head -c 7 "$WORK_DIR/header.bin")" == "PMTiles" ]] || { echo "PMTiles header magic is invalid" >&2; exit 1; }

request_json feature POST "$API_PREFIX/features/batch" \
  '{"features":[{"sourceLayer":"vark_alueet","featureId":"1"}]}'
jq -e '.features | length == 1' "$WORK_DIR/feature.json" >/dev/null
jq -e '.features[0].geometry.type != null' "$WORK_DIR/feature.json" >/dev/null

request_json registry POST "$API_PREFIX/features/by-register" \
  '{"features":[{"logicalLayerId":"rajapinta_suojellut:vark_alueet","registryId":"100416"}]}'
jq -e '.features | length >= 1' "$WORK_DIR/registry.json" >/dev/null

request_json search GET "$API_PREFIX/search?q=turun"
jq -e '.results | length >= 1' "$WORK_DIR/search.json" >/dev/null

echo "Smoke test passed: $BASE_URL"
echo "Version: $(jq -r '.version' "$WORK_DIR/health.json")"
