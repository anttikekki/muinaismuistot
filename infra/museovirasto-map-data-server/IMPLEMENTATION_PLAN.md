# Museoviraston karttadatapalvelun toteutussuunnitelma

## 1. Tavoite ja rajaus

Toteutetaan muinaismuistot.info-sivustolle oma, Cloudflaren kautta tarjottava karttadatapalvelu. Palvelu korvaa käyttöliittymän nykyiset hitaat WMS `GetMap`-, WMS `GetFeatureInfo`- ja WFS `GetFeature` -kutsut.

Ensimmäisen tuotantoversion pitää:

- näyttää README:ssä luetellut 26 karttatasoa myös koko Suomen näkymässä;
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

Kaikki 26 karttatasoa tallennetaan saman PMTiles-arkiston MVT-tiiliin erillisinä nimettyinä `source-layer`-tasoina. Käyttäjä voi valita tasot dynaamisesti, mutta valinta tehdään OpenLayersin tyylisuodatuksella eikä vaihtamalla tiililähdettä. Piilotetulle tasolle ei palauteta tyyliä, eikä sen kohteita huomioida karttaklikkauksen tuloksissa. Sama näkymä ja zoom-taso ladataan näin vain kerran Museoviraston aineistoa varten riippumatta valittujen tasojen määrästä.

Yhden arkiston haittana hyväksytään, että ladattu tiili voi sisältää myös piilotettujen tasojen ominaisuuksia. Rakennusvaiheen tiilikokobudjetti, geometriayleistys ja pienten zoom-tasojen aggregointi ovat siksi pakollisia. Pyyntömäärää ja siirrettyä datamäärää mitataan koko OpenLayers-kokonaisuudesta, johon kuuluvat myös erillinen taustakartta ja muiden lähteiden karttatasot.

Sanahaku toteutetaan tarkoituksella yksinkertaisesti ilman Museoviraston WFS-riippuvuutta. Päivitysajo poimii GeoPackage-tiedostoista D1-tauluun vain kohteen sisäisen ja lähteen tunnisteen, alkuperäisen ja normalisoidun nimen, karttatason, kohdetyypin sekä kohteen keskipisteen tai rajauslaatikon. Worker tekee parametrisoidun osajonohaun normalisoidusta nimestä, esimerkiksi `LIKE '%hakusana%'`, rajaa tulosmäärän ja välimuistittaa vastauksen. Kymmenien tuhansien rivien lineaarinen haku saa olla hieman hidas, koska toimintoa käytetään harvoin. FTS-, trigrammi- tai erillinen hakupalvelu lisätään vasta, jos mitattu käytettävyys sitä edellyttää.

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

ZIP-paketin odotettu rakenne validoidaan README:ssä dokumentoitua tiedostolistaa vasten. Syötteenä käytetään kaikkia `.gpkg`-tiedostoja. Mukana olevat `.qml`-tiedostot eivät sisällä varsinaista kohdeaineistoa, mutta niitä käytetään referenssinä OpenLayers-tyylien määrittelyssä. Rakennusputkeen tehdään eksplisiittinen mäppäys GeoPackage-tiedostoista ja niiden sisäisistä tasoista 26 julkaistavaan MVT-`source-layer`-tasoon. Erityisesti arkeologisten kohteiden yhdistettyjen piste- ja aluetiedostojen jako julkaistaviin kohdetyyppeihin perustuu lähdeaineiston kenttiin eikä tiedostonimeen yksin.

Päivitysajon vaiheet:

