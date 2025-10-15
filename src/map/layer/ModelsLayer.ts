import { FeatureCollection, Point } from "geojson"
import Feature, { FeatureLike } from "ol/Feature"
import GeoJSON from "ol/format/GeoJSON"
import Geometry from "ol/geom/Geometry"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Circle from "ol/style/Circle"
import Fill from "ol/style/Fill"
import RegularShape from "ol/style/RegularShape"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import {
  ModelFeature,
  ModelFeatureProperties
} from "../../common/3dModels.types"
import { FeatureLayer, MuseovirastoLayer } from "../../common/layers.types"
import { MapFeature } from "../../common/mapFeature.types"
import {
  getFeatureLayer,
  getFeatureRegisterID
} from "../../common/util/featureParser"
import { Settings } from "../../store/storeTypes"

export default class ModelsLayer {
  private readonly layer: VectorLayer<VectorSource<Feature<Geometry>>>
  private source?: VectorSource<Feature<Geometry>>
  private readonly stylePointCircle: Style
  private readonly stylePointSquare: Style
  private readonly stylePolygon: Style
  private readonly featuresForRegisterId = new Map<string, ModelFeature[]>()

  public constructor(settings: Settings) {
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

    this.source = new VectorSource({
      features: []
    })
    this.layer = new VectorLayer({
      source: this.source,
      visible: settings.models.enabled,
      style: this.styleForFeature
    })

    // Do not wait
    this.updateLayerSource(settings)
  }

  private fetchGeoJson = async (
    settings: Settings
  ): Promise<FeatureCollection<Point, ModelFeatureProperties>> => {
    const response = await fetch(settings.models.url.geojson)
    const data = await response.json()

    return data as FeatureCollection<Point, ModelFeatureProperties>
  }

  private styleForFeature = (feature: FeatureLike) => {
    switch (feature.getGeometry()?.getType()) {
      case "Point": {
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
      }
      case "Polygon":
        return this.stylePolygon
      default:
        return this.stylePointCircle
    }
  }

  private updateLayerSource = async (settings: Settings) => {
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
    this.layer.setSource(this.source)
  }

  public updateLayerVisibility = (settings: Settings) => {
    const {
      models: { enabled }
    } = settings
    this.layer.setVisible(enabled)
  }

  public getFeaturesForFeatureRegisterId = (
    id: string,
    layer: FeatureLayer
  ): ModelFeature[] => {
    const models = this.featuresForRegisterId.get(id) || []
    return models.filter((m) => m.properties.registryItem.type === layer)
  }

  public addModelsToFeature = <T extends MapFeature>(feature: T): T => {
    return {
      ...feature,
      models: this.getFeaturesForFeatureRegisterId(
        getFeatureRegisterID(feature),
        getFeatureLayer(feature)
      )
    }
  }

  public getLayer = (): VectorLayer<VectorSource<Feature<Geometry>>> =>
    this.layer
}
