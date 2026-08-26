# Muinaismuistot.info Cloudflare Worker

Cloudflare Worker, joka palvelee [muinaismuistot.info](https://muinaismuistot.info)-sivuston Webpack-buildin Cloudflare Workers Static Assetsista.

## Arkkitehtuuri

```text
muinaismuistot.info ─────┐
                        ├─ Cloudflare Custom Domain ─ Worker ─ Static Assets
www.muinaismuistot.info ─┘
```

Webpack rakentaa sivuston repositorion juuren `dist/`-hakemistoon. Wrangler julkaisee samalla deploylla sekä Workerin että `dist/`-hakemiston muuttuneet tiedostot Workers Static Assetsiksi. Erillistä origin-palvelinta, GitHub Pagesia tai R2-bucketia ei käytetä.

Cloudflare yrittää palvella pyynnön ensin Static Assets -aineistosta. Worker suoritetaan vain, jos polkua vastaavaa assettia ei löydy.

## Workerin logiikka

Workerin entrypoint on `src/index.ts`. Se käsittelee pyynnöt seuraavasti:

1. Cloudflare Static Assets palvelee löytyvät sivustotiedostot ennen Worker-koodia.
2. `/api/museovirasto/*` välitetään Museoviraston PMTiles-, ominaisuus- ja hakumoduulille.
3. Muut Workerille asti päätyvät pyynnöt palauttavat `404`-vastauksen. `www`-kanonisointi hoidetaan DNS-/domain-määrityksillä.

Museovirasto-moduulin julkiset reitit ovat:

- `/api/museovirasto/pmtiles`
- `/api/museovirasto/features/batch`
- `/api/museovirasto/features/by-register`
- `/api/museovirasto/search`
- `/api/museovirasto/meta`
- `/api/museovirasto/health`

`features/batch` palauttaa VARK-kohteille myös
`relatedArchaeologicalSites`-listan. Kukin alkio sisältää viitatun
muinaisjäännöskohteen `registryId`-tunnuksen ja D1:stä haetun `name`-nimen.
Selain saa VARK-kohteen ja sen viitatut kohteet samalla HTTP-pyynnöllä; Worker
hakee nimet eräajona `archaeological_points`-riveistä. Jos viitattua riviä ei
löydy, tunnus säilyy listassa ja `name` on `null`.

Worker käyttää bindingeja `MAP_DATA` (R2) ja `MAP_FEATURES` (D1). Bindingit on määritelty erikseen paikalliselle, preview- ja production-ympäristölle ilman fyysisiä resurssitunnisteita. Wrangler provisioi puuttuvat ympäristökohtaiset resurssit ensimmäisen deployn yhteydessä ja kirjoittaa syntyneet tunnisteet takaisin konfiguraatioon. Preview-deploy tehdään ja sen data siemennetään ennen production-deployta.

D1:n `feature_details`-skeema ja migraatiot sijaitsevat
[`../museovirasto-map-data/contract`](../museovirasto-map-data/contract/README.md#d1-skeema)-hakemistossa.
Pää-Workerin `npm run deploy:*` ei aja näitä migraatioita. Normaalissa
aineistojulkaisussa migraatiot ajaa karttadata-updater ennen uuden D1-tuonnin
suorittamista. Jos Worker-muutos käyttää uutta saraketta, noudata koko
preview→production-järjestystä
[`updater/README.md`](../museovirasto-map-data/updater/README.md#d1-skeemamuutoksen-julkaisu)-ohjeesta; pelkkä Worker-deploy ei riitä.

Ensimmäisen deployn jälkeen julkaisuartefaktit voidaan ladata ja etärajapinta smoke-testata yhdellä komennolla:

```bash
infra/museovirasto-map-data/deploy/scripts/publish-cloudflare-release.sh preview
```

Skripti hyväksyy vain ympäristöt `preview` ja `production`, käyttää kyseisen ympäristön bindingeja ja vaatii production-ajossa erillisen `--confirm-production`-argumentin. Se ei provisioi resursseja eikä deployaa Worker-koodia. R2:n `bucket_name`- ja D1:n `database_id`-arvojen täytyy löytyä `wrangler.jsonc`-tiedoston valitusta ympäristöstä ennen ajoa.

Cloudflare huolehtii staattisten resurssien:

- URL- ja hakemistoreitityksestä
- `index.html`-tiedostojen käsittelystä
- MIME-tyypeistä ja ETageista
- `GET`-, `HEAD`, conditional- ja range-pyynnöistä
- 404-vastauksista
- jakelusta ja oletusvälimuistituksesta

Wrangler-konfiguraation keskeiset Static Assets -asetukset ovat:

- `directory: "../../dist"`: Webpack-buildin sijainti Worker-hakemistosta katsottuna.
- `binding: "ASSETS"`: Workerissa käytettävä Static Assets -binding.
- Static Assets ajetaan oletusarvoisesti ennen Workeria, koska `run_worker_first`-asetusta ei ole määritetty.
- `html_handling: "auto-trailing-slash"`: hakemistojen `index.html` toimii kauttaviivalla ja ilman sitä.

`not_found_handling`-asetusta ei määritetä, joten käytössä on sen oletusarvo `none`. Jos pyyntö ei vastaa staattista assettia, Cloudflare suorittaa Workerin. Worker käsittelee tunnetut API-reitit ja palauttaa muille pyynnöille `404`-vastauksen.

Mukautettuja cache-sääntöjä ei ole määritelty. Resurssit käyttävät Cloudflaren Static Assets -oletuskäyttäytymistä.

## Ympäristöt

Wrangler-konfiguraatiossa on kaksi nimettyä ympäristöä.

### Production

- Worker: `muinaismuistot`
- Domainit:
  - `https://muinaismuistot.info`
  - `https://www.muinaismuistot.info`
- `workers.dev` ja preview-URL:t eivät ole käytössä.
- Julkaisu tehdään aina eksplisiittisesti valinnalla `--env production`.

### Preview

- Worker: `muinaismuistot-preview`
- URL: `https://muinaismuistot-preview.antti-kekki.workers.dev`
- Ei tuotannon routeja tai Custom Domaineja.
- Julkaisu tehdään valinnalla `--env preview`.

## Uuden ympäristön käyttöönotto

Tämä ohje koskee tyhjää Cloudflare-tiliä tai uutta preview-/production-
ympäristöä. Normaali koodideploy ei tarvitse provisiointivaiheita uudelleen.

1. Asenna juuren, pää-Workerin ja updaterin riippuvuudet:

   ```bash
   npm ci
   npm ci --prefix infra/muinaismuistot-worker
   npm ci --prefix infra/museovirasto-map-data/updater
   ```

2. Deployaa pää-Worker ensin previewhin. Wrangler provisioi puuttuvan
   `MAP_DATA`-R2-bucketin ja `MAP_FEATURES`-D1-kannan:

   ```bash
   npm run worker:deploy:preview:dry-run
   npm run worker:deploy:preview
   ```

3. Tarkista, että previewn `bucket_name` ja `database_id` ovat
   `wrangler.jsonc`-tiedostossa. Karttadatan julkaisuskripti ei toimi ilman
   näitä tunnisteita.
4. Deployaa updater previewhin ja aseta sen READMEssä luetellut secretit sekä
   Email Service -binding:

   ```bash
   cd infra/museovirasto-map-data/updater
   npm run deploy:preview:dry-run -- --containers-rollout=none
   npm run deploy:preview
   ```

5. Käynnistä ensimmäinen aineistoajo. Se ajaa D1-migraatiot, täyttää D1:n,
   lataa R2-objektit ja smoke-testaa pää-Workerin:

   ```bash
   npx wrangler workflows trigger museovirasto-map-data-preview-update \
     '{"targetEnvironment":"preview"}' --env preview
   npx wrangler workflows instances describe \
     museovirasto-map-data-preview-update latest --env preview
   ```

6. Tarkista previewn `/api/museovirasto/health` ja
   `/api/museovirasto/meta` ennen productionin perustamista.
7. Toista pää-Workerin deploy, tunnisteiden tarkistus, updaterin deploy,
   production-secretit ja ensimmäinen Workflow-ajo `production`-ympäristölle.
   Productionissa käytä Workflow-nimeä
   `museovirasto-map-data-production-update`.

Ensimmäisen pää-Worker-deployn ja ensimmäisen aineistoajon välissä
Museovirasto-API voi palauttaa `503`, koska bindingit ovat olemassa mutta R2 ja
D1 eivät vielä sisällä aktiivista aineistoa. Tämä on odotettu bootstrap-tila.

## Projektin rakenne

```text
infra/muinaismuistot-worker/
├── package.json
├── package-lock.json
├── wrangler.jsonc
├── worker-configuration.d.ts
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts
│   └── endpoint/museovirasto/
│       ├── index.ts
│       ├── pmtiles.ts
│       ├── features-batch.ts
│       ├── features-by-register.ts
│       ├── search.ts
│       ├── metadata.ts
│       ├── health.ts
│       ├── feature-details.ts
│       └── responses.ts
├── test/
│   ├── env.d.ts
│   ├── index.test.ts
│   ├── endpoint/museovirasto/
│   │   ├── pmtiles.test.ts
│   │   ├── features-batch.test.ts
│   │   ├── features-by-register.test.ts
│   │   ├── search.test.ts
│   │   ├── metadata.test.ts
│   │   └── health.test.ts
│   ├── support/museovirasto.ts
│   └── tsconfig.json
└── README.md
```

`worker-configuration.d.ts` on Wranglerin generoima tiedosto. Se sisältää Workers-runtimen tyypit sekä `Env`-rajapinnan bindingit.

## Asennus

Vaatimuksena on Node.js 22 tai uudempi. Asenna sekä sivuston että Workerin riippuvuudet repositorion juuresta:

```bash
npm install
npm --prefix infra/muinaismuistot-worker install
```

Cloudflare-julkaisuja varten Wrangler pitää autentikoida:

```bash
npx --prefix infra/muinaismuistot-worker wrangler login
```

## Testaus

Testit käyttävät Vitestiä ja Cloudflaren virallista `@cloudflare/vitest-plugin`-integraatiota. Testit suoritetaan Workersin `workerd`-runtimessa oikeaa paikallista Static Assets -bindingia vasten.

Testikomento tekee ensin Webpack-tuotantobuildin ja testaa sen jälkeen muun muassa pääsivun, hakemistojen index-sivut, MIME-tyypit, ETagin, HEAD-pyynnön ja 404-vastauksen. Lisäksi testit varmistavat asset-first-reitityksen, `/api/museovirasto/*`-reitityksen, PMTiles Range -vastauksen, metatiedon, health-tarkistuksen, D1-massahaun ja tuntemattomien API-reittien `404`-vastauksen.

Generoi Cloudflare-tyypit uudelleen aina, kun `wrangler.jsonc`-bindingit muuttuvat:

```bash
npm --prefix infra/muinaismuistot-worker run types
```

## NPM-komennot

Komennot voidaan ajaa joko Worker-hakemistossa tai alla mainitulla juuritason vastineella.

| Worker-hakemistossa | Repositorion juuressa | Kuvaus |
| --- | --- | --- |
| `npm run dev` | `npm run worker:dev` | Käynnistää paikallisen Workerin ja Static Assets -palvelun. `dist/` pitää rakentaa ensin. |
| `npm test` | `npm run worker:test` | Tekee Webpack-tuotantobuildin ja ajaa Vitestit kerran. |
| `npm run test:watch` | – | Ajaa Vitestin watch-tilassa. `dist/` pitää rakentaa ensin. |
| `npm run typecheck` | `npm run worker:typecheck` | Tarkistaa Worker- ja testikoodin TypeScript-tyypit. |
| `npm run types` | – | Generoi Cloudflare-runtime- ja binding-tyypit. |
| `npm run deploy:dry-run` | `npm run worker:deploy:dry-run` | Tarkistaa production-bundlen ja assetit julkaisematta niitä. |
| `npm run deploy` | `npm run worker:deploy` | Rakentaa ja testaa sivuston sekä julkaisee Workerin ja assetit production-ympäristöön. |
| `npm run deploy:preview:dry-run` | `npm run worker:deploy:preview:dry-run` | Tarkistaa preview-bundlen ja assetit julkaisematta niitä. |
| `npm run deploy:preview` | `npm run worker:deploy:preview` | Rakentaa ja testaa sivuston sekä julkaisee Workerin ja assetit preview-ympäristöön. |

Production- ja preview-deployt suorittavat ennen Wrangler-julkaisua tuotantobuildin, Vitestit ja TypeScript-tarkistuksen. Julkaisu keskeytyy, jos jokin tarkistuksista epäonnistuu.
