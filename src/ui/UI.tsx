import "bootstrap/dist/css/bootstrap.css";
import "../css/muinaismuistot.css";
import * as React from "react";

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenterToCurrentPositions: () => void;
}

interface State {}

export class UI extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <div id="map-button-zoom-in" className="map-button">
          <button
            type="button"
            className="btn btn-primary"
            title="Lähennä"
            onClick={() => this.props.onZoomIn()}
          >
            <span className="glyphicon glyphicon-plus" aria-hidden="true" />
          </button>
        </div>

        <div id="map-button-zoom-out" className="map-button">
          <button
            type="button"
            className="btn btn-primary"
            title="Loitonna"
            onClick={() => this.props.onZoomOut()}
          >
            <span className="glyphicon glyphicon-minus" aria-hidden="true" />
          </button>
        </div>

        <div id="map-button-position" className="map-button">
          <button
            type="button"
            className="btn btn-primary"
            title="Keskitä kartta nykyiseen sijaintiisi"
            onClick={() => this.props.onCenterToCurrentPositions()}
          >
            <span
              className="glyphicon glyphicon-screenshot"
              aria-hidden="true"
            />
          </button>
        </div>

        <div id="map-button-search" className="map-button">
          <button
            type="button"
            className="btn btn-primary"
            title="Hae kohteita"
          >
            <span className="glyphicon glyphicon-search" aria-hidden="true" />
          </button>
        </div>

        <div id="map-button-info" className="map-button">
          <button
            type="button"
            className="btn btn-primary"
            title="Ohjeita sivuston käyttöön"
          >
            <span
              className="glyphicon glyphicon-info-sign"
              aria-hidden="true"
            />
          </button>
        </div>

        <div id="map-button-settings" className="map-button">
          <button
            type="button"
            className="btn btn-primary"
            title="Kartan asetukset"
          >
            <span className="glyphicon glyphicon-cog" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }
}
