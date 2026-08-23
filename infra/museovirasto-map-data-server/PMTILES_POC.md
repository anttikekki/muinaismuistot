# PMTiles proof of concept

Arkiston nykyinen ja tavoiteltu kenttäkohtainen tietomalli on dokumentoitu tiedostossa [`PMTILES_DATA_MODEL.md`](PMTILES_DATA_MODEL.md).

## Ensimmäinen rakennettu arkisto

Vaiheen 1 ensimmäinen tekninen koe muuntaa koko inventoidun tuotantoaineiston yhdeksi PMTiles-arkistoksi. Arkisto sisältää samat 12 fyysistä lähdetasoa kuin `layer-mapping.json`; käyttöliittymän 26 loogista tasoa muodostetaan myöhemmin näiden lähdetasojen ja `laji_key`-suodattimien avulla.

Ensimmäisen, myöhemmin liian harvaksi todetun ajon tulos:

- lähdegeometrioita: 268 965
- arkistoon hyväksyttäviä geometrioita: 268 964
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
infra/museovirasto-map-data-server/scripts/13-build-compact-pmtiles-poc.sh
```

Kenttäprojektiot ja lähdetasot ovat tiedostossa `poc-layer-config.json`. Rakennusskripti tarkistaa niiden vastaavan `layer-mapping.json`-tiedostoa ja vertaa jokaisen välivaiheen tietuemäärää lähdeaineistoon.

## Ensimmäiset havainnot ja avoimet kysymykset

- Yksi PMTiles-arkisto toimii teknisesti kaikkien 12 fyysisen lähdetason säiliönä. Erillisiä arkistoja ei tarvita tasovalintoja varten.
- Ensimmäinen arkisto käytti Tippecanoen `--drop-densest-as-needed`- ja `--coalesce-densest-as-needed`-asetuksia sekä 300 000 tavun tiilirajaa. Lisäksi Tippecanoen oletuspudotus harventaa pisteitä maksimizoomia alemmilla tasoilla. Koko Suomen näkymässä seurauksena näkyi esimerkiksi vain viisi kiinteän muinaisjäännöksen pistettä, joten arkisto ei kelvannut koko aineiston selainkuorman mittaamiseen.
- Suorituskyky-PoC rakennetaan tämän havainnon vuoksi asetuksilla `--drop-rate=1`, `--no-feature-limit`, `--no-tile-size-limit` ja `--no-tiny-polygon-reduction`. Tavoite ei ole tuotantokartografia vaan tarkoituksellinen pahimman tapauksen koe: kaikki pisteet ja pienet polygonit säilyvät myös matalilla zoom-tasoilla, vaikka tiilet kasvavat erittäin suuriksi.
- Raakamuotoiset tyyppi-, alatyyppi- ja ajoituskentät kasvattavat arkistoa ja metadataa. OpenLayers-kokeessa selvitetään, mitkä attribuutit tarvitaan todella karttatyyleihin ja kohteen tunnistamiseen; sanahaku ei edellytä niiden säilyttämistä jokaisessa tiilessä.
- Välivaiheen `source_fid` sisältää suoraan GeoPackagen `fid`-arvon. Se yksilöi geometriarivin nykyisessä aineistojulkaisussa; pysyvät linkit käyttävät loogista tasoa ja rekisteritunnusta.
- Suorituskykyarkistolla ei ole Tippecanoen tiilikoko- tai kohdemäärärajaa. Tyypillisten ja pahimpien tiilien koko, selaimen renderöintikyky ja HTTP Range -pyynnöt ovat tämän kokeen varsinaisia mittaustuloksia. Mahdollinen tuotantoratkaisu tarvitsee mittausten perusteella erikseen päätettävän zoom-kohtaisen esityksen, kuten klusteroinnin tai muun eksplisiittisen aggregoinnin; kohteiden hiljainen pudottaminen ei ole hyväksyttävä ratkaisu.

Seuraava vaihe 1:n tehtävä on avata arkisto OpenLayersissa paikallisesti, toteuttaa 26 loogisen tason näkyvyys yhdestä lähteestä ja tarkistaa tyylit sekä kohteiden valinta kolmella edustavalla zoom-tasolla.

## Paikallinen Worker- ja OpenLayers-koe

Arkistolle on toteutettu muinaismuistot.info-sovelluksesta irrallinen paikallinen PoC hakemistoon [`poc/`](poc/README.md). Wrangler ajaa Workerin paikallisesti ja säilyttää koko PMTiles-arkiston simuloidussa R2-bucketissa. Worker ei palauta koko arkistoa, vaan vaatii yhden kelvollisen byte range -pyynnön, tarkistaa sen objektin kokoa vasten ja lukee R2-bindingista vain sovitun välin.

Cloudflaren Workers Vitest -integraation 15 testiä varmistavat Range-, virhe-, CORS- ja metadata-vastaukset paikallista R2-bindingia vasten. OpenLayers-sivu käyttää yhtä `PMTilesVectorSource`-oliota ja hakee 26 loogisen tason määrittelyn suoraan versionhallituista `layer-mapping.json`-tiedoista Workerin API:n kautta. Checkboxit muuttavat saman vektoritiililayerin tyylisuodatusta, eivät tietolähdettä.

Ensimmäisellä arkistolla tehty end-to-end-tarkistus palautti pyynnölle `bytes=0-16383` täsmälleen 16 384 tavua ja vastauksen `206 Partial Content`. Palautuneet tavut vastasivat paikallisen arkiston alkua, ja PMTiles CLI pystyi lukemaan Workerin URL:n kautta arkiston version 3 metadatan sekä kaikki 0–14 zoom-tasot. Worker on arkiston koosta riippumaton, ja korjattu 138 301 298 tavun suorituskykyarkisto on ladattu samaan paikalliseen R2-avaimeen.

Seuraavaksi tarvitaan selaimessa tehtävä visuaalinen tarkistus kolmella edustavalla zoom-tasolla. Alueiden ristikkäisviivoitus, symbolien lopulliset pikselikoot ja yleistyksen hyväksyttävyys eivät ole vielä lukittuja.

Täyden pisteaineiston ensimmäisessä selainmittauksessa koko Suomen näkymä siirsi vain noin 4,5 Mt dataa kuudella Range-pyynnöllä, mutta kartan liikuttaminen hidastui M1 Max -koneellakin noin yhteen kuvaan sekunnissa. Tämän jälkeen PoC:n oma tyylifunktio optimoitiin pois tulosta vääristävänä tekijänä: aiempi toteutus kävi featurea kohden lineaarisesti läpi enintään 26 loogista tasoa ja loi uudet OpenLayers-tyylioliot jokaisella kutsulla. Nykyinen toteutus käyttää vakioaikaisia `source-layer`- ja `laji_key`-hakutauluja sekä kerran luotuja ja uudelleenkäytettäviä tyyliolioita. Diagnostiikka näyttää lisäksi karttaliikkeen aikana tehtyjen tyylikutsujen määrän. FPS ja muut selainmittarit on mitattava uudelleen tällä versiolla ennen aggregointipäätöstä.

PoC:ssa on nyt arkeologisten pääkohdepisteiden tyyppi-, alatyyppi- ja ajoitussuodatus. Valmis **Pronssikautiset hautaröykkiöt** -vertailu näyttää vain kiinteiden muinaisjäännösten pisteet, joiden päätyyppi sisältää `hautapaikat`, ajoitus `pronssikautinen` ja alatyyppi `hautaröykkiöt`. Lähde-GeoPackage sisältää ehdot täyttäviä pisteitä 1 467. Näin täyden aineiston ja tutkimuskäytössä tarkasti rajatun aineiston renderöintinopeus voidaan mitata samalla arkistolla ilman rakennusvaiheen aggregointia.

Manuaalisessa kokeessa 1 467 pronssikautisen hautaröykkiön suodatettu koko Suomen näkymä toimi erittäin nopeasti, vaikka PMTiles-arkisto säilytti kaikki yksittäiset pisteet. Havainto tukee adaptiivista ratkaisua: tarkasti suodatettu aineisto piirretään yksittäisinä kohteina eikä sitä saa korvata kiinteällä rakennusvaiheen aggregoinnilla. Laajan suodattamattoman näkymän esitystapa ratkaistaan erikseen.

Optimoidun suodatetun näkymän manuaalisessa liiketestissä loppunäkymä valmistui noin 1 ms:ssa, renderöintikierroksia syntyi noin 73–106 sekunnissa ja p95-ruutuväli oli 11–20 ms. OpenLayers ei kutsunut tyylifunktiota liikkeen aikana uudelleen, vaan käytti välimuistittuja renderöintiohjeita. Näiden lukujen perusteella 1 467 kohteen tarkka matalan zoomin esitys ei tarvitse aggregointia tällä testikoneella.

Kaikkien 41 549 `kiintea_muinaisjaannos`-pisteen koko Suomen näkymä hyväksyttiin samalla M1 Max -testikoneella riittävän nopeaksi, vaikka se ei ollut yhtä sulava. Zoomilla 5 mitattiin loppunäkymän valmistumisajaksi 3 ms, noin 17,4 renderöintikierrosta sekunnissa, p95-ruutuväliksi 141 ms ja p95-syöteviiveeksi 46 ms. OpenLayers käytti myös tässä liikkeen aikana välimuistittuja renderöintiohjeita. Tulos osoittaa, että taso voidaan tarvittaessa näyttää tarkkana; tuotannon automaattinen aggregointi voi silti aktivoitua säädettävän kohderajan perusteella.

141 ms:n p95-ruutuväli vastaa hitaimmassa viidessä prosentissa noin seitsemää renderöintikierrosta sekunnissa, joten tulos ei ole yleinen mobiilihyväksyntä eikä vielä kata kaikkia 112 441 arkeologista pääkohdepistettä tai kaikkia fyysisiä pistetasoja. Nämä tapaukset mitataan erikseen, jos niiden yhtäaikainen näyttäminen kuuluu hyväksyttävään käyttötilanteeseen.

## PoC:n arkkitehtuuripäätös

PMTiles-ratkaisulla jatketaan. Arkisto säilyttää kaikki yksittäiset pisteet myös matalilla zoom-tasoilla, jotta tarkasti suodatetut valtakunnalliset jakaumat eivät katoa. Selain näyttää aktiivisen suodatuksen osumat yksittäisinä niin kauan kuin tulosjoukko mahtuu renderöintibudjettiin.

Dynaamisen aggregoinnin alustava aktivointialue on 20 000–40 000 näkyvää kohdetta. Raja ei ole vielä tuotannon vakio: se kalibroidaan useilla työpöytä- ja mobiililaitteilla käyttäen p95-ruutuväliä, p95-syöteviivettä, muistinkäyttöä ja loppunäkymän valmistumisaikaa. Aggregointi tehdään aktiivisen suodatuksen jälkeen, ei pysyvästi PMTiles-rakennuksessa. Näin noin 99 prosentiksi arvioidut tavanomaiset ja tutkimuksellisesti mielekkäät käyttötapaukset säilyvät tarkkoina.

Tuotantototeutuksen pitää:

- laskea aktiivisen, näkyvään karttanäkymään osuvan tulosjoukon koko;
- piirtää rajan alittavat tulokset yksittäisinä;
- aggregoida vain rajan ylittävä aktiivinen tulosjoukko;
- vaihtaa tilaa ilman uuden PMTiles-arkiston tai erillisten tasokohtaisten tietolähteiden lataamista;
- kertoa käyttöliittymässä, milloin aggregoitu esitys on käytössä;
- välttää jatkuva edestakainen vaihtelu käyttämällä kahden rajan hystereesiä;
- sallia rajan ja aggregointisäännön säätäminen ilman aineiston tietomallin muuttamista.

Ensimmäinen kokeiltava hystereesi voi esimerkiksi ottaa aggregoinnin käyttöön yli 40 000 kohteella ja poistaa sen käytöstä vasta määrän alittaessa 20 000. Arvot ovat mittaushypoteesi, eivät lopullinen päätös.

## Kompakti kenttämalli

Rinnakkainen kompakti arkisto säilyttää samat 12 lähdetasoa, kaikki featuret ja samat geometriat mutta poistaa karttarenderöinnille tarpeettomat näyttökentät. Arkeologisilla pääkohdepisteillä säilyvät `laji_key`, 19 tyypin `type_mask`, 12 ajoituksen `dating_mask` ja 211 atomisen alatyypin `subtype_codes`. Arkeologisilla alueilla säilyy `laji_key`; muilla tasoilla ei ole MVT-feature-ID:n lisäksi ominaisuuksia.

Arkisto pieneni 138 301 298 tavusta 54 762 752 tavuun eli noin 60,4 prosenttia ilman kohteiden harvennusta. Rakennus ja validointi vahvistivat kaikki 12 lähdetasoa sekä kaikkien pistetasojen täydet määrät zoomilla 0. Pronssikautisten hautaröykkiöiden tarkistus tuotti kompaktista arkistosta samat 1 467 osumaa kuin lähde-GeoPackage ja leveä arkisto.

Kompakti arkisto rakennetaan komennolla `scripts/13-build-compact-pmtiles-poc.sh`. Skripti generoi lähdeaineistosta versionoidun `poc/web/filter-vocabulary.json`-koodiston ja keskeyttää, jos tyypin, ajoituksen tai alatyypin raakaarvoa ei voida esittää koodistolla. `npm run seed` käyttää kompaktia arkistoa oletuksena. Seuraava manuaalinen vertailu on koko Suomen Range-tavumäärä ja samojen suodattamattomien sekä 1 467 kohteen selainmittausten toisto.

Kompaktin arkiston ensimmäinen koko Suomen selainmittaus tuotti seuraavat luvut:

| Mittari | Leveä arkisto | Kompakti arkisto |
| --- | ---: | ---: |
| PMTiles Range -pyynnöt | 6 | 6 |
| siirretyt tavut | 4 535 650 | 835 056 |
| muutos siirretyissä tavuissa | – | −81,6 % |

Pyyntömäärä pysyi tavoitteiden mukaisesti samana, mutta siirto pieneni noin 3,70 Mt. Arkiston 60,4 prosentin kokonaiskoon pienennystä suurempi näkymäkohtainen hyöty johtuu siitä, että koko Suomen näkymän matalien zoomien tiilisisällöstä suuri osa oli toistuvia raakamuotoisia ominaisuustietoja.

Suodattamattomassa aloitusnäkymässä OpenLayers käsitteli 227 013 näkyvää featurea. Loppunäkymän valmistuminen vei 618 ms, renderöintikierroksia syntyi 4,9/s ja p95-ruutuväli oli 529 ms. Seuraavassa karttaliikkeessä OpenLayers käytti välimuistittuja renderöintiohjeita: uudelleentyylittelykutsuja ei tullut, loppunäkymä valmistui 3 ms:ssa, renderöintikierroksia syntyi 5,7/s ja p95-ruutuväli oli 262 ms. Verkkosiirto ei siis enää ole tämän pahimman tapauksen pullonkaula; kuorma syntyy yli 200 000 vektorifeaturen piirto-ohjeiden luonnista ja compositoinnista.

Diagnostiikan 7 ms:n `Ensimmäinen renderöinti` ei kuvaa aineiston valmistumista, koska OpenLayers voi lähettää ensimmäisen `rendercomplete`-tapahtuman ennen PMTiles-tiilien purkua ja tyylittelyä. Aloitusnäkymän vertailukelpoinen luku on tässä mittauksessa 618 ms:n liikkeen loppu → valmis -mittaus. Diagnostiikassa tämä ensirenderöintimittari pitää seuraavaksi nimetä tai korvata datan valmistumisen mittarilla.

## Dynaamisen aggregoinnin ensimmäinen PoC

PoC:ssa on nyt pistetasoille aktiivisen taso- ja suodatusvalinnan jälkeen tehtävä selainpuolinen ruudukkoaggregointi. OpenLayers voi palauttaa saman MVT-featuren leikattuna tai monistettuna useasta tiilestä, joten näkymän laskenta deduplikoi featuret yhdistelmällä `source-layer + MVT feature ID`. Näin hystereesi perustuu yksilöllisiin kohteisiin eikä tiilikopioihin.

Aggregointi on aluksi optimistisesti käytössä, jotta suodattamatonta yli 200 000 featuren aineistoa ei tarvitse ensin piirtää vain määrän selvittämiseksi. Ladattujen tiilien valmistuttua selain:

1. rajaa featuret nykyiseen karttanäkymään;
2. soveltaa loogiset tasovalinnat ja arkeologisten pisteiden tyyppi-, alatyyppi- ja ajoitussuodattimet;
3. laskee aktiiviset yksilölliset pisteet;
4. valitsee yksittäisen tai aggregoidun esityksen 20 000/40 000 kohteen hystereesillä;
5. ryhmittelee aggregoidussa tilassa pisteet 64 pikselin ruudukkoon siten, että yhteen soluun syntyy vain yksi kokonaismäärän näyttävä symboli; väri tulee solun yleisimmästä loogisesta tasosta.

Kynnysarvot ovat säädettävissä PoC-sivulta ilman koodimuutosta. Polygonit ja viivat piirretään tässä versiossa aina sellaisinaan. Diagnostiikka näyttää ladatut featuret, aktiiviset pisteet, yksittäisinä piirrettävät pisteet, aggregaattimerkit ja valitun esitystavan.

Aikaisempi `Ensimmäinen renderöinti` on korvattu `Aloitusnäkymän data valmis` -mittarilla. Se odottaa näkymän tiililatausten päättymistä, esitystavan laskentaa ja saman esitystilan seuraavaa renderöintikierrosta. Ratkaisu on PoC-mittari; mahdolliset myöhemmin käynnistyvät taustakartta- ja muiden lähteiden pyynnöt pitää tuotantomittauksessa yhdistää samaan valmistumisehtoon.

Ensimmäinen 48 pikselin toteutus muodosti ruudukon erikseen jokaiselle loogiselle tasolle. Koko Suomen näkymään syntyi 549 päällekkäistä aggregaattimerkkiä, joten tulos oli visuaalisesti sekava. Lisäksi ruudukko laskettiin uudelleen kartan liikkeen aikaisissa `rendercomplete`-tapahtumissa, mikä kävi yli 160 000 ladattua featurea läpi toistuvasti ja teki liikkeestä lähes tarkan piste-esityksen veroisen. Korjattu versio käyttää yhtä merkkiä ruutua kohti, pienempiä symboleita ja jättää yksittäisen kohteen lukutekstin pois. Koko näkymän featurejoukko käydään läpi vain, kun tiilisisältö, näkymä, tasovalinta, suodatin tai aggregointiraja muuttuu, ja karttaliikkeen ruudukko päivitetään vasta liikkeen päätyttyä.

Korjatun version manuaalinen koko Suomen testi hyväksyttiin sekä visuaalisesti että suorituskyvyltään. Näkymässä oli 162 131 deduplikoitua ladattua featurea ja 133 070 aktiivista pistettä. Selain muodosti niistä 48 aggregaattimerkkiä. Karttaliikkeen aikana OpenLayers käytti välimuistittuja renderöintiohjeita, joten uudelleentyylittelykutsuja ei syntynyt. Zoomilla 5,22 mitattiin:

| Mittari | Korjattu aggregointi |
| --- | ---: |
| aktiiviset pisteet | 133 070 |
| aggregaattimerkit | 48 |
| liikkeen loppu → valmis | 1 ms |
| renderöintikierroksia | 64,8/s |
| p95-ruutuväli | 56 ms |
| p95-syöte → renderöinti | 4 ms |

P95-ruutuväli osoittaa, ettei jokainen liikkeen jakso ole täysin tasainen, mutta syöteviive, loppunäkymän valmistuminen ja käyttäjän kokema nopeus ovat tällä testikoneella PoC:lle riittävät. Kuvallinen tarkistus osoitti valtakunnallisen jakauman säilyvän luettavana. Aggregaattisymboli ei kuitenkaan vielä kerro solun eri tasojen koostumusta; väri näyttää vain yleisimmän loogisen tason. Mahdollinen koostumuksen näyttö kuuluu myöhempään käyttöliittymähiomiseen, ei arkkitehtuurin hyväksymiskriteeriin.

## Aluetasojen zoomikohtainen esitys

Kaikki viisi aluetasoja sisältävää fyysistä lähdetasoa julkaistaan nyt samassa PMTiles-arkistossa kahtena toisiaan täydentävänä geometriaesityksenä:

- zoomit 0–9: `ST_Centroid`-keskipiste;
- zoomit 10–14: varsinainen Tippecanoen zoomin mukaan yksinkertaistama polygonigeometria.

Muutos koskee tasoja `archaeological_areas`, `protected_building_areas`, `rky_areas`, `vark_areas` ja `world_heritage_areas`. Molemmat esitykset käyttävät samaa MVT-`source-layer`-nimeä, joten arkistojen, HTTP-pyyntöjen tai loogisten tasovalintojen määrä ei kasva. Selain tunnistaa matalan zoomin pistegeometrian geometriatyypistä ja ottaa sen mukaan samaan dynaamiseen aggregointiin kuin varsinaiset pistetasot.

Rakennus validoi jokaiselle aluetasolle yhtä monta keskipistettä kuin lähteessä on kelvollisia geometrioita. Arkistovalidointi vahvistaa zoomilla 0 kaikkien viiden aluetason täydet tietuemäärät ja ainoaksi geometriatyypiksi `Point`. Uusi arkisto on 54 075 777 tavua, kun pelkkiä polygoneja sisältänyt kompakti versio oli 54 762 752 tavua. Muutos siis pienensi koko arkistoa noin 687 kt samalla, kun matalilla zoomeilla säilyvät nyt kaikki aluekohteet ennustettavasti keskipisteinä.

## Yksinkertaistettu tunniste ja D1-massahaku

PoC käyttää saman aineistojulkaisun MVT:n ja D1:n yhteisenä avaimena yhdistelmää `source-layer + feature ID`, jossa feature ID on suoraan GeoPackagen `fid`. Lähderivejä ei deduplikoida, joten myös suojeltujen rakennuspisteiden kaikki 2 290 riviä säilyvät. Pysyvä URL käyttää yhdistelmää `logicalLayerId + registryId`; sillä tehtävä D1-haku palauttaa kaikki nykyisen aineiston vastaavat rivit.

Kaikki 268 964 geometriallisen lähderivin `fid`-tunnisteita käyttävä arkisto on 66 963 838 tavua. Aikaisemmat vakaasta geometriarivi-identiteetistä tehdyt kokeet on hylätty tarpeettomina. Koko Suomen Range-siirto mitataan uudelleen nykyisellä arkistolla.

Skripti `scripts/14-build-feature-details-sql.sh` muodostaa 268 964 rivin D1-tuontiaineiston samoilla `fid`-tunnisteilla kuin PMTiles-rakennus. Worker tarjoaa karttaklikkaukselle `POST /api/features/batch` -täsmähaun ja pysyville linkeille `POST /api/features/by-register` -massahaun. Jälkimmäinen hyväksyy enintään 100 `{logicalLayerId, registryId}`-viitettä ja palauttaa jokaiselle kaikki uusimman aineiston geometriarivit. D1-indeksi on yhdistelmällä `(logical_layer_id, registry_id)`.

Paikallinen end-to-end-koe palautti featurelle `archaeological_points:134403` oikean nimen, rekisteritunnuksen, kunnan ja luokittelukentät sekä raportoi samassa vastauksessa puuttuvan `rky_points`-viitteen. Worker vastasi 108 ms:ssa.