1. Käynnistä ajo Museoviraston ilmoitetun päivitysajan jälkeen, esimerkiksi päivittäin klo 02.00 UTC.
2. Tee lähteelle `HEAD`- tai ehdollinen `GET`-pyyntö ja vertaa `ETag`-, `Last-Modified`- tai sisältötiivistetietoa viimeiseen onnistuneeseen ajoon.
3. Lataa ZIP väliaikaiseen työtilaan ja laske sille SHA-256-tiiviste.
4. Tarkista ZIP:n eheys, pura paketti ja varmista, että README:ssä luetellut `.gpkg`-tiedostot ovat mukana. Tunnista puuttuvat, ylimääräiset ja uudelleennimetyt tiedostot ennen muunnosta.
5. Listaa jokaisen GeoPackage-tiedoston sisäiset tasot ja varmista niiden geometriatyypit, koordinaattijärjestelmä, pakolliset kentät ja tietuemäärät.
6. Normalisoi lähdetasojen nimet ja kentät sisäiseen skeemaan ja jaa yhdistetyt arkeologiset aineistot julkaistaviin kohdetyyppeihin.
7. Muunna geometriat `EPSG:3857`-koordinaatistoon, korjaa mahdollisuuksien mukaan virheelliset geometriat ja raportoi hylätyt tietueet.
8. Rakenna yksi zoom-tasoittain yleistetty PMTiles-arkisto, jossa kaikki lähdetasot säilyvät erillisinä nimettyinä MVT-lähdetasoina, sekä mahdollinen ominaisuustietoaineisto ja D1:een vietävä suppea hakuaineisto.
9. Suorita automaattiset laatu- ja suorituskykytarkistukset.
10. Siirrä artefaktit R2:een uuden, muuttumattoman versionimen alle, esimerkiksi `datasets/<sha256>/map.pmtiles`.
11. Tuo hakurivit D1:een uuden aineistoversion tunnisteella ja tarkista rivimäärä sekä koehakujen tulokset.
12. Vaihda kartan ja hakutaulun aktiivisen version osoittimet samassa julkaisuvaiheessa vasta, kun kaikki artefaktit ja smoke-testit ovat onnistuneet.
13. Säilytä vähintään edellinen onnistunut versio nopeaa palautusta varten ja poista vanhemmat R2-artefaktit ja D1-rivit määritellyn säilytysajan mukaan.

Jos lähde ei ole muuttunut, ajo päättyy ilman uudelleenrakennusta. Epäonnistunut ajo ei muuta aktiivista versiota, mutta lähettää hälytyksen.

## 4. Toteutusvaiheet

### Vaihe 0: Lähtötilanteen mittaus ja skeeman kartoitus

- Lataa yksi tuotantoaineisto ja listaa jokaisen GeoPackage-tiedoston sisäiset tasot, kentät, geometriatyypit, koordinaattijärjestelmät ja tietuemäärät.
- Tee versionhallittu mäppäys README:ssä luetelluista tiedostoista ja niiden sisäisistä tasoista 26 julkaistavaan karttatasoon. Dokumentoi yhdistettyjen arkeologisten aineistojen jakamiseen käytettävät kenttäarvot.
- Vertaa mukana toimitettuja QML-tyylejä nykyisiin WMS-/OpenLayers-tyyleihin ja kirjaa, mitä niistä hyödynnetään.
- Selvitä, mikä kenttä toimii pysyvänä kohdetunnuksena tasojen välillä.
- Kirjaa nykyisten OpenLayers-tyylien, hakutulosten ja `GetFeatureInfo`-vastauksen käyttämät kentät.
- Mittaa nykyisen ratkaisun latausajat ja siirretyt tavumäärät vähintään koko Suomen, maakunta-/kaupunkitason ja lähitason näkymissä. Näitä käytetään vertailutasona.

**Tuotos:** versionhallittu lähdeskeeman kuvaus, tasomäppäys ja suorituskyvyn lähtötaso.

Ensimmäinen lähdeaineiston lataus ja GeoPackage-inventaario on toteutettu toistettavilla Bash-skripteillä. Koko vaihe ajetaan komennolla `infra/museovirasto-map-data-server/scripts/run-phase-0-source-inventory.sh`. Ladattu ja purettu aineisto tallennetaan gitistä ohitettuun `infra/museovirasto-map-data-server/data/`-hakemistoon, ja generoitu tulos on tiedostossa [SOURCE_DATA_INVENTORY.md](SOURCE_DATA_INVENTORY.md).

