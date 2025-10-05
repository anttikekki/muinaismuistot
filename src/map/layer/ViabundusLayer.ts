import debounce from "debounce"
import { FeatureCollection, Geometry as GeoJSONGeometry } from "geojson"
import Feature, { FeatureLike } from "ol/Feature"
import GeoJSON from "ol/format/GeoJSON"
import Geometry from "ol/geom/Geometry"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Fill from "ol/style/Fill"
import Icon from "ol/style/Icon"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import {
  ViabundusFeatureProperties,
  ViabundusRoadCertainty,
  ViabundusRoadType
} from "../../common/viabundus.types"
import { Settings } from "../../store/storeTypes"

type ShowLoadingAnimationFn = (show: boolean) => void

export default class ViabundusLayer {
  private readonly layer: VectorLayer<VectorSource<Feature<Geometry>>>
  private readonly updateGeoJsonLoadingStatus: ShowLoadingAnimationFn
  private source?: VectorSource<Feature<Geometry>>

  public constructor(
    settings: Settings,
    updateGeoJsonLoadingStatus: ShowLoadingAnimationFn
  ) {
    this.updateGeoJsonLoadingStatus = updateGeoJsonLoadingStatus

    this.source = new VectorSource({
      features: []
    })

    this.layer = new VectorLayer({
      source: this.source,
      style: styleFunction(settings.viabundus.selectedYear),
      visible: false,
      opacity: settings.viabundus.opacity
    })
    this.updateLayerVisibility(settings)
  }

  private updateLayerSource = async (settings: Settings) => {
    this.updateGeoJsonLoadingStatus(true)
    const geojsonObject = await this.fetchGeoJson(settings)

    this.source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject)
    })
    this.layer.setSource(this.source)
    this.updateGeoJsonLoadingStatus(false)
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
      viabundus: { enabled }
    } = settings

    this.layer.setVisible(enabled)

    if (enabled && this.source?.getFeatures().length === 0) {
      // Do not await
      this.updateLayerSource(settings)
    }
  }

  public opacityChanged = (settings: Settings) => {
    this.layer.setOpacity(settings.viabundus.opacity)
  }

  // Päiviteään vuosi vain 200ms välein. UI:n slidet lähettää
  // päivityksiä sliderista jokaiselle vuodelle.
  public yearChanged = debounce((selectedYear: number) => {
    this.layer.setStyle(styleFunction(selectedYear))
  }, 200)

  public getLayer = (): VectorLayer<VectorSource<Feature<Geometry>>> =>
    this.layer
}

const road = new Style({
  stroke: new Stroke({
    color: "#cc0000",
    width: 3
  })
})

const roadUncertain = new Style({
  stroke: new Stroke({
    color: "#cc0000",
    width: 3,
    lineDash: [20, 5]
  })
})

const winterRoad = new Style({
  stroke: new Stroke({
    color: "#663300",
    width: 3,
    lineDash: [20, 5]
  })
})

const waterway = new Style({
  stroke: new Stroke({
    color: "#017acc",
    width: 3
  })
})

const waterwayUncertain = new Style({
  stroke: new Stroke({
    color: "#017acc",
    width: 3,
    lineDash: [20, 5]
  })
})

const town = new Style({
  image: new Icon({
    src: "images/viabundus-kaupunki.png",
    anchor: [0.5, 1.0]
  })
})

const settlement = new Style({
  image: new Icon({
    src: "images/viabundus-asuttu-paikka.png",
    anchor: [0.5, 1.0]
  })
})

const harbour = new Style({
  image: new Icon({
    src: "images/viabundus-satama.png",
    anchor: [0.5, 1.0]
  })
})

const bridge = new Style({
  image: new Icon({
    src: "images/viabundus-silta.png",
    anchor: [0.5, 1.0]
  })
})

const townOutline = new Style({
  stroke: new Stroke({
    color: "#000000",
    width: 1.5
  }),
  fill: new Fill({
    color: "rgba(238, 218, 216, 0.5)"
  })
})

const isFeatureVisible = (
  selectedYear: number,
  fromYear: number | undefined,
  toYear: number | undefined
): boolean => {
  if (fromYear && fromYear > selectedYear) {
    return false
  }
  if (toYear && toYear < selectedYear) {
    return false
  }
  return true
}

const styleFunction =
  (selectedYear: number) =>
  (feature: FeatureLike): Style | undefined => {
    const geomType = feature.getGeometry()?.getType()
    switch (geomType) {
      case "LineString":
      case "MultiLineString": {
        const { roadType, certainty, fromyear, toyear } =
          feature.getProperties()

        if (!isFeatureVisible(selectedYear, fromyear, toyear)) {
          return undefined
        }

        switch (roadType) {
          case ViabundusRoadType.land: {
            if (certainty === ViabundusRoadCertainty.Uncertain) {
              return roadUncertain
            }
            return road
          }
          case ViabundusRoadType.winter:
            return winterRoad
          case ViabundusRoadType.coast: {
            if (certainty === ViabundusRoadCertainty.Uncertain) {
              return waterwayUncertain
            }
            return waterway
          }
          default:
            return road
        }
      }
      case "Point":
      case "MultiPoint": {
        const { Is_Town, Is_Settlement, Is_Bridge, Is_Harbour } =
          feature.getProperties()
        if (Is_Town) {
          const { Town_From, Town_To } = feature.getProperties()
          if (!isFeatureVisible(selectedYear, Town_From, Town_To)) {
            return undefined
          }
          return town
        } else if (Is_Settlement) {
          const { Settlement_From, Settlement_To } = feature.getProperties()
          if (!isFeatureVisible(selectedYear, Settlement_From, Settlement_To)) {
            return undefined
          }
          return settlement
        } else if (Is_Bridge) {
          const { Bridge_From, Bridge_To } = feature.getProperties()
          if (!isFeatureVisible(selectedYear, Bridge_From, Bridge_To)) {
            return undefined
          }
          return bridge
        } else if (Is_Harbour) {
          const { Harbour_From, Harbour_To } = feature.getProperties()
          if (!isFeatureVisible(selectedYear, Harbour_From, Harbour_To)) {
            return undefined
          }
          return harbour
        }
      }
      case "Polygon":
      case "MultiPolygon": {
        const { fromyear, toyear } = feature.getProperties()
        if (!isFeatureVisible(selectedYear, fromyear, toyear)) {
          return undefined
        }
        return townOutline
      }
    }
  }
