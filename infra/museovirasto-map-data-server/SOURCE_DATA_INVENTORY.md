# Museoviraston lähdeaineiston GeoPackage-inventaario

Tämä tiedosto on generoitu komennolla:

```bash
infra/museovirasto-map-data-server/scripts/01-inventory-geopackages.sh
```

Lähde: `tutkija.zip`

GeoPackage-tiedostoja: 12

## `VARK_aluerajaukset.gpkg`

### `VARK_aluerajaukset`

- Tietueita: 1010
- Geometriatyyppi: `GEOMETRY`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `GEOMETRY` | ei | `-` | ei |
| `VARK_ID` | `MEDIUMINT` | ei | `-` | ei |
| `VARK_nimi` | `TEXT` | ei | `-` | ei |
| `Mj_kohde` | `TEXT` | ei | `-` | ei |
| `Mj_kohde2` | `TEXT` | ei | `-` | ei |
| `MJ_kohde3` | `TEXT` | ei | `-` | ei |
| `Mj_tunnus` | `TEXT` | ei | `-` | ei |
| `Mj_tunnus2` | `TEXT` | ei | `-` | ei |
| `Kohde_lkm` | `MEDIUMINT` | ei | `-` | ei |
| `Ajoitus` | `TEXT` | ei | `-` | ei |
| `Ajoitus2` | `TEXT` | ei | `-` | ei |
| `Tyyppi` | `TEXT` | ei | `-` | ei |
| `Alatyyppi` | `TEXT` | ei | `-` | ei |
| `Poikkeava` | `TEXT` | ei | `-` | ei |
| `Pinta_ala` | `REAL` | ei | `-` | ei |
| `Kunta` | `TEXT` | ei | `-` | ei |
| `Maakunta` | `TEXT` | ei | `-` | ei |
| `Alva_museo` | `TEXT` | ei | `-` | ei |
| `Luontipvm` | `TEXT` | ei | `-` | ei |
| `Digipvm` | `TEXT` | ei | `-` | ei |
| `Muutospvm` | `TEXT` | ei | `-` | ei |
| `Linkki` | `TEXT` | ei | `-` | ei |

## `VARK_keskipisteet.gpkg`

### `VARK_keskipisteet`

- Tietueita: 1010
- Geometriatyyppi: `POINT`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `POINT` | ei | `-` | ei |
| `VARK_ID` | `MEDIUMINT` | ei | `-` | ei |
| `VARK_nimi` | `TEXT` | ei | `-` | ei |
| `Mj_kohde` | `TEXT` | ei | `-` | ei |
| `Mj_kohde2` | `TEXT` | ei | `-` | ei |
| `MJ_kohde3` | `TEXT` | ei | `-` | ei |
| `Mj_tunnus` | `TEXT` | ei | `-` | ei |
| `Mj_tunnus2` | `TEXT` | ei | `-` | ei |
| `Kohde_lkm` | `MEDIUMINT` | ei | `-` | ei |
| `Ajoitus` | `TEXT` | ei | `-` | ei |
| `Ajoitus2` | `TEXT` | ei | `-` | ei |
| `Tyyppi` | `TEXT` | ei | `-` | ei |
| `Alatyyppi` | `TEXT` | ei | `-` | ei |
| `Poikkeava` | `TEXT` | ei | `-` | ei |
| `Kunta` | `TEXT` | ei | `-` | ei |
| `Maakunta` | `TEXT` | ei | `-` | ei |
| `Alva_museo` | `TEXT` | ei | `-` | ei |
| `Luontipvm` | `TEXT` | ei | `-` | ei |
| `Digipvm` | `TEXT` | ei | `-` | ei |
| `Muutospvm` | `TEXT` | ei | `-` | ei |
| `Linkki` | `TEXT` | ei | `-` | ei |

## `arkeologiset_kohteet_alakohteet_piste.gpkg`

### `arkeologiset_kohteet_alakohteet_piste`

- Tietueita: 63216
- Geometriatyyppi: `POINT`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `POINT` | ei | `-` | ei |
| `mjtunnus` | `MEDIUMINT` | ei | `-` | ei |
| `alakohdetunnus` | `MEDIUMINT` | ei | `-` | ei |
| `inspireID` | `TEXT` | ei | `-` | ei |
| `kohdenimi` | `TEXT` | ei | `-` | ei |
| `alakohdenimi` | `TEXT` | ei | `-` | ei |
| `kunta` | `TEXT` | ei | `-` | ei |
| `laji` | `TEXT` | ei | `-` | ei |
| `tyyppi` | `TEXT` | ei | `-` | ei |
| `alatyyppi` | `TEXT` | ei | `-` | ei |
| `ajoitus` | `TEXT` | ei | `-` | ei |
| `vedenalainen` | `TEXT` | ei | `-` | ei |
| `luontipvm` | `DATETIME` | ei | `-` | ei |
| `muutospvm` | `DATETIME` | ei | `-` | ei |
| `paikannustapa` | `TEXT` | ei | `-` | ei |
| `paikannustarkkuus` | `TEXT` | ei | `-` | ei |
| `selite` | `TEXT` | ei | `-` | ei |
| `url` | `TEXT` | ei | `-` | ei |
| `x` | `REAL` | ei | `-` | ei |
| `y` | `REAL` | ei | `-` | ei |

## `arkeologiset_kohteet_alue_t.gpkg`

### `arkeologiset_kohteet_alue_t`

- Tietueita: 86703
- Geometriatyyppi: `POLYGON`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `POLYGON` | ei | `-` | ei |
| `mjtunnus` | `MEDIUMINT` | ei | `-` | ei |
| `inspireID` | `TEXT` | ei | `-` | ei |
| `kohdenimi` | `TEXT` | ei | `-` | ei |
| `kunta` | `TEXT` | ei | `-` | ei |
| `Laji` | `TEXT` | ei | `-` | ei |
| `tyyppi` | `TEXT` | ei | `-` | ei |
| `alatyyppi` | `TEXT` | ei | `-` | ei |
| `ajoitus` | `TEXT` | ei | `-` | ei |
| `vedenalainen` | `TEXT` | ei | `-` | ei |
| `lähdetiedon_ajoitus` | `TEXT` | ei | `-` | ei |
| `luontipvm` | `DATETIME` | ei | `-` | ei |
| `Muutospvm` | `TEXT` | ei | `-` | ei |
| `digipvm` | `TEXT` | ei | `-` | ei |
| `digimk` | `TEXT` | ei | `-` | ei |
| `paikannustapa` | `TEXT` | ei | `-` | ei |
| `paikannustarkkuus` | `TEXT` | ei | `-` | ei |
| `selite` | `TEXT` | ei | `-` | ei |
| `rajaustyyppi` | `TEXT` | ei | `-` | ei |
| `rajauslähde` | `TEXT` | ei | `-` | ei |
| `zylä` | `REAL` | ei | `-` | ei |
| `zala` | `REAL` | ei | `-` | ei |
| `url` | `TEXT` | ei | `-` | ei |

## `arkeologiset_kohteet_piste_t.gpkg`

### `arkeologiset_kohteet_piste_t`

- Tietueita: 112441
- Geometriatyyppi: `POINT`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `POINT` | ei | `-` | ei |
| `mjtunnus` | `MEDIUMINT` | ei | `-` | ei |
| `inspireID` | `TEXT` | ei | `-` | ei |
| `kohdenimi` | `TEXT` | ei | `-` | ei |
| `kunta` | `TEXT` | ei | `-` | ei |
| `Laji` | `TEXT` | ei | `-` | ei |
| `tyyppi` | `TEXT` | ei | `-` | ei |
| `alatyyppi` | `TEXT` | ei | `-` | ei |
| `ajoitus` | `TEXT` | ei | `-` | ei |
| `vedenalainen` | `TEXT` | ei | `-` | ei |
| `zala` | `REAL` | ei | `-` | ei |
| `zyla` | `REAL` | ei | `-` | ei |
| `KOHDE_APVM` | `DATETIME` | ei | `-` | ei |
| `KOHDE_MPVM` | `DATETIME` | ei | `-` | ei |
| `luontipvm` | `DATETIME` | ei | `-` | ei |
| `muutospvm` | `DATETIME` | ei | `-` | ei |
| `paikannustapa` | `TEXT` | ei | `-` | ei |
| `paikannustarkkuus` | `TEXT` | ei | `-` | ei |
| `selite` | `TEXT` | ei | `-` | ei |
| `url` | `TEXT` | ei | `-` | ei |
| `x` | `REAL` | ei | `-` | ei |
| `y` | `REAL` | ei | `-` | ei |

## `maailmanperintokohde_alue.gpkg`

### `maailmanperintokohde_alue`

- Tietueita: 50
- Geometriatyyppi: `POLYGON`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `POLYGON` | ei | `-` | ei |
| `ID` | `MEDIUMINT` | ei | `-` | ei |
| `inspireID` | `TEXT` | ei | `-` | ei |
| `Nimi` | `TEXT` | ei | `-` | ei |
| `aluetyyppi` | `TEXT` | ei | `-` | ei |
| `URL` | `TEXT` | ei | `-` | ei |

## `maailmanperintokohde_piste.gpkg`

### `maailmanperintokohde_piste`

- Tietueita: 6
- Geometriatyyppi: `POINT`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `POINT` | ei | `-` | ei |
| `ID` | `MEDIUMINT` | ei | `-` | ei |
| `inspireID` | `TEXT` | ei | `-` | ei |
| `nimi` | `TEXT` | ei | `-` | ei |
| `url` | `TEXT` | ei | `-` | ei |

## `rky_alue.gpkg`

### `rky_alue`

- Tietueita: 1851
- Geometriatyyppi: `GEOMETRY`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `GEOMETRY` | ei | `-` | ei |
| `ID` | `MEDIUMINT` | ei | `-` | ei |
| `inspireID` | `TEXT` | ei | `-` | ei |
| `kohdenimi` | `TEXT` | ei | `-` | ei |
| `nimi` | `TEXT` | ei | `-` | ei |
| `url` | `TEXT` | ei | `-` | ei |

## `rky_piste.gpkg`

### `rky_piste`

- Tietueita: 64
- Geometriatyyppi: `POINT`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `POINT` | ei | `-` | ei |
| `ID` | `MEDIUMINT` | ei | `-` | ei |
| `inspireID` | `TEXT` | ei | `-` | ei |
| `kohdenimi` | `TEXT` | ei | `-` | ei |
| `url` | `TEXT` | ei | `-` | ei |

## `rky_viiva.gpkg`

### `rky_viiva`

- Tietueita: 186
- Geometriatyyppi: `MULTILINESTRING`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `MULTILINESTRING` | ei | `-` | ei |
| `ID` | `MEDIUMINT` | ei | `-` | ei |
| `inspireID` | `TEXT` | ei | `-` | ei |
| `kohdenimi` | `TEXT` | ei | `-` | ei |
| `url` | `TEXT` | ei | `-` | ei |

## `suojellut_rakennukset_alue.gpkg`

### `suojellut_rakennukset_alue`

- Tietueita: 138
- Geometriatyyppi: `GEOMETRY`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `GEOMETRY` | ei | `-` | ei |
| `KOHDEID` | `MEDIUMINT` | ei | `-` | ei |
| `inspireID` | `TEXT` | ei | `-` | ei |
| `kohdenimi` | `TEXT` | ei | `-` | ei |
| `Kunta` | `TEXT` | ei | `-` | ei |
| `suojeluryhmä` | `TEXT` | ei | `-` | ei |
| `suojelun_tila` | `TEXT` | ei | `-` | ei |
| `SuojeluPäätöspvm` | `DATETIME` | ei | `-` | ei |
| `url` | `TEXT` | ei | `-` | ei |

## `suojellut_rakennukset_piste.gpkg`

### `suojellut_rakennukset_piste`

- Tietueita: 2290
- Geometriatyyppi: `POINT`
- Koordinaattijärjestelmä: `EPSG:3067` (GeoPackage SRS ID `3067`, ETRS89 / TM35FIN(E,N))

| Kenttä | Tietotyyppi | Pakollinen | Oletusarvo | Pääavain |
| --- | --- | --- | --- | --- |
| `fid` | `INTEGER` | kyllä | `-` | kyllä |
| `geom` | `POINT` | ei | `-` | ei |
| `KOHDEID` | `MEDIUMINT` | ei | `-` | ei |
| `rakennusID` | `MEDIUMINT` | ei | `-` | ei |
| `inspireID` | `TEXT` | ei | `-` | ei |
| `vtj_prt` | `TEXT` | ei | `-` | ei |
| `kohdenimi` | `TEXT` | ei | `-` | ei |
| `rakennusnimi` | `TEXT` | ei | `-` | ei |
| `Kunta` | `TEXT` | ei | `-` | ei |
| `suojeluryhmä` | `TEXT` | ei | `-` | ei |
| `suojelun_tila` | `TEXT` | ei | `-` | ei |
| `SuojeluPäätöspvm` | `DATETIME` | ei | `-` | ei |
| `url` | `TEXT` | ei | `-` | ei |
| `x` | `REAL` | ei | `-` | ei |
| `y` | `REAL` | ei | `-` | ei |

## Tietomallin tulkinta

### Lähteet ja rajaus

Tietomallin kuvaus yhdistää tuotantoaineistosta havaitun rakenteen ja Museoviraston PDF-tietotuoteselosteen. PDF on 33-sivuinen, sen sisäinen määrittelypäivä on 8.11.2017 ja tiedoston luontipäivä on `Fri Mar  8 14`. Tuotantoaineisto on tätä uudempi, joten ristiriitatilanteessa GeoPackage-aineisto määrää teknisen toteutuksen ja PDF toimii kenttien semantiikan historiallisena lähteenä.

PDF:n mukaan tietotuote on tarkoitettu viranomais- ja tutkimuskäyttöön, kattaa Suomen Ahvenanmaata lukuun ottamatta (kirkkorakennuksissa myös Ahvenanmaan) ja käyttää GeoPackage-jakelussa ETRS-TM35FIN-koordinaatistoa (EPSG:3067). Havaittu aineisto vastaa koordinaatistojärjestelmää kaikissa 12 GeoPackage-tiedostossa.

### Loogiset kohdetyhmät

| Ryhmä | Fyysiset aineistot | Tunniste ja yhteydet | Geometriat |
| --- | --- | --- | --- |
| Arkeologiset kohteet | `arkeologiset_kohteet_piste_t`, `arkeologiset_kohteet_alue_t`, `arkeologiset_kohteet_alakohteet_piste` | `mjtunnus` yhdistää pääkohteen pisteet, alueet ja alakohteet; alakohteella lisäksi `alakohdetunnus` | piste, alue ja alakohteen piste |
| Rakennusperintö | `suojellut_rakennukset_piste`, `suojellut_rakennukset_alue` | `KOHDEID` yhdistää kohteen; pisteellä voi olla lisäksi `rakennusID` ja `vtj_prt` | piste ja alue |
| RKY | `rky_alue`, `rky_piste`, `rky_viiva` | `ID`/`inspireID`; sama kohde voi esiintyä usealla geometriaesityksellä | piste, viiva ja alue/muu geometria |
| Maailmanperintö | `maailmanperintokohde_alue`, `maailmanperintokohde_piste` | Unescon `ID` ja `inspireID`; alue voi olla kohde tai suoja-alue | piste ja alue |
| VARK | `VARK_keskipisteet`, `VARK_aluerajaukset` | `VARK_ID` yhdistää keskipisteen ja rajauksen; mukana viittaukset enintään kolmeen muinaisjäännöskohteeseen | piste ja alue/muu geometria |

### Kenttien semanttiset ryhmät

- Tunnisteet: rekisterikohtaiset tunnisteet (`mjtunnus`, `KOHDEID`, `ID`, `VARK_ID`) sekä yhteentoimivuutta palveleva `inspireID`. GeoPackagen `fid` on tekninen rivitunniste eikä turvallinen rajapinnan pysyväksi tunnisteeksi.
- Nimet ja linkit: `kohdenimi`, `nimi`, `rakennusnimi`, `alakohdenimi` ja `url`/`URL`. PDF kuvaa URL:t kohteen lisätietolinkeiksi.
- Luokittelu: arkeologisten kohteiden `laji` → `tyyppi` → `alatyyppi`, rakennusten `suojeluryhmä` ja `suojelun_tila`, maailmanperintöalueiden `aluetyyppi` sekä VARK-aineiston omat luokittelukentät.
- Paikannuksen metatiedot: `paikannustapa`, `paikannustarkkuus`, `rajaustyyppi`, `rajauslähde`, koordinaatit ja korkeustiedot. PDF arvioi arkeologisten kohteiden yleiseksi sijaintitarkkuudeksi noin 50 metriä ja uusimpien GPS-tietojen tarkkuudeksi noin 20 metriä.
- Elinkaaritiedot: `luontipvm`, `muutospvm`, `digipvm` ja nykyisessä rakennusaineistossa `SuojeluPäätöspvm`. PDF:n mukaan päiväysten esityksen pitäisi noudattaa ISO 19108 -mallia.

PDF:n mukaan arkeologisten kohteiden aluerajaus on olemassa vain noin 40–50 prosentille kohteista, RKY valmistui vuonna 2009 ja muut aineistot päivittyvät jatkuvasti. Tyyppi- ja alatyyppiluetteloihin voi tulla muutoksia, joten niitä ei pidä kovakoodata sovellukseen suljettuina enumeraatioina.

### PDF:n määrittelemät arvojoukot

| Kenttäryhmä | PDF:ssä määritellyt arvot |
| --- | --- |
| Arkeologinen `laji` | ei määritelty; kiinteä muinaisjäännös; luonnonmuodostuma; löytöpaikka; mahdollinen muinaisjäännös; muu kohde; muu kulttuuriperintökohde; poistettu kiinteä muinaisjäännös (ei rauhoitettu) |
| Arkeologinen `tyyppi` | alusten hylyt; asuinpaikat; hautapaikat; kirkkorakenteet; kivirakenteet; kulkuväylät; kultti- ja tarinapaikat; luonnonmuodostumat; löytöpaikat; maarakenteet; muinaisjäännösryhmät; puolustusvarustukset; raaka-aineen hankintapaikat; taide, muistomerkit; tapahtumapaikat; teollisuuskohteet; työ- ja valmistuspaikat; ei määritelty |
| `vedenalainen` | `k`; `e` |
| Arkeologinen `paikannustapa` | Maastonimittaus; Tarkastus; Muu lähde |
| Arkeologinen `paikannustarkkuus` | Ei tiedossa; Tarkka (< 10 m); Ohjeellinen (10–100 m); Suuntaa antava (100–1000 m); > 1000 m |
| `rajaustyyppi` | Tarkka; Ohjeellinen; Suuntaa antava |
| `rajauslähde` | Rajaus; Tarkastus; Muu lähde |
| Rakennusten `suojeluryhmä` | Asetus 480/85; Ei määritelty; Kirkkolaki; Laki ortodoksisesta kirkosta; Laki rakennusperinnön suojelemisesta; Myrsky2000; Muu; Rakennussuojelulaki; Rautatiesopimus 1998; Suojeluohjelmat; Teollisuus; Viranomaistoiminta |
| Rakennusten `suojelun_tila` | Ei määritelty; Ei suojeltu; Hyväksytty; Hylätty; Purettu; Vireillä |
| Maailmanperintöalueen `aluetyyppi` | Kohde; Suoja-alue |

## Aineistosta havaitut arvojoukot

Alla ovat käyttöliittymän suodatukseen, MVT-tasojen muodostamiseen tai tietojen esittämiseen olennaiset matalan kardinaliteetin arvojoukot. `<NULL/tyhjä>` tarkoittaa puuttuvaa tai pelkistä välilyönneistä koostuvaa arvoa.

### Arkeologisen pistekohteen laji

Lähde: `arkeologiset_kohteet_piste_t.gpkg`, kenttä `Laji`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `kiinteä muinaisjäännös` | 41549 |
| `havaintokohde` | 36416 |
| `löytöpaikka` | 11705 |
| `muu kulttuuriperintökohde` | 10306 |
| `mahdollinen muinaisjäännös` | 7476 |
| `muu kohde` | 2739 |
| `poistettu kiinteä muinaisjäännös (ei rauhoitettu)` | 1918 |
| `luonnonmuodostuma` | 332 |

### Arkeologisen aluekohteen laji

Lähde: `arkeologiset_kohteet_alue_t.gpkg`, kenttä `Laji`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `havaintokohde` | 40329 |
| `kiinteä muinaisjäännös` | 35293 |
| `muu kulttuuriperintökohde` | 7848 |
| `mahdollinen muinaisjäännös` | 1923 |
| `poistettu kiinteä muinaisjäännös (ei rauhoitettu)` | 464 |
| `muu kohde` | 434 |
| `löytöpaikka` | 386 |
| `luonnonmuodostuma` | 26 |

### Arkeologisen alakohteen laji

Lähde: `arkeologiset_kohteet_alakohteet_piste.gpkg`, kenttä `laji`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `kiinteä muinaisjäännös` | 38381 |
| `havaintokohde` | 9821 |
| `muu kulttuuriperintökohde` | 8587 |
| `löytöpaikka` | 4877 |
| `mahdollinen muinaisjäännös` | 929 |
| `muu kohde` | 505 |
| `poistettu kiinteä muinaisjäännös (ei rauhoitettu)` | 111 |
| `luonnonmuodostuma` | 5 |

### Arkeologisen pistekohteen tyyppi – täydellinen raakamuotoinen arvojoukko

