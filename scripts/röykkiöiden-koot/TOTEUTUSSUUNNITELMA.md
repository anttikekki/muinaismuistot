# Röykkiöiden kokotietokannan toteutussuunnitelma

Tämä dokumentti kuvaa `scripts/röykkiöiden-koot`-hakemiston dataputken
toteutuksen. Putki hakee Museoviraston aineistosta hautaröykkiökohteet,
lataa kohteiden Kyppi-sivut, poimii kuvauksista röykkiöiden mitat
kielimallin avulla ja muodostaa OpenLayersissa käytettävän tietokannan.

## Tavoiteltu hakemistorakenne

```text
scripts/röykkiöiden-koot/
├── README.md
├── TOTEUTUSSUUNNITELMA.md
├── package.json
├── config.mjs
├── 1_fetch-site-index.mjs
├── 2_download-pages.mjs
├── 3_extract-page-content.mjs
├── 4_extract-mound-dimensions.mjs
├── 5_validate-results.mjs
├── 6_build-database.mjs
├── 7_copy-results-to-ui.sh
├── kyppi-esimerkkisivu/
│   └── Kulttuuriympäristön palveluikkuna.htm
├── lib/
│   ├── files.mjs
│   ├── kyppi.mjs
│   ├── llm.mjs
│   └── schemas.mjs
├── test/
│   ├── fixtures/
│   └── *.test.mjs
├── source-data/
├── intermediate/
└── results/
```

Hakemistolle tehdään oma `package.json` samaan tapaan kuin
`scripts/viabundus`-dataputkella. Skriptit toteutetaan Node.js:n ES-moduuleina
ja komentoriviskriptit siten, että ne voidaan ajaa sekä yksittäin että koko
putkena. Projektin Node.js-version alarajana käytetään juuriprojektin mukaista
versiota 22.

Hakemistot `source-data`, `intermediate` ja `results` lisätään `.gitignore`-
tiedostoon. Lopullinen käyttöliittymälle tarkoitettu tietokantatiedosto
voidaan sen sijaan versionhallita `src`-hakemiston alla.

## 1. Kohdeluettelon hakeminen

Tiedosto `1_fetch-site-index.mjs` hakee Museoviraston avoimesta WFS-palvelusta
kaikki kohteet, joiden `tyyppi` sisältää arvon `hautapaikat` ja `alatyyppi`
arvon `hautaröykkiöt`. SHP-aineiston käsittelyä ei toteuteta, koska WFS täyttää
tämän dataputken tarpeen.

Kyselyn kiinteät tekniset arvot ovat:

- endpoint: `https://geoserver.museovirasto.fi/geoserver/ows`
- WFS-versio: `2.0.0`
- operaatio: `GetFeature`
- karttataso: `rajapinta_suojellut:muinaisjaannos_piste`
- vastausmuoto: `application/json`
- CQL-suodatus: `tyyppi ILIKE '%hautapaikat%' AND alatyyppi ILIKE
  '%hautaröykkiöt%'`
- koordinaattijärjestelmä: palvelun palauttama EPSG:3067

Kysely muodostetaan `URL`- ja `URLSearchParams`-rajapinnoilla, jotta CQL-
suodatin enkoodataan oikein. Koska lähteen moniarvokentät ovat pilkuilla
eroteltuja ja sisältävät tyhjiä paikkoja, vertailussa käytetään nimenomaan
`ILIKE`-ehtoa. Pelkkää tasa-arvovertailua ei käytetä.

Tulokset haetaan sivuina parametreilla `count` ja `startIndex`, kunnes
`numberMatched` kohdetta on saatu tai viimeinen sivu on tyhjä. Skripti
tarkistaa jokaisella sivulla WFS-vastauksen tyypin, `numberReturned`-arvon ja
sen, ettei sama `mjtunnus` esiinny kahdesti. Sivukoko on konfiguroitava, mutta
sillä on maltillinen oletusarvo.

WFS-vastaukset säilytetään kahdella tasolla:

