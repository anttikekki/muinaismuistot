# Paikallisen PMTiles-PoC:n selainmittaus

Mittaus ajetaan irralliselle OpenLayers-PoC:lle komennolla:

```bash
cd infra/museovirasto-map-data-server/poc
npm run dev
# toisessa terminaalissa
npm run measure:browser
```

Ajuri käynnistää jokaiselle näkymälle uuden välimuistittoman headless Chrome -profiilin ja odottaa OpenLayersin omaa `benchmarkReady`-signaalia. Testikone oli Apple MacBook Pro M1 Max. Arkisto oli 63 451 059 tavun numeerista `laji_key`-koodia käyttävä `fid`-versio paikallisessa Wrangler R2 -simulaatiossa.

| Näkymä | Zoom | Data valmis | PMTiles-pyynnöt | PMTiles-tavut | Ladatut featuret | Aktiiviset pisteet | Esitys | JS-heap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| Koko Suomi, kaikki tasot | 5 | 456 ms | 6 | 1 765 305 | 158 725 | 158 671 | 19 aggregaattia | 175 389 949 B |
| Koko Suomi, pronssikautiset hautaröykkiöt | 5 | 291 ms | 6 | 1 765 305 | 158 725 | 331 näkyvässä selainnäkymässä | yksittäiset | 163 261 488 B |
| Helsinki/kaupunkitaso | 10 | 137 ms | 8 | 164 359 | 4 488 | 4 483 | yksittäiset | 26 562 565 B |
| Helsingin lähitaso | 14 | 83 ms | 8 | 32 945 | 101 | 74 | yksittäiset | 4 024 364 B |

`PMTiles-tavut` lasketaan Workerin `Content-Length`-otsakkeista ja kuvaa Range-vastausten sisältöä. `resourceTransferBytes` jätetään taulukosta pois, koska Resource Timing -arvo sisältää myös PoC:n JavaScript-, CSS- ja API-pyynnöt eikä ole sama asia kuin palvelimelta luettujen tavujen määrä.

Suodatettu näkymä lataa saman MVT-datan kuin suodattamaton näkymä; suodatus tapahtuu selaimessa. Siksi PMTiles-pyyntöjen määrä ja tavut ovat samat. Hyöty näkyy renderöitävän tulosjoukon koossa ja esitystavassa.

## Rajaus

Irrallinen PoC ei sisällä muinaismuistot.info-sivuston taustakarttaa eikä muista lähteistä tulevia karttatasoja. Tämä mittaus on siksi Museoviraston uuden lähteen kylmän latauksen vertailutaso, ei vielä koko tuotantosivun lopullinen suorituskykybudjetti. Taustakartan ja muiden lähteiden yhteismittaus tehdään vaiheessa 4, kun PMTiles-lähde on feature flagin takana oikeassa OpenLayers-sovelluksessa.
