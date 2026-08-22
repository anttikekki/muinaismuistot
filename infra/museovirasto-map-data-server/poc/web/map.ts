import "ol/ol.css"
import "./styles.css"

import Feature, { FeatureLike } from "ol/Feature"
import Map from "ol/Map"
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

type LogicalLayer = {
  id: string
  sourceLayer: string
  filter?: { field: string; equals: string }
}

const archiveUrl = `${location.origin}/pmtiles/museovirasto-poc.pmtiles`
const enabled = new Set<string>()
const startedAt = performance.now()
let requestCount = 0
let transferredBytes = 0

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

const map = new Map({
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
})
map.getView().on("change:resolution", updateDiagnostics)

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
  logicalLayers.forEach((layer) => enabled.add(layer.id))

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

function setAll(visible: boolean): void {
  enabled.clear()
  document.querySelectorAll<HTMLInputElement>("#layer-controls input").forEach((input) => {
    input.checked = visible
    if (visible && input.dataset.layerId) enabled.add(input.dataset.layerId)
  })
  vectorLayer.changed()
}

function styleFeature(feature: FeatureLike): Style | undefined {
  const sourceLayer = String(feature.get("layer") ?? "")
  const logical = logicalLayers.find(
    (candidate) =>
      enabled.has(candidate.id) &&
      candidate.sourceLayer === sourceLayer &&
      (!candidate.filter || feature.get(candidate.filter.field) === candidate.filter.equals),
  )
  if (!logical) return undefined

  const color = colorFor(logical.id)
  const geometryType = feature.getGeometry()?.getType() ?? ""
  if (geometryType.includes("Point")) {
    return new Style({ image: pointSymbol(logical.id, color) })
  }
  return new Style({
    fill: new Fill({ color: withAlpha(color, 0.16) }),
    stroke: new Stroke({ color, width: geometryType.includes("Line") ? 2.5 : 1.5 }),
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

function setText(id: string, value: string): void {
  const element = document.getElementById(id)
  if (element) element.textContent = value
}
