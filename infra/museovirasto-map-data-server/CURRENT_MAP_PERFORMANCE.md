# Nykyisen karttaratkaisun suorituskyvyn lähtötaso

## Rajaus

Vaiheen 0 tarkoitus on todentaa nykyisen Museovirasto-WMS:n ongelma riittävän yksinkertaisella ja toistettavalla mittauksella. Tässä vaiheessa ei tehdä automatisoitua koko selaimen suorituskykytestiä. Tarkka nykyisen ja PMTiles-toteutuksen end-to-end-vertailu tehdään vaiheessa 1, kun vertailtava vektoriratkaisu on olemassa.

Mittaus kohdistuu suoraan Museoviraston GeoServeriin eikä sivuston WMS-välimuistiproxyyn. Yksi näyte on 256 × 256 pikselin läpinäkyvä PNG, jossa ovat mukana `layer-mapping.json`-tiedoston kaikki 26 loogista tasoa. Pyyntö vastaa käyttäjän raskasta kaikki tasot valittuna -tilannetta.

## Toistaminen

Mittaus ajetaan komennolla:

```bash
infra/museovirasto-map-data-server/scripts/08-measure-current-wms.sh
```

Skripti tekee oletuksena kolme pyyntöä kullakin mittakaavalla. Pyyntökohtainen oletusaikakatkaisu on 30 sekuntia, mutta tämän raportin mittauksessa käytettiin 45 sekuntia:

```bash
MAX_TIME_SECONDS=45 infra/museovirasto-map-data-server/scripts/08-measure-current-wms.sh
```

Raakatulos ja vastauskuvat tallentuvat gitistä ohitettuun `data/performance/`-hakemistoon. CSV sisältää mittausajan, skenaarion, `curl`-poistumiskoodin, HTTP-statuksen, ensimmäisen tavun ajan, kokonaisajan ja ladatun tavumäärän. Myös aikakatkaisut kirjataan tulokseen.

## Mittaustulos 22.8.2026

Mittaukset tehtiin suoralla WMS `GetMap` -pyynnöllä kolmelle `EPSG:3067`-rajaukselle. Jokaisesta otettiin kolme peräkkäistä näytettä.

| Näkymä | BBOX | Kokonaisajat | Mediaani | TTFB-mediaani | PNG-koko |
| --- | --- | ---: | ---: | ---: | ---: |
| Koko Suomi | `50199,6582464,761274,7799839` | 33,70 s; 36,68 s; 32,97 s | **33,70 s** | 33,67 s | noin 55,8 kt |
| Helsinki/kaupunkitaso | `360000,6660000,410000,6710000` | 1,46 s; 1,47 s; 1,54 s | **1,47 s** | 1,41 s | noin 103,7 kt |
| Lähitaso | `349788.07,6668060.78,354543.45,6672816.15` | 0,78 s; 0,79 s; 0,71 s | **0,78 s** | 0,78 s | noin 4,8 kt |

Ensimmäisen tavun aika on lähes sama kuin kokonaisaika. Viive syntyy siis pääosin GeoServerin karttakuvan muodostamisesta, ei PNG-vastauksen siirtämisestä.

Koko Suomen yksittäisen kuvan noin 34 sekunnin mediaani riittää osoittamaan, ettei alkuperäinen WMS sovi koko maan nopeaan karttaselailuun. Yhden kuvan pieni, noin 56 kilotavun koko ei auta, koska selain odottaa palvelimen renderöintiä ennen ensimmäistä tavua.

Tulokset ovat hetkellinen näyte ulkoisesta tuotantopalvelusta. Niitä ei käytetä tiukkana regressiorajana, mutta ne säilytetään arkkitehtuuripäätöksen lähtötasona.

## Koko karttanäkymän pyyntömääräarvio

1920 × 1080 pikselin näkymä sisältää vähintään noin 8 × 5 eli 40 näkyvää 256 pikselin tiiltä yhtä tiililähdettä kohti. OpenLayers voi pyytää lisäksi reunatiiliä, joten käytännöllinen karkea arvio on 40–54 pyyntöä lähdettä kohti.

Sovelluksen oletusasetuksissa ovat käytössä:

| Lähde | Tyyppi | Arvio yhdessä näkymässä |
| --- | --- | ---: |
| Maanmittauslaitoksen taustakartta | WMTS-tiilet | noin 40–54 pyyntöä |
| Museovirasto | WMS-tiilet | noin 40–54 pyyntöä |
| Helsingin linnoitteet | WMS-tiilet vain Helsingin extentillä | noin 40–54 pyyntöä Helsingin näkymässä |
| Ahvenanmaan kulttuuriperintö | ArcGIS REST -tiilet vain Ahvenanmaan extentillä | vain extentin leikkaavat tiilet |
| 3D-mallien kohteet | yksi paikallinen GeoJSON | yksi pyyntö sovellusta ladattaessa |
| Maiseman muisti | yksi paikallinen GeoJSON | yksi pyyntö sovellusta ladattaessa |

Koko Suomen tai tavallisen muun Suomen näkymässä taustakartta ja Museovirasto aiheuttavat siis karkeasti 80–108 tiilipyyntöä yhteensä. Helsingin näkymässä kolmas rasteritiililähde nostaa karkean määrän noin 120–162 pyyntöön. Arvio ei sisällä sovelluksen JavaScript-, CSS-, fontti- tai käyttöliittymäresursseja.

Tämä ei tarkoita, että WMS:n yksittäisen mielivaltaisen BBOX-kuvan vasteaika kerrottaisiin suoraan näkyvien tiilien määrällä: selain tekee rinnakkaisia pyyntöjä, palvelin ja välityspalvelin voivat käyttää välimuistia ja OpenLayersin todellinen tiiliruudukko poikkeaa mittausrajauksista. Arvio kertoo vain, miksi uutta Museovirasto-ratkaisua ei saa jakaa useaksi tiililähteeksi tai loogisen tason mukaisiksi erillispyynnöiksi.

## Johtopäätös ja vaiheen 1 vertailu

Vaiheen 0 päätelmä on yksiselitteinen: Museoviraston alkuperäisen WMS-palvelun palvelinrenderöinti on etenkin pienellä mittakaavalla liian hidasta. Uuden toteutuksen lähtökohta pysyy yhtenä PMTiles-arkistona ja yhtenä OpenLayers-vektoritiililähteenä.

Vaiheen 1 PMTiles-PoC:ssa mitataan samalla selaimella todellinen koko näkymän:

- HTTP-pyyntömäärä lähteittäin;
- siirretty tavumäärä;
- aika käyttökelpoiseen karttaan;
- Museoviraston uuden lähteen vaikutus taustakartan ja muiden samanaikaisten tasojen rinnalla.

PoC hyväksytään vain, jos 26 loogisen tason näyttäminen ja vaihtaminen eivät luo uusia tiililähteitä tai saman näkymän tiilille tasokohtaisia lisäpyyntöjä.
