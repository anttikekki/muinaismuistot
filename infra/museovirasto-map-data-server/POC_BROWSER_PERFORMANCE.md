# Paikallisen PMTiles-PoC:n selainmittaus

Mittaus ajetaan irralliselle OpenLayers-PoC:lle komennolla:

```bash
cd infra/museovirasto-map-data-server/poc
npm run dev
# toisessa terminaalissa
npm run measure:browser
```

Ajuri käynnistää jokaiselle näkymälle uuden välimuistittoman headless Chrome -profiilin ja odottaa OpenLayersin omaa `benchmarkReady`-signaalia. Testikone oli Apple MacBook Pro M1 Max. Arkisto oli 66 963 838 tavun `fid`-versio paikallisessa Wrangler R2 -simulaatiossa.

| Näkymä | Zoom | Data valmis | PMTiles-pyynnöt | PMTiles-tavut | Ladatut featuret | Aktiiviset pisteet | Esitys | JS-heap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| Koko Suomi, kaikki tasot | 5 | 383 ms | 6 | 1 766 264 | 158 725 | 158 671 | 19 aggregaattia | 168 503 452 B |
| Koko Suomi, pronssikautiset hautaröykkiöt | 5 | 282 ms | 6 | 1 766 264 | 158 725 | 331 näkyvässä selainnäkymässä | yksittäiset | 159 495 629 B |
| Helsinki/kaupunkitaso | 10 | 125 ms | 8 | 165 304 | 4 488 | 4 483 | yksittäiset | 22 213 004 B |
| Helsingin lähitaso | 14 | 87 ms | 8 | 33 562 | 101 | 74 | yksittäiset | 3 995 815 B |

`PMTiles-tavut` lasketaan Workerin `Content-Length`-otsakkeista ja kuvaa Range-vastausten sisältöä. `resourceTransferBytes` jätetään taulukosta pois, koska Resource Timing -arvo sisältää myös PoC:n JavaScript-, CSS- ja API-pyynnöt eikä ole sama asia kuin palvelimelta luettujen tavujen määrä.

Suodatettu näkymä lataa saman MVT-datan kuin suodattamaton näkymä; suodatus tapahtuu selaimessa. Siksi PMTiles-pyyntöjen määrä ja tavut ovat samat. Hyöty näkyy renderöitävän tulosjoukon koossa ja esitystavassa.

## Rajaus

Irrallinen PoC ei sisällä muinaismuistot.info-sivuston taustakarttaa eikä muista lähteistä tulevia karttatasoja. Tämä mittaus on siksi Museoviraston uuden lähteen kylmän latauksen vertailutaso, ei vielä koko tuotantosivun lopullinen suorituskykybudjetti. Taustakartan ja muiden lähteiden yhteismittaus tehdään vaiheessa 4, kun PMTiles-lähde on feature flagin takana oikeassa OpenLayers-sovelluksessa.
