import { Language } from "../common/types"

export interface URLSettings {
  zoom?: number
  lang?: Language
  mmlLayer?: string
  gtkLayer?: string | Array<string>
  gtkOpacity?: number
  museovirastoLayer?: string | Array<string>
  museovirastoOpacity?: number
  muinaisjaannosTypes?: string | Array<string>
  muinaisjaannosDatings?: string | Array<string>
  ahvenanmaaLayer?: string | Array<string>
  ahvenanmaaOpacity?: number
  helsinkiLayer?: string | Array<string>
  helsinkiOpacity?: number
  modelsLayer?: string | Array<string>
  maisemanMuistiLayer?: string | Array<string>
}

export const EMPTY_SELECTION = "none"
