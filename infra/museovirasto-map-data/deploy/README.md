# Deploy

Tämä moduuli julkaisee `processing`-moduulin `../data/build/`-hakemistoon
tuottamat artefaktit R2:een ja D1:een sekä tarkistaa palvelun. Se ei lataa
lähdeaineistoa eikä rakenna PMTiles-arkistoa.

## Riippuvuudet ja asennus

Moduuli riippuu processing-artefakteista, `../contract/migrations`-skeemasta,
pää-Workerin Cloudflare-resurssimäärityksistä ja juuriprojektin pysyvistä
Playwright-testeistä. Paikallinen julkaisu tarvitsee Bashin, `curl`-, `jq`- ja
Node.js-komennot sekä juuriprojektin ja pää-Workerin npm-riippuvuudet:

```bash
npm ci
npm ci --prefix infra/muinaismuistot-worker
```

Wrangler käyttää kirjautunutta Cloudflare-käyttäjää tai ympäristöstä saatavaa
API-tokenia. Julkaisu ei asenna riippuvuuksia automaattisesti.

Preview-julkaisu suoritetaan repositorion juuresta komennolla:

```bash
infra/museovirasto-map-data/deploy/scripts/30-publish-cloudflare-release.sh preview
```

Tuotantojulkaisu vaatii lisäksi eksplisiittisen `--confirm-production`-lipun.
Cloudflare-resurssit ja ympäristöt määritellään pää-Workerissa
[`../../muinaismuistot-worker/wrangler.jsonc`](../../muinaismuistot-worker/wrangler.jsonc).
