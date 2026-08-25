# Updater

Tähän moduuliin toteutetaan päivittäisen päivityksen Cloudflare-orkestrointi:

- ajastettu Workflow ja manuaalinen käynnistys
- lyhytikäisen rakennuskontin määritys
- `processing`- ja `deploy`-moduulien suoritus
- onnistumisen, virheen ja aktiivisen version tilan seuranta

Kontin rakennuskontekstina käytetään `infra/museovirasto-map-data`-hakemistoa,
jotta image voi kopioida `contract`-, `processing`- ja `deploy`-moduulit ilman
pää-Workeria tai PoC-sovellusta. Tätä moduulia ei vielä ajeta tuotannossa.
