# Nykyisen käyttöliittymän kenttäsopimus

## Rajaus

Tämä dokumentti kuvaa, mitä Museovirasto-aineiston kenttiä nykyinen sivusto käyttää karttaklikkauksessa, sanahaussa, suodatuksessa ja kohdepaneeleissa. Lisäksi se määrittää, miten nämä tarpeet siirretään GeoPackage-pohjaiseen PMTiles-, haku- ja ominaisuustietomalliin.

Nykyinen sopimus ei ole eksplisiittinen rajapintaskeema. Se muodostuu `MuseovirastoTileLayer`-luokan WMS/WFS-pyynnöistä, `museovirasto.types.ts`-tyypeistä, `featureParser.ts`-apufunktioista ja React-kohdepaneeleista. Osa tyypeistä kuvaa vanhaa WMS/WFS-rakennetta eikä nykyistä GeoPackage-skeemaa täsmällisesti.

## Nykyiset tietovirrat

| Toiminto | Nykyinen lähde | Vastaus ja kenttien käyttö |
| --- | --- | --- |
| Kartan piirto | WMS `GetMap` | rasterikuva; selain ei saa ominaisuuskenttiä |
| Karttaklikkaus | WMS `GetFeatureInfo`, `INFO_FORMAT=application/json` | GeoJSON FeatureCollection, enintään 100 kohdetta, 15 px puskuri |
| Tekstihaku | yksi WFS `GetFeature` jokaista valittua loogista tasoa kohti | täydet GeoJSON-kohteet, enintään 50 tulosta per taso |
| Tyyppi- ja ajoitussuodatus | WMS `CQL_FILTER` | vain kahdeksan arkeologisen pistetason `tyyppi`- ja `ajoitus`-kentät |
| Kohdepaneeli | klikkauksen tai haun täydet GeoJSON-kohteet | nimi-, tunniste-, luokittelu-, kunta- ja linkkikentät sekä geometria |

`GetFeatureInfo`- ja WFS-vastauksen `Feature.id` on nykyisessä ratkaisussa toiminnallisesti pakollinen. Uudessa toteutuksessa saman aineistojulkaisun geometriarivi yksilöidään yhdistelmällä `sourceLayer + fid`. Julkaisujen välillä pysyvä identiteetti on `logicalLayerId + registryId`, joka voi vastata useita geometriarivejä.

Karttaklikkaus ei valitse vain päällimmäistä kohdetta. Nykyinen käyttöliittymä avaa sivupaneeliin listan kaikista klikkaustoleranssin sisällä olevista, näkyviin tasoihin kuuluvista päällekkäisistä kohteista. Uusi ominaisuustietorajapinta on siksi massahaku, ei yhtä featurea palveleva endpoint. Selain kerää ensin MVT-osumien `sourceLayer`- ja `featureId`-parit, deduplikoi ne ja tekee yhden pyynnön.

PoC:n tavoitesopimus on:

```http
POST /api/features/batch
Content-Type: application/json
```

```json
{
  "features": [
    { "sourceLayer": "archaeological_points", "featureId": "123" },
    { "sourceLayer": "archaeological_areas", "featureId": "456" }
  ]
}
```

Vastaus säilyttää ensimmäisen esiintymän mukaisen pyyntöjärjestyksen ja palauttaa käyttöliittymälle kaikki löytyneet kohteet yhdellä kertaa:

```json
{
  "features": [
    {
      "sourceLayer": "archaeological_points",
      "featureId": "123",
      "logicalLayerId": "rajapinta_suojellut:muinaisjaannos_piste",
      "properties": {}
    }
  ],
  "missing": []
}
```

Pyyntö rajataan enintään 100 yksilölliseen kohteeseen nykyisen `GetFeatureInfo`-rajan mukaisesti. Worker validoi sallitut lähdetasot, tunnisteen muodon, JSON-rakenteen ja rungon koon. D1-haku tehdään yhtenä parametrisoituna kyselynä, ei erillisenä kyselynä jokaista osumaa kohti. MVT:stä saatu geometria pidetään selaimessa ja yhdistetään massahaun näyttötietoihin sovitinkerroksessa; samaa geometriaa ei tarvitse palauttaa D1:stä vain kohdepaneelia varten.

