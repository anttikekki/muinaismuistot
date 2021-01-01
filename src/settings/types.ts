import { Language } from "../common/types"

export interface URLSettings {
  zoom?: number
  lang?: Language
  mmlLayer?: string
  museovirastoLayer?: string | Array<string>
  muinaisjaannosTypes?: string | Array<string>
  muinaisjaannosDatings?: string | Array<string>
  ahvenanmaaLayer?: string | Array<string>
  modelsLayer?: string | Array<string>
  maisemanMuistiLayer?: string | Array<string>
}

export const EMPTY_SELECTION = "none"
