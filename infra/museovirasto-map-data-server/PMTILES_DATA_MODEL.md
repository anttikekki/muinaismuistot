# PMTiles-arkiston tietomalli

## Tarkoitus ja rajaus

Tämä dokumentti kuvaa 23.8.2026 rakennetun kompaktin PMTiles-PoC-arkiston toteutuneen MVT-skeeman kenttäkohtaisesti. Se erottaa nykyisen kompaktin skeeman sitä edeltäneestä leveästä vertailuskeemasta sekä kirjaa vielä avoimet tuotantotietomallin päätökset. Tiilissä pidetään vain kartan piirtämiseen, dynaamisiin tasovalintoihin ja arkeologisten pisteiden suodatukseen tarvittava tieto.

Kohdepaneelin näyttötiedot, sanahaku ja laajat raakakentät eivät lähtökohtaisesti kuulu MVT-tiiliin. Ne on tarkoitus palauttaa suppeasta hakuaineistosta tai valitun kohteen ominaisuustieto-endpointista. Rajaus perustuu tiedostossa [`FIELD_CONTRACT.md`](FIELD_CONTRACT.md) kuvattuun käyttöliittymän kenttäsopimukseen.

Toteutunut skeema on tarkistettu komennolla:

```bash
infra/museovirasto-map-data-server/data/tools/pmtiles show \
  --metadata \
  infra/museovirasto-map-data-server/data/poc/museovirasto-poc-compact.pmtiles
```

Arkistossa on 12 MVT `source-layer` -tasoa. `laji_key` ja `subtype_codes` ovat MVT-metadatan mukaan merkkijonoja; `type_mask` ja `dating_mask` ovat numeroita. Geometria ja MVT-feature-ID eivät näy `vector_layers.fields`-luettelossa.

## Tunnisteet ja geometria

| Osa | Nykyinen toteutus | Käyttö | Tavoite |
| --- | --- | --- | --- |
| Geometria | Piste- ja viivatasot säilyttävät geometriatyyppinsä; aluetasot ovat keskipisteitä zoomeilla 0–9 ja yksinkertaistettuja polygoneja zoomeilla 10–14 | piirtäminen, aggregointi ja osumatunnistus | säilytä zoomikohtainen esityssopimus |
| MVT-feature-ID | GeoPackagen `fid` kopioidaan välivaiheen `source_fid`-kenttään ja annetaan Tippecanoelle `--use-attribute-for-id=source_fid` | OpenLayers-featureen tunnistaminen | korvaa tuotantoputkessa version ja lähdetason huomioivalla dokumentoidulla tunnisteella |
| `source_fid`-ominaisuus | ei esiinny MVT-ominaisuutena | vain ID:n muodostus rakennuksessa | älä lisää ominaisuuskentäksi |
| `source-layer` | MVT-tason nimi, esimerkiksi `archaeological_points` | fyysinen tasovalinta ja tyylin valinta | säilytä rakenteena, ei erillisenä feature-kenttänä |

Nykyinen `source_fid` ei ole riittävän vakaa tuotantotunniste aineistoversioiden välillä. Tavoitetunnisteen tarkka esitys ratkaistaan ennen ominaisuustieto-endpointia. Kun selain voi hakea valitun kohteen tiedot MVT-feature-ID:n, lähdetason ja aineistoversion perusteella, `registry_id`-kenttää ei tarvitse toistaa jokaisessa tiilessä.

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

Validointiskripti tarkistaa tämän kenttäjoukon täsmällisesti. Ylimääräinen kenttä kompaktissa arkistossa keskeyttää validoinnin. Skeema on nykyisen PoC:n toteutunut minimimalli, mutta ei vielä hyväksytty tuotantoskeema, koska vakaa feature-ID ja ominaisuustieto-endpoint puuttuvat.

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
| `registry_id` | kaikki tasot | rekisteritunnuksen näyttö ja kohteen tunnistaminen | **Poistettu MVT:stä.** Tuotanto tarvitsee ennen käyttöönottoa vakaan MVT-feature-ID:n ja ominaisuustieto-endpointin. |
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

Kompakti PoC käyttää 19 päätyypille ja 12 ajoitukselle kokonaislukubittimaskeja. Arkeologisten pääkohteiden raakakentistä löytyvät 211 atomista alatyyppiä saavat versionoidut, järjestysnumerosta base36-muotoon muunnetut koodit. Featuren `subtype_codes` on pisteillä erotettu koodijoukko. Koodisto tuotetaan deterministisesti tiedostoon `poc/web/filter-vocabulary.json`; tuntematon arvo keskeyttää rakennuksen.

