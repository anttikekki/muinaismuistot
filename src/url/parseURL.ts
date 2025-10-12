import {
  AhvenanmaaLayer,
  GtkLayer,
  HelsinkiLayer,
  Language,
  MMLPohjakarttaLayer,
  MMLVanhatKartatLayer,
  MaannousuInfoLayer,
  MaannousuInfoLayerIndex,
  MuseovirastoLayer,
  isFeatureLayer
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
import { updateLinkedFeature } from "../store/reducers/linkedFeature"
import {
  updateMmlPohjakarttaLayerEnabled,
  updateMmlPohjakarttaSelectedLayer,
  updateMmlVanhatKartatLayerEnabled,
  updateMmlVanhatKartatLayerOpacity,
  updateMmlVanhatKartatSelectedLayer
} from "../store/reducers/maanmittauslaitosLayer"
import {
  updateMaannousuInfoLayerEnabled,
  updateMaannousuInfoLayerOpacity,
  updateMaannousuInfoPlacement,
  updateMaannousuInfoSelectedLayer
} from "../store/reducers/maannousuInfoLayer"
import { updateMaisemanMuistiLayerEnabled } from "../store/reducers/maisemanMuistiLayer"
import { updateModelLayerEnabled } from "../store/reducers/modelLayer"
import {
  updateMuseovirastoLayerEnabled,
  updateMuseovirastoLayerOpacity,
  updateMuseovirastoSelectedLayers,
  updateSelectMuinaisjaannosDatings,
  updateSelectMuinaisjaannosTypes
} from "../store/reducers/museovirastoLayer"
import {
  updateViabundusLayerEnabled,
  updateViabundusLayerOpacity,
  updateViabundusYear
} from "../store/reducers/viabundusLayer"
import { updateLanguage } from "../store/rootReducer"
import { Settings } from "../store/storeTypes"
import { EMPTY_SELECTION, URLSettings } from "./types"

const isEnumValue = <ENUM extends Record<string, unknown>>(
  enumObj: ENUM,
  value: unknown
): value is ENUM[keyof ENUM] => Object.values(enumObj).some((v) => v === value)

const isEnumArray = <ENUM extends Record<string, unknown>>(
  enumObj: ENUM,
  valueArray: unknown[]
): valueArray is ENUM[keyof ENUM][] =>
  valueArray.every((v) => isEnumValue(enumObj, v))

const validateAndUpdateUrlParamToSettings = <
  ENUM extends Record<string, unknown>
>(
  settings: Settings,
  enumObj: ENUM,
  value: string | string[],
  updateSettings: (settings: Settings, values: ENUM[keyof ENUM][]) => Settings
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
    x,
    y,
    linkedFeatureLayer,
    linkedFeatureId,
    linkedFeatureName,
    zoom,
    lang,
    mmlLayer,
    mmlLayerEnabled,
    mmlVanhatKartatLayer,
    mmlVanhatKartatOpacity,
    mmlVanhatKartatEnabled,
    gtkOpacity,
    gtkEnabled,
    gtktLayer,
    maannousuLayer,
    maannousuOpacity,
    maannousuEnabled,
    maannousuIndex,
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
    viabundusYear,
    viabundusOpacity,
    viabundusEnabled,
    modelsEnabled,
    maisemanMuistiEnabled
  } = parseURLParams() as URLSettings

  // Linked feature
  if (x !== undefined && y !== undefined) {
    newSettings = updateLinkedFeature(newSettings, {
      coordinates: [x, y],
      layer:
        linkedFeatureLayer && isFeatureLayer(linkedFeatureLayer)
          ? linkedFeatureLayer
          : undefined,
      id: linkedFeatureId ? String(linkedFeatureId) : undefined,
      name: linkedFeatureName
    })
  }

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

  // MML basemap layer
  if (mmlLayer && isEnumValue(MMLPohjakarttaLayer, mmlLayer)) {
    newSettings = updateMmlPohjakarttaSelectedLayer(newSettings, mmlLayer)
  }

  // MML basemap enabled
  if (mmlLayerEnabled !== undefined) {
    newSettings = updateMmlPohjakarttaLayerEnabled(newSettings, mmlLayerEnabled)
  }

  // MML vanhat kartat layers
  if (mmlVanhatKartatLayer) {
    newSettings = validateAndUpdateUrlParamToSettings(
      newSettings,
      MMLVanhatKartatLayer,
      mmlVanhatKartatLayer,
      updateMmlVanhatKartatSelectedLayer
    )
  }

  // MML vanhat kartat opacity
  if (mmlVanhatKartatOpacity !== undefined) {
    newSettings = updateMmlVanhatKartatLayerOpacity(
      newSettings,
      mmlVanhatKartatOpacity
    )
  }

  // MML vanhat kartat enabled
  if (mmlVanhatKartatEnabled !== undefined) {
    newSettings = updateMmlVanhatKartatLayerEnabled(
      newSettings,
      mmlVanhatKartatEnabled
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

  // GTK layers
  if (gtktLayer) {
    newSettings = validateAndUpdateUrlParamToSettings(
      newSettings,
      GtkLayer,
      gtktLayer,
      updateGtkSelectedLayers
    )
  }

  // Maannousu.info layer
  if (maannousuLayer && isEnumValue(MaannousuInfoLayer, maannousuLayer)) {
    newSettings = updateMaannousuInfoSelectedLayer(newSettings, maannousuLayer)
  }

  //  Maannousu.info opacity
  if (maannousuOpacity !== undefined) {
    newSettings = updateMaannousuInfoLayerOpacity(newSettings, maannousuOpacity)
  }

  // Maannousu.info enabled
  if (maannousuEnabled !== undefined) {
    newSettings = updateMaannousuInfoLayerEnabled(newSettings, maannousuEnabled)
  }

  // Maannousu.info index
  if (maannousuIndex && isEnumValue(MaannousuInfoLayerIndex, maannousuIndex)) {
    newSettings = updateMaannousuInfoPlacement(newSettings, maannousuIndex)
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

  // Viabundus year
  if (viabundusYear !== undefined) {
    newSettings = updateViabundusYear(newSettings, viabundusYear)
  }

  // Viabundus opacity
  if (viabundusOpacity !== undefined) {
    newSettings = updateViabundusLayerOpacity(newSettings, viabundusOpacity)
  }

  // Viabundus enabled
  if (viabundusEnabled !== undefined) {
    newSettings = updateViabundusLayerEnabled(newSettings, viabundusEnabled)
  }

  // 3D models enabled
  if (modelsEnabled !== undefined) {
    newSettings = updateModelLayerEnabled(newSettings, modelsEnabled)
  }

  // Maiseman muisti enabled
  if (maisemanMuistiEnabled !== undefined) {
    newSettings = updateMaisemanMuistiLayerEnabled(
      newSettings,
      maisemanMuistiEnabled
    )
  }

  return newSettings
}
