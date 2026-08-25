#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SOURCE_DIR="${1:-$PROJECT_DIR/data/tutkija}"
INVENTORY_FILE="${2:-$PROJECT_DIR/docs/SOURCE_DATA_INVENTORY.md}"
PDF_FILE="$PROJECT_DIR/data/Tietotuotemaarittely_kulttuuriymparisto_kaikki.pdf"
PDF_TEXT_FILE="$PROJECT_DIR/data/Tietotuotemaarittely_kulttuuriymparisto_kaikki.txt"

for command_name in sqlite3 pdfinfo; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Error: '$command_name' is required." >&2
    exit 1
  fi
done

for required_path in "$SOURCE_DIR" "$INVENTORY_FILE" "$PDF_FILE" "$PDF_TEXT_FILE"; do
  if [[ ! -e "$required_path" ]]; then
    echo "Error: required input is missing: $required_path" >&2
    exit 1
  fi
done

append_value_set() {
  local file_name="$1"
  local requested_field="$2"
  local title="$3"
  local gpkg_file="$SOURCE_DIR/$file_name"
  local layer_name
  local field_name
  local escaped_layer
  local escaped_field

  layer_name="$(sqlite3 "$gpkg_file" "SELECT table_name FROM gpkg_contents WHERE data_type = 'features' LIMIT 1;")"
  field_name="$(sqlite3 "$gpkg_file" "SELECT name FROM pragma_table_info('$layer_name') WHERE lower(name) = lower('$requested_field') LIMIT 1;")"

  if [[ -z "$field_name" ]]; then
    echo "Error: field '$requested_field' not found in $file_name" >&2
    exit 1
  fi

  escaped_layer="${layer_name//\"/\"\"}"
  escaped_field="${field_name//\"/\"\"}"

  {
    echo "### $title"
    echo
    echo "Lähde: \`$file_name\`, kenttä \`$field_name\`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa."
    echo
    echo "| Arvo | Lukumäärä |"
    echo "| --- | ---: |"
  } >> "$INVENTORY_FILE"

  sqlite3 -tabs "$gpkg_file" \
    "SELECT COALESCE(NULLIF(TRIM(\"$escaped_field\"), ''), '<NULL/tyhjä>'), COUNT(*)
       FROM \"$escaped_layer\"
      GROUP BY NULLIF(TRIM(\"$escaped_field\"), '')
      ORDER BY COUNT(*) DESC, 1;" |
    while IFS=$'\t' read -r value count; do
      value="${value//|/\\|}"
      value="${value//\`/\\\`}"
      echo "| \`$value\` | $count |" >> "$INVENTORY_FILE"
    done

  echo >> "$INVENTORY_FILE"
}

append_cardinality() {
  local file_name="$1"
  local gpkg_file="$SOURCE_DIR/$file_name"
  local layer_name
  layer_name="$(sqlite3 "$gpkg_file" "SELECT table_name FROM gpkg_contents WHERE data_type = 'features' LIMIT 1;")"
  sqlite3 -tabs "$gpkg_file" \
    "SELECT '$file_name',
            COUNT(DISTINCT NULLIF(TRIM(tyyppi), '')),
            COUNT(DISTINCT NULLIF(TRIM(alatyyppi), ''))
       FROM \"${layer_name//\"/\"\"}\";"
}

pdf_pages="$(pdfinfo "$PDF_FILE" | awk -F: '/^Pages:/ {gsub(/^[[:space:]]+/, "", $2); print $2}')"
pdf_created="$(pdfinfo "$PDF_FILE" | awk -F: '/^CreationDate:/ {sub(/^[[:space:]]+/, "", $2); print $2}')"

{
  echo "## Tietomallin tulkinta"
  echo
  echo "### Lähteet ja rajaus"
  echo
  echo "Tietomallin kuvaus yhdistää tuotantoaineistosta havaitun rakenteen ja Museoviraston PDF-tietotuoteselosteen. PDF on $pdf_pages-sivuinen, sen sisäinen määrittelypäivä on 8.11.2017 ja tiedoston luontipäivä on \`$pdf_created\`. Tuotantoaineisto on tätä uudempi, joten ristiriitatilanteessa GeoPackage-aineisto määrää teknisen toteutuksen ja PDF toimii kenttien semantiikan historiallisena lähteenä."
  echo
  echo "PDF:n mukaan tietotuote on tarkoitettu viranomais- ja tutkimuskäyttöön, kattaa Suomen Ahvenanmaata lukuun ottamatta (kirkkorakennuksissa myös Ahvenanmaan) ja käyttää GeoPackage-jakelussa ETRS-TM35FIN-koordinaatistoa (EPSG:3067). Havaittu aineisto vastaa koordinaatistojärjestelmää kaikissa 12 GeoPackage-tiedostossa."
  echo
  echo "### Loogiset kohdetyhmät"
  echo
  echo "| Ryhmä | Fyysiset aineistot | Tunniste ja yhteydet | Geometriat |"
  echo "| --- | --- | --- | --- |"
  echo "| Arkeologiset kohteet | \`arkeologiset_kohteet_piste_t\`, \`arkeologiset_kohteet_alue_t\`, \`arkeologiset_kohteet_alakohteet_piste\` | \`mjtunnus\` yhdistää pääkohteen pisteet, alueet ja alakohteet; alakohteella lisäksi \`alakohdetunnus\` | piste, alue ja alakohteen piste |"
  echo "| Rakennusperintö | \`suojellut_rakennukset_piste\`, \`suojellut_rakennukset_alue\` | \`KOHDEID\` yhdistää kohteen; pisteellä voi olla lisäksi \`rakennusID\` ja \`vtj_prt\` | piste ja alue |"
  echo "| RKY | \`rky_alue\`, \`rky_piste\`, \`rky_viiva\` | \`ID\`/\`inspireID\`; sama kohde voi esiintyä usealla geometriaesityksellä | piste, viiva ja alue/muu geometria |"
  echo "| Maailmanperintö | \`maailmanperintokohde_alue\`, \`maailmanperintokohde_piste\` | Unescon \`ID\` ja \`inspireID\`; alue voi olla kohde tai suoja-alue | piste ja alue |"
  echo "| VARK | \`VARK_keskipisteet\`, \`VARK_aluerajaukset\` | \`VARK_ID\` yhdistää keskipisteen ja rajauksen; mukana viittaukset enintään kolmeen muinaisjäännöskohteeseen | piste ja alue/muu geometria |"
  echo
  echo "### Kenttien semanttiset ryhmät"
  echo
  echo "- Tunnisteet: rekisterikohtaiset tunnisteet (\`mjtunnus\`, \`KOHDEID\`, \`ID\`, \`VARK_ID\`) sekä yhteentoimivuutta palveleva \`inspireID\`. GeoPackagen \`fid\` on tekninen rivitunniste eikä turvallinen rajapinnan pysyväksi tunnisteeksi."
  echo "- Nimet ja linkit: \`kohdenimi\`, \`nimi\`, \`rakennusnimi\`, \`alakohdenimi\` ja \`url\`/\`URL\`. PDF kuvaa URL:t kohteen lisätietolinkeiksi."
  echo "- Luokittelu: arkeologisten kohteiden \`laji\` → \`tyyppi\` → \`alatyyppi\`, rakennusten \`suojeluryhmä\` ja \`suojelun_tila\`, maailmanperintöalueiden \`aluetyyppi\` sekä VARK-aineiston omat luokittelukentät."
  echo "- Paikannuksen metatiedot: \`paikannustapa\`, \`paikannustarkkuus\`, \`rajaustyyppi\`, \`rajauslähde\`, koordinaatit ja korkeustiedot. PDF arvioi arkeologisten kohteiden yleiseksi sijaintitarkkuudeksi noin 50 metriä ja uusimpien GPS-tietojen tarkkuudeksi noin 20 metriä."
  echo "- Elinkaaritiedot: \`luontipvm\`, \`muutospvm\`, \`digipvm\` ja nykyisessä rakennusaineistossa \`SuojeluPäätöspvm\`. PDF:n mukaan päiväysten esityksen pitäisi noudattaa ISO 19108 -mallia."
  echo
  echo "PDF:n mukaan arkeologisten kohteiden aluerajaus on olemassa vain noin 40–50 prosentille kohteista, RKY valmistui vuonna 2009 ja muut aineistot päivittyvät jatkuvasti. Tyyppi- ja alatyyppiluetteloihin voi tulla muutoksia, joten niitä ei pidä kovakoodata sovellukseen suljettuina enumeraatioina."
  echo
  echo "### PDF:n määrittelemät arvojoukot"
  echo
  echo "| Kenttäryhmä | PDF:ssä määritellyt arvot |"
  echo "| --- | --- |"
  echo "| Arkeologinen \`laji\` | ei määritelty; kiinteä muinaisjäännös; luonnonmuodostuma; löytöpaikka; mahdollinen muinaisjäännös; muu kohde; muu kulttuuriperintökohde; poistettu kiinteä muinaisjäännös (ei rauhoitettu) |"
  echo "| Arkeologinen \`tyyppi\` | alusten hylyt; asuinpaikat; hautapaikat; kirkkorakenteet; kivirakenteet; kulkuväylät; kultti- ja tarinapaikat; luonnonmuodostumat; löytöpaikat; maarakenteet; muinaisjäännösryhmät; puolustusvarustukset; raaka-aineen hankintapaikat; taide, muistomerkit; tapahtumapaikat; teollisuuskohteet; työ- ja valmistuspaikat; ei määritelty |"
  echo "| \`vedenalainen\` | \`k\`; \`e\` |"
  echo "| Arkeologinen \`paikannustapa\` | Maastonimittaus; Tarkastus; Muu lähde |"
  echo "| Arkeologinen \`paikannustarkkuus\` | Ei tiedossa; Tarkka (< 10 m); Ohjeellinen (10–100 m); Suuntaa antava (100–1000 m); > 1000 m |"
  echo "| \`rajaustyyppi\` | Tarkka; Ohjeellinen; Suuntaa antava |"
  echo "| \`rajauslähde\` | Rajaus; Tarkastus; Muu lähde |"
  echo "| Rakennusten \`suojeluryhmä\` | Asetus 480/85; Ei määritelty; Kirkkolaki; Laki ortodoksisesta kirkosta; Laki rakennusperinnön suojelemisesta; Myrsky2000; Muu; Rakennussuojelulaki; Rautatiesopimus 1998; Suojeluohjelmat; Teollisuus; Viranomaistoiminta |"
  echo "| Rakennusten \`suojelun_tila\` | Ei määritelty; Ei suojeltu; Hyväksytty; Hylätty; Purettu; Vireillä |"
  echo "| Maailmanperintöalueen \`aluetyyppi\` | Kohde; Suoja-alue |"
  echo
  echo "## Aineistosta havaitut arvojoukot"
  echo
  echo "Alla ovat käyttöliittymän suodatukseen, MVT-tasojen muodostamiseen tai tietojen esittämiseen olennaiset matalan kardinaliteetin arvojoukot. \`<NULL/tyhjä>\` tarkoittaa puuttuvaa tai pelkistä välilyönneistä koostuvaa arvoa."
  echo
} >> "$INVENTORY_FILE"

append_value_set "arkeologiset_kohteet_piste_t.gpkg" "Laji" "Arkeologisen pistekohteen laji"
append_value_set "arkeologiset_kohteet_alue_t.gpkg" "Laji" "Arkeologisen aluekohteen laji"
append_value_set "arkeologiset_kohteet_alakohteet_piste.gpkg" "laji" "Arkeologisen alakohteen laji"
append_value_set "arkeologiset_kohteet_piste_t.gpkg" "tyyppi" "Arkeologisen pistekohteen tyyppi – täydellinen raakamuotoinen arvojoukko"
append_value_set "arkeologiset_kohteet_piste_t.gpkg" "alatyyppi" "Arkeologisen pistekohteen alatyyppi – täydellinen raakamuotoinen arvojoukko"
append_value_set "arkeologiset_kohteet_alue_t.gpkg" "tyyppi" "Arkeologisen aluekohteen tyyppi – täydellinen raakamuotoinen arvojoukko"
append_value_set "arkeologiset_kohteet_alue_t.gpkg" "alatyyppi" "Arkeologisen aluekohteen alatyyppi – täydellinen raakamuotoinen arvojoukko"
append_value_set "arkeologiset_kohteet_piste_t.gpkg" "vedenalainen" "Arkeologisen pistekohteen vedenalaisuus"
append_value_set "arkeologiset_kohteet_piste_t.gpkg" "paikannustapa" "Arkeologisen pistekohteen paikannustapa"
append_value_set "arkeologiset_kohteet_piste_t.gpkg" "paikannustarkkuus" "Arkeologisen pistekohteen paikannustarkkuus"
append_value_set "arkeologiset_kohteet_alue_t.gpkg" "rajaustyyppi" "Arkeologisen alueen rajaustyyppi"
append_value_set "arkeologiset_kohteet_alue_t.gpkg" "rajauslähde" "Arkeologisen alueen rajauslähde"
append_value_set "suojellut_rakennukset_piste.gpkg" "suojeluryhmä" "Rakennuspisteen suojeluryhmäyhdistelmät"
append_value_set "suojellut_rakennukset_alue.gpkg" "suojeluryhmä" "Rakennusalueen suojeluryhmäyhdistelmät"
append_value_set "suojellut_rakennukset_piste.gpkg" "suojelun_tila" "Rakennuspisteen suojelun tila"
append_value_set "suojellut_rakennukset_alue.gpkg" "suojelun_tila" "Rakennusalueen suojelun tila"
append_value_set "maailmanperintokohde_alue.gpkg" "aluetyyppi" "Maailmanperintöalueen tyyppi"
append_value_set "VARK_aluerajaukset.gpkg" "Poikkeava" "VARK-rajauksen poikkeavuus"

{
  echo "### Arkeologisten tyyppi- ja alatyyppikenttien kardinaliteetti"
  echo
  echo "Pääaineistojen \`tyyppi\`- ja \`alatyyppi\`-kentät ovat neljän pilkuilla erotetun arvopaikan moniarvokenttiä. Myös arvo \`taide, muistomerkit\` sisältää pilkun, joten kenttää ei voi jäsentää turvallisesti tavallisella pilkkujaolla. Alakohdeaineistossa kentät ovat yksiarvoisia."
  echo
  echo "| Aineisto | Erillisiä raakamuotoisia tyyppiarvoja | Erillisiä raakamuotoisia alatyyppiarvoja |"
  echo "| --- | ---: | ---: |"
} >> "$INVENTORY_FILE"

for file_name in arkeologiset_kohteet_piste_t.gpkg arkeologiset_kohteet_alue_t.gpkg arkeologiset_kohteet_alakohteet_piste.gpkg; do
  append_cardinality "$file_name" |
    while IFS=$'\t' read -r file type_count subtype_count; do
      echo "| \`$file\` | $type_count | $subtype_count |" >> "$INVENTORY_FILE"
    done
done

{
  echo
  echo "PDF määrittelee 18 arkeologista päätyyppiä ja kertoo alatyyppejä olevan noin 200. Tuotantoaineiston alakohteissa on 18 tyyppiä ja 179 alatyyppiä, mutta piste- ja alueaineistojen moniarvoinen tallennus tuottaa satoja tai yli tuhat raakamuotoista yhdistelmää."
  echo
  echo "## Havaitut ristiriidat ja tulkintariskit"
  echo
  echo "1. **Dokumentin ikä ja kattavuus:** PDF:n määrittely on vuodelta 2017 eikä kuvaa VARK-aineistoa lainkaan. Tuotantoaineistossa VARK on oma piste- ja rajauskokonaisuutensa."
  echo "2. **Jakelumuoto:** PDF:n jakelutiedoissa mainitaan vain WMS, vaikka nykyinen ladattava tuote koostuu 12 GeoPackage-tiedostosta sekä QML-tyyleistä."
  echo "3. **Arkeologisen lajin arvojoukko:** PDF:n kahdeksasta arvosta \`ei määritelty\` ei esiinny nykyisten aineistojen \`laji\`-kentässä. Tuotantoaineistossa esiintyy sen sijaan \`havaintokohde\` (pisteissä 36 416 riviä), jota PDF ei tunne."
  echo "4. **Arkeologisen tyypin arvojoukko:** PDF mainitsee tyypin \`muinaisjäännösryhmät\`, jota ei löydy yhdestäkään nykyisestä arkeologisesta aineistosta. Nykyinen aineisto sisältää tyypin \`puurakenteet\`, jota PDF ei luettele."
  echo "5. **Kirjainkoko vedenalaisuuskoodissa:** PDF sallii vain pienet \`k\` ja \`e\`, mutta tuotantoaineistossa esiintyvät erillisinä myös \`K\` ja \`E\`. Sovelluksessa arvo on normalisoitava kirjainkoosta riippumattomasti."
  echo "6. **Paikannustavan kirjoitusasu:** PDF käyttää arvoa \`Maastonimittaus\`, kun aineistossa arvo on \`Maastomittaus\`."
  echo "7. **Rajauslähteen arvojoukko:** PDF luettelee arvot \`Rajaus\`, \`Tarkastus\` ja \`Muu lähde\`. Aineistossa \`Rajaus\` ei esiinny, mutta \`Maastonmittaus\` esiintyy."
  echo "8. **Rakennusperinnön suojelun tila:** PDF luettelee kuusi tilaa (esimerkiksi \`Hyväksytty\` ja \`Ei suojeltu\`), mutta kummankin nykyisen rakennusaineiston ainoa arvo on \`Suojeltu\`, jota PDF ei luettele."
  echo "9. **Rakennusperinnön skeema:** PDF:n kentät \`luontipvm\`, \`muutospvm\`, \`paikannustapa\`, \`paikannustarkkuus\` ja \`selite\` puuttuvat nykyisistä rakennusaineistoista. Nykyinen \`SuojeluPäätöspvm\` puolestaan puuttuu PDF:stä."
  echo "10. **Suojeluryhmän rakenne:** PDF kuvaa kentän yksittäisenä arvojoukkona. Nykyinen aineisto tallentaa enintään neljä arvoa yhteen pilkuilla erotettuun merkkijonoon ja sisältää tyhjiä arvopaikkoja. Kenttä pitää normalisoida listaksi ennen suodatusta tai esittämistä."
  echo "11. **Arkeologisten kenttien skeema:** nykyisissä piste- ja alueaineistoissa on PDF:stä puuttuvia kenttiä, kuten \`ajoitus\`; pisteaineistossa lisäksi \`KOHDE_APVM\` ja \`KOHDE_MPVM\`. Alueaineistossa \`muutospvm\` on SQLite-tyypiltään \`TEXT\`, vaikka PDF määrittelee sen \`DateTime\`-kentäksi."
  echo "12. **Maailmanperintöalueen ID-tyyppi:** PDF määrittelee alueen \`ID\`-kentän merkkijonoksi, mutta GeoPackage käyttää \`MEDIUMINT\`-tyyppiä."
  echo "13. **Yleiset skeemaerot:** kenttien kirjainkoko vaihtelee aineistojen välillä (esimerkiksi \`Laji\`/\`laji\`, \`Nimi\`/\`nimi\`, \`URL\`/\`url\`). Sisäisen skeeman on oltava kirjainkoon suhteen eksplisiittinen."
  echo
  echo "Ristiriidat eivät tarkoita, että tuotantoaineisto olisi virheellinen. Useimmat osoittavat, että historiallinen PDF ei ole pysynyt muuttuvan rekisterimallin tasalla. Rakennusputken pitää validoida nykyinen aineisto ja raportoida uudet arvot, mutta sen ei pidä hylätä niitä vain PDF-poikkeaman vuoksi."
  echo
} >> "$INVENTORY_FILE"

echo "Data model and value-set analysis appended to $INVENTORY_FILE"
