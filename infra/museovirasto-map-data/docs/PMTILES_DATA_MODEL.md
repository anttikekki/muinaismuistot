# PMTiles-arkiston tietomalli

## Tarkoitus ja rajaus

Tämä dokumentti kuvaa tuotannon kompaktin PMTiles-arkiston toteutuneen MVT-skeeman kenttäkohtaisesti. Se erottaa nykyisen kompaktin skeeman sitä edeltäneestä leveästä vertailuskeemasta. Tiilissä pidetään vain kartan piirtämiseen, dynaamisiin tasovalintoihin ja arkeologisten pisteiden suodatukseen tarvittava tieto.

Kohdepaneelin näyttötiedot, sanahaku ja laajat raakakentät eivät lähtökohtaisesti kuulu MVT-tiiliin. Ne on tarkoitus palauttaa suppeasta hakuaineistosta tai valitun kohteen ominaisuustieto-endpointista. Rajaus perustuu tiedostossa [`FIELD_CONTRACT.md`](FIELD_CONTRACT.md) kuvattuun käyttöliittymän kenttäsopimukseen.

Toteutunut skeema tarkistetaan jokaisessa kontissa ajettavassa rakennuksessa
`processing/scripts/11-validate-pmtiles.sh`-skriptillä.

Arkistossa on 12 MVT `source-layer` -tasoa. `laji_key`, `type_mask` ja `dating_mask` ovat MVT-metadatan mukaan numeroita; `subtype_codes` on merkkijono. Geometria ja MVT-feature-ID eivät näy `vector_layers.fields`-luettelossa.

## Tunnisteet ja geometria

| Osa | Nykyinen toteutus | Käyttö | Tavoite |
| --- | --- | --- | --- |
| Geometria | Piste- ja viivatasot säilyttävät geometriatyyppinsä; aluetasot ovat keskipisteitä zoomeilla 0–9 ja yksinkertaistettuja polygoneja zoomeilla 10–14 | piirtäminen, aggregointi ja osumatunnistus | säilytä zoomikohtainen esityssopimus |
| MVT-feature-ID | GeoPackagen `fid`. Arvo annetaan Tippecanoelle väliaikaisessa `source_fid`-kentässä `--use-attribute-for-id=source_fid`-asetuksella. | OpenLayers-featureen tunnistaminen ja saman aineistojulkaisun D1-täsmähaun avain yhdessä lähdetason kanssa | validoi jokaisessa rakennuksessa; vakautta julkaisujen välillä ei edellytetä |
| `source_fid`-ominaisuus | ei esiinny MVT-ominaisuutena | vain ID:n muodostus rakennuksessa | älä lisää ominaisuuskentäksi |
| `source-layer` | MVT-tason nimi, esimerkiksi `archaeological_points` | fyysinen tasovalinta ja tyylin valinta | säilytä rakenteena, ei erillisenä feature-kenttänä |

Toteutunut tunniste käyttää suoraan GeoPackagen paikallista `fid`-järjestysnumeroa. `source-layer + feature ID` muodostaa yhteisen avaimen saman PMTiles-julkaisun ja D1-aineiston välillä. Pysyvä URL ei käytä tätä avainta, vaan yhdistelmää `logicalLayerId + registryId`, jolla D1 palauttaa aina nykyisen aineiston kaikki vastaavat geometriarivit.

Lähderivejä ei deduplikoida. Myös suojeltujen rakennusten pisteaineiston kaksi identtistä riviparia säilyvät omina `fid`-riveinään. Samalla `logicalLayerId + registryId` -avaimella voi tarkoituksellisesti löytyä useita geometrioita, ja rekisteritunnushaku palauttaa ne kaikki.

## Nykyinen kompakti PoC-skeema

`ID` tarkoittaa MVT-feature-ID:tä, ei ominaisuuskenttää.