Lähde: `arkeologiset_kohteet_piste_t.gpkg`, kenttä `tyyppi`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `työ- ja valmistuspaikat,  ,  ,` | 51879 |
| `asuinpaikat,  ,  ,` | 22243 |
| `löytöpaikat,  ,  ,` | 11689 |
| `kivirakenteet,  ,  ,` | 7615 |
| `puolustusvarustukset,  ,  ,` | 4072 |
| `hautapaikat,  ,  ,` | 3776 |
| `alusten hylyt,  ,  ,` | 1989 |
| `maarakenteet,  ,  ,` | 1474 |
| `kulkuväylät,  ,  ,` | 1421 |
| `kultti- ja tarinapaikat,  ,  ,` | 1095 |
| `taide, muistomerkit,  ,  ,` | 777 |
| `raaka-aineen hankintapaikat,  ,  ,` | 569 |
| `teollisuuskohteet,  ,  ,` | 456 |
| `asuinpaikat, työ- ja valmistuspaikat,  ,` | 439 |
| `, työ- ja valmistuspaikat,  ,` | 288 |
| `luonnonmuodostumat,  ,  ,` | 278 |
| `asuinpaikat, hautapaikat,  ,` | 192 |
| `kirkkorakenteet,  ,  ,` | 192 |
| `kivirakenteet, työ- ja valmistuspaikat,  ,` | 166 |
| `asuinpaikat, kivirakenteet,  ,` | 165 |
| `, kivirakenteet,  ,` | 97 |
| `tapahtumapaikat,  ,  ,` | 76 |
| `asuinpaikat, löytöpaikat,  ,` | 71 |
| `, asuinpaikat,  ,` | 68 |
| `hautapaikat, kultti- ja tarinapaikat,  ,` | 62 |
| `asuinpaikat, maarakenteet,  ,` | 56 |
| `puurakenteet,  ,  ,` | 56 |
| `maarakenteet, työ- ja valmistuspaikat,  ,` | 55 |
| `kivirakenteet, maarakenteet,  ,` | 51 |
| `asuinpaikat, kultti- ja tarinapaikat,  ,` | 43 |
| `asuinpaikat,  , työ- ja valmistuspaikat,` | 41 |
| `asuinpaikat, kivirakenteet, työ- ja valmistuspaikat,` | 38 |
| `hautapaikat, kivirakenteet,  ,` | 37 |
| `asuinpaikat,  , kivirakenteet,` | 31 |
| `löytöpaikat, työ- ja valmistuspaikat,  ,` | 29 |
| `, asuinpaikat, työ- ja valmistuspaikat,` | 28 |
| `hautapaikat, kirkkorakenteet,  ,` | 26 |
| `löytöpaikat, maarakenteet,  ,` | 25 |
| `teollisuuskohteet, työ- ja valmistuspaikat,  ,` | 25 |
| `, hautapaikat,  ,` | 23 |
| `asuinpaikat, hautapaikat, kultti- ja tarinapaikat,` | 23 |
| `asuinpaikat, hautapaikat, työ- ja valmistuspaikat,` | 22 |
| `hautapaikat, työ- ja valmistuspaikat,  ,` | 20 |
| `asuinpaikat,  , hautapaikat,` | 19 |
| `hautapaikat, löytöpaikat,  ,` | 19 |
| `kivirakenteet, kultti- ja tarinapaikat,  ,` | 18 |
| `kivirakenteet, löytöpaikat,  ,` | 18 |
| `kivirakenteet, kulkuväylät,  ,` | 14 |
| `kivirakenteet, taide, muistomerkit,  ,` | 14 |
| `kivirakenteet, raaka-aineen hankintapaikat,  ,` | 13 |
| `, puolustusvarustukset,  ,` | 12 |
| `kivirakenteet, maarakenteet, työ- ja valmistuspaikat,` | 12 |
| `taide, muistomerkit, työ- ja valmistuspaikat,  ,` | 12 |
| `asuinpaikat, raaka-aineen hankintapaikat,  ,` | 11 |
| `, asuinpaikat, hautapaikat,` | 10 |
| `kivirakenteet,  , työ- ja valmistuspaikat,` | 10 |
| `kultti- ja tarinapaikat, taide, muistomerkit,  ,` | 10 |
| `, kivirakenteet, maarakenteet,` | 9 |
| `asuinpaikat,  , kivirakenteet, työ- ja valmistuspaikat` | 9 |
| `asuinpaikat, hautapaikat, kivirakenteet,` | 9 |
| `kulkuväylät, puolustusvarustukset,  ,` | 9 |
| `kultti- ja tarinapaikat, työ- ja valmistuspaikat,  ,` | 9 |
| `, kivirakenteet, työ- ja valmistuspaikat,` | 8 |
| `, kulkuväylät,  ,` | 8 |
| `asuinpaikat, kivirakenteet, maarakenteet,` | 8 |
| `asuinpaikat, taide, muistomerkit,  ,` | 8 |
| `kulkuväylät, työ- ja valmistuspaikat,  ,` | 8 |
| `, hautapaikat, kirkkorakenteet,` | 7 |
| `asuinpaikat, maarakenteet, työ- ja valmistuspaikat,` | 7 |
| `kultti- ja tarinapaikat, löytöpaikat,  ,` | 7 |
| `,  , työ- ja valmistuspaikat,` | 6 |
| `asuinpaikat, kulkuväylät,  ,` | 6 |
| `asuinpaikat, löytöpaikat, työ- ja valmistuspaikat,` | 6 |
| `asuinpaikat, puolustusvarustukset,  ,` | 6 |
| `hautapaikat, puolustusvarustukset,  ,` | 6 |
| `raaka-aineen hankintapaikat, työ- ja valmistuspaikat,  ,` | 6 |
| `,  , kivirakenteet,` | 5 |
| `, asuinpaikat, kivirakenteet,` | 5 |
| `, maarakenteet,  ,` | 5 |
| `asuinpaikat,  , hautapaikat, kultti- ja tarinapaikat` | 5 |
| `asuinpaikat, hautapaikat, kirkkorakenteet,` | 5 |
| `asuinpaikat, hautapaikat, löytöpaikat,` | 5 |
| `asuinpaikat, kivirakenteet, kulkuväylät,` | 5 |
| `hautapaikat, maarakenteet,  ,` | 5 |
| `hautapaikat, taide, muistomerkit,  ,` | 5 |
| `kivirakenteet, puolustusvarustukset,  ,` | 5 |
| `, asuinpaikat, hautapaikat, työ- ja valmistuspaikat` | 4 |
| `, asuinpaikat, löytöpaikat,` | 4 |
| `, hautapaikat, kultti- ja tarinapaikat,` | 4 |
| `asuinpaikat, hautapaikat, kivirakenteet, kultti- ja tarinapaikat` | 4 |
| `asuinpaikat, kivirakenteet, kulkuväylät, työ- ja valmistuspaikat` | 4 |
| `asuinpaikat, kivirakenteet, kultti- ja tarinapaikat,` | 4 |
| `asuinpaikat, kultti- ja tarinapaikat, työ- ja valmistuspaikat,` | 4 |
| `hautapaikat, kulkuväylät,  ,` | 4 |
| `kivirakenteet, löytöpaikat, maarakenteet,` | 4 |
| `kulkuväylät, teollisuuskohteet,  ,` | 4 |
| `kultti- ja tarinapaikat, tapahtumapaikat,  ,` | 4 |
| `puolustusvarustukset, taide, muistomerkit,  ,` | 4 |
| `, hautapaikat, työ- ja valmistuspaikat,` | 3 |
| `, teollisuuskohteet,  ,` | 3 |
| `asuinpaikat,  ,  , hautapaikat` | 3 |
| `asuinpaikat,  ,  , kivirakenteet` | 3 |
| `asuinpaikat,  , kulkuväylät,` | 3 |
| `asuinpaikat, hautapaikat,  , työ- ja valmistuspaikat` | 3 |
| `asuinpaikat, hautapaikat, kultti- ja tarinapaikat, työ- ja valmistuspaikat` | 3 |
| `asuinpaikat, kirkkorakenteet,  ,` | 3 |
| `asuinpaikat, kivirakenteet,  , työ- ja valmistuspaikat` | 3 |
| `asuinpaikat, kivirakenteet, löytöpaikat,` | 3 |
| `asuinpaikat, löytöpaikat, maarakenteet,` | 3 |
| `kirkkorakenteet, työ- ja valmistuspaikat,  ,` | 3 |
| `kivirakenteet, taide, muistomerkit, työ- ja valmistuspaikat,` | 3 |
| `kivirakenteet, teollisuuskohteet,  ,` | 3 |
| `kulkuväylät, taide, muistomerkit,  ,` | 3 |
| `maarakenteet,  , työ- ja valmistuspaikat,` | 3 |
| `puolustusvarustukset, tapahtumapaikat,  ,` | 3 |
| `puolustusvarustukset, työ- ja valmistuspaikat,  ,` | 3 |
| `taide, muistomerkit, tapahtumapaikat,  ,` | 3 |
| `,  ,  , kivirakenteet` | 2 |
| `,  , asuinpaikat,` | 2 |
| `,  , hautapaikat,` | 2 |
| `,  , kulkuväylät,` | 2 |
| `, asuinpaikat,  , työ- ja valmistuspaikat` | 2 |
| `, asuinpaikat, kivirakenteet, kultti- ja tarinapaikat` | 2 |
| `, asuinpaikat, kivirakenteet, maarakenteet` | 2 |
| `, asuinpaikat, maarakenteet, työ- ja valmistuspaikat` | 2 |
| `, kivirakenteet, kultti- ja tarinapaikat,` | 2 |
| `, kivirakenteet, löytöpaikat,` | 2 |
| `, kultti- ja tarinapaikat,  ,` | 2 |
| `asuinpaikat,  , maarakenteet,` | 2 |
| `asuinpaikat, hautapaikat, kultti- ja tarinapaikat, löytöpaikat` | 2 |
| `asuinpaikat, hautapaikat, puolustusvarustukset,` | 2 |
| `asuinpaikat, kivirakenteet,  , kulkuväylät` | 2 |
| `asuinpaikat, kulkuväylät, työ- ja valmistuspaikat,` | 2 |
| `asuinpaikat, löytöpaikat, maarakenteet, työ- ja valmistuspaikat` | 2 |
| `asuinpaikat, maarakenteet,  , työ- ja valmistuspaikat` | 2 |
| `asuinpaikat, puolustusvarustukset, työ- ja valmistuspaikat,` | 2 |
| `asuinpaikat, tapahtumapaikat,  ,` | 2 |
| `asuinpaikat, teollisuuskohteet,  ,` | 2 |
| `hautapaikat, kirkkorakenteet, työ- ja valmistuspaikat,` | 2 |
| `hautapaikat, kivirakenteet, kulkuväylät,` | 2 |
| `hautapaikat, kivirakenteet, kultti- ja tarinapaikat,` | 2 |
| `hautapaikat, kivirakenteet, työ- ja valmistuspaikat,` | 2 |
| `hautapaikat, raaka-aineen hankintapaikat,  ,` | 2 |
| `kirkkorakenteet, kultti- ja tarinapaikat,  ,` | 2 |
| `kivirakenteet, kultti- ja tarinapaikat, taide, muistomerkit,` | 2 |
| `kivirakenteet, löytöpaikat, työ- ja valmistuspaikat,` | 2 |
| `kulkuväylät, kultti- ja tarinapaikat,  ,` | 2 |
| `löytöpaikat,  , työ- ja valmistuspaikat,` | 2 |
| `maarakenteet, puolustusvarustukset,  ,` | 2 |
| `puurakenteet, työ- ja valmistuspaikat,  ,` | 2 |
| `,  ,  , asuinpaikat` | 1 |
| `,  ,  , hautapaikat` | 1 |
| `,  ,  , puolustusvarustukset` | 1 |
| `,  , asuinpaikat, kirkkorakenteet` | 1 |
| `,  , asuinpaikat, kivirakenteet` | 1 |
| `,  , hautapaikat, kirkkorakenteet` | 1 |
| `,  , kivirakenteet, kulkuväylät` | 1 |
| `,  , kivirakenteet, työ- ja valmistuspaikat` | 1 |
| `,  , puolustusvarustukset,` | 1 |
| `, asuinpaikat,  , hautapaikat` | 1 |
| `, asuinpaikat,  , kivirakenteet` | 1 |
| `, asuinpaikat, hautapaikat, kirkkorakenteet` | 1 |
| `, asuinpaikat, hautapaikat, kivirakenteet` | 1 |
| `, asuinpaikat, hautapaikat, kultti- ja tarinapaikat` | 1 |
| `, asuinpaikat, kivirakenteet, kulkuväylät` | 1 |
| `, asuinpaikat, kulkuväylät, taide, muistomerkit` | 1 |
| `, asuinpaikat, maarakenteet,` | 1 |
| `, hautapaikat, puolustusvarustukset,` | 1 |
| `, kivirakenteet, kulkuväylät,` | 1 |
| `, kivirakenteet, kultti- ja tarinapaikat, maarakenteet` | 1 |
| `, kivirakenteet, kultti- ja tarinapaikat, työ- ja valmistuspaikat` | 1 |
| `, kivirakenteet, maarakenteet, työ- ja valmistuspaikat` | 1 |
| `, kivirakenteet, taide, muistomerkit,` | 1 |
| `, kulkuväylät, puolustusvarustukset,` | 1 |
| `, kulkuväylät, teollisuuskohteet,` | 1 |
| `, kulkuväylät, työ- ja valmistuspaikat,` | 1 |
| `, löytöpaikat,  ,` | 1 |
| `, maarakenteet, työ- ja valmistuspaikat,` | 1 |
| `, taide, muistomerkit,  ,` | 1 |
| `, teollisuuskohteet, työ- ja valmistuspaikat,` | 1 |
| `alusten hylyt, ei määritelty,  ,` | 1 |
| `alusten hylyt, kulkuväylät,  ,` | 1 |
| `alusten hylyt, puolustusvarustukset,  ,` | 1 |
| `alusten hylyt, puurakenteet,  ,` | 1 |
| `alusten hylyt, työ- ja valmistuspaikat,  ,` | 1 |
| `asuinpaikat,  , hautapaikat, kivirakenteet` | 1 |
| `asuinpaikat,  , kivirakenteet, kultti- ja tarinapaikat` | 1 |
| `asuinpaikat,  , kulkuväylät, kultti- ja tarinapaikat` | 1 |
| `asuinpaikat,  , kulkuväylät, teollisuuskohteet` | 1 |
| `asuinpaikat,  , löytöpaikat,` | 1 |
| `asuinpaikat, hautapaikat, kirkkorakenteet, puolustusvarustukset` | 1 |
| `asuinpaikat, hautapaikat, kivirakenteet, työ- ja valmistuspaikat` | 1 |
| `asuinpaikat, hautapaikat, kulkuväylät,` | 1 |
| `asuinpaikat, kirkkorakenteet, kivirakenteet, työ- ja valmistuspaikat` | 1 |
| `asuinpaikat, kirkkorakenteet, kultti- ja tarinapaikat,` | 1 |
| `asuinpaikat, kivirakenteet,  , maarakenteet` | 1 |
| `asuinpaikat, kivirakenteet, maarakenteet, työ- ja valmistuspaikat` | 1 |
| `asuinpaikat, kivirakenteet, puolustusvarustukset,` | 1 |
| `asuinpaikat, kivirakenteet, raaka-aineen hankintapaikat,` | 1 |
| `asuinpaikat, kivirakenteet, raaka-aineen hankintapaikat, teollisuuskohteet` | 1 |
| `asuinpaikat, kivirakenteet, taide, muistomerkit,` | 1 |
| `asuinpaikat, kivirakenteet, teollisuuskohteet, työ- ja valmistuspaikat` | 1 |
| `asuinpaikat, kulkuväylät, maarakenteet,` | 1 |
| `asuinpaikat, kulkuväylät, taide, muistomerkit,` | 1 |
| `asuinpaikat, kulkuväylät, teollisuuskohteet,` | 1 |
| `asuinpaikat, kultti- ja tarinapaikat, löytöpaikat,` | 1 |
| `asuinpaikat, kultti- ja tarinapaikat, puolustusvarustukset,` | 1 |
| `asuinpaikat, kultti- ja tarinapaikat, taide, muistomerkit,` | 1 |
| `asuinpaikat, löytöpaikat,  , työ- ja valmistuspaikat` | 1 |
| `asuinpaikat, löytöpaikat, puolustusvarustukset, työ- ja valmistuspaikat` | 1 |
| `asuinpaikat, raaka-aineen hankintapaikat,  , työ- ja valmistuspaikat` | 1 |
| `asuinpaikat, raaka-aineen hankintapaikat, työ- ja valmistuspaikat,` | 1 |
| `asuinpaikat, taide, muistomerkit, työ- ja valmistuspaikat,` | 1 |
| `ei määritelty,  ,  ,` | 1 |
| `ei määritelty, löytöpaikat,  ,` | 1 |
| `hautapaikat,  ,  , kirkkorakenteet` | 1 |
| `hautapaikat,  , kirkkorakenteet,` | 1 |
| `hautapaikat,  , maarakenteet,` | 1 |
| `hautapaikat, kirkkorakenteet, kultti- ja tarinapaikat,` | 1 |
| `hautapaikat, kirkkorakenteet, taide, muistomerkit,` | 1 |
| `hautapaikat, kivirakenteet, kultti- ja tarinapaikat, työ- ja valmistuspaikat` | 1 |
| `hautapaikat, kultti- ja tarinapaikat, puolustusvarustukset,` | 1 |
| `hautapaikat, puolustusvarustukset, taide, muistomerkit,` | 1 |
| `hautapaikat, tapahtumapaikat,  ,` | 1 |
| `kirkkorakenteet, kivirakenteet, taide, muistomerkit,` | 1 |
| `kirkkorakenteet, kivirakenteet, työ- ja valmistuspaikat,` | 1 |
| `kirkkorakenteet, kultti- ja tarinapaikat, työ- ja valmistuspaikat,` | 1 |
| `kirkkorakenteet, löytöpaikat,  ,` | 1 |
| `kirkkorakenteet, taide, muistomerkit,  ,` | 1 |
| `kivirakenteet,  , maarakenteet, työ- ja valmistuspaikat` | 1 |
| `kivirakenteet, kulkuväylät, taide, muistomerkit,` | 1 |
| `kivirakenteet, kultti- ja tarinapaikat, työ- ja valmistuspaikat,` | 1 |
| `kivirakenteet, luonnonmuodostumat, maarakenteet, työ- ja valmistuspaikat` | 1 |
| `kivirakenteet, puurakenteet,  ,` | 1 |
| `kivirakenteet, raaka-aineen hankintapaikat, taide, muistomerkit,` | 1 |
| `kivirakenteet, tapahtumapaikat,  ,` | 1 |
| `kulkuväylät, kultti- ja tarinapaikat,  , työ- ja valmistuspaikat` | 1 |
| `kulkuväylät, kultti- ja tarinapaikat, taide, muistomerkit,` | 1 |
| `kulkuväylät, puolustusvarustukset, tapahtumapaikat, teollisuuskohteet` | 1 |
| `kulkuväylät, raaka-aineen hankintapaikat,  ,` | 1 |
| `kulkuväylät, tapahtumapaikat,  ,` | 1 |
| `kultti- ja tarinapaikat,  , taide, muistomerkit,` | 1 |
| `kultti- ja tarinapaikat,  , työ- ja valmistuspaikat,` | 1 |
| `kultti- ja tarinapaikat, luonnonmuodostumat,  , taide, muistomerkit` | 1 |
| `kultti- ja tarinapaikat, maarakenteet,  ,` | 1 |
| `kultti- ja tarinapaikat, puurakenteet,  ,` | 1 |
| `kultti- ja tarinapaikat, raaka-aineen hankintapaikat,  ,` | 1 |
| `luonnonmuodostumat, löytöpaikat,  ,` | 1 |
| `luonnonmuodostumat, raaka-aineen hankintapaikat,  ,` | 1 |
| `löytöpaikat, maarakenteet, työ- ja valmistuspaikat,` | 1 |
| `löytöpaikat, puolustusvarustukset,  ,` | 1 |
| `löytöpaikat, raaka-aineen hankintapaikat,  ,` | 1 |
| `maarakenteet,  ,  , työ- ja valmistuspaikat` | 1 |
| `maarakenteet, puolustusvarustukset, työ- ja valmistuspaikat,` | 1 |
| `maarakenteet, puurakenteet,  ,` | 1 |
| `maarakenteet, teollisuuskohteet,  ,` | 1 |
| `puolustusvarustukset, teollisuuskohteet,  ,` | 1 |
| `teollisuuskohteet,  , työ- ja valmistuspaikat,` | 1 |

### Arkeologisen pistekohteen alatyyppi – täydellinen raakamuotoinen arvojoukko

