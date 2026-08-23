# Paikallinen PMTiles-, R2- ja OpenLayers-PoC

Tämä hakemisto on muinaismuistot.info-sovelluksesta täysin irrallinen tekninen koe. Se sisältää:

- Cloudflare Workerin, joka validoi yhden HTTP byte range -pyynnön ja lukee vain pyydetyn välin R2-bindingista;
- Wranglerin paikallisesti simuloiman R2-bucketin;
- Cloudflaren Workers-runtimessa ajettavat Vitest-testit;
- yksinkertaisen OpenLayers-sivun, joka käyttää yhtä PMTiles-lähdettä ja muodostaa `layer-mapping.json`-tiedoston perusteella 26 loogista tasovalintaa.

OpenLayersin tyylipolku on rakennettu suorituskykymittausta varten ilman feature-kohtaisia allokaatioita: loogisen tason valinta käyttää esilaskettuja `source-layer`- ja `laji_key`-hakutauluja, ja kaikki `Style`, `Fill`, `Stroke` sekä pistesymbolit luodaan vain kerran konfiguraation latauksessa.

Arkeologisten pääkohdepisteiden PoC-suodattimissa ovat nykyisen sivuston 19 päätyyppiä ja 12 ajoitusta sekä erillinen alatyyppihakuehto. Painike **Pronssikautiset hautaröykkiöt** valitsee vain kiinteiden muinaisjäännösten pistetason sekä ehdot `hautapaikat`, `pronssikautinen` ja `hautaröykkiöt`. Tuotanto-GeoPackagessa yhdistelmään osuu 1 467 pistettä.

PoC ei käytä Cloudflare-tiliä, oikeaa R2-bucketia eikä nykyisen sivuston lähdekoodia.

## Käynnistäminen

Rakenna PMTiles-arkisto ensin projektihakemistossa, jos sitä ei vielä ole:

```bash
infra/museovirasto-map-data-server/scripts/10-build-pmtiles-poc.sh
```

Asenna PoC:n riippuvuudet ja siirrä arkisto paikalliseen R2-simulaatioon:

```bash
cd infra/museovirasto-map-data-server/poc
npm install
npm run seed
```

Käynnistä Worker ja staattinen OpenLayers-sivu:

```bash
npm run dev
```

Avaa <http://localhost:8787>. `npm run seed` tarvitsee ajaa uudelleen PMTiles-arkiston uudelleenrakentamisen jälkeen. Paikallinen R2-data säilyy gitistä ohitetussa `poc/.wrangler/state`-hakemistossa.

## Tarkistukset

```bash
npm test
npm run typecheck
npm run build
```

Vitest-alustus kirjoittaa jokaiseen testiin pienen deterministisen R2-objektin. Testit kattavat täsmällisen, avoimen ja suffix-tavuvälin, loppupään rajauksen, virheelliset ja moniosaiset ranget, puuttuvan rangen, `HEAD`-, `OPTIONS`- ja virheelliset metodit, puuttuvan objektin sekä 26 loogisen tason API-vastauksen.

## Rajaukset

- Alustavat OpenLayers-tyylit toteuttavat tyylisopimuksen värit ja tärkeimmät pistemuodot, mutta eivät vielä alueiden ristikkäisviivoitusta.
- Rakennusskripti säilyttää suorituskykykokeessa kaikki pisteet myös matalilla zoom-tasoilla ja poistaa Tippecanoen tiilikoko- ja kohdemäärärajat. Tämä on tarkoituksellinen pahimman tapauksen testi, ei ehdotus lopulliseksi kartografiseksi esitykseksi.
- Selainfiltterit käyttävät kompaktin MVT:n `type_mask`- ja `dating_mask`-bittimaskeja sekä `subtype_codes`-koodijoukkoa. Versionoitu koodisto on `web/filter-vocabulary.json`; alatyyppihaun osajonosemantiikka säilyy koodiston nimien kautta.
- Diagnostiikka laskee PMTiles-kutsujen vastaustavut selaimen `Content-Length`-otsakkeista. Se ei vastaa oikean R2-palvelun laskutusta tai verkkoviivettä.
- Diagnostiikan kokonais- ja näkyvien uudelleentyylittelykutsujen määrät nollataan karttaliikkeen alussa ja näytetään renderöinnin valmistuttua. Nolla tarkoittaa, että OpenLayers piirsi liikkeen valmiiksi välimuistitetuista renderöintiohjeista kutsumatta tyylifunktiota uudelleen. Muutoin lukujen erotus näyttää, kuinka suuri osa uudelleen käsitellyistä featureista rajautui pois tasovalinnan tai suodattimen vuoksi. Luvut eivät ole ruudulle piirrettyjen yksilöllisten kohteiden määriä.
- Liikemittaus näyttää `moveend`-tapahtuman jälkeen ensimmäiseen `rendercomplete`-tapahtumaan kuluvan odotusajan, koko eleen OpenLayers-`postrender`-kierrokset sekunnissa, peräkkäisten renderöintien p95-ruutuvälin sekä viimeisimmästä `pointermove`- tai `wheel`-syötteestä seuraavaan renderöintiin kuluvan p95-ajan. Renderöintikierrokset ovat vertailumittari, eivät selaimen näytöltä mitattu tarkka FPS. Käyttäjän eleen kokonaiskestoa ei raportoida suorituskykymittarina.
- Worker tekee PoC:n selkeyden vuoksi R2 `head` -kutsun ennen jokaista tavuvälilukua. Mahdollinen metadataoptimointi päätetään vasta mittausten perusteella.
- PoC ei testaa Cloudflaren edge-välimuistia eikä oleta `206 Partial Content` -vastausten välimuistittuvan.
