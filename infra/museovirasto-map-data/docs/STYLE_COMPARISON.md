# QML-, WMS- ja käyttöliittymätyylien vertailu

## Tarkoitus ja lähteet

Tämä dokumentti määrittää, mitä nykyisestä karttailmeestä ja tuotanto-ZIP:n QML-tyyleistä hyödynnetään tulevassa PMTiles/MVT-toteutuksessa. Vertailu perustuu seitsemään QML-tiedostoon, Museoviraston WMS-palvelusta 22.8.2026 `GetStyles`-pyynnöllä ladattuihin 26 loogisen tason oletustyyleihin sekä sivuston `LayerIcon`- ja `ModelsLayer`-toteutuksiin.

WMS-tyylien tarkistus voidaan toistaa komennolla:

```bash
infra/museovirasto-map-data/processing/scripts/06-inventory-styles.sh
```

Ladattu SLD tallentuu gitistä ohitettuun `data/wms-styles/`-hakemistoon. Skripti lukee tasot tiedostosta `layer-mapping.json`, tekee yhden WMS-pyynnön ja varmistaa vastauksen sisältävän kaikki 26 tyyliä.

## Nykytilan oikea tulkinta

Museoviraston varsinainen aineisto piirretään tällä hetkellä `TileWMS`-lähteen rasteritiilinä. OpenLayers ei saa WMS-vastauksessa geometrioita tai symbolisääntöjä eikä tyylittele aineistoa vektorina. Käyttäjän kartalla näkemä ilme on GeoServerin oletustyylin renderöimä kuva.

Sivustossa on kaksi erillistä visuaalista jäljitelmää, mutta kumpikaan ei ole nykyisen Museovirasto-aineiston vektorirenderöinti:

1. `LayerIcon` piirtää listauksiin 25 × 25 pikselin SVG-kuvakkeet. Ne jäljittelevät WMS-legendaa tasojen tunnistamista varten.
2. `ModelsLayer` piirtää vain 3D-malleihin liittyvää GeoJSON-aineistoa. Se jäljittelee muinaisjäännöspistettä, suojeltua rakennuspistettä ja RKY-aluetta, jotta 3D-mallit näkyvät ilman Museoviraston WMS-tasoa.

PMTiles-siirtymä on siten ensimmäinen kerta, kun varsinainen Museoviraston kohdeaineisto renderöidään sivustolla rakenteellisena vektoridatana.

## Lähteiden kattavuus

| Tyylilähde | Kattavuus | Rooli päätöksessä |
| --- | --- | --- |
| WMS SLD | kaikki 26 nykyistä loogista tasoa | nykyisen kartan visuaalinen vertailutaso |
| UI:n `LayerIcon` | kaikki 26 loogista tasoa | legendan ja kartan keskinäisen tunnistettavuuden vertailutaso |
| ZIP:n QML | arkeologiset pisteet, alueet ja alakohteet; RKY-piste, -alue ja -viiva; suojeltujen rakennusten pisteet | rakenteellinen ja mittasuhteita täydentävä referenssi |
| `ModelsLayer` | muinaisjäännöspiste, suojeltu rakennuspiste ja RKY-alue | 3D-mallien korostuksen erityistyyli, ei aineiston perustyyli |

QML puuttuu VARK-pisteiltä ja -alueilta, maailmanperintökohteiden pisteiltä ja alueilta sekä suojeltujen rakennusten alueilta. Niiden tuleva tyyli johdetaan nykyisestä WMS SLD:stä ja UI-kuvakkeesta.

## Vertailun tulokset ja päätökset

### Arkeologiset kohteet

QML:n kolme arkeologista tyyliä on kategorisoitu `Laji`-kentällä kahdeksaan tunnettuun luokkaan sekä puuttuvan arvon varasymboliin. Tämä tukee `layer-mapping.json`-mallia, jossa kaksi fyysistä lähdetasoa jaetaan loogisiin tasoihin normalisoidulla `laji_key`-kentällä.

QML ja WMS eivät kuitenkaan ole sama tyyliversio. Esimerkiksi QML käyttää kiinteälle muinaisjäännöspisteelle väriä `#e31a1c`, muulle kulttuuriperintökohteelle `#724427`, mahdolliselle muinaisjäännökselle `#fb01ff` ja havaintokohteelle `#0c8d74`. Nykyinen WMS/UI käyttää vastaavasti `#ff0000`, `#b67f4a`, noin `#cc00ff` ja havaintokohteelle punaista neliötä. QML:n alakohteet ovat `Laji`-luokittain väritettyjä ympyröitä, mutta WMS/UI näyttää ne punaisena tähtenä.

Aluetyyleissä molemmat käyttävät värillistä viivoitusta, mutta QML:n `b_diagonal` on yksisuuntainen vinoviivoitus ja WMS:n `shape://times` ristikkäinen viivoitus. UI:n SVG vastaa WMS:ää.

Päätökset:

