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
  initialValues: string[],
  currentValues: string[],
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

  // Linked feature coordinates
  state = updateParam(
    state,
    initialSettings.linkedFeature?.coordinates[0],
    currentSettings.linkedFeature?.coordinates[0],
    "x"
  )
  state = updateParam(
    state,
    initialSettings.linkedFeature?.coordinates[1],
    currentSettings.linkedFeature?.coordinates[1],
    "y"
  )

  // Language
  state = updateParam(
    state,
    initialSettings.language,
    currentSettings.language,
    "lang"
  )

  // MML layer
  state = updateParam(
    state,
    initialSettings.maanmittauslaitos.basemap.selectedLayer,
    currentSettings.maanmittauslaitos.basemap.selectedLayer,
    "mmlLayer"
  )

  // MML  enabled
  state = updateParam(
    state,
    initialSettings.maanmittauslaitos.basemap.enabled,
    currentSettings.maanmittauslaitos.basemap.enabled,
    "mmlLayerEnabled"
  )

  // MML vanhat kartat layers
  state = updateParams(
    state,
    initialSettings.maanmittauslaitos.vanhatKartat.selectedLayers,
    currentSettings.maanmittauslaitos.vanhatKartat.selectedLayers,
    "mmlVanhatKartatLayer"
  )

  // MML vanhat kartat opacity
  state = updateParam(
    state,
    initialSettings.maanmittauslaitos.vanhatKartat.opacity,
    currentSettings.maanmittauslaitos.vanhatKartat.opacity,
    "mmlVanhatKartatOpacity"
  )

  // MML vanhat kartat enabled
  state = updateParam(
    state,
    initialSettings.maanmittauslaitos.vanhatKartat.enabled,
    currentSettings.maanmittauslaitos.vanhatKartat.enabled,
    "mmlVanhatKartatEnabled"
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

  // GTK layer
  state = updateParam(
    state,
    initialSettings.gtk.selectedLayers,
    currentSettings.gtk.selectedLayers,
    "gtktLayer"
  )

  // Maannousu.info layers
  state = updateParam(
    state,
    initialSettings.maannousuInfo.selectedLayer,
    currentSettings.maannousuInfo.selectedLayer,
    "maannousuLayer"
  )

  // Maannousu.info opacity
  state = updateParam(
    state,
    initialSettings.maannousuInfo.opacity,
    currentSettings.maannousuInfo.opacity,
    "maannousuOpacity"
  )

  // Maannousu.info enabled
  state = updateParam(
    state,
    initialSettings.maannousuInfo.enabled,
    currentSettings.maannousuInfo.enabled,
    "maannousuEnabled"
  )

  // Maannousu.info index
  state = updateParam(
    state,
    initialSettings.maannousuInfo.placement,
    currentSettings.maannousuInfo.placement,
    "maannousuIndex"
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

  // Viabundus year
  state = updateParam(
    state,
    initialSettings.viabundus.selectedYear,
    currentSettings.viabundus.selectedYear,
    "viabundusYear"
  )

  // Viabundus opacity
  state = updateParam(
    state,
    initialSettings.viabundus.opacity,
    currentSettings.viabundus.opacity,
    "viabundusOpacity"
  )

  // Viabundus enabled
  state = updateParam(
    state,
    initialSettings.viabundus.enabled,
    currentSettings.viabundus.enabled,
    "viabundusEnabled"
  )

  // 3D models enabled
  state = updateParam(
    state,
    initialSettings.models.enabled,
    currentSettings.models.enabled,
    "modelsEnabled"
  )

  // Maiseman muisti enabled
  state = updateParam(
    state,
    initialSettings.maisemanMuisti.enabled,
    currentSettings.maisemanMuisti.enabled,
    "maisemanMuistiEnabled"
  )

  window.location.hash = stringifyURLParamsToHash({
    ...state.old,
    ...state.next
  })
}
