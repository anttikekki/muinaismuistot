import "ol/ol.css"
import "./styles.css"

import Feature, { FeatureLike } from "ol/Feature"
import OLMap from "ol/Map"
import View from "ol/View"
import MVT from "ol/format/MVT"
import Point from "ol/geom/Point"
import VectorLayer from "ol/layer/Vector"
import VectorTileLayer from "ol/layer/VectorTile"
import { fromLonLat } from "ol/proj"
import VectorSource from "ol/source/Vector"
import Fill from "ol/style/Fill"
import CircleStyle from "ol/style/Circle"
import RegularShape from "ol/style/RegularShape"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import Text from "ol/style/Text"
import { PMTilesVectorSource } from "ol-pmtiles"
import { aggregationDisableThreshold, aggregationEnableThreshold, nextAggregationMode } from "./aggregation"
import {
  archaeologicalDatings,
  archaeologicalTypes,
  compileArchaeologicalFilter,
  matchesArchaeologicalFilter,
} from "./archaeological-filter"

type LogicalLayer = {
  id: string
  sourceLayer: string
  filter?: { field: string; equals: string }
}

type FeatureBatchResult = {
  features: Array<{
    sourceLayer: string
    featureId: string
    logicalLayerId: string
    properties: Record<string, unknown>
  }>
  missing: Array<{ sourceLayer: string; featureId: string }>
}

const archiveUrl = `${location.origin}/pmtiles/museovirasto-poc.pmtiles`
const benchmarkName = new URLSearchParams(location.search).get("benchmark")
const benchmarkViews: Record<string, { center: [number, number]; zoom: number }> = {
  finland: { center: [25.2, 64.5], zoom: 5 },
  bronze: { center: [25.2, 64.5], zoom: 5 },
  city: { center: [24.94, 60.17], zoom: 10 },
  near: { center: [24.94, 60.17], zoom: 14 },
}
const initialView = benchmarkViews[benchmarkName ?? ""] ?? benchmarkViews.finland
const enabled = new Set<string>()
const unfilteredLogicalIdBySource = new Map<string, string>()
const filteredLogicalIdsBySource = new Map<string, { field: string; idsByValue: Map<string, string> }>()
const styleByLogicalId = new Map<string, Style>()
const pointStyleByLogicalId = new Map<string, Style>()
const selectedArchaeologicalTypes = new Set<string>(archaeologicalTypes)
const selectedArchaeologicalDatings = new Set<string>(archaeologicalDatings)
const startedAt = performance.now()
const aggregateGridSize = 64
let requestCount = 0
let transferredBytes = 0
let styleCallCount = 0
let visibleStyleCallCount = 0
let movementStartedAt: number | undefined
let movementEndedAt: number | undefined
let movementRenderFrames = 0
let lastRenderFrameAt: number | undefined
let pendingInputAt: number | undefined
let latestInputAt: number | undefined
let renderFrameIntervals: number[] = []
let inputToRenderLatencies: number[] = []
let archaeologicalSubtype = ""
let activeArchaeologicalFilter = compileArchaeologicalFilter(selectedArchaeologicalTypes, selectedArchaeologicalDatings, archaeologicalSubtype)
let aggregationMode = true
let aggregateBelow = aggregationDisableThreshold
let aggregateAbove = aggregationEnableThreshold
let pendingTileLoads = 0
let tileRevision = 0
let tileLoadSeen = false
let initialDataReady = false
let presentationUpdateScheduled = false
let presentationUpdateAfterMovement = false
let presentationSignature = ""
let presentationInputSignature = ""
let initialDataCandidateSignature: string | undefined

const nativeFetch = globalThis.fetch.bind(globalThis)
globalThis.fetch = async (input, init) => {
  const response = await nativeFetch(input, init)
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url
  if (url.includes("museovirasto-poc.pmtiles")) {
    requestCount += 1
    transferredBytes += Number(response.headers.get("Content-Length") ?? 0)
    updateDiagnostics()
  }
  return response
}

const source = new PMTilesVectorSource({
  url: archiveUrl,
  format: new MVT(),
  attributions: ["Museovirasto"],
})

