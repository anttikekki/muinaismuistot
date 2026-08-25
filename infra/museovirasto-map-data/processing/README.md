# Processing

Tämä moduuli lataa ja validoi Museoviraston lähdeaineiston sekä rakentaa
PMTiles-, D1-, sanasto-, manifesti- ja julkaisutunnisteartefaktit. Se ei kutsu
Cloudflaren tuotantoresursseja.

Koko julkaisu rakennetaan repositorion juuresta komennolla:

```bash
infra/museovirasto-map-data/processing/scripts/17-build-release-artifacts.sh
```

Lukitut työkaluversiot, lähdetasojen muunnokset ja regressiovertailut ovat
`config/`-hakemistossa. Syöte ja tulokset ovat gitistä ohitetussa
`../data/`-hakemistossa ja julkaisuvalmiit tulokset `../data/build/`-
hakemistossa. Tarkemmat ohjeet ovat
[`../docs/BUILD_PIPELINE.md`](../docs/BUILD_PIPELINE.md).

## Riippuvuudet ja asennus

Moduuli käyttää `../contract`-sopimuksia, mutta ei riipu `deploy`- tai
`updater`-moduuleista. Tarvittavat työkalut ja niiden lukitut versiot ovat
`config/build-tool-versions.json`-tiedostossa: Bash, GDAL, Tippecanoe, Node.js,
jq ja PMTiles CLI. Inventaario- ja PDF-skriptit tarvitsevat lisäksi `curl`-,
`unzip`-, `sqlite3`- ja Popplerin `pdftotext`-komennot.

macOS-asennus:

```bash
brew install gdal tippecanoe jq sqlite poppler
infra/museovirasto-map-data/processing/scripts/09-download-pmtiles-cli.sh
```

Node.js asennetaan versionhallintatyökalulla tiedoston
`config/build-tool-versions.json` täsmälliseen versioon. Processingilla ei ole
npm-riippuvuuksia. Asennus tarkistetaan ennen rakennusta:

```bash
infra/museovirasto-map-data/processing/scripts/16-verify-build-tools.sh
```
