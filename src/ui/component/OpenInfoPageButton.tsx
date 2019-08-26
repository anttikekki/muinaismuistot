import * as React from "react";

interface Props {
  showInfoPage: () => void;
}

export const ShowInfoPageButton: React.FunctionComponent<Props> = ({
  showInfoPage
}) => {
  return (
    <div id="map-button-info" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title="Ohjeita sivuston käyttöön"
        onClick={() => showInfoPage()}
      >
        <span className="glyphicon glyphicon-info-sign" aria-hidden="true" />
      </button>
    </div>
  );
};
