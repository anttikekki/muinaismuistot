import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import GeoJSON from "ol/format/GeoJSON"
import {
  GeoJSONResponse,
  MaisemanMuistiFeatureProperties,
  Settings
} from "../../common/types"
import Fill from "ol/style/Fill"
import RegularShape from "ol/style/RegularShape"

export default class MaisemanMuistiLayer {
  private layer?: VectorLayer
  private source?: VectorSource
  private style: Style

  public constructor() {
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

  public createLayer = async (settings: Settings): Promise<VectorLayer> => {
    const geojsonObject = await this.fetchGeoJson(settings)

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

  public selectedFeatureLayersChanged = (settings: Settings) => {
    this.layer?.setVisible(settings.maisemanMuisti.selectedLayers.length > 0)
  }

  public getLayer = (): VectorLayer | undefined => this.layer
}
