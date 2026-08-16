# Tietokanta Suomen röykkiöhautojen koosta

## Tavoite

Tämän kansion skriptit selvittävät Museoviraston [kyppi.fi](https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx) sivuston arkeologisten kohteiden tietojen avulla kiviröykkiöhautöjen koot ja luovat niistä yleiskäyttöisen tietokannan JSON-tiedostona. Tulos on tarkotus näyttää muinaismuistot.info sivustolla OpenLayers-kirjaston avulla Maanmittaulaitoksen kartta-aineistön päällä.

Tavoitteena on mahdollistaa käyttäjille tapa arvioida röykkiön näyttävyyttä ja löytää Suomen isoimmat röykkiöt.

Skriptit ovat bash- tai Node.js-skriptejä, jotka suoritetaan omalla koneella.

## Toteutus ja käyttö

Dataputken neljä ensimmäistä vaihetta on toteutettu. `1_fetch-site-index.mjs`
hakee hautaröykkiökohteiden luettelon Museoviraston WFS-palvelusta ja
`2_download-pages.mjs` lataa valittujen kohteiden Kyppi-sivut paikallisiksi
HTML-tiedostoiksi. `3_extract-page-content.mjs` jäsentää sivuilta vain Kuvaus-
osion leipätekstin JSONL-muotoon. `4_extract-mound-dimensions.mjs` poimii tästä
kuvauksesta röykkiöiden mitat OpenAI-kielimallilla rakenteiseen muotoon.

Vaatimuksena on Node.js 22 tai uudempi. Asenna hakemiston npm-paketti ja aja
testit:

```bash
cd scripts/röykkiöiden-koot
npm install
npm test
```

Hae koko kohdeluettelo:

```bash
npm run step:1
```

Pienen testiajon voi tehdä lataamalla esimerkiksi kolme ensimmäistä kohdetta:

```bash
npm run step:1 -- --limit 3
```

WFS-sivukoon voi vaihtaa valinnalla `--page-size N`. Skripti hakee sivut
peräkkäin ja yrittää tilapäisesti epäonnistunutta pyyntöä uudelleen.

Ensimmäinen vaihe kirjoittaa seuraavat tiedostot:

- alkuperäiset WFS-sivut hakemistoon `source-data/wfs/pages`
- jokaisen alkuperäisen GeoJSON Featuren erikseen hakemistoon
  `source-data/wfs/features`
- normalisoidun GeoJSON-kohdeluettelon tiedostoon
  `intermediate/1_sites.geojson`
- ajon kysely- ja sivutustiedot tiedostoon `intermediate/1_manifest.json`

Lataa toisessa vaiheessa yksittäinen Kyppi-sivu `mjtunnus`-arvon perusteella:

```bash
npm run step:2 -- --site 531010025
```

Useamman yksittäisen kohteen voi ladata toistamalla `--site`-valinnan. Pienen
otoksen voi valita kohdeluettelon alusta valinnalla `--limit N`. Koko aineisto
ladataan vain nimenomaisella valinnalla `--all`, jotta tuhansien pyyntöjen ajo
ei käynnisty vahingossa.

Onnistuneesti ladattu ja tiivisteeltään muuttumaton sivu ohitetaan seuraavalla
ajolla. Valinta `--force` pakottaa uudelleenlatauksen. Latausten oletusväli on
yksi sekunti, oletusrinnakkaisuus yksi ja sallittu enimmäisrinnakkaisuus kolme.

Toinen vaihe kirjoittaa:

- HTML-sivut hakemistoon `source-data/pages/<mjtunnus>.html`
- onnistumiset, virheet, uudelleenohjausten lopulliset URL:t, HTTP-metatiedot
  ja SHA-256-tiivisteet tiedostoon `intermediate/2_download-manifest.json`

Jäsennä kolmannessa vaiheessa kaikki onnistuneesti ladatut sivut:

```bash
npm run step:3
```

Paikallisen jäsennyksen voi rajata valinnoilla `--site MJTUNNUS` tai
`--limit N`. Vaihe ei tee verkkokutsuja. Se tarkistaa HTML-tiedoston SHA-256-
tiivisteen vaiheen 2 manifestista ja kirjoittaa:

- kohdekohtaiset rakenteiset tietueet tiedostoon
  `intermediate/3_site-content.jsonl`
- yhteenvedon ja varoitusmäärät tiedostoon
  `intermediate/3_parse-report.json`

Neljäs vaihe käyttää OpenAI Node.js SDK:ta, Responses API:a ja tiukkaa JSON
Schema -vastausmuotoa. Oletusmalli on `gpt-5.6-luna`. Aseta API-avain vain
ympäristömuuttujaan:

```bash
export OPENAI_API_KEY="oma-api-avain"
```

Testaa ensin yhdellä vaiheen 3 kohteella:

