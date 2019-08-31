import * as React from "react";

interface Props {
  onClick: () => void;
}

export const OpenSettingsPage: React.FunctionComponent<Props> = ({
  onClick
}) => {
  return (
    <div id="map-button-settings" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title="Kartan asetukset"
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-cog" aria-hidden="true" />
      </button>
    </div>
  );
};
