# Oma palvelu Museoviraston karttadatalle

## Ongelma 

Museoviraston avoimen datan [WMS](https://geoserver.museovirasto.fi/geoserver/rajapinta_suojellut/wms) ja [WFS](https://geoserver.museovirasto.fi/geoserver/rajapinta_suojellut/wfs) rajapinnat ovat erittäin hitaita muinaismuistot.info sivuston käyttötarkoitukseen. 

Karttatiilien hakeminen ja kohteiden identifiointi koordinaatille WMS-rajapinnassa ja hakusanapohjainen haku WFS-rajapinnasta ovat aika nopeita yhdelle karttatasolle. Ongelmana on, että aineistoa on 26 kartttatasoa. Edes puolen näistä tasoista pyytäminen rendreröitäväksi samaan karttatiileen tai identifiointikutsuun tiputtaa suorituskyvyn 5-15 sekuntiin per kutsu. Sama ongelma on WFS-rajapinnassa. 

Karttatiilien kohdalla ongelma vielä kertautuu, koska selaimet suostyvat tekemään vain tietyn määrän rinnakkaisia HTTP-kutsuja. Tällöin näkymän karttatiilien latausajaksi voi tulla 10 + 10 + 10 sekuntia, kun lataus alkaa kolmessa eri erässä.

Muinaismuistot.info sivyston käyttö on tämän vuoksi erityisen tahmeaa ja hidasta.

### Käytetyt rajapinnat

- WMS GetMap
   - `https://geoserver.museovirasto.fi/geoserver/ows?REQUEST=GetMap&SERVICE=WMS`
   - [Esimerkkikutsu](https://geoserver.museovirasto.fi/geoserver/ows?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=TRUE&LAYERS=rajapinta_suojellut%3Amuinaisjaannos_piste%2Crajapinta_suojellut%3Amuinaisjaannos_alue%2Crajapinta_suojellut%3Asuojellut_rakennukset_piste%2Crajapinta_suojellut%3Asuojellut_rakennukset_alue%2Crajapinta_suojellut%3Arky_alue%2Crajapinta_suojellut%3Arky_piste%2Crajapinta_suojellut%3Arky_viiva%2Crajapinta_suojellut%3Amaailmanperinto_piste%2Crajapinta_suojellut%3Amaailmanperinto_alue%2Crajapinta_suojellut%3Amuu_kulttuuriperintokohde_alue%2Crajapinta_suojellut%3Amuu_kulttuuriperintokohde_piste%2Crajapinta_suojellut%3Avark_alueet%2Crajapinta_suojellut%3Avark_pisteet%2Crajapinta%3Arajapinta_loytopaikka_piste%2Crajapinta%3Arajapinta_loytopaikka_alue&TILED=true&CQL_FILTER=&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3067&BBOX=349788.07056875015%2C6668060.7755625%2C354543.4450000001%2C6672816.149993749)
   - Vastauksena tulee 256 x 256 png-karttatiili
- WMS GetFeatureInfo
   - `https://geoserver.museovirasto.fi/geoserver/ows?REQUEST=GetFeatureInfo&SERVICE=WMS`
   - [Esimerkkikutsu](https://geoserver.museovirasto.fi/geoserver/ows?REQUEST=GetFeatureInfo&QUERY_LAYERS=rajapinta_suojellut%3Amuinaisjaannos_piste%2Crajapinta_suojellut%3Amuinaisjaannos_alue%2Crajapinta_suojellut%3Asuojellut_rakennukset_piste%2Crajapinta_suojellut%3Asuojellut_rakennukset_alue%2Crajapinta_suojellut%3Arky_alue%2Crajapinta_suojellut%3Arky_piste%2Crajapinta_suojellut%3Arky_viiva%2Crajapinta_suojellut%3Amaailmanperinto_piste%2Crajapinta_suojellut%3Amaailmanperinto_alue%2Crajapinta_suojellut%3Amuu_kulttuuriperintokohde_alue%2Crajapinta_suojellut%3Amuu_kulttuuriperintokohde_piste%2Crajapinta_suojellut%3Avark_alueet%2Crajapinta_suojellut%3Avark_pisteet%2Crajapinta%3Arajapinta_loytopaikka_piste%2Crajapinta%3Arajapinta_loytopaikka_alue&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=TRUE&LAYERS=rajapinta_suojellut%3Amuinaisjaannos_piste%2Crajapinta_suojellut%3Amuinaisjaannos_alue%2Crajapinta_suojellut%3Asuojellut_rakennukset_piste%2Crajapinta_suojellut%3Asuojellut_rakennukset_alue%2Crajapinta_suojellut%3Arky_alue%2Crajapinta_suojellut%3Arky_piste%2Crajapinta_suojellut%3Arky_viiva%2Crajapinta_suojellut%3Amaailmanperinto_piste%2Crajapinta_suojellut%3Amaailmanperinto_alue%2Crajapinta_suojellut%3Amuu_kulttuuriperintokohde_alue%2Crajapinta_suojellut%3Amuu_kulttuuriperintokohde_piste%2Crajapinta_suojellut%3Avark_alueet%2Crajapinta_suojellut%3Avark_pisteet%2Crajapinta%3Arajapinta_loytopaikka_piste%2Crajapinta%3Arajapinta_loytopaikka_alue&TILED=true&CQL_FILTER=&INFO_FORMAT=application%2Fjson&FEATURE_COUNT=100&BUFFER=15&I=164&J=18&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3067&BBOX=364054.19386250013%2C6672816.149993749%2C368809.5682937501%2C6677571.524424999)
   - Vastauksena tulee GeoJSON `FeatureCollection`.
- WFS GetFeature
    - `https://geoserver.museovirasto.fi/geoserver/ows?service=WFS&request=GetFeature`
    - [Esimerkkikutsu](https://geoserver.museovirasto.fi/geoserver/ows?service=WFS&acceptversions=2.0.0&request=GetFeature&typeNames=rajapinta_suojellut%3Amuinaisjaannos_piste&count=50&outputFormat=application%2Fjson&cql_filter=kohdenimi+ILIKE+%27%25kissa%25%27)
    - Vastauksena tulee GeoJSON `FeatureCollection`.

## Kartta-aineiston kuvaus

WMS-rajapinnasta haetaan 26 loogista karttatasoa. Tasot rekisterin mukaan ryhmiteltynä:

- Rakennusperintörekisteri
    - suojellut_rakennukset_piste
    - suojellut_rakennukset_alue
- Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt
    - rky_alue
    - rky_piste
    - rky_viiva
- Maailmanperintökohteet Suomessa
    - maailmanperinto_piste
    - maailmanperinto_alue
- Valtakunnallisesti merkittävät arkeologiset alueet
    - vark_alueet
    - vark_pisteet
- Arkeologiset kohteet
    - muinaisjaannos_piste
    - muinaisjaannos_alue
    - muu_kulttuuriperintokohde_alue
    - muu_kulttuuriperintokohde_piste
    - loytopaikka_piste
    - loytopaikka_alue
    - havaintokohde_piste
    - havaintokohde_alue
    - luonnonmuodostuma_piste
    - luonnonmuodostuma_alue
    - mahdollinen_muinaisjaannos_piste
    - mahdollinen_muinaisjaannos_alue
    - muu_kohde_piste
    - muu_kohde_alue
    - poistettu_kiintea_muinaisjaannos_piste
    - poistettu_kiintea_muinaisjaannos_alue
    - alakohde_piste

Kohteita on eri karttatasoilla yhteensä kymmeniä tuhansia. Kohteet ovat joko pisteitä, alueita tai viivoja.

### Tiedostolataus

Avoimen aineiston pystyy myös lataamaan kokonaisuudessaan [Museoviraston avoimen datan sivulta](https://www.museovirasto.fi/fi/palvelut-ja-ohjeet/tietojarjestelmat/kulttuuriympariston-tietojarjestelmat/kulttuuriympaeristoen-paikkatietoaineistot). Laajimman aineiston tarkka nimi on `Museoviraston kulttuuriympäristörekistereiden kaikki kohteet (tutkimuskäyttöön) -tietotuote`:

- [Aineiston zip-tiedoston latauslinkki](https://mverkkodatashare.blob.core.windows.net/share/tutkija.zip)
- [Datan kuvaus PDF-muodossa](https://museovirasto-craft-assets-production.s3.eu-north-1.amazonaws.com/Tietotuotemaarittely_kulttuuriymparisto_kaikki.pdf)

Sivuston mukaan aineistot päivittyvät joka päivä klo 00:00 UTC. Zip-tiedoston koko on noin 35 megatavua ja purettuna noin 150 megatavua. Datan tiedostomuoto on GeoPackage.

Zipin sisältämät tiedostot:

- VARK_aluerajaukset.gpkg
- VARK_keskipisteet.gpkg
- arkeologiset_kohteet_alakohteet_piste.gpkg
- arkeologiset_kohteet_alakohteet_piste.qml
- arkeologiset_kohteet_alue_t.gpkg
- arkeologiset_kohteet_alue_t.qml
- arkeologiset_kohteet_piste_t.gpkg
- arkeologiset_kohteet_piste_t.qml
- maailmanperintokohde_alue.gpkg
- maailmanperintokohde_piste.gpkg
- rky_alue.gpkg
- rky_alue.qml
- rky_piste.gpkg
- rky_piste.qml
- rky_viiva.gpkg
- rky_viiva.qml
- suojellut_rakennukset_alue.gpkg
- suojellut_rakennukset_piste.gpkg
- suojellut_rakennukset_piste.qml

#### GeoPackage-tiedostojen karttatasot

WMS:n 26 karttatasoa ja ZIP-tuotteen GeoPackage-rakenne eivät vastaa toisiaan yksi yhteen. ZIP sisältää 12 GeoPackage-tiedostoa, ja nykyisessä aineistoversiossa jokainen tiedosto sisältää yhden varsinaisen kohdetason. GeoPackage-kohdetasot ovat:

| GeoPackage-tiedosto | Sisäinen kohdetaso | Geometriatyyppi | Tietueita inventoidussa aineistossa |
| --- | --- | --- | ---: |
| `VARK_aluerajaukset.gpkg` | `VARK_aluerajaukset` | `GEOMETRY` | 1 010 |
| `VARK_keskipisteet.gpkg` | `VARK_keskipisteet` | `POINT` | 1 010 |
| `arkeologiset_kohteet_alakohteet_piste.gpkg` | `arkeologiset_kohteet_alakohteet_piste` | `POINT` | 63 216 |
| `arkeologiset_kohteet_alue_t.gpkg` | `arkeologiset_kohteet_alue_t` | `POLYGON` | 86 703 |
| `arkeologiset_kohteet_piste_t.gpkg` | `arkeologiset_kohteet_piste_t` | `POINT` | 112 441 |
| `maailmanperintokohde_alue.gpkg` | `maailmanperintokohde_alue` | `POLYGON` | 50 |
| `maailmanperintokohde_piste.gpkg` | `maailmanperintokohde_piste` | `POINT` | 6 |
| `rky_alue.gpkg` | `rky_alue` | `GEOMETRY` | 1 851 |
| `rky_piste.gpkg` | `rky_piste` | `POINT` | 64 |
| `rky_viiva.gpkg` | `rky_viiva` | `MULTILINESTRING` | 186 |
| `suojellut_rakennukset_alue.gpkg` | `suojellut_rakennukset_alue` | `GEOMETRY` | 138 |
| `suojellut_rakennukset_piste.gpkg` | `suojellut_rakennukset_piste` | `POINT` | 2 290 |

Tietuemäärät kuvaavat yhtä ladattua tuotantoaineistoversiota ja muuttuvat aineiston päivittyessä. Tarkempi generoitu skeema- ja arvojoukkoanalyysi on tiedostossa [SOURCE_DATA_INVENTORY.md](SOURCE_DATA_INVENTORY.md).

#### WMS- ja GeoPackage-rakenteiden suhde

Muiden rekisterien osalta fyysiset GeoPackage-kohdetasot vastaavat pääosin WMS-tasoja: rakennusperinnöllä on piste- ja aluetaso, RKY:llä piste-, viiva- ja aluetaso, maailmanperinnöllä piste- ja aluetaso sekä VARK-aineistolla keskipiste- ja aluerajaustaso.

Merkittävin ero on arkeologisissa kohteissa:

- GeoPackage-tuote sisältää yhden yhteisen pistetason `arkeologiset_kohteet_piste_t` ja yhden yhteisen aluetason `arkeologiset_kohteet_alue_t`.
- Molemmissa yhteisissä tasoissa kohdetyyppi määräytyy `Laji`-kentän perusteella. Aineistossa esiintyvät lajit ovat `kiinteä muinaisjäännös`, `muu kulttuuriperintökohde`, `löytöpaikka`, `havaintokohde`, `luonnonmuodostuma`, `mahdollinen muinaisjäännös`, `muu kohde` ja `poistettu kiinteä muinaisjäännös (ei rauhoitettu)`.
- WMS julkaisee nämä kahdeksan lajia erillisinä piste- ja aluetasoina. Näin kahdesta GeoPackage-kohdetasosta muodostuu 16 WMS-tasoa.
- Arkeologisten alakohteiden GeoPackage-pistetaso julkaistaan WMS:ssä omana `alakohde_piste`-tasonaan.

WMS:n 26 tason kokonaismäärä muodostuu siten 16 arkeologisen lajin piste-/aluetasosta, yhdestä alakohdetasosta sekä yhdeksästä muiden rekisterien tasosta. Luku 26 kuvaa WMS:n julkaisutapaa, ei ladattavan ZIP-tuotteen fyysisten GeoPackage-kohdetasojen määrää.

## Suorituskykyongelman ratkaisu

Museovirasto kertoi, että ei pysty kasvatamaan nykyisessä arkkitehtuurissa karttapalvelimen suoritskykyä. Ainoa lyhyen aikavälin ratkaisu on tehdä itse suorituslkykyä parantavia toimia. Vaihtoehtoja ovat:

1. Välimuistin lisääminen Museiviraston ja muinaismuistot.info sivuston väliin.
2. Koko karttadatan tarjoaminen muinaismuistot.info sivustolle omalta karttapalvelimelta.

Välimuistin kanssa on kaksi ratkaisematonta ongelmaa:
- Aineisto päivittyy kerran päivässä, joten välimuisti ei voi olla yli 24 tuntia ilman muutosten havainnointia.
- WMS-rajapinta ei tarjoa mitään muutosrajapintaa, jonka kautta voisi ladata vain muuttuneet tiedot kerran päivässä ja invalidoida cachea sen perusteella.
- `GetFeatureInfo` kutsut sisältävät klikatun koordinaatin, joten se ei käytännössä koskaan osu välimuistiin.

Ainoaksi ratkaisuksi jää siis koko karttadatan tarjoaminen omalta karttapalvelimelta.

### Oma karttapalvelu

Ratkaisu pitää tehdä Cloudflare-palveluun, jossa on jo muinaismuistot.info sivuston domain. Ratkaisun tärkeinä näkökohtina on suorituskyky ja matala kustannustaso. Aineiston päivittäinen päivittyminen tulee tapahtua automaattisesti. muinaismuistot.info sivuston OpenLayers-määrityksiä voidaan muuttaa esim. käyttämään WMS:n sijaan jotain muuta tuettua formaattia.

Ratkaisussa pitää ottaa huomioon, että jos kartan zoomaa ulos niin että koko Suomi näkyy, on samaan aikaan näkyvissä kaikki aineiston kohteet, eli jopa kymmeniä tuhansia kohteita. Tämä ei saa estää sivuston toimimista hitailla mobiililaitteilla.

muinaismuistot.info sivuston pääasiallinen käyttötarkoitus on mobiilikäyttö kännykällä luonnossa. Ladattavan datan määrä ei siis saa olla valtava.
