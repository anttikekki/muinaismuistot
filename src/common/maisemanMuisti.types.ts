import { MuinaisjaannosAjoitus } from "./museovirasto.types"

export interface MaisemanMuistiFeatureProperties {
  id: number
  number: number
  name: string
  municipality: string
  region: string
  registerName: string
  type: string
  subtype: string
  dating: MuinaisjaannosAjoitus
}
