# Processing

Tämä moduuli lataa ja validoi Museoviraston lähdeaineiston sekä rakentaa
PMTiles-, D1-, sanasto-, manifesti- ja julkaisutunnisteartefaktit. Se ei kutsu
Cloudflaren tuotantoresursseja.

Processingia ei ajeta suoraan isäntäkoneessa. Paikallinen ajo käyttää samaa
Docker-imagea kuin Cloudflaren ajastettu päivitys:

```bash
cd infra/museovirasto-map-data/updater
npm run process:local
```

Komento rakentaa koneen arkkitehtuurille valitun imagen, lataa aineiston
kertakäyttöiseen konttiin ja kopioi julkaisuvalmiit tulokset gitistä ohitettuun
`../data/updater-local/`-hakemistoon. Tarkemmat ohjeet ovat
[`../docs/BUILD_PIPELINE.md`](../docs/BUILD_PIPELINE.md).

## Riippuvuudet ja asennus

Moduulin skriptit käyttävät `../contract`-sopimuksia. Suoritusympäristö ja
GDAL-, Tippecanoe-, Node.js- sekä PMTiles-versiot lukitaan updaterin
Dockerfilessä. Isäntäkoneelle tarvitaan vain Docker sekä updater-moduulin npm-
komentojen ajamiseen Node.js ja npm. Processingilla ei ole omia npm-
riippuvuuksia.

Skriptit säilyvät pieninä erillisinä rakennusvaiheina, mutta niiden suora ajo
isäntäkoneessa ei ole tuettu käyttötapa.

## Skriptirakenne

`scripts/run.sh` ajaa juurihakemiston kaikki numeroidut vaiheet järjestyksessä:

1. `01-download-source-data.sh`
2. `02-build-pmtiles.sh`
3. `03-build-feature-details-sql.sh`
4. `04-create-build-manifest.sh`
5. `05-create-release-descriptor.sh`

`scripts/validation/` sisältää vaiheiden välissä ajettavat lähde-, PMTiles-,
kokobudjetti- ja identiteettitarkistukset. `scripts/lib/` sisältää Node.js-
apukoodin ja `scripts/test/` sen testit. Näin juurihakemiston numeroidut skriptit
muodostavat suoraan tuotantoartefaktien rakennusjärjestyksen.
