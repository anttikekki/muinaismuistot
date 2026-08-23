# Museoviraston karttadatapalvelun toteutussuunnitelma

## 1. Tavoite ja rajaus

Toteutetaan muinaismuistot.info-sivustolle oma, Cloudflaren kautta tarjottava karttadatapalvelu. Palvelu korvaa käyttöliittymän nykyiset hitaat WMS `GetMap`-, WMS `GetFeatureInfo`- ja WFS `GetFeature` -kutsut.

Ensimmäisen tuotantoversion pitää:

- näyttää README:ssä luetellut 26 WMS:ää vastaavaa loogista tasovalintaa myös koko Suomen näkymässä, vaikka uusi aineisto säilytetään 12 fyysisenä MVT-lähdetasona;
- palauttaa kartalla klikattujen kohteiden tunniste- ja ominaisuustiedot;
- tukea vähintään kohteen nimellä tehtävää kirjainkoosta riippumatonta hakua; haun vasteaika saa olla kartan selaamista hitaampi, koska toimintoa käytetään harvoin;
- päivittää Museoviraston kerran vuorokaudessa julkaisema aineisto automaattisesti;
- pitää mobiililaitteelle siirtyvä datamäärä ja selaimen työmäärä hallittuina;
- jatkaa viimeksi onnistuneen aineistoversion tarjoamista, jos päivitys epäonnistuu.

Ensimmäiseen versioon ei kuulu yleiskäyttöisen WMS- tai WFS-palvelimen rakentaminen. Rajapinta optimoidaan muinaismuistot.info-sivuston todellisiin käyttötapauksiin.

## 2. Ehdotettu ratkaisu

### 2.1 Kokonaisarkkitehtuuri

Esitysmuoto on vektoritiilet. Päivittäisen ZIP-paketin GeoPackage-tiedostot muunnetaan etukäteen zoom-tasoittain yleistetyiksi Mapbox Vector Tile -tiiliksi ja pakataan yhdeksi PMTiles-arkistoksi. Selain lataa vain kulloisenkin karttanäkymän tarvitsemat tiilet.

Ratkaisun osat ovat:

1. **Päivitysajo** lataa `tutkija.zip`-aineiston, validoi sen ja rakentaa julkaistavat artefaktit.
2. **Cloudflare R2** säilyttää versioidut PMTiles-arkistot ja päivityksen metatiedot.
3. **Cloudflare Worker** tarjoaa vakaan URL:n nykyiseen karttaversioon, hoitaa välimuisti- ja CORS-otsakkeet sekä toteuttaa haku- ja terveystarkistusrajapinnat.
4. **Cloudflare D1** sisältää GeoPackage-tiedostoista päivittäin muodostettavan suppean hakutaulun.
5. **OpenLayers-sovellus** käyttää yhtä PMTiles-vektoritiililähdettä, piirtää kohteet nykyistä vastaavilla tyyleillä ja tunnistaa klikatut kohteet selaimessa renderöidyistä vektoriominaisuuksista.

PMTiles vähentää hallittavien objektien määrää verrattuna miljooniin erillisiin tiilitiedostoihin. Ratkaisun toimivuus OpenLayersin, R2:n HTTP Range -pyyntöjen ja Worker-välimuistin kanssa varmistetaan teknisessä kokeessa ennen tuotantototeutusta.

GeoPackage-tuotteen 12 fyysistä kohdetasoa tallennetaan saman PMTiles-arkiston MVT-tiiliin 12 nimettynä `source-layer`-tasona. WMS:n 26 loogista tasoa ei kopioida sellaisenaan PMTilesiin. Erityisesti arkeologisten kohteiden 16 piste-/aluetasoa esitetään kahdella MVT-lähdetasolla (`arkeologiset_kohteet_piste_t` ja `arkeologiset_kohteet_alue_t`), joiden kohteita suodatetaan normalisoidun `laji`-attribuutin perusteella. `alakohde_piste` säilyy omana lähdetasonaan.

Käyttäjä voi edelleen valita kaikki nykyiset loogiset tasot dynaamisesti, mutta valinta tehdään OpenLayersin tyylisuodatuksella eikä vaihtamalla tiililähdettä. Piilotetulle lähdetason ja attribuuttisuodattimen yhdistelmälle ei palauteta tyyliä, eikä sen kohteita huomioida karttaklikkauksen tuloksissa. Sama näkymä ja zoom-taso ladataan näin vain kerran Museoviraston aineistoa varten riippumatta valittujen tasojen määrästä.

Yhden arkiston haittana hyväksytään, että ladattu tiili voi sisältää myös piilotettujen tasojen ominaisuuksia. Rakennusvaiheen tiilikokobudjetti, geometriayleistys ja pienten zoom-tasojen aggregointi ovat siksi pakollisia. Pyyntömäärää ja siirrettyä datamäärää mitataan koko OpenLayers-kokonaisuudesta, johon kuuluvat myös erillinen taustakartta ja muiden lähteiden karttatasot.

Sanahaku toteutetaan tarkoituksella yksinkertaisesti ilman Museoviraston WFS-riippuvuutta. Päivitysajo poimii GeoPackage-tiedostoista D1-tauluun vain kohteen sisäisen ja lähteen tunnisteen, alkuperäisen ja normalisoidun nimen, fyysisen lähdetason, loogisen tason/lajin sekä kohteen keskipisteen tai rajauslaatikon. Saman loogisen kohteen piste- ja alue-esitykset yhdistetään hakemistossa rekisterin pysyvällä tunnisteella, jotta haku ei palauta tarpeettomia kaksoiskappaleita. Worker tekee parametrisoidun osajonohaun normalisoidusta nimestä, esimerkiksi `LIKE '%hakusana%'`, rajaa tulosmäärän ja välimuistittaa vastauksen. Satojentuhansien lähderivien lineaarinen haku saa olla hieman hidas, koska toimintoa käytetään harvoin. FTS-, trigrammi- tai erillinen hakupalvelu lisätään vasta, jos mitattu käytettävyys sitä edellyttää.