```bash
npm run step:4 -- --site 262010002
```

Skripti vaatii aina rajauksen `--site MJTUNNUS`, `--limit N`, `--all` tai
`--retry-failed`, joten koko maksullinen ajo ei käynnisty vahingossa. Saman
syötteen, mallin, promptiversion ja skeemaversion onnistunut vastaus luetaan
seuraavalla ajolla välimuistista ilman API-kutsua. `--force` ohittaa
välimuistin. Mallin voi vaihtaa valinnalla `--model MODEL` ja rinnakkaisuuden
valinnalla `--concurrency N`; enimmäisrinnakkaisuus on kolme.

Vaihe lähettää OpenAI API:lle kohteen tunnuksen ja Kuvaus-osion leipätekstin.
Muita HTML-sivun osioita ei jäsennetä eikä lähetetä. Pyynnöissä käytetään
asetusta `store: false`. API-avainta tai
kokonaista raakavastausta ei tallenneta. Vaihe kirjoittaa:

- kohdekohtaiset onnistumiset ja virheet hakemistoon
  `intermediate/llm-responses`
- yhdistetyt mittatiedot tiedostoon
  `intermediate/4_mound-dimensions.jsonl`
- API-kutsujen, välimuistiosumien, virheiden ja tokenkäytön yhteenvedon
  tiedostoon `intermediate/4_extraction-report.json`

Validoi vaiheen 4 tulokset paikallisesti ilman uusia API-kutsuja:

```bash
npm run step:5
```

Vaihe kirjoittaa validoidut tulokset tiedostoon `intermediate/5_validated.jsonl`,
käsin tarkistettavat kohteet tiedostoon `intermediate/5_review.json` ja
yhteenvedon tiedostoon `intermediate/5_validation-report.json`. Tarkistusraportti
sisältää ongelmien lisäksi alkuperäisen kuvauksen sekä mallin
poimimat röykkiöt, mitat ja lähdekatkelmat rinnakkaista tarkistamista varten.
Komento tulostaa lisäksi terminaaliin jokaisesta tarkistettavasta kohteesta
tunnuksen, nimen ja kunnan, ongelmakoodit sekä Kyppi-linkin.

Valinta `--all` voi aiheuttaa merkittäviä API-kuluja. Koko aineiston ajo
kannattaa tehdä vasta yksittäisten kohteiden tulosten tarkistamisen jälkeen.
Rajattu ajo rakentaa yhdistetyn JSONL-tiedoston uudelleen kaikista nykyisellä
mallilla kelvollisista välimuistituloksista, joten aiemmin käsitellyt kohteet
säilyvät mukana.

Generoidut `source-data`, `intermediate` ja `results`-hakemistot on rajattu
versionhallinnan ulkopuolelle. Vaiheiden tarkempi rakenne ja
myöhempien vaiheiden suunnitelma on kuvattu tiedostossa
[TOTEUTUSSUUNNITELMA.md](./TOTEUTUSSUUNNITELMA.md).

## Lähdeaineisto

### Aineiston tyyppi ja rakenne

kyppi.fi sivustolta löytyy tuhansia arkeologisia kohteita, joiden tyyppi on hautapaikka ja alatyyppi hautaröykkiö. Niiden tekstimuotoinen kuvaus sisältää tiedon röykkiön koosta.

Esim. [Euran Heikkilä](https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=262010002):
> Röykkiö sijaitsee Eurajoentien pohjoispuolella, aivan tien laidassa, Routsin talosta noin 100 m lounaaseen, hiekkapohjaisella mäellä. Sen halkaisija on noin 11 m. Röykkiö on pyöreä ja sammaleen peittämä. Sen korkeus on 30–70 cm. 

Tästä pitää päätellä että röykkiöitä on yksi, sen halkaisia on 11 metriä ja korkeus 0,3 - 0,7 metriä.

Yhdessä kohteessa voi olla myös monta röykkiötä, kuten [Nakkilan Keskimäellä](https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=531010025):

