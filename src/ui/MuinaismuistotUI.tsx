import "bootstrap/dist/css/bootstrap.min.css";
import "../css/muinaismuistot.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  ArgisFeature,
  Settings,
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../data";
import { LoadingAnimation } from "./component/LoadingAnimation";
import { ZoomInButton } from "./component/ZoomInButton";
import { ZoomOutButton } from "./component/ZoomOutButton";
import { CenterToCurrentPositionButton } from "./component/CenterToCurrentPositionButton";
import { ShowInfoPageButton } from "./component/OpenInfoPageButton";
import { FeatureDetailsPage } from "./page/featureDetailsPage/FeatureDetailsPage";
import { SearchPage } from "./page/searchPage/SearchPage";
import { InfoPage } from "./page/infoPage/InfoPage";
import { OpenSearchPageButton } from "./component/OpenSearchPageButton";
import { SettingsPage } from "./page/settingsPage/SettingsPage";
import { OpenSettingsPage } from "./component/OpenSettingsPage";

enum PageId {
  Search = "searchPage",
  Info = "infoPage",
  Settings = "settingsPage",
  Details = "detailsPage"
}

const toggleSelection = function<T>(value: T, values: Array<T>) {
  if (values.includes(value)) {
    return values.filter(v => v !== value);
  } else {
    return [...values, value];
  }
};

export interface EventListeners {
  searchFeatures: (searchText: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerToCurrentPositions: () => void;
  selectedMaanmittauslaitosLayerChanged: (settings: Settings) => void;
  selectedFeatureLayersChanged: (settings: Settings) => void;
  selectedMuinaisjaannosTypesChanged: (settings: Settings) => void;
  selectedMuinaisjaannosDatingsChanged: (settings: Settings) => void;
}

export default class MuinaismuistotUI {
  private settings: Settings;
  private visiblePage?: PageId;
  private selectedFeatures?: Array<ArgisFeature>;
  private searchResultFeatures?: Array<ArgisFeature>;
  private loadingAnimationTimeoutID?: number;
  private loadingAnimationCounter = 0;
  private eventListeners: EventListeners;

  public constructor(
    initialSettings: Settings,
    eventListeners: EventListeners
  ) {
    this.settings = initialSettings;
    this.eventListeners = eventListeners;
    this.renderUI();
  }

  private onSearchFeatures = (searchText: string) => {
    this.eventListeners.searchFeatures(searchText);
    this.searchResultFeatures = undefined;
    this.renderUI();
  };

  private onSelectMaanmittauslaitosLayer = (layer: MaanmittauslaitosLayer) => {
    this.settings.selectedMaanmittauslaitosLayer = layer;
    this.eventListeners.selectedMaanmittauslaitosLayerChanged(this.settings);
    this.renderUI();
  };

  private onSelectMuseovirastoLayer = (layer: MuseovirastoLayer) => {
    this.settings.selectedMuseovirastoLayers = toggleSelection(
      layer,
      this.settings.selectedMuseovirastoLayers
    );
    this.eventListeners.selectedFeatureLayersChanged(this.settings);
    this.renderUI();
  };

  private onSelectMuinaisjaannosType = (type: MuinaisjaannosTyyppi) => {
    this.settings.selectedMuinaisjaannosTypes = toggleSelection(
      type,
      this.settings.selectedMuinaisjaannosTypes
    );
    this.eventListeners.selectedMuinaisjaannosTypesChanged(this.settings);
    this.renderUI();
  };

  private onSelectMuinaisjaannosDating = (dating: MuinaisjaannosAjoitus) => {
    this.settings.selectedMuinaisjaannosDatings = toggleSelection(
      dating,
      this.settings.selectedMuinaisjaannosDatings
    );
    this.eventListeners.selectedMuinaisjaannosDatingsChanged(this.settings);
    this.renderUI();
  };

  private renderUI = () => {
    const isLoading = this.loadingAnimationCounter > 0;
    const { zoomIn, zoomOut, centerToCurrentPositions } = this.eventListeners;

    ReactDOM.render(
      <>
        <LoadingAnimation visible={isLoading} />
        <ZoomInButton onClick={zoomIn} />
        <ZoomOutButton onClick={zoomOut} />
        <CenterToCurrentPositionButton onClick={centerToCurrentPositions} />
        <OpenSearchPageButton onClick={() => this.showPage(PageId.Search)} />
        <ShowInfoPageButton onClick={() => this.showPage(PageId.Info)} />
        <OpenSettingsPage onClick={() => this.showPage(PageId.Settings)} />

        <FeatureDetailsPage
          visible={this.visiblePage === PageId.Details}
          hidePage={this.hidePage}
          features={this.selectedFeatures}
        />
        <SearchPage
          visible={this.visiblePage === PageId.Search}
          hidePage={this.hidePage}
          searchFeatures={this.onSearchFeatures}
          searchResultFeatures={this.searchResultFeatures}
        />
        <InfoPage
          visible={this.visiblePage === PageId.Info}
          hidePage={this.hidePage}
        />
        <SettingsPage
          visible={this.visiblePage === PageId.Settings}
          hidePage={this.hidePage}
          settings={this.settings}
          onSelectMaanmittauslaitosLayer={this.onSelectMaanmittauslaitosLayer}
          onSelectMuseovirastoLayer={this.onSelectMuseovirastoLayer}
          onSelectMuinaisjaannosType={this.onSelectMuinaisjaannosType}
          onSelectMuinaisjaannosDating={this.onSelectMuinaisjaannosDating}
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

  public featuresSelected = (selectedFeatures: Array<ArgisFeature>) => {
    if (selectedFeatures.length === 0) {
      return;
    }
    this.selectedFeatures = selectedFeatures;
    this.visiblePage = PageId.Details;
    this.renderUI();
  };

  public featureSearchReady = (features: Array<ArgisFeature>) => {
    this.searchResultFeatures = features;
    this.renderUI();
  };
}
