# Toistettava rakennusajo

Vaiheen 2 rakennusajo tehdään paikallisesti ilman konttia. Lukitut työkalut ovat tiedostossa `build-tool-versions.json`; `scripts/16-verify-build-tools.sh` keskeyttää ajon, jos yksikin versio poikkeaa.

Node-riippuvuudet asennetaan lukitusta `poc/package-lock.json`-tiedostosta:

```bash
cd infra/museovirasto-map-data-server/poc
npm ci
```

PMTiles CLI asennetaan version lukitsevalla latausskriptillä:

```bash
infra/museovirasto-map-data-server/scripts/09-download-pmtiles-cli.sh
```

GDAL, Tippecanoe ja jq asennetaan Homebrewlla. Rakennus ei päivitä niitä automaattisesti, vaan vaatii `build-tool-versions.json`-tiedostossa ilmoitetut versiot. Node-versio on 22.23.1.

Koko rakennus ja validointi ajetaan yhdellä komennolla:

```bash
infra/museovirasto-map-data-server/scripts/17-build-release-artifacts.sh
```

Yhteisajo:

1. tarkistaa työkalujen täsmälliset versiot;
2. validoi 12 fyysisen ja 26 loogisen tason mäppäyksen;
3. validoi GeoPackage-lähdekenttien sopimuksen;
4. validoi NULL- ja virheelliset geometriat eksplisiittisen geometriapolitiikan mukaan;
5. rakentaa kompaktin PMTiles-arkiston;
6. validoi arkiston rakenteen, kentät ja zoomin 0 kohdemäärät;
7. rakentaa 268 964 rivin D1-tuontitiedoston;
8. muodostaa lähde- ja artefaktitiivisteet sisältävän rakennusmanifestin;
9. ajaa Worker- ja selainkoodin TypeScript-tarkistuksen.

Tuotokset kirjoitetaan gitistä ohitettuun `data/poc`-hakemistoon:

- `museovirasto-poc-compact.pmtiles`
- `feature-details.sql`
- `source-geometry-report.json`
- `source-baseline-report.json`
- `tiling-budget-report.json`
- `build-manifest.json`

Geometriapolitiikan `invalidGeometry: fail` ja `repair: none` estävät virheellisen geometrian hiljaisen korjauksen tai pudotuksen. Sallittu NULL-määrä määritellään tasokohtaisesti. Manifesti sisältää lähde- ja konfiguraatiotiivisteet, lukitut työkaluversiot, artefaktien koot ja SHA-256-tiivisteet sekä keskeiset tietuemäärät.

`source-data-baseline.json` on versionhallittu vertailutaso, ei päivittäisen rivimäärän lukko. Tyhjä tai puuttuva taso estää rakennuksen. Jokainen rivimäärämuutos kirjataan raporttiin ja yli 30 prosentin muutos merkitään varoitukseksi. Uudet tyyppi-, ajoitus- ja alatyyppiarvot merkitään varoituksiksi; lähtötasossa sallittu mutta kyseisen päivän aineistosta puuttuva arvo raportoidaan ilman varoitusta. Päivän lähderivien ja päivän tuotosten tarkka täsmäytys säilyy erillisenä julkaisun estävänä tarkistuksena.

Zoomit, keskipiste-/polygoniraja, Tippecanoen harvennus- ja kokorajoitusten käyttö sekä kokobudjetit ovat `poc-layer-config.json`-tiedoston `tiling`- ja `budgets`-osissa. Rakennus estyy, jos arkisto ylittää 75 000 000 tavua, zoomin 0 pakkaamaton MVT-tiili ylittää 1 500 000 tavua tai arkiston zoomialue poikkeaa asetuksesta 0–14. Koko Suomen selainbudjetti, enintään 8 Range-pyyntöä ja 2 000 000 vastaustavua, validoidaan erillisessä Chrome-mittauksessa eikä staattisesta arkistosta.

Paikallisen R2- ja D1-simulaation siementäminen jätetään tarkoituksella erillisiksi komennoiksi, koska se muuttaa Wranglerin paikallista ajonaikaista tilaa:

```bash
infra/museovirasto-map-data-server/scripts/12-seed-local-r2-poc.sh
infra/museovirasto-map-data-server/scripts/15-seed-local-d1-poc.sh
```
