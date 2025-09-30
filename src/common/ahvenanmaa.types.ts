import {
  EsriJSONFeature,
  GeometryTypePolygon,
  PolygonGeometry
} from "./esriJSON.type"
import { FeatureSupplementaryData } from "./featureSupplementaryData.types"
import { AhvenanmaaLayer } from "./layers.types"
import { MapFeature } from "./mapFeature.types"

export interface AhvenanmaaTypeAndDatingFeatureProperties {
  FornID: string // "Jo 18.10"
  Typ: number | null // 3
  Und_typ: string | null // "fältbefästning"
  Typ_1: number | null // 6
  Undertyp: string | null // "1900-tal"
  Antal: number // 1
}

type AhvenanmaaForminnenFeatureProperties = {
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
  typeAndDating?: AhvenanmaaTypeAndDatingFeatureProperties[]
}

export interface AhvenanmaaForminnenFeature
  extends FeatureSupplementaryData,
    EsriJSONFeature<
      AhvenanmaaForminnenFeatureProperties,
      GeometryTypePolygon,
      PolygonGeometry
    > {
  layerId: 1
  layerName: AhvenanmaaLayer.Fornminnen
}

type AhvenanmaaMaritimtKulturarvFeatureProperties = {
  OBJECTID: string //"234",
  MfornID: string //"M1 Ha 445.1",
  "Geomtrin skapad": string //"Null",
  "Geometrin uppdaterad": string //"Null",
  Namn: string //"ROTTERDAM",
  Beskrivning: string //"Påträffad av dykare 2008. Skovhel brigg. ",
  Precision: string //"2",
  Lagrum: string //"2007:19",
  SHAPE: string //"Polygon",
  "Beskrivning skapad": string //"Null",
  "Beskrivning uppdaterad": string //"12.11.2019 11:10:45"
}

export interface AhvenanmaaMaritimtKulturarvFeature
  extends FeatureSupplementaryData,
    EsriJSONFeature<
      AhvenanmaaMaritimtKulturarvFeatureProperties,
      GeometryTypePolygon,
      PolygonGeometry
    > {
  layerId: 5
  layerName: AhvenanmaaLayer.MaritimaFornminnen
}
export type AhvenanmaaLayerId = 1 | 5

export const getAhvenanmaaLayerId = (
  layer: AhvenanmaaLayer
): AhvenanmaaLayerId => {
  switch (layer) {
    case AhvenanmaaLayer.Fornminnen:
      return 1
    case AhvenanmaaLayer.MaritimaFornminnen:
      return 5
  }
}

export type AhvenanmaaFeature =
  | AhvenanmaaForminnenFeature
  | AhvenanmaaMaritimtKulturarvFeature

export interface AhvenanmaaEsriJSONIdentifyResult {
  results: AhvenanmaaFeature[]
}

export interface AhvenanmaaEsriJSONFindResult {
  results: AhvenanmaaFeature[]
}

export const isAhvenanmaaFeature = (
  feature: MapFeature
): feature is AhvenanmaaFeature => {
  return (
    "attributes" in feature &&
    (feature.layerName === AhvenanmaaLayer.Fornminnen ||
      feature.layerName === AhvenanmaaLayer.MaritimaFornminnen)
  )
}
