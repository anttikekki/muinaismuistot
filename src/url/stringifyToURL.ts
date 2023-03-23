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

  // Museovirasto opacity
  state = updateParam(
    state,
    initialSettings.museovirasto.opacity,
    currentSettings.museovirasto.opacity,
    "museovirastoOpacity"
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

  // Maamkohoaminen layer
  state = updateParam(
    state,
    initialSettings.maankohoaminen.selectedLayer,
    currentSettings.maankohoaminen.selectedLayer,
    "maankohoaminenLayer"
  )

  // Maamkohoaminen opacity
  state = updateParam(
    state,
    initialSettings.maankohoaminen.opacity,
    currentSettings.maankohoaminen.opacity,
    "maankohoaminenOpacity"
  )

  window.location.hash = stringifyURLParamsToHash({
    ...state.old,
    ...state.next
  })
}
