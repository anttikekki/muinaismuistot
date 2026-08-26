import { MuseovirastoLayer } from "../../common/layers.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../../common/museovirasto.types"
import { MuseovirastoDataSource, Settings } from "../storeTypes"

export const updateMuseovirastoDataSource = (
  settings: Settings,
  dataSource: MuseovirastoDataSource
): Settings => ({
  ...settings,
  museovirasto: {
    ...settings.museovirasto,
    dataSource
  }
})

export const updateMuseovirastoWorkerUrl = (
  settings: Settings,
  worker: string
): Settings => ({
  ...settings,
  museovirasto: {
    ...settings.museovirasto,
    url: {
      ...settings.museovirasto.url,
      worker
    }
  }
})

export const updateMuseovirastoSelectedLayers = (
  settings: Settings,
  selectedLayers: MuseovirastoLayer[]
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      selectedLayers
    }
  }
}

export const updateMuseovirastoLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      opacity
    }
  }
}

export const updateMuseovirastoLayerEnabled = (
  settings: Settings,
  enabled: boolean
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      enabled
    }
  }
}

export const updateSelectMuinaisjaannosTypes = (
  settings: Settings,
  selectedMuinaisjaannosTypes: MuinaisjaannosTyyppi[]
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      selectedMuinaisjaannosTypes
    }
  }
}

export const updateSelectMuinaisjaannosDatings = (
  settings: Settings,
  selectedMuinaisjaannosDatings: MuinaisjaannosAjoitus[]
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      selectedMuinaisjaannosDatings
    }
  }
}