Jäsenyystesti on tyypeille ja ajoituksille täsmällinen bittitesti. Alatyyppikentän käyttäjälle näkyvä osajonohaku tehdään koodiston nimistä kerran suodattimen muuttuessa ja featureille testataan vain koodijäsenyys. Näin käyttöliittymän nykyinen osajonokäytös säilyy ilman pitkiä raakamerkkijonoja jokaisessa tiilifeaturessa.

Toteutunut skeema arkeologiselle pisteelle on:

```json
{
  "id": "MVT feature ID, ei ominaisuus",
  "laji_key": "kiintea_muinaisjaannos",
  "type_mask": 8,
  "subtype_codes": "c.20",
  "dating_mask": 16
}
```

Muille fyysisille tasoille ei tarvita ominaisuuskenttiä, jos niiden tyyli ja näkyvyys määräytyvät `source-layer`-tason perusteella ja klikkaus käyttää MVT-feature-ID:tä. Arkeologinen alue tarvitsee lisäksi `laji_key`-kentän, koska yksi fyysinen taso vastaa kahdeksaa loogista aluetasoa.

## Kompaktin mallin perustelut tasoittain

| MVT source-layer | Toteutuneet feature-ominaisuudet | Peruste |
| --- | --- | --- |
| `archaeological_points` | `laji_key`, `type_mask`, `subtype_codes`, `dating_mask` | looginen taso sekä tyyppi-, alatyyppi- ja ajoitussuodatus |
| `archaeological_areas` | `laji_key` | looginen taso |
| muut 10 tasoa | ei ominaisuuksia | `source-layer` määrää näkyvyyden ja tyylin; ID riittää ominaisuustietojen hakuun |

Tämä on nykyinen minimimalli. Mahdollinen `name` on ainoa perusteltu lisäkenttäehdokas, ja se hyväksytään vain erillisellä klikkausviiveen ja arkistokoon mittauksella.

## Mitattu vaikutus

Kompakti arkisto pienensi leveän 138 301 298 tavun arkiston ensin 54 762 752 tavuun. Aluetasojen zoomikohtaisen piste-/polygoni-esityksen jälkeen arkiston koko on 54 075 777 tavua. Kaikki viiden aluetason tietueet ovat keskipisteinä zoomilla 0; polygonit alkavat zoomilta 10. Pronssikautisten hautaröykkiöiden tulosjoukko pysyi täsmälleen 1 467 kohteessa.

Koko Suomen aloitusnäkymässä PMTiles Range -pyyntöjen määrä säilyi kuudessa ja siirretty määrä pieneni 4 535 650 tavusta 835 056 tavuun eli noin 81,6 prosenttia. Kenttien tiivistämisen jälkeen pahimman suodattamattoman näkymän pullonkaula on yli 200 000 vektorifeaturen selainrenderöinti, ei PMTiles-siirto.

Seuraava tietomalliin liittyvä työ on vakaan, aineistoversion ja lähdetason huomioivan feature-ID:n määrittely sekä sitä käyttävän ominaisuustieto-endpointin kokeilu. Kohteen nimiä tai muita näyttökenttiä ei palauteta MVT:hen ilman mitattua tarvetta.

## Hyväksymissäännöt

- PMTiles-metadatan kenttäjoukon pitää vastata versionhallittua kompaktia skeemaa; ylimääräinen kenttä estää julkaisun.
- Raakamuotoisia moniarvokenttiä ei julkaista tuotanto-MVT:ssä.
- Karttatyylin tai aktiivisen suodatuksen tarvitsemaa kenttää ei saa poistaa.
- Suodatettu koko Suomen näkymä näyttää kaikki ehdot täyttävät yksittäiset pisteet; kenttäkarsinta ei saa muuttaa osumajoukkoa.
- Dynaaminen aggregointi käyttää samoja normalisoituja suodatuskenttiä ja kohdistuu vasta aktiivisen suodatuksen tulokseen. Kaikki yksittäiset pisteet säilyvät arkistossa aggregointitilasta riippumatta.
- Jokaisen aluetason kaikki geometriset kohteet julkaistaan keskipisteinä zoomeilla 0–9 ja polygoneina zoomeilla 10–14. Zoomialueet eivät saa olla päällekkäisiä eikä niiden väliin saa jäädä aukkoa.
- Kohdepaneelin tiedot eivät saa kadota, vaikka ne siirretään pois MVT:stä.