> Röykkiöt sijaitsevat Kokemäenjoesta 1,9 km ja Nakkila-Harjavalta tiestä 1,2 km koilliseen metsän reunassa, jokseenkin tasaisella maalla.
> Pohjoiseen johtavan tien länsipuolella metsänlaidassa on röykkiön pohja, joka on pienten kiviliuskojen peitossa. Muodoltaan se on soikeahko ja kooltaan 10 x 6 m. Edellisestä 30 m lounaaseen, melkein tasaisella maalla on matala röykkiö. Se on muodoltaan kumpumainen ja soikeahko ja kooltaan 6 x 9 m. Korkeus on 0,5 m.
> 
> Edellisestä neljä metri kaakkoon on epäsäännöllinen, pitkänomainen röykkiö, joka on kooltaan 5 x 6 m. Edellisestä kymmenkunta metriä lounaaseen on röykkiönpohja, josta erottuu osittain säilynyt reunakehä. Keskellä on maakivi. Röykkiön halkaisija on 8 m. Viides röykkiö on edellisestä röykkiöstä parikymmentä metriä länsilounaaseen. Se on häviteyn suuren röykkiön pohja. Sen reunat ovat korkeampana jääneet jäljelle. Röykkiön halkaisija 17 x 16 m.
> 
> Kuudes röykkiö on pohjoiseen menevän tien itäpuolella, metsätieuran varressa. Röykkiön koko on 4x5 m. Seitsemäs röykkiö sijaitsee edellisestä 15 m itään metsätien eteläpuolella. Se on matala, kooltaan 5x6 m. Kahdeksas röykkiö sijoittuu 50 m päähän edellisistä metsäojan itäpuolelle. Röykkiö on metrin korkuinen symmetrinen kumpu, jonka koko on 8x10 m. Yhdeksäs röykkiö sijaitsee edellisestä 10 m etelään. Sen koko on 6x4 m. Pohjoispää on kuopalla.

Tästä pitää päätellä, että röykkiöitä on yhdeksän kappaletta.
- Ensimmäisestä on tiedossa vain pituus ja leveys: 10 x 6 metriä.
- Toinen on 6 x 9 metriä ja sen korkeus on 0,5 metriä.
- Kolmas on 5 x 6 metriä. Korkeutta ei kerrota.
- Neljäs on 8 metriä halkaisijaltaa. Korkeutta ei kerrota.
- Viides on 17 x 16 metriä. Korkeutta ei kerrota.
- Kuudes om 4 x 5 metriä. Korkeutta ei kerrota.
- Setsemäs on 5 x 6 metriä. Korkeutta ei kerrota.
- Kahdeksas on 8 x 10 metriä. Korkeutta ei kerrota.
- Yhdeksäs on 6 x 4 metriä. Korkeutta ei kerrota.

Tyyppi ja alatyypp, joita ollaan kiinnostuneita:
Tyyppi `hautapaikat` ja sen alla alatyyppi `hautaröykkiöt`.

### Aineiston haku

Aineisto ei ole avointa dataa, joten näitä tekstejä ei saa ladattua yhtenä tiedostona. Ne pitää käydä hakemassa koneellisesti yksi kerrallaan lataamalla kohteen Html-sivu ja etsimällä sieltä osio "Kuvaus", jonka leipäteksti tallennetaan skriptiä ajavan koneen levylle. Muita sivun sisältöosioita ei jäsennetä. Hakua ei saa tehdä isolla rinnakkaisuudella tai liian nopeasti, jottei kyppi.fi kuormitu. Esimerkki kyppi.fi esimerkkisivusta on tiedostossa [kyppi-esimerkkisivu/Kulttuuriympäristön palveluikkuna.htm](./kyppi-esimerkkisivu/Kulttuuriympäristön%20palveluikkuna.htm).

Listan Suomen röykkiöistä saa kahdella eri tavalla:

#### Avoimen datan SHP-tiedosto

Lataamalla avoimen datan paikkatietoaineisto Museoviraston sivystlta. Aineisto Esri SHP-muodossa. Datassa on mukana kaikki Suomen kiinteät muinaisjäännökset, joten siitä pitää poimia mukaan ne, joiden tyyppi on hautapaikka ja alatyyppi hautaröykkiö. Tästä tuloksesta voi poimia kohteiden yksilölliset muinaisjäännös-id:t, joiden avulla pystyy luomaan linkit kyppi.fi sivutolle.

