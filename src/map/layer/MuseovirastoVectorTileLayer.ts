import Feature, { FeatureLike } from "ol/Feature"
import MVT from "ol/format/MVT"
import Point from "ol/geom/Point"
import { intersects } from "ol/extent"
import LayerGroup from "ol/layer/Group"
import VectorLayer from "ol/layer/Vector"
import VectorTileLayer from "ol/layer/VectorTile"
import OlMap from "ol/Map"
import { Pixel } from "ol/pixel"
import VectorSource from "ol/source/Vector"
import Style from "ol/style/Style"
import { PMTilesVectorSource } from "ol-pmtiles"
import { Settings } from "../../store/storeTypes"
import {
  MuseovirastoFeature,
  MuseovirastoFeatureInfoResult
} from "../../common/museovirasto.types"
import type { ShowLoadingAnimationFn } from "./MuseovirastoTileLayer"
import {
  FeatureBatchResult,
  FeatureReference,
  pointGeometryFirst,
  toMuseovirastoFeature
} from "./museovirastoFeatureDetails"
import {
  createMuseovirastoAggregateStyle,
  createMuseovirastoPointStyle,
  createMuseovirastoStyle
} from "./museovirastoVectorStyles"
import layerMapping from "../../../infra/museovirasto-map-data-server/layer-mapping.json"
import vocabulary from "../../../infra/museovirasto-map-data-server/poc/web/filter-vocabulary.json"

interface LogicalLayer {
  id: string
  sourceLayer: string
  filter?: { field: string; equals: string }
}

interface ActivePoint {
  feature: FeatureLike
  logicalLayerId: string
}

interface AggregateGroup {
  count: number
  x: number
  y: number
  logicalCounts: Map<string, number>
}

const aggregationEnableThreshold = 30_000
const aggregationDisableThreshold = 20_000
const aggregateGridSize = 64
const logicalLayers = layerMapping.logicalLayers as LogicalLayer[]
const archaeologicalFilterSources = new Set(["archaeological_points"])
const kindCodes = new Map(vocabulary.kinds.map((value, index) => [value, index + 1]))
const typeBits = new Map(vocabulary.types.map((value, index) => [value, 2 ** index]))
const datingBits = new Map(vocabulary.datings.map((value, index) => [value, 2 ** index]))
const logicalLayerLookup = new Map<string, LogicalLayer>()
logicalLayers.forEach((logicalLayer) => {
  const kindCode = logicalLayer.filter
    ? kindCodes.get(logicalLayer.filter.equals)
    : undefined
  logicalLayerLookup.set(
    kindCode === undefined
      ? logicalLayer.sourceLayer
      : `${logicalLayer.sourceLayer}:${kindCode}`,
    logicalLayer
  )
})

export default class MuseovirastoVectorTileLayer {
  private readonly map: OlMap
  private readonly featureBatchUrl: string
  private readonly featuresByRegisterUrl: string
  private readonly searchUrl: string
  private readonly vectorLayer: VectorTileLayer
  private readonly aggregateSource = new VectorSource<Feature<Point>>()
  private readonly aggregateLayer: VectorLayer<VectorSource<Feature<Point>>>
  private readonly layerGroup: LayerGroup
  private readonly enabledLogicalLayers = new Set<string>()
  private readonly styles = new Map<string, Style>()
  private readonly pointStyles = new Map<string, Style>()
  private readonly aggregateStyles = new Map<string, Style>()
  private readonly knownFeatures = new Map<string, FeatureLike>()
  private selectedTypeMask = 0
  private selectedDatingMask = 0
  private aggregationMode = true
  private presentationUpdateScheduled = false
  private tileRevision = 0
  private settingsRevision = 0
  private presentationInputSignature = ""

