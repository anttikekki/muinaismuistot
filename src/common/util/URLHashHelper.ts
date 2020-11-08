import { parse, stringify, StringifiableRecord } from "query-string"
import {
  AhvenanmaaLayer,
  MaanmittauslaitosLayer,
  MaisemanMuistiLayer,
  ModelLayer,
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi,
  MuseovirastoLayer,
  Settings
} from "../types"

const parseURLParams = () => {
  const hash = window.location.hash.replace(";", "&") // Old format used ";" as separator
  return parse(hash, {
    parseNumbers: true,
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
  zoom?: number
  mmlLayer?: string
  museovirastoLayer?: string | Array<string>
  muinaisjaannosTypes?: string | Array<string>
  muinaisjaannosDatings?: string | Array<string>
  ahvenanmaaLayer?: string | Array<string>
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

  // Museovirasto layers
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

  // Museovirasto muinaisjaannos types
  if (
    initialSettings.museovirasto.selectedMuinaisjaannosTypes.every((v) =>
      currentSettings.museovirasto.selectedMuinaisjaannosTypes.includes(v)
    )
  ) {
    oldUrlSettings = {
      ...oldUrlSettings,
      muinaisjaannosTypes: undefined
    }
  } else {
    urlSettings.muinaisjaannosTypes =
      currentSettings.museovirasto.selectedMuinaisjaannosTypes.length > 0
        ? currentSettings.museovirasto.selectedMuinaisjaannosTypes
        : [EMPTY_SELECTION]
  }

  // Museovirasto muinaisjaannos datings
  if (
    initialSettings.museovirasto.selectedMuinaisjaannosDatings.every((v) =>
      currentSettings.museovirasto.selectedMuinaisjaannosDatings.includes(v)
    )
  ) {
    oldUrlSettings = {
      ...oldUrlSettings,
      muinaisjaannosDatings: undefined
    }
  } else {
    urlSettings.muinaisjaannosDatings =
      currentSettings.museovirasto.selectedMuinaisjaannosDatings.length > 0
        ? currentSettings.museovirasto.selectedMuinaisjaannosDatings
        : [EMPTY_SELECTION]
  }

  // Ahvenanmaa layers
  if (
    initialSettings.ahvenanmaa.selectedLayers.every((v) =>
      currentSettings.ahvenanmaa.selectedLayers.includes(v)
    )
  ) {
    oldUrlSettings = {
      ...oldUrlSettings,
      ahvenanmaaLayer: undefined
    }
  } else {
    urlSettings.ahvenanmaaLayer =
      currentSettings.ahvenanmaa.selectedLayers.length > 0
        ? currentSettings.ahvenanmaa.selectedLayers
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

  // Map initial zoom
  if (UrlSettings.zoom !== undefined) {
    newSettings = {
      ...newSettings,
      initialMapZoom: UrlSettings.zoom
    }
  }

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

  // Museovirasto muinaisjaannos types
  if (UrlSettings.muinaisjaannosTypes) {
    const allTypes = Object.values(MuinaisjaannosTyyppi)
    if (
      typeof UrlSettings.muinaisjaannosTypes === "string" &&
      (allTypes.some((v) => v === UrlSettings.muinaisjaannosTypes) ||
        UrlSettings.muinaisjaannosTypes === EMPTY_SELECTION)
    ) {
      newSettings = {
        ...newSettings,
        museovirasto: {
          ...newSettings.museovirasto,
          selectedMuinaisjaannosTypes:
            UrlSettings.muinaisjaannosTypes === EMPTY_SELECTION
              ? []
              : [UrlSettings.muinaisjaannosTypes as MuinaisjaannosTyyppi]
        }
      }
    }
    if (
      Array.isArray(UrlSettings.muinaisjaannosTypes) &&
      UrlSettings.muinaisjaannosTypes.every((v) =>
        allTypes.some((l) => l === v)
      )
    ) {
      newSettings = {
        ...newSettings,
        museovirasto: {
          ...newSettings.museovirasto,
          selectedMuinaisjaannosTypes: UrlSettings.muinaisjaannosTypes as Array<
            MuinaisjaannosTyyppi
          >
        }
      }
    }
  }

  // Museovirasto muinaisjaannos datings
  if (UrlSettings.muinaisjaannosDatings) {
    const allDatings = Object.values(MuinaisjaannosAjoitus)
    if (
      typeof UrlSettings.muinaisjaannosDatings === "string" &&
      (allDatings.some((v) => v === UrlSettings.muinaisjaannosDatings) ||
        UrlSettings.muinaisjaannosDatings === EMPTY_SELECTION)
    ) {
      newSettings = {
        ...newSettings,
        museovirasto: {
          ...newSettings.museovirasto,
          selectedMuinaisjaannosDatings:
            UrlSettings.muinaisjaannosDatings === EMPTY_SELECTION
              ? []
              : [UrlSettings.muinaisjaannosDatings as MuinaisjaannosAjoitus]
        }
      }
    }
    if (
      Array.isArray(UrlSettings.muinaisjaannosDatings) &&
      UrlSettings.muinaisjaannosDatings.every((v) =>
        allDatings.some((l) => l === v)
      )
    ) {
      newSettings = {
        ...newSettings,
        museovirasto: {
          ...newSettings.museovirasto,
          selectedMuinaisjaannosDatings: UrlSettings.muinaisjaannosDatings as Array<
            MuinaisjaannosAjoitus
          >
        }
      }
    }
  }

  // Ahvenanmaa layers
  if (UrlSettings.ahvenanmaaLayer) {
    const allLayers = Object.values(AhvenanmaaLayer)
    if (
      typeof UrlSettings.ahvenanmaaLayer === "string" &&
      (allLayers.some((v) => v === UrlSettings.ahvenanmaaLayer) ||
        UrlSettings.ahvenanmaaLayer === EMPTY_SELECTION)
    ) {
      newSettings = {
        ...newSettings,
        ahvenanmaa: {
          ...newSettings.ahvenanmaa,
          selectedLayers:
            UrlSettings.ahvenanmaaLayer === EMPTY_SELECTION
              ? []
              : [UrlSettings.ahvenanmaaLayer as AhvenanmaaLayer]
        }
      }
    }
    if (
      Array.isArray(UrlSettings.ahvenanmaaLayer) &&
      UrlSettings.ahvenanmaaLayer.every((v) => allLayers.some((l) => l === v))
    ) {
      newSettings = {
        ...newSettings,
        ahvenanmaa: {
          ...newSettings.ahvenanmaa,
          selectedLayers: UrlSettings.ahvenanmaaLayer as Array<AhvenanmaaLayer>
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
