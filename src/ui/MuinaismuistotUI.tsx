import * as React from "react";
import * as ReactDOM from "react-dom";
import { ArgisFeature, MuseovirastoLayerId } from "../data";
import Settings from "../Settings";
import { UI, Page } from "./UI";

export interface EventListeners {
  searchMuinaismuistoja: (
    searchText: string,
    callbackFn: (features: Array<ArgisFeature>) => void
  ) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerToCurrentPositions: () => void;
}

export default class MuinaismuistotUI {
  private visiblePage?: Page;
  private selectedFeatures?: Array<ArgisFeature>;
  private loadingAnimationTimeoutID?: number;
  private loadingAnimationCounter = 0;
  private eventListeners: EventListeners;

  public constructor(settings: Settings, eventListeners: EventListeners) {
    this.eventListeners = eventListeners;
    this.renderUI();
    //this.featureParser = new FeatureParser(settings);
    /*
    detailsPage = new FeatureDetailsPage(
      featureParser,
      settings,
      urlHashHelper,
      {
        hidePage: function() {
          hidePage("detailsPage");
        }
      }
    );

    settingsPage = new SettingsPage(settings, {
      hidePage: function() {
        hidePage("settingsPage");
      }
    });

    searchPage = new SearchPage(featureParser, settings, urlHashHelper, {
      hidePage: function() {
        hidePage("searchPage");
      },
      searchResultItemClicked: function() {
        hidePage("searchPage");
      },
      searchMuinaismuistoja: function(searchText, callbackFn) {
        eventListeners.searchMuinaismuistoja(searchText, callbackFn);
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
    ReactDOM.render(
      <UI
        isLoading={this.loadingAnimationCounter > 0}
        visiblePage={this.visiblePage}
        selectedFeatures={this.selectedFeatures}
        onZoomIn={this.eventListeners.zoomIn}
        onZoomOut={this.eventListeners.zoomOut}
        onCenterToCurrentPositions={
          this.eventListeners.centerToCurrentPositions
        }
        showPage={page => this.showPage(page)}
        hidePage={() => this.hidePage()}
      />,
      document.getElementById("ui")
    );
  };

  private showPage = (page: Page) => {
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
    this.visiblePage = Page.Details;
    this.renderUI();
  };

  public visibleMuinaismuistotLayersChanged = (
    selectedLayerIds: Array<MuseovirastoLayerId>
  ) => {
    //this.settingsPage.setVisibleMuinaismuistotLayers(selectedLayerIds);
  };
}
