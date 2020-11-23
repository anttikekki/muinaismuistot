import {
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  Settings,
  AhvenanmaaLayer,
  ModelLayer,
  MaisemanMuistiLayer
} from "../common/types"

export const updateMaanmittauslaitosSelectedLayer = (
  settings: Settings,
  selectedLayer: MaanmittauslaitosLayer
): Settings => {
  return {
    ...settings,
    maanmittauslaitos: {
      ...settings.maanmittauslaitos,
      selectedLayer
    }
  }
}

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

export const updateAhvenanmaaSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<AhvenanmaaLayer>
): Settings => {
  return {
    ...settings,
    ahvenanmaa: {
      ...settings.ahvenanmaa,
      selectedLayers
    }
  }
}

export const updateModelSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<ModelLayer>
): Settings => {
  return {
    ...settings,
    models: {
      ...settings.models,
      selectedLayers
    }
  }
}

export const updateMaisemanMuistiSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<MaisemanMuistiLayer>
): Settings => {
  return {
    ...settings,
    maisemanMuisti: {
      ...settings.maisemanMuisti,
      selectedLayers
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