Lähde: `arkeologiset_kohteet_piste_t.gpkg`, kenttä `alatyyppi`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `tervahaudat,  ,  ,` | 38487 |
| `ei määritelty,  ,  ,` | 23459 |
| `hiilimiilut,  ,  ,` | 7931 |
| `irtolöytöpaikat,  ,  ,` | 4698 |
| `kylänpaikat,  ,  ,` | 4064 |
| `röykkiöt,  ,  ,` | 2849 |
| `hautaröykkiöt,  ,  ,` | 2152 |
| `pyyntikuopat,  ,  ,` | 2056 |
| `taistelukaivannot,  ,  ,` | 1940 |
| `rajamerkit,  ,  ,` | 1736 |
| `torpat,  ,  ,` | 1453 |
| `hylyt (puu),  ,  ,` | 1333 |
| `asumuspainanteet,  ,  ,` | 1161 |
| `kuopat,  ,  ,` | 1145 |
| `talonpohjat,  ,  ,` | 950 |
| `latomukset,  ,  ,` | 647 |
| `yksinäistalot,  ,  ,` | 635 |
| `vesimyllyt,  ,  ,` | 622 |
| `kuppikivet,  ,  ,` | 464 |
| `tienpohjat,  ,  ,` | 447 |
| `viljelyröykkiöt,  ,  ,` | 437 |
| `louhokset,  ,  ,` | 435 |
| `kiviaidat,  ,  ,` | 411 |
| `hakkaukset,  ,  ,` | 351 |
| `rakkakuopat,  ,  ,` | 334 |
| `tykkiasemat,  ,  ,` | 322 |
| `kaskiröykkiöt,  ,  ,` | 311 |
| `raudanvalmistuspaikat,  ,  ,` | 272 |
| `tulipesäkkeet,  ,  ,` | 271 |
| `polttokenttäkalmistot,  ,  ,` | 241 |
| `lapinrauniot,  ,  ,` | 225 |
| `ei määritelty, pyyntikuopat,  ,` | 219 |
| `hiilimiilut, tervahaudat,  ,` | 214 |
| `uittolaitteet,  ,  ,` | 197 |
| `hautasaaret,  ,  ,` | 190 |
| `hylyt (metalli),  ,  ,` | 188 |
| `kalastuspaikat,  ,  ,` | 186 |
| `kellarit,  ,  ,` | 182 |
| `kartanot,  ,  ,` | 174 |
| `kalliomaalaukset,  ,  ,` | 169 |
| `purnut,  ,  ,` | 169 |
| `kirkonpaikat,  ,  ,` | 164 |
| `tarinapaikat,  ,  ,` | 151 |
| `laiturit,  ,  ,` | 147 |
| `kaiverrukset,  ,  ,` | 144 |
| `ryssänuunit,  ,  ,` | 137 |
| `ruuhet,  ,  ,` | 136 |
| `eräsijat,  ,  ,` | 135 |
| `nauriskuopat,  ,  ,` | 132 |
| `, ei määritelty,  ,` | 129 |
| `hautausmaat,  ,  ,` | 126 |
| `kentät (gieddi),  ,  ,` | 125 |
| `ruumiskalmistot,  ,  ,` | 124 |
| `kummelit,  ,  ,` | 122 |
| `kodanpohjat,  ,  ,` | 118 |
| `suojahuoneet,  ,  ,` | 118 |
| `keittokuopat,  ,  ,` | 115 |
| `kiukaat,  ,  ,` | 108 |
| `sotilasleirit,  ,  ,` | 106 |
| `kalkkiuunit,  ,  ,` | 102 |
| `kivivallit,  ,  ,` | 98 |
| `kaivokset,  ,  ,` | 93 |
| `poroaidat,  ,  ,` | 93 |
| `muinaislinnat,  ,  ,` | 91 |
| `jatulintarhat,  ,  ,` | 89 |
| `painanteet,  ,  ,` | 87 |
| `maavallit,  ,  ,` | 86 |
| `uunit,  ,  ,` | 86 |
| `panssariesteet,  ,  ,` | 84 |
| `sillat,  ,  ,` | 84 |
| `sillanpaikat,  ,  ,` | 82 |
| `kaivannot,  ,  ,` | 79 |
| `kiukaat, tervahaudat,  ,` | 75 |
| `kätköt,  ,  ,` | 73 |
| `rautaruukit,  ,  ,` | 73 |
| `karsikkopaikat,  ,  ,` | 72 |
| `ortodoksikalmistot,  ,  ,` | 71 |
| `luolat,  ,  ,` | 70 |
| `lähteet,  ,  ,` | 70 |
| `ei määritelty, röykkiöt,  ,` | 65 |
| `linnakkeet,  ,  ,` | 65 |
| `tulisijat,  ,  ,` | 65 |
| `liesilatomukset (árran),  ,  ,` | 64 |
| `merkkipuut,  ,  ,` | 64 |
| `seidat,  ,  ,` | 64 |
| `ei määritelty, kuopat,  ,` | 61 |
| `kesähaudat,  ,  ,` | 60 |
| `maanmittauspisteet,  ,  ,` | 60 |
| `pappilat,  ,  ,` | 59 |
| `kivimuurit,  ,  ,` | 52 |
| `kiinnitysrenkaat,  ,  ,` | 51 |
| `korsut,  ,  ,` | 50 |
| `linnoitukset,  ,  ,` | 49 |
| `pirunpellot,  ,  ,` | 48 |
| `joukkohaudat,  ,  ,` | 47 |
| `merimerkit,  ,  ,` | 47 |
| `ei määritelty, hautaröykkiöt,  ,` | 45 |
| `ratapohjat,  ,  ,` | 45 |
| `muistomerkit,  ,  ,` | 44 |
| `tomtning-jäännökset,  ,  ,` | 42 |
| `käsittelypaikat,  ,  ,` | 41 |
| `veneenvetopaikat,  ,  ,` | 41 |
| `ei määritelty, tervahaudat,  ,` | 37 |
| `tykkitiet,  ,  ,` | 37 |
| `ei määritelty, kuppikivet,  ,` | 36 |
| `kuppikalliot,  ,  ,` | 36 |
| `vesisahat,  ,  ,` | 36 |
| `taistelupaikat,  ,  ,` | 34 |
| `kullanhuuhdonnan jäännökset,  ,  ,` | 33 |
| `liesikiveykset,  ,  ,` | 33 |
| `linnavuoret,  ,  ,` | 33 |
| `piilopirtit,  ,  ,` | 33 |
| `satamat,  ,  ,` | 33 |
| `sudenkuopat,  ,  ,` | 33 |
| `kanavat,  ,  ,` | 32 |
| `pyyntitukikohdat,  ,  ,` | 32 |
| `virstanpylväät,  ,  ,` | 32 |
| `jätinkirkot,  ,  ,` | 31 |
| `rakkakuopat, röykkiöt,  ,` | 31 |
| `tiilenpolttouunit,  ,  ,` | 31 |
| `ei määritelty, punamultahaudat,  ,` | 30 |
| `kivipöydät,  ,  ,` | 29 |
| `pajat,  ,  ,` | 29 |
| `tiilitehtaat,  ,  ,` | 29 |
| `kummut,  ,  ,` | 28 |
| `linnustuspaikat,  ,  ,` | 27 |
| `tuulimyllyt,  ,  ,` | 27 |
| `vallit,  ,  ,` | 27 |
| `hautaröykkiöt, kuppikivet,  ,` | 25 |
| `kaupungit,  ,  ,` | 24 |
| `kivivarustukset,  ,  ,` | 24 |
| `lapinpadot,  ,  ,` | 24 |
| `veneenvetomöljät,  ,  ,` | 24 |
| `kalliopiirrokset,  ,  ,` | 23 |
| `polut,  ,  ,` | 22 |
| `tupasijat,  ,  ,` | 22 |
| `viljelmät,  ,  ,` | 22 |
| `kivilatomukset,  ,  ,` | 21 |
| `piikkilankaesteet,  ,  ,` | 21 |
| `yhdyshaudat,  ,  ,` | 21 |
| `ei määritelty, latomukset,  ,` | 20 |
| `ei määritelty, kylänpaikat,  ,` | 19 |
| `ei määritelty, polttokenttäkalmistot,  ,` | 19 |
| `kestikievarit,  ,  ,` | 19 |
| `kompassiruusut,  ,  ,` | 19 |
| `rangaistuspaikat,  ,  ,` | 19 |
| `uhrikivet,  ,  ,` | 19 |
| `virkatalot,  ,  ,` | 19 |
| `asumuspainanteet, pyyntikuopat,  ,` | 18 |
| `kuopat, röykkiöt,  ,` | 18 |
| `ei määritelty, raudanvalmistuspaikat,  ,` | 17 |
| `kaivot,  ,  ,` | 17 |
| `rantakivikot,  ,  ,` | 17 |
| `hautakummut,  ,  ,` | 16 |
| `polttohaudat,  ,  ,` | 16 |
| `kuopat, tervahaudat,  ,` | 15 |
| `rajamerkit, puu,  ,  ,` | 15 |
| `eräsijat, tervahaudat,  ,` | 14 |
| `laivanrakennuspaikat,  ,  ,` | 14 |
| `markkinapaikat,  ,  ,` | 14 |
| `merkkikivet,  ,  ,` | 14 |
| `muistopaikat,  ,  ,` | 14 |
| `pyyntikuopat, tervahaudat,  ,` | 14 |
| `kapulatiet,  ,  ,` | 13 |
| `latomukset, röykkiöt,  ,` | 13 |
| `ruumishaudat,  ,  ,` | 13 |
| `tornit,  ,  ,` | 13 |
| `vesimyllyt, vesisahat,  ,` | 13 |
| `asumuspainanteet, punamultahaudat,  ,` | 12 |
| `hautausmaat, kirkonpaikat,  ,` | 12 |
| `talonpohjat, tervahaudat,  ,` | 12 |
| `ei määritelty, pyyntikuopat, tervahaudat,` | 11 |
| `kodanpohjat, pyyntikuopat,  ,` | 11 |
| `kuninkaankartanot,  ,  ,` | 11 |
| `liesikiveykset, pyyntikuopat,  ,` | 11 |
| `linnat,  ,  ,` | 11 |
| `optiset lennätinasemat,  ,  ,` | 11 |
| `pitkospuut,  ,  ,` | 11 |
| `röykkiöt, tervahaudat,  ,` | 11 |
| `telakat,  ,  ,` | 11 |
| `ei määritelty, hiilimiilut,  ,` | 10 |
| `ei määritelty, irtolöytöpaikat,  ,` | 10 |
| `hiilimiilut, kuopat,  ,` | 10 |
| `hiilimiilut, pyyntikuopat,  ,` | 10 |
| `lasitehtaat,  ,  ,` | 10 |
| `latomukset, pyyntikuopat,  ,` | 10 |
| `röykkiöt, talonpohjat,  ,` | 10 |
| `talonpohjat, viljelyröykkiöt,  ,` | 10 |
| `vallihaudat,  ,  ,` | 10 |
| `asumuspainanteet, ei määritelty,  ,` | 9 |
| `asumuspainanteet, kuopat,  ,` | 9 |
| `ei määritelty, louhokset,  ,` | 9 |
| `ei määritelty, viljelyröykkiöt,  ,` | 9 |
| `hiekanottokuopat,  ,  ,` | 9 |
| `muinaispellot,  ,  ,` | 9 |
| `mäkituvat,  ,  ,` | 9 |
| `asumuspainanteet, tervahaudat,  ,` | 8 |
| `ei määritelty, hautasaaret,  ,` | 8 |
| `ei määritelty, keittokuopat,  ,` | 8 |
| `ei määritelty, latomukset, pyyntikuopat,` | 8 |
| `kartanot, kylänpaikat,  ,` | 8 |
| `kiviaidat, röykkiöt,  ,` | 8 |
| `lentokentät,  ,  ,` | 8 |
| `liesilatomukset (árran), pyyntikuopat,  ,` | 8 |
| `asumuspainanteet, röykkiöt,  ,` | 7 |
| `ei määritelty, kodanpohjat, pyyntikuopat,` | 7 |
| `ei määritelty, kätköt,  ,` | 7 |
| `ei määritelty, rakkakuopat,  ,` | 7 |
| `ei määritelty, uunit,  ,` | 7 |
| `haaksirikkopaikat,  ,  ,` | 7 |
| `hautaröykkiöt, polttokenttäkalmistot,  ,` | 7 |
| `hautaröykkiöt, röykkiöt,  ,` | 7 |
| `kentät (gieddi), pyyntikuopat,  ,` | 7 |
| `kiviaidat, viljelyröykkiöt,  ,` | 7 |
| `kivilinnat,  ,  ,` | 7 |
| `kuopat, latomukset,  ,` | 7 |
| `luotsi- ja tulliasemat,  ,  ,` | 7 |
| `painolastipaikat,  ,  ,` | 7 |
| `pyyntikuopat, talonpohjat,  ,` | 7 |
| `ammusvarastot,  ,  ,` | 6 |
| `ei määritelty, hautaröykkiöt, kuppikivet,` | 6 |
| `ei määritelty, hautaröykkiöt, polttokenttäkalmistot,` | 6 |
| `ei määritelty, kaskiröykkiöt,  ,` | 6 |
| `ei määritelty, kuppikalliot,  ,` | 6 |
| `ei määritelty, talonpohjat,  ,` | 6 |
| `ei määritelty, tarinapaikat,  ,` | 6 |
| `hakkaukset, rajamerkit,  ,` | 6 |
| `hiilimiilut, raudanvalmistuspaikat,  ,` | 6 |
| `hospitaalit ja sairaalat,  ,  ,` | 6 |
| `jätinkirkot, röykkiöt,  ,` | 6 |
| `kaiverrukset, maanmittauspisteet,  ,` | 6 |
| `keittokuopat, kuopat,  ,` | 6 |
| `keittokuopat, pyyntikuopat,  ,` | 6 |
| `kirkkohaudat, kirkonpaikat,  ,` | 6 |
| `kiviaidat, talonpohjat, viljelyröykkiöt,` | 6 |
| `kuppikivet, polttokenttäkalmistot,  ,` | 6 |
| `käräjäpaikat,  ,  ,` | 6 |
| `masuunit,  ,  ,` | 6 |
| `punamultahaudat,  ,  ,` | 6 |
| `terva- ja tärpättitehtaat,  ,  ,` | 6 |
| `torpat, viljelyröykkiöt,  ,` | 6 |
| `tähystysasemat,  ,  ,` | 6 |
| `valkamat,  ,  ,` | 6 |
| `valonheitinasemat,  ,  ,` | 6 |
| `, ei määritelty, kuppikivet,` | 5 |
| `aidat,  ,  ,` | 5 |
| `asumuspainanteet, hiilimiilut,  ,` | 5 |
| `ei määritelty, kivivallit,  ,` | 5 |
| `ei määritelty, painanteet,  ,` | 5 |
| `ei määritelty, torpat,  ,` | 5 |
| `hautaröykkiöt, kuopat,  ,` | 5 |
| `hautaröykkiöt, rakkakuopat,  ,` | 5 |
| `hautaröykkiöt, viljelyröykkiöt,  ,` | 5 |
| `kalkkiuunit, louhokset,  ,` | 5 |
| `kaskiröykkiöt, nauriskuopat,  ,` | 5 |
| `kirkkohaudat,  ,  ,` | 5 |
| `kirkonrauniot,  ,  ,` | 5 |
| `kiviaidat, talonpohjat,  ,` | 5 |
| `kivivallit, röykkiöt,  ,` | 5 |
| `kuopat, rakkakuopat,  ,` | 5 |
| `kuppikalliot, polttokenttäkalmistot,  ,` | 5 |
| `kylänpaikat, torpat,  ,` | 5 |
| `latomukset, rakkakuopat,  ,` | 5 |
| `majakat,  ,  ,` | 5 |
| `miekanhiontakivet,  ,  ,` | 5 |
| `pyyntikuopat, tulisijat,  ,` | 5 |
| `raudanvalmistuspaikat, tervahaudat,  ,` | 5 |
| `tsasounanpaikat,  ,  ,` | 5 |
| `ei määritelty, eräsijat,  ,` | 4 |
| `ei määritelty, hakkaukset,  ,` | 4 |
| `ei määritelty, hautaröykkiöt, keittokuopat,` | 4 |
| `ei määritelty, kartanot,  ,` | 4 |
| `ei määritelty, kentät (gieddi),  ,` | 4 |
| `ei määritelty, kentät (gieddi), pyyntikuopat,` | 4 |
| `ei määritelty, kirkonpaikat,  ,` | 4 |
| `ei määritelty, kiukaat,  ,` | 4 |
| `ei määritelty, kuppikivet, röykkiöt,` | 4 |
| `ei määritelty, lapinrauniot,  ,` | 4 |
| `ei määritelty, liesikiveykset,  ,` | 4 |
| `ei määritelty, muinaispellot,  ,` | 4 |
| `ei määritelty, ortodoksikalmistot,  ,` | 4 |
| `ei määritelty, polttokenttäkalmistot, röykkiöt,` | 4 |
| `ei määritelty, rajamerkit,  ,` | 4 |
| `ei määritelty, ruumiskalmistot,  ,` | 4 |
| `hautaröykkiöt, rajamerkit,  ,` | 4 |
| `hiilimiilut, kiukaat,  ,` | 4 |
| `höyrysahat,  ,  ,` | 4 |
| `keittokuopat, röykkiöt,  ,` | 4 |
| `kellarit, tervahaudat,  ,` | 4 |
| `kiukaat, kuopat, tervahaudat,` | 4 |
| `kiviaidat, röykkiöt, talonpohjat,` | 4 |
| `kylänpaikat, röykkiöt,  ,` | 4 |
| `potaskauunit,  ,  ,` | 4 |
| `puutarhat,  ,  ,` | 4 |
| `savenottokuopat,  ,  ,` | 4 |
| `taistelukaivannot, tulipesäkkeet,  ,` | 4 |
| `uhripuut,  ,  ,` | 4 |
| `vetokannakset,  ,  ,` | 4 |
| `viljelyröykkiöt, yksinäistalot,  ,` | 4 |
| `aallonmurtajat,  ,  ,` | 3 |
| `asumuspainanteet, ei määritelty, punamultahaudat,` | 3 |
| `asumuspainanteet, ei määritelty, pyyntikuopat,` | 3 |
| `asumuspainanteet, jätinkirkot, röykkiöt,` | 3 |
| `asumuspainanteet, keittokuopat,  ,` | 3 |
| `ei määritelty, hautaröykkiöt, kuppikivet, polttokenttäkalmistot` | 3 |
| `ei määritelty, hiilimiilut, tervahaudat,` | 3 |
| `ei määritelty, kaiverrukset,  ,` | 3 |
| `ei määritelty, keittokuopat, röykkiöt,` | 3 |
| `ei määritelty, kesähaudat,  ,` | 3 |
| `ei määritelty, kivimuurit,  ,` | 3 |
| `ei määritelty, kuppikivet, polttokenttäkalmistot,` | 3 |
| `ei määritelty, liesilatomukset (árran), pyyntikuopat,` | 3 |
| `ei määritelty, pajat,  ,` | 3 |
| `ei määritelty, polttohaudat,  ,` | 3 |
| `ei määritelty, polttokenttäkalmistot, ruumiskalmistot,` | 3 |
| `ei määritelty, pyyntikuopat, tulisijat,` | 3 |
| `ei määritelty, uittolaitteet,  ,` | 3 |
| `hakkaukset, vesimyllyt,  ,` | 3 |
| `harkkohytit, raudanvalmistuspaikat,  ,` | 3 |
| `hautakammiot,  ,  ,` | 3 |
| `hautaröykkiöt, kivivallit,  ,` | 3 |
| `hautaröykkiöt, kuppikivet, polttokenttäkalmistot,` | 3 |
| `hautaröykkiöt, latomukset,  ,` | 3 |
| `hautaröykkiöt, uhrikivet,  ,` | 3 |
| `irtolöytöpaikat, pyyntikuopat,  ,` | 3 |
| `jätinkirkot, rakkakuopat,  ,` | 3 |
| `kaivannot, tervahaudat,  ,` | 3 |
| `keittokuopat, latomukset,  ,` | 3 |
| `kellarit, kiviaidat, talonpohjat,` | 3 |
| `kellarit, talonpohjat,  ,` | 3 |
| `kesähaudat, pyyntikuopat,  ,` | 3 |
| `kirkkorakennukset,  ,  ,` | 3 |
| `kiukaat, kuopat,  ,` | 3 |
| `kiviaidat, kuopat, viljelyröykkiöt,` | 3 |
| `kiviaidat, röykkiöt, talonpohjat, viljelyröykkiöt` | 3 |
| `kummut, kuopat,  ,` | 3 |
| `kuopat, nauriskuopat,  ,` | 3 |
| `kuopat, röykkiöt, talonpohjat,` | 3 |
| `kuopat, talonpohjat,  ,` | 3 |
| `kuppikivet, röykkiöt,  ,` | 3 |
| `kuppikivet, viljelyröykkiöt,  ,` | 3 |
| `kylänpaikat, pappilat,  ,` | 3 |
| `louhokset, röykkiöt,  ,` | 3 |
| `manufaktuurit,  ,  ,` | 3 |
| `paperitehtaat,  ,  ,` | 3 |
| `pikiruukit,  ,  ,` | 3 |
| `polttokenttäkalmistot, röykkiöt,  ,` | 3 |
| `puistot,  ,  ,` | 3 |
| `pyyntikuopat, seidat,  ,` | 3 |
| `rajamerkit, tarinapaikat,  ,` | 3 |
| `ristikivet,  ,  ,` | 3 |
| `ryssänuunit, röykkiöt,  ,` | 3 |
| `sillanpaikat, tienpohjat,  ,` | 3 |
| `sirpalekivikasat,  ,  ,` | 3 |
| `tarhakalmistot,  ,  ,` | 3 |
| `uunit, viljelyröykkiöt,  ,` | 3 |
| `, ei määritelty, kuopat,` | 2 |
| `, ei määritelty, kylänpaikat,` | 2 |
| `, ei määritelty, raudanvalmistuspaikat,` | 2 |
| `, ei määritelty, röykkiöt,` | 2 |
| `aallonmurtajat, kivivallit,  ,` | 2 |
| `asumuspainanteet, ei määritelty, kuopat,` | 2 |
| `asumuspainanteet, hautaröykkiöt,  ,` | 2 |
| `asumuspainanteet, hiilimiilut, pyyntikuopat,` | 2 |
| `asumuspainanteet, jätinkirkot,  ,` | 2 |
| `asumuspainanteet, kivivallit,  ,` | 2 |
| `asumuspainanteet, kivivallit, röykkiöt,` | 2 |
| `asumuspainanteet, rakkakuopat,  ,` | 2 |
| `ei määritelty, hautaröykkiöt, kuppikivet, kylänpaikat` | 2 |
| `ei määritelty, hautaröykkiöt, rakkakuopat,` | 2 |
| `ei määritelty, hautaröykkiöt, viljelyröykkiöt,` | 2 |
| `ei määritelty, hiilimiilut, pyyntikuopat,` | 2 |
| `ei määritelty, joukkohaudat,  ,` | 2 |
| `ei määritelty, kaivannot,  ,` | 2 |
| `ei määritelty, kalliomaalaukset,  ,` | 2 |
| `ei määritelty, kesähaudat, talonpohjat,` | 2 |
| `ei määritelty, kiviaidat,  ,` | 2 |
| `ei määritelty, kiviaidat, röykkiöt,` | 2 |
| `ei määritelty, kivivallit, röykkiöt,` | 2 |
| `ei määritelty, kuopat, pyyntikuopat,` | 2 |
| `ei määritelty, kätköt, polttokenttäkalmistot,` | 2 |
| `ei määritelty, laiturit,  ,` | 2 |
| `ei määritelty, latomukset, röykkiöt,` | 2 |
| `ei määritelty, lentokentät,  ,` | 2 |
| `ei määritelty, liesikiveykset, pyyntikuopat,` | 2 |
| `ei määritelty, liesilatomukset (árran),  ,` | 2 |
| `ei määritelty, lähteet,  ,` | 2 |
| `ei määritelty, muinaislinnat,  ,` | 2 |
| `ei määritelty, nauriskuopat, tervahaudat,` | 2 |
| `ei määritelty, pajat, raudanvalmistuspaikat,` | 2 |
| `ei määritelty, pappilat,  ,` | 2 |
| `ei määritelty, punamultahaudat, pyyntikuopat,` | 2 |
| `ei määritelty, punamultahaudat, raudanvalmistuspaikat,` | 2 |
| `ei määritelty, punamultahaudat, ruumiskalmistot,` | 2 |
| `ei määritelty, purnut,  ,` | 2 |
| `ei määritelty, pyyntikuopat, raudanvalmistuspaikat,` | 2 |
| `ei määritelty, pyyntikuopat, uunit,` | 2 |
| `ei määritelty, rakkakuopat, röykkiöt,` | 2 |
| `ei määritelty, rangaistuspaikat,  ,` | 2 |
| `ei määritelty, tulisijat,  ,` | 2 |
| `ei määritelty, vesimyllyt,  ,` | 2 |
| `ei määritelty, yksinäistalot,  ,` | 2 |
| `eräsijat, pyyntikuopat,  ,` | 2 |
| `eräsijat, tomtning-jäännökset,  ,` | 2 |
| `hakkaukset, tarinapaikat,  ,` | 2 |
| `harkkohytit,  ,  ,` | 2 |
| `hautaröykkiöt, keittokuopat,  ,` | 2 |
| `hautaröykkiöt, kuppikivet, kylänpaikat,` | 2 |
| `hautaröykkiöt, optiset lennätinasemat,  ,` | 2 |
| `hautaröykkiöt, talonpohjat,  ,` | 2 |
| `hautaröykkiöt, tervahaudat,  ,` | 2 |
| `hautasaaret, kesähaudat,  ,` | 2 |
| `hautausmaat, kirkkohaudat, kirkonpaikat,` | 2 |
| `hautausmaat, talonpohjat,  ,` | 2 |
| `hiilimiilut, kiukaat, tervahaudat,` | 2 |
| `hiilimiilut, pyyntikuopat, tervahaudat,` | 2 |
| `hiilimiilut, röykkiöt,  ,` | 2 |
| `hiilimiilut, talonpohjat, tervahaudat,` | 2 |
| `hiilimiilut, uunit,  ,` | 2 |
| `hiilimiilut, viljelyröykkiöt,  ,` | 2 |
| `irtolöytöpaikat, kuopat,  ,` | 2 |
| `joukkohaudat, muistomerkit,  ,` | 2 |
| `kartanot, puutarhat,  ,` | 2 |
| `kaskiröykkiöt, talonpohjat,  ,` | 2 |
| `keittokuopat, latomukset, röykkiöt,` | 2 |
| `kellarit, kuopat,  ,` | 2 |
| `kellarit, viljelyröykkiöt,  ,` | 2 |
| `kentät (gieddi), kodanpohjat,  ,` | 2 |
| `kentät (gieddi), seidat,  ,` | 2 |
| `kesähaudat, tarinapaikat,  ,` | 2 |
| `kirkkomaat,  ,  ,` | 2 |
| `kiukaat, röykkiöt,  ,` | 2 |
| `kiviaidat, kuopat,  ,` | 2 |
| `kiviaidat, louhokset,  ,` | 2 |
| `kivivallit, kuppikivet,  ,` | 2 |
| `kivivallit, torpat, viljelyröykkiöt,` | 2 |
| `kuopat, latomukset, röykkiöt,` | 2 |
| `kuopat, liesikiveykset,  ,` | 2 |
| `kuopat, rakkakuopat, röykkiöt,` | 2 |
| `kuopat, röykkiöt, viljelmät,` | 2 |
| `kuopat, tulisijat,  ,` | 2 |
| `kuopat, viljelyröykkiöt,  ,` | 2 |
| `kuparinsulattamot,  ,  ,` | 2 |
| `kuppikivet, torpat, viljelyröykkiöt,` | 2 |
| `laiturit, tienpohjat,  ,` | 2 |
| `latomukset, liesilatomukset (árran),  ,` | 2 |
| `latomukset, louhokset,  ,` | 2 |
| `latomukset, painanteet,  ,` | 2 |
| `liesikiveykset, purnut,  ,` | 2 |
| `louhokset, rakkakuopat,  ,` | 2 |
| `luostarinpaikat,  ,  ,` | 2 |
| `merimerkit, talonpohjat, valkamat,` | 2 |
| `muistomerkit, portaat,  ,` | 2 |
| `mäkituvat, torpat,  ,` | 2 |
| `nauriskuopat, tervahaudat,  ,` | 2 |
| `nauriskuopat, viljelmät,  ,` | 2 |
| `ortodoksikalmistot, tsasounanpaikat,  ,` | 2 |
| `painanteet, röykkiöt,  ,` | 2 |
| `painanteet, tervahaudat,  ,` | 2 |
| `piilopirtit, tervahaudat,  ,` | 2 |
| `piiskauspetäjät,  ,  ,` | 2 |
| `polttokenttäkalmistot, ruumiskalmistot,  ,` | 2 |
| `polttokenttäkalmistot, ruumiskalmistot, talonpohjat,` | 2 |
| `polttokenttäkalmistot, talonpohjat,  ,` | 2 |
| `purnut, pyyntikuopat,  ,` | 2 |
| `purnut, tulisijat,  ,` | 2 |
| `pyyntikuopat, tupasijat,  ,` | 2 |
| `rajamerkit, tervahaudat,  ,` | 2 |
| `rajamerkit, yksinäistalot,  ,` | 2 |
| `ruttohautausmaat,  ,  ,` | 2 |
| `ruumiskalmistot, röykkiöt,  ,` | 2 |
| `röykkiöt, tarinapaikat,  ,` | 2 |
| `röykkiöt, tomtning-jäännökset,  ,` | 2 |
| `salpietarikeittimöt,  ,  ,` | 2 |
| `sillanpaikat, vesimyllyt,  ,` | 2 |
| `suojahuoneet, tykkiasemat,  ,` | 2 |
| `taistelukaivannot, taistelupaikat,  ,` | 2 |
| `tervahaudat, torpat,  ,` | 2 |
| `tervahaudat, vallit,  ,` | 2 |
| `tervahaudat, vesimyllyt,  ,` | 2 |
| `terveyslähteet,  ,  ,` | 2 |
| `torpat, uunit,  ,` | 2 |
| `,  , ei määritelty,` | 1 |
| `,  , ei määritelty, kuppikivet` | 1 |
| `,  , kylänpaikat,` | 1 |
| `, asumuspainanteet, röykkiöt,` | 1 |
| `, ei määritelty, hautaröykkiöt,` | 1 |
| `, ei määritelty, keittokuopat,` | 1 |
| `, ei määritelty, latomukset,` | 1 |
| `, ei määritelty, lähteet,` | 1 |
| `, ei määritelty, muinaispellot,` | 1 |
| `, ei määritelty, painanteet, pyyntikuopat` | 1 |
| `, ei määritelty, panssariesteet, potaskauunit` | 1 |
| `, kellarit,  ,` | 1 |
| `, kellarit, kylänpaikat,` | 1 |
| `, kylänpaikat, latomukset, lähteet` | 1 |
| `asumuspainanteet,  , ei määritelty,` | 1 |
| `asumuspainanteet, ei määritelty,  , röykkiöt` | 1 |
| `asumuspainanteet, ei määritelty, hautasaaret,` | 1 |
| `asumuspainanteet, ei määritelty, kuopat, raudanvalmistuspaikat` | 1 |
| `asumuspainanteet, ei määritelty, kuopat, röykkiöt` | 1 |
| `asumuspainanteet, ei määritelty, polttohaudat,` | 1 |
| `asumuspainanteet, ei määritelty, punamultahaudat, pyyntikuopat` | 1 |
| `asumuspainanteet, ei määritelty, punamultahaudat, tervahaudat` | 1 |
| `asumuspainanteet, ei määritelty, rakkakuopat,` | 1 |
| `asumuspainanteet, hiilimiilut, punamultahaudat,` | 1 |
| `asumuspainanteet, hiilimiilut, tervahaudat,` | 1 |
| `asumuspainanteet, irtolöytöpaikat,  ,` | 1 |
| `asumuspainanteet, jatulintarhat, rakkakuopat,` | 1 |
| `asumuspainanteet, jätinkirkot, keittokuopat, röykkiöt` | 1 |
| `asumuspainanteet, jätinkirkot, kivivallit, rakkakuopat` | 1 |
| `asumuspainanteet, jätinkirkot, kivivallit, röykkiöt` | 1 |
| `asumuspainanteet, jätinkirkot, rakkakuopat,` | 1 |
| `asumuspainanteet, jätinkirkot, rakkakuopat, tervahaudat` | 1 |
| `asumuspainanteet, jätinkirkot, tervahaudat,` | 1 |
| `asumuspainanteet, keittokuopat, pyyntikuopat,` | 1 |
| `asumuspainanteet, kivivallit, rakkakuopat, röykkiöt` | 1 |
| `asumuspainanteet, kodanpohjat, ruumiskalmistot,` | 1 |
| `asumuspainanteet, kuopat, latomukset,` | 1 |
| `asumuspainanteet, kuopat, röykkiöt, tervahaudat` | 1 |
| `asumuspainanteet, kuopat, tienpohjat,` | 1 |
| `asumuspainanteet, kylänpaikat, röykkiöt,` | 1 |
| `asumuspainanteet, latomukset,  ,` | 1 |
| `asumuspainanteet, liesikiveykset, tulisijat,` | 1 |
| `asumuspainanteet, liesilatomukset (árran),  ,` | 1 |
| `asumuspainanteet, louhokset,  ,` | 1 |
| `asumuspainanteet, painanteet,  ,` | 1 |
| `asumuspainanteet, polttokenttäkalmistot,  ,` | 1 |
| `asumuspainanteet, punamultahaudat, pyyntikuopat,` | 1 |
| `asumuspainanteet, pyyntikuopat, raudanvalmistuspaikat,` | 1 |
| `asumuspainanteet, rakkakuopat, röykkiöt,` | 1 |
| `asumuspainanteet, ruumishaudat,  ,` | 1 |
| `asumuspainanteet, tupasijat,  ,` | 1 |
| `ei määritelty, hakkaukset, kalastuspaikat,` | 1 |
| `ei määritelty, hakkaukset, talonpohjat,` | 1 |
| `ei määritelty, hautakummut,  ,` | 1 |
| `ei määritelty, hautakummut, viljelmät,` | 1 |
| `ei määritelty, hautaröykkiöt, hiilimiilut, pyyntikuopat` | 1 |
| `ei määritelty, hautaröykkiöt, keittokuopat, tulisijat` | 1 |
| `ei määritelty, hautaröykkiöt, kiviaidat, kuppikivet` | 1 |
| `ei määritelty, hautaröykkiöt, kivivallit, kuppikivet` | 1 |
| `ei määritelty, hautaröykkiöt, kuppikivet, kätköt` | 1 |
| `ei määritelty, hautaröykkiöt, kuppikivet, rajamerkit` | 1 |
| `ei määritelty, hautaröykkiöt, kuppikivet, viljelyröykkiöt` | 1 |
| `ei määritelty, hautaröykkiöt, latomukset,` | 1 |
| `ei määritelty, hautaröykkiöt, muinaislinnat,` | 1 |
| `ei määritelty, hautaröykkiöt, palokuoppahaudat,` | 1 |
| `ei määritelty, hautaröykkiöt, palokuoppahaudat, ruumiskalmistot` | 1 |
| `ei määritelty, hautaröykkiöt, punamultahaudat,` | 1 |
| `ei määritelty, hautaröykkiöt, raudanvalmistuspaikat,` | 1 |
| `ei määritelty, hautaröykkiöt, ruumiskalmistot,` | 1 |
| `ei määritelty, hautaröykkiöt, tarhakalmistot,` | 1 |
| `ei määritelty, hautaröykkiöt, tienpohjat,` | 1 |
| `ei määritelty, hautaröykkiöt, uunit,` | 1 |
| `ei määritelty, hautasaaret, hiilimiilut,` | 1 |
| `ei määritelty, hautasaaret, kodanpohjat, pyyntikuopat` | 1 |
| `ei määritelty, hautasaaret, liesilatomukset (árran), pyyntikuopat` | 1 |
| `ei määritelty, hautasaaret, tervahaudat,` | 1 |
| `ei määritelty, hautausmaat,  ,` | 1 |
| `ei määritelty, hautausmaat, hiilimiilut,` | 1 |
| `ei määritelty, hautausmaat, kirkonpaikat,` | 1 |
| `ei määritelty, hiilimiilut, keittokuopat,` | 1 |
| `ei määritelty, hiilimiilut, keittokuopat, punamultahaudat` | 1 |
| `ei määritelty, hiilimiilut, muinaispellot,` | 1 |
| `ei määritelty, hiilimiilut, punamultahaudat,` | 1 |
| `ei määritelty, irtolöytöpaikat, röykkiöt,` | 1 |
| `ei määritelty, irtolöytöpaikat, tuulimyllyt,` | 1 |
| `ei määritelty, jätinkirkot,  ,` | 1 |
| `ei määritelty, jätinkirkot, kivivallit,` | 1 |
| `ei määritelty, jätinkirkot, röykkiöt,` | 1 |
| `ei määritelty, jätinkirkot, röykkiöt, tervahaudat` | 1 |
| `ei määritelty, kalastuspaikat,  ,` | 1 |
| `ei määritelty, kalastuspaikat, kummelit, tomtning-jäännökset` | 1 |
| `ei määritelty, kalastuspaikat, taistelukaivannot,` | 1 |
| `ei määritelty, kalastuspaikat, talonpohjat,` | 1 |
| `ei määritelty, kartanot, polttokenttäkalmistot,` | 1 |
| `ei määritelty, kaskiröykkiöt, kiviaidat, kuppikivet` | 1 |
| `ei määritelty, kaskiröykkiöt, röykkiöt,` | 1 |
| `ei määritelty, keittokuopat, kuopat,` | 1 |
| `ei määritelty, keittokuopat, kuopat, pyyntikuopat` | 1 |
| `ei määritelty, keittokuopat, latomukset,` | 1 |
| `ei määritelty, keittokuopat, louhokset, pyyntikuopat` | 1 |
| `ei määritelty, keittokuopat, punamultahaudat,` | 1 |
| `ei määritelty, keittokuopat, pyyntikuopat,` | 1 |
| `ei määritelty, keittokuopat, tervahaudat,` | 1 |
| `ei määritelty, kellarit,  ,` | 1 |
| `ei määritelty, kentät (gieddi), kodanpohjat, talvikylät` | 1 |
| `ei määritelty, kentät (gieddi), röykkiöt,` | 1 |
| `ei määritelty, kentät (gieddi), talonpohjat,` | 1 |
| `ei määritelty, kesähaudat, kodanpohjat, pyyntikuopat` | 1 |
| `ei määritelty, kirkonpaikat, kuppikalliot,` | 1 |
| `ei määritelty, kirkonpaikat, muinaispellot, röykkiöt` | 1 |
| `ei määritelty, kirkonpaikat, muistomerkit,` | 1 |
| `ei määritelty, kirkonpaikat, ruumiskalmistot,` | 1 |
| `ei määritelty, kiukaat, kuopat,` | 1 |
| `ei määritelty, kiukaat, röykkiöt,` | 1 |
| `ei määritelty, kiukaat, viljelyröykkiöt,` | 1 |
| `ei määritelty, kiviaidat, viljelyröykkiöt,` | 1 |
| `ei määritelty, kivilatomukset, kuppikalliot, polttokenttäkalmistot` | 1 |
| `ei määritelty, kivilatomukset, polttokenttäkalmistot,` | 1 |
| `ei määritelty, kivilatomukset, polttokenttäkalmistot, ruumishaudat` | 1 |
| `ei määritelty, kivivallit, rakkakuopat,` | 1 |
| `ei määritelty, kivivallit, sudenkuopat,` | 1 |
| `ei määritelty, kivivarustukset,  ,` | 1 |
| `ei määritelty, kodanpohjat,  ,` | 1 |
| `ei määritelty, kodanpohjat, kuopat, pyyntikuopat` | 1 |
| `ei määritelty, kodanpohjat, pyyntikuopat, tulisijat` | 1 |
| `ei määritelty, kodanpohjat, rakkakuopat,` | 1 |
| `ei määritelty, kompassiruusut,  ,` | 1 |
| `ei määritelty, kummelit,  ,` | 1 |
| `ei määritelty, kummelit, rakkakuopat,` | 1 |
| `ei määritelty, kummut, röykkiöt,` | 1 |
| `ei määritelty, kuopat, latomukset,` | 1 |
| `ei määritelty, kuopat, liesilatomukset (árran),` | 1 |
| `ei määritelty, kuopat, nauriskuopat, viljelyröykkiöt` | 1 |
| `ei määritelty, kuopat, painanteet,` | 1 |
| `ei määritelty, kuopat, rajamerkit,` | 1 |
| `ei määritelty, kuopat, rajamerkit, viljelyröykkiöt` | 1 |
| `ei määritelty, kuopat, röykkiöt,` | 1 |
| `ei määritelty, kuopat, talonpohjat, tervahaudat` | 1 |
| `ei määritelty, kuopat, tervahaudat,` | 1 |
| `ei määritelty, kuopat, tulisijat,` | 1 |
| `ei määritelty, kuppikalliot, polttokenttäkalmistot,` | 1 |
| `ei määritelty, kuppikivet, louhokset, polttokenttäkalmistot` | 1 |
| `ei määritelty, kuppikivet, muinaislinnat,` | 1 |
| `ei määritelty, kuppikivet, muinaispellot,` | 1 |
| `ei määritelty, kuppikivet, polttokenttäkalmistot, ruumiskalmistot` | 1 |
| `ei määritelty, kuppikivet, punamultahaudat,` | 1 |
| `ei määritelty, kuppikivet, ruumiskalmistot,` | 1 |
| `ei määritelty, käräjäpaikat, palokuoppahaudat, polttohaudat` | 1 |
| `ei määritelty, käräjäpaikat, polttokenttäkalmistot,` | 1 |
| `ei määritelty, latomukset, liesikiveykset, liesilatomukset (árran)` | 1 |
| `ei määritelty, liesikiveykset, liesilatomukset (árran),` | 1 |
| `ei määritelty, liesikiveykset, pyyntikuopat, raudanvalmistuspaikat` | 1 |
| `ei määritelty, linnoitukset,  ,` | 1 |
| `ei määritelty, louhokset, pyyntikuopat,` | 1 |
| `ei määritelty, louhokset, rakkakuopat,` | 1 |
| `ei määritelty, majakat,  ,` | 1 |
| `ei määritelty, muinaislinnat, röykkiöt,` | 1 |
| `ei määritelty, muinaispellot, talonpohjat,` | 1 |
| `ei määritelty, muinaispellot, viljelyröykkiöt,` | 1 |
| `ei määritelty, muistomerkit,  ,` | 1 |
| `ei määritelty, nauriskuopat,  ,` | 1 |
| `ei määritelty, optiset lennätinasemat,  ,` | 1 |
| `ei määritelty, ortodoksikalmistot, tsasounanpaikat,` | 1 |
| `ei määritelty, ortodoksikalmistot, viljelyröykkiöt,` | 1 |
| `ei määritelty, painanteet, röykkiöt,` | 1 |
| `ei määritelty, pajat, polttokenttäkalmistot, röykkiöt` | 1 |
| `ei määritelty, palokuoppahaudat, polttokenttäkalmistot, ruumiskalmistot` | 1 |
| `ei määritelty, polttokenttäkalmistot, raudanvalmistuspaikat,` | 1 |
| `ei määritelty, polttokenttäkalmistot, uhrikivet,` | 1 |
| `ei määritelty, poroaidat,  ,` | 1 |
| `ei määritelty, punamultahaudat, taistelukaivannot,` | 1 |
| `ei määritelty, purnut, pyyntikuopat,` | 1 |
| `ei määritelty, purnut, tulisijat,` | 1 |
| `ei määritelty, pyyntikuopat, rajamerkit, tervahaudat` | 1 |
| `ei määritelty, pyyntikuopat, seidat,` | 1 |
| `ei määritelty, pyyntikuopat, taistelukaivannot,` | 1 |
| `ei määritelty, pyyntikuopat, talonpohjat,` | 1 |
| `ei määritelty, pyyntikuopat, talvikylät,` | 1 |
| `ei määritelty, pyyntikuopat, tupasijat,` | 1 |
| `ei määritelty, pyyntitukikohdat,  ,` | 1 |
| `ei määritelty, rakkakuopat, tervahaudat,` | 1 |
| `ei määritelty, rakkakuopat, tomtning-jäännökset, tulisijat` | 1 |
| `ei määritelty, raudanvalmistuspaikat, talonpohjat,` | 1 |
| `ei määritelty, rautaruukit,  ,` | 1 |
| `ei määritelty, ruumiskalmistot, virkatalot,` | 1 |
| `ei määritelty, ryssänuunit, röykkiöt,` | 1 |
| `ei määritelty, sillanpaikat,  ,` | 1 |
| `ei määritelty, suojahuoneet,  ,` | 1 |
| `ei määritelty, taistelukaivannot,  ,` | 1 |
| `ei määritelty, taistelupaikat,  ,` | 1 |
| `ei määritelty, talonpohjat, tervahaudat,` | 1 |
| `ei määritelty, tomtning-jäännökset,  ,` | 1 |
| `ei määritelty, tulipesäkkeet,  ,` | 1 |
| `ei määritelty, tuulimyllyt,  ,` | 1 |
| `ei määritelty, tykkiasemat,  ,` | 1 |
| `ei määritelty, valkamat,  ,` | 1 |
| `ei määritelty, vallit,  ,` | 1 |
| `ei määritelty, viljelmät,  ,` | 1 |
| `eräsijat,  , kätköt,` | 1 |
| `eräsijat, hautasaaret, tarinapaikat,` | 1 |
| `eräsijat, hiilimiilut,  ,` | 1 |
| `eräsijat, hiilimiilut, tervahaudat,` | 1 |
| `eräsijat, jatulintarhat, kalkkiuunit, merimerkit` | 1 |
| `eräsijat, kalastuspaikat,  ,` | 1 |
| `eräsijat, kalastuspaikat, purnut, talonpohjat` | 1 |
| `eräsijat, kiukaat,  ,` | 1 |
| `eräsijat, kuopat, uunit,` | 1 |
| `hakkaukset, hautaröykkiöt,  ,` | 1 |
| `hakkaukset, jatulintarhat, kompassiruusut,` | 1 |
| `hakkaukset, kalliopiirrokset,  ,` | 1 |
| `hakkaukset, kestikievarit, ryssänuunit,` | 1 |
| `hakkaukset, kiviaidat, latomukset,` | 1 |
| `hakkaukset, kylänpaikat, merimerkit, talonpohjat` | 1 |
| `hakkaukset, latomukset,  ,` | 1 |
| `hakkaukset, linnakkeet,  ,` | 1 |
| `hakkaukset, linnoitukset,  ,` | 1 |
| `hakkaukset, louhokset, rajamerkit,` | 1 |
| `hakkaukset, merimerkit, röykkiöt,` | 1 |
| `hakkaukset, merimerkit, talonpohjat,` | 1 |
| `hakkaukset, rajamerkit, vesimyllyt,` | 1 |
| `hakkaukset, tulisijat,  ,` | 1 |
| `hakkaukset, tuulimyllyt,  ,` | 1 |
| `hakkaukset, yksinäistalot,  ,` | 1 |
| `harkkohytit, hiilimiilut, raudanvalmistuspaikat,` | 1 |
| `harkkohytit, rautaruukit,  ,` | 1 |
| `hautakummut, kentät (gieddi),  ,` | 1 |
| `hautakummut, kuppikivet,  ,` | 1 |
| `hautakummut, kylänpaikat,  ,` | 1 |
| `hautakummut, polttokenttäkalmistot,  ,` | 1 |
| `hautaröykkiöt, hiilimiilut,  ,` | 1 |
| `hautaröykkiöt, irtolöytöpaikat,  ,` | 1 |
| `hautaröykkiöt, jätinkirkot,  ,` | 1 |
| `hautaröykkiöt, kaskiröykkiöt,  ,` | 1 |
| `hautaröykkiöt, kellarit,  ,` | 1 |
| `hautaröykkiöt, kellarit, tienpohjat,` | 1 |
| `hautaröykkiöt, kiviaidat,  ,` | 1 |
| `hautaröykkiöt, kivilatomukset,  ,` | 1 |
| `hautaröykkiöt, kivilatomukset, palokuoppahaudat, tarhakalmistot` | 1 |
| `hautaröykkiöt, kivilatomukset, polttokenttäkalmistot,` | 1 |
| `hautaröykkiöt, kivipöydät,  ,` | 1 |
| `hautaröykkiöt, kivivarustukset,  ,` | 1 |
| `hautaröykkiöt, kuppikivet, muinaislinnat, muinaispellot` | 1 |
| `hautaröykkiöt, kuppikivet, muinaispellot, talonpohjat` | 1 |
| `hautaröykkiöt, kuppikivet, talonpohjat, viljelyröykkiöt` | 1 |
| `hautaröykkiöt, linnavuoret,  ,` | 1 |
| `hautaröykkiöt, linnoitukset, polttokenttäkalmistot,` | 1 |
| `hautaröykkiöt, merimerkit,  ,` | 1 |
| `hautaröykkiöt, palokuoppahaudat, polttokenttäkalmistot,` | 1 |
| `hautaröykkiöt, ruumishaudat,  ,` | 1 |
| `hautaröykkiöt, ryssänuunit, veneenvetopaikat,` | 1 |
| `hautaröykkiöt, röykkiöt, viljelyröykkiöt,` | 1 |
| `hautaröykkiöt, taistelukaivannot,  ,` | 1 |
| `hautaröykkiöt, tarhakalmistot,  ,` | 1 |
| `hautasaaret, ortodoksikalmistot,  ,` | 1 |
| `hautasaaret, tarinapaikat,  ,` | 1 |
| `hautausmaat, hospitaalit ja sairaalat, kirkonpaikat,` | 1 |
| `hautausmaat, joukkohaudat, kirkonpaikat,` | 1 |
| `hautausmaat, kaivannot, kuopat,` | 1 |
| `hautausmaat, kaupungit, kirkonpaikat, linnoitukset` | 1 |
| `hautausmaat, kirkkohaudat, kirkonpaikat, ruumiskalmistot` | 1 |
| `hautausmaat, kirkonpaikat, kodanpohjat, markkinapaikat` | 1 |
| `hautausmaat, kirkonpaikat, käräjäpaikat,` | 1 |
| `hautausmaat, kirkonpaikat, markkinapaikat,` | 1 |
| `hautausmaat, kirkonpaikat, pappilat,` | 1 |
| `hautausmaat, kirkonpaikat, ruumiskalmistot,` | 1 |
| `hautausmaat, kirkonrauniot,  ,` | 1 |
| `hautausmaat, kirkonrauniot, ruumiskalmistot,` | 1 |
| `hautausmaat, kivilatomukset,  ,` | 1 |
| `hautausmaat, muistomerkit,  ,` | 1 |
| `hautausmaat, muistomerkit, taistelukaivannot,` | 1 |
| `hautausmaat, polttokenttäkalmistot, potaskauunit,` | 1 |
| `hautausmaat, tienpohjat,  ,` | 1 |
| `hautausmaat, tsasounanpaikat,  ,` | 1 |
| `hautausmaat, uhrikivet,  ,` | 1 |
| `hiilimiilut, höyrysahat, laiturit, ratapohjat` | 1 |
| `hiilimiilut, kaivannot,  ,` | 1 |
| `hiilimiilut, kaivot, kellarit,` | 1 |
| `hiilimiilut, kaivot, tervahaudat,` | 1 |
| `hiilimiilut, kalastuspaikat, kaskiröykkiöt, purnut` | 1 |
| `hiilimiilut, kaskiröykkiöt, kuopat, tervahaudat` | 1 |
| `hiilimiilut, kuopat, taistelukaivannot,` | 1 |
| `hiilimiilut, nauriskuopat, röykkiöt,` | 1 |
| `hiilimiilut, painanteet,  ,` | 1 |
| `hiilimiilut, painanteet, tervahaudat,` | 1 |
| `hiilimiilut, potaskauunit,  ,` | 1 |
| `hiilimiilut, potaskauunit, röykkiöt,` | 1 |
| `hiilimiilut, rajamerkit, tervahaudat,` | 1 |
| `hiilimiilut, raudanvalmistuspaikat, tervahaudat,` | 1 |
| `hiilimiilut, talonpohjat,  ,` | 1 |
| `hiilimiilut, tervahaudat, torpat,` | 1 |
| `hirsivarustukset, hylyt (puu),  ,` | 1 |
| `hospitaalit ja sairaalat, kirkonpaikat, kiviaidat,` | 1 |
| `hylyt (puu), valkamat,  ,` | 1 |
| `höyrysahat, savupiiput,  ,` | 1 |
| `höyrysahat, talonpohjat,  ,` | 1 |
| `irtolöytöpaikat, kentät (gieddi),  ,` | 1 |
| `irtolöytöpaikat, kylänpaikat,  ,` | 1 |
| `irtolöytöpaikat, polttokenttäkalmistot,  ,` | 1 |
| `irtolöytöpaikat, röykkiöt,  ,` | 1 |
| `irtolöytöpaikat, talonpohjat,  ,` | 1 |
| `jatulintarhat, kalastuspaikat, kompassiruusut, merimerkit` | 1 |
| `jatulintarhat, kalastuspaikat, rakkakuopat, talonpohjat` | 1 |
| `jatulintarhat, karsikkopaikat,  ,` | 1 |
| `jatulintarhat, kivivallit, röykkiöt, tomtning-jäännökset` | 1 |
| `jatulintarhat, kompassiruusut,  ,` | 1 |
| `jatulintarhat, kompassiruusut, kummelit,` | 1 |
| `jatulintarhat, kompassiruusut, ryssänuunit,` | 1 |
| `jatulintarhat, kompassiruusut, tomtning-jäännökset,` | 1 |
| `jatulintarhat, latomukset, röykkiöt,` | 1 |
| `jatulintarhat, purnut,  ,` | 1 |
| `joukkohaudat, ruttohautausmaat,  ,` | 1 |
| `joukkohaudat, yksinäistalot,  ,` | 1 |
| `jätinkirkot, kivivallit, latomukset, rakkakuopat` | 1 |
| `kaivannot, kiukaat, tervahaudat,` | 1 |
| `kaivannot, kiviaidat, rajamerkit,` | 1 |
| `kaivannot, kiviaidat, talonpohjat, viljelyröykkiöt` | 1 |
| `kaivannot, kivivallit, röykkiöt, tarinapaikat` | 1 |
| `kaivannot, kuopat,  ,` | 1 |
| `kaivannot, nauriskuopat,  ,` | 1 |
| `kaivannot, röykkiöt,  ,` | 1 |
| `kaiverrukset, kalliomaalaukset, luolat, tarinapaikat` | 1 |
| `kaiverrukset, karjamajat, tervahaudat,` | 1 |
| `kaiverrukset, karsikkopaikat,  ,` | 1 |
| `kaiverrukset, kuppikalliot,  ,` | 1 |
| `kaiverrukset, muinaislinnat,  ,` | 1 |
| `kaiverrukset, polttohaudat,  ,` | 1 |
| `kaiverrukset, rajamerkit,  ,` | 1 |
| `kaiverrukset, tarinapaikat,  ,` | 1 |
| `kaiverrukset, valkamat,  ,` | 1 |
| `kaivot, kalastuspaikat, merimerkit, talonpohjat` | 1 |
| `kaivot, kalastuspaikat, ruumishaudat,` | 1 |
| `kaivot, kellarit,  ,` | 1 |
| `kaivot, yksinäistalot,  ,` | 1 |
| `kalastuspaikat, kellarit, kummut, kuopat` | 1 |
| `kalastuspaikat, kummelit, rakkakuopat, tomtning-jäännökset` | 1 |
| `kalastuspaikat, lapinpadot,  ,` | 1 |
| `kalastuspaikat, merimerkit,  ,` | 1 |
| `kalastuspaikat, merimerkit, röykkiöt, talonpohjat` | 1 |
| `kalastuspaikat, pyyntitukikohdat, talonpohjat,` | 1 |
| `kalastuspaikat, rajamerkit, talonpohjat, valkamat` | 1 |
| `kalastuspaikat, ruuhet,  ,` | 1 |
| `kalastuspaikat, uunit,  ,` | 1 |
| `kalastuspaikat, vesimyllyt,  ,` | 1 |
| `kalastuspaikat, viljelmät, viljelyröykkiöt,` | 1 |
| `kalkkiuunit, laiturit,  ,` | 1 |
| `kalkkiuunit, talonpohjat, tomtning-jäännökset,` | 1 |
| `kalkkiuunit, tiilitehtaat,  ,` | 1 |
| `kalliomaalaukset, linnavuoret,  ,` | 1 |
| `kalliopiirrokset, kuppikivet, röykkiöt,` | 1 |
| `kanavat, taistelukaivannot,  ,` | 1 |
| `kanavat, vesisahat,  ,` | 1 |
| `karjamajat, tervahaudat, viljelyröykkiöt,` | 1 |
| `karsikkopaikat, talonpohjat,  ,` | 1 |
| `kartanot, kellarit,  ,` | 1 |
| `kartanot, kivilinnat,  ,` | 1 |
| `kartanot, kivivallit, tienpohjat,` | 1 |
| `kartanot, kuninkaankartanot,  ,` | 1 |
| `kartanot, kylänpaikat, markkinapaikat,` | 1 |
| `kartanot, paperitehtaat,  ,` | 1 |
| `kartanot, polttokenttäkalmistot,  ,` | 1 |
| `kartanot, talonpohjat,  ,` | 1 |
| `kaskiröykkiöt, kellarit,  ,` | 1 |
| `kaskiröykkiöt, kellarit, talonpohjat,` | 1 |
| `kaskiröykkiöt, kirkonpaikat,  ,` | 1 |
| `kaskiröykkiöt, kiukaat, kiviaidat, talonpohjat` | 1 |
| `kaskiröykkiöt, kiviaidat, nauriskuopat,` | 1 |
| `kaskiröykkiöt, kivivallit, nauriskuopat, talonpohjat` | 1 |
| `kaskiröykkiöt, kuopat,  ,` | 1 |
| `kaskiröykkiöt, kuopat, talonpohjat,` | 1 |
| `kaskiröykkiöt, röykkiöt,  ,` | 1 |
| `kaskiröykkiöt, tervahaudat, viljelyröykkiöt,` | 1 |
| `kaskiröykkiöt, torpat,  ,` | 1 |
| `kaskiröykkiöt, viljelyröykkiöt,  ,` | 1 |
| `kaupungit, kirkonpaikat,  ,` | 1 |
| `kaupungit, kylänpaikat,  ,` | 1 |
| `kaupungit, linnoitukset,  ,` | 1 |
| `keittokuopat, kodanpohjat, liesikiveykset, pyyntikuopat` | 1 |
| `keittokuopat, kodanpohjat, liesilatomukset (árran), pyyntikuopat` | 1 |
| `keittokuopat, liesilatomukset (árran), pyyntikuopat,` | 1 |
| `keittokuopat, pyyntikuopat, tervahaudat,` | 1 |
| `keittokuopat, rakkakuopat, röykkiöt,` | 1 |
| `keittokuopat, tervahaudat,  ,` | 1 |
| `kellarit, kellotapulinpaikat, kirkkomaat, polttohaudat` | 1 |
| `kellarit, kiukaat, tervahaudat, uunit` | 1 |
| `kellarit, kiviaidat,  ,` | 1 |
| `kellarit, kiviaidat, talonpohjat, viljelyröykkiöt` | 1 |
| `kellarit, kuninkaankartanot,  ,` | 1 |
| `kellarit, kuopat, talonpohjat,` | 1 |
| `kellarit, kuopat, uunit, viljelyröykkiöt` | 1 |
| `kellarit, kylänpaikat,  ,` | 1 |
| `kellarit, latomukset, röykkiöt,` | 1 |
| `kellarit, merimerkit,  ,` | 1 |
| `kellarit, polut,  ,` | 1 |
| `kellarit, röykkiöt,  ,` | 1 |
| `kellarit, talonpohjat, valkamat,` | 1 |
| `kellarit, talonpohjat, viljelyröykkiöt,` | 1 |
| `kellarit, torpat,  ,` | 1 |
| `kellarit, torpat, vesimyllyt, vesisahat` | 1 |
| `kellotapulinpaikat,  ,  ,` | 1 |
| `kellotapulinpaikat, kirkkohaudat, kirkkomaat, kirkonpaikat` | 1 |
| `kentät (gieddi), kirkonpaikat, kodanpohjat, tupasijat` | 1 |
| `kentät (gieddi), latomukset,  ,` | 1 |
| `kentät (gieddi), latomukset, pyyntikuopat,` | 1 |
| `kentät (gieddi), rajamerkit,  ,` | 1 |
| `kentät (gieddi), yksinäistalot,  ,` | 1 |
| `keramiikkatehtaat,  ,  ,` | 1 |
| `kestikievarit, kylänpaikat,  ,` | 1 |
| `kesähaudat, kiviaidat, tarinapaikat, tervahaudat` | 1 |
| `kesähaudat, rajamerkit,  ,` | 1 |
| `kiinnitysrenkaat, laiturit, laivanrakennuspaikat,` | 1 |
| `kiinnitysrenkaat, talonpohjat,  ,` | 1 |
| `kiinnitysrenkaat, tienpohjat, valkamat,` | 1 |
| `kirkkohaudat, kirkonpaikat, muistomerkit,` | 1 |
| `kirkonpaikat, kylänpaikat,  ,` | 1 |
| `kirkonpaikat, kylänpaikat, ortodoksikalmistot,` | 1 |
| `kirkonpaikat, markkinapaikat,  ,` | 1 |
| `kirkonpaikat, markkinapaikat, muistopaikat,` | 1 |
| `kirkonpaikat, muistomerkit,  ,` | 1 |
| `kirkonpaikat, ortodoksikalmistot,  ,` | 1 |
| `kirkonpaikat, polttohaudat, ruumiskalmistot,` | 1 |
| `kirkonpaikat, ruumishaudat, ruumiskalmistot,` | 1 |
| `kirkonpaikat, tarinapaikat,  ,` | 1 |
| `kiukaat, kiviaidat, viljelyröykkiöt,` | 1 |
| `kiukaat, kuopat, röykkiöt,` | 1 |
| `kiukaat, latomukset,  ,` | 1 |
| `kiukaat, latomukset, röykkiöt,` | 1 |
| `kiukaat, muinaislinnat,  ,` | 1 |
| `kiukaat, pyyntikuopat,  ,` | 1 |
| `kiukaat, pyyntikuopat, tulisijat,` | 1 |
| `kiukaat, röykkiöt, talonpohjat,` | 1 |
| `kiukaat, tarinapaikat, tervahaudat, uunit` | 1 |
| `kiukaat, tomtning-jäännökset, viljelyröykkiöt,` | 1 |
| `kiukaat, torpat,  ,` | 1 |
| `kiukaat, viljelyröykkiöt,  ,` | 1 |
| `kiviaidat,  , kuopat, viljelyröykkiöt` | 1 |
| `kiviaidat, kivimuurit, röykkiöt, talonpohjat` | 1 |
| `kiviaidat, kuopat, röykkiöt,` | 1 |
| `kiviaidat, kylänpaikat, louhokset, salpietarikeittimöt` | 1 |
| `kiviaidat, muinaispellot,  ,` | 1 |
| `kiviaidat, nauriskuopat,  ,` | 1 |
| `kiviaidat, rajamerkit,  ,` | 1 |
| `kiviaidat, röykkiöt, tarinapaikat,` | 1 |
| `kiviaidat, talonpohjat, tervahaudat, viljelyröykkiöt` | 1 |
| `kiviaidat, tervahaudat,  ,` | 1 |
| `kiviaidat, tienpohjat,  ,` | 1 |
| `kiviaidat, uunit, viljelyröykkiöt,` | 1 |
| `kiviaidat, viljelmät,  ,` | 1 |
| `kiviaidat, viljelmät, viljelyröykkiöt,` | 1 |
| `kiviaidat, viljelyröykkiöt, yksinäistalot,` | 1 |
| `kiviaidat, yksinäistalot,  ,` | 1 |
| `kivilatomukset, kylänpaikat, muinaispellot, röykkiöt` | 1 |
| `kivimuurit, röykkiöt,  ,` | 1 |
| `kivimuurit, talonpohjat,  ,` | 1 |
| `kivimuurit, tienpohjat, torpat,` | 1 |
| `kivipöydät, merkkipuut,  ,` | 1 |
| `kivipöydät, rakkakuopat,  ,` | 1 |
| `kivivallit, kuopat,  ,` | 1 |
| `kivivallit, painanteet, röykkiöt,` | 1 |
| `kivivallit, rakkakuopat,  ,` | 1 |
| `kivivallit, ryssänuunit,  ,` | 1 |
| `kivivallit, ryssänuunit, röykkiöt, satamat` | 1 |
| `kivivallit, ryssänuunit, röykkiöt, uunit` | 1 |
| `kivivallit, röykkiöt, tomtning-jäännökset,` | 1 |
| `kivivallit, sillat,  ,` | 1 |
| `kivivallit, tuulimyllyt,  ,` | 1 |
| `kivivallit, vallit,  ,` | 1 |
| `kivivallit, viljelyröykkiöt,  ,` | 1 |
| `kodanpohjat, liesilatomukset (árran),  ,` | 1 |
| `kodanpohjat, liesilatomukset (árran), pyyntikuopat,` | 1 |
| `kodanpohjat, louhokset,  ,` | 1 |
| `kodanpohjat, purnut,  ,` | 1 |
| `kodanpohjat, röykkiöt,  ,` | 1 |
| `kodanpohjat, talvikylät,  ,` | 1 |
| `kodanpohjat, vesimyllyt,  ,` | 1 |
| `kompassiruusut, talonpohjat,  ,` | 1 |
| `korsut, maavallit, taistelukaivannot, tulipesäkkeet` | 1 |
| `korsut, ratapohjat,  ,` | 1 |
| `korsut, taistelukaivannot,  ,` | 1 |
| `korsut, tervahaudat,  ,` | 1 |
| `korsut, tulipesäkkeet,  ,` | 1 |
| `kummelit, tomtning-jäännökset, valkamat,` | 1 |
| `kummut, rajamerkit,  ,` | 1 |
| `kummut, talonpohjat,  ,` | 1 |
| `kuninkaankartanot, pappilat, virkatalot,` | 1 |
| `kuonakasat, tulipesäkkeet,  ,` | 1 |
| `kuopat, liesikiveykset, tulisijat,` | 1 |
| `kuopat, painanteet,  ,` | 1 |
| `kuopat, painanteet, tervahaudat,` | 1 |
| `kuopat, pikiruukit,  ,` | 1 |
| `kuopat, rajamerkit, tervahaudat,` | 1 |
| `kuopat, röykkiöt, tervahaudat,` | 1 |
| `kuopat, talonpohjat, tervahaudat,` | 1 |
| `kuopat, viljelmät,  ,` | 1 |
| `kuparinsulattamot, rautaruukit,  ,` | 1 |
| `kuppikalliot, kylänpaikat,  ,` | 1 |
| `kuppikalliot, lapinrauniot,  ,` | 1 |
| `kuppikalliot, polttokenttäkalmistot, ruumiskalmistot,` | 1 |
| `kuppikivet, kylänpaikat,  ,` | 1 |
| `kuppikivet, kylänpaikat, polttokenttäkalmistot,` | 1 |
| `kuppikivet, muinaispellot, viljelmät,` | 1 |
| `kuppikivet, painanteet,  ,` | 1 |
| `kuppikivet, palokuoppahaudat,  ,` | 1 |
| `kylänpaikat, kätköt,  ,` | 1 |
| `kylänpaikat, latomukset,  ,` | 1 |
| `kylänpaikat, markkinapaikat,  ,` | 1 |
| `kylänpaikat, markkinapaikat, torpat,` | 1 |
| `kylänpaikat, muinaislinnat,  ,` | 1 |
| `kylänpaikat, mäkituvat,  ,` | 1 |
| `kylänpaikat, pajat,  ,` | 1 |
| `kylänpaikat, pappilat, ruumiskalmistot,` | 1 |
| `kylänpaikat, raudanvalmistuspaikat, röykkiöt, viljelmät` | 1 |
| `kylänpaikat, talonpohjat,  ,` | 1 |
| `kylänpaikat, uunit,  ,` | 1 |
| `kylänpaikat, vallit,  ,` | 1 |
| `kylänpaikat, vesimyllyt,  ,` | 1 |
| `kylänpaikat, viljelyröykkiöt,  ,` | 1 |
| `käräjäpaikat, louhokset,  ,` | 1 |
| `kätköt, pappilat,  ,` | 1 |
| `kätköt, polttohaudat,  ,` | 1 |
| `kätköt, polttokenttäkalmistot,  ,` | 1 |
| `kätköt, tarinapaikat,  ,` | 1 |
| `laiturit, lähteet, tervahaudat, vesimyllyt` | 1 |
| `laiturit, valkamat,  ,` | 1 |
| `laivalatomukset,  ,  ,` | 1 |
| `laivanrakennuspaikat, satamat,  ,` | 1 |
| `laivanrakennuspaikat, telakat,  ,` | 1 |
| `lapinrauniot, rajamerkit,  ,` | 1 |
| `lapinrauniot, röykkiöt,  ,` | 1 |
| `latomukset, liesikiveykset,  ,` | 1 |
| `latomukset, liesilatomukset (árran), pyyntikuopat,` | 1 |
| `latomukset, maanmittauspisteet,  ,` | 1 |
| `latomukset, piilopirtit,  ,` | 1 |
| `latomukset, purnut,  ,` | 1 |
| `latomukset, purnut, pyyntikuopat,` | 1 |
| `latomukset, rajamerkit,  ,` | 1 |
| `latomukset, rakkakuopat, röykkiöt,` | 1 |
| `latomukset, rakkakuopat, tomtning-jäännökset,` | 1 |
| `latomukset, röykkiöt, talonpohjat,` | 1 |
| `latomukset, talonpohjat,  ,` | 1 |
| `latomukset, uunit,  ,` | 1 |
| `liesikiveykset, liesilatomukset (árran),  ,` | 1 |
| `liesikiveykset, liesilatomukset (árran), pyyntikuopat,` | 1 |
| `linnamalmit,  ,  ,` | 1 |
| `linnat, satamat,  ,` | 1 |
| `linnoitukset, yhdyshaudat,  ,` | 1 |
| `louhokset, ruumiskalmistot,  ,` | 1 |
| `louhokset, sirpalekivikasat,  ,` | 1 |
| `louhokset, tienpohjat,  ,` | 1 |
| `louhokset, uunit,  ,` | 1 |
| `lähteet, ortodoksikalmistot,  ,` | 1 |
| `lähteet, röykkiöt,  ,` | 1 |
| `maanmittauspisteet, röykkiöt, tarinapaikat,` | 1 |
| `manufaktuurit, vesimyllyt,  ,` | 1 |
| `markkinapaikat, pappilat,  ,` | 1 |
| `masuunit, raudanvalmistuspaikat,  ,` | 1 |
| `masuunit, vesimyllyt,  ,` | 1 |
| `merimerkit, purnut, talonpohjat, valkamat` | 1 |
| `merimerkit, röykkiöt,  ,` | 1 |
| `merkkikivet, merkkipuut, polut,` | 1 |
| `merkkikivet, talonpohjat,  ,` | 1 |
| `muinaislinnat, polttohaudat, talonpohjat,` | 1 |
| `muinaispellot, talonpohjat,  ,` | 1 |
| `muinaispellot, viljelyröykkiöt,  ,` | 1 |
| `muistomerkit, rajamerkit,  ,` | 1 |
| `muistomerkit, rangaistuspaikat,  ,` | 1 |
| `muistopaikat, piilopirtit,  ,` | 1 |
| `muistopaikat, rajamerkit,  ,` | 1 |
| `nauriskuopat, rajamerkit,  ,` | 1 |
| `nauriskuopat, röykkiöt, talonpohjat,` | 1 |
| `nauriskuopat, torpat,  ,` | 1 |
| `nauriskuopat, viljelyröykkiöt, yksinäistalot,` | 1 |
| `ortodoksikalmistot, raudanvalmistuspaikat,  ,` | 1 |
| `ortodoksikalmistot, viljelyröykkiöt,  ,` | 1 |
| `painanteet, pyyntikuopat,  ,` | 1 |
| `painanteet, rakkakuopat, röykkiöt,` | 1 |
| `pajat, raudanvalmistuspaikat,  ,` | 1 |
| `palokuoppahaudat,  ,  ,` | 1 |
| `palokuoppahaudat, polttokenttäkalmistot,  ,` | 1 |
| `panssariesteet, sillat, taistelupaikat, vesimyllyt` | 1 |
| `paperitehtaat, rajamerkit,  ,` | 1 |
| `pappilat, röykkiöt,  ,` | 1 |
| `pappilat, taistelupaikat,  ,` | 1 |
| `piilopirtit, tarinapaikat,  ,` | 1 |
| `piilopirtit, vesimyllyt,  ,` | 1 |
| `polttohaudat, ruumishaudat,  ,` | 1 |
| `polttohaudat, ruumiskalmistot,  ,` | 1 |
| `polttokenttäkalmistot, raudanvalmistuspaikat, ruumiskalmistot,` | 1 |
| `polttokenttäkalmistot, ruumishaudat,  ,` | 1 |
| `polut, rajamerkit,  ,` | 1 |
| `purnut, pyyntitukikohdat,  ,` | 1 |
| `purnut, röykkiöt,  ,` | 1 |
| `pyyntikuopat, rakkakuopat, röykkiöt,` | 1 |
| `pyyntikuopat, röykkiöt, tervahaudat,` | 1 |
| `pyyntikuopat, taistelukaivannot,  ,` | 1 |
| `pyyntitukikohdat, valkamat,  ,` | 1 |
| `pyyntitukikohdat, veneenvetopaikat,  ,` | 1 |
| `rajamerkit, rajamerkit, puu,  ,` | 1 |
| `rajamerkit, rakkakuopat,  ,` | 1 |
| `rajamerkit, rakkakuopat, röykkiöt,` | 1 |
| `rajamerkit, röykkiöt,  ,` | 1 |
| `rajamerkit, seidat,  ,` | 1 |
| `rajamerkit, talonpohjat,  ,` | 1 |
| `rajamerkit, talonpohjat, tervahaudat,` | 1 |
| `rajamerkit, tienpohjat,  ,` | 1 |
| `rajamerkit, torpat,  ,` | 1 |
| `rakkakuopat, tomtning-jäännökset,  ,` | 1 |
| `rangaistuspaikat, talonpohjat,  ,` | 1 |
| `rangaistuspaikat, tarinapaikat,  ,` | 1 |
| `ratapohjat, satamat, telakat,` | 1 |
| `ratapohjat, sillat,  ,` | 1 |
| `ratapohjat, sotilasleirit,  ,` | 1 |
| `ratapohjat, taistelukaivannot,  ,` | 1 |
| `rautaruukit, sillat,  ,` | 1 |
| `rautaruukit, vesimyllyt,  ,` | 1 |
| `ruumiskalmistot, talonpohjat,  ,` | 1 |
| `ruumiskalmistot, tarhakalmistot,  ,` | 1 |
| `ryssänuunit, uunit,  ,` | 1 |
| `röykkiöt, sudenkuopat,  ,` | 1 |
| `röykkiöt, suojahuoneet,  ,` | 1 |
| `röykkiöt, taistelukaivannot,  ,` | 1 |
| `röykkiöt, talonpohjat, uunit,` | 1 |
| `röykkiöt, tomtning-jäännökset, valkamat,` | 1 |
| `röykkiöt, torpat,  ,` | 1 |
| `röykkiöt, uunit,  ,` | 1 |
| `röykkiöt, vallit,  ,` | 1 |
| `röykkiöt, viljelmät,  ,` | 1 |
| `röykkiöt, viljelmät, yksinäistalot,` | 1 |
| `röykkiöt, viljelyröykkiöt,  ,` | 1 |
| `satamat, tomtning-jäännökset, uunit,` | 1 |
| `satamat, veneenvetopaikat,  ,` | 1 |
| `sillanpaikat, taistelupaikat,  ,` | 1 |
| `sillat, talonpohjat, vesimyllyt,` | 1 |
| `sillat, vesimyllyt,  ,` | 1 |
| `sotilasleirit, tykkiasemat,  ,` | 1 |
| `sudenkuopat, tuulimyllyt,  ,` | 1 |
| `suojahuoneet, taistelukaivannot,  ,` | 1 |
| `taistelukaivannot,  , tulipesäkkeet,` | 1 |
| `taistelukaivannot, tervahaudat,  ,` | 1 |
| `taistelukaivannot, tienpohjat,  ,` | 1 |
| `taistelukaivannot, tienpohjat, valkamat,` | 1 |
| `taistelukaivannot, uunit,  ,` | 1 |
| `taistelupaikat, tarinapaikat,  ,` | 1 |
| `talonpohjat, tervahaudat, viljelyröykkiöt,` | 1 |
| `talonpohjat, uunit,  ,` | 1 |
| `talonpohjat, vesimyllyt,  ,` | 1 |
| `talvikylät,  ,  ,` | 1 |
| `tarinapaikat, uunit,  ,` | 1 |
| `tarinapaikat, virstanpylväät,  ,` | 1 |
| `tervahaudat, tiilenpolttouunit,  ,` | 1 |
| `tervahaudat, tulisijat,  ,` | 1 |
| `tervahaudat, uunit,  ,` | 1 |
| `tervahaudat, viljelyröykkiöt,  ,` | 1 |
| `tervahaudat, yksinäistalot,  ,` | 1 |
| `tienpohjat, torpat, viljelmät,` | 1 |
| `tiilenpolttouunit, torpat,  ,` | 1 |
| `torpat,  , viljelmät,` | 1 |
| `torpat, tuulimyllyt,  ,` | 1 |
| `tulipesäkkeet, tykkiasemat,  ,` | 1 |
| `tupasijat, viljelyröykkiöt,  ,` | 1 |
| `uhrilehdot,  ,  ,` | 1 |
| `uittolaitteet, vesimyllyt, vesisahat,` | 1 |
| `vesimyllyt, viljelmät,  ,` | 1 |
| `viljelmät, viljelyröykkiöt,  ,` | 1 |

