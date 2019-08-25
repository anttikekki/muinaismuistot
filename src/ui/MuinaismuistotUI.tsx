import * as React from "react";
import * as ReactDOM from "react-dom";
import $ from "jquery";
import { ArgisFeature, MuseovirastoLayerId } from "../data";
import Settings from "../Settings";
import { UI } from "./UI";

export interface EventListeners {
  searchMuinaismuistoja: (
    searchText: string,
    callbackFn: (features: Array<ArgisFeature>) => void
  ) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerToCurrentPositions: () => void;
}

enum Page {
  Search = "searchPage",
  Info = "infoPage",
  Settings = "settingsPage",
  Details = "detailsPage"
}

export default class MuinaismuistotUI {
  private visiblePageId?: Page;
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

    infoPage = new InfoPage({
      hidePage: function() {
        hidePage("infoPage");
      }
    });

    $("#map-button-zoom-in").on("click", function() {
      eventListeners.zoomIn();
    });

    $("#map-button-zoom-out").on("click", function() {
      eventListeners.zoomOut();
    });

    $("#map-button-position").on("click", function() {
      eventListeners.centerToCurrentPositions();
    });

    $("#map-button-search").on("click", function() {
      showPage("searchPage");
    });

    $("#map-button-info").on("click", function() {
      showPage("infoPage");
    });

    $("#map-button-settings").on("click", function() {
      showPage("settingsPage");
    });
    */
  }

  private renderUI = () => {
    ReactDOM.render(
      <UI
        onZoomIn={this.eventListeners.zoomIn}
        onZoomOut={this.eventListeners.zoomOut}
        onCenterToCurrentPositions={
          this.eventListeners.centerToCurrentPositions
        }
      />,
      document.getElementById("ui")
    );
  };

  private showPage = function(pageId: Page) {
    var $page = $("#" + pageId);

    //Hide possible old page
    if (this.visiblePageId) {
      this.hidePage(this.visiblePageId);
    }

    if ($page.hasClass("page-right-hidden")) {
      $page.removeClass("page-right-hidden").addClass("page-right-visible");
      this.visiblePageId = pageId;
    }
  };

  private hidePage = function(pageId: Page) {
    var $page = $("#" + pageId);

    if ($page.hasClass("page-right-visible")) {
      $page.removeClass("page-right-visible").addClass("page-right-hidden");
      this.visiblePageId = null;
    }
  };

  public showLoadingAnimation = (show: boolean) => {
    var oldCounterValue = this.loadingAnimationCounter;
    if (show) {
      this.loadingAnimationCounter++;
    } else {
      this.loadingAnimationCounter--;
    }

    if (oldCounterValue === 0 && this.loadingAnimationCounter === 1) {
      this.loadingAnimationTimeoutID = window.setTimeout(function() {
        if (this.loadingAnimationTimeoutID) {
          $("#loading-animation").removeClass("hidden");
        }
      }, 300);
    }

    if (oldCounterValue === 1 && this.loadingAnimationCounter === 0) {
      window.clearTimeout(this.loadingAnimationTimeoutID);
      this.loadingAnimationTimeoutID = undefined;
      $("#loading-animation").addClass("hidden");
    }
  };

  public muinaisjaannosFeaturesSelected = (
    muinaisjaannosFeatures: Array<ArgisFeature>
  ) => {
    /*
    if (this.detailsPage.setMuinaisjaannosFeatures(muinaisjaannosFeatures)) {
      this.showPage(Page.Details);
    } else {
      this.hidePage(Page.Details);
    }
    */
  };

  public visibleMuinaismuistotLayersChanged = (
    selectedLayerIds: Array<MuseovirastoLayerId>
  ) => {
    //this.settingsPage.setVisibleMuinaismuistotLayers(selectedLayerIds);
  };
}