### 2.2 Zoom-tasot ja mobiilisuorituskyky

Kaikkia geometrioita ei lähetetä täydellä tarkkuudella pienillä zoom-tasoilla.

- Koko Suomen tasolla alueet ja viivat yleistetään voimakkaasti ja pistemäiset kohteet klusteroidaan tai aggregoidaan tiilikohtaisiksi lukumääriksi.
- Keskitason zoomeilla klusterointia vähennetään ja geometriat tarkentuvat.
- Lähizoomeilla näytetään yksittäiset kohteet ja tunnistamiseen tarvittavat ominaisuudet.
- Tiiliin sisällytetään vain renderöintiin ja klikkaukseen tarvittavat attribuutit. Laajemmat tiedot haetaan tarvittaessa kohdetunnuksella.
- Tiilikoolle asetetaan enimmäistavoite. Sen ylittävät tiilet tunnistetaan rakennusvaiheessa ja korjataan yleistys-, klusterointi- tai attribuuttisäännöillä.

Tarkat zoom-rajat päätetään prototyypin mittausten perusteella. Lähtökohtana käytetään Suomen kattavaa Web Mercator -tiilitystä (`EPSG:3857`), jota OpenLayers tukee suoraan.

### 2.3 Ulkoiset rajapinnat

Ensimmäinen versio tarjoaa vähintään seuraavat osoitteet:

- `GET /tiles/current.pmtiles` – nykyisen kartta-aineiston versio tai Worker-ohjattu pääsy siihen;
- `GET /api/search?q=...&limit=...` – D1-hakutaulua käyttävä nimihaku, joka palauttaa tunnisteen, nimen, kohdetyypin, karttatason ja kohteen sijaintiin sopivan karttarajauksen;
- `GET /api/features/:id` – kohteen käyttöliittymässä tarvittavat täydentävät ominaisuustiedot, jos niitä ei sisällytetä tiileen;
- `GET /api/meta` – aineiston lähde-, muodostus- ja julkaisuaika sekä version tunniste;
- `GET /health` – palvelun ja aktiivisen aineistoversion kevyt terveystarkistus.

Rajapintojen vastaukset versioidaan ja niiden skeemat dokumentoidaan. Hakuparametrien pituus, sallitut merkit ja tulosmäärä rajataan. Julkisiin endpointteihin lisätään tarpeen mukaan Cloudflare rate limiting.

## 3. Päivittäinen aineistoputki

Päivitys toteutetaan ensin CI-ajona, esimerkiksi GitHub Actionsissa, koska ZIP-paketin purku ja GeoPackage-tiedostojen raskaat geometriamuunnokset eivät sovi hyvin lyhytkestoiseen Worker-ajoon. Cloudflare vastaa tuotantoaineiston säilytyksestä ja tarjoamisesta.

ZIP-paketin odotettu rakenne validoidaan README:ssä dokumentoitua tiedostolistaa vasten. Syötteenä käytetään kaikkia 12 `.gpkg`-tiedostoa ja niiden yhtä kohdetasoa. Mukana olevat `.qml`-tiedostot eivät sisällä varsinaista kohdeaineistoa, mutta niitä käytetään referenssinä OpenLayers-tyylien määrittelyssä. Rakennusputkeen tehdään eksplisiittinen mäppäys 12 GeoPackage-kohdetasosta 12 MVT-`source-layer`-tasoon sekä erillinen käyttöliittymämäppäys 26 loogiseen tasovalintaan. Arkeologisten kohteiden looginen jako perustuu `laji`-kenttään eikä erillisiin MVT-lähdetasoihin.

Kenttien nimet normalisoidaan kirjainkoon suhteen (esimerkiksi `Laji`/`laji`, `Nimi`/`nimi` ja `URL`/`url`), mutta alkuperäinen lähdearvo säilytetään tarvittaessa jäljitettävyyttä varten. Arvojoukkojen normalisointi käsittelee ainakin `K`/`k`- ja `E`/`e`-muodot sekä dokumentoidun `Maastonimittaus`/aineistossa olevan `Maastomittaus`-eron. PDF-tietotuoteseloste on vuodelta 2017 ja toimii semanttisena referenssinä, ei nykyisen aineiston hylkäysperusteena. Nykyiset ja uudet arvojoukkoarvot raportoidaan rakennuksessa.

Moniarvoisia `tyyppi`-, `alatyyppi`-, `ajoitus`- ja `suojeluryhmä`-kenttiä ei pilkota tavallisella pilkkujaolla, koska pilkku esiintyy myös käsitteiden sisällä ja aineisto käyttää tyhjiä arvopaikkoja. Raakamuoto säilytetään jäljitettävyyttä varten. Nykyisen arkeologisten pisteiden tyyppi- ja ajoitussuodatuksen vuoksi rakennusputki muodostaa lisäksi normalisoidut avainjoukot lähdemallin rakenteen ja versionhallittujen arvosanojen avulla. Tuntematon tai monitulkintainen yhdistelmä raportoidaan, eikä sitä hiljaisesti pilkota väärin. API palauttaa moniarvot JSON-taulukkoina; MVT:ssä suodatukseen käytetään PoC:ssa valittavaa kompaktia esitystä.

Päivitysajon vaiheet:

