#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
POC_DIR="$PROJECT_DIR/poc"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/museovirasto-rollback-test.XXXXXX")"
TEST_PROJECT="$WORK_DIR/project"
export WRANGLER_CWD="$TEST_PROJECT"
BACKUP_DIR="$WORK_DIR/backup"
trap 'rm -rf "$WORK_DIR"' EXIT

mkdir -p "$TEST_PROJECT/dist"
cp "$POC_DIR/wrangler.jsonc" "$TEST_PROJECT/wrangler.jsonc"
cp -R "$POC_DIR/migrations" "$TEST_PROJECT/migrations"
cd "$POC_DIR"
CI=1 ./node_modules/.bin/wrangler --cwd "$TEST_PROJECT" d1 migrations apply museovirasto-map-features-poc --local >/dev/null
./node_modules/.bin/wrangler --cwd "$TEST_PROJECT" d1 execute museovirasto-map-features-poc --local --command \
  "INSERT INTO feature_details (source_layer,feature_id,logical_layer_id,registry_id,name,search_name) VALUES ('vark_areas',1,'rajapinta_suojellut:vark_alueet','100416','Testikohde','testikohde'),('rky_points',2,'rajapinta_suojellut:rky_piste','200','Toinen','toinen')" >/dev/null
printf 'PMTiles-test-data\n' > "$WORK_DIR/current.pmtiles"
printf '{"version":"20260822T000000Z"}\n' > "$WORK_DIR/current.json"
./node_modules/.bin/wrangler r2 object put museovirasto-map-data-poc/current.pmtiles \
  --file "$WORK_DIR/current.pmtiles" --content-type application/vnd.pmtiles --local --cwd "$TEST_PROJECT" >/dev/null
./node_modules/.bin/wrangler r2 object put museovirasto-map-data-poc/current.json \
  --file "$WORK_DIR/current.json" --content-type application/json --local --cwd "$TEST_PROJECT" >/dev/null

"$SCRIPT_DIR/27-backup-local-active-data.sh" "$BACKUP_DIR" >/dev/null
original_metadata_sha="$(shasum -a 256 "$BACKUP_DIR/current.json" | awk '{print $1}')"
printf '{"version":"invalid"}\n' > "$WORK_DIR/invalid-current.json"
./node_modules/.bin/wrangler r2 object put museovirasto-map-data-poc/current.json \
  --file "$WORK_DIR/invalid-current.json" --content-type application/json --local --cwd "$TEST_PROJECT" >/dev/null
./node_modules/.bin/wrangler --cwd "$TEST_PROJECT" d1 execute museovirasto-map-features-poc --local \
  --command 'DELETE FROM feature_details' >/dev/null

"$SCRIPT_DIR/28-restore-local-active-data.sh" "$BACKUP_DIR" >/dev/null
./node_modules/.bin/wrangler r2 object get museovirasto-map-data-poc/current.json \
  --file "$WORK_DIR/restored-current.json" --local --cwd "$TEST_PROJECT" >/dev/null
restored_metadata_sha="$(shasum -a 256 "$WORK_DIR/restored-current.json" | awk '{print $1}')"
restored_count="$(./node_modules/.bin/wrangler --cwd "$TEST_PROJECT" d1 execute museovirasto-map-features-poc --local --json \
  --command 'SELECT COUNT(*) AS count FROM feature_details' | jq -r '.[0].results[0].count')"

[[ "$restored_metadata_sha" == "$original_metadata_sha" ]] || { echo "Metadata rollback failed" >&2; exit 1; }
[[ "$restored_count" == 2 ]] || { echo "D1 rollback failed: expected=2 actual=$restored_count" >&2; exit 1; }
echo "Local isolated rollback test passed: metadata restored, D1 rows=$restored_count"
