import "bootstrap/dist/css/bootstrap.css";
import "../css/muinaismuistot.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ArgisFeature, MuseovirastoLayerId } from "../data";
import Settings from "../Settings";
import { LoadingAnimation } from "./component/LoadingAnimation";
import { ZoomInButton } from "./component/ZoomInButton";
import { ZoomOutButton } from "./component/ZoomOutButton";
import { CenterToCurrentPositionButton } from "./component/CenterToCurrentPositionButton";
import { ShowInfoPageButton } from "./component/OpenInfoPageButton";
import { FeatureDetailsPage } from "./page/featureDetailsPage/FeatureDetailsPage";
import { SearchPage } from "./page/searchPage/SearchPage";
import { InfoPage } from "./page/infoPage/InfoPage";
import { OpenSearchPageButton } from "./component/OpenSearchPageButton";

enum PageId {
  Search = "searchPage",
  Info = "infoPage",
  Settings = "settingsPage",
  Details = "detailsPage"
}

export interface EventListeners {
  searchFeatures: (searchText: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerToCurrentPositions: () => void;
}

export default class MuinaismuistotUI {
  private visiblePage?: PageId;
  private selectedFeatures?: Array<ArgisFeature>;
  private searchResultFeatures?: Array<ArgisFeature>;
  private loadingAnimationTimeoutID?: number;
  private loadingAnimationCounter = 0;
  private eventListeners: EventListeners;

  public constructor(settings: Settings, eventListeners: EventListeners) {
    this.eventListeners = eventListeners;
    this.renderUI();
    /*


    settingsPage = new SettingsPage(settings, {
      hidePage: function() {
        hidePage("settingsPage");
      }
    });

    $("#map-button-search").on("click", function() {
      showPage("searchPage");
    });

    $("#map-button-settings").on("click", function() {
      showPage("settingsPage");
    });
    */
  }

  private renderUI = () => {
    const isLoading = this.loadingAnimationCounter > 0;
    const {
      zoomIn,
      zoomOut,
      centerToCurrentPositions,
      searchFeatures
    } = this.eventListeners;

    ReactDOM.render(
      <>
        <LoadingAnimation visible={isLoading} />
        <ZoomInButton onZoomIn={zoomIn} />
        <ZoomOutButton onZoomOut={zoomOut} />
        <CenterToCurrentPositionButton
          onCenterToCurrentPositions={centerToCurrentPositions}
        />
        <OpenSearchPageButton
          showSearchPage={() => this.showPage(PageId.Search)}
        />
        <ShowInfoPageButton showInfoPage={() => this.showPage(PageId.Info)} />

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
          visible={this.visiblePage === PageId.Details}
          hidePage={this.hidePage}
          features={this.selectedFeatures}
        />
        <SearchPage
          visible={this.visiblePage === PageId.Search}
          hidePage={this.hidePage}
          searchFeatures={searchFeatures}
          searchResultFeatures={this.searchResultFeatures}
        />
        <InfoPage
          visible={this.visiblePage === PageId.Info}
          hidePage={this.hidePage}
        />
      </>,
      document.getElementById("ui")
    );
  };

  private showPage = (page: PageId) => {
    this.visiblePage = page;
    this.renderUI();
  };

  private hidePage = () => {
    this.visiblePage = undefined;
    this.renderUI();
  };

  public showLoadingAnimation = (show: boolean) => {
    const oldCounterValue = this.loadingAnimationCounter;
    if (show) {
      this.loadingAnimationCounter++;
    } else {
      this.loadingAnimationCounter--;
    }

    if (oldCounterValue === 0 && this.loadingAnimationCounter === 1) {
      this.loadingAnimationTimeoutID = window.setTimeout(() => {
        if (this.loadingAnimationTimeoutID) {
          this.renderUI();
        }
      }, 300);
    }

    if (oldCounterValue === 1 && this.loadingAnimationCounter === 0) {
      window.clearTimeout(this.loadingAnimationTimeoutID);
      this.loadingAnimationTimeoutID = undefined;
      this.renderUI();
    }
  };

  public muinaisjaannosFeaturesSelected = (
    selectedFeatures: Array<ArgisFeature>
  ) => {
    this.selectedFeatures = selectedFeatures;
    this.visiblePage = PageId.Details;
    this.renderUI();
  };

  public featureSearchReady = (features: Array<ArgisFeature>) => {
    this.searchResultFeatures = features;
    this.renderUI();
  };

  public visibleMuinaismuistotLayersChanged = (
    selectedLayerIds: Array<MuseovirastoLayerId>
  ) => {
    //this.settingsPage.setVisibleMuinaismuistotLayers(selectedLayerIds);
  };
}