let logicalLayers: LogicalLayer[] = []
const vectorLayer = new VectorTileLayer({
  declutter: false,
  source,
  style: styleFeature,
})
const aggregateSource = new VectorSource<Feature<Point>>()
const aggregateStyleCache = new Map<string, Style>()
const aggregateLayer = new VectorLayer({ source: aggregateSource, style: styleAggregate })

const map = new OLMap({
  target: "map",
  layers: [vectorLayer, aggregateLayer],
  view: new View({
    center: fromLonLat(initialView.center),
    zoom: initialView.zoom,
    minZoom: 0,
    maxZoom: 14,
  }),
})

source.on("tileloadstart", () => {
  tileLoadSeen = true
  pendingTileLoads += 1
})
source.on(["tileloadend", "tileloaderror"], () => {
  pendingTileLoads = Math.max(0, pendingTileLoads - 1)
  tileRevision += 1
  schedulePresentationUpdate()
})
map.getView().on("change:resolution", updateDiagnostics)
map.on("movestart", () => {
  styleCallCount = 0
  visibleStyleCallCount = 0
  movementStartedAt = performance.now()
  movementEndedAt = undefined
  movementRenderFrames = 0
  lastRenderFrameAt = undefined
  const startedAt = performance.now()
  pendingInputAt = latestInputAt !== undefined && startedAt - latestInputAt < 100 ? latestInputAt : undefined
  renderFrameIntervals = []
  inputToRenderLatencies = []
})
map.on("moveend", () => {
  movementEndedAt = performance.now()
})
map.on("postrender", () => {
  if (movementStartedAt === undefined) return
  const renderedAt = performance.now()
  movementRenderFrames += 1
  if (lastRenderFrameAt !== undefined) renderFrameIntervals.push(renderedAt - lastRenderFrameAt)
  if (pendingInputAt !== undefined) {
    inputToRenderLatencies.push(renderedAt - pendingInputAt)
    pendingInputAt = undefined
  }
  lastRenderFrameAt = renderedAt
})
map.on("rendercomplete", () => {
  updateStyleCallCount()
  finishMovementMeasurement()
  schedulePresentationUpdate()
})

const mapViewport = map.getViewport()
const recordInput = (): void => {
  latestInputAt = performance.now()
  if (movementStartedAt !== undefined) pendingInputAt = latestInputAt
}
mapViewport.addEventListener("pointermove", recordInput, { passive: true })
mapViewport.addEventListener("wheel", recordInput, { passive: true })

map.on("singleclick", (event) => { void handleMapClick(event.pixel) })

async function handleMapClick(pixel: number[]): Promise<void> {
  const aggregate = map.forEachFeatureAtPixel(pixel, (feature, layer) =>
    layer === aggregateLayer ? feature : undefined,
  { hitTolerance: 5 })
  if (aggregate) {
    const geometry = aggregate.getGeometry()
    map.getView().animate({
      center: geometry ? [(geometry.getExtent()[0] + geometry.getExtent()[2]) / 2, (geometry.getExtent()[1] + geometry.getExtent()[3]) / 2] : undefined,
      zoom: Math.min((map.getView().getZoom() ?? 0) + 2, 14),
      duration: 250,
    })
    return
  }

  const references = new Map<string, { sourceLayer: string; featureId: string }>()
  for (const feature of map.getFeaturesAtPixel(pixel, { layerFilter: (layer) => layer === vectorLayer, hitTolerance: 5 })) {
    if (!activeLogicalId(feature)) continue
    const sourceLayer = String(feature.get("layer") ?? "")
    const id = feature.getId()
    if (id === undefined) continue
    const featureId = String(id)
    references.set(`${sourceLayer}:${featureId}`, { sourceLayer, featureId })
    if (references.size === 100) break
  }
  if (references.size === 0) {
    setText("feature-info", "Karttakohdetta ei löytynyt.")
    return
  }

  setText("feature-info", `Ladataan ${references.size} kohteen tiedot…`)
  const response = await nativeFetch("/api/features/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features: [...references.values()] }),
  })
  if (!response.ok) {
    setText("feature-info", `Ominaisuustietojen lataus epäonnistui (${response.status}).`)
    return
  }
  renderFeatureInfo((await response.json()) as FeatureBatchResult)
}