- palvelun sivukohtaiset vastaukset sellaisinaan hakemistossa
  `source-data/wfs/pages`
- yksi alkuperäinen GeoJSON Feature kutakin kohdetta kohti tiedostossa
  `source-data/wfs/features/<mjtunnus>.geojson`

Yksittäisten Feature-tiedostojen ansiosta myöhempien vaiheiden syöte on helppo
tarkastaa eikä WFS:ää tarvitse kutsua uudelleen jäsennys- tai analyysikoodin
muuttuessa.

Normalisoitu välitulos kirjoitetaan tiedostoon
`intermediate/1_sites.geojson`. Siinä säilytetään alkuperäinen geometria ja
ainakin seuraavat WFS-kentät:

- Featuren `id` ja `OBJECTID`
- yksilöllinen muinaisjäännöstunnus `mjtunnus`
- `kohdenimi` ja `kunta`
- `Laji`, `tyyppi`, `alatyyppi` ja `ajoitus`
- `url`, joka osoittaa suoraan kohteen Kyppi-sivulle
- lähteen päivämääräkentät ja paikannustiedot

Merkkijonokentistä poistetaan reuna-avaruudet. Moniarvokentät `tyyppi`,
`alatyyppi` ja `ajoitus` muunnetaan lisäksi taulukoiksi pilkkomalla pilkuista,
trimmaamalla arvot ja poistamalla tyhjät arvot. Alkuperäinen Feature säilyy
silti muuttamattomana `source-data`-hakemistossa.

`mjtunnus` muunnetaan sisäisessä ja julkaistavassa rakenteessa merkkijonoksi,
jotta tunnusta ei käsitellä laskettavana lukuna. Kyppi-linkkiä ei rakenneta
`mjtunnus`-kentästä, vaan käytetään WFS:n valmista `url`-kenttää. Skripti
tarkistaa tunnusten yksilöllisyyden, URL:n kelvollisuuden ja geometrian
olemassaolon. Haun ajankohta, käytetty kysely ja WFS-vastauksen metadata
tallennetaan ajon manifestiin.

## 2. Kyppi-sivujen lataaminen

Tiedosto `2_download-pages.mjs` lukee kohdeluettelon ja lataa jokaisen kohteen
HTML-sivun WFS:n `url`-kentän osoitteesta tiedostoon
`source-data/pages/<mjtunnus>.html`. `https://www.kyppi.fi/to.aspx?id=112.…`-
osoitteen mahdollisia HTTP-uudelleenohjauksia seurataan normaalisti.

Lataaja toteutetaan seuraavilla ominaisuuksilla:

- maltillinen rinnakkaisuus ja asetettava pyyntöjen välinen viive
- sovelluksen tunnistava HTTP `User-Agent`
- aikakatkaisu sekä rajatut uudelleenyritykset tilapäisille virheille
- jo onnistuneesti ladattujen sivujen ohittaminen
- `--force`-valinta yksittäisen tai kaikkien sivujen uudelleenlataukseen
- mahdollisuus rajata ajo tunnukseen tai pieneen testiotokseen
- keskeytyneen ajon jatkaminen ilman jo tehdyn työn menettämistä
- onnistuneiden, ohitettujen ja epäonnistuneiden latausten yhteenveto

Jokaisesta pyynnöstä tallennetaan manifestiin `mjtunnus`, WFS:n alkuperäinen
URL, uudelleenohjauksen jälkeinen URL, HTTP-tila, hakuaika, yritysten määrä,
tiedostonimi, vastaustyyppi ja sisällön SHA-256-tiiviste. Onnistuneesta
vastauksesta tarkistetaan, että sisältö on HTML:ää ja näyttää Kyppi-
kohdesivulta. Virheen, kirjautumissivun tai muun odottamattoman sisällön
palauttamaa vastausta ei merkitä onnistuneeksi kohdesivuksi.

