# Karttadatan sopimus

`contract` on selaimen, pää-Workerin ja rakennusputken yhteinen versionhallittava tietomallisopimus. Se pitää tasojen nimet, suodatuskoodit ja D1-skeeman yhdessä paikassa. Hakemisto ei sisällä ajettavaa palvelua tai ympäristökohtaisia asetuksia eikä riipu muista karttadatahakemistoista.

## Sisältö

### `layer-mapping.json`

Määrittää 12 fyysisen GeoPackage-/MVT-lähdetason ja 26 käyttöliittymän loogisen tason suhteen:

- GeoPackage-tiedosto ja sen sisäinen taso
- odotettu geometriaperhe ja MVT:n `source-layer`
- rekisteri- ja rivitunnisteiden lähdekentät
- johdettavat kentät ja niiden käyttämä versionhallittu sanasto
- loogisten tasojen lähdetaso ja mahdollinen suodatin

Arkeologisten pisteiden ja alueiden kahdeksan lajia muodostetaan kahdesta fyysisestä tasosta. Selain importtaa tiedoston suoraan tyylejä ja tasovalintoja varten.

MVT-feature-ID perustuu lähdetason `fid`-arvoon. PMTiles ja D1 rakennetaan aina samasta aineistosta; `fid`:tä ei pidetä julkaisujen välisenä pysyvänä tunnisteena. Pysyvät linkit käyttävät loogisen tason ja rekisteritunnisteen yhdistelmää.

### `filter-vocabulary.json`

Määrittää arkeologisten kohteiden kompaktit MVT-suodatuskoodit:

- `laji_key`: yhden lajin numeerinen koodi
- `type_mask` ja `dating_mask`: monivalintojen bittimaskit
- `subtype_codes`: järjestetty alatyyppikoodien merkkijono

Sanasto on skeemaversioitu. Tuntematon lähdearvo pysäyttää prosessoinnin, jotta uusi luokitus ei päädy tuotantoon väärällä tyylillä tai suodatuksella.
`kindSourceValues` on arkeologisen `Laji`-kentän lähdearvon ja normalisoidun
`laji_key`-arvon ainoa määrittely. Prosessointi generoi siitä SQL-muunnoksen ja
validointi vertaa GeoPackageissa havaittuja arvoja siihen.

### `migrations/`

Sisältää Cloudflare D1:n `feature_details`-taulun migraatiot. Taulu palvelee karttaklikkausta, pysyviä linkkejä, nimi- ja rekisteritunnushakua sekä tarkkojen ominaisuuksien ja GeoJSON-geometrian palauttamista. Migraatiot suorittaa `deploy` pää-Workerin `MAP_FEATURES`-bindingiin.

## D1-skeema

Migraatiot ovat skeeman ainoa lähde. Nykyinen `feature_details`-taulu muodostuu
tiedostoista `0001_feature_details.sql`, `0002_feature_search.sql` ja
`0003_feature_geometry.sql`:

| Sarake | Tyyppi | Merkitys |
| --- | --- | --- |
| `source_layer` | `TEXT NOT NULL` | Fyysinen PMTiles-lähdetaso. |
| `feature_id` | `INTEGER NOT NULL` | Saman julkaisun MVT-feature-ID eli GeoPackagen `fid`. |
| `logical_layer_id` | `TEXT NOT NULL` | Käyttöliittymän looginen taso. |
| `registry_id` | `TEXT` | Museoviraston rekisteritunniste pysyviä linkkejä varten. |
| `name` | `TEXT` | Kohteen näytettävä nimi. |
| `municipality` | `TEXT` | Kunta, jos lähdetaso sisältää sen. |
| `properties_json` | `TEXT NOT NULL DEFAULT '{}'` | Paneelissa ja APIssa palautettavat normalisoidut ominaisuudet. |
| `search_name` | `TEXT NOT NULL DEFAULT ''` | Nimi hakua varten normalisoidussa muodossa. |
| `geometry_json` | `TEXT` | Tarkka EPSG:4326 GeoJSON-geometria. |

Pääavain on `(source_layer, feature_id)`, ja taulu on `WITHOUT ROWID`.
Indeksi `feature_details_registry` kattaa sarakkeet
`(logical_layer_id, registry_id)`. Prosessointi tuottaa jokaisessa onnistuneessa
julkaisussa koko taulun korvaavan `feature-details.sql`-tiedoston; D1 ei ole
lähdeaineiston osittainen muutosloki.

## D1-rakennemuutos

Luo aina uusi numeroitu migraatio. Älä muokkaa migraatiota, joka on voitu jo
ajaa preview- tai production-kantaan. Wrangler luo seuraavan tiedoston
`migrations_dir`-asetuksen mukaiseen tähän hakemistoon:

