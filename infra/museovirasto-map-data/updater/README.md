# Ajastettu karttadatan päivitys

`updater` automatisoi lähdeaineiston prosessoinnin ja julkaisun. Se on pää-Workerista erillinen Cloudflare Worker, Workflow, Durable Object ja lyhytikäinen Container, jotta raskaat GDAL- ja Tippecanoe-työt eivät kuulu karttadataa palvelevalle HTTP-Workerille.

Workflow käynnistää korkeintaan yhden Container-instanssin. Container lataa aineiston, ajaa `processing`-putken, julkaisee tulokset `deploy`-skriptillä ja sammuu. Viimeisen ajon tila säilyy Durable Objectissa.

## Riippuvuudet

Updater käyttää imageen kopioituja `../contract`-, `../processing`- ja `../deploy`-hakemistoja sekä pää-Workerin `wrangler.jsonc`-bindingeja.

Isäntäkoneelle tarvitaan Node.js, npm ja Docker. Monialustainen tai amd64-ristiinrakennus tarvitsee Docker Buildxin. Paikkatietotyökalut tulevat Docker-imagesta.

```bash
cd infra/museovirasto-map-data/updater
npm ci
npm test
npm run typecheck
```

## Paikallinen Container

Koko prosessointi ilman Cloudflare-kirjoituksia:

```bash
npm run process:local
```

Tulokset kopioidaan `../data/updater-local/`-hakemistoon. Valinnaiset asetukset:

```bash
PLATFORM=linux/amd64 \
IMAGE_TAG=museovirasto-map-data-updater:amd64 \
OUTPUT_DIR=/tmp/museovirasto-artifacts \
npm run process:local
```

Imagen ja HTTP-palvelimen voi ajaa erikseen:

```bash
PLATFORM=linux/arm64 IMAGE_TAG=museovirasto-map-data-updater:arm64 npm run build:image
IMAGE_TAG=museovirasto-map-data-updater:arm64 npm run run:local
```

```bash
curl http://localhost:8080/health
curl --request POST http://localhost:8080/run
```

Paikallinen palvelin käyttää `build`-tilaa eikä kirjoita Cloudflareen. Se hyväksyy vain yhden samanaikaisen ajon.

## Cloudflare-ympäristöt ja ajastus

`wrangler.jsonc` määrittää erilliset preview- ja production-Workerit, Workflowt, Containerit ja Durable Object -bindingit. Containerit on rajattu EU-alueelle ja yhteen `standard-1`-instanssiin.

- previewssa ei ole automaattista Workflow-ajastusta
- production Workflow käynnistyy päivittäin klo 01.30 UTC (`30 1 * * *`)
- production Worker tarkistaa julkaistun aineiston tuoreuden klo 06.00 UTC
- epäonnistunut rakennus- ja julkaisuvaihe yritetään kerran uudelleen viiden minuutin kuluttua

Tuoreustarkistus lukee pää-Workerin `/api/museovirasto/meta`-vastauksen ja hälyttää, jos julkaistun version vanhin lähdeaikaleima ylittää 36 tuntia. Se ei tarkista suoraan lähdepalvelun senhetkistä sisältöä.

## Secretit ja sähköposti

Molemmat ympäristöt tarvitsevat:

```bash
npx wrangler secret put CLOUDFLARE_API_TOKEN --env preview
npx wrangler secret put CLOUDFLARE_ACCOUNT_ID --env preview
npx wrangler secret put UPDATER_TOKEN --env preview
npx wrangler secret put ALERT_EMAIL_FROM --env preview
npx wrangler secret put ALERT_EMAIL_TO --env preview
```

Toista komennot `--env production` -valinnalla. Cloudflare-tokeni tarvitsee oikeuden pää-Workerin R2- ja D1-resursseihin. `UPDATER_TOKEN` suojaa manuaalisen ajon ja tilakyselyn. Email Service tarvitsee lisäksi lähettäjän domainin, varmennetun vastaanottajan ja `ALERT_EMAIL`-bindingin.

Workflow hälyttää kaikkien yritysten epäonnistuttua. Tuoreustarkistus lähettää erillisen hälytyksen vanhasta julkaistusta versiosta tai lukukelvottomasta metadatasta.

## Deploy ja manuaalinen käyttö

Preview-updater:

```bash
npm run deploy:preview:dry-run -- --containers-rollout=none
npm run deploy:preview
```

Production-updater:

```bash
npm run deploy:production:dry-run -- --containers-rollout=none
npm run deploy:production
```

