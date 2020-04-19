import * as React from "react";

export const Download: React.FC = () => {
  return (
    <>
      <h2 id="lataus">Aineiston lataus</h2>
      <p>
        Tietokanta on koostettu{" "}
        <a href="https://en.wikipedia.org/wiki/GeoJSON" target="_blank">
          GeoJSON
        </a>{" "}
        muodossa, jolloin sitä helppo käyttää eri paikkatietotyökaluilla ja
        karttasovelluskehyksillä (kuten{" "}
        <a
          href="https://openlayers.org/en/latest/examples/geojson.html"
          target="_blank"
        >
          OpenLayers
        </a>{" "}
        ja{" "}
        <a href="https://leafletjs.com/examples/geojson/" target="_blank">
          Leaflet
        </a>
        ).
      </p>

      <div className="well">
        Lataa aineisto:{" "}
        <a href="https://muinaismuistot.info/3d/3d.json">
          https://muinaismuistot.info/3d/3d.json
        </a>
      </div>

      <p>
        Aineistoa voi myös käyttää suoraan yllä olevasta osoitteesta (eli esim.
        että selaimessa avautuva karttasovellus lataa aineiston suoraan tältä
        sivulta). Palvelin palauttaa ladattaessa aineiston{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag"
          target="_blank"
        >
          Etag
        </a>
        -otsakkeen joten ainakin selaimet osaavat ladata aineistosta aina
        uusimman version. Lisäksi palvelin palauttaa{" "}
        <code>access-control-allow-origin: *</code>{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
          target="_blank"
        >
          CORS
        </a>
        -otsakkeen joten selain pystyy käyttämään aineistoa toisesta
        domain-osoitteesta.
      </p>
    </>
  );
};