```bash
cd infra/muinaismuistot-worker
npx wrangler d1 migrations create MAP_FEATURES add_example_column --env preview
```

Kirjoita generoituun SQL-tiedostoon mahdollisuuksien mukaan taaksepäin
yhteensopiva muutos, esimerkiksi nullable-sarake tai sarake turvallisella
oletusarvolla. Päivitä samassa muutoksessa:

- `processing/scripts/build-feature-details-sql.sh` tai sen käyttämä
  transformer, jos tuonti kirjoittaa uutta saraketta
- pää-Workerin kyselyt, vastaustyypit ja testien D1-fixture
- migraatioiden jälkeen tässä READMEssä kuvattu ajantasainen skeema

Tarkista ajamattomat migraatiot ja aja ne previewhin:

```bash
cd infra/muinaismuistot-worker
npx wrangler d1 migrations list MAP_FEATURES --env preview --remote
npx wrangler d1 migrations apply MAP_FEATURES --env preview --remote
```

Paikallisen `wrangler dev` -kannan migraatiot ajetaan ilman `--remote`-lippua:

```bash
npx wrangler d1 migrations list MAP_FEATURES --local
npx wrangler d1 migrations apply MAP_FEATURES --local
```

Production vaatii ympäristön vaihtamisen eksplisiittisesti:

```bash
npx wrangler d1 migrations list MAP_FEATURES --env production --remote
npx wrangler d1 migrations apply MAP_FEATURES --env production --remote
```

`deploy/scripts/publish-cloudflare-release.sh` ajaa saman `migrations apply`
-komennon automaattisesti ennen D1-tuontia. Migraatiota ei siis tarvitse ajaa
erikseen normaalissa updater-julkaisussa. Manuaalinen ajo on hyödyllinen
skeemamuutoksen tarkistamiseen tai silloin, kun julkaisu jaetaan hallitusti
useaan vaiheeseen. Wrangler ottaa etämigraatiosta varmuuskopion ja peruuttaa
epäonnistuneen yksittäisen migraation.

Turvallinen koko järjestelmän julkaisujärjestys on kuvattu
[`../updater/README.md`](../updater/README.md#d1-skeemamuutoksen-julkaisu)-tiedostossa.

## Skeemaversiot ja yhteensopivuus

`current-metadata.json` julkaisee kolme yhteensopivuusnumeroa, jotka
`processing/scripts/create-release-descriptor.sh` kirjoittaa:

| Versio | Kasvata, kun |
| --- | --- |
| `mvtSchemaVersion` | MVT-lähdetaso, feature-ID:n merkitys, geometriatapa tai selaimen lukema attribuuttirakenne muuttuu epäyhteensopivasti. |
| `filterVocabularySchemaVersion` | Kompaktien lajien, tyyppien, ajoitusten tai alatyyppien koodien merkitys muuttuu. Arvon pitää vastata `filter-vocabulary.json`-sanaston skeemaversiota. |
| `apiSchemaVersion` | Julkisen Museovirasto-APIn pyyntö- tai vastaussopimus muuttuu epäyhteensopivasti. |

Pelkkä uuden nullable-kentän lisääminen D1:een ei yleensä muuta näitä
versioita, jos julkinen API ja MVT pysyvät yhteensopivina. Koodin tai sanaston
muutoksen yhteydessä päivitä versionumero, testit ja kaikki kuluttajat samassa
työssä. Nykyinen selain ei estä latausta versionumeron perusteella; numerot ovat
diagnostiikka- ja rollout-sopimus, eivät automaattinen yhteensopivuusportti.

Käytä rikkovassa muutoksessa laajenna–siirrä–poista-mallia: julkaise ensin uusi
rakenne vanhan rinnalle, siirrä prosessointi ja kuluttajat, ja poista vanha vasta
myöhemmässä julkaisussa.

## Riippuvuudet

Sopimusta käyttävät `../processing`, `../deploy`, `../../muinaismuistot-worker` ja selaimen `src/map/layer/MuseovirastoVectorTileLayer.ts`. JSON-tiedostoilla ei ole omia ajonaikaisia riippuvuuksia.

## Validointi ja muutokset

Sopimus validoidaan osana tuettua Docker-prosessointia:

```bash
cd infra/museovirasto-map-data/updater
npm run process:local
```

Staattisen mäppäyksen voi tarkistaa erikseen, jos `jq`, `sqlite3`, GDALin `ogrinfo` ja ladattu lähdeaineisto ovat saatavilla:

```bash
node infra/museovirasto-map-data/processing/scripts/validation/validate-layer-mapping.mjs
```

Kun sopimusta muutetaan, päivitä samassa muutoksessa sitä käyttävä selain- tai prosessointikoodi. Lisää D1-muutokselle uusi migraatio olemassa olevan migraation muokkaamisen sijasta.