### Arkeologisen aluekohteen tyyppi – täydellinen raakamuotoinen arvojoukko

Lähde: `arkeologiset_kohteet_alue_t.gpkg`, kenttä `tyyppi`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `työ- ja valmistuspaikat,  ,  ,` | 51208 |
| `asuinpaikat,  ,  ,` | 15392 |
| `puolustusvarustukset,  ,  ,` | 5818 |
| `kivirakenteet,  ,  ,` | 4131 |
| `hautapaikat,  ,  ,` | 2773 |
| `maarakenteet,  ,  ,` | 904 |
| `kulkuväylät,  ,  ,` | 865 |
| `, työ- ja valmistuspaikat,  ,` | 544 |
| `löytöpaikat,  ,  ,` | 544 |
| `asuinpaikat, työ- ja valmistuspaikat,  ,` | 541 |
| `kultti- ja tarinapaikat,  ,  ,` | 470 |
| `raaka-aineen hankintapaikat,  ,  ,` | 405 |
| `teollisuuskohteet,  ,  ,` | 267 |
| `asuinpaikat, hautapaikat,  ,` | 230 |
| `taide, muistomerkit,  ,  ,` | 223 |
| `kivirakenteet, työ- ja valmistuspaikat,  ,` | 169 |
| `asuinpaikat, kivirakenteet,  ,` | 167 |
| `alusten hylyt,  ,  ,` | 125 |
| `, kivirakenteet,  ,` | 98 |
| `kirkkorakenteet,  ,  ,` | 75 |
| `, puolustusvarustukset,  ,` | 73 |
| `asuinpaikat, maarakenteet,  ,` | 67 |
| `, asuinpaikat,  ,` | 66 |
| `asuinpaikat,  , työ- ja valmistuspaikat,` | 63 |
| `asuinpaikat, löytöpaikat,  ,` | 63 |
| `maarakenteet, työ- ja valmistuspaikat,  ,` | 62 |
| `hautapaikat, kultti- ja tarinapaikat,  ,` | 55 |
| `asuinpaikat, kultti- ja tarinapaikat,  ,` | 54 |
| `asuinpaikat, kivirakenteet, työ- ja valmistuspaikat,` | 44 |
| `asuinpaikat,  , kivirakenteet,` | 43 |
| `kivirakenteet, maarakenteet,  ,` | 39 |
| `asuinpaikat, hautapaikat, kultti- ja tarinapaikat,` | 38 |
| `, asuinpaikat, työ- ja valmistuspaikat,` | 36 |
| `hautapaikat, kivirakenteet,  ,` | 36 |
| `tapahtumapaikat,  ,  ,` | 36 |
| `löytöpaikat, maarakenteet,  ,` | 33 |
| `, hautapaikat,  ,` | 29 |
| `,  , puolustusvarustukset,` | 26 |
| `kulkuväylät, puolustusvarustukset,  ,` | 26 |
| `asuinpaikat, hautapaikat, työ- ja valmistuspaikat,` | 25 |
| `hautapaikat, kirkkorakenteet,  ,` | 25 |
| `löytöpaikat, työ- ja valmistuspaikat,  ,` | 25 |
| `asuinpaikat,  , kivirakenteet, työ- ja valmistuspaikat` | 22 |
| `asuinpaikat,  , hautapaikat,` | 21 |
| `luonnonmuodostumat,  ,  ,` | 21 |
| `kivirakenteet, raaka-aineen hankintapaikat,  ,` | 18 |
| `teollisuuskohteet, työ- ja valmistuspaikat,  ,` | 18 |
| `kivirakenteet, maarakenteet, työ- ja valmistuspaikat,` | 17 |
| `puurakenteet,  ,  ,` | 16 |
| `, asuinpaikat, hautapaikat,` | 15 |
| `, kivirakenteet, työ- ja valmistuspaikat,` | 15 |
| `hautapaikat, löytöpaikat,  ,` | 15 |
| `kivirakenteet, kulkuväylät,  ,` | 15 |
| `hautapaikat, työ- ja valmistuspaikat,  ,` | 14 |
| `kivirakenteet, kultti- ja tarinapaikat,  ,` | 14 |
| `, kivirakenteet, maarakenteet,` | 13 |
| `kivirakenteet,  , työ- ja valmistuspaikat,` | 13 |
| `asuinpaikat, maarakenteet, työ- ja valmistuspaikat,` | 11 |
| `kivirakenteet, löytöpaikat,  ,` | 11 |
| `kivirakenteet, taide, muistomerkit,  ,` | 11 |
| `asuinpaikat, hautapaikat, kivirakenteet,` | 10 |
| `asuinpaikat, puolustusvarustukset,  ,` | 10 |
| `asuinpaikat, raaka-aineen hankintapaikat,  ,` | 10 |
| `taide, muistomerkit, työ- ja valmistuspaikat,  ,` | 10 |
| `, hautapaikat, kirkkorakenteet,` | 9 |
| `asuinpaikat, hautapaikat,  , työ- ja valmistuspaikat` | 9 |
| `asuinpaikat, hautapaikat, kulkuväylät,` | 9 |
| `asuinpaikat, löytöpaikat, työ- ja valmistuspaikat,` | 9 |
| `maarakenteet,  , työ- ja valmistuspaikat,` | 9 |
| `,  , kivirakenteet,` | 8 |
| `asuinpaikat, kivirakenteet, kulkuväylät, työ- ja valmistuspaikat` | 8 |
| `asuinpaikat, taide, muistomerkit,  ,` | 8 |
| `kivirakenteet, puolustusvarustukset,  ,` | 8 |
| `puolustusvarustukset, tapahtumapaikat,  ,` | 8 |
| `raaka-aineen hankintapaikat, työ- ja valmistuspaikat,  ,` | 8 |
| `asuinpaikat,  , kulkuväylät, teollisuuskohteet` | 7 |
| `asuinpaikat, kultti- ja tarinapaikat, työ- ja valmistuspaikat,` | 7 |
| `hautapaikat, puolustusvarustukset,  ,` | 7 |
| `kultti- ja tarinapaikat, työ- ja valmistuspaikat,  ,` | 7 |
| `puolustusvarustukset, työ- ja valmistuspaikat,  ,` | 7 |
| `, asuinpaikat, kivirakenteet,` | 6 |
| `, asuinpaikat, kivirakenteet, maarakenteet` | 6 |
| `, kulkuväylät,  ,` | 6 |
| `, maarakenteet,  ,` | 6 |
| `asuinpaikat,  , hautapaikat, kultti- ja tarinapaikat` | 6 |
| `asuinpaikat, kivirakenteet, kulkuväylät,` | 6 |
| `asuinpaikat, kivirakenteet, maarakenteet,` | 6 |
| `kivirakenteet, löytöpaikat, maarakenteet,` | 6 |
| `,  ,  , kivirakenteet` | 5 |
| `, asuinpaikat,  , hautapaikat` | 5 |
| `, asuinpaikat, löytöpaikat,` | 5 |
| `, asuinpaikat, maarakenteet,` | 5 |
| `, hautapaikat, kultti- ja tarinapaikat,` | 5 |
| `, kivirakenteet, löytöpaikat,` | 5 |
| `asuinpaikat, kivirakenteet,  , kulkuväylät` | 5 |
| `hautapaikat, maarakenteet,  ,` | 5 |
| `hautapaikat, taide, muistomerkit,  ,` | 5 |
| `kirkkorakenteet, kivirakenteet, työ- ja valmistuspaikat,` | 5 |
| `kivirakenteet, luonnonmuodostumat, maarakenteet, työ- ja valmistuspaikat` | 5 |
| `kultti- ja tarinapaikat, löytöpaikat,  ,` | 5 |
| `kultti- ja tarinapaikat, taide, muistomerkit,  ,` | 5 |
| `, asuinpaikat, kivirakenteet, kultti- ja tarinapaikat` | 4 |
| `, kivirakenteet, kulkuväylät,` | 4 |
| `, teollisuuskohteet,  ,` | 4 |
| `asuinpaikat,  ,  , hautapaikat` | 4 |
| `asuinpaikat, hautapaikat, kirkkorakenteet,` | 4 |
| `asuinpaikat, hautapaikat, kivirakenteet, kultti- ja tarinapaikat` | 4 |
| `asuinpaikat, hautapaikat, löytöpaikat,` | 4 |
| `asuinpaikat, kivirakenteet,  , työ- ja valmistuspaikat` | 4 |
| `asuinpaikat, kivirakenteet, kultti- ja tarinapaikat,` | 4 |
| `asuinpaikat, kulkuväylät,  ,` | 4 |
| `asuinpaikat, kultti- ja tarinapaikat, taide, muistomerkit,` | 4 |
| `hautapaikat, kulkuväylät,  ,` | 4 |
| `kivirakenteet, teollisuuskohteet,  ,` | 4 |
| `kulkuväylät, työ- ja valmistuspaikat,  ,` | 4 |
| `puolustusvarustukset, taide, muistomerkit,  ,` | 4 |
| `,  , työ- ja valmistuspaikat,` | 3 |
| `, asuinpaikat,  , työ- ja valmistuspaikat` | 3 |
| `, asuinpaikat, hautapaikat, työ- ja valmistuspaikat` | 3 |
| `, asuinpaikat, kulkuväylät, taide, muistomerkit` | 3 |
| `, asuinpaikat, maarakenteet, työ- ja valmistuspaikat` | 3 |
| `, hautapaikat, työ- ja valmistuspaikat,` | 3 |
| `, kulkuväylät, teollisuuskohteet,` | 3 |
| `asuinpaikat,  ,  , kivirakenteet` | 3 |
| `asuinpaikat, hautapaikat, kultti- ja tarinapaikat, löytöpaikat` | 3 |
| `asuinpaikat, hautapaikat, kultti- ja tarinapaikat, työ- ja valmistuspaikat` | 3 |
| `asuinpaikat, kirkkorakenteet,  ,` | 3 |
| `asuinpaikat, kulkuväylät, työ- ja valmistuspaikat,` | 3 |
| `asuinpaikat, maarakenteet,  , työ- ja valmistuspaikat` | 3 |
| `asuinpaikat, teollisuuskohteet,  ,` | 3 |
| `kirkkorakenteet, työ- ja valmistuspaikat,  ,` | 3 |
| `kulkuväylät, teollisuuskohteet,  ,` | 3 |
| `maarakenteet,  ,  , työ- ja valmistuspaikat` | 3 |
| `,  , asuinpaikat, kivirakenteet` | 2 |
| `,  , hautapaikat,` | 2 |
| `,  , kivirakenteet, kulkuväylät` | 2 |
| `,  , kivirakenteet, työ- ja valmistuspaikat` | 2 |
| `,  , kulkuväylät,` | 2 |
| `, kultti- ja tarinapaikat,  ,` | 2 |
| `, teollisuuskohteet, työ- ja valmistuspaikat,` | 2 |
| `asuinpaikat,  , kulkuväylät,` | 2 |
| `asuinpaikat,  , kulkuväylät, kultti- ja tarinapaikat` | 2 |
| `asuinpaikat,  , maarakenteet,` | 2 |
| `asuinpaikat, hautapaikat, puolustusvarustukset,` | 2 |
| `asuinpaikat, kivirakenteet, maarakenteet, työ- ja valmistuspaikat` | 2 |
| `asuinpaikat, löytöpaikat,  , työ- ja valmistuspaikat` | 2 |
| `asuinpaikat, löytöpaikat, maarakenteet,` | 2 |
| `asuinpaikat, löytöpaikat, maarakenteet, työ- ja valmistuspaikat` | 2 |
| `asuinpaikat, puolustusvarustukset, työ- ja valmistuspaikat,` | 2 |
| `asuinpaikat, tapahtumapaikat,  ,` | 2 |
| `hautapaikat, kirkkorakenteet, työ- ja valmistuspaikat,` | 2 |
| `hautapaikat, kivirakenteet, kultti- ja tarinapaikat,` | 2 |
| `hautapaikat, raaka-aineen hankintapaikat,  ,` | 2 |
| `kirkkorakenteet, kultti- ja tarinapaikat,  ,` | 2 |
| `kivirakenteet, löytöpaikat, työ- ja valmistuspaikat,` | 2 |
| `kivirakenteet, taide, muistomerkit, työ- ja valmistuspaikat,` | 2 |
| `kulkuväylät, taide, muistomerkit,  ,` | 2 |
| `löytöpaikat,  , työ- ja valmistuspaikat,` | 2 |
| `,  ,  , asuinpaikat` | 1 |
| `,  ,  , hautapaikat` | 1 |
| `,  ,  , puolustusvarustukset` | 1 |
| `,  , asuinpaikat,` | 1 |
| `,  , asuinpaikat, kirkkorakenteet` | 1 |
| `,  , hautapaikat, kirkkorakenteet` | 1 |
| `, asuinpaikat, hautapaikat, kirkkorakenteet` | 1 |
| `, asuinpaikat, hautapaikat, kivirakenteet` | 1 |
| `, asuinpaikat, hautapaikat, kultti- ja tarinapaikat` | 1 |
| `, hautapaikat, puolustusvarustukset,` | 1 |
| `, kivirakenteet, kultti- ja tarinapaikat,` | 1 |
| `, kivirakenteet, kultti- ja tarinapaikat, maarakenteet` | 1 |
| `, kivirakenteet, kultti- ja tarinapaikat, työ- ja valmistuspaikat` | 1 |
| `, kivirakenteet, maarakenteet, työ- ja valmistuspaikat` | 1 |
| `, kivirakenteet, taide, muistomerkit,` | 1 |
| `, kulkuväylät, puolustusvarustukset,` | 1 |
| `, maarakenteet, työ- ja valmistuspaikat,` | 1 |
| `, taide, muistomerkit,  ,` | 1 |
| `alusten hylyt, kulkuväylät,  ,` | 1 |
| `alusten hylyt, puolustusvarustukset,  ,` | 1 |
| `asuinpaikat,  , hautapaikat, kivirakenteet` | 1 |
| `asuinpaikat,  , kivirakenteet, kultti- ja tarinapaikat` | 1 |
| `asuinpaikat,  , löytöpaikat,` | 1 |
| `asuinpaikat, hautapaikat, kirkkorakenteet, puolustusvarustukset` | 1 |
| `asuinpaikat, hautapaikat, kivirakenteet, työ- ja valmistuspaikat` | 1 |
| `asuinpaikat, kirkkorakenteet, kivirakenteet, työ- ja valmistuspaikat` | 1 |
| `asuinpaikat, kirkkorakenteet, kultti- ja tarinapaikat,` | 1 |
| `asuinpaikat, kivirakenteet,  , maarakenteet` | 1 |
| `asuinpaikat, kivirakenteet, löytöpaikat,` | 1 |
| `asuinpaikat, kivirakenteet, puolustusvarustukset,` | 1 |
| `asuinpaikat, kivirakenteet, raaka-aineen hankintapaikat, teollisuuskohteet` | 1 |
| `asuinpaikat, kivirakenteet, teollisuuskohteet, työ- ja valmistuspaikat` | 1 |
| `asuinpaikat, kulkuväylät, maarakenteet,` | 1 |
| `asuinpaikat, kulkuväylät, teollisuuskohteet,` | 1 |
| `asuinpaikat, kultti- ja tarinapaikat, puolustusvarustukset,` | 1 |
| `asuinpaikat, raaka-aineen hankintapaikat,  , työ- ja valmistuspaikat` | 1 |
| `asuinpaikat, raaka-aineen hankintapaikat, työ- ja valmistuspaikat,` | 1 |
| `asuinpaikat, taide, muistomerkit, työ- ja valmistuspaikat,` | 1 |
| `hautapaikat,  ,  , kirkkorakenteet` | 1 |
| `hautapaikat,  , kirkkorakenteet,` | 1 |
| `hautapaikat,  , maarakenteet,` | 1 |
| `hautapaikat, kirkkorakenteet, kultti- ja tarinapaikat,` | 1 |
| `hautapaikat, kirkkorakenteet, taide, muistomerkit,` | 1 |
| `hautapaikat, kivirakenteet, kulkuväylät,` | 1 |
| `hautapaikat, kivirakenteet, kultti- ja tarinapaikat, työ- ja valmistuspaikat` | 1 |
| `hautapaikat, kivirakenteet, työ- ja valmistuspaikat,` | 1 |
| `hautapaikat, kultti- ja tarinapaikat, puolustusvarustukset,` | 1 |
| `hautapaikat, puolustusvarustukset, taide, muistomerkit,` | 1 |
| `kirkkorakenteet, kivirakenteet, taide, muistomerkit,` | 1 |
| `kirkkorakenteet, kultti- ja tarinapaikat, työ- ja valmistuspaikat,` | 1 |
| `kirkkorakenteet, löytöpaikat,  ,` | 1 |
| `kivirakenteet,  , maarakenteet, työ- ja valmistuspaikat` | 1 |
| `kivirakenteet, kultti- ja tarinapaikat, taide, muistomerkit,` | 1 |
| `kivirakenteet, kultti- ja tarinapaikat, työ- ja valmistuspaikat,` | 1 |
| `kivirakenteet, raaka-aineen hankintapaikat, taide, muistomerkit,` | 1 |
| `kivirakenteet, tapahtumapaikat,  ,` | 1 |
| `kulkuväylät, kultti- ja tarinapaikat,  , työ- ja valmistuspaikat` | 1 |
| `kulkuväylät, puolustusvarustukset, tapahtumapaikat, teollisuuskohteet` | 1 |
| `kulkuväylät, raaka-aineen hankintapaikat,  ,` | 1 |
| `kulkuväylät, tapahtumapaikat,  ,` | 1 |
| `kultti- ja tarinapaikat,  , työ- ja valmistuspaikat,` | 1 |
| `kultti- ja tarinapaikat, puurakenteet,  ,` | 1 |
| `kultti- ja tarinapaikat, tapahtumapaikat,  ,` | 1 |
| `löytöpaikat, puolustusvarustukset,  ,` | 1 |
| `maarakenteet, puolustusvarustukset,  ,` | 1 |
| `maarakenteet, puolustusvarustukset, työ- ja valmistuspaikat,` | 1 |
| `maarakenteet, teollisuuskohteet,  ,` | 1 |
| `teollisuuskohteet,  , työ- ja valmistuspaikat,` | 1 |

