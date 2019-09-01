import * as React from "react";

interface Props {
  onClick: () => void;
}

export const ZoomInButton: React.FunctionComponent<Props> = ({ onClick }) => {
  return (
    <div id="map-button-zoom-in" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title="Lähennä"
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-plus" aria-hidden="true" />
      </button>
    </div>
  );
};