1. Käynnistä ajo Museoviraston ilmoitetun päivitysajan jälkeen, esimerkiksi päivittäin klo 02.00 UTC.
2. Tee lähteelle `HEAD`- tai ehdollinen `GET`-pyyntö ja vertaa `ETag`-, `Last-Modified`- tai sisältötiivistetietoa viimeiseen onnistuneeseen ajoon.
3. Lataa ZIP väliaikaiseen työtilaan ja laske sille SHA-256-tiiviste.
4. Tarkista ZIP:n eheys, pura paketti ja varmista, että README:ssä luetellut `.gpkg`-tiedostot ovat mukana. Tunnista puuttuvat, ylimääräiset ja uudelleennimetyt tiedostot ennen muunnosta.
5. Listaa jokaisen GeoPackage-tiedoston sisäiset tasot ja varmista niiden geometriatyypit, koordinaattijärjestelmä, pakolliset kentät ja tietuemäärät.
6. Normalisoi lähdetasojen ja kenttien nimet sisäiseen skeemaan. Johda arkeologisille riveille normalisoitu `laji_key`, jota käytetään loogiseen tasovalintaan, mutta älä jaa rivejä erillisiin fyysisiin MVT-lähdetasoihin.
7. Muunna geometriat `EPSG:3857`-koordinaatistoon, korjaa mahdollisuuksien mukaan virheelliset geometriat ja raportoi hylätyt tietueet.
8. Rakenna yksi zoom-tasoittain yleistetty PMTiles-arkisto, jossa 12 GeoPackage-kohdetasoa säilyvät 12 erillisenä nimettynä MVT-lähdetasona, sekä mahdollinen ominaisuustietoaineisto ja D1:een vietävä deduplikoitu hakuaineisto.
9. Suorita automaattiset laatu- ja suorituskykytarkistukset.
10. Siirrä artefaktit R2:een uuden, muuttumattoman versionimen alle, esimerkiksi `datasets/<sha256>/map.pmtiles`.
11. Tuo hakurivit D1:een uuden aineistoversion tunnisteella ja tarkista rivimäärä sekä koehakujen tulokset.
12. Vaihda kartan ja hakutaulun aktiivisen version osoittimet samassa julkaisuvaiheessa vasta, kun kaikki artefaktit ja smoke-testit ovat onnistuneet.
13. Säilytä vähintään edellinen onnistunut versio nopeaa palautusta varten ja poista vanhemmat R2-artefaktit ja D1-rivit määritellyn säilytysajan mukaan.

Jos lähde ei ole muuttunut, ajo päättyy ilman uudelleenrakennusta. Epäonnistunut ajo ei muuta aktiivista versiota, mutta lähettää hälytyksen.

## 4. Toteutusvaiheet

### Vaihe 0: Lähtötilanteen mittaus ja skeeman kartoitus

- [x] Lataa yksi tuotantoaineisto ja listaa jokaisen GeoPackage-tiedoston sisäiset tasot, kentät, geometriatyypit, koordinaattijärjestelmät ja tietuemäärät.
- [x] Dokumentoi lähdeaineiston arvojoukot, PDF-tietomalli ja niiden väliset ristiriidat.
- [x] Dokumentoi 12 fyysisen GeoPackage-tason suhde WMS:n ja käyttöliittymän 26 loogiseen tasoon sekä arkeologisten tasojen `laji`-arvot.
- [x] Selvitä loogiset pysyvät kohdetunnukset, geometriarivien tunnisteet ja tasojen väliset suhteet. Dokumentoi erikseen D1-haun deduplikointiavain ja MVT-feature-ID:n muodostussääntö.
- [x] Tee 12 MVT-lähdetason ja 26 käyttöliittymän loogisen tasovalinnan versionhallittu, koneellisesti luettava mäppäyskonfiguraatio.
- [x] Vertaa mukana toimitettuja QML-tyylejä nykyisiin WMS-/OpenLayers-tyyleihin ja kirjaa, mitä niistä hyödynnetään.
- [x] Kirjaa nykyisen OpenLayers-toteutuksen, haku-, tyyppi-/ajoitussuodattimien ja `GetFeatureInfo`-vastauksen käyttämä kenttäsopimus. Tarkista erityisesti moniarvoisten `tyyppi`-, `alatyyppi`- ja `ajoitus`-kenttien nykyinen pilkkominen inventoitua aineistoa vasten.
- [x] Mittaa nykyisen Museovirasto-WMS:n yhden 256 × 256 karttakuvan vasteaika ja koko vähintään koko Suomen, kaupunkitason ja lähitason rajauksilla. Dokumentoi taustakartan ja muiden samanaikaisten karttatasojen karkea pyyntömäärä; siirrä tarkka selaimen end-to-end-vertailu vaiheeseen 1, jossa PMTiles-toteutus toimii vertailukohteena.

**Tuotos:** versionhallittu lähdeskeeman kuvaus, arvojoukkoanalyysi, fyysisten ja loogisten tasojen mäppäys sekä suorituskyvyn lähtötaso.

Lähdeaineiston lataus, GeoPackage-inventaario, arvojoukkoanalyysi, PDF-tietomallin vertailu ja tunnisteanalyysi on toteutettu toistettavilla Bash-skripteillä. Koko analyysi ajetaan komennolla `infra/museovirasto-map-data-server/scripts/run-phase-0-source-inventory.sh`. Ladattu ja purettu aineisto sekä PDF tallennetaan gitistä ohitettuun `infra/museovirasto-map-data-server/data/`-hakemistoon, ja generoitu tulos on tiedostossa [SOURCE_DATA_INVENTORY.md](SOURCE_DATA_INVENTORY.md). Inventoitu versio sisältää 12 fyysistä kohdetasoa ja 268 965 lähderiviä. Inventaarion havaitsemat skeema-, tunniste- ja arvojoukkopoikkeamat toimivat rakennusputken ensimmäisenä regressiotasona.

