# Prosessoinnin validoinnit

Tämä hakemisto sisältää rakennusputken hyväksymisportit. Validoinnit eivät
korjaa lähdettä tai artefakteja, vaan keskeyttävät ajon ensimmäiseen rikottuun
sopimukseen ja kertovat odotetun sekä havaitun arvon.

## Validoinnit

| Komento | Milloin | Syötteet | Mitä tarkistetaan | Raportti |
| --- | --- | --- | --- | --- |
| `validate-layer-mapping.mjs` | Kehitystarkistus, ei yöajossa | `layer-mapping.json`, `filter-vocabulary.json`, `config/layers.json`, UI-enum ja ladatut GeoPackaget | 12 fyysistä ja 26 loogista tasoa; tunnisteiden uniikkius; tiedostot, tasot ja projektioiden vaatimat kentät; geometriaperheet; sanaston havaitut lähdearvot; loogisten suodattimien kattavuus; UI-enumin ja build-ID:iden vastaavuus | Konsoli |
| `validate-source-data.mjs` | Heti latauksen jälkeen | 12 GeoPackagea ja mapping | Tasot eivät ole tyhjiä; EPSG:3067; odotettu geometriaperhe; vain sallitut null-geometriat; kaikki geometriat valideja | `data/build/source-validation-report.json` |
| `validate-pmtiles.mjs` | PMTiles-rakennuksen jälkeen | PMTiles, mapping ja suodatussanasto | Arkiston sisäinen eheys; 12 MVT-lähdetasoa; kompakti attribuuttiskeema; `laji_key`-koodit; kaikkien pistetasojen säilyminen zoomissa 0; aluetasojen keskipiste-esitys zoomissa 0 | Konsoli |
| `validate-tiling-budgets.sh` | PMTiles-validoinnin jälkeen | PMTiles ja `config/layers.json` | Zoomit 0–14; arkisto enintään 75 MB; zoom 0 -tiili enintään 1,5 MB | `data/build/tiling-budget-report.json` |
| `validate-pmtiles-d1-identities.mjs` | D1-tuonnin jälkeen | PMTiles sekä PMTiles- ja D1-rakennusten identiteetti-TSV:t | Rakennussyötteiden `(source_layer, fid)`-joukot ovat samat; D1-raportin rivimäärä vastaa identiteettejä; jokaisella zoom 0:n featurella on D1-rivi | `data/build/pmtiles-d1-identity-report.json` |

`validate-layer-mapping.mjs` on tarkoituksella erillinen staattinen
kehitystarkistus. Yöajo käyttää nopeampaa `validate-source-data.mjs`-porttia;
mappingin sisäiset sopimukset muuttuvat vain versionhallituissa koodimuutoksissa.

Polygoniselle tasolle hyväksytään GeoPackagen yleinen `GEOMETRY`-metatieto vain,
jos jokainen ei-tyhjä rivi on todellisuudessa `POLYGON` tai `MULTIPOLYGON`.
Piste, viiva tai muu geometria pysäyttää ajon.

## Suorittaminen

Tuettu koko ajo tapahtuu lukitussa Docker-imagessa:

```bash
cd infra/museovirasto-map-data/updater
npm run process:local
```

Yksittäisen validoinnin voi ajaa imageen asennetussa ympäristössä:

```bash
node infra/museovirasto-map-data/processing/scripts/validation/validate-source-data.mjs
node infra/museovirasto-map-data/processing/scripts/validation/validate-pmtiles.mjs
node infra/museovirasto-map-data/processing/scripts/validation/validate-pmtiles-d1-identities.mjs
infra/museovirasto-map-data/processing/scripts/validation/validate-tiling-budgets.sh
```

Staattinen mapping-tarkistus:

```bash
node infra/museovirasto-map-data/processing/scripts/validation/validate-layer-mapping.mjs
```

Node-validointien yksikkötestit eivät tarvitse GeoPackage- tai PMTiles-
fixturejä, koska ne testaavat parsitut sopimukset pienillä olio- ja TSV-
fixtureillä:

```bash
node --test infra/museovirasto-map-data/processing/scripts/validation/test/*.test.mjs
```

## Odotusarvojen muuttaminen

Älä muuta validaattoria vain saadaksesi uuden lähdeaineiston läpi. Selvitä ensin,
onko kyse hyväksyttävästä lähdemuutoksesta, datavirheestä vai omasta
regressiosta. Lähdetasojen odotukset kuuluvat `contract/layer-mapping.json`-
tiedostoon, luokitusarvot `contract/filter-vocabulary.json`-tiedostoon ja vain
rakennuskohtaiset projektiot sekä tilitysasetukset
`processing/config/layers.json`-tiedostoon.
Pidä virheilmoituksessa aina mukana taso, odotettu arvo ja havaittu arvo.
