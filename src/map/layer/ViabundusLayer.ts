import { FeatureCollection, Geometry as GeoJSONGeometry } from "geojson"
import Feature from "ol/Feature"
import GeoJSON from "ol/format/GeoJSON"
import Geometry from "ol/geom/Geometry"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import { ViabundusFeatureProperties } from "../../common/viabundus.types"
import { Settings } from "../../store/storeTypes"

export default class ViabundusLayer {
  private layer: VectorLayer<VectorSource<Feature<Geometry>>>
  private source?: VectorSource<Feature<Geometry>>

  public constructor(settings: Settings) {
    this.source = new VectorSource({
      features: []
    })

    const lineStyle = new Style({
      stroke: new Stroke({
        color: "#ff0000", // red line
        width: 5
      })
    })

    this.layer = new VectorLayer({
      source: this.source,
      style: lineStyle,
      visible: false
    })
    this.updateLayerVisibility(settings)

    if (settings.viabundus.enabled) {
      // Do not await
      this.updateLayerSource(settings)
    }
  }

  private updateLayerSource = async (settings: Settings) => {
    const geojsonObject = await this.fetchGeoJson(settings)

    this.source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject)
    })
    this.layer.setSource(this.source)
  }

  private fetchGeoJson = async (
    settings: Settings
  ): Promise<
    FeatureCollection<GeoJSONGeometry, ViabundusFeatureProperties>
  > => {
    const response = await fetch(settings.viabundus.url.geojson)
    const data = await response.json()

    return data as FeatureCollection<
      GeoJSONGeometry,
      ViabundusFeatureProperties
    >
  }

  public updateLayerVisibility = (settings: Settings) => {
    const {
      viabundus: { selectedLayers, enabled }
    } = settings

    const visible = enabled && selectedLayers.length > 0
    this.layer.setVisible(visible)

    if (visible && this.source?.getFeatures().length === 0) {
      // Do not await
      this.updateLayerSource(settings)
    }
  }

  public selectedFeatureLayersChanged = (settings: Settings) => {
    this.updateLayerVisibility(settings)
  }

  public getLayer = (): VectorLayer<VectorSource<Feature<Geometry>>> =>
    this.layer
}
