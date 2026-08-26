#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
updater_dir="$(cd "$script_dir/.." && pwd)"
infra_dir="$(cd "$updater_dir/../.." && pwd)"
platform="${PLATFORM:-linux/arm64}"
tag="${IMAGE_TAG:-museovirasto-map-data-updater:local}"
architecture="${platform#linux/}"
[[ "$architecture" == arm64 || "$architecture" == amd64 ]] || {
  echo "Unsupported platform: $platform" >&2
  exit 2
}

docker build --platform "$platform" --build-arg TARGETARCH="$architecture" \
  --file "$updater_dir/Dockerfile" --tag "$tag" "$infra_dir"
