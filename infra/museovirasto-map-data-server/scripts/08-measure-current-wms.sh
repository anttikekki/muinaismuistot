#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MAPPING_FILE="$PROJECT_DIR/layer-mapping.json"
OUTPUT_DIR="$PROJECT_DIR/data/performance"
OUTPUT_FILE="$OUTPUT_DIR/current-wms.csv"
WMS_URL="https://geoserver.museovirasto.fi/geoserver/ows"
REPETITIONS="${REPETITIONS:-3}"
MAX_TIME_SECONDS="${MAX_TIME_SECONDS:-30}"

for command_name in curl jq; do
  command -v "$command_name" >/dev/null 2>&1 || {
    echo "Required command not found: $command_name" >&2
    exit 1
  }
done

[[ "$REPETITIONS" =~ ^[1-9][0-9]*$ ]] || {
  echo "REPETITIONS must be a positive integer" >&2
  exit 1
}
[[ "$MAX_TIME_SECONDS" =~ ^[1-9][0-9]*$ ]] || {
  echo "MAX_TIME_SECONDS must be a positive integer" >&2
  exit 1
}

LAYERS="$(jq -r '[.logicalLayers[].id] | join(",")' "$MAPPING_FILE")"
LAYER_COUNT="$(jq '.logicalLayers | length' "$MAPPING_FILE")"
[[ "$LAYER_COUNT" -eq 26 ]] || {
  echo "Expected 26 logical layers, found $LAYER_COUNT" >&2
  exit 1
}

# EPSG:3067 extents: whole Finland, Helsinki city scale and a close view.
SCENARIOS=(
  "finland|50199,6582464,761274,7799839"
  "helsinki|360000,6660000,410000,6710000"
  "local|349788.07056875015,6668060.7755625,354543.4450000001,6672816.149993749"
)

mkdir -p "$OUTPUT_DIR"
printf 'measured_at_utc,scenario,run,curl_exit,http_code,time_starttransfer_seconds,time_total_seconds,size_download_bytes\n' > "$OUTPUT_FILE"

for scenario_definition in "${SCENARIOS[@]}"; do
  scenario="${scenario_definition%%|*}"
  bbox="${scenario_definition#*|}"
  for ((run = 1; run <= REPETITIONS; run++)); do
    measured_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    set +e
    metrics="$(curl --silent --show-error --location \
      --connect-timeout 20 --max-time "$MAX_TIME_SECONDS" \
      --get "$WMS_URL" \
      --data-urlencode "REQUEST=GetMap" \
      --data-urlencode "SERVICE=WMS" \
      --data-urlencode "VERSION=1.3.0" \
      --data-urlencode "FORMAT=image/png" \
      --data-urlencode "STYLES=" \
      --data-urlencode "TRANSPARENT=TRUE" \
      --data-urlencode "LAYERS=$LAYERS" \
      --data-urlencode "TILED=true" \
      --data-urlencode "CQL_FILTER=" \
      --data-urlencode "WIDTH=256" \
      --data-urlencode "HEIGHT=256" \
      --data-urlencode "CRS=EPSG:3067" \
      --data-urlencode "BBOX=$bbox" \
      --output "$OUTPUT_DIR/$scenario-$run.png" \
      --write-out '%{http_code},%{time_starttransfer},%{time_total},%{size_download}')"
    curl_exit="$?"
    set -e
    printf '%s,%s,%s,%s,%s\n' "$measured_at" "$scenario" "$run" "$curl_exit" "$metrics" >> "$OUTPUT_FILE"
    echo "$scenario run $run: curl_exit=$curl_exit, $metrics"
  done
done

echo "Raw measurements: $OUTPUT_FILE"
