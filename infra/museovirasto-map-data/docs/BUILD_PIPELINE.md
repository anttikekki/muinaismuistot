# Toistettava rakennusajo

Rakennusajo suoritetaan aina updaterin Docker-imagessa sekä paikallisesti että
Cloudflaressa. Näin GDAL-, Tippecanoe-, Node.js- ja PMTiles-versiot sekä Linux-
ympäristö ovat samat molemmissa ajoissa ja lukittu updaterin Dockerfileen.

Processingin Node-skriptit käyttävät vain Node.js:n vakiokirjastoa, joten
moduulilla ei ole erillistä npm-asennusta.

Paikallinen koko aineiston ajo tehdään näin:

```bash
cd infra/museovirasto-map-data/updater
npm run process:local
```

Komento rakentaa paikallisen arkkitehtuurin imagen, lataa tuoreen lähdeaineiston
kontissa, ajaa koko rakennusketjun ja kopioi artefaktit hakemistoon
`infra/museovirasto-map-data/data/updater-local/`. Isäntäkoneelle ei asenneta
paikkatietotyökaluja. Kontin sisäinen pääkomento on
`processing/scripts/run.sh`.

## Yöajon validointilinja

Yöajo tarkistaa vain päivittäin ladattavan aineiston ja siitä syntyvien
artefaktien turvallisuuden:

1. odotetut 12 GeoPackage-tasoa löytyvät, eivät ole tyhjiä, käyttävät odotettua
   geometriatyyppiä ja EPSG:3067-koordinaatistoa eikä niissä ole virheellisiä
   geometrioita;
2. PMTiles rakentuu nykyisellä versionoidulla mappingilla ja koodistolla;
3. PMTiles on eheä, sisältää odotetut lähdetasot ja minimikentät sekä säilyttää
   pisteet ja matalan zoomin aluekeskipisteet;
4. arkiston zoomialue ja kokobudjetit eivät ylity;
5. D1-tuonti rakentuu kaikista hyväksytyistä geometriallisista riveistä;
6. PMTiles-rakennussyötteen ja D1:n `source-layer + fid` -avaimet täsmäävät;
7. manifesti, tarkistussummat, lähdeaikaleimat ja julkaisutiedot muodostuvat.

Tavallista päivittäistä rivimäärää ei verrata snapshotiin eikä lukita. Mappingin,
UI-enumien tai muunnoskoodin staattisia tarkistuksia ei toisteta
yöajossa; ne ajetaan vain kyseisiä tiedostoja muutettaessa.

Tuotokset kirjoitetaan gitistä ohitettuun `data/build`-hakemistoon:

- `museovirasto.pmtiles`
- `contract/filter-vocabulary.json` (versionhallittu ja selainrakennukseen sisältyvä koodisto)
- `feature-details.sql`
- `feature-details-report.json`
- `pmtiles-d1-identity-report.json`
- `tiling-budget-report.json`
- `build-manifest.json`
- `release-descriptor.json`
- `current-metadata.json`

Virheellistä geometriaa ei korjata tai pudoteta hiljaisesti. Tasokohtainen
ennalta tunnettu geometriaton poikkeus validoidaan erikseen. Manifesti sisältää
lähde- ja konfiguraatiotiivisteet, artefaktien koot ja
SHA-256-tiivisteet sekä keskeiset tietuemäärät.

D1-rivimäärä luetaan manifestiin `feature-details-report.json`-raportista. Raportti sisältää jokaiselle 12 tasolle lähderivit, hyväksytyt geometriattomat poikkeukset ja tuotetut D1-rivit. Nykyisessä aineistossa lähderivejä on 268 965 ja D1-rivejä 268 964, koska yksi ennalta hyväksytty arkeologinen aluerivi on geometriaton.

`pmtiles-d1-identity-report.json` varmistaa, että PMTiles-rakennussyötteen kaikki 268 964 `source-layer + fid` -avainta vastaavat D1-tuontia ja ettei zoomin 0 PMTilesissä ole D1:stä puuttuvaa tunnistetta. Zoomin 0 arkistossa on 268 905 tunnistetta: 59 RKY-viivaa yksinkertaistuu pois matalimmalta zoomilta mutta säilyy D1:ssä ja tarkemmilla zoomeilla. Pisteiden ja aluekeskipisteiden täydellisyys tarkistetaan erikseen PMTiles-validoinnissa.

UTC-aikaleimaversio, aktiiviset vakioavaimet, palautusavaimet ja yöllinen käyttöönottoprosessi on määritelty tiedostossa [RELEASE_CONTRACT.md](RELEASE_CONTRACT.md). Rakennus tuottaa `release-descriptor.json`- ja valinnaisen `/api/museovirasto/meta`-reitin `current-metadata.json`-tiedostot; ulkoista ympäristöä ei muuteta vaiheessa 2.

Tuntematon suodatuksessa tarvittava laji-, tyyppi-, ajoitus- tai alatyyppiarvo
estää rakennuksen vasta muunnosvaiheessa, koska nykyinen selainkoodisto ei voisi
tulkita sitä oikein. Näyttötietojen tavalliset uudet arvot eivät estä ajoa.

Koodimuutosten kehitystarkistukset voidaan ajaa imagen sisällä tarvittaessa.
Varsinainen paikallinen hyväksyntäajo on:

```bash
cd infra/museovirasto-map-data/updater
npm run process:local
```

Zoomit, keskipiste-/polygoniraja, Tippecanoen harvennus- ja kokorajoitusten käyttö sekä kokobudjetit ovat `processing/config/layers.json`-tiedoston `tiling`- ja `budgets`-osissa. Rakennus estyy, jos arkisto ylittää 75 000 000 tavua, zoomin 0 pakkaamaton MVT-tiili ylittää 1 500 000 tavua tai arkiston zoomialue poikkeaa asetuksesta 0–14.

Paikallista R2/D1-PoC-ympäristöä ei enää ylläpidetä. Integraatiotestaus tehdään
preview-ympäristössä ennen production-julkaisua.

Kun Worker on deployattu ja Cloudflare-resurssit on provisioitu valittuun ympäristöön, samat aktiiviset artefaktit julkaistaan etäympäristöön näin:

```bash
infra/museovirasto-map-data/deploy/scripts/30-publish-cloudflare-release.sh preview
```

Skripti validoi ympäristön ja artefaktit, ajaa D1-migraatiot, korvaa D1-aineiston, lataa `current.pmtiles`- ja `current.json`-objektit sekä ajaa lopuksi palvelun smoke-testin. D1-tuontiartefakti ei sisällä eksplisiittisiä `BEGIN TRANSACTION`- tai `COMMIT`-lauseita, koska Wranglerin etätuonti hallitsee tuonnin ja virheestä palautumisen itse. Production vaatii lisäksi eksplisiittisen `--confirm-production`-argumentin.