Ennen koko aineiston lataamista tarkistetaan Kyppi-palvelun käyttöehdot ja
mahdolliset koneellista hakua koskevat ohjeet. Pyyntötahti asetetaan niin, ettei
ajo kuormita palvelua tarpeettomasti. Raaka-HTML säilytetään vain paikallista
prosessointia varten eikä sitä julkaista sovelluksen mukana.

## 3. HTML-sivujen jäsentäminen

Tiedosto `3_extract-page-content.mjs` lukee paikalliset HTML-tiedostot ja
erottaa niistä vähintään seuraavat tiedot:

- kohteen nimi ja tunnukset
- Kuvaus-osion teksti
- Alakohteet-osion röykkiöt erillisinä rakenteisina tietueina
- sivulla mahdollisesti olevat sijainti- ja luokittelutiedot

HTML käsitellään DOM-jäsentimellä. Osioita ei poimita pelkillä säännöllisillä
lausekkeilla, koska sivun välilyönnit, rivinvaihdot ja sisäkkäiset elementit
voivat vaihdella. Tekstistä normalisoidaan tarpeettomat välilyönnit, mutta
kappalejako ja mittojen kannalta olennaiset välimerkit säilytetään.

Repossa oleva
`kyppi-esimerkkisivu/Kulttuuriympäristön palveluikkuna.htm` toimii jäsentimen
ensimmäisenä todellisena fixture-tiedostona. Sen rakenteen perusteella:

- pääkuvaus poimitaan elementistä `span#kuvaus`
- varsinaisesta kuvauksesta jätetään pois `td.leimat`-metatiedot
- kuvauksen `<br>`-elementit muunnetaan rivinvaihdoiksi ennen tekstin
  normalisointia
- alakohteet löytyvät elementistä `span#alakohdelist`
- jokainen sen sisällä oleva taulukko vastaa yhtä alakohdetta
- `td.bkgr` sisältää alakohteen nimen, kuten `Röykkiö 1`
- `td.norm`-riveiltä jäsennetään tyyppi, ajoitus, ETRS-TM35FIN-koordinaatit ja
  mahdollinen kuvaus

Jäsennin ei oleta, että kaikilla alakohteilla on kuvaus tai vain yksi ajoitus.
Alakohteen koordinaatit tallennetaan erillisinä EPSG:3067-koordinaatteina.
Alakohteiden järjestysnumero poimitaan nimestä silloin, kun se on saatavilla;
muussa tapauksessa säilytetään lähdejärjestys ja merkitään tietue
tarkistettavaksi.

Tuloksena kirjoitetaan `intermediate/3_site-content.jsonl`, jossa yksi rivi
vastaa yhtä kohdetta. Tietue sisältää lähdetiedoston, hakupäivän,
sisältötiivisteen sekä tiedon siitä, löytyivätkö Kuvaus- ja Alakohteet-osiot.
Puuttuvat osiot eivät keskeytä koko ajoa, vaan kohde merkitään
tarkistettavaksi.

Jäsentimen ensimmäinen hyväksymistesti käyttää mukana olevaa Nakkilan
Keskimäen sivua: tuloksessa pitää olla pääkuvaus ja yhdeksän järjestyksessä
olevaa alakohdetta. Tämän lisäksi testataan pienellä määrällä eri tavoin
rakentuneita paikallisia HTML-fixtureja ennen massaprosessointia.

## 4. Röykkiöiden mittojen poimiminen kielimallilla

Tiedosto `4_extract-mound-dimensions.mjs` lähettää yhden kohteen tiedot
kerrallaan kielimallille. Syötteenä annetaan pääkuvaus sekä jäsennetty
Alakohteet-taulukko, jotta malli voi yhdistää tekstissä luetellut röykkiöt
alakohteiden määrään ja järjestykseen. Toteutus eristetään `lib/llm.mjs`-
moduuliin, jotta malli ja API voidaan myöhemmin vaihtaa muuttamatta muuta
dataputkea.