Manuaalinen preview-ajo ja viimeisen Container-ajon tila:

```bash
curl --request POST \
  --header "Authorization: Bearer $UPDATER_TOKEN" \
  https://museovirasto-map-data-updater-preview.<workers-subdomain>.workers.dev/runs

curl --header "Authorization: Bearer $UPDATER_TOKEN" \
  https://museovirasto-map-data-updater-preview.<workers-subdomain>.workers.dev/status
```

`POST /runs` palauttaa Workflow-instanssin tunnisteen. `/status` palauttaa Durable Objectiin tallennetun viimeisen tilan (`idle`, `running`, `succeeded` tai `failed`) ja onnistuneen ajon version tai virheen lopun.

Production-ajo julkaisee vain productioniin ja preview-ajo vain previewhin; kohdeympäristöä ei voi vaihtaa HTTP-pyynnöllä. Updater-tokenia ei välitetä Containerille.

## D1-skeemamuutoksen julkaisu

D1-skeema, prosessoinnin SQL-tuonti, pää-Worker ja updaterin Container-image
voivat muuttua samassa työssä. Niitä ei julkaista yhdellä deploy-komennolla:

- pää-Workerin deploy julkaisee HTTP-koodin ja sivuston assetit, mutta ei aja
  karttadatan D1-migraatioita
- updaterin deploy rakentaa ja julkaisee uuden Worker- ja Container-version,
  mutta ei vielä käynnistä aineistopäivitystä
- updater-ajo käynnistää Containerin, joka rakentaa aineiston ja jonka
  julkaisuskripti ajaa migraatiot, D1-tuonnin, R2-lataukset ja smoke-testin

Tee muutokset lähtökohtaisesti laajentavina ja taaksepäin yhteensopivina. Vanhan
pää-Workerin pitää kestää uusi skeema ja uuden pää-Workerin pitää käsitellä
turvallisesti uuden sarakkeen oletusarvo tai `NULL`. Sarakkeen poistaminen,
uudelleennimeäminen tai merkityksen vaihtaminen tehdään kahdessa erillisessä
julkaisussa: ensin uusi rinnakkainen rakenne ja yhteensopiva koodi, myöhemmin
vanhan rakenteen poisto.

### Preview

1. Lisää uusi migraatio `../contract/migrations/`-hakemistoon ja päivitä
   prosessointi, pää-Worker, testifixturet sekä skeemadokumentaatio.
2. Aja paikalliset testit ja rakenna aineisto Dockerissa:

   ```bash
   npm test
   npm run typecheck
   npm run process:local
   npm --prefix ../../muinaismuistot-worker test
   npm --prefix ../../muinaismuistot-worker run typecheck
   ```

3. Tarkista updaterin preview-deploy ja julkaise uusi Container-image:

   ```bash
   npm run deploy:preview:dry-run -- --containers-rollout=none
   npm run deploy:preview
   ```

4. Käynnistä preview-updater `POST /runs` -kutsulla. Tämä ajaa migraation,
   rakentaa uuden D1-tuonnin, korvaa aineiston ja smoke-testaa vanhan mutta
   taaksepäin yhteensopivan pää-Workerin.
5. Tarkista Workflown `/status`, pää-Workerin `/api/museovirasto/health` ja
   `/api/museovirasto/meta`.
6. Deployaa vasta tämän jälkeen uutta skeemaa käyttävä pää-Worker previewhin:

   ```bash
   npm --prefix ../../muinaismuistot-worker run deploy:preview:dry-run
   npm --prefix ../../muinaismuistot-worker run deploy:preview
   ```

7. Testaa selaimen kartta, klikkaus, haku ja muut muutoksen koskettamat reitit
   preview-ympäristössä.

Jos pää-Worker pitää välttämättä julkaista ennen aineistopäivitystä, aja
migraatio ensin käsin `contract/README.md`:n ohjeella ja varmista, että uusi
Worker kestää vielä vanhoilla oletusarvoilla olevan datan.

### Production

Toista sama järjestys vasta hyväksytyn previewn jälkeen:

1. julkaise production-updater ja uusi Container-image
2. käynnistä production Workflow manuaalisesti ja odota onnistunutta tilaa;
   ajo suorittaa production-migraatiot ja aineistojulkaisun
3. tarkista production health ja metadata
4. deployaa uutta skeemaa käyttävä production-pää-Worker:

   ```bash
   npm --prefix ../../muinaismuistot-worker run deploy:dry-run
   npm --prefix ../../muinaismuistot-worker run deploy
   ```