### Arkeologisen aluekohteen alatyyppi – täydellinen raakamuotoinen arvojoukko

Lähde: `arkeologiset_kohteet_alue_t.gpkg`, kenttä `alatyyppi`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `tervahaudat,  ,  ,` | 37779 |
| `ei määritelty,  ,  ,` | 12008 |
| `hiilimiilut,  ,  ,` | 9511 |
| `taistelukaivannot,  ,  ,` | 3250 |
| `kylänpaikat,  ,  ,` | 2866 |
| `pyyntikuopat,  ,  ,` | 2287 |
| `röykkiöt,  ,  ,` | 1981 |
| `hautaröykkiöt,  ,  ,` | 1779 |
| `asumuspainanteet,  ,  ,` | 1231 |
| `kuopat,  ,  ,` | 753 |
| `rajamerkit,  ,  ,` | 709 |
| `talonpohjat,  ,  ,` | 459 |
| `hiilimiilut, tervahaudat,  ,` | 450 |
| `torpat,  ,  ,` | 434 |
| `tienpohjat,  ,  ,` | 433 |
| `louhokset,  ,  ,` | 334 |
| `ei määritelty, pyyntikuopat,  ,` | 279 |
| `tulipesäkkeet,  ,  ,` | 277 |
| `kiviaidat,  ,  ,` | 271 |
| `latomukset,  ,  ,` | 267 |
| `vesimyllyt,  ,  ,` | 262 |
| `kaskiröykkiöt,  ,  ,` | 259 |
| `kuppikivet,  ,  ,` | 254 |
| `viljelyröykkiöt,  ,  ,` | 254 |
| `tykkiasemat,  ,  ,` | 234 |
| `yksinäistalot,  ,  ,` | 227 |
| `rakkakuopat,  ,  ,` | 216 |
| `polttokenttäkalmistot,  ,  ,` | 201 |
| `lapinrauniot,  ,  ,` | 174 |
| `raudanvalmistuspaikat,  ,  ,` | 169 |
| `panssariesteet,  ,  ,` | 156 |
| `sotilasleirit,  ,  ,` | 128 |
| `kartanot,  ,  ,` | 118 |
| `uittolaitteet,  ,  ,` | 117 |
| `linnakkeet,  ,  ,` | 113 |
| `linnoitukset,  ,  ,` | 111 |
| `keittokuopat,  ,  ,` | 108 |
| `hylyt (puu),  ,  ,` | 107 |
| `, ei määritelty,  ,` | 101 |
| `nauriskuopat,  ,  ,` | 98 |
| `ryssänuunit,  ,  ,` | 97 |
| `hakkaukset,  ,  ,` | 96 |
| `polut,  ,  ,` | 96 |
| `muinaislinnat,  ,  ,` | 86 |
| `maavallit,  ,  ,` | 84 |
| `kalliomaalaukset,  ,  ,` | 81 |
| `kellarit,  ,  ,` | 78 |
| `kiukaat, tervahaudat,  ,` | 78 |
| `irtolöytöpaikat,  ,  ,` | 77 |
| `ei määritelty, hautaröykkiöt,  ,` | 76 |
| `hautausmaat,  ,  ,` | 71 |
| `ei määritelty, kuopat,  ,` | 69 |
| `ruumiskalmistot,  ,  ,` | 69 |
| `kentät (gieddi),  ,  ,` | 68 |
| `kodanpohjat,  ,  ,` | 68 |
| `suojahuoneet,  ,  ,` | 68 |
| `kirkonpaikat,  ,  ,` | 63 |
| `poroaidat,  ,  ,` | 63 |
| `hautasaaret,  ,  ,` | 62 |
| `eräsijat,  ,  ,` | 60 |
| `kaivokset,  ,  ,` | 60 |
| `kivivallit,  ,  ,` | 58 |
| `purnut,  ,  ,` | 58 |
| `ei määritelty, röykkiöt,  ,` | 55 |
| `korsut,  ,  ,` | 55 |
| `taistelukaivannot, tulipesäkkeet,  ,` | 54 |
| `rautaruukit,  ,  ,` | 53 |
| `ei määritelty, kuppikivet,  ,` | 51 |
| `asumuspainanteet, pyyntikuopat,  ,` | 47 |
| `painanteet,  ,  ,` | 46 |
| `uunit,  ,  ,` | 46 |
| `jatulintarhat,  ,  ,` | 44 |
| `luolat,  ,  ,` | 44 |
| `tykkitiet,  ,  ,` | 42 |
| `kiukaat,  ,  ,` | 41 |
| `ortodoksikalmistot,  ,  ,` | 38 |
| `sillanpaikat,  ,  ,` | 38 |
| `ei määritelty, tervahaudat,  ,` | 37 |
| `kaivannot,  ,  ,` | 37 |
| `pappilat,  ,  ,` | 37 |
| `kalastuspaikat,  ,  ,` | 36 |
| `ratapohjat,  ,  ,` | 36 |
| `veneenvetopaikat,  ,  ,` | 34 |
| `jätinkirkot,  ,  ,` | 32 |
| `rakkakuopat, röykkiöt,  ,` | 32 |
| `ei määritelty, pyyntikuopat, tervahaudat,` | 31 |
| `tomtning-jäännökset,  ,  ,` | 30 |
| `yhdyshaudat,  ,  ,` | 30 |
| `kullanhuuhdonnan jäännökset,  ,  ,` | 29 |
| `liesilatomukset (árran),  ,  ,` | 29 |
| `seidat,  ,  ,` | 29 |
| `sillat,  ,  ,` | 29 |
| `tarinapaikat,  ,  ,` | 29 |
| `ei määritelty, punamultahaudat,  ,` | 28 |
| `kaupungit,  ,  ,` | 28 |
| `ei määritelty, polttokenttäkalmistot,  ,` | 27 |
| `kaiverrukset,  ,  ,` | 27 |
| `piikkilankaesteet,  ,  ,` | 27 |
| `hautaröykkiöt, kuppikivet,  ,` | 26 |
| `kalkkiuunit,  ,  ,` | 26 |
| `kesähaudat,  ,  ,` | 26 |
| `taistelukaivannot,  , tulipesäkkeet,` | 26 |
| `taistelupaikat,  ,  ,` | 26 |
| `laiturit,  ,  ,` | 25 |
| `pyyntikuopat, tervahaudat,  ,` | 24 |
| `kanavat,  ,  ,` | 23 |
| `kätköt,  ,  ,` | 23 |
| `veneenvetomöljät,  ,  ,` | 23 |
| `karsikkopaikat,  ,  ,` | 22 |
| `linnavuoret,  ,  ,` | 22 |
| `lähteet,  ,  ,` | 22 |
| `ei määritelty, kylänpaikat,  ,` | 21 |
| `merkkipuut,  ,  ,` | 21 |
| `vesisahat,  ,  ,` | 21 |
| `ei määritelty, latomukset,  ,` | 20 |
| `kummelit,  ,  ,` | 20 |
| `kuppikalliot,  ,  ,` | 20 |
| `ei määritelty, raudanvalmistuspaikat,  ,` | 19 |
| `kivimuurit,  ,  ,` | 19 |
| `kuopat, röykkiöt,  ,` | 19 |
| `kuopat, tervahaudat,  ,` | 19 |
| `pajat,  ,  ,` | 19 |
| `asumuspainanteet, punamultahaudat,  ,` | 18 |
| `kodanpohjat, pyyntikuopat,  ,` | 18 |
| `kummut,  ,  ,` | 18 |
| `liesikiveykset,  ,  ,` | 18 |
| `vallihaudat,  ,  ,` | 18 |
| `hiilimiilut, kuopat,  ,` | 17 |
| `latomukset, pyyntikuopat,  ,` | 16 |
| `tiilenpolttouunit,  ,  ,` | 16 |
| `tiilitehtaat,  ,  ,` | 16 |
| `polttohaudat,  ,  ,` | 15 |
| `sudenkuopat,  ,  ,` | 15 |
| `asumuspainanteet, röykkiöt,  ,` | 14 |
| `kivilatomukset,  ,  ,` | 14 |
| `latomukset, röykkiöt,  ,` | 14 |
| `tulisijat,  ,  ,` | 14 |
| `tupasijat,  ,  ,` | 14 |
| `ei määritelty, keittokuopat,  ,` | 13 |
| `hautakummut,  ,  ,` | 13 |
| `hautaröykkiöt, polttokenttäkalmistot,  ,` | 13 |
| `liesilatomukset (árran), pyyntikuopat,  ,` | 13 |
| `virkatalot,  ,  ,` | 13 |
| `eräsijat, tervahaudat,  ,` | 12 |
| `kiviaidat, röykkiöt, talonpohjat, viljelyröykkiöt` | 12 |
| `kivipöydät,  ,  ,` | 12 |
| `linnat,  ,  ,` | 12 |
| `asumuspainanteet, kuopat,  ,` | 11 |
| `hautausmaat, kirkonpaikat,  ,` | 11 |
| `kentät (gieddi), pyyntikuopat,  ,` | 11 |
| `kivivarustukset,  ,  ,` | 11 |
| `kuninkaankartanot,  ,  ,` | 11 |
| `röykkiöt, talonpohjat,  ,` | 11 |
| `röykkiöt, tervahaudat,  ,` | 11 |
| `talonpohjat, tervahaudat,  ,` | 11 |
| `vallit,  ,  ,` | 11 |
| `, ei määritelty, kuppikivet,` | 10 |
| `asumuspainanteet, ei määritelty,  ,` | 10 |
| `asumuspainanteet, tervahaudat,  ,` | 10 |
| `ei määritelty, kodanpohjat, pyyntikuopat,` | 10 |
| `ei määritelty, latomukset, pyyntikuopat,` | 10 |
| `ei määritelty, lentokentät,  ,` | 10 |
| `hiilimiilut, pyyntikuopat,  ,` | 10 |
| `hylyt (metalli),  ,  ,` | 10 |
| `joukkohaudat,  ,  ,` | 10 |
| `kiviaidat, röykkiöt,  ,` | 10 |
| `kiviaidat, viljelyröykkiöt,  ,` | 10 |
| `liesikiveykset, pyyntikuopat,  ,` | 10 |
| `satamat,  ,  ,` | 10 |
| `ei määritelty, hautaröykkiöt, tienpohjat,` | 9 |
| `ei määritelty, hiilimiilut,  ,` | 9 |
| `ei määritelty, irtolöytöpaikat,  ,` | 9 |
| `ei määritelty, viljelyröykkiöt,  ,` | 9 |
| `kartanot, kylänpaikat,  ,` | 9 |
| `korsut, ratapohjat,  ,` | 9 |
| `uhrikivet,  ,  ,` | 9 |
| `asumuspainanteet, hiilimiilut,  ,` | 8 |
| `ei määritelty, hautaröykkiöt, kuppikivet,` | 8 |
| `ei määritelty, kätköt,  ,` | 8 |
| `hautaröykkiöt, rakkakuopat,  ,` | 8 |
| `hautaröykkiöt, röykkiöt,  ,` | 8 |
| `keittokuopat, röykkiöt,  ,` | 8 |
| `kestikievarit,  ,  ,` | 8 |
| `kiviaidat, kuopat, viljelyröykkiöt,` | 8 |
| `kivilinnat,  ,  ,` | 8 |
| `lasitehtaat,  ,  ,` | 8 |
| `latomukset, rakkakuopat,  ,` | 8 |
| `piilopirtit,  ,  ,` | 8 |
| `ruumishaudat,  ,  ,` | 8 |
| `tuulimyllyt,  ,  ,` | 8 |
| `ei määritelty, hautaröykkiöt, keittokuopat, tulisijat` | 7 |
| `ei määritelty, hautaröykkiöt, polttokenttäkalmistot,` | 7 |
| `ei määritelty, hiilimiilut, pyyntikuopat,` | 7 |
| `ei määritelty, kaskiröykkiöt,  ,` | 7 |
| `ei määritelty, kuopat, pyyntikuopat,` | 7 |
| `ei määritelty, kuppikalliot,  ,` | 7 |
| `ei määritelty, rakkakuopat, röykkiöt,` | 7 |
| `ei määritelty, uunit,  ,` | 7 |
| `hiilimiilut, höyrysahat, laiturit, ratapohjat` | 7 |
| `jätinkirkot, röykkiöt,  ,` | 7 |
| `kalkkiuunit, louhokset,  ,` | 7 |
| `kaskiröykkiöt, nauriskuopat,  ,` | 7 |
| `keittokuopat, pyyntikuopat,  ,` | 7 |
| `kompassiruusut,  ,  ,` | 7 |
| `korsut, tulipesäkkeet,  ,` | 7 |
| `kylänpaikat, röykkiöt,  ,` | 7 |
| `käsittelypaikat,  ,  ,` | 7 |
| `lapinpadot,  ,  ,` | 7 |
| `maanmittauspisteet,  ,  ,` | 7 |
| `muinaispellot,  ,  ,` | 7 |
| `pyyntitukikohdat,  ,  ,` | 7 |
| `rajamerkit, puu,  ,  ,` | 7 |
| `taistelukaivannot, taistelupaikat,  ,` | 7 |
| `tähystysasemat,  ,  ,` | 7 |
| `vesimyllyt, vesisahat,  ,` | 7 |
| `asumuspainanteet, ei määritelty, punamultahaudat,` | 6 |
| `ei määritelty, hautaröykkiöt, kuppikivet, kylänpaikat` | 6 |
| `ei määritelty, kompassiruusut,  ,` | 6 |
| `ei määritelty, liesikiveykset, pyyntikuopat,` | 6 |
| `ei määritelty, louhokset,  ,` | 6 |
| `ei määritelty, painanteet,  ,` | 6 |
| `ei määritelty, polttokenttäkalmistot, röykkiöt,` | 6 |
| `hiilimiilut, kaivot, kellarit,` | 6 |
| `hospitaalit ja sairaalat,  ,  ,` | 6 |
| `irtolöytöpaikat, kuopat,  ,` | 6 |
| `kaiverrukset, maanmittauspisteet,  ,` | 6 |
| `kalastuspaikat, kummelit, rakkakuopat, tomtning-jäännökset` | 6 |
| `kapulatiet,  ,  ,` | 6 |
| `keittokuopat, kuopat,  ,` | 6 |
| `kuppikalliot, polttokenttäkalmistot,  ,` | 6 |
| `kuppikivet, polttokenttäkalmistot,  ,` | 6 |
| `lentokentät,  ,  ,` | 6 |
| `pitkospuut,  ,  ,` | 6 |
| `rangaistuspaikat,  ,  ,` | 6 |
| `raudanvalmistuspaikat, tervahaudat,  ,` | 6 |
| `taistelukaivannot, tervahaudat,  ,` | 6 |
| `torpat, viljelyröykkiöt,  ,` | 6 |
| `valonheitinasemat,  ,  ,` | 6 |
| `asumuspainanteet, ei määritelty, kuopat, röykkiöt` | 5 |
| `asumuspainanteet, jätinkirkot, röykkiöt,` | 5 |
| `ei määritelty, hautasaaret,  ,` | 5 |
| `ei määritelty, kirkonpaikat,  ,` | 5 |
| `ei määritelty, kiukaat,  ,` | 5 |
| `ei määritelty, kuopat, liesilatomukset (árran),` | 5 |
| `ei määritelty, kuopat, rajamerkit, viljelyröykkiöt` | 5 |
| `ei määritelty, liesikiveykset,  ,` | 5 |
| `ei määritelty, pajat,  ,` | 5 |
| `ei määritelty, rakkakuopat,  ,` | 5 |
| `ei määritelty, torpat,  ,` | 5 |
| `hautaröykkiöt, kuopat,  ,` | 5 |
| `hiilimiilut, raudanvalmistuspaikat,  ,` | 5 |
| `hospitaalit ja sairaalat, kirkonpaikat, kiviaidat,` | 5 |
| `kellarit, tervahaudat,  ,` | 5 |
| `kiinnitysrenkaat,  ,  ,` | 5 |
| `kirkkohaudat, kirkonpaikat,  ,` | 5 |
| `kiviaidat, röykkiöt, talonpohjat,` | 5 |
| `kuopat, latomukset,  ,` | 5 |
| `kuopat, rakkakuopat,  ,` | 5 |
| `kuopat, rakkakuopat, röykkiöt,` | 5 |
| `laivanrakennuspaikat,  ,  ,` | 5 |
| `latomukset, louhokset,  ,` | 5 |
| `louhokset, röykkiöt,  ,` | 5 |
| `luotsi- ja tulliasemat,  ,  ,` | 5 |
| `merimerkit,  ,  ,` | 5 |
| `optiset lennätinasemat,  ,  ,` | 5 |
| `pyyntikuopat, talonpohjat,  ,` | 5 |
| `talonpohjat, viljelyröykkiöt,  ,` | 5 |
| `terva- ja tärpättitehtaat,  ,  ,` | 5 |
| `viljelyröykkiöt, yksinäistalot,  ,` | 5 |
| `, ei määritelty, raudanvalmistuspaikat,` | 4 |
| `aidat,  ,  ,` | 4 |
| `ammusvarastot,  ,  ,` | 4 |
| `ei määritelty, eräsijat,  ,` | 4 |
| `ei määritelty, hautaröykkiöt, keittokuopat,` | 4 |
| `ei määritelty, hautaröykkiöt, kuppikivet, polttokenttäkalmistot` | 4 |
| `ei määritelty, kaiverrukset,  ,` | 4 |
| `ei määritelty, keittokuopat, tervahaudat,` | 4 |
| `ei määritelty, kivivallit,  ,` | 4 |
| `ei määritelty, kummelit, rakkakuopat,` | 4 |
| `ei määritelty, kuppikivet, muinaispellot,` | 4 |
| `ei määritelty, kuppikivet, polttokenttäkalmistot,` | 4 |
| `ei määritelty, kuppikivet, ruumiskalmistot,` | 4 |
| `ei määritelty, kuppikivet, röykkiöt,` | 4 |
| `ei määritelty, lapinrauniot,  ,` | 4 |
| `ei määritelty, muinaispellot,  ,` | 4 |
| `ei määritelty, ortodoksikalmistot,  ,` | 4 |
| `ei määritelty, rajamerkit,  ,` | 4 |
| `ei määritelty, rakkakuopat, tomtning-jäännökset, tulisijat` | 4 |
| `ei määritelty, ruumiskalmistot,  ,` | 4 |
| `hakkaukset, vesimyllyt,  ,` | 4 |
| `hautaröykkiöt, kivivallit,  ,` | 4 |
| `hautaröykkiöt, viljelyröykkiöt,  ,` | 4 |
| `hautausmaat, tsasounanpaikat,  ,` | 4 |
| `hiilimiilut, kiukaat,  ,` | 4 |
| `jatulintarhat, kompassiruusut, tomtning-jäännökset,` | 4 |
| `kanavat, taistelukaivannot,  ,` | 4 |
| `kartanot, kivivallit, tienpohjat,` | 4 |
| `keittokuopat, tervahaudat,  ,` | 4 |
| `kellarit, talonpohjat,  ,` | 4 |
| `kirkonrauniot,  ,  ,` | 4 |
| `kiukaat, kuopat, tervahaudat,` | 4 |
| `kiviaidat, talonpohjat, viljelyröykkiöt,` | 4 |
| `kivivallit, ryssänuunit, röykkiöt, uunit` | 4 |
| `kivivallit, röykkiöt,  ,` | 4 |
| `kylänpaikat, pappilat,  ,` | 4 |
| `latomukset, rakkakuopat, tomtning-jäännökset,` | 4 |
| `linnustuspaikat,  ,  ,` | 4 |
| `markkinapaikat,  ,  ,` | 4 |
| `miekanhiontakivet,  ,  ,` | 4 |
| `muistomerkit,  ,  ,` | 4 |
| `mäkituvat,  ,  ,` | 4 |
| `punamultahaudat,  ,  ,` | 4 |
| `pyyntikuopat, tulisijat,  ,` | 4 |
| `ryssänuunit, röykkiöt,  ,` | 4 |
| `suojahuoneet, tykkiasemat,  ,` | 4 |
| `tervahaudat, vesimyllyt,  ,` | 4 |
| `viljelmät,  ,  ,` | 4 |
| `aallonmurtajat, kivivallit,  ,` | 3 |
| `asumuspainanteet, ei määritelty, pyyntikuopat,` | 3 |
| `asumuspainanteet, keittokuopat,  ,` | 3 |
| `asumuspainanteet, kivivallit,  ,` | 3 |
| `asumuspainanteet, kivivallit, röykkiöt,` | 3 |
| `ei määritelty, hakkaukset,  ,` | 3 |
| `ei määritelty, hiilimiilut, keittokuopat,` | 3 |
| `ei määritelty, kartanot,  ,` | 3 |
| `ei määritelty, keittokuopat, röykkiöt,` | 3 |
| `ei määritelty, kentät (gieddi), pyyntikuopat,` | 3 |
| `ei määritelty, kiviaidat, röykkiöt,` | 3 |
| `ei määritelty, kodanpohjat,  ,` | 3 |
| `ei määritelty, pappilat,  ,` | 3 |
| `ei määritelty, polttohaudat,  ,` | 3 |
| `ei määritelty, polttokenttäkalmistot, ruumiskalmistot,` | 3 |
| `ei määritelty, pyyntikuopat, talonpohjat,` | 3 |
| `ei määritelty, rakkakuopat, tervahaudat,` | 3 |
| `ei määritelty, talonpohjat,  ,` | 3 |
| `ei määritelty, uittolaitteet,  ,` | 3 |
| `haaksirikkopaikat,  ,  ,` | 3 |
| `hakkaukset, kylänpaikat, merimerkit, talonpohjat` | 3 |
| `hakkaukset, rajamerkit,  ,` | 3 |
| `harkkohytit, raudanvalmistuspaikat,  ,` | 3 |
| `hautaröykkiöt, keittokuopat,  ,` | 3 |
| `hautaröykkiöt, kuppikivet, kylänpaikat,` | 3 |
| `hautaröykkiöt, kuppikivet, polttokenttäkalmistot,` | 3 |
| `hautaröykkiöt, uhrikivet,  ,` | 3 |
| `hautausmaat, kirkonpaikat, ruumiskalmistot,` | 3 |
| `hiilimiilut, kaskiröykkiöt, kuopat, tervahaudat` | 3 |
| `hiilimiilut, painanteet, tervahaudat,` | 3 |
| `höyrysahat,  ,  ,` | 3 |
| `irtolöytöpaikat, pyyntikuopat,  ,` | 3 |
| `jatulintarhat, kalastuspaikat, kompassiruusut, merimerkit` | 3 |
| `jatulintarhat, kalastuspaikat, rakkakuopat, talonpohjat` | 3 |
| `jätinkirkot, rakkakuopat,  ,` | 3 |
| `kaivannot, kuopat,  ,` | 3 |
| `kaivannot, tervahaudat,  ,` | 3 |
| `kaivot, kalastuspaikat, merimerkit, talonpohjat` | 3 |
| `kalliopiirrokset,  ,  ,` | 3 |
| `kartanot, kuninkaankartanot,  ,` | 3 |
| `keittokuopat, latomukset,  ,` | 3 |
| `keittokuopat, latomukset, röykkiöt,` | 3 |
| `kellarit, kiviaidat,  ,` | 3 |
| `kiukaat, latomukset, röykkiöt,` | 3 |
| `kiukaat, torpat,  ,` | 3 |
| `kiviaidat, talonpohjat,  ,` | 3 |
| `kiviaidat, viljelmät, viljelyröykkiöt,` | 3 |
| `kivivallit, torpat, viljelyröykkiöt,` | 3 |
| `korsut, taistelukaivannot,  ,` | 3 |
| `kuopat, nauriskuopat,  ,` | 3 |
| `kuopat, röykkiöt, talonpohjat,` | 3 |
| `kuopat, talonpohjat,  ,` | 3 |
| `kuparinsulattamot, rautaruukit,  ,` | 3 |
| `kuppikivet, röykkiöt,  ,` | 3 |
| `kylänpaikat, torpat,  ,` | 3 |
| `linnoitukset, yhdyshaudat,  ,` | 3 |
| `louhokset, rakkakuopat,  ,` | 3 |
| `masuunit,  ,  ,` | 3 |
| `muistopaikat,  ,  ,` | 3 |
| `polttokenttäkalmistot, röykkiöt,  ,` | 3 |
| `puutarhat,  ,  ,` | 3 |
| `pyyntikuopat, seidat,  ,` | 3 |
| `rajamerkit, talonpohjat, tervahaudat,` | 3 |
| `rantakivikot,  ,  ,` | 3 |
| `ratapohjat, satamat, telakat,` | 3 |
| `sotilasleirit, tykkiasemat,  ,` | 3 |
| `taistelukaivannot, uunit,  ,` | 3 |
| `tarhakalmistot,  ,  ,` | 3 |
| `tervahaudat, vallit,  ,` | 3 |
| `tornit,  ,  ,` | 3 |
| `valkamat,  ,  ,` | 3 |
| `vetokannakset,  ,  ,` | 3 |
| `,  , ei määritelty, kuppikivet` | 2 |
| `, ei määritelty, kylänpaikat,` | 2 |
| `, ei määritelty, muinaispellot,` | 2 |
| `asumuspainanteet, ei määritelty, kuopat,` | 2 |
| `asumuspainanteet, ei määritelty, punamultahaudat, pyyntikuopat` | 2 |
| `asumuspainanteet, hautaröykkiöt,  ,` | 2 |
| `asumuspainanteet, hiilimiilut, punamultahaudat,` | 2 |
| `asumuspainanteet, hiilimiilut, pyyntikuopat,` | 2 |
| `asumuspainanteet, jätinkirkot,  ,` | 2 |
| `asumuspainanteet, jätinkirkot, tervahaudat,` | 2 |
| `asumuspainanteet, keittokuopat, pyyntikuopat,` | 2 |
| `asumuspainanteet, kodanpohjat, ruumiskalmistot,` | 2 |
| `asumuspainanteet, kuopat, röykkiöt, tervahaudat` | 2 |
| `asumuspainanteet, liesikiveykset, tulisijat,` | 2 |
| `ei määritelty, hautaröykkiöt, palokuoppahaudat,` | 2 |
| `ei määritelty, hautaröykkiöt, palokuoppahaudat, ruumiskalmistot` | 2 |
| `ei määritelty, hautaröykkiöt, rakkakuopat,` | 2 |
| `ei määritelty, hautaröykkiöt, ruumiskalmistot,` | 2 |
| `ei määritelty, hautaröykkiöt, viljelyröykkiöt,` | 2 |
| `ei määritelty, hiilimiilut, tervahaudat,` | 2 |
| `ei määritelty, joukkohaudat,  ,` | 2 |
| `ei määritelty, kalliomaalaukset,  ,` | 2 |
| `ei määritelty, keittokuopat, kuopat, pyyntikuopat` | 2 |
| `ei määritelty, keittokuopat, punamultahaudat,` | 2 |
| `ei määritelty, kiukaat, kuopat,` | 2 |
| `ei määritelty, kiviaidat,  ,` | 2 |
| `ei määritelty, kivimuurit,  ,` | 2 |
| `ei määritelty, kivivallit, röykkiöt,` | 2 |
| `ei määritelty, kivivarustukset,  ,` | 2 |
| `ei määritelty, kodanpohjat, pyyntikuopat, tulisijat` | 2 |
| `ei määritelty, kuopat, röykkiöt,` | 2 |
| `ei määritelty, kuopat, talonpohjat, tervahaudat` | 2 |
| `ei määritelty, kuppikalliot, polttokenttäkalmistot,` | 2 |
| `ei määritelty, kuppikivet, punamultahaudat,` | 2 |
| `ei määritelty, kätköt, polttokenttäkalmistot,` | 2 |
| `ei määritelty, latomukset, liesikiveykset, liesilatomukset (árran)` | 2 |
| `ei määritelty, latomukset, röykkiöt,` | 2 |
| `ei määritelty, liesikiveykset, liesilatomukset (árran),` | 2 |
| `ei määritelty, liesilatomukset (árran),  ,` | 2 |
| `ei määritelty, liesilatomukset (árran), pyyntikuopat,` | 2 |
| `ei määritelty, muinaislinnat,  ,` | 2 |
| `ei määritelty, nauriskuopat, tervahaudat,` | 2 |
| `ei määritelty, punamultahaudat, pyyntikuopat,` | 2 |
| `ei määritelty, punamultahaudat, raudanvalmistuspaikat,` | 2 |
| `ei määritelty, punamultahaudat, ruumiskalmistot,` | 2 |
| `ei määritelty, pyyntikuopat, tulisijat,` | 2 |
| `ei määritelty, raudanvalmistuspaikat, talonpohjat,` | 2 |
| `ei määritelty, ryssänuunit, röykkiöt,` | 2 |
| `ei määritelty, sillanpaikat,  ,` | 2 |
| `ei määritelty, tarinapaikat,  ,` | 2 |
| `ei määritelty, vesimyllyt,  ,` | 2 |
| `eräsijat, hautasaaret, tarinapaikat,` | 2 |
| `eräsijat, hiilimiilut,  ,` | 2 |
| `eräsijat, jatulintarhat, kalkkiuunit, merimerkit` | 2 |
| `eräsijat, tomtning-jäännökset,  ,` | 2 |
| `hautakummut, kylänpaikat,  ,` | 2 |
| `hautaröykkiöt, latomukset,  ,` | 2 |
| `hautaröykkiöt, optiset lennätinasemat,  ,` | 2 |
| `hautaröykkiöt, rajamerkit,  ,` | 2 |
| `hautaröykkiöt, taistelukaivannot,  ,` | 2 |
| `hautaröykkiöt, talonpohjat,  ,` | 2 |
| `hautaröykkiöt, tervahaudat,  ,` | 2 |
| `hautasaaret, kesähaudat,  ,` | 2 |
| `hiilimiilut, kiukaat, tervahaudat,` | 2 |
| `hiilimiilut, nauriskuopat, röykkiöt,` | 2 |
| `hiilimiilut, pyyntikuopat, tervahaudat,` | 2 |
| `hiilimiilut, talonpohjat, tervahaudat,` | 2 |
| `hiilimiilut, uunit,  ,` | 2 |
| `hiilimiilut, viljelyröykkiöt,  ,` | 2 |
| `irtolöytöpaikat, talonpohjat,  ,` | 2 |
| `jatulintarhat, karsikkopaikat,  ,` | 2 |
| `kaiverrukset, kuppikalliot,  ,` | 2 |
| `kaiverrukset, polttohaudat,  ,` | 2 |
| `kaivot,  ,  ,` | 2 |
| `kartanot, paperitehtaat,  ,` | 2 |
| `kaskiröykkiöt, talonpohjat,  ,` | 2 |
| `kaupungit, linnoitukset,  ,` | 2 |
| `keittokuopat, kodanpohjat, liesilatomukset (árran), pyyntikuopat` | 2 |
| `kellarit, kiukaat, tervahaudat, uunit` | 2 |
| `kellarit, kiviaidat, talonpohjat,` | 2 |
| `kellarit, kiviaidat, talonpohjat, viljelyröykkiöt` | 2 |
| `kellarit, kuopat,  ,` | 2 |
| `kellarit, polut,  ,` | 2 |
| `kentät (gieddi), kodanpohjat,  ,` | 2 |
| `kirkkohaudat,  ,  ,` | 2 |
| `kirkkomaat,  ,  ,` | 2 |
| `kirkonpaikat, polttohaudat, ruumiskalmistot,` | 2 |
| `kiukaat, röykkiöt,  ,` | 2 |
| `kiukaat, tomtning-jäännökset, viljelyröykkiöt,` | 2 |
| `kiviaidat, louhokset,  ,` | 2 |
| `kiviaidat, nauriskuopat,  ,` | 2 |
| `kiviaidat, talonpohjat, tervahaudat, viljelyröykkiöt` | 2 |
| `kiviaidat, tienpohjat,  ,` | 2 |
| `kiviaidat, uunit, viljelyröykkiöt,` | 2 |
| `kivivallit, kuppikivet,  ,` | 2 |
| `kivivallit, ryssänuunit, röykkiöt, satamat` | 2 |
| `kivivallit, röykkiöt, tomtning-jäännökset,` | 2 |
| `kivivallit, tuulimyllyt,  ,` | 2 |
| `kodanpohjat, liesilatomukset (árran),  ,` | 2 |
| `kodanpohjat, vesimyllyt,  ,` | 2 |
| `kummut, kuopat,  ,` | 2 |
| `kuopat, latomukset, röykkiöt,` | 2 |
| `kuopat, liesikiveykset,  ,` | 2 |
| `kuopat, rajamerkit, tervahaudat,` | 2 |
| `kuopat, röykkiöt, viljelmät,` | 2 |
| `kuopat, viljelyröykkiöt,  ,` | 2 |
| `kuppikalliot, polttokenttäkalmistot, ruumiskalmistot,` | 2 |
| `kuppikivet, torpat, viljelyröykkiöt,` | 2 |
| `kuppikivet, viljelyröykkiöt,  ,` | 2 |
| `kylänpaikat, kätköt,  ,` | 2 |
| `kylänpaikat, markkinapaikat, torpat,` | 2 |
| `kylänpaikat, muinaislinnat,  ,` | 2 |
| `käräjäpaikat,  ,  ,` | 2 |
| `kätköt, pappilat,  ,` | 2 |
| `kätköt, polttokenttäkalmistot,  ,` | 2 |
| `latomukset, liesilatomukset (árran),  ,` | 2 |
| `latomukset, rakkakuopat, röykkiöt,` | 2 |
| `latomukset, röykkiöt, talonpohjat,` | 2 |
| `luostarinpaikat,  ,  ,` | 2 |
| `majakat,  ,  ,` | 2 |
| `manufaktuurit,  ,  ,` | 2 |
| `manufaktuurit, vesimyllyt,  ,` | 2 |
| `merimerkit, purnut, talonpohjat, valkamat` | 2 |
| `merimerkit, talonpohjat, valkamat,` | 2 |
| `merkkikivet,  ,  ,` | 2 |
| `muistomerkit, portaat,  ,` | 2 |
| `mäkituvat, torpat,  ,` | 2 |
| `nauriskuopat, tervahaudat,  ,` | 2 |
| `ortodoksikalmistot, tsasounanpaikat,  ,` | 2 |
| `painanteet, rakkakuopat, röykkiöt,` | 2 |
| `painanteet, tervahaudat,  ,` | 2 |
| `pajat, raudanvalmistuspaikat,  ,` | 2 |
| `pikiruukit,  ,  ,` | 2 |
| `polttokenttäkalmistot, ruumiskalmistot,  ,` | 2 |
| `polttokenttäkalmistot, talonpohjat,  ,` | 2 |
| `polut, rajamerkit,  ,` | 2 |
| `potaskauunit,  ,  ,` | 2 |
| `puistot,  ,  ,` | 2 |
| `purnut, pyyntikuopat,  ,` | 2 |
| `purnut, tulisijat,  ,` | 2 |
| `pyyntikuopat, tupasijat,  ,` | 2 |
| `rajamerkit, tarinapaikat,  ,` | 2 |
| `rajamerkit, tervahaudat,  ,` | 2 |
| `rakkakuopat, tomtning-jäännökset,  ,` | 2 |
| `ruumiskalmistot, röykkiöt,  ,` | 2 |
| `sillanpaikat, tienpohjat,  ,` | 2 |
| `sillat, talonpohjat, vesimyllyt,` | 2 |
| `sirpalekivikasat,  ,  ,` | 2 |
| `tarinapaikat, uunit,  ,` | 2 |
| `telakat,  ,  ,` | 2 |
| `tervahaudat, torpat,  ,` | 2 |
| `uittolaitteet, vesimyllyt, vesisahat,` | 2 |
| `uunit, viljelyröykkiöt,  ,` | 2 |
| `vesimyllyt, viljelmät,  ,` | 2 |
| `,  , ei määritelty,` | 1 |
| `, asumuspainanteet, röykkiöt,` | 1 |
| `, ei määritelty, hautaröykkiöt,` | 1 |
| `, ei määritelty, keittokuopat,` | 1 |
| `, ei määritelty, kuopat,` | 1 |
| `, ei määritelty, latomukset,` | 1 |
| `, ei määritelty, painanteet, pyyntikuopat` | 1 |
| `, ei määritelty, röykkiöt,` | 1 |
| `, kellarit,  ,` | 1 |
| `, kellarit, kylänpaikat,` | 1 |
| `, kylänpaikat, latomukset, lähteet` | 1 |
| `aallonmurtajat,  ,  ,` | 1 |
| `asumuspainanteet,  , ei määritelty,` | 1 |
| `asumuspainanteet, ei määritelty, hautasaaret,` | 1 |
| `asumuspainanteet, ei määritelty, kuopat, raudanvalmistuspaikat` | 1 |
| `asumuspainanteet, ei määritelty, polttohaudat,` | 1 |
| `asumuspainanteet, ei määritelty, punamultahaudat, tervahaudat` | 1 |
| `asumuspainanteet, ei määritelty, rakkakuopat,` | 1 |
| `asumuspainanteet, hiilimiilut, tervahaudat,` | 1 |
| `asumuspainanteet, jatulintarhat, rakkakuopat,` | 1 |
| `asumuspainanteet, jätinkirkot, keittokuopat, röykkiöt` | 1 |
| `asumuspainanteet, jätinkirkot, kivivallit, rakkakuopat` | 1 |
| `asumuspainanteet, jätinkirkot, kivivallit, röykkiöt` | 1 |
| `asumuspainanteet, jätinkirkot, rakkakuopat,` | 1 |
| `asumuspainanteet, jätinkirkot, rakkakuopat, tervahaudat` | 1 |
| `asumuspainanteet, kivivallit, rakkakuopat, röykkiöt` | 1 |
| `asumuspainanteet, kuopat, latomukset,` | 1 |
| `asumuspainanteet, kuopat, tienpohjat,` | 1 |
| `asumuspainanteet, kylänpaikat, röykkiöt,` | 1 |
| `asumuspainanteet, latomukset,  ,` | 1 |
| `asumuspainanteet, louhokset,  ,` | 1 |
| `asumuspainanteet, painanteet,  ,` | 1 |
| `asumuspainanteet, polttokenttäkalmistot,  ,` | 1 |
| `asumuspainanteet, punamultahaudat, pyyntikuopat,` | 1 |
| `asumuspainanteet, pyyntikuopat, raudanvalmistuspaikat,` | 1 |
| `asumuspainanteet, rakkakuopat, röykkiöt,` | 1 |
| `asumuspainanteet, ruumishaudat,  ,` | 1 |
| `asumuspainanteet, tupasijat,  ,` | 1 |
| `ei määritelty, hakkaukset, kalastuspaikat,` | 1 |
| `ei määritelty, hautakummut,  ,` | 1 |
| `ei määritelty, hautakummut, viljelmät,` | 1 |
| `ei määritelty, hautaröykkiöt, hiilimiilut, pyyntikuopat` | 1 |
| `ei määritelty, hautaröykkiöt, kiviaidat, kuppikivet` | 1 |
| `ei määritelty, hautaröykkiöt, kivivallit, kuppikivet` | 1 |
| `ei määritelty, hautaröykkiöt, kuppikivet, kätköt` | 1 |
| `ei määritelty, hautaröykkiöt, kuppikivet, rajamerkit` | 1 |
| `ei määritelty, hautaröykkiöt, kuppikivet, viljelyröykkiöt` | 1 |
| `ei määritelty, hautaröykkiöt, muinaislinnat,` | 1 |
| `ei määritelty, hautaröykkiöt, punamultahaudat,` | 1 |
| `ei määritelty, hautaröykkiöt, raudanvalmistuspaikat,` | 1 |
| `ei määritelty, hautaröykkiöt, tarhakalmistot,` | 1 |
| `ei määritelty, hautaröykkiöt, uunit,` | 1 |
| `ei määritelty, hautasaaret, hiilimiilut,` | 1 |
| `ei määritelty, hautasaaret, kodanpohjat, pyyntikuopat` | 1 |
| `ei määritelty, hautasaaret, liesilatomukset (árran), pyyntikuopat` | 1 |
| `ei määritelty, hautasaaret, tervahaudat,` | 1 |
| `ei määritelty, hautausmaat, hiilimiilut,` | 1 |
| `ei määritelty, hautausmaat, kirkonpaikat,` | 1 |
| `ei määritelty, hiilimiilut, keittokuopat, punamultahaudat` | 1 |
| `ei määritelty, hiilimiilut, muinaispellot,` | 1 |
| `ei määritelty, irtolöytöpaikat, tuulimyllyt,` | 1 |
| `ei määritelty, jätinkirkot,  ,` | 1 |
| `ei määritelty, jätinkirkot, kivivallit,` | 1 |
| `ei määritelty, jätinkirkot, röykkiöt,` | 1 |
| `ei määritelty, jätinkirkot, röykkiöt, tervahaudat` | 1 |
| `ei määritelty, kaivannot,  ,` | 1 |
| `ei määritelty, kalastuspaikat, kummelit, tomtning-jäännökset` | 1 |
| `ei määritelty, kalastuspaikat, taistelukaivannot,` | 1 |
| `ei määritelty, kalastuspaikat, talonpohjat,` | 1 |
| `ei määritelty, kartanot, polttokenttäkalmistot,` | 1 |
| `ei määritelty, kaskiröykkiöt, kiviaidat, kuppikivet` | 1 |
| `ei määritelty, kaskiröykkiöt, röykkiöt,` | 1 |
| `ei määritelty, keittokuopat, kuopat,` | 1 |
| `ei määritelty, keittokuopat, latomukset,` | 1 |
| `ei määritelty, keittokuopat, louhokset, pyyntikuopat` | 1 |
| `ei määritelty, keittokuopat, pyyntikuopat,` | 1 |
| `ei määritelty, kellarit,  ,` | 1 |
| `ei määritelty, kentät (gieddi),  ,` | 1 |
| `ei määritelty, kentät (gieddi), kodanpohjat, talvikylät` | 1 |
| `ei määritelty, kentät (gieddi), talonpohjat,` | 1 |
| `ei määritelty, kesähaudat, talonpohjat,` | 1 |
| `ei määritelty, kirkonpaikat, kuppikalliot,` | 1 |
| `ei määritelty, kirkonpaikat, muinaispellot, röykkiöt` | 1 |
| `ei määritelty, kirkonpaikat, muistomerkit,` | 1 |
| `ei määritelty, kirkonpaikat, ruumiskalmistot,` | 1 |
| `ei määritelty, kiukaat, röykkiöt,` | 1 |
| `ei määritelty, kiukaat, viljelyröykkiöt,` | 1 |
| `ei määritelty, kiviaidat, viljelyröykkiöt,` | 1 |
| `ei määritelty, kivilatomukset, kuppikalliot, polttokenttäkalmistot` | 1 |
| `ei määritelty, kivilatomukset, polttokenttäkalmistot,` | 1 |
| `ei määritelty, kivilatomukset, polttokenttäkalmistot, ruumishaudat` | 1 |
| `ei määritelty, kivivallit, rakkakuopat,` | 1 |
| `ei määritelty, kivivallit, sudenkuopat,` | 1 |
| `ei määritelty, kodanpohjat, kuopat, pyyntikuopat` | 1 |
| `ei määritelty, kodanpohjat, rakkakuopat,` | 1 |
| `ei määritelty, kummut, röykkiöt,` | 1 |
| `ei määritelty, kuopat, latomukset,` | 1 |
| `ei määritelty, kuopat, nauriskuopat, viljelyröykkiöt` | 1 |
| `ei määritelty, kuopat, painanteet,` | 1 |
| `ei määritelty, kuppikivet, louhokset, polttokenttäkalmistot` | 1 |
| `ei määritelty, kuppikivet, muinaislinnat,` | 1 |
| `ei määritelty, kuppikivet, polttokenttäkalmistot, ruumiskalmistot` | 1 |
| `ei määritelty, käräjäpaikat, palokuoppahaudat, polttohaudat` | 1 |
| `ei määritelty, käräjäpaikat, polttokenttäkalmistot,` | 1 |
| `ei määritelty, laiturit,  ,` | 1 |
| `ei määritelty, liesikiveykset, pyyntikuopat, raudanvalmistuspaikat` | 1 |
| `ei määritelty, linnoitukset,  ,` | 1 |
| `ei määritelty, louhokset, pyyntikuopat,` | 1 |
| `ei määritelty, lähteet,  ,` | 1 |
| `ei määritelty, muinaislinnat, röykkiöt,` | 1 |
| `ei määritelty, muinaispellot, talonpohjat,` | 1 |
| `ei määritelty, muinaispellot, viljelyröykkiöt,` | 1 |
| `ei määritelty, nauriskuopat,  ,` | 1 |
| `ei määritelty, ortodoksikalmistot, viljelyröykkiöt,` | 1 |
| `ei määritelty, pajat, polttokenttäkalmistot, röykkiöt` | 1 |
| `ei määritelty, pajat, raudanvalmistuspaikat,` | 1 |
| `ei määritelty, palokuoppahaudat, polttokenttäkalmistot, ruumiskalmistot` | 1 |
| `ei määritelty, polttokenttäkalmistot, raudanvalmistuspaikat,` | 1 |
| `ei määritelty, polttokenttäkalmistot, uhrikivet,` | 1 |
| `ei määritelty, poroaidat,  ,` | 1 |
| `ei määritelty, punamultahaudat, taistelukaivannot,` | 1 |
| `ei määritelty, purnut,  ,` | 1 |
| `ei määritelty, purnut, pyyntikuopat,` | 1 |
| `ei määritelty, purnut, tulisijat,` | 1 |
| `ei määritelty, pyyntikuopat, rajamerkit, tervahaudat` | 1 |
| `ei määritelty, pyyntikuopat, raudanvalmistuspaikat,` | 1 |
| `ei määritelty, pyyntikuopat, seidat,` | 1 |
| `ei määritelty, pyyntikuopat, taistelukaivannot,` | 1 |
| `ei määritelty, pyyntikuopat, talvikylät,` | 1 |
| `ei määritelty, pyyntikuopat, tupasijat,` | 1 |
| `ei määritelty, pyyntikuopat, uunit,` | 1 |
| `ei määritelty, rangaistuspaikat,  ,` | 1 |
| `ei määritelty, rautaruukit,  ,` | 1 |
| `ei määritelty, ruumiskalmistot, virkatalot,` | 1 |
| `ei määritelty, taistelukaivannot,  ,` | 1 |
| `ei määritelty, talonpohjat, tervahaudat,` | 1 |
| `ei määritelty, tulipesäkkeet,  ,` | 1 |
| `ei määritelty, tulisijat,  ,` | 1 |
| `ei määritelty, tykkiasemat,  ,` | 1 |
| `ei määritelty, yksinäistalot,  ,` | 1 |
| `eräsijat,  , kätköt,` | 1 |
| `eräsijat, hiilimiilut, tervahaudat,` | 1 |
| `eräsijat, kiukaat,  ,` | 1 |
| `eräsijat, kuopat, uunit,` | 1 |
| `eräsijat, pyyntikuopat,  ,` | 1 |
| `hakkaukset, hautaröykkiöt,  ,` | 1 |
| `hakkaukset, kalliopiirrokset,  ,` | 1 |
| `hakkaukset, kestikievarit, ryssänuunit,` | 1 |
| `hakkaukset, kiviaidat, latomukset,` | 1 |
| `hakkaukset, linnakkeet,  ,` | 1 |
| `hakkaukset, linnoitukset,  ,` | 1 |
| `hakkaukset, louhokset, rajamerkit,` | 1 |
| `hakkaukset, tarinapaikat,  ,` | 1 |
| `harkkohytit,  ,  ,` | 1 |
| `harkkohytit, hiilimiilut, raudanvalmistuspaikat,` | 1 |
| `hautakammiot,  ,  ,` | 1 |
| `hautakummut, kentät (gieddi),  ,` | 1 |
| `hautakummut, kuppikivet,  ,` | 1 |
| `hautakummut, polttokenttäkalmistot,  ,` | 1 |
| `hautaröykkiöt, irtolöytöpaikat,  ,` | 1 |
| `hautaröykkiöt, jätinkirkot,  ,` | 1 |
| `hautaröykkiöt, kaskiröykkiöt,  ,` | 1 |
| `hautaröykkiöt, kellarit,  ,` | 1 |
| `hautaröykkiöt, kiviaidat,  ,` | 1 |
| `hautaröykkiöt, kivilatomukset,  ,` | 1 |
| `hautaröykkiöt, kivilatomukset, palokuoppahaudat, tarhakalmistot` | 1 |
| `hautaröykkiöt, kivilatomukset, polttokenttäkalmistot,` | 1 |
| `hautaröykkiöt, kivipöydät,  ,` | 1 |
| `hautaröykkiöt, kivivarustukset,  ,` | 1 |
| `hautaröykkiöt, kuppikivet, muinaislinnat, muinaispellot` | 1 |
| `hautaröykkiöt, kuppikivet, muinaispellot, talonpohjat` | 1 |
| `hautaröykkiöt, kuppikivet, talonpohjat, viljelyröykkiöt` | 1 |
| `hautaröykkiöt, linnavuoret,  ,` | 1 |
| `hautaröykkiöt, linnoitukset, polttokenttäkalmistot,` | 1 |
| `hautaröykkiöt, merimerkit,  ,` | 1 |
| `hautaröykkiöt, palokuoppahaudat, polttokenttäkalmistot,` | 1 |
| `hautaröykkiöt, ruumishaudat,  ,` | 1 |
| `hautaröykkiöt, ryssänuunit, veneenvetopaikat,` | 1 |
| `hautaröykkiöt, tarhakalmistot,  ,` | 1 |
| `hautasaaret, ortodoksikalmistot,  ,` | 1 |
| `hautausmaat, hospitaalit ja sairaalat, kirkonpaikat,` | 1 |
| `hautausmaat, joukkohaudat, kirkonpaikat,` | 1 |
| `hautausmaat, kaivannot, kuopat,` | 1 |
| `hautausmaat, kaupungit, kirkonpaikat, linnoitukset` | 1 |
| `hautausmaat, kirkkohaudat, kirkonpaikat,` | 1 |
| `hautausmaat, kirkkohaudat, kirkonpaikat, ruumiskalmistot` | 1 |
| `hautausmaat, kirkonpaikat, kodanpohjat, markkinapaikat` | 1 |
| `hautausmaat, kirkonpaikat, käräjäpaikat,` | 1 |
| `hautausmaat, kirkonpaikat, markkinapaikat,` | 1 |
| `hautausmaat, kirkonpaikat, pappilat,` | 1 |
| `hautausmaat, kirkonrauniot,  ,` | 1 |
| `hautausmaat, kirkonrauniot, ruumiskalmistot,` | 1 |
| `hautausmaat, kivilatomukset,  ,` | 1 |
| `hautausmaat, muistomerkit,  ,` | 1 |
| `hautausmaat, muistomerkit, taistelukaivannot,` | 1 |
| `hautausmaat, polttokenttäkalmistot, potaskauunit,` | 1 |
| `hautausmaat, talonpohjat,  ,` | 1 |
| `hautausmaat, tienpohjat,  ,` | 1 |
| `hiekanottokuopat,  ,  ,` | 1 |
| `hiilimiilut, kaivannot,  ,` | 1 |
| `hiilimiilut, kaivot, tervahaudat,` | 1 |
| `hiilimiilut, kuopat, taistelukaivannot,` | 1 |
| `hiilimiilut, potaskauunit, röykkiöt,` | 1 |
| `hiilimiilut, rajamerkit, tervahaudat,` | 1 |
| `hiilimiilut, röykkiöt,  ,` | 1 |
| `hiilimiilut, talonpohjat,  ,` | 1 |
| `hiilimiilut, tervahaudat, torpat,` | 1 |
| `hirsivarustukset, hylyt (puu),  ,` | 1 |
| `hylyt (puu), valkamat,  ,` | 1 |
| `höyrysahat, savupiiput,  ,` | 1 |
| `höyrysahat, talonpohjat,  ,` | 1 |
| `irtolöytöpaikat, kentät (gieddi),  ,` | 1 |
| `jatulintarhat, kivivallit, röykkiöt, tomtning-jäännökset` | 1 |
| `joukkohaudat, muistomerkit,  ,` | 1 |
| `joukkohaudat, ruttohautausmaat,  ,` | 1 |
| `joukkohaudat, yksinäistalot,  ,` | 1 |
| `jätinkirkot, kivivallit, latomukset, rakkakuopat` | 1 |
| `kaivannot, kiukaat, tervahaudat,` | 1 |
| `kaivannot, kiviaidat, rajamerkit,` | 1 |
| `kaivannot, kiviaidat, talonpohjat, viljelyröykkiöt` | 1 |
| `kaivannot, kivivallit, röykkiöt, tarinapaikat` | 1 |
| `kaivannot, nauriskuopat,  ,` | 1 |
| `kaivannot, röykkiöt,  ,` | 1 |
| `kaiverrukset, karjamajat, tervahaudat,` | 1 |
| `kaiverrukset, muinaislinnat,  ,` | 1 |
| `kaiverrukset, rajamerkit,  ,` | 1 |
| `kaiverrukset, tarinapaikat,  ,` | 1 |
| `kaivot, kalastuspaikat, ruumishaudat,` | 1 |
| `kalastuspaikat, kellarit, kummut, kuopat` | 1 |
| `kalastuspaikat, lapinpadot,  ,` | 1 |
| `kalastuspaikat, rajamerkit, talonpohjat, valkamat` | 1 |
| `kalastuspaikat, vesimyllyt,  ,` | 1 |
| `kalkkiuunit, laiturit,  ,` | 1 |
| `kalkkiuunit, talonpohjat, tomtning-jäännökset,` | 1 |
| `kalkkiuunit, tiilitehtaat,  ,` | 1 |
| `kalliomaalaukset, linnavuoret,  ,` | 1 |
| `kalliopiirrokset, kuppikivet, röykkiöt,` | 1 |
| `karjamajat, tervahaudat, viljelyröykkiöt,` | 1 |
| `kartanot, kivilinnat,  ,` | 1 |
| `kartanot, kylänpaikat, markkinapaikat,` | 1 |
| `kartanot, polttokenttäkalmistot,  ,` | 1 |
| `kartanot, puutarhat,  ,` | 1 |
| `kartanot, talonpohjat,  ,` | 1 |
| `kaskiröykkiöt, kellarit,  ,` | 1 |
| `kaskiröykkiöt, kellarit, talonpohjat,` | 1 |
| `kaskiröykkiöt, kirkonpaikat,  ,` | 1 |
| `kaskiröykkiöt, kiukaat, kiviaidat, talonpohjat` | 1 |
| `kaskiröykkiöt, kiviaidat, nauriskuopat,` | 1 |
| `kaskiröykkiöt, kivivallit, nauriskuopat, talonpohjat` | 1 |
| `kaskiröykkiöt, kuopat,  ,` | 1 |
| `kaskiröykkiöt, kuopat, talonpohjat,` | 1 |
| `kaskiröykkiöt, röykkiöt,  ,` | 1 |
| `kaskiröykkiöt, torpat,  ,` | 1 |
| `kaskiröykkiöt, viljelyröykkiöt,  ,` | 1 |
| `kaupungit, kirkonpaikat,  ,` | 1 |
| `kaupungit, kylänpaikat,  ,` | 1 |
| `keittokuopat, kodanpohjat, liesikiveykset, pyyntikuopat` | 1 |
| `keittokuopat, liesilatomukset (árran), pyyntikuopat,` | 1 |
| `keittokuopat, pyyntikuopat, tervahaudat,` | 1 |
| `keittokuopat, rakkakuopat, röykkiöt,` | 1 |
| `kellarit, kellotapulinpaikat, kirkkomaat, polttohaudat` | 1 |
| `kellarit, kuninkaankartanot,  ,` | 1 |
| `kellarit, kuopat, talonpohjat,` | 1 |
| `kellarit, kuopat, uunit, viljelyröykkiöt` | 1 |
| `kellarit, kylänpaikat,  ,` | 1 |
| `kellarit, latomukset, röykkiöt,` | 1 |
| `kellarit, merimerkit,  ,` | 1 |
| `kellarit, röykkiöt,  ,` | 1 |
| `kellarit, talonpohjat, valkamat,` | 1 |
| `kellarit, talonpohjat, viljelyröykkiöt,` | 1 |
| `kellarit, torpat,  ,` | 1 |
| `kellarit, torpat, vesimyllyt, vesisahat` | 1 |
| `kellarit, viljelyröykkiöt,  ,` | 1 |
| `kellotapulinpaikat,  ,  ,` | 1 |
| `kellotapulinpaikat, kirkkohaudat, kirkkomaat, kirkonpaikat` | 1 |
| `kentät (gieddi), kirkonpaikat, kodanpohjat, tupasijat` | 1 |
| `kentät (gieddi), latomukset, pyyntikuopat,` | 1 |
| `kentät (gieddi), seidat,  ,` | 1 |
| `keramiikkatehtaat,  ,  ,` | 1 |
| `kestikievarit, kylänpaikat,  ,` | 1 |
| `kesähaudat, kiviaidat, tarinapaikat, tervahaudat` | 1 |
| `kiinnitysrenkaat, tienpohjat, valkamat,` | 1 |
| `kirkkohaudat, kirkonpaikat, muistomerkit,` | 1 |
| `kirkkorakennukset,  ,  ,` | 1 |
| `kirkonpaikat, kylänpaikat,  ,` | 1 |
| `kirkonpaikat, kylänpaikat, ortodoksikalmistot,` | 1 |
| `kirkonpaikat, markkinapaikat,  ,` | 1 |
| `kirkonpaikat, markkinapaikat, muistopaikat,` | 1 |
| `kirkonpaikat, ortodoksikalmistot,  ,` | 1 |
| `kirkonpaikat, ruumishaudat, ruumiskalmistot,` | 1 |
| `kiukaat, kiviaidat, viljelyröykkiöt,` | 1 |
| `kiukaat, kuopat, röykkiöt,` | 1 |
| `kiukaat, muinaislinnat,  ,` | 1 |
| `kiukaat, pyyntikuopat,  ,` | 1 |
| `kiukaat, pyyntikuopat, tulisijat,` | 1 |
| `kiukaat, röykkiöt, talonpohjat,` | 1 |
| `kiukaat, tarinapaikat, tervahaudat, uunit` | 1 |
| `kiukaat, viljelyröykkiöt,  ,` | 1 |
| `kiviaidat,  , kuopat, viljelyröykkiöt` | 1 |
| `kiviaidat, kivimuurit, röykkiöt, talonpohjat` | 1 |
| `kiviaidat, kuopat,  ,` | 1 |
| `kiviaidat, kuopat, röykkiöt,` | 1 |
| `kiviaidat, kylänpaikat, louhokset, salpietarikeittimöt` | 1 |
| `kiviaidat, muinaispellot,  ,` | 1 |
| `kiviaidat, rajamerkit,  ,` | 1 |
| `kiviaidat, röykkiöt, tarinapaikat,` | 1 |
| `kiviaidat, viljelmät,  ,` | 1 |
| `kiviaidat, viljelyröykkiöt, yksinäistalot,` | 1 |
| `kiviaidat, yksinäistalot,  ,` | 1 |
| `kivilatomukset, kylänpaikat, muinaispellot, röykkiöt` | 1 |
| `kivimuurit, tienpohjat, torpat,` | 1 |
| `kivipöydät, merkkipuut,  ,` | 1 |
| `kivivallit, painanteet, röykkiöt,` | 1 |
| `kivivallit, rakkakuopat,  ,` | 1 |
| `kivivallit, ryssänuunit,  ,` | 1 |
| `kivivallit, sillat,  ,` | 1 |
| `kivivallit, vallit,  ,` | 1 |
| `kodanpohjat, liesilatomukset (árran), pyyntikuopat,` | 1 |
| `kodanpohjat, purnut,  ,` | 1 |
| `kodanpohjat, röykkiöt,  ,` | 1 |
| `kodanpohjat, talvikylät,  ,` | 1 |
| `korsut, maavallit, taistelukaivannot, tulipesäkkeet` | 1 |
| `kummut, talonpohjat,  ,` | 1 |
| `kuninkaankartanot, pappilat, virkatalot,` | 1 |
| `kuopat, liesikiveykset, tulisijat,` | 1 |
| `kuopat, painanteet,  ,` | 1 |
| `kuopat, painanteet, tervahaudat,` | 1 |
| `kuopat, pikiruukit,  ,` | 1 |
| `kuopat, talonpohjat, tervahaudat,` | 1 |
| `kuparinsulattamot,  ,  ,` | 1 |
| `kuppikalliot, kylänpaikat,  ,` | 1 |
| `kuppikalliot, lapinrauniot,  ,` | 1 |
| `kuppikivet, kylänpaikat,  ,` | 1 |
| `kuppikivet, kylänpaikat, polttokenttäkalmistot,` | 1 |
| `kuppikivet, muinaispellot, viljelmät,` | 1 |
| `kuppikivet, palokuoppahaudat,  ,` | 1 |
| `kylänpaikat, latomukset,  ,` | 1 |
| `kylänpaikat, markkinapaikat,  ,` | 1 |
| `kylänpaikat, mäkituvat,  ,` | 1 |
| `kylänpaikat, pajat,  ,` | 1 |
| `kylänpaikat, pappilat, ruumiskalmistot,` | 1 |
| `kylänpaikat, raudanvalmistuspaikat, röykkiöt, viljelmät` | 1 |
| `kylänpaikat, talonpohjat,  ,` | 1 |
| `kylänpaikat, uunit,  ,` | 1 |
| `kylänpaikat, vallit,  ,` | 1 |
| `kylänpaikat, viljelyröykkiöt,  ,` | 1 |
| `kätköt, polttohaudat,  ,` | 1 |
| `laiturit, lähteet, tervahaudat, vesimyllyt` | 1 |
| `laiturit, tienpohjat,  ,` | 1 |
| `laiturit, valkamat,  ,` | 1 |
| `laivalatomukset,  ,  ,` | 1 |
| `laivanrakennuspaikat, satamat,  ,` | 1 |
| `laivanrakennuspaikat, telakat,  ,` | 1 |
| `lapinrauniot, rajamerkit,  ,` | 1 |
| `latomukset, liesikiveykset,  ,` | 1 |
| `latomukset, liesilatomukset (árran), pyyntikuopat,` | 1 |
| `latomukset, maanmittauspisteet,  ,` | 1 |
| `latomukset, painanteet,  ,` | 1 |
| `latomukset, piilopirtit,  ,` | 1 |
| `latomukset, purnut,  ,` | 1 |
| `latomukset, purnut, pyyntikuopat,` | 1 |
| `latomukset, rajamerkit,  ,` | 1 |
| `latomukset, uunit,  ,` | 1 |
| `liesikiveykset, liesilatomukset (árran),  ,` | 1 |
| `liesikiveykset, liesilatomukset (árran), pyyntikuopat,` | 1 |
| `liesikiveykset, purnut,  ,` | 1 |
| `linnamalmit,  ,  ,` | 1 |
| `linnat, satamat,  ,` | 1 |
| `louhokset, ruumiskalmistot,  ,` | 1 |
| `louhokset, sirpalekivikasat,  ,` | 1 |
| `louhokset, tienpohjat,  ,` | 1 |
| `louhokset, uunit,  ,` | 1 |
| `lähteet, ortodoksikalmistot,  ,` | 1 |
| `lähteet, röykkiöt,  ,` | 1 |
| `maanmittauspisteet, röykkiöt, tarinapaikat,` | 1 |
| `masuunit, raudanvalmistuspaikat,  ,` | 1 |
| `masuunit, vesimyllyt,  ,` | 1 |
| `merkkikivet, merkkipuut, polut,` | 1 |
| `muinaislinnat, polttohaudat, talonpohjat,` | 1 |
| `muinaispellot, talonpohjat,  ,` | 1 |
| `muinaispellot, viljelyröykkiöt,  ,` | 1 |
| `muistopaikat, piilopirtit,  ,` | 1 |
| `muistopaikat, rajamerkit,  ,` | 1 |
| `nauriskuopat, röykkiöt, talonpohjat,` | 1 |
| `nauriskuopat, torpat,  ,` | 1 |
| `nauriskuopat, viljelmät,  ,` | 1 |
| `nauriskuopat, viljelyröykkiöt, yksinäistalot,` | 1 |
| `ortodoksikalmistot, viljelyröykkiöt,  ,` | 1 |
| `painanteet, pyyntikuopat,  ,` | 1 |
| `painanteet, röykkiöt,  ,` | 1 |
| `palokuoppahaudat,  ,  ,` | 1 |
| `palokuoppahaudat, polttokenttäkalmistot,  ,` | 1 |
| `panssariesteet, sillat, taistelupaikat, vesimyllyt` | 1 |
| `paperitehtaat, rajamerkit,  ,` | 1 |
| `pappilat, röykkiöt,  ,` | 1 |
| `pappilat, taistelupaikat,  ,` | 1 |
| `piilopirtit, tervahaudat,  ,` | 1 |
| `piiskauspetäjät,  ,  ,` | 1 |
| `pirunpellot,  ,  ,` | 1 |
| `polttohaudat, ruumishaudat,  ,` | 1 |
| `polttohaudat, ruumiskalmistot,  ,` | 1 |
| `polttokenttäkalmistot, raudanvalmistuspaikat, ruumiskalmistot,` | 1 |
| `polttokenttäkalmistot, ruumishaudat,  ,` | 1 |
| `polttokenttäkalmistot, ruumiskalmistot, talonpohjat,` | 1 |
| `pyyntikuopat, rakkakuopat, röykkiöt,` | 1 |
| `pyyntikuopat, röykkiöt, tervahaudat,` | 1 |
| `pyyntikuopat, taistelukaivannot,  ,` | 1 |
| `pyyntitukikohdat, veneenvetopaikat,  ,` | 1 |
| `rajamerkit, rakkakuopat,  ,` | 1 |
| `rajamerkit, rakkakuopat, röykkiöt,` | 1 |
| `rajamerkit, seidat,  ,` | 1 |
| `rajamerkit, talonpohjat,  ,` | 1 |
| `rajamerkit, torpat,  ,` | 1 |
| `rajamerkit, yksinäistalot,  ,` | 1 |
| `rangaistuspaikat, talonpohjat,  ,` | 1 |
| `ratapohjat, sillat,  ,` | 1 |
| `ratapohjat, sotilasleirit,  ,` | 1 |
| `ratapohjat, taistelukaivannot,  ,` | 1 |
| `rautaruukit, sillat,  ,` | 1 |
| `ruuhet,  ,  ,` | 1 |
| `ruumiskalmistot, talonpohjat,  ,` | 1 |
| `ruumiskalmistot, tarhakalmistot,  ,` | 1 |
| `röykkiöt, suojahuoneet,  ,` | 1 |
| `röykkiöt, taistelukaivannot,  ,` | 1 |
| `röykkiöt, talonpohjat, uunit,` | 1 |
| `röykkiöt, tarinapaikat,  ,` | 1 |
| `röykkiöt, tomtning-jäännökset,  ,` | 1 |
| `röykkiöt, torpat,  ,` | 1 |
| `röykkiöt, vallit,  ,` | 1 |
| `röykkiöt, viljelmät,  ,` | 1 |
| `röykkiöt, viljelmät, yksinäistalot,` | 1 |
| `röykkiöt, viljelyröykkiöt,  ,` | 1 |
| `satamat, veneenvetopaikat,  ,` | 1 |
| `savenottokuopat,  ,  ,` | 1 |
| `sillanpaikat, taistelupaikat,  ,` | 1 |
| `sillanpaikat, vesimyllyt,  ,` | 1 |
| `suojahuoneet, taistelukaivannot,  ,` | 1 |
| `taistelukaivannot, tienpohjat,  ,` | 1 |
| `taistelukaivannot, tienpohjat, valkamat,` | 1 |
| `talonpohjat, tervahaudat, viljelyröykkiöt,` | 1 |
| `talonpohjat, uunit,  ,` | 1 |
| `talvikylät,  ,  ,` | 1 |
| `tervahaudat, tiilenpolttouunit,  ,` | 1 |
| `tervahaudat, tulisijat,  ,` | 1 |
| `tervahaudat, viljelyröykkiöt,  ,` | 1 |
| `terveyslähteet,  ,  ,` | 1 |
| `tienpohjat, torpat, viljelmät,` | 1 |
| `torpat,  , viljelmät,` | 1 |
| `torpat, tuulimyllyt,  ,` | 1 |
| `torpat, uunit,  ,` | 1 |
| `tsasounanpaikat,  ,  ,` | 1 |
| `tulipesäkkeet, tykkiasemat,  ,` | 1 |
| `tupasijat, viljelyröykkiöt,  ,` | 1 |
| `uhripuut,  ,  ,` | 1 |
| `viljelmät, viljelyröykkiöt,  ,` | 1 |
| `virstanpylväät,  ,  ,` | 1 |

