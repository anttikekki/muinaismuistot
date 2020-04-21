import "core-js/stable";
import "cross-fetch/polyfill";

import MuinaismuistotMap from "./map/MuinaismuistotMap";
import MuinaismuistotUI from "./ui/MuinaismuistotUI";
import { parseCoordinatesFromURL } from "./common/util/URLHashHelper";
import {
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  Settings,
  DataLatestUpdateDates,
  AhvenanmaaLayer,
  LayerGroup,
} from "./common/types";

export default class Muinaismuistot {
  private map: MuinaismuistotMap;
  private ui: MuinaismuistotUI;

  public constructor() {
    const initialSettings: Settings = {
      selectedMaanmittauslaitosLayer: MaanmittauslaitosLayer.Taustakartta,
      selectedMuseovirastoLayers: Object.values(MuseovirastoLayer),
      selectedMuinaisjaannosTypes: Object.values(MuinaisjaannosTyyppi),
      selectedMuinaisjaannosDatings: Object.values(MuinaisjaannosAjoitus),
      selectedAhvenanmaaLayers: Object.values(AhvenanmaaLayer),
    };

    this.map = new MuinaismuistotMap(initialSettings, {
      featuresSelected: (features, models) => {
        this.ui.featuresSelected(features, models);
      },
      showLoadingAnimation: (show) => {
        this.ui.showLoadingAnimation(show);
      },
      featureSearchReady: (features) => {
        this.ui.featureSearchReady(features);
      },
      dataLatestUpdateDatesReady: (dates: DataLatestUpdateDates) => {
        this.ui.dataLatestUpdateDatesReady(dates);
      },
    });

    this.ui = new MuinaismuistotUI(initialSettings, {
      searchFeatures: (searchText) => {
        this.map.searchFeatures(searchText);
      },
      zoomIn: () => {
        this.map.zoomIn();
      },
      zoomOut: () => {
        this.map.zoomOut();
      },
      centerToCurrentPositions: () => {
        this.map.centerToCurrentPositions();
      },
      selectedMaanmittauslaitosLayerChanged: (settings) => {
        this.map.selectedMaanmittauslaitosLayerChanged(settings);
      },
      selectedFeatureLayersChanged: (
        settings,
        changedLayerGroup: LayerGroup
      ) => {
        this.map.selectedFeatureLayersChanged(settings, changedLayerGroup);
      },
      selectedMuinaisjaannosTypesChanged: (settings) => {
        this.map.selectedMuinaisjaannosTypesChanged(settings);
      },
      selectedMuinaisjaannosDatingsChanged: (settings) => {
        this.map.selectedMuinaisjaannosDatingsChanged(settings);
      },
      fetchDataLatestUpdateDates: () => {
        this.map.fetchDataLatestUpdateDates();
      },
    });

    window.onhashchange = () => {
      this.setMapLocationFromURLHash();
    };

    this.determineStartLocation();
  }

  private determineStartLocation = () => {
    if (parseCoordinatesFromURL()) {
      this.setMapLocationFromURLHash();
    } else {
      this.map.centerToCurrentPositions();
    }
  };

  private setMapLocationFromURLHash = () => {
    const coordinates = parseCoordinatesFromURL();
    if (coordinates) {
      this.map.setMapLocation(coordinates);
      this.map.showSelectedLocationMarker(coordinates);
    }
  };
}

new Muinaismuistot();
