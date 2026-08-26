import Feature, { FeatureLike } from "ol/Feature"
import { Geometry } from "geojson"
import MVT from "ol/format/MVT"
import Point from "ol/geom/Point"
import { intersects } from "ol/extent"
import LayerGroup from "ol/layer/Group"
import VectorLayer from "ol/layer/Vector"
import VectorTileLayer from "ol/layer/VectorTile"
import OlMap from "ol/Map"
import { Pixel } from "ol/pixel"
import VectorSource from "ol/source/Vector"
import CircleStyle from "ol/style/Circle"
import Fill from "ol/style/Fill"
import RegularShape from "ol/style/RegularShape"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import Text from "ol/style/Text"
import { PMTilesVectorSource } from "ol-pmtiles"
import { Settings } from "../../store/storeTypes"
import {
  MuseovirastoFeature,
  MuseovirastoFeatureInfoResult
} from "../../common/museovirasto.types"
import { MuseovirastoLayer } from "../../common/layers.types"
import type { ShowLoadingAnimationFn } from "./MuseovirastoTileLayer"
import layerMapping from "../../../infra/museovirasto-map-data/contract/layer-mapping.json"
import vocabulary from "../../../infra/museovirasto-map-data/contract/filter-vocabulary.json"

interface LogicalLayer {
  id: string
  sourceLayer: string
  filter?: { field: string; equals: string }
}

interface FeatureReference {
  sourceLayer: string
  featureId: string
}

interface FeatureBatchItem extends FeatureReference {
  logicalLayerId: string
  geometry: Geometry
  properties: Record<string, unknown> & {
    registryId: string | null
    name: string | null
    municipality: string | null
  }
  relatedArchaeologicalSites?: {
    registryId: string
    name: string | null
  }[]
}