Tasomäppäys on tiedostossa [layer-mapping.json](layer-mapping.json). Konfiguraatio validoidaan lähdeaineistoa vasten komennolla `infra/museovirasto-map-data-server/scripts/05-validate-layer-mapping.sh`, joka on osa vaiheen 0 yhteisajoa.

Tyylivertailu ja MVT/OpenLayers-tyylisopimus ovat tiedostossa [STYLE_COMPARISON.md](STYLE_COMPARISON.md). Nykyinen kartta todettiin WMS:n palvelimella renderöimäksi rasteriksi: sivustolla ei ole ennestään Museoviraston varsinaisen aineiston OpenLayers-vektorityyliä. UI:n SVG-kuvakkeet ja 3D-mallien `ModelsLayer` ovat erillisiä visuaalisia jäljitelmiä. Migraation vertailutasoksi valittiin nykyinen WMS/UI-ilme, ja QML:stä hyödynnetään `Laji`-kategorisointi sekä geometriatyyppien ja mittasuhteiden referenssi. WMS-tyylien koneellinen tarkistus tehdään komennolla `infra/museovirasto-map-data-server/scripts/06-inventory-styles.sh`, joka on osa vaiheen 0 yhteisajoa.

Nykyisen käyttöliittymän, karttaklikkauksen, haun ja suodatuksen kenttäsopimus sekä uuden rajapinnan normalisointisäännöt ovat tiedostossa [FIELD_CONTRACT.md](FIELD_CONTRACT.md). Tuotantoaineistoon vertaaminen osoitti, ettei nykyistä `split(", ")` -logiikkaa voi käyttää rakennusputken parserina: nelipaikkaisissa moniarvokentissä on tyhjiä paikkoja ja pilkkuja myös käsitteiden sisällä. Uusi API palauttaa normalisoidut arvot JSON-taulukkoina ja säilyttää raakamuodot jäljitettävyyttä varten. Pakolliset lähdekentät validoidaan komennolla `infra/museovirasto-map-data-server/scripts/07-validate-field-contract.sh`, joka on osa vaiheen 0 yhteisajoa.

Nykyisen WMS-ratkaisun kevyt suorituskyvyn lähtötaso on tiedostossa [CURRENT_MAP_PERFORMANCE.md](CURRENT_MAP_PERFORMANCE.md). Kaikki 26 loogista tasoa sisältävän yhden 256 × 256 WMS-kuvan mediaanivaste oli koko Suomen rajauksella 33,70 sekuntia, Helsingin rajauksella 1,47 sekuntia ja lähirajauksella 0,78 sekuntia. Mittaus toistetaan tarvittaessa komennolla `infra/museovirasto-map-data-server/scripts/08-measure-current-wms.sh`; sitä ei ajeta vaiheen 0 yhteisajossa, koska se mittaa ajankohdasta riippuvaa ulkoista palvelua. Tarkka koko selainnäkymän vertailu tehdään vaiheessa 1 PMTiles-PoC:ta vasten.

**Vaihe 0 on valmis.** Vaihe 1 on aloitettu koko tuotantoaineiston PMTiles-muunnoksella. Ensimmäisen ajon tulokset ja avoimet kysymykset on kirjattu tiedostoon [PMTILES_POC.md](PMTILES_POC.md).

### Vaihe 1: Tekninen proof of concept

- [x] Muunna koko aineisto GDAL- ja Tippecanoe-työkaluilla yhdeksi paikalliseksi, rakenteellisesti validoiduksi PMTiles-arkistoksi. Nykyinen PoC sisältää 12 MVT-lähdetasoa ja kaikki 268 964 geometriallista lähderiviä; vain yksi lähteen geometriaton tietue jää pois.
- [x] Tarkista paikallisella, muinaismuistot.info-sovelluksesta irrallisella OpenLayers-sivulla geometriayleistys, pistetiheys, alustavat tyylit sekä ominaisuuksien tunnistaminen kolmella edustavalla zoom-tasolla. Koko Suomen tarkka ja aggregoitu esitys, suodatettu 1 467 kohteen näkymä, zoomiraja 9→10 sekä päällekkäisten kohteiden ominaisuushaku on hyväksytty manuaalisesti. Uudelleen rakennettu arkisto läpäisee rakenteellisen validoinnin: 12 lähdetasoa, kaikki pistetietueet zoomilla 0 ja kaikkien aluelähdetasojen keskipisteet zoomilla 0.
- [x] Tallenna arkisto Wranglerin paikallisesti simuloimaan R2-bucketiin. Toteuta ja testaa Worker, joka validoi selaimen yhden byte range -pyynnön, lukee vain sovitun välin R2-bindingista ja palauttaa standardinmukaisen `206 Partial Content` -vastauksen. PoC ei oleta 206-vastausten välimuistittuvan; oikea staging-R2 siirretään Cloudflare-vaiheeseen.
- [x] Toteuta 26 loogisen tasovalinnan näyttäminen ja piilottaminen yhden OpenLayers `PMTilesVectorSource` -olion `source-layer`- ja `laji_key`-tyylisuodattimilla. Valinnat eivät luo uusia PMTiles-lähteitä tai muuta tiili-URL:ia.
- [x] Mittaa paikallisen irrallisen PoC:n kylmä lataus koko Suomen, suodatetun koko Suomen, kaupunki- ja lähitason näkymissä. Toistettava Chrome-ajuri mittaa PMTiles-pyynnöt ja -tavut, datan valmistumisajan, featuremäärät, esitystavan ja JS-heapin. Koko tuotantosivun mobiilimittaus taustakarttoineen ja muiden lähteiden tasoineen siirtyy vaiheeseen 4, koska niitä ei tarkoituksella ole irrallisessa PoC:ssa.
- Tuo D1:een suppea hakutaulu ja toteuta Workeriin yksinkertainen osajonohaku. Varmista ääkkösten, kirjainkoon, osittaisten hakujen, välimuistin ja tulosrajan toiminta.
- Vahvista yhden PMTiles-arkiston suorituskykybudjetit ja kirjaa D1:n lineaarisen haun mitattu vasteaika vertailutiedoksi.

