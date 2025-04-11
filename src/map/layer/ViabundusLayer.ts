import Feature from "ol/Feature"
import GeoJSON from "ol/format/GeoJSON"
import Geometry from "ol/geom/Geometry"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import { Store } from "redux"
import { GeoJSONResponse } from "../../common/geojson.types"
import { ViabundusFeatureProperties } from "../../common/viabundus.types"
import { ActionTypes } from "../../store/actionTypes"
import { Settings } from "../../store/storeTypes"

export default class ViabundusLayer {
  private store: Store<Settings, ActionTypes>
  private layer?: VectorLayer<VectorSource<Feature<Geometry>>>
  private source?: VectorSource<Feature<Geometry>>

  public constructor(store: Store<Settings, ActionTypes>) {
    this.store = store
  }

  private fetchGeoJson = async (
    settings: Settings
  ): Promise<GeoJSONResponse<ViabundusFeatureProperties>> => {
    const response = await fetch(settings.viabundus.url.geojson)
    const data = await response.json()

    return data as GeoJSONResponse<ViabundusFeatureProperties>
  }

  public createLayer = async (): Promise<
    VectorLayer<VectorSource<Feature<Geometry>>>
  > => {
    const settings = this.store.getState()
    const geojsonObject = await this.fetchGeoJson(settings)

    this.source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject)
    })

    console.log("features", this.source.getFeatures())

    const lineStyle = new Style({
      stroke: new Stroke({
        color: "#ff0000", // red line
        width: 5
      })
    })

    this.layer = new VectorLayer({
      source: this.source,
      style: lineStyle,
      visible: true
    })

    return this.layer
  }

  public selectedFeatureLayersChanged = () => {
    const settings = this.store.getState()
    this.layer?.setVisible(settings.viabundus.selectedLayers.length > 0)
  }

  public getLayer = ():
    | VectorLayer<VectorSource<Feature<Geometry>>>
    | undefined => this.layer
}
