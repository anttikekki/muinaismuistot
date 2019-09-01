import * as React from "react";

interface Props {
  onClick: () => void;
}

export const CenterToCurrentPositionButton: React.FunctionComponent<Props> = ({
  onClick
}) => {
  return (
    <div id="map-button-position" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title="Keskitä kartta nykyiseen sijaintiisi"
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-screenshot" aria-hidden="true" />
      </button>
    </div>
  );
};
