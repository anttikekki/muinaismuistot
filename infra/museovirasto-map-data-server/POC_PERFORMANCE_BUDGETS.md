# Vaiheen 1 suorituskykybudjetit ja arkkitehtuuripäätös

## Päätös

PoC hyväksytään jatkokehityksen pohjaksi. Tuotantoratkaisun lähtöarkkitehtuuri on yksi PMTiles-arkisto, yksi Range-pyyntöjä palveleva Cloudflare Worker, R2-objekti ja D1:n ominaisuus- sekä hakutaulu. OpenLayers johtaa 12 fyysisestä MVT-lähdetasosta 26 loogista tasoa eikä luo tasovalinnoista uusia HTTP-lähteitä.

Kaikki yksittäiset kohteet säilyvät arkistossa. Selain suodattaa ensin ja valitsee vasta sen jälkeen tarkan tai aggregoidun esityksen. Alustava aggregoinnin hystereesi on 20 000/40 000 aktiivista pistettä. Aluetasot esitetään keskipisteinä zoomeilla 0–9 ja polygoneina zoomeilla 10–14.

Pysyvä kohdeviite on `logicalLayerId + registryId`. Nykyisen aineistojulkaisun karttaklikkaus käyttää `sourceLayer + fid` -avainta. `fid` hyväksytään PoC-ratkaisuksi, mutta ei vielä lukituksi tuotantoskeemaksi: sen lisääminen kasvatti koko Suomen Range-siirron 835 056 tavusta 1 766 264 tavuun eli noin 111 prosenttia. Vaiheessa 2 rakennetaan vertailu ilman MVT-feature-ID:tä ja `registry_id`-ominaisuudella ennen skeeman lukitsemista.

## Paikallisen työpöytä-PoC:n budjetit

Budjetit koskevat kylmää paikallista Chrome-ajoa Apple M1 Max -testikoneella. Ne ovat regressiorajoja rakennusputkelle ja irralliselle PoC:lle, eivät vielä tuotantoverkon palvelutasolupauksia.

| Mittari | Koko Suomi | Kaupunkitaso | Lähitaso |
| --- | ---: | ---: | ---: |
| PMTiles Range -pyynnöt | enintään 8 | enintään 10 | enintään 10 |
| PMTiles-vastaustavut | enintään 2 000 000 | enintään 250 000 | enintään 75 000 |
| Datan valmistuminen | enintään 500 ms | enintään 250 ms | enintään 150 ms |
| Käytetty JS-heap | enintään 200 MB | enintään 40 MB | enintään 10 MB |

Nykyinen mittaus alittaa nämä rajat: koko Suomi 6 pyyntöä, 1 766 264 tavua, 383 ms ja noin 169 MB; kaupunkitaso 8 pyyntöä, 165 304 tavua, 125 ms ja noin 22 MB; lähitaso 8 pyyntöä, 33 562 tavua, 87 ms ja noin 4 MB.

## Renderöintibudjetit

- Aggregoidussa koko Suomen näkymässä p95-ruutuväli on enintään 75 ms, p95-syöteviive enintään 50 ms ja `moveend` → valmis enintään 50 ms.
- Enintään noin 40 000 tarkkana piirrettävän pisteen näkymässä p95-ruutuväli on enintään 150 ms ja p95-syöteviive enintään 75 ms.
- Alle aggregointirajan jäävän suodatetun tulosjoukon pitää näkyä yksittäisinä kohteina myös koko Suomen näkymässä.
- Zoomirajalla 9→10 alue ei saa kadota eikä näkyä samanaikaisesti keskipisteenä ja polygonina.

Nykyiset hyväksytyt vertailut ovat aggregoidulle näkymälle 56 ms / 4 ms / 1 ms sekä 41 549 tarkan pisteen näkymälle 141 ms / 46 ms / 3 ms.

## D1-budjetit

- Lineaarisen sanahaun paikallinen kylmä vaste on enintään 250 ms ja lämmitetty vaste enintään 100 ms.
- Haku hyväksyy vain 3–100 merkkiä ja palauttaa enintään 50 ryhmiteltyä tulosta.
- Yhden karttaklikkauksen ominaisuustiedot haetaan yhdellä, enintään 100 viitteen massapyynnöllä; N+1-pyyntöjä ei sallita.
- Pysyvä rekisteritunnushaku palauttaa kaikki nykyisen aineiston rivit ilman aineistoversion vaatimista URL:ssa.

Mitattu kylmä sanahaku oli 199 ms ja lämmitetyt haut noin 51–76 ms. Paikallinen ominaisuustietojen massahaun end-to-end-vertailu oli 108 ms.

## Vaiheeseen 4 siirtyvät hyväksyntäportit

Seuraavia ei voida hyväksyä irrallisessa PoC:ssa, koska siinä ei ole tuotantosivun taustakarttaa eikä muiden lähteiden tasoja:

- tuettavan mobiililaitteen muisti- ja renderöintibudjetti;
- oikean verkon kylmä latausaika;
- kaikkien samanaikaisten karttalähteiden HTTP-pyyntö- ja tavubudjetti;
- tuotantoselainten visuaalinen regressio ja pitkäkestoisen käytön muistivuodot.

Nämä mitataan vaiheessa 4 feature flagin takana ennen tuotantoonvientiä. Nykyisten työpöytäbudjettien rikkoutuminen estää kuitenkin julkaisun jo vaiheesta 2 alkaen.
