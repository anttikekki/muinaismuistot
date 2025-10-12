import { Language } from "../common/layers.types"

export interface URLSettings {
  x?: number
  y?: number
  linkedFeatureLayer?: string
  linkedFeatureId?: string
  linkedFeatureName?: string
  zoom?: number
  lang?: Language
  mmlLayer?: string
  mmlLayerEnabled?: boolean
  mmlVanhatKartatLayer?: string | string[]
  mmlVanhatKartatOpacity?: number
  mmlVanhatKartatEnabled?: boolean
  gtkOpacity?: number
  gtkEnabled?: boolean
  gtktLayer?: string | string[]
  maannousuLayer?: string
  maannousuOpacity?: number
  maannousuEnabled?: boolean
  maannousuIndex?: string
  museovirastoLayer?: string | string[]
  museovirastoOpacity?: number
  museovirastoEnabled?: boolean
  muinaisjaannosTypes?: string | string[]
  muinaisjaannosDatings?: string | string[]
  ahvenanmaaLayer?: string | string[]
  ahvenanmaaOpacity?: number
  ahvenanmaaEnabled?: boolean
  helsinkiLayer?: string | string[]
  helsinkiOpacity?: number
  viabundusYear?: number
  viabundusOpacity?: number
  viabundusEnabled?: boolean
  helsinkiEnabled?: boolean
  modelsEnabled?: boolean
  maisemanMuistiEnabled?: boolean
}

export const EMPTY_SELECTION = "none"