function renderFeatureInfo(result: FeatureBatchResult): void {
  const container = document.getElementById("feature-info")
  if (!container) return
  const elements: HTMLElement[] = result.features.map((item) => {
    const article = document.createElement("article")
    const heading = document.createElement("h3")
    heading.textContent = String(item.properties.name ?? "Nimetön kohde")
    const details = document.createElement("dl")
    const rows: Array<[string, unknown]> = [
      ["Taso", shortLabel(item.logicalLayerId)],
      ["Rekisteritunnus", item.properties.registryId],
      ["Kunta", item.properties.municipality],
      ["Feature ID", item.featureId],
    ]
    for (const [label, value] of rows) {
      if (value === null || value === undefined || value === "") continue
      const term = document.createElement("dt")
      const description = document.createElement("dd")
      term.textContent = label
      description.textContent = String(value)
      details.append(term, description)
    }
    article.append(heading, details)
    return article
  })
  if (result.missing.length) {
    const warning = document.createElement("p")
    warning.textContent = `${result.missing.length} kohteen tietoja ei löytynyt.`
    elements.push(warning)
  }
  container.replaceChildren(...elements)
}

void loadControls()

async function loadControls(): Promise<void> {
  const response = await nativeFetch("/api/layers")
  if (!response.ok) throw new Error(`Layer mapping failed: ${response.status}`)
  logicalLayers = (await response.json()) as LogicalLayer[]
  configureStyleLookups(logicalLayers)

  const controls = document.querySelector<HTMLDivElement>("#layer-controls")
  if (!controls) return
  controls.replaceChildren(
    ...logicalLayers.map((layer) => {
      const label = document.createElement("label")
      const input = document.createElement("input")
      input.type = "checkbox"
      input.checked = true
      input.dataset.layerId = layer.id
      input.addEventListener("change", () => {
        input.checked ? enabled.add(layer.id) : enabled.delete(layer.id)
        vectorLayer.changed()
      })
      label.append(input, document.createTextNode(shortLabel(layer.id)))
      return label
    }),
  )

  document.querySelector("#all-on")?.addEventListener("click", () => setAll(true))
  document.querySelector("#all-off")?.addEventListener("click", () => setAll(false))
  if (benchmarkName === "bronze") document.querySelector<HTMLButtonElement>("#bronze-cairns")?.click()
  vectorLayer.changed()
}

function setAll(visible: boolean, render = true): void {
  enabled.clear()
  document.querySelectorAll<HTMLInputElement>("#layer-controls input").forEach((input) => {
    input.checked = visible
    if (visible && input.dataset.layerId) enabled.add(input.dataset.layerId)
  })
  if (render) vectorLayer.changed()
}

function styleFeature(feature: FeatureLike): Style | undefined {
  styleCallCount += 1
  const logicalId = activeLogicalId(feature)
  if (!logicalId) return undefined
  const sourceLayer = String(feature.get("layer") ?? "")
  if (aggregationMode && isPointFeature(feature)) return undefined
  visibleStyleCallCount += 1
  return isPointFeature(feature) ? pointStyleByLogicalId.get(logicalId) : styleByLogicalId.get(logicalId)
}

function activeLogicalId(feature: FeatureLike): string | undefined {
  const sourceLayer = String(feature.get("layer") ?? "")
  const filtered = filteredLogicalIdsBySource.get(sourceLayer)
  const logicalId = filtered
    ? filtered.idsByValue.get(String(feature.get(filtered.field) ?? ""))
    : unfilteredLogicalIdBySource.get(sourceLayer)
  if (!logicalId || !enabled.has(logicalId)) return undefined
  if (
    sourceLayer === "archaeological_points" &&
    !matchesArchaeologicalFilter(
      {
        typeMask: Number(feature.get("type_mask") ?? 0),
        subtypeCodes: String(feature.get("subtype_codes") ?? ""),
        datingMask: Number(feature.get("dating_mask") ?? 0),
      },
      activeArchaeologicalFilter,
    )
  ) return undefined
  return logicalId
}

