import * as React from "react";

interface Props {
  onClick: () => void;
}

export const ZoomOutButton: React.FunctionComponent<Props> = ({ onClick }) => {
  return (
    <div id="map-button-zoom-out" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title="Loitonna"
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-minus" aria-hidden="true" />
      </button>
    </div>
  );
};
