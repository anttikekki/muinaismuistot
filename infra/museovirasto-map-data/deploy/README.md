# Deploy

Tämä moduuli julkaisee `processing`-moduulin valmiit artefaktit R2:een ja
D1:een, tarkistaa palvelun ja sisältää paikallisen palautustestin. Se ei lataa
lähdeaineistoa eikä rakenna PMTiles-arkistoa.

Preview-julkaisu suoritetaan repositorion juuresta komennolla:

```bash
infra/museovirasto-map-data/deploy/scripts/30-publish-cloudflare-release.sh preview
```

Tuotantojulkaisu vaatii lisäksi eksplisiittisen `--confirm-production`-lipun.
Cloudflare-resurssit ja ympäristöt määritellään pää-Workerissa
[`../../muinaismuistot-worker/wrangler.jsonc`](../../muinaismuistot-worker/wrangler.jsonc).
