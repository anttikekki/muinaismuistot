import * as React from "react";

export const DatabaseStructure: React.FC = () => {
  return (
    <>
      <h2 id="rakenne">Aineiston rakenne</h2>
      <p>
        Tietokanta sisältää seuraavat tiedot{" "}
        <a href="https://en.wikipedia.org/wiki/GeoJSON" target="_blank">
          GeoJSON
        </a>{" "}
        muodossa:
      </p>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Kentän nimi</th>
            <th>Tieto</th>
            <th>Esimerkki arvosta/arvolista</th>
            <th>Tyyppi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>properties.geometry.type</code>
            </td>
            <td>
              Kohteen{" "}
              <a href="https://en.wikipedia.org/wiki/GeoJSON" target="_blank">
                GeoJSON
              </a>{" "}
              geometrian tyyppi
            </td>
            <td>
              <code>Point</code> tai <code>Polygon</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.geometry.coordinates</code>
            </td>
            <td>
              Kohteen koordinaatit{" "}
              <a href="https://epsg.io/3067" target="_blank">
                EPSG:3067
              </a>{" "}
              projektiossa muodossa <code>[x, y]</code> eli{" "}
              <code>[longitude, latitude]</code>. Tämä on aina sama kuin kohteen
              koordinaatit Museoviraston tai Ahvenanmaan paikallishallinnon
              rekisterissä.
              <br />
              <br />
              Tämä EPSG:3067 projektio on dokumentoitu myös GeoJSON tiedostoston{" "}
              <code>crs</code>-kentässä:
              <br />
              <code>{`"crs": {
  "type": "EPSG",
  "properties": {
    "code": 3067
  }
},`}</code>
            </td>
            <td>
              <b>Point</b>
              <br />
              esim. <code>[393155.45770000014, 6680517.1086]</code>
              <br />
              <br />
              <b>Polygon</b>
              <br />
              esim.{" "}
              <code>
                {`[
        [
          [116179.91060000006, 6702449.6776],
          [116186.79839999974, 6702421.8038],
          [116179.91060000006, 6702449.6776]
        ]
      ]`}
              </code>
            </td>
            <td>Taulukko numeroita</td>
          </tr>
          <tr>
            <td>
              <code>properties.registryItem.name</code>
            </td>
            <td>
              Kohteen nimi Museoviraston tai Ahvenanmaan paikallishallinnon
              rekisterissä
            </td>
            <td>
              esim. <code>Tukikohta IV:10 (Kivikko)</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.registryItem.type</code>
            </td>
            <td>
              Kohteen tyyppi Museoviraston tai Ahvenanmaan paikallishallinnon
              rekisterissä
            </td>
            <td>
              Tyypin nimi tulee rekisterin avoimen paikkatietoaineiston
              kartttatasosta. <br />
              <br />
              Museoviraston aineistot:
              <ul>
                <li>
                  <a
                    href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/0"
                    target="_blank"
                  >
                    Muinaisjäännökset_piste
                  </a>
                </li>
                <li>
                  <a
                    href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/1"
                    target="_blank"
                  >
                    Muinaisjäännökset_alue
                  </a>
                </li>
                <li>
                  <a
                    href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/2"
                    target="_blank"
                  >
                    Suojellut_rakennukset_piste
                  </a>
                </li>
                <li>
                  <a
                    href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/3"
                    target="_blank"
                  >
                    Suojellut_rakennukset_alue
                  </a>
                </li>
                <li>
                  <a
                    href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/4"
                    target="_blank"
                  >
                    RKY_alue
                  </a>
                </li>
                <li>
                  <a
                    href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/5"
                    target="_blank"
                  >
                    RKY_piste
                  </a>
                </li>
                <li>
                  <a
                    href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/6"
                    target="_blank"
                  >
                    RKY_viiva
                  </a>
                </li>
                <li>
                  <a
                    href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/7"
                    target="_blank"
                  >
                    Maailmanperintö_piste
                  </a>
                </li>
                <li>
                  <a
                    href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/8"
                    target="_blank"
                  >
                    Maailmanperintö_alue
                  </a>
                </li>
              </ul>
              <br />
              Ahvenanmaan paikallishallinnon aineisto:
              <ul>
                <li>
                  <a
                    href="https://www.kartor.ax/datasets/fornminnen"
                    target="_blank"
                  >
                    Fornminnen
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.kartor.ax/datasets/maritimt-kulturarv-vrak"
                    target="_blank"
                  >
                    Maritimt kulturarv; Vrak
                  </a>
                </li>
              </ul>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.registryItem.id</code>
            </td>
            <td>
              Kohteen id Museoviraston tai Ahvenanmaan paikallishallinnon
              rekisterissä
            </td>
            <td>
              esim. <code>1000011245</code>
            </td>
            <td>Numero</td>
          </tr>
          <tr>
            <td>
              <code>properties.registryItem.url</code>
            </td>
            <td>
              Linkki kohteen tietoihin Museoviraston tai Ahvenanmaan
              paikallishallinnon rekisterissä
            </td>
            <td>
              esim.{" "}
              <a
                href="https://www.kyppi.fi/to.aspx?id=112.100001124"
                target="_blank"
              >
                https://www.kyppi.fi/to.aspx?id=112.100001124
              </a>
            </td>
            <td>
              <a href="https://en.wikipedia.org/wiki/URL" target="_blank">
                URL
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <code>properties.registryItem.municipality</code>
            </td>
            <td>Kohteen kunta</td>
            <td>
              esim. <code>Helsinki</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.model.name</code>
            </td>
            <td>
              3D-mallin nimi. Tämä tulisi olla tässä suomeksi vaikka mallin nimi
              olisi Sketchfabissa englanniksi.
            </td>
            <td>
              esim. <code>Syvä juoksuhauta</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.model.url</code>
            </td>
            <td>3D-mallin osoite Sketchfab-palvelussa.</td>
            <td>
              esim.{" "}
              <a
                href="https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd"
                target="_blank"
              >
                https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd
              </a>
            </td>
            <td>
              <a href="https://en.wikipedia.org/wiki/URL" target="_blank">
                URL
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <code>properties.author</code>
            </td>
            <td>3D-mallin tekijän nimi.</td>
            <td>
              esim. <code>Museovirasto</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.authorUrl</code>
            </td>
            <td>3D-mallin tekijän profiili Sketchfab-palvelussa.</td>
            <td>
              esim.{" "}
              <a href="https://sketchfab.com/MuseovirastoMeriarkeologia">
                https://sketchfab.com/MuseovirastoMeriarkeologia
              </a>
            </td>
            <td>
              <a href="https://en.wikipedia.org/wiki/URL" target="_blank">
                URL
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <code>properties.licence</code>
            </td>
            <td>3D-mallin lisenssin nimi.</td>
            <td>
              esim. <code>CC BY 4.0</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.licenceUrl</code>
            </td>
            <td>Osoite 3D-mallin lisenssiin.</td>
            <td>
              esim.{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/deed.fi"
                target="_blank"
              >
                https://creativecommons.org/licenses/by/4.0/deed.fi
              </a>
            </td>
            <td>
              <a href="https://en.wikipedia.org/wiki/URL" target="_blank">
                URL
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <code>properties.createdDate</code>
            </td>
            <td>
              Päivämäärä jolloin 3D-malli on lisätty tähän tietokantaan. Tämän
              perusteella voi etsiä uusimman päivämäärän eli päivän jolloin
              tietokantaa on viiemksi päivitetty.
            </td>
            <td>
              esim. <code>2020-03-11</code>
            </td>
            <td>
              <a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank">
                ISO 8601
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <p>Esimerkki GeoJSON-featuresta:</p>
      <pre>
        <code>
          {`    {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [393155.45770000014, 6680517.1086]
    },
    "properties": {
      "registryItem": {
        "name": "Tukikohta IV:10 (Kivikko)",
        "id": 1000011245,
        "type": "Muinaisjäännökset_piste",
        "url": "https://www.kyppi.fi/to.aspx?id=112.1000011245",
        "municipality": "Helsinki"
      },
      "model": {
        "name": "Syvä juoksuhauta",
        "url": "https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd"
      },
      "author": "Antti Kekki",
      "authorUrl": "https://sketchfab.com/antti.kekki",
      "licence": "CC BY 4.0",
      "licenceUrl": "https://creativecommons.org/licenses/by/4.0/deed.fi",
      "createdDate": "2020-03-11"
    }
  }`}
        </code>
      </pre>
    </>
  );
};