Museoviraston avoimen datan pääsivu on [https://www.museovirasto.fi/fi/palvelut-ja-ohjeet/tietojarjestelmat/kulttuuriympariston-tietojarjestelmat/kulttuuriympaeristoen-paikkatietoaineistot](https://www.museovirasto.fi/fi/palvelut-ja-ohjeet/tietojarjestelmat/kulttuuriympariston-tietojarjestelmat/kulttuuriympaeristoen-paikkatietoaineistot).

SHP-aineiston käsittelyä ei toteutettu näissä skripteissä, koska WFS API täyttää tarpeen.

#### WFS API

Museoviraston avoin WFS API tarjoaa mahdollisuuden etsiä kohteita hakutermeillä ja saada vastaus JSON-muodossa. Tästä tuloksesta voi poimia kohteiden yksilölliset muinaisjäännös-id:t, joiden avulla pystyy luomaan linkit kyppi.fi sivutolle.

WFS APIn osoite on `https://geoserver.museovirasto.fi/geoserver/ows`. Se ei tarvitse mitään autentikaatiota. Oikea aineiston karttataso on `rajapinta_suojellut:muinaisjaannos_piste`. Hakuehdot annetaan CQL-filtterillä. Käytettävät kentät ovat `tyyppi` ja `alatyyppi`. Tulosrivien määrää määritellään `count` parametrilla.

Datan laatu on muodoltaan aika heikko. Lähdejärjestelmässä kohteella voi varmaankin olla max. 4 kpl tyyppiä, alatyyppiä ja ajoitusta. Tämän vuoksi vastaus on esim. `kivirakenteet,  ,  ,  `, josta pitää siis karsia turhat pilkut lopusta pois ja trimmata turhat välilyönnit. Tämän rakenteen vuoksi CQL-filtteri pitää olla `ILIKE`.

Tuloksessa yksilöllinen muinaisjäännös-id on kentässä `mjtunnus`. Linkki kyppi.fi sivustolle on valmiina `url` kentässä (esim. `https://www.kyppi.fi/to.aspx?id=112.99010021`). Yhden Featuren JSONin voi tallentaa sellaisenan levylle, jolloin jatkosteppejä on myöhemmin helpompi ymmärtää.

Esimerkkikutsu:
GET `https://geoserver.museovirasto.fi/geoserver/ows?service=WFS&acceptversions=2.0.0&request=GetFeature&typeNames=rajapinta_suojellut:muinaisjaannos_piste&count=50&outputFormat=application/json&cql_filter=tyyppi ILIKE '%hautapaikat%'`

Esimerkkivastaus:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "muinaisjaannos_piste.1517",
      "geometry": {
        "type": "Point",
        "coordinates": [248950.4789, 6872956.6425]
      },
      "geometry_name": "Shape",
      "properties": {
        "OBJECTID": 1517,
        "mjtunnus": 99010021,
        "inspireID": "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/99010021_P1517",
        "kohdenimi": "Kissasaari                                                                                          ",
        "kunta": "Kankaanpää                                                                                          ",
        "Laji": "kiinteä muinaisjäännös                                                                              ",
        "tyyppi": "kivirakenteet,  ,  ,  ",
        "alatyyppi": "röykkiöt,  ,  ,  ",
        "ajoitus": "ajoittamaton,  ,  ,  ",
        "vedenalainen": "e",
        "KOHDE_APVM": "1996-11-07T17:00:00Z",
        "KOHDE_MPVM": "2006-01-04T09:59:35.097Z",
        "luontipvm": "1996-11-07T00:00:00Z",
        "muutospvm": "2011-01-28T00:00:00Z",
        "paikannustapa": null,
        "paikannustarkkuus": null,
        "selite": " ",
        "url": "https://www.kyppi.fi/to.aspx?id=112.99010021",
        "x": 248950.478,
        "y": 6872956.642
      }
    },
    {
      "type": "Feature",
      "id": "muinaisjaannos_piste.2721",
      "geometry": {
        "type": "Point",
        "coordinates": [550952.1797, 6894910.8652]
      },
      "geometry_name": "Shape",
      "properties": {
        "OBJECTID": 2721,
        "mjtunnus": 171010003,
        "inspireID": "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/171010003_P2721",
        "kohdenimi": "Kissanniemi                                                                                         ",
        "kunta": "Joroinen                                                                                            ",
        "Laji": "kiinteä muinaisjäännös                                                                              ",
        "tyyppi": "hautapaikat,  ,  ,  ",
        "alatyyppi": "lapinrauniot,  ,  ,  ",
        "ajoitus": "varhaismetallikautinen,  ,  ,  ",
        "vedenalainen": "E",
        "KOHDE_APVM": "2002-04-10T17:18:00Z",
        "KOHDE_MPVM": "2021-12-10T13:44:30.577Z",
        "luontipvm": "2002-04-10T00:00:00Z",
        "muutospvm": "2011-01-28T00:00:00Z",
        "paikannustapa": null,
        "paikannustarkkuus": null,
        "selite": " ",
        "url": "https://www.kyppi.fi/to.aspx?id=112.171010003",
        "x": 550952.179,
        "y": 6894910.865
      }
    }
  ],
  "totalFeatures": 29,
  "numberMatched": 29,
  "numberReturned": 29,
  "timeStamp": "2026-08-02T13:41:44.450Z",
  "crs": {
    "type": "name",
    "properties": { "name": "urn:ogc:def:crs:EPSG::3067" }
  }
}

```

### Aineiston analysointi

Haetut kuvaustekstit pitää prosessoida OpenAI-kielimallin avulla, joka osaa poimia vapaamuotoisesta suomenkielisestä tekstistä röykkiöiden koot rakenteelliseen muotoon JSON-tiedostoon. OpenAI API:a pitää kutsua skriptissä siten, että sille annetaan kerrallaan yksi tai useampi kohteen kuvausteksti. Tämä toteutetaan dataputken vaiheessa 4.
