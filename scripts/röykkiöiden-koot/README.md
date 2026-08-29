# Tietokanta Suomen röykkiöhautojen koosta

## Tavoite

Tämän kansion skriptit selvittävät Museoviraston [kyppi.fi](https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx) sivuston arkeologisten kohteiden tietojen avulla kiviröykkiöhautöjen koot ja luovat niistä yleiskäyttöisen tietokannan JSON-tiedostona. Tulos on tarkotus näyttää muinaismuistot.info sivustolla OpenLayers-kirjaston avulla Maanmittaulaitoksen kartta-aineistön päällä.

Tavoitteena on mahdollistaa käyttäjille tapa arvioida röykkiön näyttävyyttä ja löytää Suomen isoimmat röykkiöt.

Skriptit ovat bash- tai Node.js-skriptejä, jotka suoritetaan omalla koneella.

## Toteutus ja käyttö

Dataputken vaiheet 1–6 muodostavat nykyisen Kuvaus-osioon perustuvan kokeilun. `1_fetch-site-index.mjs`
hakee hautaröykkiökohteiden luettelon Museoviraston WFS-palvelusta ja
`2_download-pages.mjs` lataa valittujen kohteiden Kyppi-sivut paikallisiksi
HTML-tiedostoiksi. `3_extract-page-content.mjs` jäsentää sivuilta vain Kuvaus-
osion leipätekstin JSONL-muotoon. `4_extract-mound-dimensions.mjs` poimii tästä
kuvauksesta röykkiöiden mitat OpenAI-kielimallilla rakenteiseen muotoon.

PDF-lähteisiin perustuva vaihtoehtoinen kokeilu alkaa vaiheista 7–8. Vaihe 7
poimii kohdesivujen osiosta "Linkit Museoviraston muihin aineistoihin"
aineistotietueet. Vaihe 8 lataa tietuesivut, löytää niiden PDF-liitteet, lataa
kunkin PDF:n vain kerran ja poimii tekstin `pdftotext`-ohjelmalla.

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
  `intermediate/llm-responses/prompt-vN-schema-vN/<malli>/<mjtunnus>.json`.
  Syötteen tiiviste säilytetään JSON-tietueessa, ei tiedostonimessä.
- yhdistetyt mittatiedot tiedostoon
  `intermediate/4_mound-dimensions.jsonl`
- API-kutsujen, välimuistiosumien ja virheiden yhteenvedon
  tiedostoon `intermediate/4_extraction-report.json`

Validoi vaiheen 4 tulokset paikallisesti ilman uusia API-kutsuja:

```bash
npm run step:5
```

Vaihe kirjoittaa validoidut tulokset tiedostoon `intermediate/5_validated.jsonl`,
käsin tarkistettavat kohteet tiedostoon `intermediate/5_review.json` ja
helposti luettavan tarkistusnäkymän tiedostoon `intermediate/5_review.html` sekä
yhteenvedon tiedostoon `intermediate/5_validation-report.json`. HTML-näkymä
esittää kohteen virheet, kuvauksen, mitat, mallin muistiinpanot ja lähdekatkelmat
yhdellä sivulla. JSON-tarkistusraportti
sisältää ongelmien lisäksi alkuperäisen kuvauksen sekä mallin
poimimat röykkiöt, mitat ja lähdekatkelmat rinnakkaista tarkistamista varten.
Komento tulostaa lisäksi terminaaliin jokaisesta tarkistettavasta kohteesta
tunnuksen, nimen ja kunnan, ongelmakoodit sekä Kyppi-linkin.

Käynnistä kuittaukset tallentava paikallinen tarkistusnäkymä komennolla:

```bash
npm run review
```

Avaa sen jälkeen `http://127.0.0.1:4173`. Näkymässä voi suodattaa kohteita
havaintotyypin perusteella, näyttää vain uudet havainnot sekä kuitata ja
palauttaa havaintoja. Kuittaukset tallennetaan tiedostoon
`intermediate/5_review-acknowledgements.json` ja ne säilyvät vaiheen 5
uudelleenajojen välillä. Muuttuneesta LLM-tuloksesta syntyy uusi havainto.

Rakenna validoiduista tuloksista OpenLayersissa käytettävä GeoJSON:

```bash
npm run step:6
```

