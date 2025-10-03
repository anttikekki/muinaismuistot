import { Feature, MultiLineString, Point } from "geojson"
import { ViabundusLayer } from "./layers.types"
import { MapFeature } from "./mapFeature.types"

export enum ViabundusFeatureType {
  road = "road",
  place = "place",
  townOutline = "townOutline"
}

export type ViabunduPopulation = {
  year: number
  /**
   * 0 = < 1000
   * 1 = 1000
   * 2 = 2000
   */
  inhabitants: number
}

export type ViabundusFair = {
  id: number
  nodesid: number
  name: string
  fromyear: string | undefined
  toyear: string | undefined
  category: "local" | "regional"
  date: "fixed" | "movable"
  fixedday: string | undefined
  fixedmonth: string | undefined
  descriptionEN: string | undefined
  descriptionFI: string | undefined
}

export type ViabundusPlaceFeatureProperties = {
  type: ViabundusFeatureType.place
  id: number
  name: string
  Node_Literature: string[] | undefined
  population: ViabunduPopulation[] | undefined
  Gregorian_Calendar: string | undefined

  Is_Settlement: true | undefined
  Settlement_From: string | undefined
  Settlement_To: string | undefined
  Settlement_DescriptionEN: string | undefined
  Settlement_DescriptionFI: string | undefined

  Is_Town: true | undefined
  Town_From: string | undefined
  Town_To: string | undefined
  Town_DescriptionEN: string | undefined
  Town_DescriptionFI: string | undefined

  Is_Bridge: true | undefined
  Bridge_From: string | undefined
  Bridge_To: string | undefined
  Bridge_DescriptionEN: string | undefined
  Bridge_DescriptionFI: string | undefined
  Bridge_Literature: string[] | undefined

  Is_Fair: true | undefined
  Fair_From: string | undefined
  Fair_To: string | undefined
  Fair_DescriptionEN: string | undefined
  Fair_DescriptionFI: string | undefined
  Fair_Literature: string[] | undefined
  fairs: ViabundusFair[] | undefined

  Is_Toll: true | undefined
  Toll_From: string | undefined
  Toll_To: string | undefined
  Toll_DescriptionEN: string | undefined
  Toll_DescriptionFI: string | undefined
  Toll_Literature: string[] | undefined

  Is_Ferry: true | undefined
  Ferry_From: string | undefined
  Ferry_To: string | undefined
  Ferry_DescriptionEN: string | undefined
  Ferry_DescriptionFI: string | undefined
  Ferry_Literature: string[] | undefined

  Is_Harbour: true | undefined
  Harbour_From: string | undefined
  Harbour_To: string | undefined
  Harbour_DescriptionEN: string | undefined
  Harbour_DescriptionFI: string | undefined
}

export enum ViabundusRoadType {
  canal = "canal",
  coast = "coast",
  ferry = "ferry",
  land = "land",
  river = "river",
  winter = "winter"
}

export type ViabundusRoadFeatureProperties = {
  type: ViabundusFeatureType.road
  id: number
  roadType: ViabundusRoadType
  certainty: 1 | 2 | 3
  fromyear: number | undefined
  toyear: number | undefined
  descriptionFI: string | undefined
  descriptionEN: string | undefined
}

export type ViabundusTownOutlineFeatureProperties = {
  type: ViabundusFeatureType.townOutline
  nodesid: number
  fromyear: number | undefined
  toyear: number | undefined
}

export type ViabundusFeatureProperties =
  | ViabundusPlaceFeatureProperties
  | ViabundusRoadFeatureProperties
  | ViabundusTownOutlineFeatureProperties

export type ViabundusPlaceFeature = Feature<
  Point,
  ViabundusPlaceFeatureProperties
>

export type ViabundusRoadFeature = Feature<
  MultiLineString,
  ViabundusRoadFeatureProperties
>
export type ViabundusTownOutlineFeature = Feature<
  Point,
  ViabundusTownOutlineFeatureProperties
>

export type ViabundusFeature =
  | ViabundusPlaceFeature
  | ViabundusRoadFeature
  | ViabundusTownOutlineFeature

export const isViabundusPlaceFeature = (
  feature: Feature
): feature is ViabundusPlaceFeature =>
  feature.properties
    ? "type" in feature.properties &&
      feature.properties.type === ViabundusFeatureType.place
    : false

export const isViabundusRoadFeature = (
  feature: Feature
): feature is ViabundusRoadFeature =>
  feature.properties
    ? "type" in feature.properties &&
      feature.properties.type === ViabundusFeatureType.road
    : false

export const isViabundusTownOutlineFeature = (
  feature: Feature
): feature is ViabundusTownOutlineFeature =>
  feature.properties
    ? "type" in feature.properties &&
      feature.properties.type === ViabundusFeatureType.townOutline
    : false

export const isViabundusFeature = (
  feature: MapFeature | Feature
): feature is ViabundusFeature =>
  "properties" in feature &&
  (isViabundusPlaceFeature(feature) ||
    isViabundusRoadFeature(feature) ||
    isViabundusTownOutlineFeature(feature))

export const getViabundusLayerName = (
  feature: ViabundusFeature
): ViabundusLayer => {
  if (isViabundusPlaceFeature(feature)) {
    return ViabundusLayer.Places
  }
  if (isViabundusRoadFeature(feature)) {
    return ViabundusLayer.Roads
  }
  if (isViabundusTownOutlineFeature(feature)) {
    return ViabundusLayer.TownOutlines
  }
  throw new Error(`Unknown Viabundus feature: ${JSON.stringify(feature)}`)
}
