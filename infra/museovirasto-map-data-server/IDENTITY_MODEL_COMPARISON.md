# MVT-tunnistemallien vertailu

## Päätös

Tuotantomallin lähtökohdaksi jää MVT-feature-ID:nä tallennettava GeoPackagen `fid`. Vaihtoehto, jossa MVT-feature-ID poistettiin ja jokaiselle featurelle lisättiin merkkijonomuotoinen `registry_id`-ominaisuus, oli sekä suurempi että hitaampi siirtää. Se myös poisti selaimen yksiselitteisen, tiilirajat ylittävän `source-layer + feature ID` -deduplikointiavaimen.

`fid` on vain saman aineistojulkaisun PMTiles- ja D1-artefaktien yhteinen sisäinen avain. Pysyvät URL:t käyttävät edelleen D1:n `logicalLayerId + registryId` -hakua, joka palauttaa kaikki uusimman aineiston osumat.

## Toistettava arkistovertailu

Vertailu rakennetaan komennolla:

```bash
infra/museovirasto-map-data-server/scripts/22-build-registry-id-comparison.sh
```

Molemmat arkistot rakennettiin samasta tuotantoaineistosta ja samoilla Tippecanoe-asetuksilla. Ainoa tietomalliero oli tunniste: fid-mallissa numeerinen arvo asetettiin MVT-feature-ID:ksi, registry-mallissa ID jätettiin pois ja rekisteritunnus tallennettiin MVT-ominaisuudeksi. Taulukon luvut ovat ennen `laji_key`-kentän myöhempää numerokoodausta tehtyä tunnistevertailua; molemmat vertailuarkistot käyttivät silloin samaa merkkijonoista lajikenttää, joten muutos ei vääristä niiden keskinäistä tulosta.

| Mittari | `fid` MVT-feature-ID | `registry_id`-ominaisuus | Muutos |
| --- | ---: | ---: | ---: |
| Arkiston koko | 66 963 838 tavua | 73 920 972 tavua | +6 957 134 tavua (+10,4 %) |
| Pakkaamaton zoom 0 -tiili | 1 118 628 tavua | 1 478 185 tavua | +359 557 tavua (+32,1 %) |

Tulos on odotettavissa MVT-rakenteesta: numeerinen feature-ID tallentuu varsinaiseen ID-kenttään, kun taas merkkijonoinen rekisteritunnus toistuu ominaisuusarvona jokaisessa tiilessä ja geometriaversiossa, jossa feature esiintyy.

## Kylmä selainmittaus

Wranglerin paikalliseen R2-simulaatioon vaihdettiin registry-arkisto ja ajettiin sama Chrome-mittaus kuin fid-arkistolle.

| Näkymä | Malli | PMTiles-pyynnöt | PMTiles-tavut | Data valmis |
| --- | --- | ---: | ---: | ---: |
| Koko Suomi | `fid` | 6 | 1 766 264 | 383 ms |
| Koko Suomi | `registry_id` | 6 | 2 123 282 | 424 ms |
| Kaupunki | `fid` | 8 | 165 304 | 125 ms |
| Kaupunki | `registry_id` | 8 | 192 471 | 139 ms |
| Lähitaso | `fid` | 8 | 33 562 | 87 ms |
| Lähitaso | `registry_id` | 8 | 34 485 | 85 ms |

Registry-malli ylitti koko Suomen 2 000 000 tavun budjetin noin 6,2 prosentilla. Kylmien ajojen millisekuntitulokset vaihtelevat koneen kuorman mukaan, mutta tavumäärät ja arkistokoot osoittavat saman suunnan.

Registry-ajossa selain raportoi koko Suomesta 129 226 ladattua featurea fid-ajon 158 725:n sijaan. Tämä ei tarkoita lähdeaineiston karsimista, vaan nykyisen PoC:n deduplikointi joutui ID:n puuttuessa käyttämään geometriaan perustuvaa vara-avainta. Siksi registry-mallin renderöintimittarit eivät ole fid-malliin nähden luotettava featurekohtainen vertailu. Tämä on samalla toiminnallinen peruste säilyttää MVT-feature-ID.

## Rajaus

Vertailu ei tarkoita, että GeoPackagen `fid` olisi pysyvä julkaisujen välinen tunniste. PMTiles ja vastaava D1-versio pitää julkaista atomisesti. Jos feature-ID:n tavukustannusta optimoidaan myöhemmin, seuraavan kokeen pitää säilyttää numeerinen MVT-feature-ID ja tutkia nykyisen yhdistetyn ID-avaruuden sijasta lähdetasokohtaisen `fid`-arvon riittävyyttä. Pitkää `registry_id`-merkkijonoa ei palauteta MVT-skeemaan ilman uutta mitattua tarvetta.
