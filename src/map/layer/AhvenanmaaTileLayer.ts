import TileLayer from "ol/layer/Tile"
import TileArcGISRestSource, { Options } from "ol/source/TileArcGISRest"
import { containsCoordinate, Extent } from "ol/extent"
import { Coordinate } from "ol/coordinate"
import { TileSourceEvent } from "ol/source/Tile"
import { Size } from "ol/size"
import { Settings } from "../../store/storeTypes"
import { Store } from "redux"
import { ActionTypes } from "../../store/actionTypes"
import {
  AhvenanmaaArcgisFeature,
  AhvenanmaaArcgisFindResult,
  AhvenanmaaArcgisIdentifyResult,
  AhvenanmaaLayerId,
  AhvenanmaaTypeAndDatingFeatureProperties,
  getAhvenanmaaLayerId
} from "../../common/ahvenanmaa.types"
import { AhvenanmaaLayer } from "../../common/layers.types"
import { GeoJSONResponse } from "../../common/geojson.types"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (
  layer: TileLayer<TileArcGISRestSource>
) => void

export default class AhvenanmaaTileLayer {
  private source?: TileArcGISRestSource
  private layer?: TileLayer<TileArcGISRestSource>
  private store: Store<Settings, ActionTypes>
  private updateTileLoadingStatus: ShowLoadingAnimationFn
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  private forminnenDataLatestUpdateDate?: Date | null
  private maritimtKulturarvDataLatestUpdateDate?: Date | null
  private typeAndDatingMap?: ReadonlyMap<
    string,
    Array<AhvenanmaaTypeAndDatingFeatureProperties>
  >

  public constructor(
    store: Store<Settings, ActionTypes>,
    updateTileLoadingStatus: ShowLoadingAnimationFn,
    onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.store = store
    this.updateTileLoadingStatus = updateTileLoadingStatus
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn
    this.addLayer()
  }

  private addLayer = () => {
    const settings = this.store.getState()
    this.source = this.createSource()
    this.layer = new TileLayer({
      source: this.source,
      // Extent from EPSG:3067 https://kartor.regeringen.ax/arcgis/services/Kulturarv/Fornminnen/MapServer/WMSServer?request=GetCapabilities&service=WMS
      extent: [65741.9087, 6606901.2261, 180921.4173, 6747168.5691]
    })
    this.layer.setOpacity(settings.ahvenanmaa.opacity)

    this.onLayerCreatedCallbackFn(this.layer)
  }

  private toLayerIds = (
    layers: Array<AhvenanmaaLayer>
  ): Array<AhvenanmaaLayerId> => {
    return layers.map(getAhvenanmaaLayerId).sort((a, b) => a - b)
  }

  private getSourceLayersParams = (): string => {
    const settings = this.store.getState()
    if (settings.ahvenanmaa.selectedLayers.length > 0) {
      return (
        "show:" + this.toLayerIds(settings.ahvenanmaa.selectedLayers).join(",")
      )
    } else {
      // No selected layers. Hide all.
      return "hide:" + this.toLayerIds(Object.values(AhvenanmaaLayer)).join(",")
    }
  }

  private createSource = () => {
    const settings = this.store.getState()
    const options: Options = {
      urls: [settings.ahvenanmaa.url.export],
      params: {
        layers: this.getSourceLayersParams()
      }
    }
    const newSource = new TileArcGISRestSource(options)

    newSource.on("tileloadstart", (evt: TileSourceEvent) => {
      this.updateTileLoadingStatus(true)
    })
    newSource.on("tileloadend", (evt: TileSourceEvent) => {
      this.updateTileLoadingStatus(false)
    })
    newSource.on("tileloaderror", (evt: TileSourceEvent) => {
      this.updateTileLoadingStatus(false)
    })

    return newSource
  }

  private updateLayerSource = () => {
    if (this.layer) {
      this.source = this.createSource()
      this.layer.setSource(this.source)
    }
  }

  public selectedFeatureLayersChanged = () => {
    this.updateLayerSource()
  }

  public identifyFeaturesAt = async (
    coordinate: Coordinate,
    mapSize: Size,
    mapExtent: Extent
  ): Promise<AhvenanmaaArcgisIdentifyResult> => {
    const settings = this.store.getState()
    const extent = this.layer?.getExtent()

    if (
      !extent ||
      !containsCoordinate(extent, coordinate) ||
      settings.ahvenanmaa.selectedLayers.length === 0
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

    return this.addTypeAndDatingToResult(result)
  }

  public findFeatures = async (
    searchText: string
  ): Promise<AhvenanmaaArcgisFindResult> => {
    const settings = this.store.getState()
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

    return this.addTypeAndDatingToResult(result)
  }

  private addTypeAndDatingToResult = async (
    data: AhvenanmaaArcgisIdentifyResult
  ): Promise<AhvenanmaaArcgisIdentifyResult> => {
    const typeAndDatingMap = await this.getTypeAndDatingData()
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

  private getTypeAndDatingData = async (): Promise<
    ReadonlyMap<string, Array<AhvenanmaaTypeAndDatingFeatureProperties>>
  > => {
    const settings = this.store.getState()
    if (this.typeAndDatingMap) {
      return this.typeAndDatingMap
    }

    const map = new Map<
      string,
      Array<AhvenanmaaTypeAndDatingFeatureProperties>
    >()

    try {
      const response = await fetch(settings.ahvenanmaa.url.typeAndDating)
      const data =
        (await response.json()) as GeoJSONResponse<AhvenanmaaTypeAndDatingFeatureProperties>

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

  public opacityChanged = () => {
    if (this.layer) {
      const settings = this.store.getState()
      this.layer.setOpacity(settings.ahvenanmaa.opacity)
    }
  }
}
