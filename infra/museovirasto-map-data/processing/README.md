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
