# Aineiston julkaisu- ja käyttöönottosopimus

## Tavoite

Pienen sivuston päivittäinen käyttöönotto tehdään tarkoituksella yksinkertaisesti. Tuotannossa on yksi aktiivinen PMTiles-arkisto ja yksi aktiivinen D1-aineisto. Uusi Museoviraston aineisto julkaistaan klo 00:00 UTC, joten vaihto ajastetaan Suomen yön hiljaiseen huoltoikkunaan.

Selain ei hae metatietoja ennen karttaa. Karttaliikenteen vakio-osoite on aina `/api/museovirasto/pmtiles`, ja ominaisuustietojen API käyttää aina aktiivista D1-aineistoa.

## Versio

Ihmisen luettava versio johdetaan lähde-ZIPin GeoPackage-tiedostojen julkaisupäivästä ja normalisoidaan ilmoitettuun julkaisuaikaan:

```text
YYYYMMDDT000000Z
```

Esimerkki: `20260822T000000Z`. Versio helpottaa lokien, varmuuskopioiden ja vikojen selvittämistä. SHA-256-tiivisteitä ei käytetä versionumerona, vaan rakennettujen tiedostojen eheystarkistuksina.

## Aktiiviset kohteet

| Kohde | Sijainti tai avain |
|---|---|
| PMTiles R2:ssa | `current.pmtiles` |
| selaimen PMTiles-reitti | `/api/museovirasto/pmtiles` |
| valinnainen metadata R2:ssa | `current.json` |
| valinnainen metatietoreitti | `/api/museovirasto/meta` |
| D1-aineisto | `feature_details` |

Karttaklikkauksen massahaku käyttää `sourceLayer + featureId` -pareja. Pysyvät URL:t käyttävät `logicalLayerId + registryId` -pareja ja palauttavat kaikki uusimmasta aineistosta löytyvät geometriat. Pyyntöihin ei lisätä versiota.

## Rakennus ja käyttöönotto

1. Lataa lähdeaineisto ja varmista, että GeoPackage-tiedostojen julkaisupäivä on yhtenäinen.
2. Rakenna PMTiles, D1-tuonti, suodatinkoodisto, raportit ja manifesti sivussa.
3. Johda aikaleimaversio ja tallenna kaikkien artefaktien SHA-256-tiivisteet julkaisudeskriptoriin.
4. Aja skeema-, rivimäärä-, geometria-, koodisto- ja PMTiles–D1-identiteettitarkistukset.
5. Säilytä tarvittaessa palautuspaketti avaimilla `releases/<version>/map.pmtiles`, `releases/<version>/release.json` ja vastaavilla aikaleimallisilla nimillä.
6. Korvaa D1:n `feature_details` yhden transaktion sisällä ja R2:n `current.pmtiles` sekä `current.json` uusilla artefakteilla.
7. Savutestaa PMTiles Range -pyyntö, karttaklikkauksen massahaku, rekisteritunnushaku ja sanahaku.

R2:n ja D1:n vaihtoa ei yritetä tehdä hajautettuna atomisena operaationa eikä erillistä huoltotilaa ylläpidetä. Yölliseen vaihtoon voi siksi sisältyä lyhyt sekatila, joka hyväksytään tämän sivuston liikennemäärällä. Jos smoke-testi epäonnistuu, palauta edellisen aikaleimaversion PMTiles, metadata ja D1-varmuuskopio välittömästi.

## Välimuisti

`current.pmtiles` voi vaihtua kerran päivässä, joten sitä ei merkitä `immutable`-sisällöksi. Worker palauttaa sille lyhyen välimuistiajan. PMTiles-lukija tekee Range-pyynnöt suoraan ilman ensin tehtävää `/api/museovirasto/meta`-pyyntöä. Aikaleimalliset palautusobjektit ovat muuttumattomia, jos niitä myöhemmin tarjotaan erillisestä ylläpito- tai vianmääritysreitistä.

## Paikallinen PoC

`processing/scripts/25-create-release-descriptor.sh` tuottaa `release-descriptor.json`- ja `current-metadata.json`-tiedostot. Paikallinen R2-siemennys kirjoittaa `current.pmtiles`- ja `current.json`-objektit. D1-siemennys tyhjentää ja täyttää yhden `feature_details`-taulun transaktion sisällä. PoC ei muuta ulkoista Cloudflare-ympäristöä.