  public constructor(
    map: OlMap,
    settings: Settings,
    updateTileLoadingStatus: ShowLoadingAnimationFn,
    apiBase = window.location.origin
  ) {
    this.map = map
    this.featureBatchUrl = new URL(
      "/api/museovirasto/features/batch",
      apiBase
    ).href
    this.featuresByRegisterUrl = new URL(
      "/api/museovirasto/features/by-register",
      apiBase
    ).href
    this.searchUrl = new URL("/api/museovirasto/search", apiBase).href
    logicalLayers.forEach((logicalLayer) => {
      this.styles.set(logicalLayer.id, createMuseovirastoStyle(logicalLayer.id, logicalLayer.sourceLayer))
      this.pointStyles.set(logicalLayer.id, createMuseovirastoPointStyle(logicalLayer.id))
    })
    const source = new PMTilesVectorSource({
      url: new URL("/api/museovirasto/pmtiles", apiBase).href,
      format: new MVT(),
      attributions: ["Museovirasto"]
    })
    source.on("tileloadstart", () => updateTileLoadingStatus(true))
    source.on(["tileloadend", "tileloaderror"], () => {
      updateTileLoadingStatus(false)
      this.tileRevision += 1
    })
    this.vectorLayer = new VectorTileLayer({ source, declutter: false, style: this.styleFeature })
    this.aggregateLayer = new VectorLayer({ source: this.aggregateSource, style: this.styleAggregate })
    this.layerGroup = new LayerGroup({ layers: [this.vectorLayer, this.aggregateLayer] })
    this.updateSettings(settings)
    this.map.on("moveend", this.schedulePresentationUpdate)
    this.map.on("rendercomplete", this.schedulePresentationUpdate)
  }

  private styleFeature = (feature: FeatureLike): Style | undefined => {
    this.rememberFeature(feature)
    const logicalLayerId = this.activeLogicalLayerId(feature)
    if (!logicalLayerId || (this.aggregationMode && this.isPointFeature(feature))) return undefined
    return this.isPointFeature(feature) ? this.pointStyles.get(logicalLayerId) : this.styles.get(logicalLayerId)
  }

  private activeLogicalLayerId = (feature: FeatureLike): string | undefined => {
    const sourceLayer = String(feature.get("layer") ?? "")
    const kindCode = Number(feature.get("laji_key"))
    const logicalLayer =
      logicalLayerLookup.get(`${sourceLayer}:${kindCode}`) ??
      logicalLayerLookup.get(sourceLayer)
    if (!logicalLayer || !this.enabledLogicalLayers.has(logicalLayer.id)) return undefined
    if (archaeologicalFilterSources.has(sourceLayer)) {
      if ((Number(feature.get("type_mask") ?? 0) & this.selectedTypeMask) === 0) return undefined
      if ((Number(feature.get("dating_mask") ?? 0) & this.selectedDatingMask) === 0) return undefined
    }
    return logicalLayer.id
  }

  private schedulePresentationUpdate = (): void => {
    if (this.presentationUpdateScheduled) return
    this.presentationUpdateScheduled = true
    requestAnimationFrame(() => {
      this.presentationUpdateScheduled = false
      this.updatePresentation()
    })
  }

  private updatePresentation = (): void => {
    const size = this.map.getSize()
    if (!size) return
    const view = this.map.getView()
    const center = view.getCenter()
    const inputSignature = [
      this.tileRevision,
      this.settingsRevision,
      view.getResolution(),
      center?.[0],
      center?.[1],
      size[0],
      size[1]
    ].join(":")
    if (inputSignature === this.presentationInputSignature) return
    this.presentationInputSignature = inputSignature
    const unique = new Map<string, FeatureLike>()
    const extent = view.calculateExtent(size)
    this.knownFeatures.forEach((feature, key) => {
      const geometry = feature.getGeometry()
      if (geometry && intersects(extent, geometry.getExtent())) {
        unique.set(key, feature)
      }
    })
    const activePoints: ActivePoint[] = []
    for (const feature of unique.values()) {
      if (!this.isPointFeature(feature)) continue
      const logicalLayerId = this.activeLogicalLayerId(feature)
      if (logicalLayerId) activePoints.push({ feature, logicalLayerId })
    }
    const nextMode = this.aggregationMode
      ? activePoints.length >= aggregationDisableThreshold
      : activePoints.length > aggregationEnableThreshold
    const modeChanged = nextMode !== this.aggregationMode
    this.aggregationMode = nextMode
    const target = this.map.getTargetElement()
    target.dataset.museovirastoPresentationMode = nextMode
      ? "aggregated"
      : "individual"
    target.dataset.museovirastoActivePoints = String(activePoints.length)
    if (nextMode) this.rebuildAggregates(activePoints)
    else this.aggregateSource.clear(true)
    if (modeChanged) {
      if (!nextMode) this.presentationInputSignature = ""
      this.vectorLayer.changed()
    }
  }

