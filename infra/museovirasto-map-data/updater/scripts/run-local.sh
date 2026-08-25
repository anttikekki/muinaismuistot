#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
updater_dir="$(cd "$script_dir/.." && pwd)"
map_data_dir="$(cd "$updater_dir/.." && pwd)"
output_dir="${OUTPUT_DIR:-$map_data_dir/data/updater-local}"
tag="${IMAGE_TAG:-museovirasto-map-data-updater:local}"
environment_name="${TARGET_ENV:-preview}"

docker run --rm --platform "${PLATFORM:-linux/arm64}" \
  --env TARGET_ENV="$environment_name" --env UPDATE_MODE=build --env OUTPUT_DIR=/output \
  --publish 8080:8080 \
  --volume "$output_dir:/output" \
  "$tag"