### Vaihe 1: Tekninen proof of concept

- Muunna edustava osa tai koko aineisto vektoritiiliksi esimerkiksi GDAL- ja Tippecanoe-työkaluilla.
- Testaa geometriayleistys, pistetiheys, klusterointi sekä ominaisuuksien tunnistaminen OpenLayersissa.
- Paketoi kaikki 26 lähdetasoa yhteen PMTiles-arkistoon, tallenna se R2:een ja varmista Range-pyynnöt sekä välimuistuminen Cloudflaren kautta.
- Varmista, että tasoja voi näyttää ja piilottaa ilman uusia Museovirasto-tiililähteitä tai saman tiilen lataamista erikseen tasoa kohden.
- Mittaa arkiston koko, tyypillisten ja pahimpien tiilien koko, koko karttanäkymän HTTP-pyyntömäärä, siirretty datamäärä, renderöintiaika ja muistinkäyttö hitaaksi simuloidulla mobiililaitteella. Mittaukseen sisällytetään taustakartta ja muiden lähteiden karttatasot.
- Tuo D1:een suppea hakutaulu ja toteuta Workeriin yksinkertainen osajonohaku. Varmista ääkkösten, kirjainkoon, osittaisten hakujen, välimuistin ja tulosrajan toiminta.
- Vahvista yhden PMTiles-arkiston suorituskykybudjetit ja kirjaa D1:n lineaarisen haun mitattu vasteaika vertailutiedoksi.

**Tuotos:** selaimessa toimiva kokeilu ja mitattu arkkitehtuuripäätös.

### Vaihe 2: Toistettava rakennusputki

- Tee lukituilla työkaluversionumeroilla ajettava rakennusskripti tai kontti.
- Toteuta taso- ja kenttämäppäys konfiguraationa, ei hajautettuina oletuksina koodissa.
- Lisää aineiston validointi, geometriakorjaukset, tiivisteet, manifesti ja koneellisesti luettava rakennusraportti.
- Lisää tiilien zoom-/yleistyssäännöt sekä tiilikoon tarkistus.
- Muodosta hakutaulun tuontiaineisto ja normalisoi nimet yhden dokumentoidun säännön mukaisesti. Pidä skeema tarkoituksella suppeana.
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
- Siirrä kaikkien lähdetasojen näkyvyys- ja tyylisäännöt yhden OpenLayers-vektoritiililähteen tyylifunktioon. Tasovalinta muuttaa vain näkyvien `source-layer`-tasojen joukkoa eikä luo uutta lähdettä.
- Rajaa karttaklikkauksen osumat käyttäjän valitsemiin näkyviin tasoihin.
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

- Kaikki lähdeaineistosta hyväksytyt 26 tasoa esiintyvät rakennusraportissa ja ovat joko näkyvissä tai tarkoituksellisesti aggregoituina määritellyillä zoom-tasoilla.
- Automaattinen päivitys julkaisee uuden muuttuneen aineiston 6 tunnin kuluessa Museoviraston päivitysajasta.
- Epäonnistunut tai puutteellinen aineisto ei korvaa aktiivista versiota.
- Kartan ensimmäinen käyttökelpoinen näkymä latautuu tavallisella 4G-yhteydellä mediaaniltaan alle 2 sekunnissa tuetulla keskitason mobiililaitteella; p95-tavoite on alle 4 sekuntia.
- Yhden 256 pikselin vektoritiilen pakattu koko on normaalisti alle 100 kt eikä ylitä 300 kt ilman erikseen hyväksyttyä poikkeusta.
- Kaikkien 26 tason näyttäminen tai niiden näkyvyyden vaihtaminen käyttää yhtä Museovirasto-vektoritiililähdettä; yksittäistä tiiltä ei pyydetä uudelleen eri lähdetasojen vuoksi.
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