  private rebuildAggregates = (activePoints: ActivePoint[]): void => {
    const groups = new Map<string, AggregateGroup>()
    for (const { feature, logicalLayerId } of activePoints) {
      const geometry = feature.getGeometry()
      if (!geometry) continue
      const extent = geometry.getExtent()
      const coordinate = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
      const pixel = this.map.getPixelFromCoordinate(coordinate)
      const key = `${Math.floor(pixel[0] / aggregateGridSize)}:${Math.floor(pixel[1] / aggregateGridSize)}`
      const group = groups.get(key)
      if (group) {
        group.count += 1
        group.x += coordinate[0]
        group.y += coordinate[1]
        group.logicalCounts.set(logicalLayerId, (group.logicalCounts.get(logicalLayerId) ?? 0) + 1)
      } else {
        groups.set(key, { count: 1, x: coordinate[0], y: coordinate[1], logicalCounts: new Map([[logicalLayerId, 1]]) })
      }
    }
    const aggregates = [...groups.entries()].map(([id, group]) => {
      const logicalLayerId = [...group.logicalCounts].reduce((dominant, current) => current[1] > dominant[1] ? current : dominant)[0]
      const feature = new Feature({
        geometry: new Point([group.x / group.count, group.y / group.count]),
        count: group.count,
        logicalLayerId
      })
      feature.setId(id)
      return feature
    })
    this.aggregateSource.clear(true)
    this.aggregateSource.addFeatures(aggregates)
  }

  private styleAggregate = (feature: FeatureLike): Style => {
    const key = `${feature.get("logicalLayerId")}:${feature.get("count")}`
    let style = this.aggregateStyles.get(key)
    if (!style) {
      style = createMuseovirastoAggregateStyle(feature)
      this.aggregateStyles.set(key, style)
    }
    return style
  }

  private isPointFeature = (feature: FeatureLike): boolean => feature.getGeometry()?.getType() === "Point"

  private rememberFeature = (feature: FeatureLike): void => {
    const sourceLayer = String(feature.get("layer") ?? "")
    const geometry = feature.getGeometry()
    const fallback = geometry?.getExtent().join(",") ?? "unknown"
    this.knownFeatures.set(`${sourceLayer}:${feature.getId() ?? fallback}`, feature)
  }

  private updateSettings = (settings: Settings): void => {
    this.settingsRevision += 1
    this.enabledLogicalLayers.clear()
    settings.museovirasto.selectedLayers.forEach((layer) => this.enabledLogicalLayers.add(layer))
    this.selectedTypeMask = settings.museovirasto.selectedMuinaisjaannosTypes.reduce((mask, value) => mask | (typeBits.get(value) ?? 0), 0)
    this.selectedDatingMask = settings.museovirasto.selectedMuinaisjaannosDatings.reduce((mask, value) => mask | (datingBits.get(value) ?? 0), 0)
    this.layerGroup?.setVisible(settings.museovirasto.enabled && this.enabledLogicalLayers.size > 0)
    this.layerGroup?.setOpacity(settings.museovirasto.opacity)
    this.vectorLayer?.changed()
    this.schedulePresentationUpdate()
  }

  public handleClick = (pixel: Pixel): boolean => {
    const aggregate = this.map.forEachFeatureAtPixel(pixel, (feature, layer) => layer === this.aggregateLayer ? feature : undefined, { hitTolerance: 5 })
    if (!aggregate) return false
    const geometry = aggregate.getGeometry()
    if (!geometry) return true
    const extent = geometry.getExtent()
    this.map.getView().animate({
      center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
      zoom: Math.min((this.map.getView().getZoom() ?? 0) + 2, 14),
      duration: 250
    })
    return true
  }

