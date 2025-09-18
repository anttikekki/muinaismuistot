import { Feature, Geometry } from "geojson"
import { AhvenanmaaLayer, MuseovirastoLayer } from "./layers.types"

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

export const isModelFeature = (feature: Feature): feature is ModelFeature =>
  feature.properties ? "registryItem" in feature.properties : false