function configureStyleLookups(layers: LogicalLayer[]): void {
  unfilteredLogicalIdBySource.clear()
  filteredLogicalIdsBySource.clear()
  styleByLogicalId.clear()
  pointStyleByLogicalId.clear()
  enabled.clear()

  for (const layer of layers) {
    enabled.add(layer.id)
    styleByLogicalId.set(layer.id, createStyle(layer))
    pointStyleByLogicalId.set(layer.id, new Style({ image: pointSymbol(layer.id, colorFor(layer.id)) }))

    if (!layer.filter) {
      unfilteredLogicalIdBySource.set(layer.sourceLayer, layer.id)
      continue
    }

    let lookup = filteredLogicalIdsBySource.get(layer.sourceLayer)
    if (!lookup) {
      lookup = { field: layer.filter.field, idsByValue: new Map() }
      filteredLogicalIdsBySource.set(layer.sourceLayer, lookup)
    }
    if (lookup.field !== layer.filter.field) {
      throw new Error(`Multiple filter fields configured for ${layer.sourceLayer}`)
    }
    lookup.idsByValue.set(layer.filter.equals, layer.id)
  }
}

function createStyle(layer: LogicalLayer): Style {
  const color = colorFor(layer.id)
  if (layer.sourceLayer.endsWith("_points")) {
    return new Style({ image: pointSymbol(layer.id, color) })
  }
  return new Style({
    fill: new Fill({ color: withAlpha(color, 0.16) }),
    stroke: new Stroke({ color, width: layer.sourceLayer.endsWith("_lines") ? 2.5 : 1.5 }),
  })
}

function pointSymbol(id: string, color: string): CircleStyle | RegularShape {
  const stroke = new Stroke({ color: "#161616", width: 1 })
  const fill = new Fill({ color })
  if (id.includes("alakohde")) return new RegularShape({ points: 5, radius: 7, radius2: 3, fill, stroke })
  if (id.includes("maailmanperinto")) return new RegularShape({ points: 5, radius: 7, fill, stroke })
  if (id.includes("havaintokohde")) return new RegularShape({ points: 4, radius: 6, angle: Math.PI / 4, fill, stroke })
  return new CircleStyle({ radius: 5, fill, stroke })
}