### Arkeologisen pistekohteen vedenalaisuus

Lähde: `arkeologiset_kohteet_piste_t.gpkg`, kenttä `vedenalainen`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `e` | 86259 |
| `E` | 23573 |
| `K` | 1427 |
| `k` | 1182 |

### Arkeologisen pistekohteen paikannustapa

Lähde: `arkeologiset_kohteet_piste_t.gpkg`, kenttä `paikannustapa`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `<NULL/tyhjä>` | 70093 |
| `Muu lähde` | 38547 |
| `Tarkastus` | 2116 |
| `Maastomittaus` | 1685 |

### Arkeologisen pistekohteen paikannustarkkuus

Lähde: `arkeologiset_kohteet_piste_t.gpkg`, kenttä `paikannustarkkuus`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `<NULL/tyhjä>` | 68819 |
| `Tarkka (< 10 m)` | 39394 |
| `Ohjeellinen (10 - 100 m)` | 3046 |
| `Ei tiedossa` | 660 |
| `Suuntaa antava (100 - 1000 m)` | 435 |
| `> 1000m` | 87 |

### Arkeologisen alueen rajaustyyppi

Lähde: `arkeologiset_kohteet_alue_t.gpkg`, kenttä `rajaustyyppi`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `<NULL/tyhjä>` | 68215 |
| `Ohjeellinen` | 14906 |
| `Suuntaa antava` | 2530 |
| `Tarkka` | 1052 |