interface FeatureBatchResult {
  features: FeatureBatchItem[]
  missing: FeatureReference[]
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
const kindCodes = new Map(
  vocabulary.kinds.map((value, index) => [value, index + 1])
)
const typeBits = new Map(
  vocabulary.types.map((value, index) => [value, 2 ** index])
)
const datingBits = new Map(
  vocabulary.datings.map((value, index) => [value, 2 ** index])
)
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
  private pendingSettings?: Settings
  private settingsUpdateFrame?: number
  private settingsUpdateTimer?: number
  private presentationUpdateFrame?: number
  private presentationUpdateTimer?: number
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
      this.styles.set(
        logicalLayer.id,
        createMuseovirastoStyle(logicalLayer.id, logicalLayer.sourceLayer)
      )
      this.pointStyles.set(
        logicalLayer.id,
        createMuseovirastoPointStyle(logicalLayer.id)
      )
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
    this.vectorLayer = new VectorTileLayer({
      source,
      declutter: false,
      style: this.styleFeature
    })
    this.aggregateLayer = new VectorLayer({
      source: this.aggregateSource,
      style: this.styleAggregate
    })
    this.layerGroup = new LayerGroup({
      layers: [this.vectorLayer, this.aggregateLayer]
    })
    this.updateSettings(settings)
    this.map.on("moveend", this.schedulePresentationUpdate)
    this.map.on("rendercomplete", this.schedulePresentationUpdate)
  }

  private styleFeature = (feature: FeatureLike): Style | undefined => {
    this.rememberFeature(feature)
    const logicalLayerId = this.activeLogicalLayerId(feature)
    if (
      !logicalLayerId ||
      (this.aggregationMode && this.isPointFeature(feature))
    )
      return undefined
    return this.isPointFeature(feature)
      ? this.pointStyles.get(logicalLayerId)
      : this.styles.get(logicalLayerId)
  }

  private activeLogicalLayerId = (feature: FeatureLike): string | undefined => {
    const sourceLayer = String(feature.get("layer") ?? "")
    const kindCode = Number(feature.get("laji_key"))
    const logicalLayer =
      logicalLayerLookup.get(`${sourceLayer}:${kindCode}`) ??
      logicalLayerLookup.get(sourceLayer)
    if (!logicalLayer || !this.enabledLogicalLayers.has(logicalLayer.id))
      return undefined
    if (archaeologicalFilterSources.has(sourceLayer)) {
      if ((Number(feature.get("type_mask") ?? 0) & this.selectedTypeMask) === 0)
        return undefined
      if (
        (Number(feature.get("dating_mask") ?? 0) & this.selectedDatingMask) ===
        0
      )
        return undefined
    }
    return logicalLayer.id
  }

  private schedulePresentationUpdate = (): void => {
    if (this.presentationUpdateFrame !== undefined) {
      cancelAnimationFrame(this.presentationUpdateFrame)
    }
    if (this.presentationUpdateTimer !== undefined) {
      window.clearTimeout(this.presentationUpdateTimer)
    }
    this.presentationUpdateFrame = requestAnimationFrame(() => {
      this.presentationUpdateFrame = undefined
      // Let the browser paint the settings control before clustering starts.
      this.presentationUpdateTimer = window.setTimeout(() => {
        this.presentationUpdateTimer = undefined
        this.updatePresentation()
      }, 25)
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
      } else {
        this.knownFeatures.delete(key)
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
      const coordinate = [
        (extent[0] + extent[2]) / 2,
        (extent[1] + extent[3]) / 2
      ]
      const pixel = this.map.getPixelFromCoordinate(coordinate)
      const key = `${Math.floor(pixel[0] / aggregateGridSize)}:${Math.floor(pixel[1] / aggregateGridSize)}`
      const group = groups.get(key)
      if (group) {
        group.count += 1
        group.x += coordinate[0]
        group.y += coordinate[1]
        group.logicalCounts.set(
          logicalLayerId,
          (group.logicalCounts.get(logicalLayerId) ?? 0) + 1
        )
      } else {
        groups.set(key, {
          count: 1,
          x: coordinate[0],
          y: coordinate[1],
          logicalCounts: new Map([[logicalLayerId, 1]])
        })
      }
    }
    const aggregates = [...groups.entries()].map(([id, group]) => {
      const logicalLayerId = [...group.logicalCounts].reduce(
        (dominant, current) => (current[1] > dominant[1] ? current : dominant)
      )[0]
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

  private isPointFeature = (feature: FeatureLike): boolean =>
    feature.getGeometry()?.getType() === "Point"

  private rememberFeature = (feature: FeatureLike): void => {
    const sourceLayer = String(feature.get("layer") ?? "")
    const geometry = feature.getGeometry()
    const fallback = geometry?.getExtent().join(",") ?? "unknown"
    this.knownFeatures.set(
      `${sourceLayer}:${feature.getId() ?? fallback}`,
      feature
    )
  }

  private updateSettings = (settings: Settings): void => {
    this.settingsRevision += 1
    this.enabledLogicalLayers.clear()
    settings.museovirasto.selectedLayers.forEach((layer) =>
      this.enabledLogicalLayers.add(layer)
    )
    this.selectedTypeMask =
      settings.museovirasto.selectedMuinaisjaannosTypes.reduce(
        (mask, value) => mask | (typeBits.get(value) ?? 0),
        0
      )
    this.selectedDatingMask =
      settings.museovirasto.selectedMuinaisjaannosDatings.reduce(
        (mask, value) => mask | (datingBits.get(value) ?? 0),
        0
      )
    this.layerGroup?.setVisible(
      settings.museovirasto.enabled && this.enabledLogicalLayers.size > 0
    )
    this.layerGroup?.setOpacity(settings.museovirasto.opacity)
    this.vectorLayer?.changed()
    this.schedulePresentationUpdate()
  }

  private scheduleSettingsUpdate = (settings: Settings): void => {
    this.pendingSettings = settings
    if (this.settingsUpdateFrame !== undefined) {
      cancelAnimationFrame(this.settingsUpdateFrame)
    }
    if (this.settingsUpdateTimer !== undefined) {
      window.clearTimeout(this.settingsUpdateTimer)
    }
    this.settingsUpdateFrame = requestAnimationFrame(() => {
      this.settingsUpdateFrame = undefined
      this.settingsUpdateTimer = window.setTimeout(() => {
        this.settingsUpdateTimer = undefined
        const pendingSettings = this.pendingSettings
        this.pendingSettings = undefined
        if (pendingSettings) this.updateSettings(pendingSettings)
      }, 25)
    })
  }

  public handleClick = (pixel: Pixel): boolean => {
    const aggregate = this.map.forEachFeatureAtPixel(
      pixel,
      (feature, layer) => (layer === this.aggregateLayer ? feature : undefined),
      { hitTolerance: 5 }
    )
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
    const features = result.features.flatMap((item): MuseovirastoFeature[] => {
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
    if (!settings.museovirasto.enabled) {
      return { type: "FeatureCollection", features: [] }
    }
    // Muinaisjäännösalueella on sama nimi kuin sitä edustavalla pääpisteellä.
    // Nykyinen WMS-haku jättää alueet pois, jotta sanahaku ei näytä duplikaatteja.
    const searchableLayers = settings.museovirasto.selectedLayers.filter(
      (layer) => layer !== MuseovirastoLayer.Muinaisjaannokset_alue
    )
    if (searchableLayers.length === 0) {
      return { type: "FeatureCollection", features: [] }
    }
    const url = new URL(this.searchUrl)
    url.searchParams.set("q", searchText.trim())
    url.searchParams.set("layers", searchableLayers.join(","))
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
      features: result.features.map((item) => toMuseovirastoFeature(item))
    }
  }

  public selectedFeatureLayersChanged = (settings: Settings): void =>
    this.scheduleSettingsUpdate(settings)
  public selectedMuinaisjaannosTypesChanged = (settings: Settings): void =>
    this.scheduleSettingsUpdate(settings)
  public selectedMuinaisjaannosDatingsChanged = (settings: Settings): void =>
    this.scheduleSettingsUpdate(settings)
  public opacityChanged = (settings: Settings): void =>
    this.updateSettings(settings)
  public updateLayerVisibility = (settings: Settings): void =>
    this.updateSettings(settings)
  public getLayer = (): LayerGroup => this.layerGroup
}

function createMuseovirastoStyle(id: string, source: string): Style {
  const color = museovirastoColor(id)
  if (source.endsWith("_points")) return createMuseovirastoPointStyle(id)
  if (source.endsWith("_areas")) {
    if (id.includes("havaintokohde")) {
      return new Style({ fill: new Fill({ color: "#aaaaaa" }) })
    }
    return new Style({
      fill: new Fill({ color: createWmsAreaPattern(color) }),
      stroke: new Stroke({ color, width: 1, lineJoin: "bevel" })
    })
  }
  return new Style({ stroke: new Stroke({ color, width: 2.5 }) })
}

function createMuseovirastoPointStyle(id: string): Style {
  const stroke = new Stroke({ color: "#161616", width: 1 })
  const fill = new Fill({ color: museovirastoColor(id) })
  if (id.includes("alakohde")) {
    return new Style({
      image: new RegularShape({
        points: 5,
        radius: 7,
        radius2: 3,
        fill,
        stroke
      })
    })
  }
  if (id.includes("maailmanperinto")) {
    return new Style({
      image: new RegularShape({ points: 5, radius: 7, fill, stroke })
    })
  }
  if (id.includes("havaintokohde")) {
    return new Style({
      image: new RegularShape({
        points: 4,
        radius: 6,
        angle: Math.PI / 4,
        fill,
        stroke
      })
    })
  }
  return new Style({ image: new CircleStyle({ radius: 5, fill, stroke }) })
}

function createMuseovirastoAggregateStyle(feature: FeatureLike): Style {
  const id = String(feature.get("logicalLayerId") ?? "")
  const count = Number(feature.get("count") ?? 1)
  const radius = Math.min(18, 5 + Math.log2(Math.max(1, count)) * 1.4)
  return new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({ color: withAlpha(museovirastoColor(id), 0.82) }),
      stroke: new Stroke({ color: "#161616", width: 1.5 })
    }),
    text: new Text({
      text:
        count > 1
          ? new Intl.NumberFormat("fi-FI", {
              notation: "compact",
              maximumFractionDigits: 1
            }).format(count)
          : "",
      fill: new Fill({ color: "#fff" }),
      stroke: new Stroke({ color: "#161616", width: 2 }),
      font: "bold 10px sans-serif"
    })
  })
}

