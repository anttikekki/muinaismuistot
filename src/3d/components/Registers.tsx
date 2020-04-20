import * as React from "react";

export const Registers: React.FC = () => {
  return (
    <>
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
        <li>
          <a
            href="https://www.regeringen.ax/kulturarv/arkeologi-fornlamningar/marinarkeologi"
            target="_blank"
          >
            Merellisen kulttuuriperinnön rekisteri
          </a>
        </li>
      </ul>
    </>
  );
};