function colorFor(id: string): string {
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

function shortLabel(id: string): string {
  return id.replace(/^rajapinta_suojellut:|^rajapinta:rajapinta_|^rajapinta:/, "")
}

function updateDiagnostics(): void {
  setText("request-count", String(requestCount))
  setText("transfer-bytes", new Intl.NumberFormat("fi-FI").format(transferredBytes))
  setText("zoom", (map.getView().getZoom() ?? 0).toFixed(2))
  if (!initialDataReady) setText("data-ready-time", "Ladataan…")
}

function schedulePresentationUpdate(): void {
  if (movementStartedAt !== undefined && movementEndedAt === undefined) {
    presentationUpdateAfterMovement = true
    return
  }
  if (presentationUpdateScheduled) return
  presentationUpdateScheduled = true
  requestAnimationFrame(() => {
    presentationUpdateScheduled = false
    updatePresentation()
  })
}

function updatePresentation(): void {
  if (!logicalLayers.length) return
  const center = map.getView().getCenter() ?? [0, 0]
  const inputSignature = [
    tileRevision,
    (map.getView().getResolution() ?? 0).toPrecision(8),
    center[0].toFixed(1),
    center[1].toFixed(1),
    [...enabled].sort().join(","),
    activeArchaeologicalFilter.typeMask,
    activeArchaeologicalFilter.datingMask,
    activeArchaeologicalFilter.subtypeCodes ? [...activeArchaeologicalFilter.subtypeCodes].join(".") : "all",
    aggregateBelow,
    aggregateAbove,
  ].join("|")
  if (inputSignature === presentationInputSignature) {
    markInitialDataReady(presentationSignature)
    return
  }
  const extent = map.getView().calculateExtent(map.getSize())
  const loaded = vectorLayer.getFeaturesInExtent(extent)
  const unique = new Map<string, FeatureLike>()
  loaded.forEach((feature, index) => {
    const sourceLayer = String(feature.get("layer") ?? "")
    const id = feature.getId()
    const geometry = feature.getGeometry()
    const fallback = geometry ? geometry.getExtent().join(",") : String(index)
    unique.set(`${sourceLayer}:${id ?? fallback}`, feature)
  })

  const activePoints: Array<{ feature: FeatureLike; logicalId: string }> = []
  for (const feature of unique.values()) {
    if (!isPointFeature(feature)) continue
    const logicalId = activeLogicalId(feature)
    if (logicalId) activePoints.push({ feature, logicalId })
  }

  const nextMode = nextAggregationMode(aggregationMode, activePoints.length, aggregateBelow, aggregateAbove)
  const signature = [
    nextMode ? "aggregate" : "individual",
    activePoints.length,
    (map.getView().getResolution() ?? 0).toPrecision(8),
    center[0].toFixed(1),
    center[1].toFixed(1),
    [...enabled].sort().join(","),
    activeArchaeologicalFilter.typeMask,
    activeArchaeologicalFilter.datingMask,
    activeArchaeologicalFilter.subtypeCodes ? [...activeArchaeologicalFilter.subtypeCodes].join(".") : "all",
  ].join("|")

  setText("loaded-feature-count", formatCount(unique.size))
  setText("active-point-count", formatCount(activePoints.length))
  setText("presentation-mode", nextMode ? "Aggregoitu" : "Yksittäiset kohteet")
  setText("individual-point-count", nextMode ? "0" : formatCount(activePoints.length))

  if (signature === presentationSignature) {
    presentationInputSignature = inputSignature
    markInitialDataReady(signature)
    return
  }

  const modeChanged = aggregationMode !== nextMode
  aggregationMode = nextMode
  presentationSignature = signature
  presentationInputSignature = inputSignature
  if (aggregationMode) rebuildAggregates(activePoints)
  else aggregateSource.clear(true)
  setText("aggregate-count", aggregationMode ? formatCount(aggregateSource.getFeatures().length) : "0")
  if (modeChanged) vectorLayer.changed()
  markInitialDataReady(signature)
}

function isPointFeature(feature: FeatureLike): boolean {
  return feature.getGeometry()?.getType() === "Point"
}

function markInitialDataReady(signature: string): void {
  if (initialDataReady || !tileLoadSeen || pendingTileLoads !== 0) return
  if (initialDataCandidateSignature !== signature) {
    initialDataCandidateSignature = signature
    map.render()
    return
  }
  initialDataReady = true
  const readyMilliseconds = performance.now() - startedAt
  setText("data-ready-time", formatMilliseconds(readyMilliseconds))
  publishBenchmarkResult(readyMilliseconds)
}

function publishBenchmarkResult(readyMilliseconds: number): void {
  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
  const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
  const result = {
    view: benchmarkName ?? "finland",
    zoom: map.getView().getZoom(),
    readyMilliseconds: Math.round(readyMilliseconds),
    pmtilesRequests: requestCount,
    pmtilesBytes: transferredBytes,
    resourceRequests: resources.length,
    resourceTransferBytes: resources.reduce((sum, entry) => sum + entry.transferSize, 0),
    usedJsHeapBytes: memory?.usedJSHeapSize ?? null,
    loadedFeatures: parseDisplayedCount("loaded-feature-count"),
    activePoints: parseDisplayedCount("active-point-count"),
    aggregateMarkers: parseDisplayedCount("aggregate-count"),
    presentationMode: document.getElementById("presentation-mode")?.textContent ?? "",
  }
  document.body.dataset.benchmarkReady = "true"
  const output = document.getElementById("benchmark-result")
  if (output) output.textContent = JSON.stringify(result)
}

function parseDisplayedCount(id: string): number {
  return Number((document.getElementById(id)?.textContent ?? "0").replaceAll(/\D/g, ""))
}

function rebuildAggregates(activePoints: Array<{ feature: FeatureLike; logicalId: string }>): void {
  const groups = new Map<string, { count: number; x: number; y: number; logicalCounts: Map<string, number> }>()
  for (const { feature, logicalId } of activePoints) {
    const geometry = feature.getGeometry()
    if (!geometry) continue
    const featureExtent = geometry.getExtent()
    const coordinate = [(featureExtent[0] + featureExtent[2]) / 2, (featureExtent[1] + featureExtent[3]) / 2]
    const pixel = map.getPixelFromCoordinate(coordinate)
    const cellX = Math.floor(pixel[0] / aggregateGridSize)
    const cellY = Math.floor(pixel[1] / aggregateGridSize)
    const key = `${cellX}:${cellY}`
    const group = groups.get(key)
    if (group) {
      group.count += 1
      group.x += coordinate[0]
      group.y += coordinate[1]
      group.logicalCounts.set(logicalId, (group.logicalCounts.get(logicalId) ?? 0) + 1)
    } else groups.set(key, { count: 1, x: coordinate[0], y: coordinate[1], logicalCounts: new Map([[logicalId, 1]]) })
  }

  const aggregates = [...groups.entries()].map(([id, group]) => {
    const dominantLogicalId = [...group.logicalCounts].reduce((dominant, current) =>
      current[1] > dominant[1] ? current : dominant,
    )[0]
    const feature = new Feature({
      geometry: new Point([group.x / group.count, group.y / group.count]),
      count: group.count,
      logicalId: dominantLogicalId,
      logicalLayerCount: group.logicalCounts.size,
      presentation: "aggregate",
    })
    feature.setId(id)
    return feature
  })
  aggregateSource.clear(true)
  aggregateSource.addFeatures(aggregates)
}

function styleAggregate(feature: FeatureLike): Style {
  const logicalId = String(feature.get("logicalId") ?? "")
  const count = Number(feature.get("count") ?? 1)
  const cacheKey = `${logicalId}:${count}`
  const cached = aggregateStyleCache.get(cacheKey)
  if (cached) return cached
  const radius = Math.min(18, 5 + Math.log2(Math.max(1, count)) * 1.4)
  const style = new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({ color: withAlpha(colorFor(logicalId), 0.82) }),
      stroke: new Stroke({ color: "#161616", width: 1.5 }),
    }),
    text: new Text({
      text: count > 1 ? formatCompactCount(count) : "",
      fill: new Fill({ color: "#fff" }),
      stroke: new Stroke({ color: "#161616", width: 2 }),
      font: "bold 10px sans-serif",
    }),
  })
  aggregateStyleCache.set(cacheKey, style)
  return style
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("fi-FI").format(value)
}

