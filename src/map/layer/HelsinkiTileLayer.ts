import { Coordinate } from "ol/coordinate"
import { containsCoordinate } from "ol/extent"
import TileLayer from "ol/layer/Tile"
import Projection from "ol/proj/Projection"
import TileWMS, { Options } from "ol/source/TileWMS"
import { HelsinkiLayer } from "../../common/layers.types"
import {
  MaalinnoitusWmsFeature,
  MaalinnoitusWmsFeatureInfoResult,
  isMaalinnoitusKohdeFeature
} from "../../common/maalinnoitusHelsinki.types"
import { Settings } from "../../store/storeTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void

export default class HelsinkiTileLayer {
  private source?: TileWMS
  private readonly layer: TileLayer<TileWMS>
  private readonly updateTileLoadingStatus: ShowLoadingAnimationFn

  public constructor(
    settings: Settings,
    updateTileLoadingStatus: ShowLoadingAnimationFn
  ) {
    this.updateTileLoadingStatus = updateTileLoadingStatus

    this.source = this.createSource(settings)
    this.layer = new TileLayer({
      // Extent from EPSG:3067 https://kartta.hel.fi/ws/geoserver/avoindata/wms?request=getCapabilities
      extent: [
        375492.90815974085, 6653540.407044016, 405531.7569803879,
        6689393.357339721
      ],
      source: this.source,
      visible: settings.helsinki.selectedLayers.length > 0
    })
    this.opacityChanged(settings)
    this.updateLayerVisibility(settings)
  }

  private createSource = (settings: Settings) => {
    const options: Options = {
      urls: [settings.helsinki.url.wms],
      params: {
        LAYERS: settings.helsinki.selectedLayers.join(","),
        TILED: true
      },
      serverType: "geoserver"
    }
    const newSource = new TileWMS(options)

    newSource.on("tileloadstart", () => {
      this.updateTileLoadingStatus(true)
    })
    newSource.on("tileloadend", () => {
      this.updateTileLoadingStatus(false)
    })
    newSource.on("tileloaderror", () => {
      this.updateTileLoadingStatus(false)
    })

    return newSource
  }

  private updateLayerSource = (settings: Settings) => {
    this.source = this.createSource(settings)
    this.layer.setSource(this.source)
    this.updateLayerVisibility(settings)
  }

  public updateLayerVisibility = (settings: Settings) => {
    const {
      helsinki: { selectedLayers, enabled }
    } = settings
    this.layer.setVisible(enabled && selectedLayers.length > 0)
  }

  public identifyFeaturesAt = async (
    coordinate: Coordinate,
    resolution: number | undefined,
    projection: Projection,
    settings: Settings
  ): Promise<MaalinnoitusWmsFeature[]> => {
    const extent = this.layer?.getExtent()

    /**
     * Maalinnoitus_karttatekstit layer does not provide any usefull data so
     * let's remove it from identify call
     */
    const selectedLayersWithoutTextLayer =
      settings.helsinki.selectedLayers.filter(
        (layer) => layer !== HelsinkiLayer.Maalinnoitus_karttatekstit
      )

    if (
      !extent ||
      !containsCoordinate(extent, coordinate) ||
      selectedLayersWithoutTextLayer.length === 0
    ) {
      return []
    }

    if (this.source && resolution !== undefined) {
      const url = this.source.getFeatureInfoUrl(
        coordinate,
        resolution,
        projection,
        {
          INFO_FORMAT: "application/json",
          QUERY_LAYERS: selectedLayersWithoutTextLayer.join(","),
          FEATURE_COUNT: 100,
          /**
           * Geoserver vendor specific param to extend the search radius pixels. Similar to ArcGis tolerance.
           * @see https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#buffer
           */
          BUFFER: 15
        }
      )
      if (url) {
        try {
          const response = await fetch(String(url))
          const result =
            (await response.json()) as MaalinnoitusWmsFeatureInfoResult
          return this.removeDuplicateIdentifyFeatures(result.features)
        } catch {
          return []
        }
      }
    }
    return []
  }

  private removeDuplicateIdentifyFeatures = (
    features: MaalinnoitusWmsFeature[]
  ): MaalinnoitusWmsFeature[] => {
    const allKohdeFeatures = features.filter(isMaalinnoitusKohdeFeature)

    return features.filter((f) => {
      // Kohde features sometimes has multiple features with same data. Filter those out.
      if (isMaalinnoitusKohdeFeature(f)) {
        const firstMatch = allKohdeFeatures.find(
          (v) =>
            v.properties.tukikohtanumero === f.properties.tukikohtanumero &&
            v.properties.olotila === f.properties.olotila
        )
        return firstMatch?.id === f.id
      }
      return true
    })
  }

  public selectedFeatureLayersChanged = (settings: Settings) => {
    this.updateLayerSource(settings)
  }

  public opacityChanged = (settings: Settings) => {
    this.layer.setOpacity(settings.helsinki.opacity)
  }

  public getLayer = (): TileLayer<TileWMS> => this.layer
}