| MVT source-layer | Geometria | Tietueita | Toteutuneet ominaisuuskentät |
| --- | --- | ---: | --- |
| `archaeological_areas` | Point z0–9, Polygon z10–14 | 86 702 | `laji_key` |
| `archaeological_points` | Point | 112 441 | `laji_key`, `type_mask`, `subtype_codes`, `dating_mask` |
| `archaeological_subsites_points` | Point | 63 216 | ei ominaisuuskenttiä |
| `protected_building_areas` | Point z0–9, Polygon z10–14 | 138 | ei ominaisuuskenttiä |
| `protected_building_points` | Point | 2 290 | ei ominaisuuskenttiä |
| `rky_areas` | Point z0–9, Polygon z10–14 | 1 851 | ei ominaisuuskenttiä |
| `rky_lines` | LineString | 186 | ei ominaisuuskenttiä |
| `rky_points` | Point | 64 | ei ominaisuuskenttiä |
| `vark_areas` | Point z0–9, Polygon z10–14 | 1 010 | ei ominaisuuskenttiä |
| `vark_points` | Point | 1 010 | ei ominaisuuskenttiä |
| `world_heritage_areas` | Point z0–9, Polygon z10–14 | 50 | ei ominaisuuskenttiä |
| `world_heritage_points` | Point | 6 | ei ominaisuuskenttiä |

Validointiskripti tarkistaa tämän kenttäjoukon täsmällisesti. Ylimääräinen kenttä kompaktissa arkistossa keskeyttää validoinnin. Skeema on nykyisen PoC:n toteutunut minimimalli; ominaisuustietojen täsmä- ja rekisteritunnushaut on toteutettu D1-PoC:ssa.

Aluetasojen keskipiste ja polygoniversio käyttävät samaa `source-layer`-nimeä ja samaa MVT-feature-ID:tä eri zoom-alueilla. Näin looginen tasomäppäys, tasovalinnat ja PMTiles-lähteiden määrä eivät muutu. Keskipiste osallistuu matalilla zoomeilla samaan aktiivisen tulosjoukon aggregointiin kuin varsinaiset pistetasot. Zoomilta 10 alkaen keskipistettä ei enää julkaista ja selain saa varsinaisen polygonin.

## Historiallinen leveä vertailuskeema

Ensimmäinen 138 301 298 tavun suorituskykyarkisto sisälsi renderöintikenttien lisäksi muun muassa `registry_id`-, `name`-, `municipality`-, `types_raw`-, `subtypes_raw`- ja `datings_raw`-kenttiä. Rakennus-, RKY-, VARK- ja maailmanperintötasoilla oli vastaavasti niiden näyttö- ja raakakenttiä. Leveää arkistoa käytettiin sen osoittamiseen, että kaikki pisteet voidaan säilyttää matalilla zoom-tasoilla, sekä kompaktin skeeman vaikutuksen mittaamiseen. Nykyinen selain-PoC ei enää käytä leveää skeemaa.

## Kenttäkohtainen arvio

| Kenttä | Leveän vertailuarkiston tasot | Käyttötarkoitus | Toteutunut päätös kompaktissa PoC:ssa |
| --- | --- | --- | --- |
| `laji_key` | arkeologiset alueet, pisteet ja alakohteet | jakaa kaksi fyysistä pääkohdetasoa kahdeksaan loogiseen tasoon ja valitsee tyylin | **Säilytetty pääkohteiden pisteillä ja alueilla, poistettu alakohteilta.** Tuntematon arvo estää validoinnin läpäisyn. |
| `types_raw` | arkeologiset tasot ja VARK | kohdepaneelin näyttö ja leveän PoC:n väliaikainen selainfiltteri | **Korvattu arkeologisilla pisteillä `type_mask`-kentällä ja poistettu muilta tasoilta.** Raakamuoto kuuluu myöhempään ominaisuustietoaineistoon. |
| `subtypes_raw` | arkeologiset tasot ja VARK | kohdepaneelin näyttö ja arkeologisten pisteiden alatyyppisuodatus | **Korvattu arkeologisilla pisteillä `subtype_codes`-kentällä ja poistettu muilta tasoilta.** Raakamuoto kuuluu myöhempään ominaisuustietoaineistoon. |
| `datings_raw` | arkeologiset tasot ja VARK | kohdepaneelin näyttö ja arkeologisten pisteiden ajoitussuodatus | **Korvattu arkeologisilla pisteillä `dating_mask`-kentällä ja poistettu muilta tasoilta.** Raakamuoto kuuluu myöhempään ominaisuustietoaineistoon. |
| `registry_id` | kaikki tasot | rekisteritunnuksen näyttö, pysyvät linkit ja kohteen tunnistaminen | **Poistettu MVT:stä.** D1 palauttaa sen `source-layer + fid` -täsmähaulla tai hakee kaikki rivit `logicalLayerId + registryId` -avaimella. |
| `name` | kaikki tasot | kohdepaneelin välitön näyttö | **Poistettu MVT:stä.** Nimi haetaan myöhemmin ominaisuustieto-endpointista; endpointin hyväksyttävä viive on vielä mitattava. |
| `municipality` | arkeologiset tasot, VARK ja suojellut rakennukset | kohdepaneelin näyttö | **Poistettu MVT:stä.** Ei vaikuta piirtämiseen tai nykyiseen karttasuodatukseen. |
| `subsite_id` | arkeologiset alakohteet | alakohteen yksilöinti ja näyttö | **Poistettu MVT-ominaisuuksista.** Säilytetään myöhemmin ominaisuustietoaineistossa; tuotanto edellyttää vakaata feature-ID:tä. |
| `subsite_name` | arkeologiset alakohteet | kohdepaneelin näyttö | **Poistettu MVT:stä.** |
| `building_id` | suojeltujen rakennusten pisteet | rakennuksen yksilöinti ja näyttö | **Poistettu MVT-ominaisuuksista.** Säilytetään myöhemmin ominaisuustietoaineistossa; tuotanto edellyttää vakaata feature-ID:tä. |
| `building_name` | suojeltujen rakennusten pisteet | kohdepaneelin näyttö | **Poistettu MVT:stä.** |
| `protection_groups_raw` | suojeltujen rakennusten pisteet ja alueet | kohdepaneelin näyttö | **Poistettu MVT:stä.** Säilytetään ja normalisoidaan myöhemmin ominaisuustietoaineistossa. |
| `protection_status` | suojeltujen rakennusten pisteet ja alueet | kohdepaneelin näyttö | **Poistettu MVT:stä.** Päätös arvioidaan uudelleen vain, jos kentästä tehdään karttatyyli tai suodatin. |
| `part_name` | RKY-alueet | alueosan näyttönimi | **Poistettu MVT:stä.** |
| `area_type` | maailmanperintöalueet | kohdepaneelin näyttö | **Poistettu MVT:stä.** |

