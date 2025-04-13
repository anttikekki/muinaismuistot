export interface GeoJSONPointGeometry {
  type: "Point"
  coordinates: [number, number]
}

export interface GeoJSONPolygonGeometry {
  type: "Polygon"
  coordinates: [number, number][][]
}

export interface GeoJSONFeature<PROPERTIES> {
  type: "Feature"
  geometry: GeoJSONPointGeometry | GeoJSONPolygonGeometry
  properties: PROPERTIES
}

export interface GeoJSONResponse<PROPERTIES> {
  type: "FeatureCollection"
  features: GeoJSONFeature<PROPERTIES>[]
}
