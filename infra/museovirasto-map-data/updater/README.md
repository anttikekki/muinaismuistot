# Ajastettu karttadatan päivitys

Updater on pää-Workerista erillinen Cloudflare Worker, Workflow ja lyhytikäinen
Container. Workflow käynnistää korkeintaan yhden `standard-1`-instanssin
(0,5 vCPU, 4 GiB muistia ja 8 GB levyä), lataa päivän lähdeaineiston, rakentaa
PMTiles- ja D1-artefaktit, julkaisee ne valittuun ympäristöön ja ajaa API:n
smoke-testin. Kontti sammutetaan ajon jälkeen ja viimeinen tila säilytetään sen
Durable Object -tallennuksessa.

## Arkkitehtuurit

Cloudflare Containers suorittaa `linux/amd64`-imageja. Dockerfile on silti
monialustainen:

- Cloudflarelle rakennetaan `linux/amd64`.
- Apple Silicon -Macilla rakennetaan ja ajetaan natiivisti `linux/arm64`.
- OSGeo GDAL- ja Protomaps PMTiles -perusimaget julkaisevat molemmat variantit.
- Node- ja jq-binäärit valitaan `TARGETARCH`-arvolla ja Tippecanoe käännetään
  kohdearkkitehtuurille.

Wranglerille on asetettu eksplisiittisesti `TARGETARCH=amd64`. Paikallinen
build-skripti johtaa arvon `PLATFORM`-muuttujasta, joten se toimii myös vanhalla
Docker-builderilla ilman BuildKitin automaattisia arkkitehtuurimuuttujia.

## Riippuvuudet ja asennus

Updater käyttää ajonaikaisesti `processing`- ja `deploy`-moduuleja sekä niiden
yhteistä `contract`-skeemaa. Docker-image kopioi moduulit sisäänsä, joten
isäntäkoneelle ei tarvitse asentaa GDALia tai Tippecanoeta updaterin paikallista
konttitestiä varten. Isäntäkone tarvitsee Node.js:n, npm:n, Dockerin ja
monialustaisiin buildeihin Docker Buildxin.

```bash
cd infra/museovirasto-map-data/updater
npm ci
npm run typecheck
npm test
```

Cloudflare-julkaisu käyttää moduulin lukittua Wrangler-versiota. Paikallinen
image tarvitsee lisäksi käynnissä olevan Docker-enginen.

## Paikallinen ARM64-testi

Imagen rakentaminen M1/M2/M3/M4-Macilla:

```bash
cd infra/museovirasto-map-data/updater
npm ci
PLATFORM=linux/arm64 IMAGE_TAG=museovirasto-map-data-updater:arm64 npm run build:image
```

Palvelin käynnistetään näin:

```bash
IMAGE_TAG=museovirasto-map-data-updater:arm64 npm run run:local
```

Toisessa terminaalissa:

```bash
curl http://localhost:8080/health
curl --request POST http://localhost:8080/run
```

Paikallinen ajo käyttää aina `build`-tilaa eikä kirjoita Cloudflareen. Valmiit
PMTiles-, D1-, manifesti- ja metadata-artefaktit kopioidaan gitistä ohitettuun
`data/updater-local/`-hakemistoon. Kontin sisäinen työlevy on kertakäyttöinen;
olemassa olevaa paikallista `data/`-hakemistoa ei mountata eikä tyhjennetä.

AMD64-image voidaan rakentaa Macilla emulaatiolla:

```bash
PLATFORM=linux/amd64 IMAGE_TAG=museovirasto-map-data-updater:amd64 npm run build:image
```

Ristiinrakennus edellyttää Docker Buildxiä tai muuta builderia, joka todella
vaihtaa build-alustan. Dockerfile keskeyttää buildin heti, jos `TARGETARCH` ja
base imagen todellinen arkkitehtuuri eivät vastaa toisiaan. ARM64-paikallisajo
ei tarvitse emulaatiota.

## Cloudflare-ympäristöt

Previewssa ei ole ajastusta. Production Workflow käynnistyy kerran päivässä
klo 01.30 UTC (`30 1 * * *`), eli Museoviraston klo 00.00 UTC julkaisun jälkeen.
Sekä preview että production rajoittavat kontin EU-alueelle.

