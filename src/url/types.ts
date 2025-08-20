import { Language } from "../common/layers.types"

export interface URLSettings {
  zoom?: number
  lang?: Language
  mmlLayer?: string
  mmlVanhatKartatLayer?: string | string[]
  mmlVanhatKartatOpacity?: number
  mmlVanhatKartatEnabled?: boolean
  gtkOpacity?: number
  gtkEnabled?: boolean
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
  helsinkiEnabled?: boolean
  modelsEnabled?: boolean
  maisemanMuistiEnabled?: boolean
}

export const EMPTY_SELECTION = "none"
