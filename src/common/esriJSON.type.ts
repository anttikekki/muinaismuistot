export type GeometryTypePoint = "esriGeometryPoint"
export type GeometryTypePolygon = "esriGeometryPolygon"
export type GeometryTypePolyline = "esriGeometryPolyline"
export type EsriJSONGeometryType =
  | GeometryTypePoint
  | GeometryTypePolygon
  | GeometryTypePolyline

export interface PointGeometry {
  x: number
  y: number
}

export interface PolygonGeometry {
  rings: [number, number][][]
}

export interface PolylineGeometry {
  paths: [number, number][][]
}

export type EsriJSONGeometry =
  | PointGeometry
  | PolygonGeometry
  | PolylineGeometry

export interface EsriJSONFeature<
  ATTRIBUTES = Record<string, unknown>,
  GEOMETRY_TYPE = EsriJSONGeometryType,
  GEOMETRY = EsriJSONGeometry
> {
  layerId: number
  layerName: string
  attributes: ATTRIBUTES
  geometryType: GEOMETRY_TYPE
  geometry: GEOMETRY
}
