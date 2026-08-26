# Karttadatan prosessointi

`processing` lataa ja validoi Museoviraston lähdeaineiston sekä rakentaa julkaisuun tarvittavat ympäristöriippumattomat artefaktit. Se on erillään julkaisusta, jotta sama rakennus voidaan ajaa paikallisesti, previewssa ja productionissa ilman Cloudflare-oikeuksia.

Processing ei ole palvelu eikä oma npm-paketti. Tuettu suoritus tapahtuu updaterin Docker-imagessa, jossa paikkatietotyökalujen versiot on lukittu.

Fyysisten lähdetasojen tiedosto- ja tasonimet määritellään vain
`contract/layer-mapping.json`-tiedostossa. Build-konfiguraatio viittaa niihin
ID:llä. `scripts/lib/layer-build-plan.mjs` yhdistää asetukset ja muodostaa
OGR:n SQL-kyselyt deklaratiivisista kentistä; SQL-lauseita ei ylläpidetä
JSONissa. `laji_key`-normalisointi muodostetaan
`contract/filter-vocabulary.json`-sanaston `kindSourceValues`-mäppäyksestä.
VARK-tasojen `Ajoitus` ja `Ajoitus2` yhdistetään `datings_raw`-kentäksi sekä
`Mj_tunnus` ja `Mj_tunnus2` D1:n sisäiseksi
`related_registry_ids_raw`-kentäksi. Jälkimmäistä käytetään VARK-kohteen
viitattujen muinaisjäännöskohteiden rikastamiseen Workerissa; sitä ei viedä
PMTiles-attribuutiksi eikä sellaisenaan julkiseen API-vastaukseen.

## Syötteet ja riippuvuudet

- Museoviraston `tutkija.zip` ja sen 12 GeoPackage-tasoa
- [`../contract`](../contract/README.md): tasomäppäys ja suodatussanasto
- `config/layers.json`: deklaratiiviset kenttäprojektiot, muunnosprofiilit, zoomit ja kokobudjetit
- updaterin Dockerfile: GDAL, Tippecanoe, PMTiles, Node.js, jq ja SQLite

Isäntäkone tarvitsee tuettuun ajoon Dockerin sekä Node.js:n ja npm:n. Skriptien suora ajo isäntäkoneen työkaluversioilla ei ole tuettu tuotantoartefaktien rakennustapa.

## Rakennusprosessi

`scripts/run.sh` suorittaa:

1. `download-source-data.sh`: ZIP ja HTTP-otsakkeet.
2. `validation/validate-source-data.mjs`: tasot, geometriat, EPSG:3067, sallitut tyhjät geometriat ja validiteetti.
3. `build-pmtiles.sh`: kenttäprojektiot, suodatuskoodit, EPSG:4326-muunnos ja zoomien 0–14 PMTiles.
4. `validation/validate-pmtiles.mjs` sekä budjettitarkistus: PMTiles-skeema,
   attribuutit, zoom-esitykset sekä arkisto- ja tiilibudjetit.
5. `build-feature-details-sql.sh`: D1:n täydellinen `feature_details`-tuonti ominaisuuksineen ja EPSG:4326-geometrioineen.
6. `validation/validate-pmtiles-d1-identities.mjs`: PMTiles- ja D1-identiteettien
   sekä rivimäärien ristiinvalidointi eksplisiittisistä TSV-artefakteista.
7. `create-build-manifest.sh`: lähde-, asetus- ja artefaktitiivisteet.
8. `create-release-descriptor.sh`: ZIPin päiväykseen perustuva versio ja metadata.

Aluetasot esitetään zoomeilla 0–9 keskipisteinä ja zoomeilla 10–14 polygoneina saman MVT-lähdetason alla. Rakennus ei käytä feature- tai tiilikokorajoihin perustuvaa hiljaista karsimista; erilliset budjettitarkistukset pysäyttävät liian suuren tuloksen.

## Tulokset

Työhakemisto on `../data/build/`:

| Tiedosto | Käyttö |
| --- | --- |
| `museovirasto.pmtiles` | Selaimen vektoritiiliarkisto R2:een. |
| `feature-details.sql` | D1:n nykyisen sisällön korvaava tuonti. |
| `current-metadata.json` | Julkisen metadata-endpointin aktiivinen metadata. |
| `release-descriptor.json` | Version, eheyden ja julkaisukohteiden kuvaus. |
| `build-manifest.json` | Lähde-, konfiguraatio- ja artefaktitiivisteet. |

Lisäksi syntyy validointiraportteja ja väliaikaisia GeoJSONSeq-tiedostoja. `data/` on gitistä ohitettu. Paikallinen Container-ajo kopioi julkaisuartefaktien lisäksi neljä validointiraporttia `data/updater-local/`-hakemistoon.

Lähde ladataan ja puretaan oletuksena aina puhtaasti. Jos ajat latausskriptin käsin ja haluat tarkoituksella käyttää jo ladattua ZIPiä ja purettua hakemistoa, anna `--reuse-source`:

```bash
infra/museovirasto-map-data/processing/scripts/download-source-data.sh --reuse-source
```

## Komennot

Koko rakennus ilman Cloudflare-kirjoituksia:

```bash
cd infra/museovirasto-map-data/updater
npm ci
npm run process:local
```

Tulokset kopioidaan `infra/museovirasto-map-data/data/updater-local/`-hakemistoon. Alustan ja imagen voi valita:

```bash
PLATFORM=linux/arm64 IMAGE_TAG=museovirasto-map-data-updater:arm64 npm run process:local
PLATFORM=linux/amd64 IMAGE_TAG=museovirasto-map-data-updater:amd64 npm run process:local
```

Validointien pienet Node-fixturetestit ajetaan updaterin testien mukana, tai
erikseen ilman paikkatietotyökaluja:

```bash
cd infra/museovirasto-map-data/updater
npm run test:validation
```

Prosessoinnin muunnostestin voi ajaa ympäristössä, jossa lukitut työkalut ovat saatavilla:

```bash
node --test infra/museovirasto-map-data/processing/scripts/test/compact-filter-data.test.mjs
```

## Kapasiteettirajat ja työtilan siivous

`config/layers.json` määrittää kaksi tarkoituksellista julkaisubudjettia:

- koko PMTiles-arkisto enintään 75 000 000 tavua
- zoom 0 -tiili enintään 1 500 000 tavua

`validation/validate-tiling-budgets.sh` pysäyttää rakennuksen rajan ylittyessä.
Älä nosta rajoja vain saadaksesi ajon läpi: tarkista ensin lähteen kasvu,
zoom-tason sisältö ja mobiilissa ladattava tietomäärä. Budjetin muutos kuuluu
versionhallittuun `config/layers.json`-tiedostoon ja vaatii uuden paikallisen
rakennuksen sekä selainmittauksen.

`../data/` sisältää vain uudelleen muodostettavaa työdataa. Sen voi poistaa, kun
mikään paikallinen prosessointi tai Container ei ole käynnissä ja tarvittavat
julkaisu- tai rollback-artefaktit on kopioitu muualle. Erityisesti
`data/updater-local/` ei ole varmuuskopio eikä retention-järjestelmä.