function museovirastoColor(id: string): string {
  if (id.includes("muu_kulttuuriperinto")) return "#b67f4a"
  if (id.includes("mahdollinen")) return "#cc00ff"
  if (id.includes("loytopaikka")) return "#ff7f01"
  if (id.includes("luonnonmuodostuma")) return "#01c6ff"
  if (id.includes("poistettu")) return "#908e8e"
  if (id.includes("muu_kohde")) return "#b5b5b5"
  if (id.includes("rky")) return "#0070ff"
  if (id.includes("suojellut_rakennukset")) return "#38a800"
  if (id.includes("maailmanperinto")) return "#ffab00"
  if (id.includes("vark")) return "#8400a8"
  return "#ff0000"
}

function withAlpha(hex: string, alpha: number): string {
  const red = Number.parseInt(hex.slice(1, 3), 16)
  const green = Number.parseInt(hex.slice(3, 5), 16)
  const blue = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function createWmsAreaPattern(color: string): CanvasPattern {
  const size = 16
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext("2d")
  if (!context)
    throw new Error(
      "Canvas 2D context is required for Museovirasto area styles"
    )
  context.strokeStyle = color
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(0, 0)
  context.lineTo(size, size)
  context.moveTo(size, 0)
  context.lineTo(0, size)
  context.stroke()
  const pattern = context.createPattern(canvas, "repeat")
  if (!pattern)
    throw new Error("Canvas pattern is required for Museovirasto area styles")
  return pattern
}

const archaeologicalKinds: Record<string, string> = {
  kiintea_muinaisjaannos: "kiinteä muinaisjäännös",
  muu_kulttuuriperintokohde: "muu kulttuuriperintökohde",
  loytopaikka: "löytöpaikka",
  havaintokohde: "havaintokohde",
  luonnonmuodostuma: "luonnonmuodostuma",
  mahdollinen_muinaisjaannos: "mahdollinen muinaisjäännös",
  muu_kohde: "muu kohde",
  poistettu_kiintea_muinaisjaannos:
    "poistettu kiinteä muinaisjäännös (ei rauhoitettu)"
}

function toMuseovirastoFeature(
  item: FeatureBatchItem,
  geometry: Geometry = item.geometry
): MuseovirastoFeature {
  const shortLayerId = item.logicalLayerId.split(":").slice(-1)[0] ?? "unknown"
  const properties = propertiesForLayer(item)
  return {
    type: "Feature",
    id: `${shortLayerId}.${item.featureId}`,
    geometry,
    properties,
    models: [],
    maisemanMuisti: []
  } as unknown as MuseovirastoFeature
}

function propertiesForLayer(item: FeatureBatchItem): Record<string, unknown> {
  const source = item.properties
  const objectId = Number(item.featureId)
  const registryId = source.registryId ?? ""
  const name = source.name ?? ""
  const municipality = source.municipality ?? ""
  const common = { OBJECTID: objectId }

  if (item.sourceLayer.startsWith("archaeological_")) {
    const kind = String(source.laji_key ?? "")
    return {
      ...common,
      mjtunnus: Number(registryId),
      kohdenimi: name,
      kunta: municipality,
      Laji: archaeologicalKinds[kind] ?? kind,
      tyyppi: source.types_raw ?? "",
      alatyyppi: source.subtypes_raw ?? "",
      ajoitus: source.datings_raw ?? "",
      alakohdetunnus: Number(source.subsite_id ?? 0)
    }
  }

  if (item.sourceLayer.startsWith("vark_")) {
    return {
      ...common,
      VARK_ID: Number(registryId),
      VARK_nimi: name,
      Kunta: municipality,
      Tyyppi: source.types_raw ?? "",
      Alatyyppi: source.subtypes_raw ?? "",
      Ajoitus: source.datings_raw ?? "",
      relatedArchaeologicalSites: item.relatedArchaeologicalSites ?? [],
      Linkki: `https://www.kyppi.fi/palveluikkuna/VARKL/asp/v_kohde_det.aspx?KOHDE_ID=${registryId}`
    }
  }

  if (item.sourceLayer.startsWith("rky_")) {
    return {
      ...common,
      ID: registryId,
      kohdenimi: name,
      nimi: source.part_name ?? "",
      url: `https://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=${registryId}`
    }
  }

  if (item.sourceLayer.startsWith("protected_building_")) {
    return {
      ...common,
      KOHDEID: Number(registryId),
      rakennusID: Number(source.building_id ?? 0),
      kohdenimi: name,
      rakennusnimi: source.building_name ?? "",
      kunta: municipality,
      suojeluryhmä: source.protection_groups_raw ?? "",
      suojelun_tila: source.protection_status ?? ""
    }
  }

  const worldHeritageUrl =
    "https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa"
  return item.sourceLayer === "world_heritage_points"
    ? { ...common, nimi: name, url: worldHeritageUrl }
    : {
        ...common,
        Nimi: name,
        URL: worldHeritageUrl,
        Alue: source.area_type ?? null
      }
}
