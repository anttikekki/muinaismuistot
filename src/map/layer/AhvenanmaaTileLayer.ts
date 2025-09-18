import { FeatureCollection, Geometry } from "geojson"
import { Coordinate } from "ol/coordinate"
import { containsCoordinate, Extent } from "ol/extent"
import TileLayer from "ol/layer/Tile"
import { Size } from "ol/size"
import TileArcGISRestSource, { Options } from "ol/source/TileArcGISRest"
import {
  AhvenanmaaArcgisFeature,
  AhvenanmaaArcgisFindResult,
  AhvenanmaaArcgisIdentifyResult,
  AhvenanmaaLayerId,
  AhvenanmaaTypeAndDatingFeatureProperties,
  getAhvenanmaaLayerId
} from "../../common/ahvenanmaa.types"
import { AhvenanmaaLayer } from "../../common/layers.types"
import { Settings } from "../../store/storeTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void

export default class AhvenanmaaTileLayer {
  private source?: TileArcGISRestSource
  private readonly layer: TileLayer<TileArcGISRestSource>
  private readonly updateTileLoadingStatus: ShowLoadingAnimationFn
  private typeAndDatingMap?: ReadonlyMap<
    string,
    AhvenanmaaTypeAndDatingFeatureProperties[]
  >

  public constructor(
    settings: Settings,
    updateTileLoadingStatus: ShowLoadingAnimationFn
  ) {
    this.updateTileLoadingStatus = updateTileLoadingStatus

    this.source = this.createSource(settings)
    this.layer = new TileLayer({
      source: this.source,
      // Extent from EPSG:3067 https://kartor.regeringen.ax/arcgis/services/Kulturarv/Fornminnen/MapServer/WMSServer?request=GetCapabilities&service=WMS
      extent: [65741.9087, 6606901.2261, 180921.4173, 6747168.5691]
    })
    this.opacityChanged(settings)
    this.updateLayerVisibility(settings)
  }

  private toLayerIds = (layers: AhvenanmaaLayer[]): AhvenanmaaLayerId[] => {
    return layers.map(getAhvenanmaaLayerId).sort((a, b) => a - b)
  }

  private getSourceLayersParams = (settings: Settings): string => {
    if (settings.ahvenanmaa.selectedLayers.length > 0) {
      return (
        "show:" + this.toLayerIds(settings.ahvenanmaa.selectedLayers).join(",")
      )
    } else {
      // No selected layers. Hide all.
      return "hide:" + this.toLayerIds(Object.values(AhvenanmaaLayer)).join(",")
    }
  }

  private createSource = (settings: Settings) => {
    const options: Options = {
      urls: [settings.ahvenanmaa.url.export],
      params: {
        layers: this.getSourceLayersParams(settings)
      }
    }
    const newSource = new TileArcGISRestSource(options)

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
      ahvenanmaa: { selectedLayers, enabled }
    } = settings
    this.layer.setVisible(enabled && selectedLayers.length > 0)
  }

  public selectedFeatureLayersChanged = (settings: Settings) => {
    this.updateLayerSource(settings)
  }

  public identifyFeaturesAt = async (
    coordinate: Coordinate,
    mapSize: Size,
    mapExtent: Extent,
    settings: Settings
  ): Promise<AhvenanmaaArcgisIdentifyResult> => {
    const extent = this.layer.getExtent()

    if (
      !extent ||
      !containsCoordinate(extent, coordinate) ||
      settings.ahvenanmaa.selectedLayers.length === 0 ||
      !settings.ahvenanmaa.enabled
    ) {
      return { results: [] }
    }

    const urlParams = new URLSearchParams({
      geometry: coordinate.join(","),
      geometryType: "esriGeometryPoint",
      tolerance: "10",
      imageDisplay: mapSize.join(",") + ",96",
      mapExtent: mapExtent.join(","),
      layers: `visible:${this.toLayerIds(
        settings.ahvenanmaa.selectedLayers
      ).join(",")}`,
      f: "json",
      returnGeometry: "true"
    })

    const url = new URL(settings.ahvenanmaa.url.identify)
    url.search = String(urlParams)

    const response = await fetch(String(url))
    const result = (await response.json()) as AhvenanmaaArcgisIdentifyResult

    return this.addTypeAndDatingToResult(result, settings)
  }

  public findFeatures = async (
    searchText: string,
    settings: Settings
  ): Promise<AhvenanmaaArcgisFindResult> => {
    if (settings.ahvenanmaa.selectedLayers.length === 0) {
      return { results: [] }
    }

    const urlParams = new URLSearchParams({
      searchText: searchText,
      contains: "true",
      searchFields: "Fornlämnings ID, Namn , Beskrivning, Topografi",
      layers: this.toLayerIds(settings.ahvenanmaa.selectedLayers).join(","),
      f: "json",
      returnGeometry: "true",
      returnZ: "false"
    })

    const url = new URL(settings.ahvenanmaa.url.find)
    url.search = String(urlParams)

    const response = await fetch(String(url))
    const result = (await response.json()) as AhvenanmaaArcgisFindResult

    return this.addTypeAndDatingToResult(result, settings)
  }

  private addTypeAndDatingToResult = async (
    data: AhvenanmaaArcgisIdentifyResult,
    settings: Settings
  ): Promise<AhvenanmaaArcgisIdentifyResult> => {
    const typeAndDatingMap = await this.getTypeAndDatingData(settings)
    const result: AhvenanmaaArcgisIdentifyResult = {
      ...data,
      results: data.results.map((result): AhvenanmaaArcgisFeature => {
        if (result.layerName === AhvenanmaaLayer.Fornminnen) {
          const typeAndDating = typeAndDatingMap.get(
            result.attributes["Fornlämnings ID"]
          )
          if (typeAndDating) {
            return {
              ...result,
              attributes: {
                ...result.attributes,
                typeAndDating
              }
            }
          }
        }
        return result
      })
    }
    return result
  }

  private getTypeAndDatingData = async (
    settings: Settings
  ): Promise<
    ReadonlyMap<string, AhvenanmaaTypeAndDatingFeatureProperties[]>
  > => {
    if (this.typeAndDatingMap) {
      return this.typeAndDatingMap
    }

    const map = new Map<string, AhvenanmaaTypeAndDatingFeatureProperties[]>()

    try {
      const response = await fetch(settings.ahvenanmaa.url.typeAndDating)
      const data = (await response.json()) as FeatureCollection<
        Geometry,
        AhvenanmaaTypeAndDatingFeatureProperties
      >

      data.features.forEach((feature) => {
        const id = feature.properties.FornID
        const entry = map.get(id)
        if (entry) {
          map.set(id, [...entry, feature.properties])
        } else {
          map.set(id, [feature.properties])
        }
      })
      this.typeAndDatingMap = map
      return map
    } catch {
      return map
    }
  }

  public opacityChanged = (settings: Settings): void => {
    this.layer.setOpacity(settings.ahvenanmaa.opacity)
  }

  public getLayer = (): TileLayer<TileArcGISRestSource> => this.layer
}
