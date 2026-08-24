import { FeatureLike } from "ol/Feature"
import Fill from "ol/style/Fill"
import CircleStyle from "ol/style/Circle"
import RegularShape from "ol/style/RegularShape"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import Text from "ol/style/Text"

export function createMuseovirastoStyle(id: string, source: string): Style {
  const color = museovirastoColor(id)
  if (source.endsWith("_points")) return createMuseovirastoPointStyle(id)
  return new Style({
    fill: new Fill({ color: withAlpha(color, 0.16) }),
    stroke: new Stroke({ color, width: source.endsWith("_lines") ? 2.5 : 1.5 })
  })
}

export function createMuseovirastoPointStyle(id: string): Style {
  const stroke = new Stroke({ color: "#161616", width: 1 })
  const fill = new Fill({ color: museovirastoColor(id) })
  if (id.includes("alakohde")) {
    return new Style({ image: new RegularShape({ points: 5, radius: 7, radius2: 3, fill, stroke }) })
  }
  if (id.includes("maailmanperinto")) {
    return new Style({ image: new RegularShape({ points: 5, radius: 7, fill, stroke }) })
  }
  if (id.includes("havaintokohde")) {
    return new Style({ image: new RegularShape({ points: 4, radius: 6, angle: Math.PI / 4, fill, stroke }) })
  }
  return new Style({ image: new CircleStyle({ radius: 5, fill, stroke }) })
}

export function createMuseovirastoAggregateStyle(feature: FeatureLike): Style {
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
      text: count > 1 ? new Intl.NumberFormat("fi-FI", { notation: "compact", maximumFractionDigits: 1 }).format(count) : "",
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