## Suodatuskenttien toteutunut esitys

Nykyisiä `types_raw`, `subtypes_raw` ja `datings_raw` -merkkijonoja ei pidä lukita tuotantotiiliin. Ne ovat pitkiä, sisältävät tyhjiä arvopaikkoja ja vaativat selaimessa lähdeaineiston rakennetta tuntevan parserin.

Arkeologisten pisteiden PoC tukee käyttäjän kuvaaman kaltaisia yhdistelmiä, esimerkiksi:

```text
laji_key = kiintea_muinaisjaannos
type = hautapaikat
subtype = hautaröykkiöt
dating = pronssikautinen
```

Kompakti PoC käyttää 19 päätyypille ja 12 ajoitukselle kokonaislukubittimaskeja. Arkeologisten pääkohteiden raakakentistä löytyvät 211 atomista alatyyppiä saavat versionoidut, järjestysnumerosta base36-muotoon muunnetut koodit. Featuren `subtype_codes` on pisteillä erotettu koodijoukko. Koodisto tuotetaan deterministisesti tiedostoon `contract/filter-vocabulary.json`; tuntematon arvo keskeyttää rakennuksen.

Jäsenyystesti on tyypeille ja ajoituksille täsmällinen bittitesti. Alatyyppikentän käyttäjälle näkyvä osajonohaku tehdään koodiston nimistä kerran suodattimen muuttuessa ja featureille testataan vain koodijäsenyys. Näin käyttöliittymän nykyinen osajonokäytös säilyy ilman pitkiä raakamerkkijonoja jokaisessa tiilifeaturessa.

## Featuren rakenne ja kenttien kuvaukset

Alla olevissa esimerkeissä `sourceLayer` ja `geometryType` kuvaavat MVT:n rakennetta. Ne eivät ole featuren `properties`-ominaisuuksia. Samoin `id` on Protobuf-featuren numeerinen MVT-feature-ID eikä nimetty ominaisuuskenttä. Geometrian koordinaatit on jätetty esimerkeistä pois, koska ne ovat tiilikoordinaatteja ja vaihtelevat zoomin sekä tiilen mukaan.