**Tuotos:** selaimessa toimiva kokeilu ja mitattu arkkitehtuuripäätös.

PMTiles-arkiston toteutunut leveä PoC-skeema ja kenttäkohtainen minimointipäätös on dokumentoitu tiedostossa [PMTILES_DATA_MODEL.md](PMTILES_DATA_MODEL.md). Kompakti rinnakkaisarkisto on toteutettu: arkeologisilla pisteillä ovat `laji_key`, 19 tyypin ja 12 ajoituksen bittimaskit sekä 211 alatyypin lyhyt koodijoukko, arkeologisilla alueilla `laji_key` ja muilla tasoilla vain MVT-feature-ID. Arkisto pieneni 138 301 298 tavusta 54 762 752 tavuun ilman geometrian tai kohteiden karsimista. Selain-PoC käyttää jo kompakteja kenttiä, ja 1 467 pronssikautisen hautaröykkiön vertailuosumat säilyivät täsmälleen samoina.

Pronssikautisten hautaröykkiöiden suodatettu koko Suomen näkymä toimi manuaalisessa kokeessa erittäin nopeasti. Tämän vuoksi yksittäiset pisteet säilytetään arkistossa ja suodatetut, selainbudjettiin mahtuvat tulokset piirretään tarkasti myös matalilla zoomeilla. Mahdollinen dynaaminen aggregointi rajataan myöhemmin vain liian suuriin aktiivisiin tulosjoukkoihin; kiinteää matalan zoomin aggregointia ei käytetä ainoana esityksenä.

Myös kaikkien 41 549 kiinteän muinaisjäännöksen pisteen koko Suomen näkymä hyväksyttiin testikoneella riittävän nopeaksi: zoomilla 5 noin 17,4 renderöintikierrosta/s, p95-ruutuväli 141 ms, p95-syöteviive 46 ms ja loppunäkymän valmistuminen 3 ms. Taso voidaan siis tarvittaessa näyttää tarkkana, vaikka tuotannon automaattinen aggregointi voi aktivoitua säädettävän kohderajan perusteella. Tulos ei vielä aseta yleistä budjettia kaikille 112 441 arkeologiselle pääkohdepisteelle, kaikille noin 179 000 pisteelle tai mobiililaitteelle.

**PoC:n arkkitehtuuripäätös:** jatka yhdellä PMTiles-arkistolla, jossa kaikki yksittäiset pisteet säilyvät jokaisella zoom-tasolla. Selain soveltaa dynaamiset suodattimet ennen esitystavan valintaa. Alustava aggregoinnin aktivointialue on 20 000–40 000 aktiivista näkyvää kohdetta; tarkka raja, laitekohtainen käyttäytyminen ja aggregointitapa hiotaan toistuvilla mittauksilla. Tuotannossa käytetään hystereesiä, jotta esitys ei vaihdu jatkuvasti rajan ympärillä. Kiinteää rakennusvaiheen matalan zoomin aggregointia ei tehdä ainoaksi esitykseksi.

Kompaktin arkiston koko Suomen aloitusnäkymä käytti edelleen vain kuusi PMTiles Range -pyyntöä, mutta siirretty määrä pieneni 4 535 650 tavusta 835 056 tavuun eli 81,6 prosenttia. Kaikkien tasojen suodattamaton 227 013 näkyvän featuren näkymä jäi selaimen renderöintipullonkaulaksi: aloitusnäkymän valmistuminen 618 ms, 4,9 renderöintikierrosta/s ja p95-ruutuväli 529 ms. Tämä vahvistaa, että seuraava optimointi kohdistetaan aktiivisen tulosjoukon dynaamiseen esitystapaan, ei HTTP-pyyntöjen määrään tai PMTiles-kenttiin.

Harhaanjohtava ensimmäisen renderöinnin mittari on korvattu näkymän tiililatauksia, esitystavan laskentaa ja seuraavaa renderöintiä odottavalla `Aloitusnäkymän data valmis` -mittarilla. PoC:ssa on myös pistetasojen selainpuolinen 64 pikselin ruudukkoaggregointi. Näkymän featuret deduplikoidaan `source-layer + MVT feature ID` -avaimella, suodattimet sovelletaan ennen määrän laskemista ja säädettävä 20 000/40 000 kohteen hystereesi valitsee tarkan tai aggregoidun esityksen. Yhteen ruutuun muodostetaan vain yksi kokonaismäärän symboli; ruudukkoa ei lasketa uudelleen kesken karttaliikkeen. Polygonit ja viivat säilyvät tässä kokeessa tarkkoina.

Korjattu aggregointi hyväksyttiin koko Suomen manuaalisessa testissä. 162 131 ladatusta featuresta 133 070 oli aktiivisia pisteitä, joista muodostui 48 aggregaattimerkkiä. Zoomilla 5,22 loppunäkymä valmistui 1 ms:ssa, renderöintikierroksia syntyi 64,8/s, p95-ruutuväli oli 56 ms ja p95-syöteviive 4 ms. Kartta koettiin selvästi nopeaksi ja aggregaattiesitys visuaalisesti selkeäksi. Tulos poistaa täyden suodattamattoman aineiston selainrenderöinnin keskeisen PoC-riskin tällä testikoneella.

Kaikki viisi aluetasoja sisältävää lähdetasoa käyttävät nyt zoomikohtaista geometriaesitystä samassa `source-layer`-tasossa: keskipiste zoomeilla 0–9 ja varsinainen polygoni zoomeilla 10–14. Keskipisteet osallistuvat dynaamiseen aggregointiin, mutta tasomäppäys ja HTTP-pyyntöjen määrä eivät muutu. Validointi vahvistaa kaikkien aluekohteiden keskipisteet zoomilla 0. Arkisto pieneni samalla 54 762 752 tavusta 54 075 777 tavuun.

