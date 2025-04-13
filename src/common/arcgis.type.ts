export type GeometryTypePoint = "esriGeometryPoint"
export type GeometryTypePolygon = "esriGeometryPolygon"
export type GeometryTypePolyline = "esriGeometryPolyline"
export type ArcGisGeometryType =
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

export interface ArcGisPointGeometryFeature {
  geometryType: GeometryTypePoint
  geometry: PointGeometry
}

export interface ArcGisPolygonGeometryFeature {
  geometryType: GeometryTypePolygon
  geometry: PolygonGeometry
}

export interface ArcGisPolylineGeometryFeature {
  geometryType: GeometryTypePolyline
  geometry: PolylineGeometry
}

export type ArcGisFeatureGeometryData =
  | ArcGisPointGeometryFeature
  | ArcGisPolygonGeometryFeature
  | ArcGisPolylineGeometryFeature

export interface ArcGisFeature {
  layerId: number
  layerName: string
  attributes: Record<string, unknown>
}
