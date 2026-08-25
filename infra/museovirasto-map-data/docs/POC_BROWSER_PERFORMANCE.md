# Paikallisen PMTiles-PoC:n selainmittaus

> Historiallinen mittaus. Paikallinen PoC-ajuri on poistettu; uudet mittaukset
> ja regressiot ajetaan varsinaisessa sovelluksessa preview-ympäristössä.

Mittaus ajettiin irrallisella OpenLayers-PoC:lla. Sen komennot eivät ole enää käytössä:

```bash
# Historiallinen PoC-komento poistettu
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

## Cloudflare-preview

Sama paikallinen PoC-käyttöliittymä mitattiin 24.8.2026 niin, että kaikki Museovirasto-API-pyynnöt ohjattiin osoitteeseen `https://muinaismuistot-preview.antti-kekki.workers.dev`. Jokainen näkymä käytti jälleen uutta kylmää Chrome-profiilia.

| Näkymä | Zoom | Data valmis | PMTiles-pyynnöt | PMTiles-tavut | Ladatut featuret | Aktiiviset pisteet | Esitys | JS-heap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| Koko Suomi, kaikki tasot | 5 | 2 609 ms | 6 | 1 765 305 | 158 725 | 158 671 | 19 aggregaattia | 198 354 749 B |
| Koko Suomi, pronssikautiset hautaröykkiöt | 5 | 2 315 ms | 6 | 1 765 305 | 158 725 | 331 näkyvässä selainnäkymässä | yksittäiset | 167 435 921 B |
| Helsinki/kaupunkitaso | 10 | 2 930 ms | 8 | 164 359 | 4 488 | 4 483 | yksittäiset | 18 627 873 B |
| Helsingin lähitaso | 14 | 2 687 ms | 8 | 32 945 | 101 | 74 | yksittäiset | 4 156 254 B |

Range-pyyntöjen määrät, tavumäärät ja featuremäärät täsmäävät paikalliseen vertailuun. Noin 2,3–2,9 sekunnin valmistumisaika sisältää oikean verkon, Cloudflare Workerin ja R2:n kylmän latauspolun. Yksi ajo näkymää kohti ei vielä riitä p50- tai p95-johtopäätöksiin, mutta se vahvistaa end-to-end-toimivuuden ja osoittaa, että tuotantoverkon vaste on otettava mukaan vaiheen 4 suorituskykytestaukseen.

## Rajaus

Irrallinen PoC ei sisällä muinaismuistot.info-sivuston taustakarttaa eikä muista lähteistä tulevia karttatasoja. Nämä mittaukset ovat siksi Museoviraston uuden lähteen vertailutasoja, eivät vielä koko tuotantosivun lopullinen suorituskykybudjetti. Taustakartan ja muiden lähteiden yhteismittaus tehdään vaiheessa 4, kun PMTiles-lähde on feature flagin takana oikeassa OpenLayers-sovelluksessa.
