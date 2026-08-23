# Muinaismuistot.info Cloudflare Worker

Cloudflare Worker, joka palvelee [muinaismuistot.info](https://muinaismuistot.info)-sivuston Webpack-buildin Cloudflare Workers Static Assetsista.

## Arkkitehtuuri

```text
muinaismuistot.info ─────┐
                        ├─ Cloudflare Custom Domain ─ Worker ─ Static Assets
www.muinaismuistot.info ─┘
```

Webpack rakentaa sivuston repositorion juuren `dist/`-hakemistoon. Wrangler julkaisee samalla deploylla sekä Workerin että `dist/`-hakemiston muuttuneet tiedostot Workers Static Assetsiksi. Erillistä origin-palvelinta, GitHub Pagesia tai R2-bucketia ei käytetä.

Worker suoritetaan ennen Static Assets -reititystä. Tämä mahdollistaa redirectit sekä myöhemmin lisättävät API-reitit ilman muutoksia staattisten tiedostojen julkaisutapaan.

## Workerin logiikka

Workerin entrypoint on `src/index.ts`. Se käsittelee pyynnöt seuraavasti:

1. `www.muinaismuistot.info` ohjataan 308-vastauksella osoitteeseen `muinaismuistot.info`. Polku ja query string säilyvät muuttumattomina.
2. Kaikki muut pyynnöt välitetään `env.ASSETS.fetch(request)`-kutsulla Cloudflaren Static Assets -bindingille.

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
- `run_worker_first: true`: kaikki pyynnöt kulkevat ensin Workerin kautta.
- `html_handling: "auto-trailing-slash"`: hakemistojen `index.html` toimii kauttaviivalla ja ilman sitä.
- `not_found_handling: "none"`: puuttuva resurssi palauttaa 404-vastauksen ilman SPA-fallbackia.

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
│   └── index.ts
├── test/
│   ├── env.d.ts
│   ├── index.test.ts
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

Testikomento tekee ensin Webpack-tuotantobuildin ja testaa sen jälkeen muun muassa pääsivun, hakemistojen index-sivut, `www`-redirectin, MIME-tyypit, ETagin, HEAD-pyynnön ja 404-vastauksen.

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
