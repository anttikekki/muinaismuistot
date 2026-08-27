import { FeatureLike } from "ol/Feature"
import { Geometry } from "geojson"
import MVT from "ol/format/MVT"
import LayerGroup from "ol/layer/Group"
import VectorTileLayer from "ol/layer/VectorTile"
import OlMap from "ol/Map"
import { Pixel } from "ol/pixel"
import CircleStyle from "ol/style/Circle"
import Fill from "ol/style/Fill"
import RegularShape from "ol/style/RegularShape"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
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

const pointRenderingThreshold = 20_000
const pointSamplingDivisors = [32, 32, 16, 8, 4, 2]
const logicalLayers = layerMapping.logicalLayers as LogicalLayer[]
const archaeologicalFilterSources = new Set(["muinaisjaannokset_piste"])
const kindCodes = new Map(
  vocabulary.kinds.map((value, index) => [value, index + 1])
)
const typeBits = new Map(
  vocabulary.types.map((value, index) => [value, 2 ** index])
)
const datingBits = new Map(
  vocabulary.datings.map((value, index) => [value, 2 ** index])
)
const logicalLayerBySource = new Map<string, LogicalLayer>()
const logicalLayerBySourceAndKind = new Map<
  string,
  Map<number, LogicalLayer>
>()
logicalLayers.forEach((logicalLayer) => {
  const kindCode = logicalLayer.filter
    ? kindCodes.get(logicalLayer.filter.equals)
    : undefined
  if (kindCode === undefined) {
    logicalLayerBySource.set(logicalLayer.sourceLayer, logicalLayer)
    return
  }
  let layersByKind = logicalLayerBySourceAndKind.get(logicalLayer.sourceLayer)
  if (!layersByKind) {
    layersByKind = new Map<number, LogicalLayer>()
    logicalLayerBySourceAndKind.set(logicalLayer.sourceLayer, layersByKind)
  }
  layersByKind.set(kindCode, logicalLayer)
})

function pointSamplingDivisor(zoom: number | undefined): number {
  const integerZoom = Math.max(0, Math.floor(zoom ?? 0))
  return pointSamplingDivisors[integerZoom] ?? 1
}

export default class MuseovirastoVectorTileLayer {
  private readonly map: OlMap
  private readonly featureBatchUrl: string
  private readonly featuresByRegisterUrl: string
  private readonly searchUrl: string
  private readonly vectorLayer: VectorTileLayer
  private readonly layerGroup: LayerGroup
  private readonly enabledLogicalLayers = new Set<string>()
  private readonly styles = new Map<string, Style>()
  private readonly pointStyles = new Map<string, Style>()
  private selectedTypeMask = 0
  private selectedDatingMask = 0
  private activePointCount = 0
  private samplingEnabled = false
  private countingRender = false
  private samplingDivisor: number
  private pendingSettings?: Settings
  private settingsUpdateFrame?: number
  private settingsUpdateTimer?: number
  private measurementFrame?: number
  private measurementTimer?: number
  private pendingTileLoads = 0

  public constructor(
    map: OlMap,
    settings: Settings,
    updateTileLoadingStatus: ShowLoadingAnimationFn,
    apiBase = window.location.origin
  ) {
    this.map = map
    this.samplingDivisor = pointSamplingDivisor(map.getView().getZoom())
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
    source.on("tileloadstart", () => {
      this.pendingTileLoads += 1
      updateTileLoadingStatus(true)
    })
    source.on(["tileloadend", "tileloaderror"], () => {
      this.pendingTileLoads = Math.max(0, this.pendingTileLoads - 1)
      updateTileLoadingStatus(false)
      if (this.pendingTileLoads === 0) this.schedulePointMeasurement()
    })
    this.vectorLayer = new VectorTileLayer({
      source,
      declutter: false,
      style: this.styleFeature
    })
    this.vectorLayer.on("postrender", () => {
      this.finishPointMeasurement()
    })
    this.layerGroup = new LayerGroup({
      layers: [this.vectorLayer]
    })
    this.map.getView().on("change:resolution", () => {
      this.samplingDivisor = pointSamplingDivisor(
        this.map.getView().getZoom()
      )
    })
    this.updateSettings(settings)
  }

