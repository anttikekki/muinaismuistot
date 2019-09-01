import * as React from "react";

interface Props {
  onClick: () => void;
}

export const OpenSearchPageButton: React.FunctionComponent<Props> = ({
  onClick
}) => {
  return (
    <div id="map-button-search" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title="Hae kohteita"
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-search" aria-hidden="true" />
      </button>
    </div>
  );
};
