import * as React from "react";

interface Props {
  onZoomOut: () => void;
}

export const ZoomOutButton: React.FunctionComponent<Props> = ({
  onZoomOut
}) => {
  return (
    <div id="map-button-zoom-out" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title="Loitonna"
        onClick={() => onZoomOut()}
      >
        <span className="glyphicon glyphicon-minus" aria-hidden="true" />
      </button>
    </div>
  );
};
