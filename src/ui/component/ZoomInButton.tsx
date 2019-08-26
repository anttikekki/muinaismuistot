import * as React from "react";

interface Props {
  onZoomIn: () => void;
}

export const ZoomInButton: React.FunctionComponent<Props> = ({ onZoomIn }) => {
  return (
    <div id="map-button-zoom-in" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title="Lähennä"
        onClick={() => onZoomIn()}
      >
        <span className="glyphicon glyphicon-plus" aria-hidden="true" />
      </button>
    </div>
  );
};