5. tee API- ja selain-smoke-testit

Production Workflown voi käynnistää ja sen instanssit listata Wranglerilla:

```bash
npx wrangler workflows trigger museovirasto-map-data-production-update \
  '{"targetEnvironment":"production"}' --env production

npx wrangler workflows instances list \
  museovirasto-map-data-production-update --env production
```

Yksittäisen instanssin vaiheet ja virhe näytetään komennolla:

```bash
npx wrangler workflows instances describe \
  museovirasto-map-data-production-update <instance-id> --env production
```

Production-updaterilla ei ole `workers.dev`-osoitetta, koska
production-konfiguraatiossa `workers_dev` on pois käytöstä. Wrangler tai
Cloudflaren hallinta on siksi normaali tapa käynnistää manuaalinen
production-ajo, ellei updaterille määritetä erillistä suojattua reittiä.

## Häiriötilanteiden runbook

Suorita komennot tästä `updater`-hakemistosta ja valitse aina oikea `--env`.
Production-esimerkit voi vaihtaa previewksi vaihtamalla Workflown nimen ja
ympäristön.

### Viimeisen ajon tila ja virhe

```bash
npx wrangler workflows instances describe \
  museovirasto-map-data-production-update latest --env production
```

Käytä `instances list` -komentoa, jos tarvitset muun kuin viimeisen instanssin
tunnisteen. `describe` näyttää vaiheet, automaattiset uusintayritykset ja
virheen lopun.

### Validointi epäonnistui

Älä ohita validointia tai käynnistä samaa rikkinäistä ajoa toistuvasti.
Varmista virhe nykyisestä lähde-ZIPistä, muuta sopimusta vain jos lähdemuutos on
ymmärretty ja turvallinen, aja `npm test`, `npm run typecheck` ja
`npm run process:local`, deployaa korjattu updater-image ja luo uusi Workflow-
instanssi. Uusi instanssi on restartia selkeämpi, kun koodi tai image muuttui.

### Container ei käynnisty tai Workflow jää käyntiin

Tarkista ensin `describe`. Jos instanssi ei enää etene eikä Cloudflare lopeta
sitä aikarajan perusteella, lopeta se ja luo uusi ajo:

```bash
npx wrangler workflows instances terminate \
  museovirasto-map-data-production-update <instance-id> --env production

npx wrangler workflows trigger museovirasto-map-data-production-update \
  '{"targetEnvironment":"production"}' --env production
```

Älä käynnistä uutta ajoa ennen kuin vanha instanssi ja `daily-update`-Container
ovat varmasti pysähtyneet. Container estää kaksi samanaikaista päivitystä.

### Tilapäinen ulkoinen virhe

Workflow yrittää vaiheen jo kerran automaattisesti uudelleen. Jos esimerkiksi
Museoviraston lataus tai Cloudflare-kutsu epäonnistui tilapäisesti ja käytössä
on edelleen sama deployattu koodi, instanssin voi käynnistää uudelleen:

```bash
npx wrangler workflows instances restart \
  museovirasto-map-data-production-update <instance-id> --env production
```

Koodin, migraation tai Container-imagen muutoksen jälkeen luo aina uusi
instanssi restartin sijasta.

### Julkaistu aineisto on vanha

Vertaa julkaistua metadataa, lähde-ZIPin HTTP-aikaa ja viimeistä Workflowta:

```bash
curl --fail https://muinaismuistot.info/api/museovirasto/meta | jq
curl --fail --head \
  https://mverkkodatashare.blob.core.windows.net/share/tutkija.zip
npx wrangler workflows instances describe \
  museovirasto-map-data-production-update latest --env production
```

Jos lähde on tuore mutta metadata vanha, updater ei ole saanut uutta versiota
julkaistua. Jos molemmat ovat vanhoja, lähdepalvelu ei todennäköisesti ole
julkaissut uutta aineistoa. Tuoreushälytys koskee julkaistua versiota.

### Smoke-testi epäonnistui julkaisun jälkeen

Älä oleta vanhan version säilyneen: D1 tai R2 on voitu jo päivittää. Tarkista
virheen vaihe ja noudata
[`../deploy/README.md`](../deploy/README.md#julkaisun-atomisuus-ja-häiriön-tunnistaminen)-tiedoston
palautumisohjetta. Ensisijainen ratkaisu on korjattu koko julkaisun uudelleenajo.
