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

export const initialSettings: Settings = {
  selectedMaanmittauslaitosLayer: MaanmittauslaitosLayer.Taustakartta,
  selectedMuseovirastoLayers: Object.values(MuseovirastoLayer),
  selectedMuinaisjaannosTypes: Object.values(MuinaisjaannosTyyppi),
  selectedMuinaisjaannosDatings: Object.values(MuinaisjaannosAjoitus),
  selectedAhvenanmaaLayers: Object.values(AhvenanmaaLayer),
  maanmittauslaitos: {
    url: {
      WMTSCapabilities:
        "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml",
    },
  },
  museovirasto: {
    url: {
      export: "https://d3u1wj9fwedfoy.cloudfront.net",
      identify: "https://d3t293l8mhxosa.cloudfront.net",
      find: "https://d3239kmqvyt2db.cloudfront.net",
      updateDate: "https://dkfgv6jxivsxz.cloudfront.net/MV_inspire_atom.xml",
    },
  },
  ahvenanmaa: {
    url: {
      export:
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/export",
      identify:
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/identify",
      find:
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/find",
      forminnenUpdateDate:
        "https://opendata.arcgis.com/api/v3/datasets?filter%5Bslug%5D=aland%3A%3Afornminnen",
      maritimtKulturarvUpdateDate:
        "https://opendata.arcgis.com/api/v3/datasets?filter%5Bslug%5D=aland%3A%3Amaritimt-kulturarv-vrak",
    },
  },
};

export default class Muinaismuistot {
  private map: MuinaismuistotMap;
  private ui: MuinaismuistotUI;

  public constructor() {
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
