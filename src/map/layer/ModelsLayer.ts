import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Stroke from "ol/style/Stroke"
import Circle from "ol/style/Circle"
import RegularShape from "ol/style/RegularShape"
import Style from "ol/style/Style"
import GeoJSON from "ol/format/GeoJSON"
import {
  GeoJSONResponse,
  ModelFeatureProperties,
  MuseovirastoLayer,
  Settings
} from "../../common/types"
import { FeatureLike } from "ol/Feature"
import { getGeoJSONDataLatestUpdateDate } from "../../common/util/featureParser"
import Fill from "ol/style/Fill"

export type OnLayersCreatedCallbackFn = (layer: VectorLayer) => void

export default class ModelsLayer {
  private settings: Settings
  private layer?: VectorLayer
  private source?: VectorSource
  private stylePointCircle: Style
  private stylePointSquare: Style
  private stylePolygon: Style
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  private dataLatestUpdateDate?: Date

  public constructor(
    settings: Settings,
    onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.settings = settings
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn

    this.stylePointCircle = new Style({
      image: new Circle({
        stroke: new Stroke({
          color: "black",
          width: 2
        }),
        radius: 7
      })
    })
    this.stylePointSquare = new Style({
      image: new RegularShape({
        stroke: new Stroke({
          color: "black",
          width: 2
        }),
        points: 4,
        radius: 7,
        angle: Math.PI / 4
      })
    })
    this.stylePolygon = new Style({
      stroke: new Stroke({
        color: "black",
        width: 4
      }),
      fill: new Fill({
        /**
         * Polygon feature transparent fill is required or this layers getFeaturesAtPixel() wont find
         * polygon features if center of the feature is clicked. Fill fixes this.
         */
        color: "rgba(255, 255, 255, 0.01)"
      })
    })

    this.fetchGeoJson().then(this.addFeaturesToLayer)
  }

  private fetchGeoJson = async (): Promise<
    GeoJSONResponse<ModelFeatureProperties>
  > => {
    const response = await fetch(this.settings.models.url.geojson)
    const data = await response.json()

    return data as GeoJSONResponse<ModelFeatureProperties>
  }

  private addFeaturesToLayer = (
    geojsonObject: GeoJSONResponse<ModelFeatureProperties>
  ) => {
    this.source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject)
    })
    this.layer = new VectorLayer({
      source: this.source,
      visible: this.settings.models.selectedLayers.length > 0,
      style: (feature: FeatureLike) => {
        switch (feature.getGeometry()?.getType()) {
          case "Point":
            const properties = feature.getProperties() as ModelFeatureProperties
            if (
              properties.registryItem.type ===
              MuseovirastoLayer.Muinaisjaannokset_piste
            ) {
              return this.stylePointCircle
            }
            if (
              properties.registryItem.type ===
              MuseovirastoLayer.Suojellut_rakennukset_piste
            ) {
              return this.stylePointSquare
            }
            return this.stylePointCircle
          case "Polygon":
            return this.stylePolygon
          default:
            return this.stylePointCircle
        }
      }
    })
    this.onLayerCreatedCallbackFn(this.layer)
  }

  public selectedFeatureLayersChanged = (settings: Settings) => {
    this.settings = settings
    this.layer?.setVisible(settings.models.selectedLayers.length > 0)
  }

  public getLayer = (): VectorLayer | undefined => this.layer

  public getDataLatestUpdateDate = async (): Promise<Date> => {
    if (this.dataLatestUpdateDate) {
      return Promise.resolve(this.dataLatestUpdateDate)
    }
    const data = await this.fetchGeoJson()
    return getGeoJSONDataLatestUpdateDate(data.features)
  }
}
