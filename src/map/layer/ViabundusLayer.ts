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
  isViabundusRoadFeature,
  ViabundusFeature,
  ViabundusFeatureProperties,
  ViabundusFeatureType,
  ViabundusRoadCertainty,
  ViabundusRoadFeature,
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

  public findFeatures = (
    searchText: string,
    settings: Settings
  ): ViabundusFeature[] => {
    if (!settings.viabundus.enabled) {
      return []
    }

    const geoJsonParser = new GeoJSON()
    const searchTextLowerCase = searchText.toLowerCase()
    const result =
      this.source
        ?.getFeatures()
        .filter(
          (f) =>
            f.getProperties().type === ViabundusFeatureType.place ||
            f.getProperties().type === ViabundusFeatureType.road
        )
        .filter((f) =>
          isFeatureVisibleInYear(f, settings.viabundus.selectedYear)
        )
        .filter((f) => {
          if (f.getProperties().type === ViabundusFeatureType.place) {
            return String(f.getProperties().name ?? "")
              .toLowerCase()
              .includes(searchTextLowerCase)
          }
          if (f.getProperties().type === ViabundusFeatureType.road) {
            return (
              String(f.getProperties().descriptionFI ?? "")
                .toLowerCase()
                .includes(searchTextLowerCase) ||
              String(f.getProperties().descriptionEN ?? "")
                .toLowerCase()
                .includes(searchTextLowerCase)
            )
          }
        }) ?? []
    return this.removeDuplicateRoadFeatures(
      geoJsonParser.writeFeaturesObject(result).features as ViabundusFeature[]
    )
  }

  public getLayer = (): VectorLayer<VectorSource<Feature<Geometry>>> =>
    this.layer

  /**
   * Viabundus-aineiston tiet on pilkottu pieniksi palasiksi, joita löytyy sanahaulla
   * tai identify-haulla monta samaa. Poistetaan duplikaatit, koska niitä ei tarvita
   * hakutuloksissa. Ne tarvitaan kyllä teiden piirtämisessä, joten niitä ei voi poistaa
   * lähtöaineistosta.
   */
  public removeDuplicateRoadFeatures = (
    features: ViabundusFeature[]
  ): ViabundusFeature[] => {
    const uniqRoads = features
      .filter((f) => isViabundusRoadFeature(f))
      .reduce((prev, current) => {
        if (
          prev.some(
            (f) =>
              f.properties.roadType === current.properties.roadType &&
              f.properties.fromyear === current.properties.fromyear &&
              f.properties.toyear === current.properties.toyear &&
              f.properties.descriptionFI === current.properties.descriptionFI &&
              f.properties.descriptionEN === current.properties.descriptionEN
          )
        ) {
          return prev
        }

        return [...prev, current]
      }, [] as ViabundusRoadFeature[])

    return [...features.filter((f) => !isViabundusRoadFeature(f)), ...uniqRoads]
  }
}

const isFeatureVisibleInYear = (
  feature: FeatureLike,
  selectedYear: number
): boolean => {
  const props = feature.getProperties() as ViabundusFeatureProperties
  switch (props.type) {
    case ViabundusFeatureType.place:
      if (props.Is_Town) {
        return isYearInTimespan(selectedYear, props.Town_From, props.Town_To)
      } else if (props.Is_Settlement) {
        return isYearInTimespan(
          selectedYear,
          props.Settlement_From,
          props.Settlement_To
        )
      } else if (props.Is_Bridge) {
        return isYearInTimespan(
          selectedYear,
          props.Bridge_From,
          props.Bridge_To
        )
      } else if (props.Is_Harbour) {
        return isYearInTimespan(
          selectedYear,
          props.Harbour_From,
          props.Harbour_To
        )
      } else if (props.Is_Fair) {
        return isYearInTimespan(selectedYear, props.Fair_From, props.Fair_To)
      } else if (props.Is_Toll) {
        return isYearInTimespan(selectedYear, props.Toll_From, props.Toll_To)
      }
      return false
    case ViabundusFeatureType.road:
      return isYearInTimespan(selectedYear, props.fromyear, props.toyear)
    case ViabundusFeatureType.townOutline:
      return isYearInTimespan(selectedYear, props.fromyear, props.toyear)
  }
}

const isYearInTimespan = (
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

const fair = new Style({
  image: new Icon({
    src: "images/viabundus-markkinat.png",
    anchor: [0.5, 1.0]
  })
})

const toll = new Style({
  image: new Icon({
    src: "images/viabundus-tulli.png",
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

const styleFunction =
  (selectedYear: number) =>
  (feature: FeatureLike): Style | undefined => {
    if (!isFeatureVisibleInYear(feature, selectedYear)) {
      return undefined
    }

    const props = feature.getProperties() as ViabundusFeatureProperties
    switch (props.type) {
      case ViabundusFeatureType.place:
        if (props.Is_Town) {
          return town
        } else if (props.Is_Settlement) {
          return settlement
        } else if (props.Is_Bridge) {
          return bridge
        } else if (props.Is_Harbour) {
          return harbour
        } else if (props.Is_Fair) {
          return fair
        } else if (props.Is_Toll) {
          return toll
        }
        return undefined
      case ViabundusFeatureType.road:
        switch (props.roadType) {
          case ViabundusRoadType.land: {
            if (props.certainty === ViabundusRoadCertainty.Uncertain) {
              return roadUncertain
            }
            return road
          }
          case ViabundusRoadType.winter:
            return winterRoad
          case ViabundusRoadType.coast: {
            if (props.certainty === ViabundusRoadCertainty.Uncertain) {
              return waterwayUncertain
            }
            return waterway
          }
          default:
            return road
        }
      case ViabundusFeatureType.townOutline:
        return townOutline
      default:
        return undefined
    }
  }
