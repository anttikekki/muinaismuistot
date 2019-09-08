import "core-js/stable";
import "cross-fetch/polyfill";

import MuinaismuistotMap from "./map/MuinaismuistotMap";
import MuinaismuistotUI from "./ui/MuinaismuistotUI";
import { parseCoordinatesFromURL } from "./util/URLHashHelper";
import {
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  Settings
} from "./data";

export default class Muinaismuistot {
  private map: MuinaismuistotMap;
  private ui: MuinaismuistotUI;

  public constructor() {
    const initialSettings: Settings = {
      selectedMaanmittauslaitosLayer: MaanmittauslaitosLayer.Taustakartta,
      selectedMuseovirastoLayers: Object.values(MuseovirastoLayer),
      selectedMuinaisjaannosTypes: Object.values(MuinaisjaannosTyyppi),
      selectedMuinaisjaannosDatings: Object.values(MuinaisjaannosAjoitus)
    };

    this.map = new MuinaismuistotMap(initialSettings, {
      featuresSelected: features => {
        this.ui.featuresSelected(features);
      },
      showLoadingAnimation: show => {
        this.ui.showLoadingAnimation(show);
      },
      featureSearchReady: features => {
        this.ui.featureSearchReady(features);
      }
    });

    this.ui = new MuinaismuistotUI(initialSettings, {
      searchFeatures: searchText => {
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
      selectedMaanmittauslaitosLayerChanged: settings => {
        this.map.selectedMaanmittauslaitosLayerChanged(settings);
      },
      selectedFeatureLayersChanged: settings => {
        this.map.selectedFeatureLayersChanged(settings);
      },
      selectedMuinaisjaannosTypesChanged: settings => {
        this.map.selectedMuinaisjaannosTypesChanged(settings);
      },
      selectedMuinaisjaannosDatingsChanged: settings => {
        this.map.selectedMuinaisjaannosDatingsChanged(settings);
      }
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
