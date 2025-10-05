import { Feature, Point } from "geojson"
import { MapFeature } from "./mapFeature.types"
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

export type MaisemanMuistiFeature = Feature<
  Point,
  MaisemanMuistiFeatureProperties
>

export const isMaisemanMuistiFeature = (
  feature: MapFeature | Feature
): feature is MaisemanMuistiFeature =>
  "properties" in feature && feature.properties
    ? "registerName" in feature.properties
    : false
