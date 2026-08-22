# PMTiles proof of concept

## Ensimmäinen rakennettu arkisto

Vaiheen 1 ensimmäinen tekninen koe muuntaa koko inventoidun tuotantoaineiston yhdeksi PMTiles-arkistoksi. Arkisto sisältää samat 12 fyysistä lähdetasoa kuin `layer-mapping.json`; käyttöliittymän 26 loogista tasoa muodostetaan myöhemmin näiden lähdetasojen ja `laji_key`-suodattimien avulla.

Ensimmäisen onnistuneen ajon tulos:

- lähdegeometrioita: 268 965
- arkistoon hyväksyttyjä geometrioita: 268 964
- pois jätettyjä geometrioita: yksi geometriaton `archaeological_areas`-tietue (`fid=44923`)
- PMTiles-arkiston koko: 81 014 022 tavua (noin 77,3 MiB)
- zoom-tasot: 0–14
- MVT-lähdetasoja: 12
- osoitettuja tiiliä: 128 990
- yksilöllisiä tiilisisältöjä: 127 163
- aineiston rajaus: 19.612325, 59.601162 – 31.579558, 70.075755

Arkisto on paikallinen, Gitistä pois rajattu PoC-artefakti: `data/poc/museovirasto-poc.pmtiles`.

## Toistaminen

PoC käyttää paikallisia Homebrew-asennuksia, ei konttia. Ensimmäinen ajo tehtiin versioilla GDAL 3.13.3 ja Tippecanoe 2.79.0. PMTiles-tarkistustyökalu lukitaan latausskriptissä versioon 1.31.2 ja sen SHA-256-tiiviste tarkistetaan.

```bash
brew install gdal tippecanoe jq
infra/museovirasto-map-data-server/scripts/09-download-pmtiles-cli.sh
infra/museovirasto-map-data-server/scripts/10-build-pmtiles-poc.sh
infra/museovirasto-map-data-server/scripts/11-validate-pmtiles-poc.sh
```

Kenttäprojektiot ja lähdetasot ovat tiedostossa `poc-layer-config.json`. Rakennusskripti tarkistaa niiden vastaavan `layer-mapping.json`-tiedostoa ja vertaa jokaisen välivaiheen tietuemäärää lähdeaineistoon.

## Ensimmäiset havainnot ja avoimet kysymykset

- Yksi PMTiles-arkisto toimii teknisesti kaikkien 12 fyysisen lähdetason säiliönä. Erillisiä arkistoja ei tarvita tasovalintoja varten.
- Tippecanoen nykyiset yleiset tiheydenhallinta-asetukset pudottavat pisteitä ja yhdistävät geometrioita tarvittaessa pienillä zoom-tasoilla. Tätä ei vielä hyväksytä lopulliseksi kartografiseksi ratkaisuksi, vaan näkyvyys, tunnistettavuus ja tyylit tarkistetaan OpenLayers-kokeessa.
- `protected_building_areas` ei esiinny Suomen kattavassa zoomin 0 tiilessä pienten polygonien karsinnan vuoksi, vaikka taso ja kaikki sen 138 lähdegeometriaa ovat arkiston metadatassa. Tason sopiva vähimmäiszoom ja pienten polygonien käsittely pitää päättää visuaalisen kokeen perusteella.
- Raakamuotoiset tyyppi-, alatyyppi- ja ajoituskentät kasvattavat arkistoa ja metadataa. OpenLayers-kokeessa selvitetään, mitkä attribuutit tarvitaan todella karttatyyleihin ja kohteen tunnistamiseen; sanahaku ei edellytä niiden säilyttämistä jokaisessa tiilessä.
- `source_fid` toimii tässä kokeessa MVT-tunnisteena. Tuotantoputkessa se korvataan suunnitelman mukaisella vakaalla komposiittitunnisteella.
- Enimmäistiilikoko on tässä kokeessa rajattu 300 000 tavuun. Tyypillisten ja pahimpien tiilien todelliset koot sekä HTTP Range -pyynnöt mitataan vasta OpenLayers- ja R2-kokeessa.

Seuraava vaihe 1:n tehtävä on avata arkisto OpenLayersissa paikallisesti, toteuttaa 26 loogisen tason näkyvyys yhdestä lähteestä ja tarkistaa tyylit sekä kohteiden valinta kolmella edustavalla zoom-tasolla.
