import {
  parseURLParams,
  stringifyURLParamsToHash
} from "../common/util/URLHashHelper"
import { Settings } from "../store/storeTypes"
import { EMPTY_SELECTION, URLSettings } from "./types"

interface URLSettingsState {
  next: URLSettings
  old: URLSettings
}

const updateParams = (
  state: URLSettingsState,
  initialValues: Array<string>,
  currentValues: Array<string>,
  key: keyof URLSettings
): URLSettingsState => {
  if (
    (initialValues.length === 0 && currentValues.length === 0) ||
    (initialValues.length > 0 &&
      initialValues.every((v) => currentValues.includes(v)))
  ) {
    return {
      ...state,
      old: {
        ...state.old,
        [key]: undefined
      }
    }
  }
  return {
    ...state,
    next: {
      ...state.next,
      [key]: currentValues.length > 0 ? currentValues : [EMPTY_SELECTION]
    }
  }
}

const updateParam = <T>(
  state: URLSettingsState,
  initialValue: T,
  currentValue: T,
  key: keyof URLSettings
): URLSettingsState => {
  if (initialValue === currentValue) {
    return {
      ...state,
      old: {
        ...state.old,
        [key]: undefined
      }
    }
  }
  return {
    ...state,
    next: {
      ...state.next,
      [key]: currentValue
    }
  }
}

export const updateSettingsToURL = (
  initialSettings: Settings,
  currentSettings: Settings
): void => {
  let state: URLSettingsState = {
    next: {},
    old: parseURLParams() as URLSettings
  }

  // Language
  state = updateParam(
    state,
    initialSettings.language,
    currentSettings.language,
    "lang"
  )

  // MML
  state = updateParam(
    state,
    initialSettings.maanmittauslaitos.selectedLayer,
    currentSettings.maanmittauslaitos.selectedLayer,
    "mmlLayer"
  )

  // MML vanhat kartat layers
  state = updateParams(
    state,
    initialSettings.maanmittauslaitosVanhatKartat.selectedLayers,
    currentSettings.maanmittauslaitosVanhatKartat.selectedLayers,
    "mmlVanhatKartatLayer"
  )

  // MML vanhat kartat opacity
  state = updateParam(
    state,
    initialSettings.maanmittauslaitosVanhatKartat.opacity,
    currentSettings.maanmittauslaitosVanhatKartat.opacity,
    "mmlVanhatKartatOpacity"
  )

  // MML vanhat kartat enabled
  state = updateParam(
    state,
    initialSettings.maanmittauslaitosVanhatKartat.enabled,
    currentSettings.maanmittauslaitosVanhatKartat.enabled,
    "mmlVanhatKartatEnabled"
  )

  // GTK layers
  state = updateParams(
    state,
    initialSettings.gtk.selectedLayers,
    currentSettings.gtk.selectedLayers,
    "gtkLayer"
  )

  // GTK opacity
  state = updateParam(
    state,
    initialSettings.gtk.opacity,
    currentSettings.gtk.opacity,
    "gtkOpacity"
  )

  // GTK enabled
  state = updateParam(
    state,
    initialSettings.gtk.enabled,
    currentSettings.gtk.enabled,
    "gtkEnabled"
  )

  // Museovirasto layers
  state = updateParams(
    state,
    initialSettings.museovirasto.selectedLayers,
    currentSettings.museovirasto.selectedLayers,
    "museovirastoLayer"
  )

  // Museovirasto opacity
  state = updateParam(
    state,
    initialSettings.museovirasto.opacity,
    currentSettings.museovirasto.opacity,
    "museovirastoOpacity"
  )

  // Museovirasto enabled
  state = updateParam(
    state,
    initialSettings.museovirasto.enabled,
    currentSettings.museovirasto.enabled,
    "museovirastoEnabled"
  )

  // Museovirasto muinaisjaannos types
  state = updateParams(
    state,
    initialSettings.museovirasto.selectedMuinaisjaannosTypes,
    currentSettings.museovirasto.selectedMuinaisjaannosTypes,
    "muinaisjaannosTypes"
  )

  // Museovirasto muinaisjaannos datings
  state = updateParams(
    state,
    initialSettings.museovirasto.selectedMuinaisjaannosDatings,
    currentSettings.museovirasto.selectedMuinaisjaannosDatings,
    "muinaisjaannosDatings"
  )

  // Ahvenanmaa layers
  state = updateParams(
    state,
    initialSettings.ahvenanmaa.selectedLayers,
    currentSettings.ahvenanmaa.selectedLayers,
    "ahvenanmaaLayer"
  )

  // Ahvenanmaa opacity
  state = updateParam(
    state,
    initialSettings.ahvenanmaa.opacity,
    currentSettings.ahvenanmaa.opacity,
    "ahvenanmaaOpacity"
  )

  // Ahvenanmaa enabled
  state = updateParam(
    state,
    initialSettings.ahvenanmaa.enabled,
    currentSettings.ahvenanmaa.enabled,
    "ahvenanmaaEnabled"
  )

  // Helsinki layers
  state = updateParams(
    state,
    initialSettings.helsinki.selectedLayers,
    currentSettings.helsinki.selectedLayers,
    "helsinkiLayer"
  )

  // Helsinki opacity
  state = updateParam(
    state,
    initialSettings.helsinki.opacity,
    currentSettings.helsinki.opacity,
    "helsinkiOpacity"
  )

  // Helsinki enabled
  state = updateParam(
    state,
    initialSettings.helsinki.enabled,
    currentSettings.helsinki.enabled,
    "helsinkiEnabled"
  )

  // 3D models
  state = updateParams(
    state,
    initialSettings.models.selectedLayers,
    currentSettings.models.selectedLayers,
    "modelsLayer"
  )

  // Maiseman muisti
  state = updateParams(
    state,
    initialSettings.maisemanMuisti.selectedLayers,
    currentSettings.maisemanMuisti.selectedLayers,
    "maisemanMuistiLayer"
  )

  window.location.hash = stringifyURLParamsToHash({
    ...state.old,
    ...state.next
  })
}
