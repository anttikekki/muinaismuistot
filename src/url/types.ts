import { Language } from "../common/layers.types"

export interface URLSettings {
  zoom?: number
  lang?: Language
  mmlLayer?: string
  mmlVanhatKartatLayer?: string | Array<string>
  mmlVanhatKartatOpacity?: number
  mmlVanhatKartatEnabled?: boolean
  gtkLayer?: string | Array<string>
  gtkOpacity?: number
  gtkEnabled?: boolean
  museovirastoLayer?: string | Array<string>
  museovirastoOpacity?: number
  museovirastoEnabled?: boolean
  muinaisjaannosTypes?: string | Array<string>
  muinaisjaannosDatings?: string | Array<string>
  ahvenanmaaLayer?: string | Array<string>
  ahvenanmaaOpacity?: number
  ahvenanmaaEnabled?: boolean
  helsinkiLayer?: string | Array<string>
  helsinkiOpacity?: number
  helsinkiEnabled?: boolean
  modelsLayer?: string | Array<string>
  maisemanMuistiLayer?: string | Array<string>
}

export const EMPTY_SELECTION = "none"
