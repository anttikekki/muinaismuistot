export type GeometryTypePoint = "esriGeometryPoint"
export type GeometryTypePolygon = "esriGeometryPolygon"
export type GeometryTypePolyline = "esriGeometryPolyline"
export type GeometryType =
  | GeometryTypePoint
  | GeometryTypePolygon
  | GeometryTypePolyline

export interface PointGeometry {
  x: number
  y: number
}

export interface PolygonGeometry {
  rings: Array<Array<[number, number]>>
}

export interface PolylineGeometry {
  paths: Array<Array<[number, number]>>
}