| Kenttä | MVT-tyyppi | Tasot | Kuvaus |
| --- | --- | --- | --- |
| `id` | unsigned integer | kaikki tasot | GeoPackagen positiivinen `fid`. Tunnistaa featuren yhdessä `source-layer`-nimen kanssa saman aineistojulkaisun PMTiles-arkistossa ja D1-tietokannassa. Ei ole vakaa aineistojulkaisujen välillä. |
| `source-layer` | layer-rakenne | kaikki tasot | Fyysisen MVT-tason nimi. OpenLayers käyttää sitä tasovalintaan, tyyliin ja `id`:n nimiavaruuteen. Ei toistu jokaisen featuren ominaisuutena. |
| geometria | MVT geometry | kaikki tasot | Piirrettävä tiilikoordinaatiston geometria. Piste- ja viivatasot säilyttävät tyyppinsä; aluetasot sisältävät pisteen zoomeilla 0–9 ja polygonin zoomeilla 10–14. |
| `laji_key` | number | `archaeological_points`, `archaeological_areas` | Normalisoidun arkeologisen lajin 1-pohjainen koodi. Jakaa fyysisen lähdetason kahdeksaan käyttöliittymän loogiseen tasoon ja määrää niiden tyylin. Nykyisen sanaston `2` tarkoittaa `kiintea_muinaisjaannos`. |
| `type_mask` | number | `archaeological_points` | Kohteen yhden tai usean tyypin bittimaski. Koodiston indeksissä `n` oleva tyyppi käyttää bittiä `2^n`; esimerkiksi `8` tarkoittaa nykyisessä koodistossa `hautapaikat`. |
| `subtype_codes` | string | `archaeological_points` | Yhden tai usean alatyypin pisteellä eroteltu base36-koodijoukko. Koodit ratkaistaan versionoidusta `filter-vocabulary.json`-tiedostosta; esimerkiksi `c.20` tarkoittaa nykyisessä koodistossa `hautaröykkiöt` ja `kuppikalliot`. Tyhjä merkkijono tarkoittaa, ettei alatyyppiä ole. |
| `dating_mask` | number | `archaeological_points` | Kohteen yhden tai usean ajoituksen bittimaski samalla periaatteella kuin `type_mask`; esimerkiksi `16` tarkoittaa nykyisessä koodistossa `pronssikautinen`. Arvo `0` tarkoittaa, ettei normalisoitua ajoitusta ole. |

Koodien merkitys on sidottu arkiston kanssa julkaistavaan `filter-vocabulary.json`-sanastoversioon. Tämä koskee `laji_key`-koodia, tyyppi- ja ajoitusmaskien bittipaikkoja sekä alatyypin base36-koodeja. Sanasto sisältyy selainrakennukseen ja sen SHA-256-tiiviste tallennetaan rakennusmanifestiin. Koodeja ei saa päätellä käyttöliittymässä kovakoodatusta järjestyksestä.

## Mikä toistuu featurekohtaisesti

| Tieto | Tallennustaso | Toistuminen ja kokovaikutus |
| --- | --- | --- |
| `source-layer`-nimi | MVT-layer | Tallennetaan kerran jokaiseen tiileen sisältyvään fyysiseen layeriin, ei jokaiselle featurelle. Featuren layer selviää MVT-rakenteesta. |
| ominaisuuskenttien nimet | MVT-layerin `keys`-taulu | Kukin käytetty nimi, kuten `laji_key`, tallennetaan tavallisesti kerran kyseisen tiilen layeriin. Feature sisältää vain viittauksen nimeen. |
| ominaisuuksien eri arvot | MVT-layerin `values`-taulu | Sama arvo tallennetaan layerin tiilessä yhteiseen arvotauluun; feature sisältää viittauksen. Arvotaulu muodostetaan uudelleen jokaisessa tiilessä. |
| geometrialaji | feature | MVT:n numeerinen enum toistuu jokaisella featurella ja tarvitaan geometrian dekoodaukseen. Dokumentin `geometryType` ei ole merkkijonona arkistossa. |
| geometria | feature | Jokaisen featuren tiilikoordinaatit ja piirtokomennot tallennetaan featurekohtaisesti. Sama lähdekohde voi esiintyä useassa tiilessä. |
| MVT-feature-ID | feature | Numeerinen GeoPackage-`fid` tallennetaan jokaiselle feature-esiintymälle. Sama lähdekohde voi toistua tiilirajoilla ja aluekohde eri zoomeilla. |
| `laji_key`, `type_mask`, `dating_mask`, `subtype_codes` | feature → layerin avain- ja arvotaulut | Kenttien valinta ja arvoviittaukset tallennetaan jokaiselle arkeologiselle featurelle, vaikka varsinaiset nimet ja samanlaiset arvot jaetaan saman tiilen layerissä. |

