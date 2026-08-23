import "ol/ol.css"
import "./styles.css"

import Feature, { FeatureLike } from "ol/Feature"
import OLMap from "ol/Map"
import View from "ol/View"
import MVT from "ol/format/MVT"
import VectorTileLayer from "ol/layer/VectorTile"
import { fromLonLat } from "ol/proj"
import Fill from "ol/style/Fill"
import CircleStyle from "ol/style/Circle"
import RegularShape from "ol/style/RegularShape"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import { PMTilesVectorSource } from "ol-pmtiles"
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

const archiveUrl = `${location.origin}/pmtiles/museovirasto-poc.pmtiles`
const enabled = new Set<string>()
const unfilteredLogicalIdBySource = new Map<string, string>()
const filteredLogicalIdsBySource = new Map<string, { field: string; idsByValue: Map<string, string> }>()
const styleByLogicalId = new Map<string, Style>()
const selectedArchaeologicalTypes = new Set<string>(archaeologicalTypes)
const selectedArchaeologicalDatings = new Set<string>(archaeologicalDatings)
const startedAt = performance.now()
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

const map = new OLMap({
  target: "map",
  layers: [vectorLayer],
  view: new View({
    center: fromLonLat([25.2, 64.5]),
    zoom: 5,
    minZoom: 0,
    maxZoom: 14,
  }),
})

let firstRenderRecorded = false
map.once("rendercomplete", () => {
  firstRenderRecorded = true
  setText("render-time", `${Math.round(performance.now() - startedAt)} ms`)
  updateStyleCallCount()
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
map.on("rendercomplete", updateStyleCallCount)
map.on("rendercomplete", finishMovementMeasurement)

const mapViewport = map.getViewport()
const recordInput = (): void => {
  latestInputAt = performance.now()
  if (movementStartedAt !== undefined) pendingInputAt = latestInputAt
}
mapViewport.addEventListener("pointermove", recordInput, { passive: true })
mapViewport.addEventListener("wheel", recordInput, { passive: true })

map.on("singleclick", (event) => {
  const hit = map.forEachFeatureAtPixel(event.pixel, (feature) => feature, {
    layerFilter: (layer) => layer === vectorLayer,
    hitTolerance: 5,
  })
  const properties = hit instanceof Feature ? hit.getProperties() : hit?.getProperties()
  const info = properties
    ? Object.fromEntries(Object.entries(properties).filter(([key]) => key !== "geometry"))
    : "Karttakohdetta ei löytynyt."
  setText("feature-info", typeof info === "string" ? info : JSON.stringify(info, null, 2))
})

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
  ) {
    return undefined
  }
  visibleStyleCallCount += 1
  return styleByLogicalId.get(logicalId)
}

function configureStyleLookups(layers: LogicalLayer[]): void {
  unfilteredLogicalIdBySource.clear()
  filteredLogicalIdsBySource.clear()
  styleByLogicalId.clear()
  enabled.clear()

  for (const layer of layers) {
    enabled.add(layer.id)
    styleByLogicalId.set(layer.id, createStyle(layer))

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
  if (!firstRenderRecorded) setText("render-time", "Ladataan…")
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

configureArchaeologicalFilters()
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
