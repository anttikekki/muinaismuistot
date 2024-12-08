import { Reducer } from "redux"
import {
  AhvenanmaaLayer,
  GtkLayer,
  HelsinkiLayer,
  Language,
  LayerGroup,
  MaanmittauslaitosLayer,
  MaisemanMuistiLayer,
  ModelLayer,
  MuseovirastoLayer
} from "../common/layers.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../common/museovirasto.types"
import { ActionTypeEnum, ActionTypes } from "./actionTypes"
import { PageId, Settings } from "./storeTypes"

export const updateLanguage = (
  settings: Settings,
  language: Language
): Settings => {
  return {
    ...settings,
    language
  }
}

export const updateMaanmittauslaitosSelectedLayer = (
  settings: Settings,
  selectedLayer: MaanmittauslaitosLayer
): Settings => {
  return {
    ...settings,
    maanmittauslaitos: {
      ...settings.maanmittauslaitos,
      selectedLayer
    }
  }
}

export const updateGtkSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<GtkLayer>
): Settings => {
  return {
    ...settings,
    gtk: {
      ...settings.gtk,
      selectedLayers
    }
  }
}

export const updateGtkLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    gtk: {
      ...settings.gtk,
      opacity
    }
  }
}

export const updateHelsinkiSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<HelsinkiLayer>
): Settings => {
  return {
    ...settings,
    helsinki: {
      ...settings.helsinki,
      selectedLayers
    }
  }
}

export const updateHelsinkiLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    helsinki: {
      ...settings.helsinki,
      opacity
    }
  }
}

export const updateMuseovirastoSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<MuseovirastoLayer>
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      selectedLayers
    }
  }
}

export const updateMuseovirastoLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      opacity
    }
  }
}

export const updateAhvenanmaaSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<AhvenanmaaLayer>
): Settings => {
  return {
    ...settings,
    ahvenanmaa: {
      ...settings.ahvenanmaa,
      selectedLayers
    }
  }
}

export const updateAhvenanmaaLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    ahvenanmaa: {
      ...settings.ahvenanmaa,
      opacity
    }
  }
}

export const updateModelSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<ModelLayer>
): Settings => {
  return {
    ...settings,
    models: {
      ...settings.models,
      selectedLayers
    }
  }
}

export const updateMaisemanMuistiSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<MaisemanMuistiLayer>
): Settings => {
  return {
    ...settings,
    maisemanMuisti: {
      ...settings.maisemanMuisti,
      selectedLayers
    }
  }
}

export const updateSelectMuinaisjaannosTypes = (
  settings: Settings,
  selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      selectedMuinaisjaannosTypes
    }
  }
}

export const updateSelectMuinaisjaannosDatings = (
  settings: Settings,
  selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      selectedMuinaisjaannosDatings
    }
  }
}

const updateLoadingAnimation = (
  settings: Settings,
  showLoadingAnimation: boolean
): Settings => {
  const concurrentPendingJobsCounter = showLoadingAnimation
    ? settings.concurrentPendingJobsCounter + 1
    : settings.concurrentPendingJobsCounter - 1
  return {
    ...settings,
    concurrentPendingJobsCounter,
    showLoadingAnimation: concurrentPendingJobsCounter > 0
  }
}

export const rootReducer: Reducer<Settings, ActionTypes> = (state, action) => {
  if (state == undefined) {
    throw new Error("State must be defined")
  }

  switch (action.type) {
    case ActionTypeEnum.CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE: {
      const selectedFeaturesOnMap = action.payload
      if (
        selectedFeaturesOnMap.features.length === 0 &&
        selectedFeaturesOnMap.maisemanMuistiFeatures.length === 0
      ) {
        return state
      }
      return {
        ...state,
        visiblePage: PageId.Details,
        selectedFeaturesOnMap
      }
    }
    case ActionTypeEnum.SEARCH_FEATURES: {
      return {
        ...state,
        search: {
          features: []
        }
      }
    }
    case ActionTypeEnum.SEARCH_FEATURES_COMPLETE: {
      return {
        ...state,
        search: {
          features: action.searchResultFeatures
        }
      }
    }
    case ActionTypeEnum.SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER: {
      return updateMaanmittauslaitosSelectedLayer(state, action.layer)
    }
    case ActionTypeEnum.SELECT_VISIBLE_GTK_LAYERS: {
      return updateGtkSelectedLayers(state, action.layers)
    }
    case ActionTypeEnum.CHANGE_LAYER_OPACITY: {
      switch (action.layerGroup) {
        case LayerGroup.GTK:
          return updateGtkLayerOpacity(state, action.opacity)
        case LayerGroup.Museovirasto:
          return updateMuseovirastoLayerOpacity(state, action.opacity)
        case LayerGroup.Ahvenanmaa:
          return updateAhvenanmaaLayerOpacity(state, action.opacity)
        case LayerGroup.Helsinki:
          return updateHelsinkiLayerOpacity(state, action.opacity)
        default:
          return state
      }
    }
    case ActionTypeEnum.SELECT_VISIBLE_HELSINKI_LAYERS: {
      return updateHelsinkiSelectedLayers(state, action.layers)
    }
    case ActionTypeEnum.SELECT_VISIBLE_MUSEOVIRASTO_LAYERS: {
      return updateMuseovirastoSelectedLayers(state, action.layers)
    }
    case ActionTypeEnum.SELECT_VISIBLE_AHVENANMAA_LAYERS: {
      return updateAhvenanmaaSelectedLayers(state, action.layers)
    }
    case ActionTypeEnum.SELECT_VISIBLE_MODELS_LAYERS: {
      return updateModelSelectedLayers(state, action.layers)
    }
    case ActionTypeEnum.SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS: {
      return updateMaisemanMuistiSelectedLayers(state, action.layers)
    }
    case ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE: {
      return updateSelectMuinaisjaannosTypes(state, action.types)
    }
    case ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING: {
      return updateSelectMuinaisjaannosDatings(state, action.datings)
    }
    case ActionTypeEnum.CHANGE_LANGUAGE: {
      return updateLanguage(state, action.language)
    }
    case ActionTypeEnum.SHOW_LOADING_ANIMATION: {
      return updateLoadingAnimation(state, action.show)
    }
    case ActionTypeEnum.SHOW_PAGE: {
      return {
        ...state,
        visiblePage: action.pageId
      }
    }
    default:
      return state
  }
}