PMTiles-hakemisto ja MVT:n tiilikohtaiset yhteiset taulut vähentävät toistoa, mutta eivät muodosta koko arkiston laajuista yhteistä sanakirjaa. Sama layerin nimi, kenttänimi tai arvo voi siksi esiintyä pakatussa muodossa useissa eri tiilissä.

## Esimerkkifeaturet fyysisittäin tasoittain

Seuraavat arvot poimittiin 23.8.2026 rakennetun arkiston dekoodatusta zoomin 0 tiilestä. Kertaluonteinen poimintaskripti poistettiin PoC-moduulin mukana, mutta tulokset säilytetään todellisen aineiston esimerkkeinä. `sourceLayer` lisättiin esitykseen dekoodatun MVT-layerin nimestä; `id`, geometrialaji ja `properties` ovat valitun todellisen MVT-featuren tietoja. Koordinaatit jätetään dokumentista pois.

### Arkeologiset pääkohteet

`archaeological_points` sisältää kaikki neljä selainfiltterien tarvitsemaa ominaisuutta:

```json
{
  "sourceLayer": "archaeological_points",
  "id": 26921,
  "geometryType": "Point",
  "properties": {
    "laji_key": 2,
    "type_mask": 1024,
    "dating_mask": 1024,
    "subtype_codes": "1y"
  }
}
```

Sanaston perusteella tämän todellisen featuren `laji_key: 2` tarkoittaa kiinteää muinaisjäännöstä, `type_mask: 1024` maarakenteita, `dating_mask: 1024` ajoittamatonta kohdetta ja `subtype_codes: "1y"` kuoppia.

`archaeological_areas` tarvitsee vain loogisen lajin. Sama lähderivi on matalilla zoomeilla pisteenä ja tarkemmilla zoomeilla polygonina:

```json
{
  "sourceLayer": "archaeological_areas",
  "id": 12575,
  "geometryType": "Point",
  "properties": {
    "laji_key": 2
  }
}
```

### Muut fyysiset tasot

Seuraavilla kymmenellä tasolla `source-layer` määrää näkyvyyden ja tyylin. Kohteen tiedot haetaan klikkauksen jälkeen D1:stä yhdistelmällä `sourceLayer + id`, joten MVT-featurella ei ole ominaisuuskenttiä.

```json
[
  {
    "sourceLayer": "archaeological_subsites_points",
    "id": 9802,
    "geometryType": "Point",
    "properties": {}
  },
  {
    "sourceLayer": "protected_building_areas",
    "id": 94,
    "geometryType": "Point",
    "properties": {}
  },
  {
    "sourceLayer": "protected_building_points",
    "id": 1696,
    "geometryType": "Point",
    "properties": {}
  },
  {
    "sourceLayer": "rky_areas",
    "id": 730,
    "geometryType": "Point",
    "properties": {}
  },
  {
    "sourceLayer": "rky_lines",
    "id": 179,
    "geometryType": "LineString",
    "properties": {}
  },
  {
    "sourceLayer": "rky_points",
    "id": 36,
    "geometryType": "Point",
    "properties": {}
  },
  {
    "sourceLayer": "vark_areas",
    "id": 323,
    "geometryType": "Point",
    "properties": {}
  },
  {
    "sourceLayer": "vark_points",
    "id": 323,
    "geometryType": "Point",
    "properties": {}
  },
  {
    "sourceLayer": "world_heritage_areas",
    "id": 20,
    "geometryType": "Point",
    "properties": {}
  },
  {
    "sourceLayer": "world_heritage_points",
    "id": 2,
    "geometryType": "Point",
    "properties": {}
  }
]
```

Eri `source-layer`-tasoilla voi olla sama numeerinen `id`, koska lähdetasojen GeoPackage-`fid`-avaruudet ovat erillisiä. Tämän vuoksi tunnistusavaimesta ei saa jättää fyysisen tason nimeä pois.

## Kompaktin mallin perustelut tasoittain

| MVT source-layer | Toteutuneet feature-ominaisuudet | Peruste |
| --- | --- | --- |
| `archaeological_points` | `laji_key`, `type_mask`, `subtype_codes`, `dating_mask` | looginen taso sekä tyyppi-, alatyyppi- ja ajoitussuodatus |
| `archaeological_areas` | `laji_key` | looginen taso |
| muut 10 tasoa | ei ominaisuuksia | `source-layer` määrää näkyvyyden ja tyylin; ID riittää ominaisuustietojen hakuun |

