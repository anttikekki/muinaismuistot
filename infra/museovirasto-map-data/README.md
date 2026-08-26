# Museoviraston karttadata

Tämä kokonaisuus muuntaa Museoviraston päivittäin julkaiseman GeoPackage-aineiston muinaismuistot.info-palvelun omaan käyttöön. Esiprosessointi tarvitaan, koska 26 loogisen karttatason suora käyttö Museoviraston WMS- ja WFS-palveluista on kartan, kohdehaun ja mobiilikäytön kannalta liian hidasta.

Tuloksena syntyy selaimelle tehokas PMTiles-arkisto sekä D1-aineisto kohdetietoja, hakua, karttaklikkausta ja pysyviä linkkejä varten. Varsinainen HTTP-rajapinta ja staattinen sivusto ovat [`../muinaismuistot-worker`](../muinaismuistot-worker/README.md)-hakemistossa.

## Arkkitehtuuri

```text
Museoviraston tutkija.zip
          |
          v
  processing/  <--- contract/
          |
          +--- museovirasto.pmtiles
          +--- feature-details.sql
          +--- metadata ja validointiraportit
          |
          v
      deploy/
          |
          +--- R2: current.pmtiles ja current.json
          +--- D1: feature_details
          |
          v
 muinaismuistot-worker ---> selain

 updater/ käynnistää processing- ja deploy-vaiheet päivittäin Cloudflaressa.
```

| Hakemisto | Miksi se on olemassa |
| --- | --- |
| [`contract/`](contract/README.md) | Selaimen, Workerin ja prosessoinnin yhteinen taso-, suodatus- ja tietokantasopimus. |
| [`processing/`](processing/README.md) | Lähdeaineiston lataus, validointi ja ympäristöriippumattomien artefaktien rakentaminen. |
| [`deploy/`](deploy/README.md) | Artefaktien julkaisu R2:een ja D1:een sekä julkaistun palvelun tarkistus. |
| [`updater/`](updater/README.md) | Päivittäinen Workflow- ja Container-orkestrointi, hälytykset ja paikallinen Docker-ajo. |
| `data/` | Gitistä ohitettu työtila lähteelle, välituloksille ja paikallisille artefakteille. |

`contract` ei riipu muista osista. `processing` käyttää sopimusta mutta ei tunne Cloudflarea. `deploy` käyttää valmiita tuloksia eikä rakenna niitä. `updater` yhdistää prosessoinnin ja julkaisun. Pää-Worker omistaa R2- ja D1-resurssien määritykset.

## Aineisto ja tietomalli

Lähde on Museoviraston tutkimuskäyttöön tarkoitettu kulttuuriympäristörekisterien ZIP-tuote:

- `https://mverkkodatashare.blob.core.windows.net/share/tutkija.zip`
- 12 fyysistä GeoPackage-kohdetasoa
- 26 käyttöliittymän loogista tasoa
- lähteen koordinaatisto EPSG:3067

Arkeologisten kohteiden piste- ja aluetasot jaetaan loogisiksi tasoiksi `Laji`-kentän avulla. Muut fyysiset tasot vastaavat pääosin yhtä loogista tasoa. Tarkka koneellisesti validoitu mäppäys on [`contract/layer-mapping.json`](contract/layer-mapping.json)-tiedostossa.

PMTiles sisältää renderöintiin tarvittavat kompaktit ominaisuudet. D1 sisältää tarkemmat ominaisuudet ja geometriat. Molemmat rakennetaan samasta lähteestä ja niiden feature-identiteetit validoidaan ennen julkaisua.

## Päivittäinen suoritus

Production-updater käynnistyy kerran päivässä klo 01.30 UTC:

1. Container lataa uuden ZIPin kertakäyttöiseen työtilaan.
2. Lähteen rakenne, geometriat, koordinaatisto ja tunnetut arvojoukot validoidaan.
3. PMTiles-arkisto ja D1-tuonti rakennetaan ja ristiinvalidoidaan.
4. Manifesti ja lähteen päiväykseen perustuva metadata muodostetaan.
5. D1-migraatiot ja tuonti suoritetaan, minkä jälkeen PMTiles ja metadata ladataan R2:een.
6. Julkaistu API smoke-testataan ja Container sammutetaan.

Workflow lähettää hälytyksen kaikkien yritysten epäonnistuttua. Erillinen tuoreustarkistus ilmoittaa, jos julkaistuna oleva aineistoversio vanhenee.

## Tavallisimmat komennot

Koko prosessointi paikallisesti samassa Docker-imagessa kuin Cloudflaressa:

```bash
cd infra/museovirasto-map-data/updater
npm ci
npm run process:local
```

Updaterin testit ja tyyppitarkistus:

```bash
cd infra/museovirasto-map-data/updater
npm test
npm run typecheck
```

Preview-julkaisu valmiista `data/build`-artefakteista:

```bash
infra/museovirasto-map-data/deploy/scripts/30-publish-cloudflare-release.sh preview
```

Production-julkaisu vaatii eksplisiittisen vahvistuksen:

```bash
infra/museovirasto-map-data/deploy/scripts/30-publish-cloudflare-release.sh production --confirm-production
```

Katso tarkemmat riippuvuudet ja komennot kunkin alihakemiston READMEstä.

## D1-rakennemuutokset

D1:n nykyinen skeema, uuden migraation luonti sekä manuaaliset `list`- ja
`apply`-komennot on dokumentoitu
[`contract/README.md`](contract/README.md#d1-rakennemuutos)-tiedostossa. Kun
muutos koskee myös SQL-tuontia, pää-Workeria tai updaterin Container-imagea,
noudata
[`updater/README.md`](updater/README.md#d1-skeemamuutoksen-julkaisu)-tiedoston
preview→production-julkaisujärjestystä.

## Operointi

- Uuden Cloudflare-ympäristön bootstrap on kuvattu
  [`../muinaismuistot-worker/README.md`](../muinaismuistot-worker/README.md#uuden-ympäristön-käyttöönotto)-tiedostossa.
- Workflow-, Container-, lähde- ja tuoreushäiriöiden komennot ovat
  [`updater/README.md`](updater/README.md#häiriötilanteiden-runbook)-tiedostossa.
- Osittaisen julkaisun tunnistaminen, D1 Time Travel ja R2-palautuksen nykyiset
  rajoitteet ovat
  [`deploy/README.md`](deploy/README.md#julkaisun-atomisuus-ja-häiriön-tunnistaminen)-tiedostossa.
- Skeemaversioiden kasvattaminen on kuvattu
  [`contract/README.md`](contract/README.md#skeemaversiot-ja-yhteensopivuus)-tiedostossa.
- PMTiles-budjetit ja paikallisen työtilan siivous on kuvattu
  [`processing/README.md`](processing/README.md#kapasiteettirajat-ja-työtilan-siivous)-tiedostossa.
