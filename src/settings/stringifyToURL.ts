import { Settings } from "../common/types"
import {
  parseURLParams,
  stringifyURLParamsToHash
} from "../common/util/URLHashHelper"
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

  // Museovirasto layers
  state = updateParams(
    state,
    initialSettings.museovirasto.selectedLayers,
    currentSettings.museovirasto.selectedLayers,
    "museovirastoLayer"
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
