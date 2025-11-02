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
import { updateLinkedFeature } from "./reducers/linkedFeature"
import {
  updateMmlPohjakarttaLayerEnabled,
  updateMmlPohjakarttaSelectedLayer,
  updateMmlVanhatKartatLayerEnabled,
  updateMmlVanhatKartatLayerOpacity,
  updateMmlVanhatKartatSelectedLayer
} from "./reducers/maanmittauslaitosLayer"
import {
  updateMaannousuInfoLayerEnabled,
  updateMaannousuInfoLayerOpacity,
  updateMaannousuInfoPlacement,
  updateMaannousuInfoSelectedLayer
} from "./reducers/maannousuInfoLayer"
import { updateMaisemanMuistiLayerEnabled } from "./reducers/maisemanMuistiLayer"
import { updateModelLayerEnabled } from "./reducers/modelLayer"
import {
  updateMuseovirastoLayerEnabled,
  updateMuseovirastoLayerOpacity,
  updateMuseovirastoSelectedLayers,
  updateSelectMuinaisjaannosDatings,
  updateSelectMuinaisjaannosTypes
} from "./reducers/museovirastoLayer"
import {
  updateViabundusLayerEnabled,
  updateViabundusLayerOpacity,
  updateViabundusYear
} from "./reducers/viabundusLayer"
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
    case ActionTypeEnum.ZOOM_CHANGED:
      return {
        ...state,
        mapZoom: action.zoom
      }
    case ActionTypeEnum.MAP_CENTER_CHANGED:
      return {
        ...state,
        mapCenterCoordinates: action.coordinates
      }
    case ActionTypeEnum.SET_LINKED_FEATURE: {
      return updateLinkedFeature(state, action.linkedFeature)
    }
    case ActionTypeEnum.MAP_FEATURE_IDENTIFICATION_COMPLETE: {
      const { identifiedMapFeatures } = action
      if (identifiedMapFeatures.features.length === 0) {
        return state
      }

      // Storessa on jo myöhemmin tehdyn kutsun vastaus, hylätään vanhentunut tulos
      if (
        state.identifiedMapFeatures?.requestTimestamp &&
        state.identifiedMapFeatures?.requestTimestamp >
          action.identifiedMapFeatures.requestTimestamp
      ) {
        return state
      }

      return {
        ...state,
        visiblePage: PageId.Details,
        identifiedMapFeatures
      }
    }
    case ActionTypeEnum.SEARCH_FEATURES: {
      return {
        ...state,
        search: undefined
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
        case LayerGroup.MMLPohjakartta: {
          return updateMmlPohjakarttaSelectedLayer(state, action.layer)
        }
        case LayerGroup.MMLVanhatKartat: {
          return updateMmlVanhatKartatSelectedLayer(state, action.layers)
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
        default:
          return state
      }
    }
    case ActionTypeEnum.CHANGE_LAYER_OPACITY: {
      switch (action.layerGroup) {
        case LayerGroup.MMLVanhatKartat:
          return updateMmlVanhatKartatLayerOpacity(state, action.opacity)
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
        case LayerGroup.Viabundus:
          return updateViabundusLayerOpacity(state, action.opacity)
        default:
          return state
      }
    }
    case ActionTypeEnum.ENABLE_LAYER_GROUP: {
      switch (action.layerGroup) {
        case LayerGroup.MMLPohjakartta:
          return updateMmlPohjakarttaLayerEnabled(state, action.enabled)
        case LayerGroup.MMLVanhatKartat:
          return updateMmlVanhatKartatLayerEnabled(state, action.enabled)
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
        case LayerGroup.Viabundus:
          return updateViabundusLayerEnabled(state, action.enabled)
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
    case ActionTypeEnum.MOVE_MAANNOUSU_LAYER: {
      return updateMaannousuInfoPlacement(state, action.placement)
    }
    case ActionTypeEnum.SELECT_VIABUNDUS_YEAR: {
      return updateViabundusYear(state, action.year)
    }
    default:
      return state
  }
}
