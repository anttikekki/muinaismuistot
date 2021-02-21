import {
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  Settings,
  AhvenanmaaLayer,
  ModelLayer,
  MaisemanMuistiLayer,
  Language,
  GtkLayer
} from "../common/types"
import { parseURLParams } from "../common/util/URLHashHelper"
import {
  updateAhvenanmaaSelectedLayers,
  updateGtkLayerOpacity,
  updateGtkSelectedLayers,
  updateLanguage,
  updateMaanmittauslaitosSelectedLayer,
  updateMaisemanMuistiSelectedLayers,
  updateModelSelectedLayers,
  updateMuseovirastoSelectedLayers,
  updateSelectMuinaisjaannosDatings,
  updateSelectMuinaisjaannosTypes
} from "./reducers"
import { EMPTY_SELECTION, URLSettings } from "./types"

const isEnumValue = <ENUM>(
  enumObj: ENUM,
  value: any
): value is ENUM[keyof ENUM] => Object.values(enumObj).some((v) => v === value)

const isEnumArray = <ENUM>(
  enumObj: ENUM,
  valueArray: Array<any>
): valueArray is Array<ENUM[keyof ENUM]> =>
  valueArray.every((v) => isEnumValue(enumObj, v))

const validateAndUpdateUrlParamToSettings = <ENUM>(
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
    muinaisjaannosTypes,
    muinaisjaannosDatings,
    ahvenanmaaLayer,
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
