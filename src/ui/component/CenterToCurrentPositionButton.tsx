import * as React from "react";

interface Props {
  onCenterToCurrentPositions: () => void;
}

export const CenterToCurrentPositionButton: React.FunctionComponent<Props> = ({
  onCenterToCurrentPositions
}) => {
  return (
    <div id="map-button-position" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title="Keskitä kartta nykyiseen sijaintiisi"
        onClick={() => onCenterToCurrentPositions()}
      >
        <span className="glyphicon glyphicon-screenshot" aria-hidden="true" />
      </button>
    </div>
  );
};