Zoomirajan 9 → 10 manuaalinen tarkistus on tehty: aluetasot vaihtuvat keskipisteistä polygoneiksi ilman näkyvää aukkoa tai päällekkäistä esitystä.

Ominaisuustietojen massahaun PoC on toteutettu yksinkertaisella kaksiosaisella tunnistemallilla. Karttaklikkaus käyttää saman aineistojulkaisun sisäistä `sourceLayer + fid` -avainta ja lähettää enintään 100 deduplikoitua osumaa `POST /api/features/batch` -pyynnöllä. Pysyvät URL-linkit käyttävät vakaata `logicalLayerId + registryId` -avainta ja `POST /api/features/by-register` palauttaa kaikki uusimmasta aineistosta löytyvät geometriarivit. `fid`:ltä ei edellytetä vakautta julkaisujen välillä, eikä lähderivejä deduplikoida.

Uudelleen rakennettu paikallinen D1 sisältää 268 964 ominaisuusriviä kaikilta 12 lähdetasolta: vain yksi geometriaton arkeologinen aluerivi jää pois. Rekisteritunnusindeksi tukee tarkoituksellista yksi-moneen-suhdetta. `fid`-tunnisteilla rakennettu PMTiles-arkisto on 66 963 838 tavua; koko Suomen Range-siirto mitataan vielä uudelleen tällä arkistolla.

Paikallinen kylmän Chromen mittaus on dokumentoitu tiedostossa [POC_BROWSER_PERFORMANCE.md](POC_BROWSER_PERFORMANCE.md). Koko Suomen suodattamaton näkymä valmistui 383 ms:ssa kuudella Range-pyynnöllä ja 1 766 264 siirretyllä PMTiles-tavulla; 158 671 aktiivista pistettä esitettiin 19 aggregaattina. Kaupunkitaso valmistui 125 ms:ssa ja lähitaso 87 ms:ssa. Suodatettu pronssikautisten hautaröykkiöiden näkymä piirsi näkyvän selainrajauksen 331 osumaa yksittäisinä kohteina; koko aineiston tunnettu tulosjoukko on edelleen 1 467.

**Seuraava tehtävä:** toteuta samaan D1-aineistoon yksinkertainen nimihaku ja mittaa lineaarisen osajonohaun vasteaika.

### Vaihe 2: Toistettava rakennusputki

- Tee lukituilla työkaluversionumeroilla ajettava rakennusskripti tai kontti.
- Toteuta taso- ja kenttämäppäys konfiguraationa, ei hajautettuina oletuksina koodissa.
- Lisää aineiston validointi, geometriakorjaukset, tiivisteet, manifesti ja koneellisesti luettava rakennusraportti. Validoi 12 odotettua GeoPackage-kohdetasoa, pysyvät tunnistekentät, geometriatyypit ja kriittiset luokittelukentät.
- Vertaa kenttiä, tietuemääriä ja arvojoukkoja versionhallittuun inventaariotasoon. Puuttuva kriittinen kenttä tai taso estää julkaisun; uusi arvojoukkoarvo aiheuttaa raportin ja hälytyksen, mutta ei automaattisesti hylkää aineistoa.
- Käytä MVT-feature-ID:nä GeoPackagen `fid`-arvoa ja validoi sen kelvollisuus. Käytä sitä vain saman aineistojulkaisun kartta- ja D1-aineiston yhdistämiseen.
- Lisää tiilien zoom-/yleistyssäännöt sekä tiilikoon tarkistus.
- Muodosta ominaisuus- ja hakutaulun tuontiaineisto kaikista lähderiveistä. Indeksoi `logicalLayerId + registryId` pysyviä linkkejä varten ja palauta kaikki saman rekisterikohteen geometriat yhdistämättä tai poistamatta niitä. Pidä skeema tarkoituksella suppeana.
- Lisää yksikkö- ja integraatiotestit muunnoksille.

**Tuotos:** paikallisesti ja CI:ssä samalla tavalla valmistuvat versionoidut artefaktit.

### Vaihe 3: Cloudflare-palvelu

- Perusta erilliset kehitys- ja tuotantoympäristöt, R2-bucketit, D1-tietokannat ja Worker-määritykset infrastruktuurikoodina.
- Toteuta tiilien/PMTiles-arkiston tarjoaminen, Range-tuki, CORS, pakkaus ja välimuistiotsakkeet.
- Toteuta D1:tä käyttävä haku sekä ominaisuus-, metadata- ja health-endpointit ja niiden syötteiden validointi. Käytä parametrisoituja kyselyitä; käyttäjän SQL-lauseketta ei välitetä tietokantaan.
- Käytä versioiduille artefakteille pitkää muuttumatonta välimuistia (`immutable`); pidä `current`-metadata lyhyesti välimuistissa.
- Lisää lokitus, virhemittarit, kustannusseuranta ja hälytys puuttuvasta tai vanhentuneesta aineistosta.
- Varmista, ettei R2:n kirjoitusavaimia tai muita ylläpitosalaisuuksia toimiteta selaimelle.

**Tuotos:** staging-ympäristössä toimiva, valvottu palvelu.

### Vaihe 4: OpenLayers-integraatio

