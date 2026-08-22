#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="${1:-$PROJECT_DIR/data/tutkija}"
INVENTORY_FILE="${2:-$PROJECT_DIR/SOURCE_DATA_INVENTORY.md}"

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "Error: 'sqlite3' is required." >&2
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" || ! -f "$INVENTORY_FILE" ]]; then
  echo "Error: source data or inventory is missing." >&2
  exit 1
fi

read -r -d '' SQL <<SQL || true
ATTACH '$SOURCE_DIR/arkeologiset_kohteet_piste_t.gpkg' AS ap;
ATTACH '$SOURCE_DIR/arkeologiset_kohteet_alue_t.gpkg' AS aa;
ATTACH '$SOURCE_DIR/arkeologiset_kohteet_alakohteet_piste.gpkg' AS asub;
ATTACH '$SOURCE_DIR/suojellut_rakennukset_piste.gpkg' AS bp;
ATTACH '$SOURCE_DIR/suojellut_rakennukset_alue.gpkg' AS ba;
ATTACH '$SOURCE_DIR/rky_piste.gpkg' AS rp;
ATTACH '$SOURCE_DIR/rky_alue.gpkg' AS ra;
ATTACH '$SOURCE_DIR/rky_viiva.gpkg' AS rv;
ATTACH '$SOURCE_DIR/maailmanperintokohde_piste.gpkg' AS mp;
ATTACH '$SOURCE_DIR/maailmanperintokohde_alue.gpkg' AS ma;
SQL

identifier_rows="$(sqlite3 -tabs <<SQL
$SQL
SELECT 'Arkeologinen piste', 'mjtunnus', COUNT(*), COUNT(mjtunnus), COUNT(DISTINCT mjtunnus), COUNT(DISTINCT inspireID) FROM ap.arkeologiset_kohteet_piste_t;
SELECT 'Arkeologinen alue', 'mjtunnus', COUNT(*), COUNT(mjtunnus), COUNT(DISTINCT mjtunnus), COUNT(DISTINCT inspireID) FROM aa.arkeologiset_kohteet_alue_t;
SELECT 'Arkeologinen alakohde', 'mjtunnus + alakohdetunnus', COUNT(*), COUNT(alakohdetunnus), COUNT(DISTINCT CAST(mjtunnus AS TEXT) || ':' || CAST(alakohdetunnus AS TEXT)), COUNT(DISTINCT inspireID) FROM asub.arkeologiset_kohteet_alakohteet_piste;
SELECT 'Rakennuspiste', 'rakennusID', COUNT(*), COUNT(rakennusID), COUNT(DISTINCT rakennusID), COUNT(DISTINCT inspireID) FROM bp.suojellut_rakennukset_piste;
SELECT 'Rakennusalue', 'KOHDEID', COUNT(*), COUNT(KOHDEID), COUNT(DISTINCT KOHDEID), COUNT(DISTINCT inspireID) FROM ba.suojellut_rakennukset_alue;
SELECT 'RKY-piste', 'ID', COUNT(*), COUNT(ID), COUNT(DISTINCT ID), COUNT(DISTINCT inspireID) FROM rp.rky_piste;
SELECT 'RKY-alue', 'ID', COUNT(*), COUNT(ID), COUNT(DISTINCT ID), COUNT(DISTINCT inspireID) FROM ra.rky_alue;
SELECT 'RKY-viiva', 'ID', COUNT(*), COUNT(ID), COUNT(DISTINCT ID), COUNT(DISTINCT inspireID) FROM rv.rky_viiva;
SELECT 'Maailmanperintöpiste', 'ID', COUNT(*), COUNT(ID), COUNT(DISTINCT ID), COUNT(DISTINCT inspireID) FROM mp.maailmanperintokohde_piste;
SELECT 'Maailmanperintöalue', 'ID', COUNT(*), COUNT(ID), COUNT(DISTINCT ID), COUNT(DISTINCT inspireID) FROM ma.maailmanperintokohde_alue;
SQL
)"

identifier_rows+=$'\n'"$(sqlite3 -tabs <<SQL
ATTACH '$SOURCE_DIR/VARK_keskipisteet.gpkg' AS vp;
ATTACH '$SOURCE_DIR/VARK_aluerajaukset.gpkg' AS va;
SELECT 'VARK-keskipiste', 'VARK_ID', COUNT(*), COUNT(VARK_ID), COUNT(DISTINCT VARK_ID), '-' FROM vp.VARK_keskipisteet;
SELECT 'VARK-rajaus', 'VARK_ID', COUNT(*), COUNT(VARK_ID), COUNT(DISTINCT VARK_ID), '-' FROM va.VARK_aluerajaukset;
SQL
)"