  public identifyFeaturesAt = async (
    pixel: Pixel,
    signal?: AbortSignal
  ): Promise<MuseovirastoFeatureInfoResult> => {
    const references = new Map<
      string,
      { reference: FeatureReference; feature: FeatureLike }
    >()
    this.map
      .getFeaturesAtPixel(pixel, {
        layerFilter: (layer) => layer === this.vectorLayer,
        hitTolerance: 15
      })
      .forEach((feature) => {
        if (references.size === 100 || !this.activeLogicalLayerId(feature)) {
          return
        }
        const sourceLayer = String(feature.get("layer") ?? "")
        const featureId = feature.getId()
        if (featureId === undefined) return
        const reference = { sourceLayer, featureId: String(featureId) }
        references.set(`${sourceLayer}:${featureId}`, { reference, feature })
      })

    if (references.size === 0) {
      return { type: "FeatureCollection", features: [] }
    }
    const response = await fetch(this.featureBatchUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features: [...references.values()].map(({ reference }) => reference)
      }),
      signal
    })
    if (!response.ok) {
      throw new Error(`Museovirasto feature batch failed: ${response.status}`)
    }
    const result = (await response.json()) as FeatureBatchResult
    const features = pointGeometryFirst(result.features).flatMap((item): MuseovirastoFeature[] => {
      const match = references.get(`${item.sourceLayer}:${item.featureId}`)
      if (!match) return []
      return [toMuseovirastoFeature(item)]
    })
    if (result.missing.length > 0) {
      console.warn(
        `Museovirasto details missing for ${result.missing.length} features`
      )
    }
    return { type: "FeatureCollection", features }
  }

  public findFeatures = async (
    searchText: string,
    settings: Settings,
    signal?: AbortSignal
  ): Promise<MuseovirastoFeatureInfoResult> => {
    if (
      !settings.museovirasto.enabled ||
      settings.museovirasto.selectedLayers.length === 0
    ) {
      return { type: "FeatureCollection", features: [] }
    }
    const url = new URL(this.searchUrl)
    url.searchParams.set("q", searchText.trim())
    url.searchParams.set(
      "layers",
      settings.museovirasto.selectedLayers.join(",")
    )
    const response = await fetch(url, { signal })
    if (!response.ok) {
      throw new Error(`Museovirasto search failed: ${response.status}`)
    }
    const search = (await response.json()) as {
      results: { logicalLayerId: string; registryId: string }[]
    }
    if (search.results.length === 0) {
      return { type: "FeatureCollection", features: [] }
    }
    return this.findFeaturesByRegister(search.results, signal)
  }

  public findFeaturesByRegister = async (
    references: { logicalLayerId: string; registryId: string }[],
    signal?: AbortSignal
  ): Promise<MuseovirastoFeatureInfoResult> => {
    const response = await fetch(this.featuresByRegisterUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: references }),
      signal
    })
    if (!response.ok) {
      throw new Error(
        `Museovirasto register feature batch failed: ${response.status}`
      )
    }
    const result = (await response.json()) as FeatureBatchResult
    return {
      type: "FeatureCollection",
      features: pointGeometryFirst(result.features).map((item) =>
        toMuseovirastoFeature(item)
      )
    }
  }

  public selectedFeatureLayersChanged = (settings: Settings): void => this.updateSettings(settings)
  public selectedMuinaisjaannosTypesChanged = (settings: Settings): void => this.updateSettings(settings)
  public selectedMuinaisjaannosDatingsChanged = (settings: Settings): void => this.updateSettings(settings)
  public opacityChanged = (settings: Settings): void => this.updateSettings(settings)
  public updateLayerVisibility = (settings: Settings): void => this.updateSettings(settings)
  public getLayer = (): LayerGroup => this.layerGroup
}
