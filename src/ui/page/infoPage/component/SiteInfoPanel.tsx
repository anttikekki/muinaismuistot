import * as React from "react";
import { Panel } from "../../../component/Panel";

export const SiteInfoPanel: React.FC = () => {
  return (
    <Panel title="Tietoa sivustosta">
      <p>Tällä sivustolla näet kartalla seuraavien rekisterien tiedot:</p>

      <h5>Museovirasto</h5>
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

      <h5>Ahvenamaan paikallishallinto</h5>
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

      <p>
        Kaikki näytettävät kohteet ovat avointa dataa ja haettu rekisterin
        ylläpitäjän tarjoamasta karttapalvelusta.
      </p>

      <p>
        Kohteista saa lisätietoikkunan näkyviin klikkaamalla kohdetta kartalla.
        Tästä näkymästä on myös linkki kohteen lisätietoihin rekisterin
        ylläpitäjän sivustolla. Kohteen otsikon vieressä olevasta kuvakkeesta (
        <span className="glyphicon glyphicon-link" aria-hidden="true" />) saa
        talteen pysyvän linkin kohteen sijaintiin kartalla.
      </p>

      <h5>3D-mallit</h5>
      <p>
        Joillekin kohteille on saataville myös 3D-malleja{" "}
        <a href="./3d/" target="_blank">
          tietokannasta
        </a>
        , joka listaa harrastajien sekä virallisen toimijoiden (museot,
        Museovirasto, Ahvenanmaan paikallioshallinto) tekemiä 3D-mallinnuksia{" "}
        <a href="https://sketchfab.com" target="_blank">
          Sketchfab
        </a>{" "}
        -palvelusta.
      </p>

      <h5>Paikannus</h5>
      <p>
        Kartta keskitetään oletuksena nykyiseen sijaintiisi jos annat selaimelle
        luvan luovuttaa se tieto. Keskityksen nykyiseen sijaintiin voi suorittaa
        myös myöhemmin{" "}
        <span className="glyphicon glyphicon-screenshot" aria-hidden="true" />{" "}
        painikkeesta.
      </p>

      <h5>Haku</h5>
      <p>
        Museoviraston rekisterien kohteita pystyy hakemaan nimen perusteella
        hakunäkymässä (
        <span className="glyphicon glyphicon-search" aria-hidden="true" />
        ). Hakutuloksen klikkaaminen keskittää kartan kohteeseen ja lisää siihen
        paikkamerkin <img src="images/map-pin-small.png" />.
      </p>

      <h5>Asetukset</h5>
      <p>
        Pohjakartan voi vaihtaa taustakartan ja maastokartan välillä asetuksista
        (
        <span className="glyphicon glyphicon-cog" aria-hidden="true" />
        ). Samasta näkymästä voi piilottaa Museoviraston rekisterien kohteita
        tyypin ja muinaisjäännöksiä myös ajoituksen mukaan jos haluaa
        tarkastella esimerkiksi pelkästään muinaisjäännöksiä rautakaudelta.
      </p>

      <p>
        Palautetta sivustosta otetaan mielellään vastaan osoitteeseen{" "}
        <a href="mailto:antti.kekki@gmail.com">antti.kekki@gmail.com</a>
      </p>
    </Panel>
  );
};