API-avain luetaan ympäristömuuttujasta. Avainta, autentikointitietoja tai
kokonaisia API-vastauksia ei lisätä versionhallintaan. Mallin nimi,
promptiversio ja skeemaversio tallennetaan jokaisen tuloksen yhteyteen.

Mallilta vaaditaan rakenteinen, JSON Schemaa noudattava vastaus. Kohteen
tuloksen ehdotettu rakenne on:

```json
{
  "mjtunnus": "531010025",
  "statedMoundCount": 9,
  "mounds": [
    {
      "ordinal": 1,
      "lengthM": {
        "min": 10,
        "max": 10,
        "approximate": false
      },
      "widthM": {
        "min": 6,
        "max": 6,
        "approximate": false
      },
      "diameterM": null,
      "heightM": null,
      "shape": "soikeahko",
      "status": "röykkiön pohja",
      "confidence": "high",
      "needsReview": false
    }
  ],
  "notes": []
}
```

Mittakentät esitetään vaihteluväleinä, jotta esimerkiksi `30–70 cm` voidaan
säilyttää häviöttömästi. Yksittäisessä arvossa `min` ja `max` ovat samat.
Ilmaisut kuten "noin", "kymmenkunta" tai muuten arvioidut luvut merkitään
kentällä `approximate`. Kaikki mitat normalisoidaan metreiksi.

Promptiin kirjataan ainakin seuraavat tulkintasäännöt:

- mitään tekstissä ilmoittamatonta mittaa ei saa päätellä
- senttimetrit muunnetaan metreiksi
- `10 x 6 m` tulkitaan pituudeksi ja leveydeksi, ei halkaisijaksi
- halkaisija tallennetaan vain, kun teksti ilmaisee mitan halkaisijana
- tekstissä luetellut röykkiöt säilytetään samassa järjestyksessä
- sijaintien väliset etäisyydet eivät ole röykkiöiden mittoja
- korkeus yhdistetään vain röykkiöön, johon lauseyhteys sen liittää
- puuttuva tieto esitetään arvolla `null`
- epäselvä viittaus tai tulkinta merkitään käsin tarkistettavaksi
- Alakohteet-osiota käytetään määrän tarkistamiseen, ei puuttuvien mittojen
  keksimiseen
- Alakohteiden koordinaatteja ja kuvauksia saa käyttää oikean röykkiön
  tunnistamiseen, mutta niiden etäisyyslukuja ei saa tulkita kooksi

Kohdekohtaiset vastaukset tallennetaan välimuistiin hakemistoon
`intermediate/llm-responses`. Välimuistin avain muodostetaan kohdetunnuksesta,
tekstin tiivisteestä, mallista, promptiversiosta ja skeemaversiosta. Näin vain
muuttuneet tai epäonnistuneet kohteet tarvitsee käsitellä uudelleen.

Komentorivivalinnoilla voidaan käsitellä yksittäinen kohde, pieni otos,
ainoastaan aiemmin epäonnistuneet kohteet tai koko aineisto. Skripti raportoi
API-kutsujen määrän ja palvelun palauttamat tokenmäärät, jotta ajon kustannus
voidaan arvioida.

## 5. Deterministinen validointi ja käsintarkistus

Tiedosto `5_validate-results.mjs` tarkistaa kielimallin tuottamat tiedot ilman
uutta mallikutsua.

Automaattiset tarkistukset kattavat vähintään:

- JSON Schema -kelpoisuuden
- `mjtunnus`-arvon vastaavuuden WFS-tietueeseen sekä yksilölliset
  järjestysnumerot
- negatiiviset, nollan suuruiset ja selvästi epärealistiset mitat
- `min <= max` -ehdon
- löydettyjen röykkiöiden määrän suhteessa ilmoitettuun määrään
- Alakohteet-osion määrän suhteessa kuvauksesta löydettyyn määrään
- Alakohteiden nimistä poimittujen järjestysnumeroiden aukot ja duplikaatit
- kuvauksessa olevat mittailmaisut, joille ei löydy vastaavaa poimintaa
- poimitut mitat, joille ei löydy tukea alkuperäisestä tekstistä
- kohteet, joista kuvaus, alakohteet tai kaikki mitat puuttuvat
- matalan luottamuksen ja epäselvän viittauksen tapaukset

