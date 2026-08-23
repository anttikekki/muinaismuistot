# Aineistojulkaisun versio- ja aktivointisopimus

## Tavoite

PMTiles-arkiston ja D1-rivien pitää aina edustaa samaa Museoviraston aineistojulkaisua. R2-objektia tai aktiivisen D1-aineiston rivejä ei korvata paikallaan. Uusi julkaisu valmistellaan muuttumattoman `releaseId`-tunnisteen alle ja aktivoidaan yhdellä D1:ssä säilytettävällä `current`-osoittimella vasta kaikkien tarkistusten jälkeen.

Tämä tiedosto lukitsee vaiheen 2 metatietosopimuksen. Varsinaiset R2- ja D1-julkaisukomennot toteutetaan vaiheessa 3 staging-ympäristöä vasten.

## Julkaisutunniste

Rakennusputki tuottaa `releaseId`-arvon muodossa:

```text
museovirasto-<20 heksamerkkiä>
```

Tunniste johdetaan SHA-256-tiivisteellä seuraavista versionoiduista tiedoista:

- lähdeaineiston yhteistiiviste;
- rakennuskonfiguraation, tasomäppäyksen ja suodatinkoodiston tiivisteet;
- PMTiles-, D1-tuonti- ja suodatinkoodistoartefaktien tiivisteet.

Sama sisältö tuottaa saman tunnisteen. Lähdeaineiston, tietomallin, koodiston tai keskeisen artefaktin muutos tuottaa uuden tunnisteen. Julkaisutunniste ei perustu pelkkään päivämäärään, eikä saman tunnisteen alle saa kirjoittaa eri sisältöä.

Paikallinen komento on:

```bash
infra/museovirasto-map-data-server/scripts/25-create-release-descriptor.sh
```

## Versionoidut nimet

Julkaisudeskriptori määrittää seuraavat pysyvät nimet:

| Kohde | Nimi tai avain |
| --- | --- |
| PMTiles R2:ssa | `datasets/<releaseId>/map.pmtiles` |
| suodatinkoodisto R2:ssa | `datasets/<releaseId>/filter-vocabulary.json` |
| julkaisumetadata R2:ssa | `datasets/<releaseId>/release.json` |
| selaimen PMTiles-reitti | `/pmtiles/<releaseId>.pmtiles` |
| metatietoreitti | `/api/releases/<releaseId>` |
| D1-aineistoversio | `releaseId` jokaisessa saman julkaisun `feature_details`-rivissä |

R2-avaimet ovat muuttumattomia ja voidaan palauttaa otsakkeella `Cache-Control: public, max-age=31536000, immutable`. Lyhytikäinen `/api/meta` palauttaa aktiivisen julkaisun tunnisteen ja versionoidut URL:t.

## D1:n tuotantosopimus

Vaiheen 3 skeemassa `feature_details` saa `release_id`-sarakkeen ja pääavaimen `(release_id, source_layer, feature_id)`. Täsmällinen karttaklikkaus lähettää `releaseId`-arvon yhdessä `sourceLayer + featureId` -viitteiden kanssa. Näin jo ladattua tai selaimen välimuistissa olevaa vanhaa PMTiles-versiota voidaan käyttää oikein myös uuden julkaisun aktivoinnin jälkeen.

Pysyvät URL:t ja sanahaku eivät tarvitse asiakkaalta versiota. Ne käyttävät D1:n aktiivista `releaseId`-arvoa ja palauttavat aina uusimman aineiston osumat avaimella `logicalLayerId + registryId`.

D1:ssä tarvitaan vähintään:

```text
dataset_releases(release_id, state, manifest_json, created_at, activated_at)
dataset_current(singleton_id = 1, release_id)
feature_details(release_id, source_layer, feature_id, ...)
```

`dataset_current` on aktiivisen version ainoa totuuden lähde. Erillistä R2:n `current`-osoitinta ei käytetä, koska R2:n ja D1:n kahta osoitinta ei voisi vaihtaa aidosti samassa transaktiossa.

## Atominen aktivointi

Julkaisujärjestys on:

1. Rakenna ja validoi paikalliset artefaktit.
2. Lataa PMTiles, suodatinkoodisto ja julkaisumetadata uuden `releaseId`-avaimen alle R2:een.
3. Varmista objektien koot, tiivisteet, metatiedot ja Range-pyyntö.
4. Tuo D1-rivit samalla `releaseId`-arvolla koskematta aktiiviseen versioon.
5. Aja D1:n taso- ja rivimäärätarkistukset, tunnistevertailu sekä API-smoke-testit eksplisiittisellä versiolla.
6. Lisää julkaisu `ready`-tilaan.
7. Vaihda yhdessä D1-transaktiossa `dataset_current.release_id` ja julkaisun tila `active`-arvoon.
8. Tarkista `/api/meta`, versionoitu PMTiles Range -pyyntö, karttaklikkauksen massahaku, pysyvä rekisterihaku ja sanahaku.

Jos vaiheet 1–6 epäonnistuvat, nykyinen osoitin jää muuttumatta. Vaiheen 7 jälkeen palautus tehdään vaihtamalla D1-transaktiossa `dataset_current` takaisin edelliseen valmiiseen julkaisuun. Versionoituja R2-objekteja tai D1-rivejä ei poisteta osana aktivointia tai palautusta.

## Paikalliset tuotokset

`release-descriptor.json` on koneellinen, muuttumattoman julkaisun kuvaus. Se sisältää tunnisteen, yhteensopivuusversiot, rivimäärät, artefaktien nimet, koot, tiivisteet, R2-avaimet ja API-reitit.

`current-candidate.json` on ainoastaan paikallinen aktivointiehdokas. Rakennusputki ei nimeä sitä aktiiviseksi eikä muuta mitään Cloudflare-ympäristöä. Vaiheen 3 julkaisu käyttää ehdokkaan `releaseId`-arvoa ja tekee varsinaisen aktivoinnin D1-transaktiossa.
