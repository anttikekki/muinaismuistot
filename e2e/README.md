# End-to-end tests

Playwright tests run against a deployed muinaismuistot Worker. The default target is the Cloudflare preview environment. Override it with `E2E_BASE_URL` when testing another local or deployed Worker.

The release-blocking PMTiles/D1 regression suite covers vector tile loading, search and its detail batch, GeoJSON export, a permanent feature link, and map-click identification:

```bash
npm run test:e2e
E2E_BASE_URL=https://example.test npm run test:e2e
```

`infra/museovirasto-map-data/deploy/scripts/publish-cloudflare-release.sh` runs this suite after its API smoke test. A failed browser test therefore fails the preview or production publication command.

The legacy WMS/WFS fallback depends on the external Finnish Heritage Agency GeoServer and is intentionally a separate monitoring test. Its failure must not block publication of the independently hosted PMTiles service:

```bash
npm run test:e2e:wms
```

Run both projects explicitly with:

```bash
npm run test:e2e:all
```

Type-check the Playwright configuration and tests with:

```bash
npm run typecheck:e2e
```

Chrome is selected as the browser channel. On CI or another machine, install Chrome or change the Playwright project to use an installed Playwright browser. Failure traces, screenshots, and videos are written under the ignored `test-results/` directory. The HTML report is written under `playwright-report/`.