Updater tarvitsee kummassakin ympäristössä viisi secretiä:

```bash
npx wrangler secret put CLOUDFLARE_API_TOKEN --env preview
npx wrangler secret put CLOUDFLARE_ACCOUNT_ID --env preview
npx wrangler secret put UPDATER_TOKEN --env preview
npx wrangler secret put ALERT_EMAIL_FROM --env preview
npx wrangler secret put ALERT_EMAIL_TO --env preview
```

Samat asetetaan `--env production` -valinnalla ennen tuotantodeployta.
Cloudflare-tokenin pitää pystyä päivittämään sovelluksen R2- ja D1-resurssit.
`UPDATER_TOKEN` suojaa manuaalisen käynnistyksen ja tilakyselyn.

Sähköpostihälytykset edellyttävät, että Cloudflare Email Serviceen on onboardattu
lähettäjän domain ja vastaanottaja on varmennettu. `ALERT_EMAIL_FROM` on tämän
domainin lähettäjäosoite ja `ALERT_EMAIL_TO` varmennettu vastaanottaja. Samat
asetukset tehdään production-ympäristöön.

Workflow lähettää hälytyksen, jos päivitys epäonnistuu kaikkien yritysten
jälkeen. Production-Worker tarkistaa lisäksi päivittäin klo 06.00 UTC
`/api/museovirasto/meta`-vastauksen. Se hälyttää, jos Museoviraston Azure Blobin
`Last-Modified`-aika tai ZIP-entryistä johdettu `publishedAt` on yli 36 tuntia
vanha tai metadataa ei voida lukea. Näin myös vanhan sisällön uudelleenlataus,
kokonaan käynnistymättä jäänyt päivitys ja Museoviraston pysähtynyt lähdeputki
havaitaan.

Preview-konfiguraatio tarkistetaan ja julkaistaan näin:

```bash
npm run typecheck
npm test
npm run deploy:preview:dry-run -- --containers-rollout=none
npm run deploy:preview
```

Manuaalinen ajo ja tilakysely:

```bash
curl --request POST \
  --header "Authorization: Bearer $UPDATER_TOKEN" \
  https://museovirasto-map-data-updater-preview.<workers-subdomain>.workers.dev/runs

curl --header "Authorization: Bearer $UPDATER_TOKEN" \
  https://museovirasto-map-data-updater-preview.<workers-subdomain>.workers.dev/status
```

`POST /runs` luo Workflow-instanssin ja palauttaa heti sen tunnisteen. Workflow
odottaa kontin koko ajon valmistumista, yrittää epäonnistuneen vaiheen kerran
uudelleen ja tallentaa lopputilaksi `succeeded` tai `failed`. Production-deploy
tehdään vasta onnistuneen preview-ajon jälkeen.

## Turvarajat

- Preview-Workflow voi julkaista vain preview-resursseihin ja production vain
  tuotantoon; pyynnöllä ei voi vaihtaa kohdeympäristöä.
- Päivityksen API-token välitetään vain Workflown sisäisesti käynnistettävälle
  kontille, ei HTTP-pyynnössä.
- Kontteja voi olla samanaikaisesti vain yksi.
- Instanssikoko perustuu ensimmäisen onnistuneen preview-ajon mitattuun 795 Mt:n
  muistihuippuun, 2,34 Gt:n levynkäyttöön ja 21,09 prosentin CPU-käyttöön
  alkuperäisessä `standard-3`-instanssissa. `standard-1` jättää erityisesti
  muistille ja levylle selkeän kasvumarginaalin.
- Automaattiajo ei aja Playwright-selainregressiota kontissa. Julkaisuskripti
  ajaa edelleen API-smoke-testin; pysyvät Playwright-testit kuuluvat Worker-
  ja käyttöliittymädeployn regressiotarkistuksiin.
- Pää-Workerista kopioidaan imageen vain R2- ja D1-resurssit määrittelevä
  `wrangler.jsonc`. Julkaisu käyttää updaterin omaa lukittua Wrangler-asennusta,
  eikä kontti asenna pää-Workerin npm-riippuvuuksia tai sisällä sen lähdekoodia.