Aggregaattimerkki ei ole rekisterikohde eikä sitä lähetetä massahakuun. Sen valinta zoomaa tai rajaa karttaa lähemmäs, kunnes yksittäiset kohteet voidaan tunnistaa.

## Nykyisen haun kenttäsopimus

Tekstihaku käyttää kirjainkoosta riippumatonta `ILIKE '%teksti%'` -ehtoa seuraaviin lähdekenttiin:

| Tasoryhmä | Nimikenttä |
| --- | --- |
| Arkeologiset kohteet ja alakohteet | `kohdenimi` |
| RKY | `kohdenimi` |
| Suojellut rakennukset | `kohdenimi` |
| Maailmanperintöpiste | `nimi` |
| Maailmanperintöalue | `Nimi` |
| VARK | `VARK_nimi` |

Jos `parseInt` tulkitsee haun numeroksi, käytetään tekstin sijasta tunnistekenttää:

| Tasoryhmä | Numeerisen haun kenttä |
| --- | --- |
| Arkeologiset kohteet ja alakohteet | `mjtunnus` |
| RKY | `ID` |
| Suojellut rakennukset | `KOHDEID` |
| VARK | `VARK_ID` |
| Maailmanperintö | ei numeerista hakua |

Arkeologisten kiinteiden muinaisjäännösten alue jätetään nykyisestä hausta pois pisteen kanssa samannimisenä, mutta muiden piste-/alueparien deduplikointi on puutteellinen. Haku voi tehdä jopa 26 hidasta WFS-pyyntöä ja palauttaa saman rekisterikohteen useita geometrioita.

Uuden `/api/search`-vastauksen vähimmäiskentät ovat:

- `registryId`;
- `logicalLayerId` ja `sourceLayer`;
- `name` sekä tarvittaessa `municipality`;
- `geometryCount`, joka kertoo hakuehtoon osuneiden, samaan loogiseen tasoon ja rekisteritunnukseen kuuluvien lähderivien määrän. Kohdetta avattaessa rekisteritunnushaku palauttaa kaikki sen nykyiset geometriarivit.

`GET /api/search?q=...` hyväksyy 3–100 Unicode-merkkiä. Haku kohdistuu kirjainkoosta riippumattomasti NFC-normalisoituun nimeen sekä osittain rekisteritunnukseen. Käyttäjän teksti välitetään vain parametrina, ja SQL `LIKE` -jokerimerkit käsitellään kirjaimellisina. Vastaus sisältää enintään 50 yhdistelmällä `logicalLayerId + registryId` ryhmiteltyä tulosta sekä `truncated`-lipun. Haku palauttaa aina nykyisen D1-aineiston eikä käytä aineistoversiota.

## Klikkauksen ja käyttöliittymän kentät

Seuraavat kentät ovat nykyisten näkymien kannalta merkityksellisiä. Lähteen kirjainkoko normalisoidaan uudessa API:ssa; raakakentän nimi on esitetty sulkeissa.

| Kohderyhmä | Käyttöliittymän tarvitsemat kentät |
| --- | --- |
| Arkeologinen piste ja alakohde | `registryId` (`mjtunnus`), alakohteella `subsiteId` (`alakohdetunnus`), `name` (`kohdenimi`), `municipality` (`kunta`), `kind` (`Laji`/`laji`), tyypit, alatyypit, ajoitukset, rekisterilinkki ja geometria |
| Arkeologinen alue | `registryId`, `name`, `municipality`, `kind`, rekisterilinkki ja geometria; lähteessä on nykyisin myös tyyppi-, alatyyppi- ja ajoitustiedot vaikka vanha TypeScript-tyyppi ei niitä kuvaa |
| RKY | `registryId` (`ID`), `name` (`kohdenimi`), alueella `partName` (`nimi`), `url` ja geometria |
| Suojellut rakennukset | `registryId` (`KOHDEID`), `name` (`kohdenimi`), pisteellä `buildingId` ja `buildingName`, `municipality` (`Kunta` GeoPackagessa), suojeluryhmä, `url` ja geometria |
| Maailmanperintö | `registryId` (`ID`; nykykoodi käyttää virheellisesti/vanhentuneesti `OBJECTID`-kenttää), `name` (`nimi`/`Nimi`), `areaType` (`aluetyyppi`), `url` (`url`/`URL`) ja geometria |
| VARK | `registryId` (`VARK_ID`), `name` (`VARK_nimi`), kunta, maakunta, tyypit, alatyypit, ajoitukset, liittyvien muinaisjäännösten nimet ja tunnukset, `Linkki` ja geometria |

