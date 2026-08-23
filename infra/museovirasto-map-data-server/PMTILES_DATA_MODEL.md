# PMTiles-arkiston tietomalli

## Tarkoitus ja rajaus

Tämä dokumentti kuvaa 23.8.2026 rakennetun PMTiles-PoC-arkiston toteutuneen MVT-skeeman kenttäkohtaisesti ja määrittää tavoiteskeeman. Tavoite on pitää tiilissä vain kartan piirtämiseen, dynaamisiin tasovalintoihin, nykyiseen arkeologisten pisteiden suodatukseen ja kohteen yksilöintiin tarvittava tieto.

Kohdepaneelin näyttötiedot, sanahaku ja laajat raakakentät eivät lähtökohtaisesti kuulu MVT-tiiliin. Ne on tarkoitus palauttaa suppeasta hakuaineistosta tai valitun kohteen ominaisuustieto-endpointista. Rajaus perustuu tiedostossa [`FIELD_CONTRACT.md`](FIELD_CONTRACT.md) kuvattuun käyttöliittymän kenttäsopimukseen.

Toteutunut skeema on tarkistettu komennolla:

```bash
infra/museovirasto-map-data-server/data/tools/pmtiles show \
  --metadata \
  infra/museovirasto-map-data-server/data/poc/museovirasto-poc.pmtiles
```

Arkistossa on 12 MVT `source-layer` -tasoa. Kaikki varsinaiset ominaisuuskentät ovat MVT-metadatan mukaan merkkijonoja. Geometria ja MVT-feature-ID eivät näy `vector_layers.fields`-luettelossa.

## Tunnisteet ja geometria

| Osa | Nykyinen toteutus | Käyttö | Tavoite |
| --- | --- | --- | --- |
| Geometria | MVT-geometria, zoomin mukaan yksinkertaistettu | piirtäminen ja osumatunnistus | säilytä |
| MVT-feature-ID | GeoPackagen `fid` kopioidaan välivaiheen `source_fid`-kenttään ja annetaan Tippecanoelle `--use-attribute-for-id=source_fid` | OpenLayers-featureen tunnistaminen | korvaa tuotantoputkessa version ja lähdetason huomioivalla dokumentoidulla tunnisteella |
| `source_fid`-ominaisuus | ei esiinny MVT-ominaisuutena | vain ID:n muodostus rakennuksessa | älä lisää ominaisuuskentäksi |
| `source-layer` | MVT-tason nimi, esimerkiksi `archaeological_points` | fyysinen tasovalinta ja tyylin valinta | säilytä rakenteena, ei erillisenä feature-kenttänä |

Nykyinen `source_fid` ei ole riittävän vakaa tuotantotunniste aineistoversioiden välillä. Tavoitetunnisteen tarkka esitys ratkaistaan ennen ominaisuustieto-endpointia. Kun selain voi hakea valitun kohteen tiedot MVT-feature-ID:n, lähdetason ja aineistoversion perusteella, `registry_id`-kenttää ei tarvitse toistaa jokaisessa tiilessä.

## Toteutunut tasokohtainen skeema

`ID` tarkoittaa MVT-feature-ID:tä, ei ominaisuuskenttää.

| MVT source-layer | Geometria | Tietueita | Toteutuneet ominaisuuskentät |
| --- | --- | ---: | --- |
| `archaeological_areas` | Polygon | 86 702 | `registry_id`, `name`, `municipality`, `laji_key`, `types_raw`, `subtypes_raw`, `datings_raw` |
| `archaeological_points` | Point | 112 441 | `registry_id`, `name`, `municipality`, `laji_key`, `types_raw`, `subtypes_raw`, `datings_raw` |
| `archaeological_subsites_points` | Point | 63 216 | `registry_id`, `subsite_id`, `name`, `subsite_name`, `municipality`, `laji_key`, `types_raw`, `subtypes_raw`, `datings_raw` |
| `protected_building_areas` | Polygon | 138 | `registry_id`, `name`, `municipality`, `protection_groups_raw`, `protection_status` |
| `protected_building_points` | Point | 2 290 | `registry_id`, `building_id`, `name`, `building_name`, `municipality`, `protection_groups_raw`, `protection_status` |
| `rky_areas` | Polygon | 1 851 | `registry_id`, `name`, `part_name` |
| `rky_lines` | LineString | 186 | `registry_id`, `name` |
| `rky_points` | Point | 64 | `registry_id`, `name` |
| `vark_areas` | Polygon | 1 010 | `registry_id`, `name`, `municipality`, `types_raw`, `subtypes_raw`, `datings_raw` |
| `vark_points` | Point | 1 010 | `registry_id`, `name`, `municipality`, `types_raw`, `subtypes_raw`, `datings_raw` |
| `world_heritage_areas` | Polygon | 50 | `registry_id`, `name`, `area_type` |
| `world_heritage_points` | Point | 6 | `registry_id`, `name` |

