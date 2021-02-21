import "core-js/stable"
import "elm-pep"

import MuinaismuistotMap from "./map/MuinaismuistotMap"
import MuinaismuistotUI from "./ui/MuinaismuistotUI"
import { parseCoordinatesFromURL } from "./common/util/URLHashHelper"
import { Settings, DataLatestUpdateDates, LayerGroup } from "./common/types"
import {
  getSettingsFromURL,
  initialSettings,
  updateSettingsToURL
} from "./settings"

export default class Muinaismuistot {
  private map: MuinaismuistotMap
  private ui: MuinaismuistotUI
  private settings: Settings

  public constructor() {
    this.settings = getSettingsFromURL(initialSettings)
    this.map = new MuinaismuistotMap(this.settings, {
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

    this.ui = new MuinaismuistotUI(this.settings, {
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
        this.updateSettings(settings)
        this.map.selectedMaanmittauslaitosLayerChanged(settings)
      },
      selectedGtkLayerChanged: (settings, changedLayerGroup) => {
        this.updateSettings(settings)
        this.map.selectedFeatureLayersChanged(settings, changedLayerGroup)
      },
      onGtkLayerOpacityChange: (settings: Settings) => {
        this.updateSettings(settings)
        this.map.gtkLayerOpacityChanged(settings)
      },
      selectedFeatureLayersChanged: (settings, changedLayerGroup) => {
        this.updateSettings(settings)
        this.map.selectedFeatureLayersChanged(settings, changedLayerGroup)
      },
      selectedMuinaisjaannosTypesChanged: (settings) => {
        this.updateSettings(settings)
        this.map.selectedMuinaisjaannosTypesChanged(settings)
      },
      selectedMuinaisjaannosDatingsChanged: (settings) => {
        this.updateSettings(settings)
        this.map.selectedMuinaisjaannosDatingsChanged(settings)
      },
      selectedLanguageChanged: (settings) => {
        this.updateSettings(settings)
      },
      fetchDataLatestUpdateDates: () => {
        this.map.fetchDataLatestUpdateDates(this.settings)
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

  private updateSettings = (settings: Settings) => {
    this.settings = settings
    updateSettingsToURL(initialSettings, this.settings)
  }
}

new Muinaismuistot()
