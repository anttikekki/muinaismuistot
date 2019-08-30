import "bootstrap/dist/css/bootstrap.css";
import "../css/muinaismuistot.css";
import * as React from "react";
import { InfoPage } from "./page/InfoPage";
import { LoadingAnimation } from "./component/LoadingAnimation";
import { ZoomInButton } from "./component/ZoomInButton";
import { ZoomOutButton } from "./component/ZoomOutButton";
import { CenterToCurrentPositionButton } from "./component/CenterToCurrentPositionButton";
import { ShowInfoPageButton } from "./component/OpenInfoPageButton";
import { ArgisFeature } from "../data";
import { FeatureDetailsPage } from "./page/featureDetailsPage/FeatureDetailsPage";

export enum Page {
  Search = "searchPage",
  Info = "infoPage",
  Settings = "settingsPage",
  Details = "detailsPage"
}

interface Props {
  isLoading: boolean;
  visiblePage?: Page;
  selectedFeatures?: Array<ArgisFeature>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenterToCurrentPositions: () => void;
  showPage: (page: Page) => void;
  hidePage: () => void;
}

export const UI: React.FunctionComponent<Props> = ({
  isLoading,
  visiblePage,
  selectedFeatures,
  onZoomIn,
  onZoomOut,
  onCenterToCurrentPositions,
  showPage,
  hidePage
}) => {
  return (
    <div>
      <LoadingAnimation visible={isLoading} />
      <ZoomInButton onZoomIn={onZoomIn} />
      <ZoomOutButton onZoomOut={onZoomOut} />
      <CenterToCurrentPositionButton
        onCenterToCurrentPositions={onCenterToCurrentPositions}
      />

      <div id="map-button-search" className="map-button">
        <button type="button" className="btn btn-primary" title="Hae kohteita">
          <span className="glyphicon glyphicon-search" aria-hidden="true" />
        </button>
      </div>

      <ShowInfoPageButton showInfoPage={() => showPage(Page.Info)} />

      <div id="map-button-settings" className="map-button">
        <button
          type="button"
          className="btn btn-primary"
          title="Kartan asetukset"
        >
          <span className="glyphicon glyphicon-cog" aria-hidden="true" />
        </button>
      </div>

      <FeatureDetailsPage
        visible={visiblePage === Page.Details}
        hidePage={hidePage}
        features={selectedFeatures}
      />
      <InfoPage visible={visiblePage === Page.Info} hidePage={hidePage} />
    </div>
  );
};