relationship_rows="$(sqlite3 -tabs <<SQL
$SQL
SELECT 'Arkeologinen piste ↔ alue', 'mjtunnus', (SELECT COUNT(DISTINCT mjtunnus) FROM ap.arkeologiset_kohteet_piste_t), (SELECT COUNT(DISTINCT mjtunnus) FROM aa.arkeologiset_kohteet_alue_t), (SELECT COUNT(*) FROM (SELECT mjtunnus FROM ap.arkeologiset_kohteet_piste_t INTERSECT SELECT mjtunnus FROM aa.arkeologiset_kohteet_alue_t));
SELECT 'Alakohteen vanhempi ↔ piste', 'mjtunnus', (SELECT COUNT(DISTINCT mjtunnus) FROM asub.arkeologiset_kohteet_alakohteet_piste), (SELECT COUNT(DISTINCT mjtunnus) FROM ap.arkeologiset_kohteet_piste_t), (SELECT COUNT(*) FROM (SELECT mjtunnus FROM asub.arkeologiset_kohteet_alakohteet_piste INTERSECT SELECT mjtunnus FROM ap.arkeologiset_kohteet_piste_t));
SELECT 'Rakennuspiste ↔ alue', 'KOHDEID', (SELECT COUNT(DISTINCT KOHDEID) FROM bp.suojellut_rakennukset_piste), (SELECT COUNT(DISTINCT KOHDEID) FROM ba.suojellut_rakennukset_alue), (SELECT COUNT(*) FROM (SELECT KOHDEID FROM bp.suojellut_rakennukset_piste INTERSECT SELECT KOHDEID FROM ba.suojellut_rakennukset_alue));
SELECT 'RKY-piste ↔ alue', 'ID', (SELECT COUNT(DISTINCT ID) FROM rp.rky_piste), (SELECT COUNT(DISTINCT ID) FROM ra.rky_alue), (SELECT COUNT(*) FROM (SELECT ID FROM rp.rky_piste INTERSECT SELECT ID FROM ra.rky_alue));
SELECT 'RKY-piste ↔ viiva', 'ID', (SELECT COUNT(DISTINCT ID) FROM rp.rky_piste), (SELECT COUNT(DISTINCT ID) FROM rv.rky_viiva), (SELECT COUNT(*) FROM (SELECT ID FROM rp.rky_piste INTERSECT SELECT ID FROM rv.rky_viiva));
SELECT 'RKY-alue ↔ viiva', 'ID', (SELECT COUNT(DISTINCT ID) FROM ra.rky_alue), (SELECT COUNT(DISTINCT ID) FROM rv.rky_viiva), (SELECT COUNT(*) FROM (SELECT ID FROM ra.rky_alue INTERSECT SELECT ID FROM rv.rky_viiva));
SELECT 'Maailmanperintöpiste ↔ alue', 'ID', (SELECT COUNT(DISTINCT ID) FROM mp.maailmanperintokohde_piste), (SELECT COUNT(DISTINCT ID) FROM ma.maailmanperintokohde_alue), (SELECT COUNT(*) FROM (SELECT ID FROM mp.maailmanperintokohde_piste INTERSECT SELECT ID FROM ma.maailmanperintokohde_alue));
SQL
)"

relationship_rows+=$'\n'"$(sqlite3 -tabs <<SQL
ATTACH '$SOURCE_DIR/VARK_keskipisteet.gpkg' AS vp;
ATTACH '$SOURCE_DIR/VARK_aluerajaukset.gpkg' AS va;
SELECT 'VARK-keskipiste ↔ rajaus', 'VARK_ID', (SELECT COUNT(DISTINCT VARK_ID) FROM vp.VARK_keskipisteet), (SELECT COUNT(DISTINCT VARK_ID) FROM va.VARK_aluerajaukset), (SELECT COUNT(*) FROM (SELECT VARK_ID FROM vp.VARK_keskipisteet INTERSECT SELECT VARK_ID FROM va.VARK_aluerajaukset));
SQL
)"

{
  echo "## Tunnisteet ja tasojen väliset suhteet"
  echo
  echo "Tässä erotetaan **looginen kohdetunniste** ja **geometriarivin tunniste**. Rekisteritunnus yhdistää saman kohteen eri geometriaesitykset ja kuuluu hakuun sekä käyttöliittymän kohdelinkitykseen. Yhdellä rekisterikohteella voi kuitenkin olla monta riviä samalla tasolla, joten rekisteritunnus ei yksin riitä MVT-feature-ID:ksi."
  echo
  echo "### Tunnisteiden kattavuus ja yksikäsitteisyys"
  echo
  echo "| Kohdetaso | Ehdokas loogiseksi avaimeksi | Rivejä | Ei-NULL | Erillisiä loogisia avaimia | Erillisiä \`inspireID\`-arvoja |"
  echo "| --- | --- | ---: | ---: | ---: | ---: |"
} >> "$INVENTORY_FILE"

