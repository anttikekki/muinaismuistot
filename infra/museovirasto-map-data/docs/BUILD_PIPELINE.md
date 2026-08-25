# Toistettava rakennusajo

Vaiheen 2 rakennusajo tehdään paikallisesti ilman konttia. Lukitut työkalut ovat tiedostossa `processing/config/build-tool-versions.json`; `processing/scripts/16-verify-build-tools.sh` keskeyttää ajon, jos yksikin versio poikkeaa.

Processingin Node-skriptit käyttävät vain Node.js:n vakiokirjastoa, joten
moduulilla ei ole erillistä npm-asennusta.

PMTiles CLI asennetaan version lukitsevalla latausskriptillä:

```bash
infra/museovirasto-map-data/processing/scripts/09-download-pmtiles-cli.sh
```

GDAL, Tippecanoe ja jq asennetaan Homebrewlla. Rakennus ei päivitä niitä automaattisesti, vaan vaatii `processing/config/build-tool-versions.json`-tiedostossa ilmoitetut versiot. Node-versio on 22.23.1.

Koko rakennus ja validointi ajetaan yhdellä komennolla:

```bash
infra/museovirasto-map-data/processing/scripts/17-build-release-artifacts.sh
```

Yhteisajo:

1. tarkistaa työkalujen täsmälliset versiot;
2. validoi 12 fyysisen ja 26 loogisen tason mäppäyksen;
3. validoi GeoPackage-lähdekenttien sopimuksen;
4. validoi NULL- ja virheelliset geometriat eksplisiittisen geometriapolitiikan mukaan;
5. rakentaa kompaktin PMTiles-arkiston;
6. validoi arkiston rakenteen, kentät ja zoomin 0 kohdemäärät;
7. rakentaa D1-tuontitiedoston ja laskee sen kokonais- sekä tasokohtaiset rivimäärät päivän aineistosta;
8. vertaa kaikki PMTiles-rakennussyötteen `source-layer + fid` -avaimet D1-tuontiin ja varmistaa, että jokaiselle zoomin 0 PMTiles-featurelle löytyy D1-rivi;
9. muodostaa lähde- ja artefaktitiivisteet sisältävän rakennusmanifestin ilman kovakoodattuja aineistorivimääriä;
10. muodostaa sisältötiivisteeseen perustuvan muuttumattoman julkaisutunnisteen ja julkaisudeskriptorin;
11. ajaa rakennusmuunnosten testit.

Tuotokset kirjoitetaan gitistä ohitettuun `data/build`-hakemistoon:

- `museovirasto.pmtiles`
- `contract/filter-vocabulary.json` (versionhallittu ja selainrakennukseen sisältyvä koodisto)
- `feature-details.sql`
- `feature-details-report.json`
- `pmtiles-d1-identity-report.json`
- `source-geometry-report.json`
- `source-baseline-report.json`
- `tiling-budget-report.json`
- `build-manifest.json`
- `release-descriptor.json`
- `current-metadata.json`

Geometriapolitiikan `invalidGeometry: fail` ja `repair: none` estävät virheellisen geometrian hiljaisen korjauksen tai pudotuksen. Sallittu NULL-määrä määritellään tasokohtaisesti. Manifesti sisältää lähde- ja konfiguraatiotiivisteet, lukitut työkaluversiot, artefaktien koot ja SHA-256-tiivisteet sekä keskeiset tietuemäärät. Myös PMTilesin `laji_key`-, tyyppi-, ajoitus- ja alatyyppikoodit avaava `filter-vocabulary.json` on manifestissa omana artefaktinaan ja konfiguraatiotiivisteenään, joten arkisto ja sitä tulkitseva sanasto voidaan julkaista yhtenä versiona.

D1-rivimäärä luetaan manifestiin `feature-details-report.json`-raportista. Raportti sisältää jokaiselle 12 tasolle lähderivit, hyväksytyt geometriattomat poikkeukset ja tuotetut D1-rivit. Nykyisessä aineistossa lähderivejä on 268 965 ja D1-rivejä 268 964, koska yksi ennalta hyväksytty arkeologinen aluerivi on geometriaton.

`pmtiles-d1-identity-report.json` varmistaa, että PMTiles-rakennussyötteen kaikki 268 964 `source-layer + fid` -avainta vastaavat D1-tuontia ja ettei zoomin 0 PMTilesissä ole D1:stä puuttuvaa tunnistetta. Zoomin 0 arkistossa on 268 905 tunnistetta: 59 RKY-viivaa yksinkertaistuu pois matalimmalta zoomilta mutta säilyy D1:ssä ja tarkemmilla zoomeilla. Pisteiden ja aluekeskipisteiden täydellisyys tarkistetaan erikseen PMTiles-validoinnissa.

UTC-aikaleimaversio, aktiiviset vakioavaimet, palautusavaimet ja yöllinen käyttöönottoprosessi on määritelty tiedostossa [RELEASE_CONTRACT.md](RELEASE_CONTRACT.md). Rakennus tuottaa `release-descriptor.json`- ja valinnaisen `/api/museovirasto/meta`-reitin `current-metadata.json`-tiedostot; ulkoista ympäristöä ei muuteta vaiheessa 2.

`processing/config/source-data-baseline.json` on versionhallittu vertailutaso, ei päivittäisen rivimäärän lukko. Tyhjä tai puuttuva taso estää rakennuksen. Jokainen rivimäärämuutos kirjataan raporttiin ja yli 30 prosentin muutos merkitään varoitukseksi. Uudet laji-, tyyppi-, ajoitus- ja alatyyppiarvot merkitään varoituksiksi; lähtötasossa sallittu mutta kyseisen päivän aineistosta puuttuva arvo raportoidaan ilman varoitusta. Päivän lähderivien ja päivän tuotosten tarkka täsmäytys säilyy erillisenä julkaisun estävänä tarkistuksena.

Zoomit, keskipiste-/polygoniraja, Tippecanoen harvennus- ja kokorajoitusten käyttö sekä kokobudjetit ovat `processing/config/layers.json`-tiedoston `tiling`- ja `budgets`-osissa. Rakennus estyy, jos arkisto ylittää 75 000 000 tavua, zoomin 0 pakkaamaton MVT-tiili ylittää 1 500 000 tavua tai arkiston zoomialue poikkeaa asetuksesta 0–14. Koko Suomen selainbudjetti, enintään 8 Range-pyyntöä ja 2 000 000 vastaustavua, validoidaan erillisessä Chrome-mittauksessa eikä staattisesta arkistosta.

Paikallista R2/D1-PoC-ympäristöä ei enää ylläpidetä. Integraatiotestaus tehdään
preview-ympäristössä ennen production-julkaisua.

Kun Worker on deployattu ja Cloudflare-resurssit on provisioitu valittuun ympäristöön, samat aktiiviset artefaktit julkaistaan etäympäristöön näin:

```bash
infra/museovirasto-map-data/deploy/scripts/30-publish-cloudflare-release.sh preview
```

Skripti validoi ympäristön ja artefaktit, ajaa D1-migraatiot, korvaa D1-aineiston, lataa `current.pmtiles`- ja `current.json`-objektit sekä ajaa lopuksi palvelun smoke-testin. D1-tuontiartefakti ei sisällä eksplisiittisiä `BEGIN TRANSACTION`- tai `COMMIT`-lauseita, koska Wranglerin etätuonti hallitsee tuonnin ja virheestä palautumisen itse. Production vaatii lisäksi eksplisiittisen `--confirm-production`-argumentin.
