#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
MAPPING_FILE="$PROJECT_DIR/contract/layer-mapping.json"
QML_DIR="$PROJECT_DIR/data/tutkija"
OUTPUT_DIR="$PROJECT_DIR/data/wms-styles"
OUTPUT_FILE="$OUTPUT_DIR/all-logical-layers.sld"
WMS_URL="https://geoserver.museovirasto.fi/geoserver/ows"

for command_name in curl jq xmllint; do
  command -v "$command_name" >/dev/null 2>&1 || {
    echo "Required command not found: $command_name" >&2
    exit 1
  }
done

[[ -f "$MAPPING_FILE" ]] || { echo "Layer mapping not found: $MAPPING_FILE" >&2; exit 1; }
[[ -d "$QML_DIR" ]] || {
  echo "Extracted source data not found: $QML_DIR" >&2
  echo "Run 00-download-source-data.sh first." >&2
  exit 1
}

LOGICAL_LAYER_COUNT="$(jq '.logicalLayers | length' "$MAPPING_FILE")"
[[ "$LOGICAL_LAYER_COUNT" -eq 26 ]] || {
  echo "Expected 26 logical layers, found $LOGICAL_LAYER_COUNT" >&2
  exit 1
}
LOGICAL_LAYERS="$(jq -r '[.logicalLayers[].id] | join(",")' "$MAPPING_FILE")"

mkdir -p "$OUTPUT_DIR"
curl --fail --silent --show-error --location \
  --connect-timeout 20 --max-time 180 --retry 2 \
  --get "$WMS_URL" \
  --data-urlencode "service=WMS" \
  --data-urlencode "version=1.1.1" \
  --data-urlencode "request=GetStyles" \
  --data-urlencode "layers=$LOGICAL_LAYERS" \
  --output "$OUTPUT_FILE"

WMS_LAYER_COUNT="$(xmllint --xpath \
  'count(/*[local-name()="StyledLayerDescriptor"]/*[local-name()="NamedLayer"])' \
  "$OUTPUT_FILE")"
[[ "$WMS_LAYER_COUNT" -eq "$LOGICAL_LAYER_COUNT" ]] || {
  echo "Expected $LOGICAL_LAYER_COUNT WMS styles, found $WMS_LAYER_COUNT" >&2
  exit 1
}

QML_COUNT="$(find "$QML_DIR" -maxdepth 1 -type f -name '*.qml' | wc -l | tr -d ' ')"
[[ "$QML_COUNT" -eq 7 ]] || {
  echo "Expected 7 QML files, found $QML_COUNT" >&2
  exit 1
}

echo "Inventoried $QML_COUNT QML styles and downloaded $WMS_LAYER_COUNT WMS styles."
echo "WMS SLD: $OUTPUT_FILE"
