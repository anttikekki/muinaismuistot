import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Stroke from "ol/style/Stroke"
import Circle from "ol/style/Circle"
import RegularShape from "ol/style/RegularShape"
import Style from "ol/style/Style"
import GeoJSON from "ol/format/GeoJSON"
import { FeatureLike } from "ol/Feature"
import {
  getFeatureID,
  getGeoJSONDataLatestUpdateDate
} from "../../common/util/featureParser"
import Fill from "ol/style/Fill"
import { Settings } from "../../store/storeTypes"
import { Store } from "redux"
import { ActionTypes } from "../../store/actionTypes"
import Geometry from "ol/geom/Geometry"
import { ModelFeatureProperties } from "../../common/3dModels.types"
import { GeoJSONFeature, GeoJSONResponse } from "../../common/geojson.types"
import { MuseovirastoLayer } from "../../common/types"

export default class ModelsLayer {
  private store: Store<Settings, ActionTypes>
  private layer?: VectorLayer<VectorSource<Geometry>>
  private source?: VectorSource<Geometry>
  private stylePointCircle: Style
  private stylePointSquare: Style
  private stylePolygon: Style
  private dataLatestUpdateDate?: Date
  private featuresForRegisterId = new Map<
    string,
    Array<GeoJSONFeature<ModelFeatureProperties>>
  >()

  public constructor(store: Store<Settings, ActionTypes>) {
    this.store = store
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
  }

  private fetchGeoJson = async (
    settings: Settings
  ): Promise<GeoJSONResponse<ModelFeatureProperties>> => {
    const response = await fetch(settings.models.url.geojson)
    const data = await response.json()

    return data as GeoJSONResponse<ModelFeatureProperties>
  }

  private styleForFeature = (feature: FeatureLike) => {
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

  public createLayer = async (): Promise<
    VectorLayer<VectorSource<Geometry>>
  > => {
    const settings = this.store.getState()
    const geojsonObject = await this.fetchGeoJson(settings)

    geojsonObject.features.forEach((f) => {
      const id = f.properties.registryItem.id.toString()
      const modelsForFeature = this.featuresForRegisterId.get(id)

      if (modelsForFeature) {
        modelsForFeature.push(f)
      } else {
        this.featuresForRegisterId.set(id, [f])
      }
    })

    this.source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject)
    })
    this.layer = new VectorLayer({
      source: this.source,
      visible: settings.models.selectedLayers.length > 0,
      style: this.styleForFeature
    })

    return this.layer
  }

  public getFeaturesForFeatureRegisterId = (
    id: string,
    layer: ArgisFeatureLayer
  ): Array<GeoJSONFeature<ModelFeatureProperties>> => {
    const models = this.featuresForRegisterId.get(id) || []
    return models.filter((m) => m.properties.registryItem.type === layer)
  }

  public addFeaturesForArgisFeature = (feature: ArgisFeature): ArgisFeature => {
    return {
      ...feature,
      models: this.getFeaturesForFeatureRegisterId(
        getFeatureID(feature),
        feature.layerName
      )
    }
  }

  public selectedFeatureLayersChanged = () => {
    const settings = this.store.getState()
    this.layer?.setVisible(settings.models.selectedLayers.length > 0)
  }

  public getLayer = (): VectorLayer<VectorSource<Geometry>> | undefined =>
    this.layer

  public getDataLatestUpdateDate = async (): Promise<Date> => {
    const settings = this.store.getState()
    if (this.dataLatestUpdateDate) {
      return this.dataLatestUpdateDate
    }
    const data = await this.fetchGeoJson(settings)
    return getGeoJSONDataLatestUpdateDate(data.features)
  }
}