Nykyinen `getFeatureUniqueLayerID` käyttää useimmille WMS-tasoille `OBJECTID`-kenttää. GeoPackage-sovitin palauttaa sen vastineena `fid`-pääavaimen. Arvo erottaa saman rekisteritunnuksen geometriarivit nykyisessä vastauksessa, mutta sen ei tarvitse säilyä samana aineistojulkaisusta toiseen. Pysyvä linkki käyttää vain loogista tasoa ja rekisteritunnusta.

## Tyyppi- ja ajoitussuodattimet

Nykyinen suodatus koskee vain arkeologisia pistetasoja. Se muodostaa valituista enum-arvoista osajonovertailuja:

```text
ajoitus LIKE '%kivikautinen%'
tyyppi LIKE '%asuinpaikat%'
```

Pisteet hyväksytään, jos ne osuvat vähintään yhteen valittuun ajoitukseen ja vähintään yhteen valittuun tyyppiin. Alueita ei suodateta; käyttöliittymän käännöskin kertoo rajoituksen toimivan vain pisteille. Tyhjät valinnat tuottavat pistetasoille `EXCLUDE`-ehdon. Muiden loogisten tasojen suodatin on `INCLUDE`.

Osajonovertailu ei ole täsmällinen arvojoukkotesti. Uudessa toteutuksessa suodatus tehdään normalisoiduilla täsmällisillä avaimilla. Koska MVT-attribuutti ei tue merkkijonotaulukkoa, PoC:ssa valitaan ja mitataan jompikumpi seuraavista esityksistä:

- rajatulla arvojoukolla tyyppi- ja ajoitusbitit erillisinä bittimaskeina; tai
- turvallisella erottimella koodattu avainjoukko ja täsmällisen jäsenyyden tarkistus.

Raakakenttä ei ole suodatuksen lähde. Nykyinen käyttäytyminen säilytetään ensivaiheessa eli suodatus kohdistuu vain arkeologisiin pisteisiin, ellei käyttöliittymäpäätöksellä erikseen laajenneta sitä alueisiin.

## Moniarvokenttien analyysi

### Nykyinen pilkkominen

`splitMuinaisjaannosTyyppi`, `splitMuinaisjaannosAlatyyppi` ja `splitMuinaisjaannosAjoitus` tekevät pääosin `trim(value).split(", ")` -operaation. Koodissa on vain kaksi käsin tehtyä suojausta:

- `taide, muistomerkit` tyypissä;
- `rajamerkit, puu` alatyypissä.

Tyhjät arvopaikat eivät poistu. `List` renderöi myös tyhjät merkkijonot, jos tuloksessa on useita alkioita. `ei määritelty` poistetaan alatyyppi- ja ajoituslistasta silloin, kun listassa on muitakin alkioita. VARK:n `Tyyppi` ja `Alatyyppi` käsitellään samalla yleisellä pilkkomisella; `Ajoitus` ja `Ajoitus2` yhdistetään.

### Vertailu tuotantoaineistoon

Arkeologisten pääaineistojen `tyyppi`- ja `alatyyppi`-kentät sisältävät neljä pilkuilla erotettua arvopaikkaa ja tyhjiä paikkoja. Pilkku kuuluu myös käsitteeseen `taide, muistomerkit`. Alakohdeaineistossa tyyppi ja alatyyppi ovat yksiarvoisia. Nykyinen kahden käsitteen poikkeuslista toimii vain tämänhetkisille tunnetuille esimerkeille eikä muodosta kestävää parseria.

Pelkkä pilkkujako ei siis ole hyväksyttävä rakennusputken normalisointi. Sopimus on:

