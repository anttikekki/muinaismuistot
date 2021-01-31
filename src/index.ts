import "core-js/stable"
import "elm-pep"

import MuinaismuistotMap from "./map/MuinaismuistotMap"
import MuinaismuistotUI from "./ui/MuinaismuistotUI"
import { parseCoordinatesFromURL } from "./common/util/URLHashHelper"
import { DataLatestUpdateDates } from "./common/types"
import { getSettingsFromURL, updateSettingsToURL } from "./settings"
import { Store } from "redux"
import { configureStore } from "./store/configureStore"
import { ActionTypes } from "./store/actionTypes"
import { createRootReducer } from "./store/reducers"
import { Settings } from "./store/storeTypes"
import { initialSettings } from "./store/initialSettings"
import {
  featuresSelectedOnMap,
  fetchDataLatestUpdateDatesComplete
} from "./store/actions"

export default class Muinaismuistot {
  private map: MuinaismuistotMap
  private ui: MuinaismuistotUI
  private settings: Settings
  private store: Store<Settings, ActionTypes>

  public constructor() {
    this.settings = getSettingsFromURL(initialSettings)

    this.map = new MuinaismuistotMap(this.settings, {
      featuresSelected: (features, models, maisemanMuistiFeatures) => {
        this.store.dispatch(
          featuresSelectedOnMap({ features, models, maisemanMuistiFeatures })
        )
      },
      showLoadingAnimation: (show) => {
        this.ui.showLoadingAnimation(show)
      },
      featureSearchReady: (features) => {
        this.ui.featureSearchReady(features)
      },
      dataLatestUpdateDatesReady: (dates: DataLatestUpdateDates) => {
        this.store.dispatch(fetchDataLatestUpdateDatesComplete(dates))
      }
    })

    this.store = configureStore(this.settings, createRootReducer(this.map))

    this.ui = new MuinaismuistotUI(this.settings, this.store, {
      searchFeatures: (searchText) => {
        this.map.searchFeatures(searchText)
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
