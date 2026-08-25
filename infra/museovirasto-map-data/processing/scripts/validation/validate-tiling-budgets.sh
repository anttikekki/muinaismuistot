#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
CONFIG="$PROJECT_DIR/processing/config/layers.json"
ARCHIVE="$PROJECT_DIR/data/build/museovirasto.pmtiles"
REPORT="$PROJECT_DIR/data/build/tiling-budget-report.json"

header="$(pmtiles show --header-json "$ARCHIVE")"
archive_bytes="$(wc -c < "$ARCHIVE" | tr -d ' ')"
zoom_zero_bytes="$(pmtiles tile "$ARCHIVE" 0 0 0 | wc -c | tr -d ' ')"
minimum_zoom="$(jq -r '.minzoom' <<<"$header")"
maximum_zoom="$(jq -r '.maxzoom' <<<"$header")"
expected_minimum="$(jq -r '.tiling.minimumZoom' "$CONFIG")"
expected_maximum="$(jq -r '.tiling.maximumZoom' "$CONFIG")"
archive_budget="$(jq -r '.budgets.maximumArchiveBytes' "$CONFIG")"
zoom_zero_budget="$(jq -r '.budgets.maximumZoomZeroTileBytes' "$CONFIG")"

[[ "$minimum_zoom" -eq "$expected_minimum" && "$maximum_zoom" -eq "$expected_maximum" ]] || { echo "PMTiles zoom range differs from configuration" >&2; exit 1; }
[[ "$archive_bytes" -le "$archive_budget" ]] || { echo "PMTiles archive budget exceeded" >&2; exit 1; }
[[ "$zoom_zero_bytes" -le "$zoom_zero_budget" ]] || { echo "Zoom 0 tile budget exceeded" >&2; exit 1; }

jq -n --argjson archiveBytes "$archive_bytes" --argjson archiveBudget "$archive_budget" \
  --argjson zoomZeroTileBytes "$zoom_zero_bytes" --argjson zoomZeroBudget "$zoom_zero_budget" \
  --argjson minimumZoom "$minimum_zoom" --argjson maximumZoom "$maximum_zoom" \
  '{schemaVersion:1,status:"ok",minimumZoom:$minimumZoom,maximumZoom:$maximumZoom,archiveBytes:$archiveBytes,maximumArchiveBytes:$archiveBudget,zoomZeroTileBytes:$zoomZeroTileBytes,maximumZoomZeroTileBytes:$zoomZeroBudget}' > "$REPORT"
echo "Tiling budgets are valid. Archive=$archive_bytes/$archive_budget zoom0=$zoom_zero_bytes/$zoom_zero_budget"
