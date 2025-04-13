import { Language } from "../common/layers.types"

export interface URLSettings {
  zoom?: number
  lang?: Language
  mmlLayer?: string
  mmlVanhatKartatLayer?: string | string[]
  mmlVanhatKartatOpacity?: number
  mmlVanhatKartatEnabled?: boolean
  gtkLayer?: string | string[]
  gtkOpacity?: number
  gtkEnabled?: boolean
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
  helsinkiEnabled?: boolean
  modelsLayer?: string | string[]
  maisemanMuistiLayer?: string | string[]
}

export const EMPTY_SELECTION = "none"
