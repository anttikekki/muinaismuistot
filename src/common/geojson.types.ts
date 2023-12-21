export type GeoJSONPointGeometry = {
  type: "Point"
  coordinates: [number, number]
}

export type GeoJSONPolygonGeometry = {
  type: "Polygon"
  coordinates: Array<Array<[number, number]>>
}

export type GeoJSONFeature<PROPERTIES> = {
  type: "Feature"
  geometry: GeoJSONPointGeometry | GeoJSONPolygonGeometry
  properties: PROPERTIES
}

export type GeoJSONResponse<PROPERTIES> = {
  type: "FeatureCollection"
  features: Array<GeoJSONFeature<PROPERTIES>>
}
