# Paikallinen PMTiles-, R2- ja OpenLayers-PoC

Tämä hakemisto on muinaismuistot.info-sovelluksesta täysin irrallinen tekninen koe. Se sisältää:

- Cloudflare Workerin, joka validoi vakio-osoitteeseen `/api/museovirasto/pmtiles` tulevan HTTP byte range -pyynnön ja lukee vain pyydetyn välin R2-bindingista;
- Wranglerin paikallisesti simuloiman R2-bucketin;
- Cloudflaren Workers-runtimessa ajettavat Vitest-testit;
- yksinkertaisen OpenLayers-sivun, joka käyttää yhtä PMTiles-lähdettä ja muodostaa `layer-mapping.json`-tiedoston perusteella 26 loogista tasovalintaa.

OpenLayersin tyylipolku on rakennettu suorituskykymittausta varten ilman feature-kohtaisia allokaatioita: loogisen tason valinta käyttää esilaskettuja `source-layer`- ja `laji_key`-hakutauluja, ja kaikki `Style`, `Fill`, `Stroke` sekä pistesymbolit luodaan vain kerran konfiguraation latauksessa.

Arkeologisten pääkohdepisteiden PoC-suodattimissa ovat nykyisen sivuston 19 päätyyppiä ja 12 ajoitusta sekä erillinen alatyyppihakuehto. Painike **Pronssikautiset hautaröykkiöt** valitsee vain kiinteiden muinaisjäännösten pistetason sekä ehdot `hautapaikat`, `pronssikautinen` ja `hautaröykkiöt`. Tuotanto-GeoPackagessa yhdistelmään osuu 1 467 pistettä.

PoC ei käytä Cloudflare-tiliä, oikeaa R2-bucketia eikä nykyisen sivuston lähdekoodia.

## Käynnistäminen

Rakenna PMTiles-arkisto ensin projektihakemistossa, jos sitä ei vielä ole:

```bash
infra/museovirasto-map-data/processing/scripts/13-build-compact-pmtiles-poc.sh
```

Vaiheen 2 suositeltu yhteisajo rakentaa ja validoi sekä PMTiles-arkiston että D1-tuonnin lukituilla työkaluversioilla:

```bash
infra/museovirasto-map-data/processing/scripts/17-build-release-artifacts.sh
```

Asenna PoC:n riippuvuudet sekä siirrä versionoitu arkisto paikalliseen R2-simulaatioon ja vastaava aineistoversio D1-simulaatioon:

```bash
cd infra/museovirasto-map-data/poc
npm install
npm run seed
```

Käynnistä Worker ja staattinen OpenLayers-sivu:

```bash
npm run dev
```

Avaa <http://localhost:8787>. Selain aloittaa kartan latauksen suoraan vakio-osoitteesta `/api/museovirasto/pmtiles`; valinnainen `/api/museovirasto/meta` ei kuulu kartan kriittiseen latauspolkuun. `npm run seed` tarvitsee ajaa uudelleen julkaisuartefaktien uudelleenrakentamisen jälkeen. Paikallinen R2- ja D1-data säilyvät gitistä ohitetussa `poc/.wrangler/state`-hakemistossa.

Kun paikallinen Worker on käynnissä, aja toisessa terminaalissa `npm run smoke`. Testi tarkistaa `/api/museovirasto/health`-reitin, PMTiles Range -vastauksen sekä ominaisuus-, rekisteri- ja sanahaun oikealla siemennetyllä aineistolla. Health-reitti palauttaa `503`, jos `current.pmtiles`, kelvollinen `current.json` tai vähintään yksi D1-rivi puuttuu.

`npm run test:rollback` testaa R2-metadatan ja D1-rivien varmuuskopioinnin sekä palautuksen pienessä, eristetyssä väliaikaisessa Wrangler-ympäristössä; testi ei muuta varsinaista PoC-aineistoa. Käyttöönotossa ei ole erillistä huoltotilaa: etukäteen validoidut D1- ja PMTiles-aineistot vaihdetaan yöllä peräkkäin, minkä jälkeen smoke-testi joko hyväksyy julkaisun tai käynnistää palautuksen.

