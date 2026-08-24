#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPOSITORY_DIR="$(cd "$PROJECT_DIR/../.." && pwd)"
WORKER_DIR="$REPOSITORY_DIR/infra/muinaismuistot-worker"
WRANGLER_CONFIG="$WORKER_DIR/wrangler.jsonc"
DATA_DIR="$PROJECT_DIR/data/poc"
ARCHIVE="$DATA_DIR/museovirasto-poc-compact.pmtiles"
METADATA="$DATA_DIR/current-metadata.json"
IMPORT_FILE="$DATA_DIR/feature-details.sql"

usage() {
  echo "Usage: $0 <preview|production> [base-url] [--confirm-production]" >&2
}

environment_name="${1:-}"
case "$environment_name" in
  preview) default_base_url="https://muinaismuistot-preview.antti-kekki.workers.dev" ;;
  production) default_base_url="https://muinaismuistot.info" ;;
  *) usage; exit 2 ;;
esac

if [[ "${2:-}" == "--confirm-production" ]]; then
  base_url="$default_base_url"
  confirmation="$2"
else
  base_url="${2:-$default_base_url}"
  confirmation="${3:-}"
fi
if [[ "$environment_name" == "production" && "$confirmation" != "--confirm-production" ]]; then
  echo "Production publication requires the explicit --confirm-production argument." >&2
  usage
  exit 2
fi

for command_name in jq curl rg; do
  command -v "$command_name" >/dev/null 2>&1 || {
    echo "Required command not found: $command_name" >&2
    exit 1
  }
done

[[ -x "$WORKER_DIR/node_modules/.bin/wrangler" ]] || {
  echo "Worker dependencies missing. Run npm install in $WORKER_DIR first." >&2
  exit 1
}
for artifact in "$ARCHIVE" "$METADATA" "$IMPORT_FILE"; do
  [[ -s "$artifact" ]] || { echo "Release artifact missing or empty: $artifact" >&2; exit 1; }
done
jq -e '.version | type == "string" and test("^[0-9]{8}T[0-9]{6}Z$")' "$METADATA" >/dev/null

bucket_name="$(jq -er --arg environment "$environment_name" '
  .env[$environment].r2_buckets[]
  | select(.binding == "MAP_DATA")
  | .bucket_name // empty
' "$WRANGLER_CONFIG" 2>/dev/null || true)"
database_id="$(jq -er --arg environment "$environment_name" '
  .env[$environment].d1_databases[]
  | select(.binding == "MAP_FEATURES")
  | .database_id // empty
' "$WRANGLER_CONFIG" 2>/dev/null || true)"
if [[ -z "$bucket_name" || -z "$database_id" ]]; then
  echo "Cloudflare resources for '$environment_name' have not been provisioned in $WRANGLER_CONFIG." >&2
  echo "Deploy the Worker to that environment first, review the generated resource identifiers, and rerun this script." >&2
  exit 1
fi

wrangler="$WORKER_DIR/node_modules/.bin/wrangler"
cd "$WORKER_DIR"

echo "Publishing Museovirasto release to $environment_name"
echo "R2 bucket: $bucket_name"
echo "D1 database ID: $database_id"

CI=1 "$wrangler" d1 migrations apply MAP_FEATURES --env "$environment_name" --remote
"$wrangler" d1 execute MAP_FEATURES --env "$environment_name" --remote --yes --file "$IMPORT_FILE"
"$wrangler" r2 object put "$bucket_name/current.pmtiles" \
  --env "$environment_name" --remote --file "$ARCHIVE" --content-type application/vnd.pmtiles
"$wrangler" r2 object put "$bucket_name/current.json" \
  --env "$environment_name" --remote --file "$METADATA" --content-type application/json

"$SCRIPT_DIR/26-smoke-test-service.sh" "$base_url" "/api/museovirasto"
echo "Published and smoke-tested $environment_name release: $(jq -r '.version' "$METADATA")"
