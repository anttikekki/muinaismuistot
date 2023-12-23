import {
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  AhvenanmaaLayer,
  ModelLayer,
  MaisemanMuistiLayer,
  Language,
  GtkLayer,
  HelsinkiLayer
} from "../common/layers.types"
import { parseURLParams } from "../common/util/URLHashHelper"
import { Settings } from "../store/storeTypes"
import {
  updateAhvenanmaaLayerOpacity,
  updateAhvenanmaaSelectedLayers,
  updateGtkLayerOpacity,
  updateGtkSelectedLayers,
  updateHelsinkiLayerOpacity,
  updateHelsinkiSelectedLayers,
  updateLanguage,
  updateMaanmittauslaitosSelectedLayer,
  updateMaisemanMuistiSelectedLayers,
  updateModelSelectedLayers,
  updateMuseovirastoLayerOpacity,
  updateMuseovirastoSelectedLayers,
  updateSelectMuinaisjaannosDatings,
  updateSelectMuinaisjaannosTypes
} from "../store/reducers"
import { EMPTY_SELECTION, URLSettings } from "./types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../common/museovirasto.types"

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

export const getSettingsFromURL = (settings: Settings): Settings => {
  let newSettings = settings
  const {
    zoom,
    lang,
    mmlLayer,
    gtkLayer,
    gtkOpacity,
    museovirastoLayer,
    museovirastoOpacity,
    muinaisjaannosTypes,
    muinaisjaannosDatings,
    ahvenanmaaLayer,
    ahvenanmaaOpacity,
    helsinkiLayer,
    helsinkiOpacity,
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
