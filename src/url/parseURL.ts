import {
  AhvenanmaaLayer,
  GtkLayer,
  HelsinkiLayer,
  Language,
  MaanmittauslaitosLayer,
  MaanmittauslaitosVanhatKartatLayer,
  MaisemanMuistiLayer,
  ModelLayer,
  MuseovirastoLayer
} from "../common/layers.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../common/museovirasto.types"
import { parseURLParams } from "../common/util/URLHashHelper"
import { initialSettings } from "../store/initialSettings"
import {
  updateAhvenanmaaLayerEnabled,
  updateAhvenanmaaLayerOpacity,
  updateAhvenanmaaSelectedLayers
} from "../store/reducers/ahvenanmaaLayer"
import {
  updateGtkLayerEnabled,
  updateGtkLayerOpacity,
  updateGtkSelectedLayers
} from "../store/reducers/gtkLayer"
import {
  updateHelsinkiLayerEnabled,
  updateHelsinkiLayerOpacity,
  updateHelsinkiSelectedLayers
} from "../store/reducers/helsinkiLayer"
import { updateMaanmittauslaitosSelectedLayer } from "../store/reducers/maanmittauslaitosLayer"
import {
  updateMaanmittauslaitosVanhatKartatLayerEnabled,
  updateMaanmittauslaitosVanhatKartatLayerOpacity,
  updateMaanmittauslaitosVanhatKartatSelectedLayer
} from "../store/reducers/maanmittauslaitosVanhatKartatLayer"
import { updateMaisemanMuistiSelectedLayers } from "../store/reducers/maisemanMuistiLayer"
import { updateModelSelectedLayers } from "../store/reducers/modelLayer"
import {
  updateMuseovirastoLayerEnabled,
  updateMuseovirastoLayerOpacity,
  updateMuseovirastoSelectedLayers,
  updateSelectMuinaisjaannosDatings,
  updateSelectMuinaisjaannosTypes
} from "../store/reducers/museovirastoLayer"
import { updateLanguage } from "../store/rootReducer"
import { Settings } from "../store/storeTypes"
import { EMPTY_SELECTION, URLSettings } from "./types"

const isEnumValue = <ENUM extends Record<string, unknown>>(
  enumObj: ENUM,
  value: any
): value is ENUM[keyof ENUM] => Object.values(enumObj).some((v) => v === value)

const isEnumArray = <ENUM extends Record<string, unknown>>(
  enumObj: ENUM,
  valueArray: Array<any>
): valueArray is Array<ENUM[keyof ENUM]> =>
  valueArray.every((v) => isEnumValue(enumObj, v))

const validateAndUpdateUrlParamToSettings = <
  ENUM extends Record<string, unknown>
>(
  settings: Settings,
  enumObj: ENUM,
  value: string | Array<string>,
  updateSettings: (
    settings: Settings,
    values: Array<ENUM[keyof ENUM]>
  ) => Settings
): Settings => {
  if (value === EMPTY_SELECTION) {
    return updateSettings(settings, [])
  } else if (isEnumValue(enumObj, value)) {
    return updateSettings(settings, [value])
  } else if (Array.isArray(value) && isEnumArray(enumObj, value)) {
    return updateSettings(settings, value)
  }
  return settings
}