  private styleFeature = (feature: FeatureLike): Style | undefined => {
    const logicalLayerId = this.activeLogicalLayerId(feature)
    if (!logicalLayerId) return undefined
    const isPoint = feature.getGeometry()?.getType() === "Point"
    if (isPoint && !this.shouldRenderPoint(feature)) return undefined
    return isPoint
      ? this.pointStyles.get(logicalLayerId)
      : this.styles.get(logicalLayerId)
  }

  private activeLogicalLayerId = (feature: FeatureLike): string | undefined => {
    const sourceLayer = String(feature.get("layer") ?? "")
    const kindCode = Number(feature.get("laji_key"))
    const logicalLayer =
      logicalLayerBySourceAndKind.get(sourceLayer)?.get(kindCode) ??
      logicalLayerBySource.get(sourceLayer)
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

  private shouldRenderPoint = (feature: FeatureLike): boolean => {
    if (this.countingRender) this.activePointCount += 1
    if (
      !this.samplingEnabled &&
      (!this.countingRender || this.activePointCount <= pointRenderingThreshold)
    )
      return true
    if (this.samplingDivisor === 1) return true
    const featureId = Number(feature.getId())
    return (
      !Number.isSafeInteger(featureId) ||
      featureId % this.samplingDivisor === 0
    )
  }

  private beginPointMeasurement = (): void => {
    this.activePointCount = 0
    this.countingRender = true
    this.vectorLayer.changed()
  }

  private finishPointMeasurement = (): void => {
    if (!this.countingRender) return
    this.countingRender = false
    const samplingEnabled =
      this.samplingDivisor > 1 &&
      this.activePointCount > pointRenderingThreshold
    const samplingChanged = samplingEnabled !== this.samplingEnabled
    this.samplingEnabled = samplingEnabled
    const target = this.map.getTargetElement()
    target.dataset.museovirastoActivePoints = String(this.activePointCount)
    target.dataset.museovirastoPointsSampled = String(samplingEnabled)
    if (samplingChanged) this.vectorLayer.changed()
  }

  private schedulePointMeasurement = (): void => {
    if (this.measurementFrame !== undefined) {
      cancelAnimationFrame(this.measurementFrame)
    }
    if (this.measurementTimer !== undefined) {
      window.clearTimeout(this.measurementTimer)
    }
    this.measurementFrame = requestAnimationFrame(() => {
      this.measurementFrame = undefined
      this.measurementTimer = window.setTimeout(() => {
        this.measurementTimer = undefined
        this.beginPointMeasurement()
      }, 100)
    })
  }

  private updateSettings = (settings: Settings): void => {
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
    this.beginPointMeasurement()
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
  public opacityChanged = (settings: Settings): void => {
    this.layerGroup.setOpacity(settings.museovirasto.opacity)
  }
  public updateLayerVisibility = (settings: Settings): void =>
    this.updateSettings(settings)
  public getLayer = (): LayerGroup => this.layerGroup
}

function createMuseovirastoStyle(id: string, source: string): Style {
  const color = museovirastoColor(id)
  if (/_piste(?:et)?$/.test(source)) return createMuseovirastoPointStyle(id)
  if (/_alue(?:et)?$/.test(source)) {
    if (id.includes("havaintokohde")) {
      return new Style({ fill: new Fill({ color: "#aaaaaa" }) })
    }
    return new Style({
      fill: new Fill({ color: createMuseovirastoAreaPattern(color) }),
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

function createMuseovirastoAreaPattern(color: string): CanvasPattern {
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

  if (item.sourceLayer.startsWith("muinaisjaannokset_") || item.sourceLayer === "alakohde_piste") {
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

  if (item.sourceLayer.startsWith("suojellut_rakennukset_")) {
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
  return item.sourceLayer === "maailmanperinto_piste"
    ? { ...common, nimi: name, url: worldHeritageUrl }
    : {
        ...common,
        Nimi: name,
        URL: worldHeritageUrl,
        Alue: source.area_type ?? null
      }
}
