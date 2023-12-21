import { AhvenanmaaLayer, MuseovirastoLayer } from "./types"

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