1. Säilytä lähteen `typesRaw`, `subtypesRaw` ja `datingsRaw` jäljitettävyyttä varten ominaisuustietoaineistossa.
2. Muodosta rakennusvaiheessa `typeKeys`, `subtypeKeys` ja `datingKeys` lähteen arvojoukon tuntevalla parserilla. Poista tyhjät arvopaikat ja deduplikoi järjestys säilyttäen.
3. Älä päättele käsiterajoja pelkästä pilkusta. Parseri käyttää inventoituja yksiarvoisia alakohdearvoja ja versionhallittua arvosanakarttaa; tuntematon tai monitulkintainen yhdistelmä säilyy raakamuodossa ja aiheuttaa raportin.
4. API palauttaa listat oikeina JSON-taulukkoina. Käyttöliittymä ei enää pilko raakamerkkijonoja.
5. Suodatus käyttää vain normalisoituja avaimia ja täsmällistä jäsenyyttä.

`suojeluryhmä` on vastaava nelipaikkainen moniarvokenttä. Se säilytetään raakamuodossa ja normalisoidaan `protectionGroups`-taulukoksi samalla periaatteella ennen käyttöliittymässä näyttämistä.

## Normalisoitu rajapintasopimus

Kaikille kohteille yhteinen vähimmäismalli on:

```json
{
  "datasetVersion": "sha256:…",
  "featureKey": "stable-internal-key",
  "sourceLayer": "archaeological_points",
  "logicalLayerId": "rajapinta_suojellut:muinaisjaannos_piste",
  "registry": "archaeological_sites",
  "registryId": "1279",
  "name": "Melkki länsiranta",
  "municipality": "Helsinki",
  "geometry": {},
  "properties": {}
}
```

MVT-tiileen sisällytetään vain renderöinnin, näkyvyysvalinnan, pisteiden nykyisen tyyppi-/ajoitussuodatuksen ja klikkauksen avaimen tarvitsemat kentät:

- `feature_key`, `logical_layer` tai sen johtamiseen tarvittava `laji_key`;
- `registry_id` ja tarvittaessa `name`;
- arkeologisille pisteille normalisoitu tyyppi- ja ajoitussuodatusarvo;
- tuntemattoman luokittelun ilmaiseva arvo, jotta kohde ei katoa hiljaisesti.

Laajat näyttökentät ja raakamuodot palautetaan `/api/features/:id`-vastauksessa. Klikkaus lukee ensin MVT-kohteen avaimen ja hakee tiedot vain avattavaa kohdepaneelia varten. PoC:ssa mitataan, onko nimi syytä pitää tiilessä välittömän palautteen vuoksi.

## Havaitut nykykoodin poikkeamat

- `isLuonnonmuodostumaAlueFeature` tarkistaa virheellisesti pisteen `rajapinta_luonnonmuodostuma_piste.`-alkua. Nykyinen luonnonmuodostuma-alue voi siksi jäädä tunnistamatta käyttöliittymässä.
- Maailmanperintökohteen rekisteri- ja yksilöintilogiikka olettaa `OBJECTID`-kentän, mutta nykyisissä GeoPackage-tasoissa tunniste on `ID`.
- Suojeltujen rakennusten TypeScript-tyyppi ja paneeli käyttävät `kunta`-nimeä, kun GeoPackage-kenttä on `Kunta`.
- Arkeologisen alueen vanha TypeScript-tyyppi ei sisällä nykyisessä GeoPackagessa olevia `tyyppi`, `alatyyppi` ja `ajoitus` -kenttiä.
- Numeerisen haun tunnistus hyväksyy `parseInt`-logiikan vuoksi myös osittain numeerisen tekstin. Tekstihaku sijoittaa käyttäjän syötteen suoraan CQL-merkkijonoon.
- WFS-haku palauttaa täydet geometriat ja ominaisuudet, vaikka tuloslistaus tarvitsee vain suppean yhteenvedon.

Näitä poikkeamia ei korjata vanhaan WMS/WFS-polkuun tässä vaiheessa. Ne toimivat uuden rajapinnan regressiotesteinä ja migraation hyväksymiskriteereinä.

## Koneellinen validointi

Nykyisen tuotantoaineiston sopimuksen kannalta pakolliset lähdekentät tarkistetaan komennolla:

```bash
infra/museovirasto-map-data-server/scripts/07-validate-field-contract.sh
```

Validointi estää jatkotyön hiljaisella skeemapoikkeamalla, jos tunniste-, nimi-, loogisen tason, nykyisten kohdepaneelien tai suodatuksen tarvitsema kenttä katoaa.