Tämä on nykyinen minimimalli. Mahdollinen `name` on ainoa perusteltu lisäkenttäehdokas, ja se hyväksytään vain erillisellä klikkausviiveen ja arkistokoon mittauksella.

## Mitattu vaikutus

Kompakti arkisto pienensi leveän 138 301 298 tavun arkiston ensin 54 762 752 tavuun. Aluetasojen zoomikohtainen piste-/polygoni-esitys pienensi sen 54 075 777 tavuun. MVT-feature-ID:n lisäämisen jälkeen merkkijonoista `laji_key`-arvoa käyttänyt arkisto oli 66 963 838 tavua. Numeerinen, versionoidusta sanastosta avattava `laji_key` pienensi nykyisen arkiston 63 451 059 tavuun. Kaikki viiden aluetason tietueet ovat keskipisteinä zoomilla 0; polygonit alkavat zoomilta 10. Pronssikautisten hautaröykkiöiden tulosjoukko pysyi täsmälleen 1 467 kohteessa.

Ennen MVT-feature-ID:tä koko Suomen aloitusnäkymä käytti kuusi Range-pyyntöä ja 835 056 tavua. Merkkijonoista lajikoodia käyttänyt `fid`-arkisto käytti 1 766 264 tavua. Numeeriseen `laji_key`-arvoon siirtynyt nykyinen arkisto käyttää kuusi pyyntöä ja 1 765 305 tavua: koko arkisto pieneni selvästi, mutta koko Suomen aloitusnäkymän Range-siirto vain 959 tavua. Vaiheen 2 ID-vaihtoehtokoe ei pienentänyt siirtoa: ID:tön mutta `registry_id`-ominaisuuden sisältävä arkisto kasvoi 73 920 972 tavuun ja koko Suomen siirto 2 123 282 tavuun. Lisäksi MVT-ID:n puute heikensi selaimen feature-deduplikointia. Siksi `fid` säilyy nykyisenä minimimallina. Tarkka ID-vertailu on tiedostossa [IDENTITY_MODEL_COMPARISON.md](IDENTITY_MODEL_COMPARISON.md).

Ominaisuustietojen massahaku on toteutettu PoC:ssa. Karttaklikkaus lähettää enintään 100 `{sourceLayer, featureId}`-paria, joissa `featureId` on nykyisen GeoPackagen `fid`. Pysyvät linkit käyttävät erillistä `logicalLayerId + registryId` -massahakua, joka palauttaa kaikki nykyisen aineiston osumat. Kohteen nimiä tai muita näyttökenttiä ei palauteta MVT:hen ilman mitattua tarvetta.

D1:n `feature_details` sisältää hakukentät, paneelin ominaisuudet ja jokaisen featuren alkuperäisen, yksinkertaistamattoman EPSG:3067-GeoJSON-geometrian `geometry_json`-kentässä. Ominaisuustietojen massahaut palauttavat geometrian aina muiden tietojen mukana. Selain sovittaa vastauksen nykyisen WMS/WFS-integraation käyttämään GeoJSON-feature-rakenteeseen, joten sama geometria toimii kartan hakutuloksissa, suorissa feature-linkeissä ja GeoJSON-exportissa. Export ei käytä PMTilesin zoomikohtaisesti yksinkertaistettua, leikattua tai sentroidiksi muutettua geometriaa.

## Hyväksymissäännöt

- PMTiles-metadatan kenttäjoukon pitää vastata versionhallittua kompaktia skeemaa; ylimääräinen kenttä estää julkaisun.
- Raakamuotoisia moniarvokenttiä ei julkaista tuotanto-MVT:ssä.
- Karttatyylin tai aktiivisen suodatuksen tarvitsemaa kenttää ei saa poistaa.
- Suodatettu koko Suomen näkymä näyttää kaikki ehdot täyttävät yksittäiset pisteet; kenttäkarsinta ei saa muuttaa osumajoukkoa.
- Dynaaminen aggregointi käyttää samoja normalisoituja suodatuskenttiä ja kohdistuu vasta aktiivisen suodatuksen tulokseen. Kaikki yksittäiset pisteet säilyvät arkistossa aggregointitilasta riippumatta.
- Jokaisen aluetason kaikki geometriset kohteet julkaistaan keskipisteinä zoomeilla 0–9 ja polygoneina zoomeilla 10–14. Zoomialueet eivät saa olla päällekkäisiä eikä niiden väliin saa jäädä aukkoa.
- Kohdepaneelin tiedot eivät saa kadota, vaikka ne siirretään pois MVT:stä.
