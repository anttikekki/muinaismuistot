import {
  ArcGisPolygonGeometryFeature,
  GeometryTypePolygon,
  PolygonGeometry
} from "./arcgis.type"
import { FeatureSupplementaryData } from "./featureSupplementaryData.types"
import { MapFeature } from "./mapFeature.types"
import { AhvenanmaaLayer } from "./types"

export interface AhvenanmaaTypeAndDatingFeatureProperties {
  FornID: string // "Jo 18.10"
  Typ: number | null // 3
  Und_typ: string | null // "fältbefästning"
  Typ_1: number | null // 6
  Undertyp: string | null // "1900-tal"
  Antal: number // 1
}

export interface AhvenanmaaForminnenArgisFeature
  extends FeatureSupplementaryData,
    ArcGisPolygonGeometryFeature {
  layerId: 1
  layerName: AhvenanmaaLayer.Fornminnen
  attributes: {
    OBJECTID: string // "1401";
    "Fornlämnings ID": string // "Su 12.27";
    Namn: string // "Null";
    Beskrivning: string // "Null";
    Kommun: string // "Sund";
    By: string // "Kastelholm";
    Topografi: string // "Null";
    Registrering: string // "Null";
    Status: string // "Fast fornlämning";
    Shape: string // "Polygon";
    "Shape.STArea()": string // "2581,011841";
    "Shape.STLength()": string // "203,802335";
    /**
     * Fetched from separata data source in AhvenanmaaTileLayer
     * @see https://www.kartor.ax/datasets/fornminnen-typ-och-datering
     */
    typeAndDating?: Array<AhvenanmaaTypeAndDatingFeatureProperties>
  }
  geometryType: GeometryTypePolygon
  geometry: PolygonGeometry
}

export interface AhvenanmaaMaritimtKulturarvArgisFeature
  extends FeatureSupplementaryData,
    ArcGisPolygonGeometryFeature {
  layerId: 5
  layerName: AhvenanmaaLayer.MaritimtKulturarv
  attributes: {
    OBJECTID: string //"482"
    FornID: string //"M1 Ha 443.2";
    Namn: string //"Okänt";
    Beskrivning: string //"Träfartyg, ev. en jakt. Vraket är beläget längst inne i vikbotten i den sk. Jakthamnen. Vraket mycket sönderbrutet av is- och sjögång. Enligt uppgift skall det röra sig om en slopad postjakt.";
    Kommun: string //"Hammarland";
    By: string //"Signildskär och Märket";
    Precision: string //"1:20 000";
    Lagrum: string //"2§ 1 mom Landskapslagen (2007:19) om skydd av det maritima kulturarvet";
    SHAPE: string //"Polygon";
  }

  geometryType: GeometryTypePolygon
  geometry: PolygonGeometry
}
export type AhvenanmaaLayerId = 1 | 5

export const getAhvenanmaaLayerId = (
  layer: AhvenanmaaLayer
): AhvenanmaaLayerId => {
  switch (layer) {
    case AhvenanmaaLayer.Fornminnen:
      return 1
    case AhvenanmaaLayer.MaritimtKulturarv:
      return 5
  }
}

export type AhvenanmaaArcgisFeature =
  | AhvenanmaaForminnenArgisFeature
  | AhvenanmaaMaritimtKulturarvArgisFeature

export interface AhvenanmaaArcgisIdentifyResult {
  results: Array<AhvenanmaaArcgisFeature>
}

export interface AhvenanmaaArcgisFindResult {
  results: Array<AhvenanmaaArcgisFeature>
}

export const isAhvenanmaaArcgisFeature = (
  feature: MapFeature
): feature is AhvenanmaaArcgisFeature => {
  return (
    "layerName" in feature &&
    (feature.layerName === AhvenanmaaLayer.Fornminnen ||
      feature.layerName === AhvenanmaaLayer.MaritimtKulturarv)
  )
}