Tämä on PoC:n nykytila, ei hyväksytty tuotantoskeema.

## Kenttäkohtainen arvio

| Kenttä | Nykyiset tasot | Nykyinen käyttötarkoitus PoC:ssa | Päätös tavoiteskeemaan |
| --- | --- | --- | --- |
| `laji_key` | arkeologiset alueet, pisteet ja alakohteet | jakaa kaksi fyysistä pääkohdetasoa kahdeksaan loogiseen tasoon ja valitsee tyylin | **Säilytä pääkohteiden pisteillä ja alueilla.** Poista alakohteilta, joiden nykyinen looginen taso ja tähtityyli eivät riipu lajista. Tuntematon arvo säilytetään `unknown`-arvona. |
| `types_raw` | arkeologiset tasot ja VARK | kohdepaneelin näyttö; PoC:ssa mahdollinen väliaikainen selainfiltteri | **Korvaa arkeologisilla pisteillä kompaktilla normalisoidulla suodatusarvolla.** Poista muilta tasoilta MVT:stä. Säilytä raakamuoto ominaisuustietoaineistossa. |
| `subtypes_raw` | arkeologiset tasot ja VARK | kohdepaneelin näyttö; käyttäjän tutkimuskäyttötapa tarvitsee arkeologisten pisteiden alatyyppisuodatuksen, vaikka nykyinen sivusto ei muodosta siitä CQL-ehtoa | **Korvaa arkeologisilla pisteillä kompaktilla normalisoidulla suodatusarvolla.** Poista muilta tasoilta MVT:stä ja säilytä raakamuoto ominaisuustietoaineistossa. |
| `datings_raw` | arkeologiset tasot ja VARK | kohdepaneelin näyttö; arkeologisten pisteiden ajoitussuodatus | **Korvaa arkeologisilla pisteillä kompaktilla normalisoidulla suodatusarvolla.** Poista muilta tasoilta MVT:stä. Säilytä raakamuoto ominaisuustietoaineistossa. |
| `registry_id` | kaikki tasot | rekisteritunnuksen näyttö ja kohteen tunnistaminen | **Poista MVT:stä**, kun vakaa MVT-feature-ID ja ominaisuustieto-endpoint toimivat. Pidä siihen asti PoC:ssa klikkauksen tarkistusta varten. |
| `name` | kaikki tasot | PoC näyttää nimen heti karttaklikkauksessa | **Poista MVT:stä** ja hae ominaisuustieto-endpointista. Mittaa ensin, onko endpointin viive hyväksyttävä; nimi voidaan pitää vain, jos välitön klikkauspalaute sitä edellyttää. |
| `municipality` | arkeologiset tasot, VARK ja suojellut rakennukset | kohdepaneelin näyttö | **Poista MVT:stä.** Ei vaikuta piirtämiseen tai nykyiseen karttasuodatukseen. |
| `subsite_id` | arkeologiset alakohteet | alakohteen yksilöinti ja näyttö | **Poista ominaisuutena**, kun MVT-feature-ID yksilöi alakohteen. Säilytä ominaisuustietoaineistossa. |
| `subsite_name` | arkeologiset alakohteet | kohdepaneelin näyttö | **Poista MVT:stä.** |
| `building_id` | suojeltujen rakennusten pisteet | rakennuksen yksilöinti ja näyttö | **Poista ominaisuutena**, kun MVT-feature-ID yksilöi rakennuksen. Säilytä ominaisuustietoaineistossa. |
| `building_name` | suojeltujen rakennusten pisteet | kohdepaneelin näyttö | **Poista MVT:stä.** |
| `protection_groups_raw` | suojeltujen rakennusten pisteet ja alueet | kohdepaneelin näyttö | **Poista MVT:stä.** Säilytä ja normalisoi ominaisuustietoaineistossa. |
| `protection_status` | suojeltujen rakennusten pisteet ja alueet | kohdepaneelin näyttö | **Poista MVT:stä**, ellei siitä myöhemmin tehdä karttatyyliä tai suodatinta. |
| `part_name` | RKY-alueet | alueosan näyttönimi | **Poista MVT:stä.** |
| `area_type` | maailmanperintöalueet | kohdepaneelin näyttö | **Poista MVT:stä.** |

## Suodatuskenttien tavoite-esitys