Vaihe kirjoittaa tietokannan tiedostoon `results/6_mounds.geojson`, lajiteltavan
taulukkonäkymän tiedostoon `results/6_mounds.html` ja rakennusraportin tiedostoon
`results/6_build-report.json`. Taulukkoa voi järjestää minkä tahansa sarakkeen
perusteella ja rajata nimi-, kunta-, tunnus- tai validointitilahakulla. Jokainen
hyväksytyn tai tarkistettavan kohteen röykkiö on oma Feature. Vaihe laskee
saatavilla olevista mitoista myös
ellipsin tai ympyrän pinta-alan sekä korkeuden ollessa tiedossa puolikkaan
ellipsoidin tilavuuden. Feature sisältää validointitilan ja havaintokoodit.
Rakenteeltaan virheellisiä kohteita ei julkaista.

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

### PDF-aineistojen pieni koeajo

Muodosta jo ladatuista Kyppi-kohdesivuista deduplikoitu aineistoindeksi:

```bash
npm run step:7 -- --site 531010025
# tai: npm run step:7 -- --limit 3
```

Tulos `intermediate/7_document-index.json` erottaa kohteet ja aineistotietueet.
Sama kuntainventointi esiintyy vain kerran, vaikka se olisi linkitetty usealle
kohteelle.

Lataa PDF:t ja pura niiden teksti (vaatii Popplerin `pdftotext`-ohjelman):

```bash
npm run step:8 -- --site 531010025
# tai: npm run step:8 -- --limit 3
```

PDF:t tallennetaan hakemistoon `source-data/documents`, tekstit hakemistoon
`intermediate/document-texts` ja kohde–tietue–dokumentti-suhteet tiedostoon
`intermediate/8_document-download-manifest.json`. Kanonisesta liite-URL:stä
johdettu `documentId` estää saman PDF:n toistuvan lataamisen. Ehjä välimuisti
ohitetaan uusinta-ajossa; `--force` pakottaa latauksen. Koko aineisto vaatii
nimenomaisen `--all`-valinnan.

Poimi lopuksi raporteista kohdekohtaiset sivut ja niiden lähikonteksti:

```bash
npm run step:9 -- --site 531010025
# tai: npm run step:9 -- --limit 3
```

Tulos kirjoitetaan tiedostoon `intermediate/9_document-passages.jsonl`.
Katkelmassa säilyvät dokumenttitunnus, lähdeosoite, PDF:n sivunumero,
osumaperuste ja tekstin laatuhavainnot. Raportit, joista kohteen nimeä tai
tunnusta ei löydy, merkitään erikseen `unmatchedDocuments`-taulukkoon; niitä ei
ohiteta hiljaisesti. Yhteenveto kirjoitetaan tiedostoon
`intermediate/9_document-passages-report.json`.

Vaihe 9 kirjoittaa lisäksi kattavuusraportin tiedostoon
`intermediate/9_document-coverage.json`. Jokainen kohde luokitellaan yhteen
toimintaluokkaan: `ready_for_llm`, `no_pdf_documents`, `site_not_found`,
`year_missing` tai `ocr_required`. Raportti sisältää luokkien lukumäärät sekä
kohdetunnuskohtaiset listat perusteluineen. OCR-luokitus huomioi vain uusimman
tutkimusvuoden aineistot, joten vanhan historiallisen raportin heikko laatu ei
estä LLM-ajoa.

Jos kohteesta löytyy usean vuoden tutkimuksia, vaihe 9 merkitsee uusimman
tunnetun tutkimusvuoden kenttään `latestSourceYear`. Vaihe 10 lähettää mallille
vain tämän vuoden `isLatestSource=true`-aineistot. Vanhemmat raportit säilyvät
vaiheen 9 historiatietona, mutta niitä ei käytetä nykyisiä röykkiöitä, niiden
lukumäärää tai mittoja täydentävänä lähteenä. Vaihe 11 merkitsee vanhemman
aineiston käytön virheeksi, jos uudempi vuosiluvultaan tunnettu aineisto on
saatavilla.

Poimi rajatuista raporttikatkelmista röykkiöiden mitat kielimallilla:

```bash
export OPENAI_API_KEY="oma-api-avain"
npm run step:10 -- --site 531010025
```