Tarkistus ei automaattisesti hylkää kohdetta vain siksi, ettei kaikkien
röykkiöiden kaikkia mittoja tunneta. Se erottaa toisistaan kelvollisen
puuttuvan tiedon ja ristiriitaisen tuloksen.

Tuloksena kirjoitetaan:

- `intermediate/5_validated.jsonl`, joka sisältää kaikki tulokset ja
  validointitilan
- `intermediate/5_review.json`, joka sisältää käsin tarkistettavat kohteet ja
  tarkistuksen syyt
- yhteenvetoraportti löydettyjen, hyväksyttyjen ja epäselvien kohteiden sekä
  röykkiöiden määristä

Käsin tehdyt korjaukset tallennetaan erilliseen versionhallittuun
override-tiedostoon, ei generoituja tuloksia suoraan muokkaamalla. Override
yksilöidään kohteen ja röykkiön järjestysnumeron avulla ja siihen kirjataan
korjauksen syy. Näin koko tulos voidaan rakentaa uudelleen toistettavasti.

## 6. Julkaistavan tietokannan rakentaminen

Tiedosto `6_build-database.mjs` yhdistää alkuperäisen WFS-geometrian,
kohdetiedot, hyväksytyt kielimallin tulokset ja käsin tehdyt korjaukset.

Ensisijainen julkaisuformaatti on GeoJSON `FeatureCollection`, koska se voidaan
ladata suoraan OpenLayersiin. Yksi feature vastaa yhtä Museoviraston kohdetta,
ja kohteen röykkiöt ovat `properties.mounds`-taulukossa. Jos myöhemmät
käyttötapaukset tarvitsevat röykkiöt erillisinä riveinä, samasta validoidusta
lähteestä voidaan tuottaa myös tavallinen JSON-tiedosto.

Julkaistavaan tietueeseen sisällytetään:

- `mjtunnus`, WFS Featuren tunnus, nimi ja kunta
- alkuperäinen EPSG:3067-geometria
- WFS:n `url`-kentästä saatu Kyppi-lähdelinkki
- normalisoidut tyyppi-, alatyyppi- ja ajoitustaulukot
- rakenteiset röykkiö- ja mittatiedot
- tieto puuttuvista mitoista
- tarkistustila
- tietokannan skeemaversio
- lähdeaineiston ja analyysin ajankohdat

Julkaistavaan aineistoon ei kopioida kokonaisia Kyppi-kuvauksia tai raakaa
HTML:ää. Tarvittava jäljitettävyys säilytetään lähdelinkillä, tunnuksilla,
tiivisteillä ja paikallisilla välituloksilla.

Rakennusvaihe tarkistaa vielä, ettei tietokannassa ole tunnusduplikaatteja,
virheellisiä geometrioita tai julkaisuun hyväksymättömiä tuloksia. Lopputulos
kirjoitetaan esimerkiksi tiedostoon `results/6_mounds.geojson`.

## 7. Tuloksen vienti käyttöliittymään

Tiedosto `7_copy-results-to-ui.sh` kopioi hyväksytyn GeoJSON-tiedoston
käyttöliittymän lähdekoodiin, esimerkiksi polkuun:

```text
src/röykkiöiden-koot/röykkiöt.geojson
```

Skripti käyttää Bashin asetusta `set -euo pipefail`, tarkistaa lähdetiedoston
olemassaolon ja varmistaa kohdehakemiston. Kopiointi suoritetaan vasta, kun
validointi ja tietokannan rakennus ovat onnistuneet.

OpenLayers-tason, karttasymbolien, hakutoimintojen ja kohteen tietopaneelin
toteutus tehdään tämän dataputken jälkeen erillisenä käyttöliittymätyönä.

## Testaussuunnitelma