## Tarkistukset

```bash
npm test
npm run typecheck
npm run build
npm run measure:browser # PoC-palvelimen ollessa käynnissä toisessa terminaalissa
```

Selainmittaus avaa kylmällä Chrome-profiililla koko Suomen, suodatetun koko Suomen, kaupunki- ja lähitason vakionäkymät. Tulokset tulostuvat JSON-muodossa. Mittausmenetelmä ja hyväksytty vertailuajo on dokumentoitu tiedostossa `../POC_BROWSER_PERFORMANCE.md`.

Oikeaa Cloudflare-preview-palvelua voidaan mitata paikallisella PoC-käyttöliittymällä käynnistämällä PoC normaalisti ja antamalla mittaukselle API:n origin:

```bash
POC_API_BASE=https://muinaismuistot-preview.antti-kekki.workers.dev npm run measure:browser
```

Saman voi tarkistaa käsin lisäämällä PoC-sivun URL:iin parametrin `apiBase=https://muinaismuistot-preview.antti-kekki.workers.dev`. Vain Museovirasto-API:n pyynnöt ohjataan valittuun originiin; PoC:n HTML ja JavaScript palvellaan edelleen paikallisesti.

Ominaisuustietojen paikallinen D1 rakennetaan ja alustetaan projektin juuresta:

```bash
infra/museovirasto-map-data/processing/scripts/14-build-feature-details-sql.sh
infra/museovirasto-map-data/poc/scripts/15-seed-local-d1-poc.sh
```

Karttaklikkaus kerää enintään 100 näkyvien tasojen päällekkäistä MVT-featurea, deduplikoi `sourceLayer + featureId` -parit ja hakee näyttötiedot yhdellä `POST /api/museovirasto/features/batch` -pyynnöllä. Haku kohdistuu aina yhteen aktiiviseen D1-aineistoon. Aggregaattimerkin klikkaus zoomaa kaksi tasoa lähemmäs.

MVT:n `featureId` on GeoPackagen `fid`, jota käytetään vain saman aineistojulkaisun sisällä. Pysyviä URL-linkkejä varten Worker tarjoaa `POST /api/museovirasto/features/by-register` -massahaun. Sen viitteet ovat `{logicalLayerId, registryId}`-pareja, ja vastaus sisältää kaikki uusimmasta D1-aineistosta löytyvät rivit. Lähderivejä ei deduplikoida.

Yksinkertainen sanahaku on `GET /api/museovirasto/search?q=...`. Hakuehdon pitää olla 3–100 merkkiä. Haku toimii nimien kirjainkoosta riippumattomalla osajonolla ja rekisteritunnuksen osalla, palauttaa enintään 50 rekisterikohdetta ja ilmoittaa `truncated`-lipulla tulosrajan ylittymisestä. Vastauksella on 60 sekunnin julkinen välimuistiotsake.

Vitest-alustus kirjoittaa jokaiseen testiin pienen deterministisen R2-objektin. Testit kattavat täsmällisen, avoimen ja suffix-tavuvälin, loppupään rajauksen, virheelliset ja moniosaiset ranget, puuttuvan rangen, `HEAD`-, `OPTIONS`- ja virheelliset metodit, puuttuvan objektin sekä 26 loogisen tason API-vastauksen.

## Rajaukset