### Arkeologisen alueen rajauslähde

Lähde: `arkeologiset_kohteet_alue_t.gpkg`, kenttä `rajauslähde`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `<NULL/tyhjä>` | 68320 |
| `Tarkastus` | 16680 |
| `Muu lähde` | 968 |
| `Maastonmittaus` | 735 |

### Rakennuspisteen suojeluryhmäyhdistelmät

Lähde: `suojellut_rakennukset_piste.gpkg`, kenttä `suojeluryhmä`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `Kirkkolaki,  ,  ,` | 792 |
| `Rautatiesopimus 1998,  ,  ,` | 778 |
| `Asetus 480/85,  ,  ,` | 672 |
| `Laki ortodoksisesta kirkosta,  ,  ,` | 20 |
| `Asetus 480/85, Laki rakennusperinnön suojelemisesta,  ,` | 15 |
| `Laki rakennusperinnön suojelemisesta, Rautatiesopimus 1998,  ,` | 8 |
| `Asetus 480/85, Kirkkolaki,  ,` | 2 |
| `Asetus 480/85, Laki rakennusperinnön suojelemisesta, Rautatiesopimus 1998,` | 1 |
| `Asetus 480/85, Rakennussuojelulaki,  ,` | 1 |
| `Asetus 480/85, Rautatiesopimus 1998,  ,` | 1 |