- Lisää uusi vektoritiililähde feature flagin taakse nykyisen WMS-ratkaisun rinnalle.
- Siirrä kaikkien loogisten tasojen näkyvyys- ja tyylisäännöt yhden OpenLayers-vektoritiililähteen tyylifunktioon. Tasovalinta muuttaa näkyvien `source-layer`- ja `laji_key`-yhdistelmien joukkoa eikä luo uutta lähdettä.
- Rajaa karttaklikkauksen osumat käyttäjän valitsemiin näkyviin tasoihin.
- Kerää kaikki klikkaustoleranssin päällekkäiset kohteet ja hae niiden ominaisuustiedot yhdellä massapyynnöllä; älä tee featurekohtaista N+1-kyselysarjaa.
- Toteuta klusterien esitys, zoomaus klusteria valittaessa ja yksittäisten ominaisuuksien klikkaustunnistus.
- Korvaa WFS-nimihaku uudella hakuendpointilla ja sovita tulos nykyiseen käyttöliittymään.
- Huolehdi peruutettavista pyynnöistä, lataus- ja virhetiloista sekä saavutettavasta näppäimistökäytöstä.
- Lisää analytiikkamittarit latausajalle, virheille ja siirretylle datamäärälle ilman henkilötietojen keräämistä.

**Tuotos:** end-to-end-toiminnallisuus stagingissa ja hallittu mahdollisuus palata WMS-lähteeseen.

### Vaihe 5: Tuotantoonvienti

- Aja aineiston ja käyttöliittymän regressiotestit sekä mobiilisuorituskykytestit.
- Julkaise ensin pienelle osuudelle liikenteestä tai sisäiseen beta-käyttöön.
- Vertaa virheprosenttia, vasteaikoja, datamäärää ja kustannuksia lähtötasoon.
- Kasvata liikenneosuutta vaiheittain ja pidä WMS-palautuspolku käytettävissä vähintään yhden onnistuneen päivityssyklin ajan.
- Dokumentoi operointi, manuaalinen uudelleenajo, version palautus ja avainten kierrätys.

**Tuotos:** tuotantopalvelu ja testattu palautusmenettely.

## 5. Testaus ja hyväksymiskriteerit

Lopulliset numeroarvot vahvistetaan proof of conceptin jälkeen. Alustavat hyväksymiskriteerit ovat:

- Kaikki 12 fyysistä GeoPackage-kohdetasoa esiintyvät rakennusraportissa ja PMTiles-metadatassa. Kaikki 26 loogista käyttöliittymätasoa on määritetty lähdetason ja tarvittaessa `laji_key`-suodattimen yhdistelmään sekä joko näkyviin tai tarkoituksellisesti aggregoituihin kohteisiin määritellyillä zoom-tasoilla.
- Rakennusraportin arkeologisten pisteiden ja alueiden rivimäärät täsmäävät lähdeaineistoon sekä kokonaisuutena että `laji_key`-arvoittain. Muunnos ei kopioi samaa geometriaa eri MVT-lähdetasoihin WMS-jaon jäljittelemiseksi.
- Tuntematon uusi `laji`-arvo säilyy PMTiles-aineistossa tunnistettavalla varatyylillä ja aiheuttaa hälytyksen; se ei katoa kartalta hiljaisesti.
- Automaattinen päivitys julkaisee uuden muuttuneen aineiston 6 tunnin kuluessa Museoviraston päivitysajasta.
- Epäonnistunut tai puutteellinen aineisto ei korvaa aktiivista versiota.
- Kartan ensimmäinen käyttökelpoinen näkymä latautuu tavallisella 4G-yhteydellä mediaaniltaan alle 2 sekunnissa tuetulla keskitason mobiililaitteella; p95-tavoite on alle 4 sekuntia.
- Yhden 256 pikselin vektoritiilen pakattu koko on normaalisti alle 100 kt eikä ylitä 300 kt ilman erikseen hyväksyttyä poikkeusta.
- Kaikkien 26 loogisen tason näyttäminen tai niiden näkyvyyden vaihtaminen käyttää yhtä Museovirasto-vektoritiililähdettä; yksittäistä tiiltä ei pyydetä uudelleen eri lähdetasojen tai `laji`-suodattimien vuoksi.
- Koko karttanäkymän HTTP-pyyntömäärälle asetetaan proof of conceptissa budjetti, jossa huomioidaan PMTiles-arkiston lisäksi taustakartta ja muiden lähteiden karttatasot.
- Välimuistissa oleva haku vastaa p95 alle 500 millisekunnissa. Välimuistista puuttuvan D1-haun tavoite määritetään prototyypin mittauksen perusteella, ja haulla on aina sovittu tulosraja.
- Karttaklikkaus löytää kaikki näkyvät, klikkaustoleranssin sisällä olevat päällekkäiset kohteet ja näyttää oikean kohdetunnuksen.
- Hakutulosten ja klikattujen kohteiden otos vastaa lähteen GeoPackage-tiedostoja geometrian, nimen, tyypin ja tunnisteen osalta.
- Palvelu kestää kuormitustestin ilman alkuperäiseen WMS-palveluun tehtäviä käyttäjäkohtaisia kutsuja.
- Kuukausikustannuksesta laaditaan mitattuun pyyntö- ja tallennusmäärään perustuva arvio ennen tuotantoonvientiä ja sille asetetaan Cloudflare-hälytysraja.

Testikokonaisuuteen kuuluvat rakennusputken yksikkötestit, tunnettuun pieneen usean GeoPackage-tiedoston ZIP-fixtureen perustuvat integraatiotestit, rajapintasopimustestit, kartan visuaaliset regressiotestit, Playwright-end-to-end-testit sekä mobiiliprofiililla ajettavat suorituskykytestit.

## 6. Tietoturva, käyttöehdot ja operointi

