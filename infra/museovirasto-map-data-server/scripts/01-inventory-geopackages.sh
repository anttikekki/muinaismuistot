#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="${1:-$PROJECT_DIR/data/tutkija}"
OUTPUT_FILE="${2:-$PROJECT_DIR/SOURCE_DATA_INVENTORY.md}"

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "Error: 'sqlite3' is required." >&2
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Error: source directory does not exist: $SOURCE_DIR" >&2
  echo "Run $SCRIPT_DIR/00-download-source-data.sh first." >&2
  exit 1
fi

mapfile_compat() {
  while IFS= read -r line; do
    GPKG_FILES+=("$line")
  done
}

GPKG_FILES=()
mapfile_compat < <(find "$SOURCE_DIR" -type f -name '*.gpkg' -print | LC_ALL=C sort)

if [[ ${#GPKG_FILES[@]} -eq 0 ]]; then
  echo "Error: no GeoPackage files found in $SOURCE_DIR" >&2
  exit 1
fi

TEMP_FILE="$OUTPUT_FILE.tmp"
trap 'rm -f "$TEMP_FILE"' EXIT

{
  echo "# Museoviraston lähdeaineiston GeoPackage-inventaario"
  echo
  echo "Tämä tiedosto on generoitu komennolla:"
  echo
  echo '```bash'
  echo "infra/museovirasto-map-data-server/scripts/01-inventory-geopackages.sh"
  echo '```'
  echo
  echo "Lähde: \`tutkija.zip\`"
  echo
  echo "GeoPackage-tiedostoja: ${#GPKG_FILES[@]}"
  echo
} > "$TEMP_FILE"

for gpkg_file in "${GPKG_FILES[@]}"; do
  relative_file="${gpkg_file#"$SOURCE_DIR"/}"
  echo "Inspecting $relative_file"

  if ! sqlite3 "$gpkg_file" "SELECT 1 FROM gpkg_contents LIMIT 1;" >/dev/null; then
    echo "Error: invalid GeoPackage or missing gpkg_contents: $gpkg_file" >&2
    exit 1
  fi

  {
    echo "## \`$relative_file\`"
    echo
  } >> "$TEMP_FILE"

  layer_rows="$(sqlite3 -tabs "$gpkg_file" \
    "SELECT c.table_name,
            COALESCE(g.geometry_type_name, '-'),
            c.srs_id,
            COALESCE(s.organization || ':' || s.organization_coordsys_id, '-'),
            COALESCE(s.srs_name, '-')
       FROM gpkg_contents c
       LEFT JOIN gpkg_geometry_columns g ON g.table_name = c.table_name
       LEFT JOIN gpkg_spatial_ref_sys s ON s.srs_id = c.srs_id
      WHERE c.data_type = 'features'
      ORDER BY c.table_name;")"

  if [[ -z "$layer_rows" ]]; then
    echo "Ei kohdetasoja." >> "$TEMP_FILE"
    echo >> "$TEMP_FILE"
    continue
  fi

  while IFS=$'\t' read -r layer_name geometry_type srs_id authority srs_name; do
    escaped_identifier="${layer_name//\"/\"\"}"
    escaped_literal="${layer_name//\'/\'\'}"
    feature_count="$(sqlite3 "$gpkg_file" "SELECT COUNT(*) FROM \"$escaped_identifier\";")"

    {
      echo "### \`$layer_name\`"
      echo
      echo "- Tietueita: $feature_count"
      echo "- Geometriatyyppi: \`$geometry_type\`"
      echo "- Koordinaattijärjestelmä: \`$authority\` (GeoPackage SRS ID \`$srs_id\`, $srs_name)"
      echo
      echo "| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |"
      echo "| --- | --- | --- | --- | --- |"
    } >> "$TEMP_FILE"

    sqlite3 -tabs "$gpkg_file" \
      "SELECT name,
              CASE WHEN type = '' THEN '-' ELSE type END,
              CASE WHEN \"notnull\" = 1 THEN 'kyllä' ELSE 'ei' END,
              COALESCE(dflt_value, '-'),
              CASE WHEN pk > 0 THEN 'kyllä' ELSE 'ei' END
         FROM pragma_table_info('$escaped_literal')
        ORDER BY cid;" |
      while IFS=$'\t' read -r field_name field_type required default_value primary_key; do
        field_name="${field_name//|/\\|}"
        default_value="${default_value//|/\\|}"
        echo "| \`$field_name\` | \`$field_type\` | $required | \`$default_value\` | $primary_key |" >> "$TEMP_FILE"
      done

    echo >> "$TEMP_FILE"
  done <<< "$layer_rows"
done

mv "$TEMP_FILE" "$OUTPUT_FILE"
trap - EXIT
echo "Inventory written to $OUTPUT_FILE"
