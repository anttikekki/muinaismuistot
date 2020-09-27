import * as React from "react";
import { ModelFeatureProperties } from "../../../../common/types";

interface Props {
  models?: Array<ModelFeatureProperties>;
}

export const Info: React.FC = () => {
  const [infoOpen, setInfoOpen] = React.useState(false);

  const onInfoHeadingClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    setInfoOpen(!infoOpen);
  };

  return (
    <div className="panel panel-default">
      <div className="panel-heading feature-collapse-panel-heading" role="tab">
        <a role="button" href="" onClick={onInfoHeadingClick}>
          <span
            className="glyphicon glyphicon-info-sign"
            aria-hidden="true"
          ></span>{" "}
          Lisätietoa 3D-malleista
        </a>
      </div>
      <div
        className={`panel-collapse collapse ${infoOpen ? "in" : ""}`}
        role="tabpanel"
      >
        <div className="panel-body">
          <p>
            Nämä 3D-mallit ovat{" "}
            <a href="./3d/" target="_blank">
              tietokannasta
            </a>
            , joka listaa harrastajien sekä virallisen toimijoiden (museot,
            Museovirasto, Ahvenanmaan paikallioshallinto) tekemiä
            3D-mallinnuksia{" "}
            <a href="https://sketchfab.com" target="_blank">
              Sketchfab
            </a>{" "}
            -palvelusta.
          </p>
          <p>
            Mallit saa käynnistettyä nuolipainikkeesta. Käynnistymisen jälkeen
            mallin saa koko ruudun tilaan oikean alareunan{" "}
            <img src="images/sketchfab-fullscreen.png" /> painikkeesta tai
            painamalla näppäimistöltä <kbd>f</kbd> painiketta.
          </p>
          <p>Mallin ohjaus:</p>
          <ul>
            <li>
              <b>Kääntäminen:</b> pidä vasen hiirenpainike pohjaan painettuna ja
              liikuta hiirtä. Kosketusnäytöillä pidä sormi painettuna ja liikuta
              sormea.
            </li>
            <li>
              <b>Suurennus ja pienennys:</b> käytä hiiren rullaa.
              Kosketusnäytöillä käytä kahden sormen nipistyselettä.
            </li>
            <li>
              <b>Kohdistuksen siirtäminen:</b> pidä oikea hiirenpainike pohjaan
              painettuna ja liikuta hiirtä. Kosketusnäytöillä pidä kaksi sormea
              painettuna ja liikuta sormia.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const EmbeddedModels: React.FC<Props> = ({ models = [] }) => {
  if (models.length === 0) {
    return null;
  }

  return (
    <>
      <br />
      <h4>Kohteen 3D-mallit</h4>

      <Info />

      {models.map((model) => (
        <div className="form-group" key={model.model.url}>
          <label>{model.model.name}</label>
          <iframe
            title={model.model.name}
            width="100%"
            height="400"
            src={`${model.model.url}/embed`}
            allow="fullscreen"
            allowFullScreen={true}
          />
        </div>
      ))}
    </>
  );
};
