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