while IFS=$'\t' read -r layer key rows nonnull distinct_key distinct_inspire; do
  echo "| $layer | \`$key\` | $rows | $nonnull | $distinct_key | $distinct_inspire |" >> "$INVENTORY_FILE"
done <<< "$identifier_rows"

{
  echo
  echo "### Tasojen väliset tunnisteosumat"
  echo
  echo "| Suhde | Yhdistävä kenttä | Vasemman tason avaimia | Oikean tason avaimia | Yhteisiä avaimia |"
  echo "| --- | --- | ---: | ---: | ---: |"
} >> "$INVENTORY_FILE"

while IFS=$'\t' read -r relationship key left_count right_count shared_count; do
  echo "| $relationship | \`$key\` | $left_count | $right_count | $shared_count |" >> "$INVENTORY_FILE"
done <<< "$relationship_rows"

{
  echo
  echo "### Tunnistesopimus toteutukselle"
  echo
  echo "- Arkeologisen pääkohteen looginen avain on \`mjtunnus\`. Alakohteen looginen avain on \`mjtunnus + alakohdetunnus\`. Kaikkien 14 671 alakohteiden erillisen vanhemman \`mjtunnus\` löytyy pisteaineistosta."
  echo "- Rakennusperinnön kohderyhmän avain on \`KOHDEID\`; yksittäisen rakennuksen avain on \`rakennusID\`. Alue liittyy kohderyhmään \`KOHDEID\`:llä, ei \`rakennusID\`:llä."
  echo "- RKY:n looginen avain on \`ID\`, maailmanperintökohteen looginen avain on \`ID\` ja VARK-kohteen looginen avain on \`VARK_ID\`."
  echo "- \`inspireID\` on hyvä geometriarivin avaimen lähtökohta, koska se on yksikäsitteinen kaikissa muissa sitä sisältävissä tasoissa paitsi rakennuspisteissä. Rakennuspisteissä kaksi \`inspireID\`-arvoa esiintyy kumpikin kahdesti."
  echo "- MVT-feature-ID:n lähtöavain muodostetaan deterministisesti yhdistelmästä \`source_layer + inspireID + geometry_part\`. Jos \`inspireID\` puuttuu (VARK), käytetään \`source_layer + logical_id + geometry_part\`. \`geometry_part\` johdetaan saman avaimen geometrioiden vakaasta järjestyksestä tai geometriatiivisteestä; GeoPackagen \`fid\`-arvoa ei oleteta vakaaksi päivittäisten versioiden välillä. Lähtöavain muunnetaan MVT:n vaatimaksi 64-bittiseksi kokonaisluvuksi vakaalla hajautuksella, ja rakennusajo tarkistaa törmäykset."
  echo "- D1-haku deduplikoidaan loogisella avaimella ja rekisterillä. Hakutulos voi tämän jälkeen viitata yhteen tai useaan saman kohteen geometriaan kartalla."
  echo
  echo "### Tunnisteisiin liittyvät havainnot"
  echo
  echo "- Arkeologisessa pisteaineistossa on 112 441 riviä mutta 112 439 eri \`mjtunnus\`-arvoa. Alueaineistossa on 86 703 riviä mutta 74 383 eri \`mjtunnus\`-arvoa. Rekisteritunnus ei siis ole rivikohtainen avain."
  echo "- Alakohteen yhdistelmä \`mjtunnus + alakohdetunnus\` tuottaa 63 196 eri arvoa 63 216 riville. Myös alakohteella voi olla useita geometriarivejä."
  echo "- Rakennuspisteiden 2 290 riviä kuuluvat 866 \`KOHDEID\`-kohderyhmään ja 2 288 \`rakennusID\`-rakennukseen."
  echo "- RKY:n ja maailmanperinnön \`ID\` kuvaa kohdetta, ei geometriariviä. Esimerkiksi maailmanperintöpisteiden kuudella rivillä on vain yksi yhteinen \`ID\`, mutta kuusi eri \`inspireID\`-arvoa."
  echo "- VARK on nykyisessä aineistossa siistein yksi-yhteen-suhde: kaikki 1 010 \`VARK_ID\`-arvoa löytyvät sekä keskipiste- että rajausaineistosta."
  echo
} >> "$INVENTORY_FILE"

echo "Identifier analysis appended to $INVENTORY_FILE"
