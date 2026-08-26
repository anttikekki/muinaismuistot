# Karttadatan julkaisu

`deploy` julkaisee processing-vaiheen artefaktit Cloudflareen ja tarkistaa ulkoisen palvelun. Se on erillinen kerros, jotta rakentaminen ei tarvitse Cloudflare-oikeuksia ja sama julkaisu voidaan käynnistää updaterista tai käsin.

Hakemisto ei ole npm-paketti. Se käyttää pää-Workerin Wrangleriä ja resurssimäärityksiä, koska `muinaismuistot-worker` omistaa R2-bucketin, D1-tietokannan ja HTTP-reitit.

## Syötteet ja riippuvuudet

Julkaisu odottaa `../data/build/`-hakemistosta:

- `museovirasto.pmtiles`
- `feature-details.sql`
- `current-metadata.json`

Lisäksi se käyttää `../contract/migrations`-skeemaa, pää-Workerin `wrangler.jsonc`-määrityksiä ja Wrangler-versiota sekä juuriprojektin Playwright-testejä, ellei `SKIP_E2E=1`. Paikallisesti tarvitaan Bash, `curl`, `jq`, `grep`, Node.js ja npm.

```bash
npm ci
npm ci --prefix infra/muinaismuistot-worker
```

Wrangler tarvitsee kirjautuneen Cloudflare-käyttäjän tai soveltuvan API-tokenin. Julkaisu ei asenna riippuvuuksia eikä rakenna puuttuvia artefakteja.

## Julkaisujärjestys

`scripts/30-publish-cloudflare-release.sh`:

1. validoi ympäristön, production-vahvistuksen ja artefaktit
2. lukee R2- ja D1-resurssit pää-Workerin Wrangler-konfiguraatiosta
3. suorittaa D1-migraatiot ja korvaa `feature_details`-sisällön
4. lataa `current.pmtiles`- ja `current.json`-objektit R2:een
5. ajaa API-smoke-testin
6. ajaa normaalisti myös Playwright-regression

Smoke-testi tarkistaa health-endpointin, PMTiles Range -vastauksen ja magic-headerin sekä feature-, rekisteri- ja hakurajapintojen vastaukset.

Pää-Workerin tavallinen `wrangler deploy` ei aja `MAP_FEATURES`-migraatioita.
Migraatiot kuuluvat tämän karttadatajulkaisun vaiheeseen 3 ja suoritetaan ennen
uutta `feature-details.sql`-tuontia. Siksi pelkkä pää-Workerin deploy ei riitä,
jos muutos lisää tai muuttaa D1-sarakkeita.

## Komennot

Preview:

```bash
infra/museovirasto-map-data/deploy/scripts/30-publish-cloudflare-release.sh preview
```

Vaihtoehtoinen base URL voidaan antaa toisena argumenttina:

```bash
infra/museovirasto-map-data/deploy/scripts/30-publish-cloudflare-release.sh preview \
  https://muinaismuistot-preview.antti-kekki.workers.dev
```

Production:

```bash
infra/museovirasto-map-data/deploy/scripts/30-publish-cloudflare-release.sh \
  production --confirm-production
```

Updater asettaa `SKIP_E2E=1`, koska Container ajaa API-smoke-testin mutta ei selainregressiota. Manuaalisessa julkaisussa Playwright ajetaan oletuksena.

Pelkkä smoke-testi:

```bash
infra/museovirasto-map-data/deploy/scripts/26-smoke-test-service.sh \
  http://127.0.0.1:8787 /api/museovirasto
```

Pelkkien migraatioiden tilan voi tarkistaa tai migraatiot voi ajaa ilman
aineistotuontia pää-Workerin hakemistosta:

```bash
cd infra/muinaismuistot-worker
npx wrangler d1 migrations list MAP_FEATURES --env preview --remote
npx wrangler d1 migrations apply MAP_FEATURES --env preview --remote
```

Normaalisti tätä ei tarvita erikseen, koska julkaisuskripti tekee sen. Tarkempi
skeema ja migraation luontiohje ovat
[`../contract/README.md`](../contract/README.md#d1-rakennemuutos)-tiedostossa.

Julkaisu muuttaa etäresursseja. Käytä ensin previewta ja tarkista julkaistu versio ennen production-ajoa.

## Julkaisun atomisuus ja häiriön tunnistaminen

Nykyinen julkaisu ei ole yksi Cloudflaren resurssit ylittävä transaktio. Etätila
muuttuu järjestyksessä:

```text
D1-migraatiot ja feature_details-tuonti
→ R2 current.pmtiles
→ R2 current.json
→ smoke-testit
```

Keskeytys voi siksi jättää D1:n, PMTiles-arkiston ja metadatan eri versioihin.
Tarkista epäillyssä tilanteessa vähintään:

```bash
curl --fail https://muinaismuistot.info/api/museovirasto/health | jq
curl --fail https://muinaismuistot.info/api/museovirasto/meta | jq
```

Health varmistaa, että kaikki kolme resurssia ovat luettavissa, mutta ei yksin
todista niiden syntyneen samasta rakennuksesta. Workflown vaihe ja virheen kohta
kertovat, mikä kirjoitus ehti valmistua. Jos virhe tapahtui D1-tuonnin jälkeen
mutta ennen `current.json`-latausta, käsittele tila epäyhtenäisenä, vaikka health
palauttaisi `ok`.

## Palautuminen ja rollback

Ensisijainen palautumistapa on korjata vika ja ajaa koko saman tai uudemman
aineiston julkaisu uudelleen. Onnistunut uudelleenajo korvaa D1:n, PMTilesin ja
metadatan samasta rakennuksesta ja smoke-testaa lopputilan.

Täydellistä automaattista rollbackia ei tällä hetkellä ole:

- D1 voidaan palauttaa Wrangler Time Travelilla enintään 30 päivän sisällä.
- deploy-skripti lataa R2:een vain `current.pmtiles`- ja `current.json`-objektit.
- release-deskriptorin `backupR2Key`-arvot eivät tarkoita, että
  `releases/<version>/...`-objektit olisi ladattu.
- vanhaa R2-versiota ei voi palauttaa tämän repositorion komennoilla, elleivät
  edellisen julkaisun PMTiles- ja metadata-artefaktit ole erikseen tallessa.

Tarkista D1:n palautuspiste ennen muutoksia:

```bash
cd infra/muinaismuistot-worker
npx wrangler d1 time-travel info MAP_FEATURES \
  --env production --timestamp 2026-08-26T01:29:00Z --json
```

Palauta D1 vain, jos myös saman vanhan version R2-artefaktit ovat saatavilla:

```bash
npx wrangler d1 time-travel restore MAP_FEATURES \
  --env production --timestamp 2026-08-26T01:29:00Z

npx wrangler r2 object put muinaismuistot-map-data/current.pmtiles \
  --env production --remote --file /path/to/old/museovirasto.pmtiles \
  --content-type application/vnd.pmtiles

npx wrangler r2 object put muinaismuistot-map-data/current.json \
  --env production --remote --file /path/to/old/current-metadata.json \
  --content-type application/json
```

Lataa metadata viimeisenä ja aja lopuksi smoke-testi. Älä palauta vain D1:tä,
jos vanhaa PMTilesia ja metadataa ei ole: se vaihtaisi yhden epäyhtenäisen tilan
toiseen. Jos vanhoja R2-artefakteja ei ole, tee korjaava forward-julkaisu.

Versionoitujen R2-releasejen lataus ja niiden säilytyskäytäntö ovat vielä
toteuttamatta. Ennen sitä dokumentaatio ei lupaa nopeaa täydellistä rollbackia.