Yksikkö- ja integraatiotestit toteutetaan Node.js 22:n omalla `node:test`-
kirjastolla. Tavalliset testit eivät kutsu maksullista kielimalli-API:a, vaan
käyttävät tallennettuja fixture-vastauksia. Oikean API:n integraatiotesti on
erikseen käynnistettävä.

Testiaineistoon sisällytetään vähintään README:n Euran Heikkilän esimerkki ja
repossa oleva Nakkilan Keskimäen HTML-sivu sekä seuraavat tapaukset:

- yksi halkaisijaltaan ilmoitettu röykkiö
- pituus ja leveys muodossa `10 x 6 m` ja `4x5 m`
- korkeus vaihteluvälinä senttimetreissä
- useita peräkkäisiä röykkiöitä ja pronominiviittauksia
- sijaintien välisiä metrimittoja, joita ei saa tulkita kooksi
- eri järjestyksessä ilmoitettu leveys, pituus ja korkeus
- epätarkat ilmaukset kuten "noin" ja "kymmenkunta"
- eriävä röykkiömäärä kuvauksen ja Alakohteet-osion välillä
- kuvaus, jossa käyttökelpoisia mittoja ei ole
- HTML-sivu, josta Kuvaus- tai Alakohteet-osio puuttuu
- virhesivu tai muuttunut HTML-rakenne
- WFS Feature, jonka merkkijonoissa on loppuun täytettyjä välilyöntejä
- WFS:n pilkuilla täytetyt `tyyppi`-, `alatyyppi`- ja `ajoitus`-kentät
- usealle sivulle jakautuva WFS-vastaus

Testit jaetaan seuraaviin tasoihin:

1. WFS-sivutuksen ja Feature-normalisoinnin testit paikallisilla JSON-
   fixtureilla.
2. HTML-jäsentimen yksikkötestit mukana olevalla esimerkkisivulla ja muilla
   paikallisilla fixtureilla.
3. Skeemojen, yksikkömuunnosten ja validointisääntöjen yksikkötestit.
4. Kielimallivastauksen käsittely tallennetuilla JSON-fixtureilla.
5. Pienen kohdejoukon päästä päähän -testi ilman verkkokutsuja.
6. Erikseen käynnistettävä verkkotesti WFS- ja Kyppi-palveluille.
7. Erikseen käynnistettävä testi oikealle kielimalli-API:lle.

## Komentorivikäyttö ja ajettavuus

`package.json` sisältää komennot yksittäisille vaiheille ja koko putkelle.
Tavoiteltu käyttö on esimerkiksi:

```bash
npm run step:1
npm run step:2 -- --limit 10
npm run step:3
npm run step:4 -- --site 531010025
npm run step:5
npm run step:6
npm run step:7
npm test
```

Koko putken komento saa suorittaa vain ne verkkovaiheet, jotka käyttäjä
nimenomaisesti valitsee tai joiden paikallista välimuistia ei ole saatavilla.
Jokainen vaihe lukee edellisen vaiheen tiedoston ja kirjoittaa uuden tiedoston
sen sijaan, että samaa tiedostoa muokattaisiin paikallaan.

Konfiguroitavia arvoja ovat ainakin:

- WFS-osoite, karttataso, CQL-suodatin ja kyselyn sivukoko
- latausten rinnakkaisuus, viive ja aikakatkaisu
- kielimallin tarjoaja ja mallin nimi
- API-kutsujen rinnakkaisuus
- käytettävät tiedostopolut

Salaisuudet annetaan ympäristömuuttujina. Ei-salaisille asetuksille annetaan
turvalliset oletusarvot `config.mjs`-tiedostossa.

## Dokumentointi ja ylläpidettävyys

README-tiedostoa täydennetään toteutuksen yhteydessä seuraavilla tiedoilla:

- riippuvuuksien asennus
- vaaditut ympäristömuuttujat
- koko putken ja yksittäisten vaiheiden ajaminen
- välitulosten ja julkaistavan skeeman kuvaukset
- virhetilanteiden jatkaminen
- käsintarkistusten ja override-tiedoston käyttö
- aineiston lähde- ja käyttöoikeustiedot
- kielimallin käytöstä aiheutuvien kustannusten arviointi

Skeemalle, promptille ja lopulliselle tietokannalle annetaan erilliset
versionumerot. Mallin vaihtaminen tai promptin muuttaminen ei saa hiljaisesti
sekoittaa eri versioilla tuotettuja tuloksia samaan aineistoon.

## Toteutusjärjestys

Työ kannattaa jakaa kolmeen toimitettavaan kokonaisuuteen.

### Kokonaisuus 1: aineiston hankinta

1. Luodaan hakemiston `package.json`, konfiguraatio ja yhteiset tiedostoapurit.
2. Toteutetaan WFS 2.0.0 -haku, CQL-suodatus, sivutus ja alkuperäisten Feature-
   tiedostojen tallennus.
3. Toteutetaan WFS-kenttien normalisointi sekä paikalliset JSON-testit.
4. Toteutetaan WFS:n `url`-kenttää käyttävä, jatkettava HTML-lataaja.
5. Toteutetaan `#kuvaus`- ja `#alakohdelist`-elementtien jäsennin mukana olevan
   Kyppi-esimerkkisivun avulla.
6. Lisätään poikkeavien ja puuttuvien HTML-osioiden fixture-testit.

Kokonaisuus on valmis, kun pieni ja koko aineisto voidaan hakea paikallisiksi,
yksilöidyiksi ja uudelleen käytettäviksi välituloksiksi.

### Kokonaisuus 2: analyysi ja laadunvarmistus

1. Viimeistellään mittatietojen JSON Schema ja prompti.
2. Toteutetaan kielimalli-adapteri ja kohdekohtainen välimuisti.
3. Testataan poiminta README:n esimerkeillä ja laajemmalla otoksella.
4. Toteutetaan deterministiset validoinnit ja tarkistusraportti.
5. Toteutetaan versionhallittu käsinkorjausten mekanismi.

Kokonaisuus on valmis, kun tuloksista pystytään erottamaan automaattisesti
hyväksyttävät ja käsin tarkistettavat kohteet ja yksittäinen kohde voidaan ajaa
uudelleen hallitusti.

### Kokonaisuus 3: julkaisu

1. Yhdistetään hyväksytyt tulokset sijainteihin ja kohdetietoihin.
2. Tuotetaan ja validoidaan lopullinen GeoJSON-tiedosto.
3. Toteutetaan käyttöliittymään kopioiva skripti.
4. Dokumentoidaan koko ajo ja aineiston päivittäminen.
5. Ajetaan laadunvarmistus koko aineistolle ja tarkistetaan otos käsin.

Kokonaisuus on valmis, kun yksi dokumentoitu komentosarja tuottaa paikallisista
lähdetiedoista versionoidun, OpenLayersiin ladattavan tietokannan.

## Keskeiset suunnitteluperiaatteet

- Raaka HTML, jäsennetty teksti, kielimallin vastaus, validoitu tulos ja
  julkaistava aineisto pidetään eri vaiheina.
- Jokainen vaihe on uudelleen ajettava ja jatkaa turvallisesti keskeytyksen
  jälkeen.
- Kielimalli poimii tiedon, mutta deterministinen koodi validoi rakenteen ja
  ilmeiset ristiriidat.
- Epävarmuutta tai puuttuvaa tietoa ei korvata arvauksella.
- Käsin tehdyt korjaukset säilytetään erillisinä, jäljitettävinä syötteinä.
- Julkaistava aineisto sisältää rakenteiset faktat ja lähdelinkit, ei Kyppi-
  sivujen kokonaisia tekstejä.
- Mallin, promptin, skeeman ja lähdeaineiston versiot kirjataan tuloksiin, jotta
  tietokannan alkuperä voidaan myöhemmin todentaa.
