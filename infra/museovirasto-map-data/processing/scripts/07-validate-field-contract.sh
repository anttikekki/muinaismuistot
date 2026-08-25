#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DATA_DIR="$PROJECT_DIR/data/tutkija"

command -v sqlite3 >/dev/null 2>&1 || {
  echo "Required command not found: sqlite3" >&2
  exit 1
}
[[ -d "$DATA_DIR" ]] || {
  echo "Extracted source data not found: $DATA_DIR" >&2
  echo "Run 00-download-source-data.sh first." >&2
  exit 1
}

validate_fields() {
  local file_name="$1"
  local layer_name="$2"
  shift 2
  local database="$DATA_DIR/$file_name"

  [[ -f "$database" ]] || { echo "Missing GeoPackage: $file_name" >&2; exit 1; }
  for field_name in "$@"; do
    local field_count
    field_count="$(sqlite3 "$database" \
      "SELECT COUNT(*) FROM pragma_table_info('$layer_name') WHERE name = '$field_name';")"
    if [[ "$field_count" -ne 1 ]]; then
      echo "Missing required field $file_name/$layer_name.$field_name" >&2
      exit 1
    fi
  done
}

validate_fields VARK_aluerajaukset.gpkg VARK_aluerajaukset \
  fid VARK_ID VARK_nimi Mj_kohde Mj_tunnus Ajoitus Ajoitus2 Tyyppi Alatyyppi Kunta Maakunta Linkki
validate_fields VARK_keskipisteet.gpkg VARK_keskipisteet \
  fid VARK_ID VARK_nimi Mj_kohde Mj_tunnus Ajoitus Ajoitus2 Tyyppi Alatyyppi Kunta Maakunta Linkki
validate_fields arkeologiset_kohteet_alakohteet_piste.gpkg arkeologiset_kohteet_alakohteet_piste \
  fid mjtunnus alakohdetunnus inspireID kohdenimi kunta laji tyyppi alatyyppi ajoitus url
validate_fields arkeologiset_kohteet_alue_t.gpkg arkeologiset_kohteet_alue_t \
  fid mjtunnus inspireID kohdenimi kunta Laji tyyppi alatyyppi ajoitus url
validate_fields arkeologiset_kohteet_piste_t.gpkg arkeologiset_kohteet_piste_t \
  fid mjtunnus inspireID kohdenimi kunta Laji tyyppi alatyyppi ajoitus url
validate_fields maailmanperintokohde_alue.gpkg maailmanperintokohde_alue \
  fid ID inspireID Nimi aluetyyppi URL
validate_fields maailmanperintokohde_piste.gpkg maailmanperintokohde_piste \
  fid ID inspireID nimi url
validate_fields rky_alue.gpkg rky_alue fid ID inspireID kohdenimi nimi url
validate_fields rky_piste.gpkg rky_piste fid ID inspireID kohdenimi url
validate_fields rky_viiva.gpkg rky_viiva fid ID inspireID kohdenimi url
validate_fields suojellut_rakennukset_alue.gpkg suojellut_rakennukset_alue \
  fid KOHDEID inspireID kohdenimi Kunta suojeluryhmä suojelun_tila url
validate_fields suojellut_rakennukset_piste.gpkg suojellut_rakennukset_piste \
  fid KOHDEID rakennusID inspireID kohdenimi rakennusnimi Kunta suojeluryhmä suojelun_tila url

MULTIVALUE_ROWS="$(sqlite3 "$DATA_DIR/arkeologiset_kohteet_piste_t.gpkg" \
  "SELECT COUNT(*) FROM arkeologiset_kohteet_piste_t WHERE tyyppi LIKE '%,%' OR alatyyppi LIKE '%,%' OR ajoitus LIKE '%,%';")"
COMMA_TERM_ROWS="$(sqlite3 "$DATA_DIR/arkeologiset_kohteet_piste_t.gpkg" \
  "SELECT COUNT(*) FROM arkeologiset_kohteet_piste_t WHERE tyyppi LIKE '%taide, muistomerkit%' OR alatyyppi LIKE '%rajamerkit, puu%';")"

[[ "$MULTIVALUE_ROWS" -gt 0 ]] || {
  echo "Expected multivalue archaeological fields, found none" >&2
  exit 1
}
[[ "$COMMA_TERM_ROWS" -gt 0 ]] || {
  echo "Expected concepts containing commas, found none" >&2
  exit 1
}

echo "Field contract validated for 12 GeoPackage layers."
echo "Archaeological point rows with comma-separated values: $MULTIVALUE_ROWS"
echo "Rows containing a known comma inside a concept: $COMMA_TERM_ROWS"
