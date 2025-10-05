import { Feature, Geometry } from "geojson"
import { AhvenanmaaLayer, MuseovirastoLayer } from "./layers.types"
import { MapFeature } from "./mapFeature.types"

export interface ModelFeatureProperties {
  registryItem: {
    name: string
    id: string | number
    type: MuseovirastoLayer | AhvenanmaaLayer
    url: string
    municipality: string
  }
  model: {
    name: string
    url: string
  }
  author: string
  authorUrl: string
  licence: string
  licenceUrl: string
  createdDate: string
}

export type ModelFeature = Feature<Geometry, ModelFeatureProperties>

export const isModelFeature = (
  feature: MapFeature | Feature
): feature is ModelFeature =>
  "properties" in feature && feature.properties
    ? "registryItem" in feature.properties
    : false