function formatCompactCount(value: number): string {
  return new Intl.NumberFormat("fi-FI", { notation: "compact", maximumFractionDigits: 1 }).format(value)
}

function updateStyleCallCount(): void {
  setText("style-call-count", new Intl.NumberFormat("fi-FI").format(styleCallCount))
  setText("visible-style-call-count", new Intl.NumberFormat("fi-FI").format(visibleStyleCallCount))
}

function finishMovementMeasurement(): void {
  if (movementStartedAt === undefined || movementEndedAt === undefined) return

  const completedAt = performance.now()
  const settleDuration = completedAt - movementEndedAt
  const totalDuration = completedAt - movementStartedAt
  const renderRate = totalDuration > 0 ? (movementRenderFrames * 1000) / totalDuration : 0

  setText("settle-time", formatMilliseconds(settleDuration))
  setText("movement-render-rate", `${renderRate.toFixed(1)} kierrosta/s`)
  setText("frame-interval-p95", formatPercentile(renderFrameIntervals, 0.95))
  setText("input-render-p95", formatPercentile(inputToRenderLatencies, 0.95))

  movementStartedAt = undefined
  movementEndedAt = undefined
  if (presentationUpdateAfterMovement) {
    presentationUpdateAfterMovement = false
    schedulePresentationUpdate()
  }
}

function formatMilliseconds(value: number): string {
  return `${Math.round(value)} ms`
}

function formatPercentile(values: number[], percentile: number): string {
  if (values.length === 0) return "–"
  const sorted = [...values].sort((left, right) => left - right)
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * percentile) - 1)
  return formatMilliseconds(sorted[index])
}

function setText(id: string, value: string): void {
  const element = document.getElementById(id)
  if (element) element.textContent = value
}

function configureArchaeologicalFilters(): void {
  createCheckboxFilter(
    "archaeological-types",
    archaeologicalTypes,
    selectedArchaeologicalTypes,
    "type",
  )
  createCheckboxFilter(
    "archaeological-datings",
    archaeologicalDatings,
    selectedArchaeologicalDatings,
    "dating",
  )

  const subtype = document.querySelector<HTMLInputElement>("#archaeological-subtype")
  let subtypeTimer: number | undefined
  subtype?.addEventListener("input", () => {
    window.clearTimeout(subtypeTimer)
    subtypeTimer = window.setTimeout(() => {
      archaeologicalSubtype = subtype.value
      refreshArchaeologicalFilter()
      vectorLayer.changed()
    }, 150)
  })
}

