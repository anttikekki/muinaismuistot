import * as React from "react"

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
              <code>geometry.type</code>
            </td>
            <td>
              Kohteen{" "}
              <a href="https://en.wikipedia.org/wiki/GeoJSON" target="_blank">
                GeoJSON
              </a>{" "}
              geometrian tyyppi
            </td>
            <td>
              <code>Point</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>geometry.coordinates</code>
            </td>
            <td>
              Kohteen koordinaatit{" "}
              <a href="https://epsg.io/3067" target="_blank">
                EPSG:3067
              </a>{" "}
              projektiossa muodossa <code>[x, y]</code> eli{" "}
              <code>[longitude, latitude]</code>. Tämä on aina sama kuin kohteen
              koordinaatit Museoviraston{" "}
              <a
                href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
                target="_blank"
              >
                Muinaisjäännösrekisterissä
              </a>
              .
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
            </td>
            <td>Taulukko numeroita</td>
          </tr>
          <tr>
            <td>
              <code>properties.id</code>
            </td>
            <td>
              Kohteen rekisteritunnus Museoviraston{" "}
              <a
                href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
                target="_blank"
              >
                Muinaisjäännösrekisterissä
              </a>
            </td>
            <td>
              esim. <code>1000011245</code>
            </td>
            <td>Numero</td>
          </tr>
          <tr>
            <td>
              <code>properties.number</code>
            </td>
            <td>
              Kohteen järjestysnumero kirjassa. Sama numero voi olla monella eri
              kohteella jos kirjan kohde koostuu monesta eri kiinteästä
              muinaisjäännöksestä.
            </td>
            <td>
              esim. <code>18</code>
            </td>
            <td>Numero</td>
          </tr>
          <tr>
            <td>
              <code>properties.name</code>
            </td>
            <td>
              Kohteen nimi kirjassa. Sama nimi voi olla monella eri kohteella
              jos kirjan kohde koostuu monesta eri kiinteästä
              muinaisjäännöksestä.
            </td>
            <td>
              esim.{" "}
              <code>
                Rikalan muinaislinna sekä rautakautiset asuinpaikat ja kalmistot
              </code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.registerName</code>
            </td>
            <td>
              Kiinteän muinaisjäännöksen nimi Museoviraston{" "}
              <a
                href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
                target="_blank"
              >
                Muinaisjäännösrekisterissä
              </a>
            </td>
            <td>
              esim. <code>Rikala Linnamäki</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.type</code>
            </td>
            <td>
              Kiinteän muinaisjäännöksen tyyppi Museoviraston{" "}
              <a
                href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
                target="_blank"
              >
                Muinaisjäännösrekisterissä
              </a>
            </td>
            <td>
              esim. <code>puolustusvarustukset</code> tai{" "}
              <code>asuinpaikat, hautapaikat, kirkkorakenteet</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.subtype</code>
            </td>
            <td>
              Kiinteän muinaisjäännöksen alatyyppi Museoviraston{" "}
              <a
                href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
                target="_blank"
              >
                Muinaisjäännösrekisterissä
              </a>
            </td>
            <td>
              esim. <code>muinaislinnat</code> tai{" "}
              <code>ei määritelty, kirkonpaikat</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.dating</code>
            </td>
            <td>
              Kiinteän muinaisjäännöksen ajoitus Museoviraston{" "}
              <a
                href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
                target="_blank"
              >
                Muinaisjäännösrekisterissä
              </a>
            </td>
            <td>
              esim. <code>rautakautinen</code> tai{" "}
              <code>keskiaikainen, rautakautinen</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.municipality</code>
            </td>
            <td>
              Kohteen kunta Museoviraston{" "}
              <a
                href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
                target="_blank"
              >
                Muinaisjäännösrekisterissä
              </a>
            </td>
            <td>
              esim. <code>Helsinki</code>
            </td>
            <td>Merkkijono</td>
          </tr>
          <tr>
            <td>
              <code>properties.region</code>
            </td>
            <td>Kohteen maakunta</td>
            <td>
              esim. <code>Varsinais-Suomi</code>
            </td>
            <td>Merkkijono</td>
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
        "coordinates": [283168.534, 6701699.597999999]
      },
      "properties": {
        "id": 73010022,
        "number": 18,
        "name": "Rikalan muinaislinna sekä rautakautiset asuinpaikat ja kalmistot",
        "municipality": "Halikko",
        "region": "Varsinais-Suomi",
        "registerName": "Rikala Linnamäki",
        "type": "puolustusvarustukset",
        "subtype": "muinaislinnat",
        "dating": "rautakautinen"
      }
    }`}
        </code>
      </pre>
    </>
  )
}
