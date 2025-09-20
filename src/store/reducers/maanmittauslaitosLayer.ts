import {
  MMLPohjakarttaLayer,
  MMLVanhatKartatLayer
} from "../../common/layers.types"
import { Settings } from "../storeTypes"

export const updateMmlPohjakarttaSelectedLayer = (
  settings: Settings,
  selectedLayer: MMLPohjakarttaLayer
): Settings => {
  return {
    ...settings,
    maanmittauslaitos: {
      ...settings.maanmittauslaitos,
      basemap: {
        ...settings.maanmittauslaitos.basemap,
        selectedLayer
      }
    }
  }
}

export const updateMmlPohjakarttaLayerEnabled = (
  settings: Settings,
  enabled: boolean
): Settings => {
  return {
    ...settings,
    maanmittauslaitos: {
      ...settings.maanmittauslaitos,
      basemap: {
        ...settings.maanmittauslaitos.basemap,
        enabled
      }
    }
  }
}

export const updateMmlVanhatKartatSelectedLayer = (
  settings: Settings,
  selectedLayers: MMLVanhatKartatLayer[]
): Settings => {
  return {
    ...settings,
    maanmittauslaitos: {
      ...settings.maanmittauslaitos,
      vanhatKartat: {
        ...settings.maanmittauslaitos.vanhatKartat,
        selectedLayers
      }
    }
  }
}

export const updateMmlVanhatKartatLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    maanmittauslaitos: {
      ...settings.maanmittauslaitos,
      vanhatKartat: {
        ...settings.maanmittauslaitos.vanhatKartat,
        opacity
      }
    }
  }
}

export const updateMmlVanhatKartatLayerEnabled = (
  settings: Settings,
  enabled: boolean
): Settings => {
  return {
    ...settings,
    maanmittauslaitos: {
      ...settings.maanmittauslaitos,
      vanhatKartat: {
        ...settings.maanmittauslaitos.vanhatKartat,
        enabled
      }
    }
  }
}
