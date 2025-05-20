import { Reducer } from "redux"
import { Language, LayerGroup } from "../common/layers.types"
import { ActionTypeEnum, ActionTypes } from "./actionTypes"
import {
  updateAhvenanmaaLayerEnabled,
  updateAhvenanmaaLayerOpacity,
  updateAhvenanmaaSelectedLayers
} from "./reducers/ahvenanmaaLayer"
import {
  updateGtkLayerEnabled,
  updateGtkLayerOpacity,
  updateGtkSelectedLayers
} from "./reducers/gtkLayer"
import {
  updateHelsinkiLayerEnabled,
  updateHelsinkiLayerOpacity,
  updateHelsinkiSelectedLayers
} from "./reducers/helsinkiLayer"
import { updateMaanmittauslaitosSelectedLayer } from "./reducers/maanmittauslaitosLayer"
import {
  updateMaanmittauslaitosVanhatKartatLayerEnabled,
  updateMaanmittauslaitosVanhatKartatLayerOpacity,
  updateMaanmittauslaitosVanhatKartatSelectedLayer
} from "./reducers/maanmittauslaitosVanhatKartatLayer"
import {
  updateMaannousuInfoLayerEnabled,
  updateMaannousuInfoLayerOpacity,
  updateMaannousuInfoSelectedLayer
} from "./reducers/maannousuInfoLayer"
import {
  updateMaisemanMuistiLayerEnabled,
  updateMaisemanMuistiSelectedLayers
} from "./reducers/maisemanMuistiLayer"
import {
  updateModelLayerEnabled,
  updateModelSelectedLayers
} from "./reducers/modelLayer"
import {
  updateMuseovirastoLayerEnabled,
  updateMuseovirastoLayerOpacity,
  updateMuseovirastoSelectedLayers,
  updateSelectMuinaisjaannosDatings,
  updateSelectMuinaisjaannosTypes
} from "./reducers/museovirastoLayer"
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
    case ActionTypeEnum.SELECT_VISIBLE_LAYERS: {
      switch (action.layerGroup) {
        case LayerGroup.Maanmittauslaitos: {
          return updateMaanmittauslaitosSelectedLayer(state, action.layer)
        }
        case LayerGroup.MaanmittauslaitosVanhatKartat: {
          return updateMaanmittauslaitosVanhatKartatSelectedLayer(
            state,
            action.layers
          )
        }
        case LayerGroup.GTK: {
          return updateGtkSelectedLayers(state, action.layers)
        }
        case LayerGroup.MaannousuInfo: {
          return updateMaannousuInfoSelectedLayer(state, action.layer)
        }
        case LayerGroup.Helsinki: {
          return updateHelsinkiSelectedLayers(state, action.layers)
        }
        case LayerGroup.Museovirasto: {
          return updateMuseovirastoSelectedLayers(state, action.layers)
        }
        case LayerGroup.Ahvenanmaa: {
          return updateAhvenanmaaSelectedLayers(state, action.layers)
        }
        case LayerGroup.Models: {
          return updateModelSelectedLayers(state, action.layers)
        }
        case LayerGroup.MaisemanMuisti: {
          return updateMaisemanMuistiSelectedLayers(state, action.layers)
        }
        default:
          return state
      }
    }
    case ActionTypeEnum.CHANGE_LAYER_OPACITY: {
      switch (action.layerGroup) {
        case LayerGroup.MaanmittauslaitosVanhatKartat:
          return updateMaanmittauslaitosVanhatKartatLayerOpacity(
            state,
            action.opacity
          )
        case LayerGroup.GTK:
          return updateGtkLayerOpacity(state, action.opacity)
        case LayerGroup.MaannousuInfo:
          return updateMaannousuInfoLayerOpacity(state, action.opacity)
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
    case ActionTypeEnum.ENABLE_LAYER_GROUP: {
      switch (action.layerGroup) {
        case LayerGroup.MaanmittauslaitosVanhatKartat:
          return updateMaanmittauslaitosVanhatKartatLayerEnabled(
            state,
            action.enabled
          )
        case LayerGroup.GTK:
          return updateGtkLayerEnabled(state, action.enabled)
        case LayerGroup.MaannousuInfo:
          return updateMaannousuInfoLayerEnabled(state, action.enabled)
        case LayerGroup.Museovirasto:
          return updateMuseovirastoLayerEnabled(state, action.enabled)
        case LayerGroup.Ahvenanmaa:
          return updateAhvenanmaaLayerEnabled(state, action.enabled)
        case LayerGroup.Helsinki:
          return updateHelsinkiLayerEnabled(state, action.enabled)
        case LayerGroup.Models:
          return updateModelLayerEnabled(state, action.enabled)
        case LayerGroup.MaisemanMuisti:
          return updateMaisemanMuistiLayerEnabled(state, action.enabled)
        default:
          return state
      }
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
