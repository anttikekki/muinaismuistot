export interface WmsGeometryPoint {
  type: "Point"
  coordinates: [number, number]
}

export interface WmsGeometryLineString {
  type: "LineString"
  coordinates: [number, number][]
}

export interface WmsGeometryPolygon {
  type: "Polygon"
  coordinates: [number, number][]
}

export interface WmsGeometryMultiPolygon {
  type: "MultiPolygon"
  coordinates: [number, number][][]
}

export type WmsGeometry =
  | WmsGeometryPoint
  | WmsGeometryLineString
  | WmsGeometryPolygon
  | WmsGeometryMultiPolygon

export interface WmsFeature {
  type: "Feature"
  id: string
  geometry: WmsGeometry
  geometry_name: "geom" | "Shape"
  properties: Record<string, unknown>
}

export interface WmsFeatureInfoResult<WmsFeatureType> {
  type: "FeatureCollection"
  features: WmsFeatureType[]
  totalFeatures: "unknown"
  numberReturned: number
  timeStamp: string // "2021-02-28T18:56:20.579Z"
  crs: {
    type: "name"
    properties: {
      name: "urn:ogc:def:crs:EPSG::3067"
    }
  }
}
