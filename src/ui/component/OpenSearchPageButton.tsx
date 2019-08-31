import * as React from "react";

interface Props {
  showSearchPage: () => void;
}

export const OpenSearchPageButton: React.FunctionComponent<Props> = ({
  showSearchPage
}) => {
  return (
    <div id="map-button-search" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title="Hae kohteita"
        onClick={() => showSearchPage()}
      >
        <span className="glyphicon glyphicon-search" aria-hidden="true" />
      </button>
    </div>
  );
};