- QML:n `Laji`-kategorisointi vahvistaa `laji_key`-pohjaisen tyylivalinnan.
- Ensimmäisessä versiossa säilytetään nykyiset WMS/UI-värit, symbolimuodot ja ristikkäinen alueviivoitus, jotta käyttäjälle tuttu ilme ei muutu migraatiossa.
- QML:n poikkeavia arkeologisia värejä tai alakohteiden luokkakohtaisia ympyröitä ei kopioida.
- Tuntematon tai puuttuva `laji_key` saa erottuvan varatyylin ja aiheuttaa rakennusraporttiin varoituksen.

### RKY ja suojellut rakennukset

QML:n RKY-symbolit ovat sinisiä `#2c36ef`, kun WMS käyttää noin `#0070ff` ja UI `#006fff`. Rakenteellinen ajatus on silti sama: viivoitettu alue, yksinkertainen pistemerkki ja yhtenäinen viiva. Suojellun rakennuksen QML-piste on `#33a02c`, WMS noin `#38a800` ja UI/`ModelsLayer` `#37a800`.

WMS/UI:n sininen RKY-ilme ja vihreä rakennusperintöilme säilytetään. QML:n geometriatyyppien rakenne sekä suhteelliset viiva- ja merkkikoot toimivat OpenLayers-kokeilun lähtöarvoina. QML:n millimetriarvoja ei siirretä suoraan selainpikseleiksi, vaan tarkat koot kalibroidaan kuvakaappausvertailulla WMS:ään.

### Tasot ilman QML:ää

| Ryhmä | Säilytettävä WMS/UI-ilme |
| --- | --- |
| VARK | violetti `#8400a8`, piste ympyränä ja alue ristikkäisviivoituksena |
| Maailmanperintö | oranssi noin `#ffab00`, piste viisikulmiona ja alue ristikkäisviivoituksena |
| Suojellut rakennukset, alue | vihreä noin `#38a800`, ristikkäisviivoitus |

## MVT/OpenLayers-tyylisopimus

Tuleva tyylifunktio käyttää `layer-mapping.json`-tiedoston `sourceLayer`-tunnistetta ja tarvittaessa `laji_key`-arvoa. Se ei käytä 26 tiililähdettä eikä pyydä tiiltä uudelleen tasovalinnan muuttuessa.

| Looginen ryhmä | Piste | Alue/viiva | Pääväri |
| --- | --- | --- | --- |
| Kiinteä muinaisjäännös | ympyrä | ristikkäisviivoitettu alue | `#ff0000` |
| Muu kulttuuriperintökohde | ympyrä | ristikkäisviivoitettu alue | `#b67f4a` |
| Mahdollinen muinaisjäännös | ympyrä | ristikkäisviivoitettu alue | `#cc00ff` |
| Havaintokohde | neliö | harmaa alue / sininen viiva / punainen piste WMS:n geometrian mukaan | `#ff0000`, `#aaaaaa`, `#0000ff` |
| Löytöpaikka | ympyrä | ristikkäisviivoitettu alue | `#ff7f01` |
| Luonnonmuodostuma | ympyrä | ristikkäisviivoitettu alue | `#01c6ff` |
| Muu kohde | valkoinen ympyrä | harmaa ristikkäisviivoitettu alue | `#ffffff`, `#b5b5b5` |
| Poistettu kiinteä muinaisjäännös | ympyrä | ristikkäisviivoitettu alue | `#908e8e` |
| Alakohde | tähti | ei aluemallia | `#ff0000` |
| RKY | sininen piste | ristikkäisviivoitettu alue / yhtenäinen viiva | `#0070ff` |
| Suojellut rakennukset | vihreä merkki | ristikkäisviivoitettu alue | `#38a800` |
| Maailmanperintö | viisikulmio | ristikkäisviivoitettu alue | `#ffab00` |
| VARK | ympyrä | ristikkäisviivoitettu alue | `#8400a8` |

Yhden RGB-portaan erot UI:n ja SLD:n välillä yhtenäistetään SLD:n arvoihin. Musta reunus säilytetään pisteissä, joissa WMS/UI käyttää sitä. Alueiden täyttö toteutetaan ristikkäisviivoituksena tai visuaalisesti vastaavana kevyenä kuviotäyttönä.

`ModelsLayer` säilyttää oman korostuksensa: musta ulkokehä osoittaa 3D-mallin olemassaolon, ja RKY-alueen lähes läpinäkyvä täyttö mahdollistaa osumatunnistuksen. Näitä ei siirretä PMTiles-aineiston perustyyliin. PMTiles- ja 3D-mallitasojen päällekkäinen piirtojärjestys testataan erikseen.

## Hyväksyntä ja jatkotyö

Tyylisopimus validoidaan proof of conceptissa:

1. kuvakaappausvertailulla samoista WMS- ja vektorinäkymistä;
2. UI-kuvakkeen ja karttasymbolin tunnistettavuuden tarkistuksella kaikille 26 loogiselle tasolle;
3. tasovalinnan, karttaklikkauksen ja 3D-mallikorostuksen testeillä päällekkäisillä kohteilla.

Tämä vaihe lukitsee värien ja symbolien semanttisen valinnan, ei lopullisia pikselikokoja. Koot, viivanleveydet ja zoom-kohtaiset näkyvyyssäännöt asetetaan PMTiles-proof-of-conceptin mittausten perusteella.
