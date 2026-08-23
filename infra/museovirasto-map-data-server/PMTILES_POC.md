# PMTiles proof of concept

## Ensimmäinen rakennettu arkisto

Vaiheen 1 ensimmäinen tekninen koe muuntaa koko inventoidun tuotantoaineiston yhdeksi PMTiles-arkistoksi. Arkisto sisältää samat 12 fyysistä lähdetasoa kuin `layer-mapping.json`; käyttöliittymän 26 loogista tasoa muodostetaan myöhemmin näiden lähdetasojen ja `laji_key`-suodattimien avulla.

Ensimmäisen, myöhemmin liian harvaksi todetun ajon tulos:

- lähdegeometrioita: 268 965
- arkistoon hyväksyttyjä geometrioita: 268 964
- pois jätettyjä geometrioita: yksi geometriaton `archaeological_areas`-tietue (`fid=44923`)
- PMTiles-arkiston koko: 81 014 022 tavua (noin 77,3 MiB)
- zoom-tasot: 0–14
- MVT-lähdetasoja: 12
- osoitettuja tiiliä: 128 990
- yksilöllisiä tiilisisältöjä: 127 163
- aineiston rajaus: 19.612325, 59.601162 – 31.579558, 70.075755

Arkisto on paikallinen, Gitistä pois rajattu PoC-artefakti: `data/poc/museovirasto-poc.pmtiles`.

Harvennusasetusten poistamisen jälkeen rakennettu suorituskykyarkisto on 138 301 298 tavua (noin 131,9 MiB). Se sisältää 129 014 osoitettua tiiltä ja 127 187 yksilöllistä tiilisisältöä. Zoomin 0 yksittäisen, koko maailman kattavan tiilen pakkaamaton MVT-vastaus on 3 163 953 tavua.

Zoomin 0 tiilestä dekoodatut pistemäärät vastaavat nyt arkiston koko pistemäärää:

| MVT-lähdetaso | Pisteitä zoomilla 0 |
| --- | ---: |
| `archaeological_points` | 112 441 |
| `archaeological_subsites_points` | 63 216 |
| `protected_building_points` | 2 290 |
| `rky_points` | 64 |
| `vark_points` | 1 010 |
| `world_heritage_points` | 6 |

`archaeological_points`-tason 112 441 pisteestä 41 549 on `kiintea_muinaisjaannos`-kohteita. Aiemman arkiston viiden näkyvän kohteen ongelma ei siten enää johdu PMTiles-aineiston harvennuksesta. Validointiskripti tarkistaa jatkossa automaattisesti, että jokaisen fyysisen pistetason zoomin 0 määrä vastaa PMTiles-metadatan koko määrää.

## Toistaminen

PoC käyttää paikallisia Homebrew-asennuksia, ei konttia. Ensimmäinen ajo tehtiin versioilla GDAL 3.13.3 ja Tippecanoe 2.79.0. PMTiles-tarkistustyökalu lukitaan latausskriptissä versioon 1.31.2 ja sen SHA-256-tiiviste tarkistetaan.

```bash
brew install gdal tippecanoe jq
infra/museovirasto-map-data-server/scripts/09-download-pmtiles-cli.sh
infra/museovirasto-map-data-server/scripts/10-build-pmtiles-poc.sh
infra/museovirasto-map-data-server/scripts/11-validate-pmtiles-poc.sh
```

Kenttäprojektiot ja lähdetasot ovat tiedostossa `poc-layer-config.json`. Rakennusskripti tarkistaa niiden vastaavan `layer-mapping.json`-tiedostoa ja vertaa jokaisen välivaiheen tietuemäärää lähdeaineistoon.

## Ensimmäiset havainnot ja avoimet kysymykset