Kattavuusraportin kaikki `ready_for_llm`-kohteet voi käsitellä turvallisesti
valinnalla:

```bash
npm run step:10 -- --ready
```

`--ready` jättää muut kattavuusluokat pois ennen API-kutsuja. Mallille lähetetään
vain uusimman tutkimusvuoden sivut, jotka vaihe 9 on merkinnyt käyttökelpoisiksi;
muut osuma-, sisällysluettelo- ja kontekstisivut eivät kasvata mallisyötettä.

Vaihe 10 käyttää omaa raporttipromptia, tiukkaa JSON-skeemaa ja erillistä
välimuistia hakemistossa `intermediate/report-llm-responses`. Jokainen
sanatarkka lähdekatkelma sidotaan `sourceReferences`-taulukossa dokumenttiin ja
PDF-sivuun. Tulos validoidaan paikallisesti: viitteen dokumentin ja sivun pitää
olla syötteessä ja katkelman löytyä kyseisen sivun tekstistä. Vertailu sallii
PDF-taitosta ja OCR:stä syntyneiden välilyöntien normalisoinnin myös sanojen
sisällä, mutta ei kirjainten tai numeroiden muuttamista.
Tulokset kirjoitetaan tiedostoon
`intermediate/10_report-mound-dimensions.jsonl` ja ajon yhteenveto tiedostoon
`intermediate/10_report-extraction-report.json`. Komento vaatii aina rajauksen
`--site`, `--limit` tai `--all`; `--force` ohittaa välimuistin.

API:lta saatu ja JSONiksi jäsennetty vastaus tallennetaan aina ensin
`*.candidate.json`-tiedostoon ja validoidaan vasta sen jälkeen. Jos paikallinen
validointi epäonnistuu, seuraava ajo käyttää samaa candidate-vastausta eikä tee
uutta maksullista API-kutsua. Candidate voidaan validoida uudelleen korjatulla
koodilla; vain `--force` ohittaa myös tämän tallennetun vastauksen.

Validoi raporttipohjaiset tulokset ja käynnistä tarkistusnäkymä:

```bash
npm run step:11
npm run review:reports
```

Avaa jälkimmäisen komennon jälkeen `http://127.0.0.1:4173`. Vaihe 11 tarkistaa
rakenteen ja lähdeviitteet, nostaa esiin mallin ilmoittamat ristiriidat sekä
havaitsee lähdekatkelmassa mainitut mutta tuloksesta puuttuvat korkeudet,
halkaisijat ja AxB-mitat. Näkymä näyttää mitat, raportin, PDF-sivun ja
lähdekatkelman rinnakkain. Kohteen PDF-aineistotaulukko näyttää kaikki löydetyt
PDF:t, päätellyt tutkimusvuodet, Kyppi-linkit sekä perustelun dokumentin
valinnalle tai pois jättämiselle. Kuittaukset tallennetaan tiedostoon
`intermediate/11_report-review-acknowledgements.json`.
Näkymä sisältää kaikki käsitellyt kohteet, myös ilman käsintarkistusta
automaattisesti hyväksytyt. Jokaiselle röykkiölle näytetään päättelyketjun
lopputila ja tieto siitä, päätyykö se lopulliseen aineistoon. Tilan mukaan
suodattamalla näkymää voi käyttää sekä työjonona että koko aineiston
auditointiin.
Auditoinnin tueksi kohteella näytetään myös aiemmin Kyppi.fi-kohdesivulta
poimittu kuvausteksti ja linkki kohdesivulle. Teksti merkitään vertailuaineistoksi:
PDF-raportit säilyvät mittojen varsinaisina lähteinä. Sama kuvaus ja lähdetieto
säilytetään step 12:n JSONL- ja GeoJSON-tuloksissa `kyppiDescription`-kentässä.
Tarkistusnäkymän "PDF:istä poimittu kohteen koko tekstikonteksti" näyttää lisäksi
kaikki vaiheessa 9 kohteelle poimitut PDF-sivut kokonaisina. Näkymä erottaa
LLM:lle annetut sivut ympäröivistä, vain manuaalista tarkistusta tukevista sivuista.
PDF-kohdejakso ankkuroidaan aina muinaisjäännöstunnukseen. Pelkkä kohdenimen
esiintyminen esimerkiksi sisällysluettelossa tai toisen samannimisen kohteen
nimessä ei enää tuota osumaa. Tunnistuksessa hyväksytään myös Museoviraston
raporteissa käytetty välilyönnein ryhmitelty ja etunollilla täydennetty tunnusmuoto.
Suoraan avattava `intermediate/11_report-review.html` on vain staattinen
esikatselu: ilman `review:reports`-palvelinta sen kuittauksia ei voida tallentaa.
Ratkaisemattoman ristiriidan sisältävän yksittäisen röykkiön voi merkitä näkymässä
pysyvästi ohitetuksi. Saman kohteen muut röykkiöt säilyvät mukana. Sivun
"Näytettävät tilat" -valinnoilla voi näyttää erikseen tarkistusta odottavat,
kuitatut ja pysyvästi ohitetut tiedot. Yhteenveto näyttää myös näiden lukumäärät.
Päätös tallennetaan kuittausten rinnalle `moundDecisions`-rakenteeseen syyllä
`unresolved_conflict`, jotta myöhempi julkaisuputki voi jättää vain kyseisen
röykkiön pois. Vanha kohdekohtainen `siteDecisions`-tieto muunnetaan
automaattisesti röykkiökohtaiseksi, kun tarkistusnäkymä avataan palvelimelta.