Nykyisiä `types_raw`, `subtypes_raw` ja `datings_raw` -merkkijonoja ei pidä lukita tuotantotiiliin. Ne ovat pitkiä, sisältävät tyhjiä arvopaikkoja ja vaativat selaimessa lähdeaineiston rakennetta tuntevan parserin.

Arkeologisten pisteiden seuraavassa PoC:ssa tarvitaan käyttäjän kuvaaman kaltaiset yhdistelmät, esimerkiksi:

```text
laji_key = kiintea_muinaisjaannos
dating = pronssikausi
type = hautaroykkio
```

Tavoitevaihtoehdot ovat:

1. versionhallittuun arvojoukkoon perustuvat bittimaskit, jos arvojen määrä mahtuu selaimessa turvallisesti käsiteltävään kokonaislukuun; tai
2. lyhyiden numeeristen koodien erotinmerkillä rajattu jäsenjoukko.

Ratkaisu valitaan mittaamalla todelliset arvojoukot ja MVT-koko. Molemmissa vaihtoehdoissa jäsenyystestin pitää olla täsmällinen; raakamerkkijonon osajonohakua ei käytetä lopullisessa toteutuksessa.

Alustava tavoiteskeema arkeologiselle pisteelle on:

```json
{
  "id": "MVT feature ID, ei ominaisuus",
  "laji_key": "kiintea_muinaisjaannos",
  "type_filter": "kompakti normalisoitu jäsenjoukko",
  "subtype_filter": "kompakti normalisoitu jäsenjoukko",
  "dating_filter": "kompakti normalisoitu jäsenjoukko"
}
```

Muille fyysisille tasoille ei tarvita ominaisuuskenttiä, jos niiden tyyli ja näkyvyys määräytyvät `source-layer`-tason perusteella ja klikkaus käyttää MVT-feature-ID:tä. Arkeologinen alue tarvitsee lisäksi `laji_key`-kentän, koska yksi fyysinen taso vastaa kahdeksaa loogista aluetasoa.

## Tavoitemalli tasoittain

| MVT source-layer | Tavoitteen feature-ominaisuudet | Peruste |
| --- | --- | --- |
| `archaeological_points` | `laji_key`, `type_filter`, `subtype_filter`, `dating_filter` | looginen taso sekä tyyppi-, alatyyppi- ja ajoitussuodatus |
| `archaeological_areas` | `laji_key` | looginen taso |
| muut 10 tasoa | ei ominaisuuksia | `source-layer` määrää näkyvyyden ja tyylin; ID riittää ominaisuustietojen hakuun |

Tämä on minimimalli. Mahdollinen `name` on ainoa perusteltu lisäkenttäehdokas, ja se hyväksytään vain erillisellä klikkausviiveen ja arkistokoon mittauksella.

## Vaikutus nykyiseen PoC:iin

Nykyistä leveää arkistoa käytetään vielä seuraavassa selainfiltterikokeessa, koska normalisoituja suodatuskenttiä ei ole muodostettu. Se mahdollistaa todellisen käyttötapauksen todentamisen ennen tietomallin kaventamista. Raakakenttien säilyttäminen tässä välivaiheessa ei tarkoita, että ne hyväksytään tuotantoon.

Seuraavat toteutusaskeleet ovat:

1. vahvista nykyisen käyttöliittymän todelliset tyyppi-, alatyyppi- ja ajoitussuodattimet;
2. muodosta normalisoidut suodatusavaimet versionhallittujen arvojoukkojen perusteella;
3. rakenna nykyisestä ja tavoiteskeemasta muuten identtiset PMTiles-arkistot;
4. vertaa arkiston kokoa, koko Suomen Range-siirtoa, MVT:n purkuaikaa ja renderöintinopeutta;
5. poista kenttä vain, kun sen korvaava tunniste-, haku- tai ominaisuustietopolku on testattu.

## Hyväksymissäännöt

- PMTiles-metadatan kenttäjoukon pitää vastata versionhallittua tavoiteskeemaa; ylimääräinen kenttä estää julkaisun.
- Raakamuotoisia moniarvokenttiä ei julkaista tuotanto-MVT:ssä.
- Karttatyylin tai aktiivisen suodatuksen tarvitsemaa kenttää ei saa poistaa.
- Suodatettu koko Suomen näkymä näyttää kaikki ehdot täyttävät yksittäiset pisteet; kenttäkarsinta ei saa muuttaa osumajoukkoa.
- Dynaaminen aggregointi käyttää samoja normalisoituja suodatuskenttiä ja kohdistuu vasta aktiivisen suodatuksen tulokseen. Kaikki yksittäiset pisteet säilyvät arkistossa aggregointitilasta riippumatta.
- Kohdepaneelin tiedot eivät saa kadota, vaikka ne siirretään pois MVT:stä.