function createCheckboxFilter(
  containerId: string,
  values: readonly string[],
  selected: Set<string>,
  name: string,
): void {
  const container = document.getElementById(containerId)
  if (!container) return
  container.replaceChildren(
    ...values.map((value) => {
      const label = document.createElement("label")
      const input = document.createElement("input")
      input.type = "checkbox"
      input.name = name
      input.value = value
      input.checked = true
      input.addEventListener("change", () => {
        input.checked ? selected.add(value) : selected.delete(value)
        refreshArchaeologicalFilter()
        vectorLayer.changed()
      })
      label.append(input, document.createTextNode(value))
      return label
    }),
  )
}

function setFilterSelection(
  containerId: string,
  selected: Set<string>,
  visible: boolean,
  render = true,
): void {
  selected.clear()
  document.querySelectorAll<HTMLInputElement>(`#${containerId} input`).forEach((input) => {
    input.checked = visible
    if (visible) selected.add(input.value)
  })
  refreshArchaeologicalFilter()
  if (render) vectorLayer.changed()
}

function refreshArchaeologicalFilter(): void {
  activeArchaeologicalFilter = compileArchaeologicalFilter(selectedArchaeologicalTypes, selectedArchaeologicalDatings, archaeologicalSubtype)
}

function configureAggregationThresholds(): void {
  const below = document.querySelector<HTMLInputElement>("#aggregate-below")
  const above = document.querySelector<HTMLInputElement>("#aggregate-above")
  const update = (): void => {
    const nextBelow = Number(below?.value)
    const nextAbove = Number(above?.value)
    if (!Number.isSafeInteger(nextBelow) || !Number.isSafeInteger(nextAbove) || nextBelow < 0 || nextBelow >= nextAbove) {
      setText("aggregation-threshold-error", "Poistorajan pitää olla aktivointirajaa pienempi.")
      return
    }
    setText("aggregation-threshold-error", "")
    aggregateBelow = nextBelow
    aggregateAbove = nextAbove
    presentationSignature = ""
    presentationInputSignature = ""
    schedulePresentationUpdate()
  }
  below?.addEventListener("change", update)
  above?.addEventListener("change", update)
}

configureArchaeologicalFilters()
configureAggregationThresholds()
document.querySelector("#types-all")?.addEventListener("click", () =>
  setFilterSelection("archaeological-types", selectedArchaeologicalTypes, true),
)
document.querySelector("#types-none")?.addEventListener("click", () =>
  setFilterSelection("archaeological-types", selectedArchaeologicalTypes, false),
)
document.querySelector("#datings-all")?.addEventListener("click", () =>
  setFilterSelection("archaeological-datings", selectedArchaeologicalDatings, true),
)
document.querySelector("#datings-none")?.addEventListener("click", () =>
  setFilterSelection("archaeological-datings", selectedArchaeologicalDatings, false),
)
document.querySelector("#bronze-cairns")?.addEventListener("click", () => {
  setAll(false, false)
  const archaeologicalPointLayerId = "rajapinta_suojellut:muinaisjaannos_piste"
  enabled.add(archaeologicalPointLayerId)
  document.querySelectorAll<HTMLInputElement>("#layer-controls input").forEach((input) => {
    if (input.dataset.layerId === archaeologicalPointLayerId) input.checked = true
  })
  setFilterSelection("archaeological-types", selectedArchaeologicalTypes, false, false)
  setFilterSelection("archaeological-datings", selectedArchaeologicalDatings, false, false)
  selectedArchaeologicalTypes.add("hautapaikat")
  selectedArchaeologicalDatings.add("pronssikautinen")
  document.querySelector<HTMLInputElement>('#archaeological-types input[value="hautapaikat"]')!.checked = true
  document.querySelector<HTMLInputElement>('#archaeological-datings input[value="pronssikautinen"]')!.checked = true
  const subtype = document.querySelector<HTMLInputElement>("#archaeological-subtype")
  if (subtype) subtype.value = "hautaröykkiöt"
  archaeologicalSubtype = "hautaröykkiöt"
  refreshArchaeologicalFilter()
  vectorLayer.changed()
})
