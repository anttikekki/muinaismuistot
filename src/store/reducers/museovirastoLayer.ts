import { MuseovirastoLayer } from "../../common/layers.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../../common/museovirasto.types"
import { Settings } from "../storeTypes"

export const updateMuseovirastoSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<MuseovirastoLayer>
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
  selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>
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
  selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      selectedMuinaisjaannosDatings
    }
  }
}
