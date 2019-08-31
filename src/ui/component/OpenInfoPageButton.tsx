import * as React from "react";

interface Props {
  onClick: () => void;
}

export const ShowInfoPageButton: React.FunctionComponent<Props> = ({
  onClick
}) => {
  return (
    <div id="map-button-info" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title="Ohjeita sivuston käyttöön"
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-info-sign" aria-hidden="true" />
      </button>
    </div>
  );
};
