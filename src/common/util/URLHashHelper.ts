import { parse, stringify, StringifiableRecord } from "query-string"
import {
  MaanmittauslaitosLayer,
  MaisemanMuistiLayer,
  ModelLayer,
  MuseovirastoLayer,
  Settings
} from "../types"

const parseURLParams = () => {
  const hash = window.location.hash.replace(";", "&") // Old format used ";" as separator
  return parse(hash, {
    parseBooleans: true,
    arrayFormat: "comma"
  })
}

const stringifyURLParamsToHash = (params: StringifiableRecord): string =>
  `#${stringify(params, {
    arrayFormat: "comma"
  })}`

export const createLocationHash = (coordinates: [number, number]) => {
  return stringifyURLParamsToHash({
    ...parseURLParams(), // Keep old params
    x: coordinates[0],
    y: coordinates[1]
  })
}

export const parseCoordinatesFromURL = (): [number, number] | null => {
  const urlParams = parseURLParams()
  const x = parseFloat(String(urlParams.x))
  const y = parseFloat(String(urlParams.y))

  if (!isNaN(x) && !isNaN(y)) {
    return [x, y]
  }
  return null
}

interface URLSettings {
  mmlLayer?: string
  museovirastoLayer?: string | Array<string>
  modelsVisible?: boolean
  maisemanMuistiLayerVisible?: boolean
}

const EMPTY_SELECTION = "none"

export const updateSettingsToURL = (
  initialSettings: Settings,
  currentSettings: Settings
) => {
  const urlSettings: URLSettings = {}
  let oldUrlSettings = parseURLParams() as URLSettings

  // MML
  if (
    initialSettings.maanmittauslaitos.selectedLayer ===
    currentSettings.maanmittauslaitos.selectedLayer
  ) {
    oldUrlSettings = {
      ...oldUrlSettings,
      mmlLayer: undefined
    }
  } else {
    urlSettings.mmlLayer = currentSettings.maanmittauslaitos.selectedLayer
  }

  // Museovirasto layer
  if (
    initialSettings.museovirasto.selectedLayers.every((v) =>
      currentSettings.museovirasto.selectedLayers.includes(v)
    )
  ) {
    oldUrlSettings = {
      ...oldUrlSettings,
      museovirastoLayer: undefined
    }
  } else {
    urlSettings.museovirastoLayer =
      currentSettings.museovirasto.selectedLayers.length > 0
        ? currentSettings.museovirasto.selectedLayers
        : [EMPTY_SELECTION]
  }

  // 3D models
  if (
    currentSettings.models.selectedLayers.length ===
    initialSettings.models.selectedLayers.length
  ) {
    oldUrlSettings = {
      ...oldUrlSettings,
      modelsVisible: undefined
    }
  } else {
    urlSettings.modelsVisible = currentSettings.models.selectedLayers.length > 0
  }

  // Maiseman muisti
  if (
    currentSettings.maisemanMuisti.selectedLayers.length ===
    initialSettings.maisemanMuisti.selectedLayers.length
  ) {
    oldUrlSettings = {
      ...oldUrlSettings,
      maisemanMuistiLayerVisible: undefined
    }
  } else {
    urlSettings.maisemanMuistiLayerVisible =
      currentSettings.maisemanMuisti.selectedLayers.length > 0
  }

  window.location.hash = stringifyURLParamsToHash({
    ...oldUrlSettings,
    ...urlSettings
  })
}

export const getSettingsFromURL = (settings: Settings): Settings => {
  let newSettings = settings
  const UrlSettings = parseURLParams() as URLSettings

  // MML
  if (
    UrlSettings.mmlLayer &&
    Object.values(MaanmittauslaitosLayer).some(
      (v) => v === UrlSettings.mmlLayer
    )
  ) {
    newSettings = {
      ...newSettings,
      maanmittauslaitos: {
        ...newSettings.maanmittauslaitos,
        selectedLayer: UrlSettings.mmlLayer as MaanmittauslaitosLayer
      }
    }
  }

  // Museovirasto layers
  if (UrlSettings.museovirastoLayer) {
    const allLayers = Object.values(MuseovirastoLayer)
    console.log(UrlSettings.museovirastoLayer)
    console.log(typeof UrlSettings.museovirastoLayer)
    console.log(typeof UrlSettings.museovirastoLayer === "string")
    if (
      typeof UrlSettings.museovirastoLayer === "string" &&
      (allLayers.some((v) => v === UrlSettings.museovirastoLayer) ||
        UrlSettings.museovirastoLayer === EMPTY_SELECTION)
    ) {
      newSettings = {
        ...newSettings,
        museovirasto: {
          ...newSettings.museovirasto,
          selectedLayers:
            UrlSettings.museovirastoLayer === EMPTY_SELECTION
              ? []
              : [UrlSettings.museovirastoLayer as MuseovirastoLayer]
        }
      }
    }
    if (
      Array.isArray(UrlSettings.museovirastoLayer) &&
      UrlSettings.museovirastoLayer.every((v) => allLayers.some((l) => l === v))
    ) {
      newSettings = {
        ...newSettings,
        museovirasto: {
          ...newSettings.museovirasto,
          selectedLayers: UrlSettings.museovirastoLayer as Array<
            MuseovirastoLayer
          >
        }
      }
    }
  }

  // 3D models
  if (UrlSettings.modelsVisible !== undefined) {
    newSettings = {
      ...newSettings,
      models: {
        ...newSettings.models,
        selectedLayers: UrlSettings.modelsVisible ? [ModelLayer.ModelLayer] : []
      }
    }
  }

  // Maiseman muisti
  if (UrlSettings.maisemanMuistiLayerVisible !== undefined) {
    newSettings = {
      ...newSettings,
      maisemanMuisti: {
        ...newSettings.maisemanMuisti,
        selectedLayers: UrlSettings.maisemanMuistiLayerVisible
          ? [MaisemanMuistiLayer.MaisemanMuisti]
          : []
      }
    }
  }

  return newSettings
}