- Yksi PMTiles-arkisto toimii teknisesti kaikkien 12 fyysisen lähdetason säiliönä. Erillisiä arkistoja ei tarvita tasovalintoja varten.
- Ensimmäinen arkisto käytti Tippecanoen `--drop-densest-as-needed`- ja `--coalesce-densest-as-needed`-asetuksia sekä 300 000 tavun tiilirajaa. Lisäksi Tippecanoen oletuspudotus harventaa pisteitä maksimizoomia alemmilla tasoilla. Koko Suomen näkymässä seurauksena näkyi esimerkiksi vain viisi kiinteän muinaisjäännöksen pistettä, joten arkisto ei kelvannut koko aineiston selainkuorman mittaamiseen.
- Suorituskyky-PoC rakennetaan tämän havainnon vuoksi asetuksilla `--drop-rate=1`, `--no-feature-limit`, `--no-tile-size-limit` ja `--no-tiny-polygon-reduction`. Tavoite ei ole tuotantokartografia vaan tarkoituksellinen pahimman tapauksen koe: kaikki pisteet ja pienet polygonit säilyvät myös matalilla zoom-tasoilla, vaikka tiilet kasvavat erittäin suuriksi.
- Raakamuotoiset tyyppi-, alatyyppi- ja ajoituskentät kasvattavat arkistoa ja metadataa. OpenLayers-kokeessa selvitetään, mitkä attribuutit tarvitaan todella karttatyyleihin ja kohteen tunnistamiseen; sanahaku ei edellytä niiden säilyttämistä jokaisessa tiilessä.
- `source_fid` toimii tässä kokeessa MVT-tunnisteena. Tuotantoputkessa se korvataan suunnitelman mukaisella vakaalla komposiittitunnisteella.
- Suorituskykyarkistolla ei ole Tippecanoen tiilikoko- tai kohdemäärärajaa. Tyypillisten ja pahimpien tiilien koko, selaimen renderöintikyky ja HTTP Range -pyynnöt ovat tämän kokeen varsinaisia mittaustuloksia. Mahdollinen tuotantoratkaisu tarvitsee mittausten perusteella erikseen päätettävän zoom-kohtaisen esityksen, kuten klusteroinnin tai muun eksplisiittisen aggregoinnin; kohteiden hiljainen pudottaminen ei ole hyväksyttävä ratkaisu.

Seuraava vaihe 1:n tehtävä on avata arkisto OpenLayersissa paikallisesti, toteuttaa 26 loogisen tason näkyvyys yhdestä lähteestä ja tarkistaa tyylit sekä kohteiden valinta kolmella edustavalla zoom-tasolla.

## Paikallinen Worker- ja OpenLayers-koe

Arkistolle on toteutettu muinaismuistot.info-sovelluksesta irrallinen paikallinen PoC hakemistoon [`poc/`](poc/README.md). Wrangler ajaa Workerin paikallisesti ja säilyttää koko PMTiles-arkiston simuloidussa R2-bucketissa. Worker ei palauta koko arkistoa, vaan vaatii yhden kelvollisen byte range -pyynnön, tarkistaa sen objektin kokoa vasten ja lukee R2-bindingista vain sovitun välin.

Cloudflaren Workers Vitest -integraation 15 testiä varmistavat Range-, virhe-, CORS- ja metadata-vastaukset paikallista R2-bindingia vasten. OpenLayers-sivu käyttää yhtä `PMTilesVectorSource`-oliota ja hakee 26 loogisen tason määrittelyn suoraan versionhallituista `layer-mapping.json`-tiedoista Workerin API:n kautta. Checkboxit muuttavat saman vektoritiililayerin tyylisuodatusta, eivät tietolähdettä.

Ensimmäisellä arkistolla tehty end-to-end-tarkistus palautti pyynnölle `bytes=0-16383` täsmälleen 16 384 tavua ja vastauksen `206 Partial Content`. Palautuneet tavut vastasivat paikallisen arkiston alkua, ja PMTiles CLI pystyi lukemaan Workerin URL:n kautta arkiston version 3 metadatan sekä kaikki 0–14 zoom-tasot. Worker on arkiston koosta riippumaton, ja korjattu 138 301 298 tavun suorituskykyarkisto on ladattu samaan paikalliseen R2-avaimeen.

Seuraavaksi tarvitaan selaimessa tehtävä visuaalinen tarkistus kolmella edustavalla zoom-tasolla. Alueiden ristikkäisviivoitus, symbolien lopulliset pikselikoot ja yleistyksen hyväksyttävyys eivät ole vielä lukittuja.

Täyden pisteaineiston ensimmäisessä selainmittauksessa koko Suomen näkymä siirsi vain noin 4,5 Mt dataa kuudella Range-pyynnöllä, mutta kartan liikuttaminen hidastui M1 Max -koneellakin noin yhteen kuvaan sekunnissa. Tämän jälkeen PoC:n oma tyylifunktio optimoitiin pois tulosta vääristävänä tekijänä: aiempi toteutus kävi featurea kohden lineaarisesti läpi enintään 26 loogista tasoa ja loi uudet OpenLayers-tyylioliot jokaisella kutsulla. Nykyinen toteutus käyttää vakioaikaisia `source-layer`- ja `laji_key`-hakutauluja sekä kerran luotuja ja uudelleenkäytettäviä tyyliolioita. Diagnostiikka näyttää lisäksi karttaliikkeen aikana tehtyjen tyylikutsujen määrän. FPS ja muut selainmittarit on mitattava uudelleen tällä versiolla ennen aggregointipäätöstä.
