import { FeatureCollection, Point } from "geojson"
import Feature from "ol/Feature"
import GeoJSON from "ol/format/GeoJSON"
import Geometry from "ol/geom/Geometry"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Fill from "ol/style/Fill"
import RegularShape from "ol/style/RegularShape"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import {
  MaisemanMuistiFeature,
  MaisemanMuistiFeatureProperties
} from "../../common/maisemanMuisti.types"
import { MapFeature } from "../../common/mapFeature.types"
import { getFeatureID } from "../../common/util/featureParser"
import { Settings } from "../../store/storeTypes"

export default class MaisemanMuistiLayer {
  private readonly layer: VectorLayer<VectorSource<Feature<Geometry>>>
  private source?: VectorSource<Feature<Geometry>>
  private readonly style: Style
  private readonly featuresForRegisterId = new Map<
    string,
    MaisemanMuistiFeature[]
  >()

  public constructor(settings: Settings) {
    this.style = new Style({
      image: new RegularShape({
        fill: new Fill({ color: "#f1615b" }),
        stroke: new Stroke({
          color: "black",
          width: 1
        }),
        points: 5,
        radius: 15,
        radius2: 8,
        angle: 0
      })
    })

    this.source = new VectorSource({
      features: []
    })

    this.layer = new VectorLayer({
      source: this.source,
      style: this.style,
      visible: settings.maisemanMuisti.enabled
    })

    // Do not wait
    this.updateLayerSource(settings)
  }

  private fetchGeoJson = async (
    settings: Settings
  ): Promise<FeatureCollection<Point, MaisemanMuistiFeatureProperties>> => {
    const response = await fetch(settings.maisemanMuisti.url.geojson)
    const data = await response.json()

    return data as FeatureCollection<Point, MaisemanMuistiFeatureProperties>
  }

  private updateLayerSource = async (settings: Settings) => {
    const geojsonObject = await this.fetchGeoJson(settings)

    geojsonObject.features.forEach((f) => {
      const id = f.properties.id.toString()
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
      maisemanMuisti: { enabled }
    } = settings
    this.layer.setVisible(enabled)
  }

  public getFeaturesForFeatureRegisterId = (
    id: string
  ): MaisemanMuistiFeature[] => {
    return this.featuresForRegisterId.get(id) || []
  }

  public addMaisemanMuistiFeaturesToFeature = <T extends MapFeature>(
    feature: T
  ): T => {
    return {
      ...feature,
      maisemanMuisti: this.getFeaturesForFeatureRegisterId(
        getFeatureID(feature)
      )
    }
  }

  public getLayer = (): VectorLayer<VectorSource<Feature<Geometry>>> =>
    this.layer
}
