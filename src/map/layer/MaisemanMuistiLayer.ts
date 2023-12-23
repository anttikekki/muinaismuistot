import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import GeoJSON from "ol/format/GeoJSON"
import Fill from "ol/style/Fill"
import RegularShape from "ol/style/RegularShape"
import { getFeatureID } from "../../common/util/featureParser"
import { Settings } from "../../store/storeTypes"
import { Store } from "redux"
import { ActionTypes } from "../../store/actionTypes"
import Geometry from "ol/geom/Geometry"
import { MaisemanMuistiFeatureProperties } from "../../common/maisemanMuisti.types"
import { GeoJSONFeature, GeoJSONResponse } from "../../common/geojson.types"
import { MapFeature } from "../../common/mapFeature.types"

export default class MaisemanMuistiLayer {
  private store: Store<Settings, ActionTypes>
  private layer?: VectorLayer<VectorSource<Geometry>>
  private source?: VectorSource<Geometry>
  private style: Style
  private featuresForRegisterId = new Map<
    string,
    Array<GeoJSONFeature<MaisemanMuistiFeatureProperties>>
  >()

  public constructor(store: Store<Settings, ActionTypes>) {
    this.store = store
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
  }

  private fetchGeoJson = async (
    settings: Settings
  ): Promise<GeoJSONResponse<MaisemanMuistiFeatureProperties>> => {
    const response = await fetch(settings.maisemanMuisti.url.geojson)
    const data = await response.json()

    return data as GeoJSONResponse<MaisemanMuistiFeatureProperties>
  }

  public createLayer = async (): Promise<
    VectorLayer<VectorSource<Geometry>>
  > => {
    const settings = this.store.getState()
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

    this.layer = new VectorLayer({
      source: this.source,
      style: this.style,
      visible: settings.maisemanMuisti.selectedLayers.length > 0
    })

    return this.layer
  }

  public getFeaturesForFeatureRegisterId = (
    id: string
  ): Array<GeoJSONFeature<MaisemanMuistiFeatureProperties>> => {
    return this.featuresForRegisterId.get(id) || []
  }

  public addMaisemanMuistiFeaturesToFeature = (
    feature: MapFeature
  ): MapFeature => {
    return {
      ...feature,
      maisemanMuisti: this.getFeaturesForFeatureRegisterId(
        getFeatureID(feature)
      )
    }
  }

  public selectedFeatureLayersChanged = () => {
    const settings = this.store.getState()
    this.layer?.setVisible(settings.maisemanMuisti.selectedLayers.length > 0)
  }

  public getLayer = (): VectorLayer<VectorSource<Geometry>> | undefined =>
    this.layer
}