- Alustavat OpenLayers-tyylit toteuttavat tyylisopimuksen värit ja tärkeimmät pistemuodot, mutta eivät vielä alueiden ristikkäisviivoitusta.
- Rakennusskripti säilyttää suorituskykykokeessa kaikki pisteet myös matalilla zoom-tasoilla ja poistaa Tippecanoen tiilikoko- ja kohdemäärärajat. Tämä on tarkoituksellinen pahimman tapauksen testi, ei ehdotus lopulliseksi kartografiseksi esitykseksi.
- Selainfiltterit käyttävät kompaktin MVT:n `type_mask`- ja `dating_mask`-bittimaskeja sekä `subtype_codes`-koodijoukkoa. Versionoitu koodisto on `web/filter-vocabulary.json`; alatyyppihaun osajonosemantiikka säilyy koodiston nimien kautta.
- Diagnostiikka laskee PMTiles-kutsujen vastaustavut selaimen `Content-Length`-otsakkeista. Se ei vastaa oikean R2-palvelun laskutusta tai verkkoviivettä.
- `Aloitusnäkymän data valmis` korvaa aikaisemman harhaanjohtavan ensimmäisen renderöinnin ajan. Mittari valmistuu vasta, kun näkymän vektoritiililataukset ovat päättyneet, aktiivinen esitystapa on laskettu ja sama esitystila on renderöity seuraavalla kierroksella.
- PoC deduplikoi nykyisen näkymän vektoritiilifeaturet yhdistelmällä `source-layer + MVT feature ID`, koska sama feature voi esiintyä leikattuna useassa tiilessä. Diagnostiikka näyttää ladattujen featureiden, aktiivisten pisteiden, yksittäisinä piirrettävien pisteiden ja aggregaattimerkkien määrät.
- Pistetasoille käytetään aktiivisen suodatuksen jälkeistä 64 pikselin selainruudukkoaggregointia. Yhteen ruutuun muodostetaan tasojen määrästä riippumatta yksi kokonaismäärän näyttävä symboli, jonka väri tulee ruudun yleisimmästä loogisesta tasosta. Aggregointi käynnistyy oletuksena yli 40 000 aktiivisella pisteellä ja poistuu alle 20 000 pisteellä. Rajoja voi muuttaa PoC-sivulta. Polygonit ja viivat eivät kuulu tämän ensimmäisen aggregointikokeen piiriin.
- Kaikki viisi aluetasoja sisältävää lähdetasoa ovat keskipisteitä zoomeilla 0–9 ja varsinaisia polygoneja zoomeilla 10–14. Keskipisteet tunnistetaan geometriatyypistä ja osallistuvat pisteaggregointiin, vaikka `source-layer`-nimi päättyy `_areas`. Sama looginen taso ja feature-ID säilyvät zoomivaihdon yli.
- Diagnostiikan kokonais- ja näkyvien uudelleentyylittelykutsujen määrät nollataan karttaliikkeen alussa ja näytetään renderöinnin valmistuttua. Nolla tarkoittaa, että OpenLayers piirsi liikkeen valmiiksi välimuistitetuista renderöintiohjeista kutsumatta tyylifunktiota uudelleen. Muutoin lukujen erotus näyttää, kuinka suuri osa uudelleen käsitellyistä featureista rajautui pois tasovalinnan tai suodattimen vuoksi. Luvut eivät ole ruudulle piirrettyjen yksilöllisten kohteiden määriä.
- Liikemittaus näyttää `moveend`-tapahtuman jälkeen ensimmäiseen `rendercomplete`-tapahtumaan kuluvan odotusajan, koko eleen OpenLayers-`postrender`-kierrokset sekunnissa, peräkkäisten renderöintien p95-ruutuvälin sekä viimeisimmästä `pointermove`- tai `wheel`-syötteestä seuraavaan renderöintiin kuluvan p95-ajan. Renderöintikierrokset ovat vertailumittari, eivät selaimen näytöltä mitattu tarkka FPS. Käyttäjän eleen kokonaiskestoa ei raportoida suorituskykymittarina.
- Worker tekee PoC:n selkeyden vuoksi R2 `head` -kutsun ennen jokaista tavuvälilukua. Mahdollinen metadataoptimointi päätetään vasta mittausten perusteella.
- PoC ei testaa Cloudflaren edge-välimuistia eikä oleta `206 Partial Content` -vastausten välimuistittuvan.
