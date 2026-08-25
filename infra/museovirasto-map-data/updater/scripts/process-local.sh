#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
updater_dir="$(cd "$script_dir/.." && pwd)"
map_data_dir="$(cd "$updater_dir/.." && pwd)"
output_dir="${OUTPUT_DIR:-$map_data_dir/data/updater-local}"
tag="${IMAGE_TAG:-museovirasto-map-data-updater:local}"
platform="${PLATFORM:-linux/arm64}"

PLATFORM="$platform" IMAGE_TAG="$tag" "$script_dir/build-image.sh"
mkdir -p "$output_dir"

docker run --rm --platform "$platform" \
  --env OUTPUT_DIR=/output \
  --volume "$output_dir:/output" \
  --entrypoint /workspace/infra/museovirasto-map-data/updater/container/run-update.sh \
  "$tag" preview build
