import "core-js/stable"
import "cross-fetch/polyfill"

import MuinaismuistotMap from "./map/MuinaismuistotMap"
import MuinaismuistotUI from "./ui/MuinaismuistotUI"
import { parseCoordinatesFromURL } from "./common/util/URLHashHelper"
import {
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  Settings,
  DataLatestUpdateDates,
  AhvenanmaaLayer,
  LayerGroup,
  ModelLayer,
  MaisemanMuistiLayer
} from "./common/types"

export const initialSettings: Settings = {
  maanmittauslaitos: {
    selectedLayer: MaanmittauslaitosLayer.Taustakartta,
    url: {
      WMTSCapabilities:
        "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml"
    }
  },
  museovirasto: {
    selectedLayers: Object.values(MuseovirastoLayer),
    selectedMuinaisjaannosTypes: Object.values(MuinaisjaannosTyyppi),
    selectedMuinaisjaannosDatings: Object.values(MuinaisjaannosAjoitus),
    url: {
      export:
        "https://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/export",
      identify:
        "https://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/identify",
      find:
        "https://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/find",
      /**
       * Custom reverse proxy is required to add Cross origin policy headers to the request so
       * that browser can fetch the XML file from https://paikkatieto.nba.fi/aineistot/MV_inspire_atom.xml
       */
      updateDate: "https://dkfgv6jxivsxz.cloudfront.net/MV_inspire_atom.xml"
    }
  },
  ahvenanmaa: {
    selectedLayers: Object.values(AhvenanmaaLayer),
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
        "https://opendata.arcgis.com/api/v3/datasets?filter%5Bslug%5D=aland%3A%3Amaritimt-kulturarv-vrak"
    }
  },
  models: {
    selectedLayers: Object.values(ModelLayer),
    url: {
      geojson: "./3d/3d.json"
    }
  },
  maisemanMuisti: {
    selectedLayers: Object.values(MaisemanMuistiLayer),
    url: {
      geojson: "./maisemanmuisti/maisemanmuisti.json"
    }
  }
}

export default class Muinaismuistot {
  private map: MuinaismuistotMap
  private ui: MuinaismuistotUI
  private settings: Settings

  public constructor() {
    this.settings = initialSettings
    this.map = new MuinaismuistotMap(initialSettings, {
      featuresSelected: (features, models, maisemanMuistiFeatures) => {
        this.ui.featuresSelected(features, models, maisemanMuistiFeatures)
      },
      showLoadingAnimation: (show) => {
        this.ui.showLoadingAnimation(show)
      },
      featureSearchReady: (features) => {
        this.ui.featureSearchReady(features)
      },
      dataLatestUpdateDatesReady: (dates: DataLatestUpdateDates) => {
        this.ui.dataLatestUpdateDatesReady(dates)
      }
    })

    this.ui = new MuinaismuistotUI(initialSettings, {
      searchFeatures: (searchText) => {
        this.map.searchFeatures(searchText)
      },
      zoomIn: () => {
        this.map.zoomIn()
      },
      zoomOut: () => {
        this.map.zoomOut()
      },
      centerToCurrentPositions: () => {
        this.map.centerToCurrentPositions()
      },
      selectedMaanmittauslaitosLayerChanged: (settings) => {
        this.settings = settings
        this.map.selectedMaanmittauslaitosLayerChanged(settings)
      },
      selectedFeatureLayersChanged: (
        settings,
        changedLayerGroup: LayerGroup
      ) => {
        this.settings = settings
        this.map.selectedFeatureLayersChanged(settings, changedLayerGroup)
      },
      selectedMuinaisjaannosTypesChanged: (settings) => {
        this.settings = settings
        this.map.selectedMuinaisjaannosTypesChanged(settings)
      },
      selectedMuinaisjaannosDatingsChanged: (settings) => {
        this.settings = settings
        this.map.selectedMuinaisjaannosDatingsChanged(settings)
      },
      fetchDataLatestUpdateDates: () => {
        this.map.fetchDataLatestUpdateDates()
      }
    })

    window.onhashchange = () => {
      this.setMapLocationFromURLHash()
    }

    this.determineStartLocation()
  }

  private determineStartLocation = () => {
    if (parseCoordinatesFromURL()) {
      this.setMapLocationFromURLHash()
    } else {
      this.map.centerToCurrentPositions()
    }
  }

  private setMapLocationFromURLHash = () => {
    const coordinates = parseCoordinatesFromURL()
    if (coordinates) {
      this.map.setMapLocation(coordinates)
      this.map.showSelectedLocationMarker(coordinates)
    }
  }
}

new Muinaismuistot()
