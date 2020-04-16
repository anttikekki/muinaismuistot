import "bootstrap/dist/css/bootstrap.min.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ModelsTable } from "./components/ModelsTable";

ReactDOM.render(
  <>
    <div className="jumbotron">
      <div className="container">
        <h1>Kulttuuriperinnön 3D-mallien tietokanta</h1>

        <p>
          Tämä tietokanta yrittää kerätä arkeologisesta kulttuuriperinnöstä ja
          rakennetuista kulttuuriympäristöistä tehtyjä 3D-malleja yhteen
          paikkaan helposti käytettävänä paikkatietoaineistona.
        </p>
      </div>
    </div>
    <div className="container">
      <h2>Sisällys</h2>
      <ol>
        <li>
          <a href="#tarkoitus">Tietokannan tarkoitus</a>
        </li>

        <li>
          <a href="#rekisterit">
            Rekisterit joiden kohteisiin 3D-malleja on linkitetty
          </a>
        </li>
        <li>
          <a href="#rakenne">Aineiston rakenne</a>
        </li>
        <li>
          <a href="#lataus">Aineiston lataus</a>
        </li>
        <li>
          <a href="#lisenssit">3D-mallien lisenssit</a>
        </li>
        <li>
          <a href="#yllapito">Ylläpito</a>
        </li>
        <li>
          <a href="#listaus">Aineston listaus</a>
        </li>
      </ol>

      <h2 id="Tietokannan-tarkoitus">Tietokannan tarkoitus</h2>
      <p>
        Museot, Museovirasto, Ahvenanmaan paikallishallinto ja harrastajat ovat
        julkaisseet 3D-malleja arkeologisista- ja rakennusperintökohteista{" "}
        <a href="https://sketchfab.com">Sketchfab</a>
        -sivustolla mutta niitä on vaikea löytää ja listata. Lisäksi ne eivät
        linkity helposti Museoviraston ja Ahvenanmaan paikallishallinnon
        rekistereihin tai niistä koostettuihin avoimiin paikkatietoaineistoihin
        joten malleja ei saa mitenkään helposti kartalle. Tämä tietokanta
        yrittää korjata tämän ongelman.
      </p>

      <p>
        Tässä tietokannassa Sketchfab-palvelussa oleva 3D-malli linkitetään
        Museoviraston ja Ahvenanmaan paikallishallinnon rekisterien kohteisiin
        ja sijaintiin kartalla. Tällöin tämän linkityksen avulla pystyy
        vastaamaan seuraaviin kysymyksiin:
      </p>
      <ol>
        <li>
          Onko rekisterin kohteella julkisesti saatavilla olevia 3D-malleja?
        </li>
        <li>Mitä rekisterin kohdetta Sketchfabissa oleva 3D-malli esittää?</li>
        <li>Missä sijainnissa kartalla 3D-mallin esittämä kohde on?</li>
      </ol>

      <h2 id="rekisterit">
        Rekisterit joiden kohteisiin 3D-malleja on linkitetty
      </h2>
      <b>Museovirasto</b>
      <ul>
        <li>
          <a
            href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
            target="_blank"
          >
            Muinaisjäännösrekisteri
          </a>
        </li>
        <li>
          <a
            href="https://www.kyppi.fi/palveluikkuna/rapea/read/asp/r_default.aspx"
            target="_blank"
          >
            Rakennusperintörekisteri
          </a>
        </li>
        <li>
          <a
            href="https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa"
            target="_blank"
          >
            Maailmanperintökohteet
          </a>
        </li>
        <li>
          <a href="http://www.rky.fi/" target="_blank">
            Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt
          </a>
        </li>
      </ul>

      <b>Ahvenamaan paikallishallinto</b>
      <ul>
        <li>
          <a
            href="http://www.regeringen.ax/kulturarv/arkeologi-fornlamningar/fornlamningsregistret"
            target="_blank"
          >
            Muinaisjäännösrekisteri
          </a>
        </li>
      </ul>

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
              Tällä hetkellä aina <code>Point</code>
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
              <code>[393155.45770000014, 6680517.1086]</code>
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
            <td>Tukikohta IV:10 (Kivikko)</td>
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
                  <a href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/0">
                    Muinaisjäännökset_piste
                  </a>
                </li>
                <li>
                  <a href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/1">
                    Muinaisjäännökset_alue
                  </a>
                </li>
                <li>
                  <a href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/2">
                    Suojellut_rakennukset_piste
                  </a>
                </li>
                <li>
                  <a href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/3">
                    Suojellut_rakennukset_alue
                  </a>
                </li>
                <li>
                  <a href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/4">
                    RKY_alue
                  </a>
                </li>
                <li>
                  <a href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/5">
                    RKY_piste
                  </a>
                </li>
                <li>
                  <a href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/6">
                    RKY_viiva
                  </a>
                </li>
                <li>
                  <a href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/7">
                    Maailmanperintö_piste
                  </a>
                </li>
                <li>
                  <a href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/8">
                    Maailmanperintö_alue
                  </a>
                </li>
              </ul>
              <br />
              Ahvenanmaan paikallishallinnon aineisto:
              <ul>
                <li>
                  <a href="https://www.kartor.ax/datasets/fornminnen">
                    Fornminnen
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
            <td>1000011245</td>
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
              <a
                href="https://www.kyppi.fi/to.aspx?id=112.100001124"
                target="_blank"
              >
                https://www.kyppi.fi/to.aspx?id=112.100001124
              </a>
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
            <td>Syvä juoksuhauta</td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.model.url</code>
            </td>
            <td>3D-mallin osoite Sketchfab-palvelussa.</td>
            <td>
              <a
                href="https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd"
                target="_blank"
              >
                https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd
              </a>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.author</code>
            </td>
            <td>3D-mallin tekijän nimi.</td>
            <td></td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.licence</code>
            </td>
            <td>3D-mallin lisenssin nimi.</td>
            <td>CC BY 4.0</td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.licenceUrl</code>
            </td>
            <td>Osoite 3D-mallin lisenssiin.</td>
            <td>
              <a
                href="https://creativecommons.org/licenses/by/4.0/deed.fi"
                target="_blank"
              >
                https://creativecommons.org/licenses/by/4.0/deed.fi
              </a>
            </td>
            <td>Merkkijono</td>
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
            <td>2020-03-11</td>
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
          "url": "https://www.kyppi.fi/to.aspx?id=112.1000011245"
        },
        "model": {
          "name": "Syvä juoksuhauta",
          "url": "https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd"
        },
        "author": "Antti Kekki",
        "licence": "CC BY 4.0",
        "licenceUrl": "https://creativecommons.org/licenses/by/4.0/deed.fi",
        "createdDate": "2020-03-11"
      }
    }`}
        </code>
      </pre>

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

      <h2 id="lisenssit">3D-mallien lisenssit</h2>
      <p>
        Tekijä on määritellyt Sketchfab-palvelussa mallille käyttölisenssin.
        Tämä tieto on mukana tietokannassa.
      </p>

      <h2 id="yllapito">Ylläpito</h2>
      <p>
        Tätä tietokantaa ylläpitää Antti Kekki. Voit ilmoittaa uuden mallin
        tietokantaan lähettämällä sähköpostia osoitteeseen{" "}
        <a href="mailto:antti.kekki@gmail.com">antti.kekki@gmail.com</a>. Myös
        yhteydeotot ja kyselyt samaan osoitteeseen.
      </p>

      <h2 id="listaus">Aineston listaus</h2>
      <p>
        Tässä listattu koko tietokannan sisältö. Kaikki tämän taulukon tiedot
        löytyvät suoraan tietokannasta. Kohteen nimi on linkki suoraan
        Museoviraston ja Ahvenanmaan paikallishallinnon rekisteriin. Mallin nimi
        on linkki 3D-malliin{" "}
        <a href="https://sketchfab.com" target="_blank">
          Sketchfab
        </a>
        -sivustolla.
      </p>
      <p>
        Tämän aineston näkee kartalla{" "}
        <a href="https://muinaismuistot.info" target="_blank">
          muinaismuistot.info
        </a>{" "}
        -sivustolta.
      </p>
      <ModelsTable />
    </div>
  </>,
  document.getElementById("root")
);