- Vahvista ennen julkaisua Museoviraston aineiston lisenssi, vaadittu lähdemerkintä ja mahdolliset edelleenjakelun ehdot. Näytä lähde ja aineistoversion päivä käyttöliittymässä.
- Salli CORS vain tarvittaville tuotanto- ja kehitysorigineille, ellei rajapinnasta tietoisesti tehdä täysin julkista.
- Rajaa hakuparametrit ja käytä parametrisoituja kyselyitä. Älä välitä käyttäjän CQL- tai SQL-lausekkeita tietokantaan.
- Pidä tuotantoavaimet Cloudflaren salaisuuksissa ja CI:n lyhytikäisissä tunnuksissa; käytä vähimmän oikeuden periaatetta.
- Hälytä päivitysajon epäonnistumisesta, yli 36 tuntia vanhasta aktiivisesta aineistosta, poikkeavasta tietuemäärästä ja Worker-virhepiikistä.
- Tallenna joka versiosta lähdetiiviste, työkalujen versiot, tietuemäärät, hylkäykset ja julkaisuajankohta jäljitettävyyttä varten.

## 7. Riskit ja lievennykset

| Riski | Vaikutus | Lievennys |
| --- | --- | --- |
| Lähdetasojen nimet tai skeema muuttuvat | Päivitys voi tuottaa väärän tai puutteellisen aineiston | Tiukka skeemavalidointi, tietuemäärien poikkeamahälytys ja atominen julkaisu |
| Uusi tai muuttunut `laji`-arvo puuttuu käyttöliittymämäppäyksestä | Kohteita voi jäädä piiloon tai väärään loogiseen tasoon | Arvojoukkovertailu, tuntemattoman arvon varatyyli, rivimäärätäsmäytys ja hälytys |
| 12 fyysisen tason ja 26 loogisen valinnan mäppäys ajautuu erilleen | Tasovalinta näyttää vääriä kohteita | Yksi versionhallittu mäppäyskonfiguraatio sekä muunnoksen ja OpenLayersin yhteiset sopimustestit |
| Moniarvokenttä pilkotaan virheellisesti pilkuista | Tyyppi-, alatyyppi-, ajoitus- tai suojelutieto vääristyy | Säilytä raakamuoto, muodosta normalisoidut avainjoukot lähdemallin tuntevalla parserilla ja validoi ne fixture- sekä arvojoukkotesteillä |
| Vanhaa PDF-skeemaa käytetään nykyisen aineiston totuutena | Kelvollinen uusi aineisto voidaan hylätä | Käytä GeoPackage-inventaariota teknisenä lähtötasona ja PDF:ää vain semanttisena referenssinä |
| Koko Suomen tiilet kasvavat liian suuriksi | Hidas mobiilikäyttö ja renderöinti | Zoom-kohtainen klusterointi, geometriayleistys, attribuuttien karsinta ja tiilikokobudjetti |
| PMTilesin Range-pyynnöt eivät välimuistitu odotetusti | Suurempi viive tai R2-kustannus | Mitataan PoC:ssa; varavaihtoehto on esigeneroidut MVT-tiilet R2:ssa |
| D1:n lineaarinen osajonohaku hidastuu aineiston kasvaessa | Harvoin käytetyn haun vasteaika kasvaa | Tulosraja ja hakutulosvälimuisti; tarvittaessa myöhemmin FTS- tai trigrammi-indeksi |
| Kartta ja hakutaulu osoittavat eri aineistoversioon | Hakutuloksessa näkyy puuttuva tai vanha kohde | Versiotunnus jokaisella hakurivillä, yhteinen aktiivisen version osoitin ja atominen julkaisu |
| Kohdetunnus ei ole vakaa tai uniikki tasojen välillä | Klikkaus ja hakutulos eivät yhdisty tietoihin | Muodosta sisäinen avain lähdetasosta ja lähdetunnuksesta; säilytä molemmat |
| Geometriat ovat virheellisiä | Rakennusajo epäonnistuu tai kohteita katoaa | Geometriakorjaus, hylkäysraportti ja hyväksyttävän hävikin nollaraja tai erikseen päätetty raja |
| Päivittäinen ajo ylittää CI:n ajan tai resurssit | Aineisto vanhenee | Välimuistita työkalut, ohita muuttumaton lähde ja mittaa ajo; siirrä tarvittaessa erilliseen ajopalveluun |
| Kartan tyylit poikkeavat nykyisestä | Käyttäjä ei tunnista kohdetyyppejä | Versionhallittu tyylimäppäys ja visuaaliset regressiotestit |

## 8. Ennen toteutusta päätettävät asiat

Seuraavat päätökset tehdään vaiheiden 0–1 tulosten perusteella:

1. Mitkä lähdekentät näytetään karttaklikkauksessa ja hakutuloksessa?
2. Mitkä kohteet klusteroidaan, ja millä zoom-tasolla yksittäiset kohteet tulevat näkyviin?
3. Mikä on tuettujen mobiililaitteiden ja selainten vähimmäistaso?
4. Mikä on hyväksyttävä Cloudflare-kuukausibudjetti ja liikenne-ennuste?
5. Riittääkö CI-pohjainen päivittäinen muunnos, vai edellyttääkö ylläpito kokonaan Cloudflaren sisällä ajettavaa putkea?
6. Kuinka monta vanhaa aineistoversiota säilytetään ja kuinka pitkä palautusaikatavoite asetetaan?

## 9. Suositeltu ensimmäinen työpaketti

Ensimmäisessä työpaketissa toteutetaan vaiheet 0 ja 1 ilman tuotantoliikenteen muutoksia. Työpaketti on valmis, kun todellinen aineistoskeema on dokumentoitu, yksi PMTiles-versio toimii OpenLayersissa R2:n kautta, yksinkertainen D1-nimihaku toimii ja kolmen zoom-tason mobiilimittaukset on kirjattu. Näiden tulosten perusteella lukitaan tuotantoarkkitehtuuri, suorituskykybudjetit ja vaiheiden 2–5 työmäärä.
