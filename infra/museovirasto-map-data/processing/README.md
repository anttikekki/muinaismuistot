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
`../data/`-hakemistossa. Tarkemmat ohjeet ovat
[`../docs/BUILD_PIPELINE.md`](../docs/BUILD_PIPELINE.md).
