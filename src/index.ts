import "core-js/stable";
import $ from "jquery";
import Settings from "./Settings";
import MuinaismuistotMap from "./map/MuinaismuistotMap";
import MuinaismuistotUI from "./ui/MuinaismuistotUI";
import { parseCoordinatesFromURL } from "./util/URLHashHelper";
import {
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus
} from "./data";

export default class Muinaismuistot {
  private map: MuinaismuistotMap;
  private settings: Settings;
  private ui: MuinaismuistotUI;

  public constructor() {
    const initialSettings = {
      selectedMaanmittauslaitosLayer: MaanmittauslaitosLayer.Taustakartta,
      selectedMuseovirastoLayers: Object.values(MuseovirastoLayer),
      selectedMuinaisjaannosTypes: Object.values(MuinaisjaannosTyyppi),
      selectedMuinaisjaannosDatings: Object.values(MuinaisjaannosAjoitus)
    };

    this.settings = new Settings({
      selectedMapBackgroundLayerChanged: layerName => {
        this.map.setVisibleMaanmittauslaitosLayerName(layerName);
      },
      visibleMuinaismuistotLayersChanged: selectedLayerIds => {
        this.map.updateVisibleMuinaismuistotLayersFromSettings();
        this.ui.visibleMuinaismuistotLayersChanged(selectedLayerIds);
      },
      filterParametersChanged: params => {
        this.map.updateMuinaismuistotFilterParamsFromSettings();
      }
    });

    this.map = new MuinaismuistotMap(this.settings, {
      muinaisjaannosFeaturesSelected: muinaisjaannosFeatures => {
        this.ui.muinaisjaannosFeaturesSelected(muinaisjaannosFeatures);
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
      selectedMaanmittauslaitosLayerChanged: layer => {
        this.map.setVisibleMaanmittauslaitosLayerName(layer);
      }
    });

    window.onhashchange = location => {
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
    var coordinates = parseCoordinatesFromURL();
    if (coordinates) {
      this.map.setMapLocation(coordinates);
      this.map.showSelectedLocationMarker(coordinates);
    }
  };
}

$(document).ready(() => {
  new Muinaismuistot();
});
