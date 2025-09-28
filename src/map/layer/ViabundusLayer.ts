import { FeatureCollection, Geometry as GeoJSONGeometry } from "geojson"
import Feature, { FeatureLike } from "ol/Feature"
import GeoJSON from "ol/format/GeoJSON"
import Geometry from "ol/geom/Geometry"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import CircleStyle from "ol/style/Circle"
import Fill from "ol/style/Fill"
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

    this.layer = new VectorLayer({
      source: this.source,
      style: styleFunction,
      visible: false
    })
    this.updateLayerVisibility(settings)
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

// Line (edges)
const lineStyle = new Style({
  stroke: new Stroke({
    color: "#d73027", // red
    width: 3
  })
})

// Point (nodes)
const pointStyle = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({ color: "#4575b4" }), // blue
    stroke: new Stroke({ color: "#ffffff", width: 2 }) // white border
  })
})

// Polygon (towns)
const polygonStyle = new Style({
  stroke: new Stroke({
    color: "#000000", // black outline
    width: 1.5
  }),
  fill: new Fill({
    color: "rgba(166, 217, 106, 0.5)" // greenish fill with transparency
  })
})

// style function
function styleFunction(feature: FeatureLike): Style | undefined {
  const geomType = feature.getGeometry()?.getType()
  switch (geomType) {
    case "LineString":
    case "MultiLineString":
      return lineStyle
    case "Point":
    case "MultiPoint":
      return pointStyle
    case "Polygon":
    case "MultiPolygon":
      return polygonStyle
  }
}