Koosta tarkistetut raporttitulokset lopulliseksi koeaineistoksi:

```bash
npm run step:12
```

Vaihe ottaa mukaan automaattisesti hyväksytyt röykkiöt ja sellaiset
tarkistettavat röykkiöt, joiden kaikki niitä koskevat havainnot on kuitattu.
Kohdetason havainto koskee kohteen jokaista röykkiötä. Keskeneräiset ja
pysyvästi ohitetut röykkiöt jätetään pois. Tulokset kirjoitetaan tiedostoihin
`results/12_report-mounds.jsonl` ja `results/12_report-mounds.geojson`.
Koosteraportti `results/12_report-build-report.json` kertoo mukaan otettujen,
tarkistusta odottavien ja pysyvästi ohitettujen röykkiöiden määrät.

Kokoa vaiheiden 7–12 tunnusluvut yhdelle koeajoraportille:

```bash
npm run report:pilot
```

HTML-raportti kirjoitetaan tiedostoon `results/13_pipeline-report.html` ja sama
yhteenveto koneluettavana tiedostoon `results/13_pipeline-report.json`.
Raportti näyttää aineiston kattavuuden, PDF-lataukset, LLM-kutsut ja
välimuistiosumat, validoinnin sekä julkaistut ja pois jätetyt röykkiöt. Se myös
varoittaa puuttuvista vaiheista ja vaiheiden lukumäärien ristiriidoista.

## Raporttiaineiston batch-ajo

Aja koko raporttiputki yhdellä komennolla:

```bash
npm run batch -- --limit 50
# tai yksittäiset kohteet
npm run batch -- --site 4010001 --site 4010002
# vain PDF-kattavuus ilman LLM-kutsuja
npm run batch -- --limit 50 --no-llm
# koko saatavilla oleva aineisto
npm run batch -- --all
```

Komento ajaa vaiheet 7–13 järjestyksessä ja pysähtyy ensimmäiseen virheeseen.
Aiemmat kohteet yhdistetään uuteen rajaukseen, joten yksittäisen batchin ajo ei
poista niitä jatkovaiheiden aineistosta. PDF:t, candidate-vastaukset ja hyväksytyt
LLM-vastaukset käytetään uudelleen. Ennen maksullista vaihetta komento näyttää
API-kutsujen teoreettisen enimmäismäärän; todellinen määrä voi olla pienempi
välimuistien vuoksi. Keskeytyneen ajon voi jatkaa samalla komennolla.

Haetut kuvaustekstit pitää prosessoida OpenAI-kielimallin avulla, joka osaa poimia vapaamuotoisesta suomenkielisestä tekstistä röykkiöiden koot rakenteelliseen muotoon JSON-tiedostoon. OpenAI API:a pitää kutsua skriptissä siten, että sille annetaan kerrallaan yksi tai useampi kohteen kuvausteksti. Tämä toteutetaan dataputken vaiheessa 4.