export const getSettingsFromURL = (): Settings => {
  let newSettings = initialSettings
  const {
    zoom,
    lang,
    mmlLayer,
    mmlVanhatKartatLayer,
    mmlVanhatKartatOpacity,
    mmlVanhatKartatEnabled,
    gtkLayer,
    gtkOpacity,
    gtkEnabled,
    museovirastoLayer,
    museovirastoOpacity,
    museovirastoEnabled,
    muinaisjaannosTypes,
    muinaisjaannosDatings,
    ahvenanmaaLayer,
    ahvenanmaaOpacity,
    ahvenanmaaEnabled,
    helsinkiLayer,
    helsinkiOpacity,
    helsinkiEnabled,
    modelsLayer,
    maisemanMuistiLayer
  } = parseURLParams() as URLSettings

  // Map initial zoom
  if (zoom !== undefined) {
    newSettings = {
      ...newSettings,
      initialMapZoom: zoom
    }
  }

  // Language
  if (lang !== undefined && isEnumValue(Language, lang)) {
    newSettings = updateLanguage(newSettings, lang)
  }

  // MML
  if (mmlLayer && isEnumValue(MaanmittauslaitosLayer, mmlLayer)) {
    newSettings = updateMaanmittauslaitosSelectedLayer(newSettings, mmlLayer)
  }

  // MML vanhat kartat layers
  if (mmlVanhatKartatLayer) {
    newSettings = validateAndUpdateUrlParamToSettings(
      newSettings,
      MaanmittauslaitosVanhatKartatLayer,
      mmlVanhatKartatLayer,
      updateMaanmittauslaitosVanhatKartatSelectedLayer
    )
  }

  // MML vanhat kartat opacity
  if (mmlVanhatKartatOpacity !== undefined) {
    newSettings = updateMaanmittauslaitosVanhatKartatLayerOpacity(
      newSettings,
      mmlVanhatKartatOpacity
    )
  }

  // MML vanhat kartat enabled
  if (mmlVanhatKartatEnabled !== undefined) {
    newSettings = updateMaanmittauslaitosVanhatKartatLayerEnabled(
      newSettings,
      mmlVanhatKartatEnabled
    )
  }

  // GTK layers
  if (gtkLayer) {
    newSettings = validateAndUpdateUrlParamToSettings(
      newSettings,
      GtkLayer,
      gtkLayer,
      updateGtkSelectedLayers
    )
  }

  // GTK opacity
  if (gtkOpacity !== undefined) {
    newSettings = updateGtkLayerOpacity(newSettings, gtkOpacity)
  }

  // GTK enabled
  if (gtkEnabled !== undefined) {
    newSettings = updateGtkLayerEnabled(newSettings, gtkEnabled)
  }

  // Museovirasto layers
  if (museovirastoLayer) {
    newSettings = validateAndUpdateUrlParamToSettings(
      newSettings,
      MuseovirastoLayer,
      museovirastoLayer,
      updateMuseovirastoSelectedLayers
    )
  }

  // Museovirasto opacity
  if (museovirastoOpacity !== undefined) {
    newSettings = updateMuseovirastoLayerOpacity(
      newSettings,
      museovirastoOpacity
    )
  }

  // Museovirasto enabled
  if (museovirastoEnabled !== undefined) {
    newSettings = updateMuseovirastoLayerEnabled(
      newSettings,
      museovirastoEnabled
    )
  }

  // Museovirasto muinaisjaannos types
  if (muinaisjaannosTypes) {
    newSettings = validateAndUpdateUrlParamToSettings(
      newSettings,
      MuinaisjaannosTyyppi,
      muinaisjaannosTypes,
      updateSelectMuinaisjaannosTypes
    )
  }

  // Museovirasto muinaisjaannos datings
  if (muinaisjaannosDatings) {
    newSettings = validateAndUpdateUrlParamToSettings(
      newSettings,
      MuinaisjaannosAjoitus,
      muinaisjaannosDatings,
      updateSelectMuinaisjaannosDatings
    )
  }

  // Ahvenanmaa layers
  if (ahvenanmaaLayer) {
    newSettings = validateAndUpdateUrlParamToSettings(
      newSettings,
      AhvenanmaaLayer,
      ahvenanmaaLayer,
      updateAhvenanmaaSelectedLayers
    )
  }

  // Ahvenanmaa opacity
  if (ahvenanmaaOpacity !== undefined) {
    newSettings = updateAhvenanmaaLayerOpacity(newSettings, ahvenanmaaOpacity)
  }

  // Ahvenanmaa enabled
  if (ahvenanmaaEnabled !== undefined) {
    newSettings = updateAhvenanmaaLayerEnabled(newSettings, ahvenanmaaEnabled)
  }

  // Helsinki layers
  if (helsinkiLayer) {
    newSettings = validateAndUpdateUrlParamToSettings(
      newSettings,
      HelsinkiLayer,
      helsinkiLayer,
      updateHelsinkiSelectedLayers
    )
  }

  // Helsinki opacity
  if (helsinkiOpacity !== undefined) {
    newSettings = updateHelsinkiLayerOpacity(newSettings, helsinkiOpacity)
  }

  // Helsinki enabled
  if (helsinkiEnabled !== undefined) {
    newSettings = updateHelsinkiLayerEnabled(newSettings, helsinkiEnabled)
  }

  // 3D models
  if (modelsLayer) {
    newSettings = validateAndUpdateUrlParamToSettings(
      newSettings,
      ModelLayer,
      modelsLayer,
      updateModelSelectedLayers
    )
  }

  // Maiseman muisti
  if (maisemanMuistiLayer) {
    newSettings = validateAndUpdateUrlParamToSettings(
      newSettings,
      MaisemanMuistiLayer,
      maisemanMuistiLayer,
      updateMaisemanMuistiSelectedLayers
    )
  }

  return newSettings
}
