#!/usr/bin/env bash
set -euo pipefail

environment_name="${1:-}"
update_mode="${2:-build}"
project_dir=/workspace/infra/museovirasto-map-data

[[ "$environment_name" == preview || "$environment_name" == production ]] || {
  echo "Expected preview or production environment" >&2
  exit 2
}
[[ "$update_mode" == build || "$update_mode" == publish ]] || {
  echo "Expected build or publish mode" >&2
  exit 2
}

rm -rf "$project_dir/data"

"$project_dir/processing/scripts/run.sh"

if [[ "$update_mode" == publish ]]; then
  export SKIP_E2E=1
  export WRANGLER_BIN="$project_dir/updater/node_modules/.bin/wrangler"
  if [[ "$environment_name" == production ]]; then
    "$project_dir/deploy/scripts/30-publish-cloudflare-release.sh" production --confirm-production
  else
    "$project_dir/deploy/scripts/30-publish-cloudflare-release.sh" preview
  fi
fi

if [[ -n "${OUTPUT_DIR:-}" ]]; then
  mkdir -p "$OUTPUT_DIR"
  cp "$project_dir/data/build/museovirasto.pmtiles" \
    "$project_dir/data/build/feature-details.sql" \
    "$project_dir/data/build/build-manifest.json" \
    "$project_dir/data/build/release-descriptor.json" \
    "$project_dir/data/build/current-metadata.json" \
    "$OUTPUT_DIR/"
fi