### Rakennusalueen suojeluryhmäyhdistelmät

Lähde: `suojellut_rakennukset_alue.gpkg`, kenttä `suojeluryhmä`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `Rautatiesopimus 1998,  ,  ,` | 77 |
| `Asetus 480/85,  ,  ,` | 38 |
| `, Rautatiesopimus 1998,  ,` | 10 |
| `Asetus 480/85, Laki rakennusperinnön suojelemisesta,  ,` | 8 |
| `Rakennussuojelulaki, Rautatiesopimus 1998,  ,` | 2 |
| `Asetus 480/85, Rakennussuojelulaki,  ,` | 1 |
| `Laki rakennusperinnön suojelemisesta, Rakennussuojelulaki, Rautatiesopimus 1998,` | 1 |
| `Laki rakennusperinnön suojelemisesta, Rautatiesopimus 1998,  ,` | 1 |

### Rakennuspisteen suojelun tila

Lähde: `suojellut_rakennukset_piste.gpkg`, kenttä `suojelun_tila`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `Suojeltu` | 2290 |

### Rakennusalueen suojelun tila

Lähde: `suojellut_rakennukset_alue.gpkg`, kenttä `suojelun_tila`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `Suojeltu` | 138 |

### Maailmanperintöalueen tyyppi

Lähde: `maailmanperintokohde_alue.gpkg`, kenttä `aluetyyppi`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `Kohde` | 26 |
| `Suoja-alue` | 24 |

### VARK-rajauksen poikkeavuus

Lähde: `VARK_aluerajaukset.gpkg`, kenttä `Poikkeava`. Arvot esitetään täsmälleen aineistossa olevassa kirjoitusasussa.

| Arvo | Lukumäärä |
| --- | ---: |
| `e` | 942 |
| `K` | 51 |
| `E` | 16 |
| `k` | 1 |

### Arkeologisten tyyppi- ja alatyyppikenttien kardinaliteetti

Pääaineistojen `tyyppi`- ja `alatyyppi`-kentät ovat neljän pilkuilla erotetun arvopaikan moniarvokenttiä. Myös arvo `taide, muistomerkit` sisältää pilkun, joten kenttää ei voi jäsentää turvallisesti tavallisella pilkkujaolla. Alakohdeaineistossa kentät ovat yksiarvoisia.

| Aineisto | Erillisiä raakamuotoisia tyyppiarvoja | Erillisiä raakamuotoisia alatyyppiarvoja |
| --- | ---: | ---: |
| `arkeologiset_kohteet_piste_t.gpkg` | 258 | 1145 |
| `arkeologiset_kohteet_alue_t.gpkg` | 226 | 999 |
| `arkeologiset_kohteet_alakohteet_piste.gpkg` | 18 | 179 |

PDF määrittelee 18 arkeologista päätyyppiä ja kertoo alatyyppejä olevan noin 200. Tuotantoaineiston alakohteissa on 18 tyyppiä ja 179 alatyyppiä, mutta piste- ja alueaineistojen moniarvoinen tallennus tuottaa satoja tai yli tuhat raakamuotoista yhdistelmää.

## Havaitut ristiriidat ja tulkintariskit

1. **Dokumentin ikä ja kattavuus:** PDF:n määrittely on vuodelta 2017 eikä kuvaa VARK-aineistoa lainkaan. Tuotantoaineistossa VARK on oma piste- ja rajauskokonaisuutensa.
2. **Jakelumuoto:** PDF:n jakelutiedoissa mainitaan vain WMS, vaikka nykyinen ladattava tuote koostuu 12 GeoPackage-tiedostosta sekä QML-tyyleistä.
3. **Arkeologisen lajin arvojoukko:** PDF:n kahdeksasta arvosta `ei määritelty` ei esiinny nykyisten aineistojen `laji`-kentässä. Tuotantoaineistossa esiintyy sen sijaan `havaintokohde` (pisteissä 36 416 riviä), jota PDF ei tunne.
4. **Arkeologisen tyypin arvojoukko:** PDF mainitsee tyypin `muinaisjäännösryhmät`, jota ei löydy yhdestäkään nykyisestä arkeologisesta aineistosta. Nykyinen aineisto sisältää tyypin `puurakenteet`, jota PDF ei luettele.
5. **Kirjainkoko vedenalaisuuskoodissa:** PDF sallii vain pienet `k` ja `e`, mutta tuotantoaineistossa esiintyvät erillisinä myös `K` ja `E`. Sovelluksessa arvo on normalisoitava kirjainkoosta riippumattomasti.
6. **Paikannustavan kirjoitusasu:** PDF käyttää arvoa `Maastonimittaus`, kun aineistossa arvo on `Maastomittaus`.
7. **Rajauslähteen arvojoukko:** PDF luettelee arvot `Rajaus`, `Tarkastus` ja `Muu lähde`. Aineistossa `Rajaus` ei esiinny, mutta `Maastonmittaus` esiintyy.
8. **Rakennusperinnön suojelun tila:** PDF luettelee kuusi tilaa (esimerkiksi `Hyväksytty` ja `Ei suojeltu`), mutta kummankin nykyisen rakennusaineiston ainoa arvo on `Suojeltu`, jota PDF ei luettele.
9. **Rakennusperinnön skeema:** PDF:n kentät `luontipvm`, `muutospvm`, `paikannustapa`, `paikannustarkkuus` ja `selite` puuttuvat nykyisistä rakennusaineistoista. Nykyinen `SuojeluPäätöspvm` puolestaan puuttuu PDF:stä.
10. **Suojeluryhmän rakenne:** PDF kuvaa kentän yksittäisenä arvojoukkona. Nykyinen aineisto tallentaa enintään neljä arvoa yhteen pilkuilla erotettuun merkkijonoon ja sisältää tyhjiä arvopaikkoja. Kenttä pitää normalisoida listaksi ennen suodatusta tai esittämistä.
11. **Arkeologisten kenttien skeema:** nykyisissä piste- ja alueaineistoissa on PDF:stä puuttuvia kenttiä, kuten `ajoitus`; pisteaineistossa lisäksi `KOHDE_APVM` ja `KOHDE_MPVM`. Alueaineistossa `muutospvm` on SQLite-tyypiltään `TEXT`, vaikka PDF määrittelee sen `DateTime`-kentäksi.
12. **Maailmanperintöalueen ID-tyyppi:** PDF määrittelee alueen `ID`-kentän merkkijonoksi, mutta GeoPackage käyttää `MEDIUMINT`-tyyppiä.
13. **Yleiset skeemaerot:** kenttien kirjainkoko vaihtelee aineistojen välillä (esimerkiksi `Laji`/`laji`, `Nimi`/`nimi`, `URL`/`url`). Sisäisen skeeman on oltava kirjainkoon suhteen eksplisiittinen.

Ristiriidat eivät tarkoita, että tuotantoaineisto olisi virheellinen. Useimmat osoittavat, että historiallinen PDF ei ole pysynyt muuttuvan rekisterimallin tasalla. Rakennusputken pitää validoida nykyinen aineisto ja raportoida uudet arvot, mutta sen ei pidä hylätä niitä vain PDF-poikkeaman vuoksi.

## Tunnisteet ja tasojen väliset suhteet

Tässä erotetaan **looginen kohdetunniste** ja **geometriarivin tunniste**. Rekisteritunnus yhdistää saman kohteen eri geometriaesitykset ja kuuluu hakuun sekä käyttöliittymän kohdelinkitykseen. Yhdellä rekisterikohteella voi kuitenkin olla monta riviä samalla tasolla, joten rekisteritunnus ei yksin riitä MVT-feature-ID:ksi.

### Tunnisteiden kattavuus ja yksikäsitteisyys

| Kohdetaso | Ehdokas loogiseksi avaimeksi | Rivejä | Ei-NULL | Erillisiä loogisia avaimia | Erillisiä `inspireID`-arvoja |
| --- | --- | ---: | ---: | ---: | ---: |
| Arkeologinen piste | `mjtunnus` | 112441 | 112441 | 112439 | 112441 |
| Arkeologinen alue | `mjtunnus` | 86703 | 86703 | 74383 | 86703 |
| Arkeologinen alakohde | `mjtunnus + alakohdetunnus` | 63216 | 63216 | 63196 | 63216 |
| Rakennuspiste | `rakennusID` | 2290 | 2290 | 2288 | 2288 |
| Rakennusalue | `KOHDEID` | 138 | 138 | 130 | 138 |
| RKY-piste | `ID` | 64 | 64 | 23 | 64 |
| RKY-alue | `ID` | 1851 | 1851 | 1224 | 1851 |
| RKY-viiva | `ID` | 186 | 186 | 27 | 186 |
| Maailmanperintöpiste | `ID` | 6 | 6 | 1 | 6 |
| Maailmanperintöalue | `ID` | 50 | 50 | 8 | 50 |
| VARK-keskipiste | `VARK_ID` | 1010 | 1010 | 1010 | - |
| VARK-rajaus | `VARK_ID` | 1010 | 1010 | 1010 | - |

### Tasojen väliset tunnisteosumat

| Suhde | Yhdistävä kenttä | Vasemman tason avaimia | Oikean tason avaimia | Yhteisiä avaimia |
| --- | --- | ---: | ---: | ---: |
| Arkeologinen piste ↔ alue | `mjtunnus` | 112439 | 74383 | 74372 |
| Alakohteen vanhempi ↔ piste | `mjtunnus` | 14671 | 112439 | 14671 |
| Rakennuspiste ↔ alue | `KOHDEID` | 866 | 130 | 127 |
| RKY-piste ↔ alue | `ID` | 23 | 1224 | 7 |
| RKY-piste ↔ viiva | `ID` | 23 | 27 | 1 |
| RKY-alue ↔ viiva | `ID` | 1224 | 27 | 9 |
| Maailmanperintöpiste ↔ alue | `ID` | 1 | 8 | 1 |
| VARK-keskipiste ↔ rajaus | `VARK_ID` | 1010 | 1010 | 1010 |

### Tunnistesopimus toteutukselle

- Arkeologisen pääkohteen looginen avain on `mjtunnus`. Alakohteen looginen avain on `mjtunnus + alakohdetunnus`. Kaikkien 14 671 alakohteiden erillisen vanhemman `mjtunnus` löytyy pisteaineistosta.
- Rakennusperinnön kohderyhmän avain on `KOHDEID`; yksittäisen rakennuksen avain on `rakennusID`. Alue liittyy kohderyhmään `KOHDEID`:llä, ei `rakennusID`:llä.
- RKY:n looginen avain on `ID`, maailmanperintökohteen looginen avain on `ID` ja VARK-kohteen looginen avain on `VARK_ID`.
- `inspireID` on hyvä geometriarivin avaimen lähtökohta, koska se on yksikäsitteinen kaikissa muissa sitä sisältävissä tasoissa paitsi rakennuspisteissä. Rakennuspisteissä kaksi `inspireID`-arvoa esiintyy kumpikin kahdesti.
- MVT-feature-ID:n lähtöavain muodostetaan deterministisesti yhdistelmästä `source_layer + inspireID + geometry_part`. Jos `inspireID` puuttuu (VARK), käytetään `source_layer + logical_id + geometry_part`. `geometry_part` johdetaan saman avaimen geometrioiden vakaasta järjestyksestä tai geometriatiivisteestä; GeoPackagen `fid`-arvoa ei oleteta vakaaksi päivittäisten versioiden välillä. Lähtöavain muunnetaan MVT:n vaatimaksi 64-bittiseksi kokonaisluvuksi vakaalla hajautuksella, ja rakennusajo tarkistaa törmäykset.
- D1-haku deduplikoidaan loogisella avaimella ja rekisterillä. Hakutulos voi tämän jälkeen viitata yhteen tai useaan saman kohteen geometriaan kartalla.

### Tunnisteisiin liittyvät havainnot

- Arkeologisessa pisteaineistossa on 112 441 riviä mutta 112 439 eri `mjtunnus`-arvoa. Alueaineistossa on 86 703 riviä mutta 74 383 eri `mjtunnus`-arvoa. Rekisteritunnus ei siis ole rivikohtainen avain.
- Alakohteen yhdistelmä `mjtunnus + alakohdetunnus` tuottaa 63 196 eri arvoa 63 216 riville. Myös alakohteella voi olla useita geometriarivejä.
- Rakennuspisteiden 2 290 riviä kuuluvat 866 `KOHDEID`-kohderyhmään ja 2 288 `rakennusID`-rakennukseen.
- RKY:n ja maailmanperinnön `ID` kuvaa kohdetta, ei geometriariviä. Esimerkiksi maailmanperintöpisteiden kuudella rivillä on vain yksi yhteinen `ID`, mutta kuusi eri `inspireID`-arvoa.
- VARK on nykyisessä aineistossa siistein yksi-yhteen-suhde: kaikki 1 010 `VARK_ID`-arvoa löytyvät sekä keskipiste- että rajausaineistosta.

