import { expect, test } from "@playwright/test"
import {
  AhvenanmaaLayer,
  Language,
  MaannousuInfoLayer,
  MuseovirastoLayer
} from "../src/common/layers.types"
import { MuinaisjaannosTyyppi } from "../src/common/museovirasto.types"
import {
  createLinkedFeatureUrl,
  parseURLParams,
  stringifyURLParamsToHash
} from "../src/common/util/URLHashHelper"
import { MuseovirastoDataSource, Settings } from "../src/store/storeTypes"
import { parseURLSettings } from "../src/url/schema"

let getSettingsFromURL: typeof import("../src/url/parseURL").getSettingsFromURL
let updateSettingsToURL: typeof import("../src/url/stringifyToURL").updateSettingsToURL
let initialSettings: Settings

const location = { origin: "https://muinaismuistot.test", search: "", hash: "" }

test.beforeAll(async () => {
  Object.defineProperty(globalThis, "window", {
    value: { location },
    configurable: true
  })
  Object.defineProperty(globalThis, "navigator", {
    value: { language: "fi" },
    configurable: true
  })
  ;({ initialSettings } = await import("../src/store/initialSettings"))
  ;({ getSettingsFromURL } = await import("../src/url/parseURL"))
  ;({ updateSettingsToURL } = await import("../src/url/stringifyToURL"))
})

test.beforeEach(() => {
  location.search = ""
  location.hash = ""
})

test("invalid settings fall back independently while valid settings survive", () => {
  location.hash =
    "#zoom=abc&center=foo,bar&lang=sv&gtkEnabled=no&museovirastoOpacity=2&museovirastoApiBase=broken&viabundusYear=9999"
  const settings = getSettingsFromURL()
  expect(settings.language).toBe(Language.SV)
  expect(settings.mapZoom).toBe(initialSettings.mapZoom)
  expect(settings.mapCenterCoordinates).toBeUndefined()
  expect(settings.gtk.enabled).toBe(initialSettings.gtk.enabled)
  expect(settings.museovirasto.opacity).toBe(
    initialSettings.museovirasto.opacity
  )
  expect(settings.museovirasto.url.worker).toBe(location.origin)
  expect(settings.viabundus.selectedYear).toBe(
    initialSettings.viabundus.selectedYear
  )
})

test("numeric values have finite bounds and reject missing or nonnumeric inputs", () => {
  for (const value of [
    null,
    "",
    " ",
    true,
    false,
    [],
    ["2"],
    "NaN",
    "Infinity",
    "-Infinity",
    "1e999"
  ]) {
    const settings = parseURLSettings({
      zoom: value,
      gtkOpacity: value,
      x: value,
      y: "7000000"
    })
    expect(settings.zoom).toBeUndefined()
    expect(settings.gtkOpacity).toBeUndefined()
    expect(settings.x).toBeUndefined()
    expect(settings.y).toBeUndefined()
  }
  for (const zoom of ["-1", "28.1"])
    expect(parseURLSettings({ zoom }).zoom).toBeUndefined()
  for (const zoom of ["0", "8.5", "28"])
    expect(parseURLSettings({ zoom }).zoom).toBe(Number(zoom))
  for (const value of ["0", "0.75", "1"])
    expect(parseURLSettings({ gtkOpacity: value }).gtkOpacity).toBe(
      Number(value)
    )
  for (const value of ["-0.1", "1.1"])
    expect(parseURLSettings({ gtkOpacity: value }).gtkOpacity).toBeUndefined()
  for (const year of ["1349", "1651", "1500.5"])
    expect(
      parseURLSettings({ viabundusYear: year }).viabundusYear
    ).toBeUndefined()
  for (const year of ["1350", "1650"])
    expect(parseURLSettings({ viabundusYear: year }).viabundusYear).toBe(
      Number(year)
    )
})

test("boolean flags accept explicit true/false and legacy 1/0", () => {
  for (const [value, expected] of [
    ["true", true],
    ["false", false],
    ["1", true],
    ["0", false],
    ["FALSE", false]
  ] as const) {
    location.hash = `#gtkEnabled=${value}&museovirastoVectorTiles=${value}`
    const settings = getSettingsFromURL()
    expect(settings.gtk.enabled).toBe(expected)
    expect(settings.museovirasto.dataSource).toBe(
      expected ? MuseovirastoDataSource.PMTiles : MuseovirastoDataSource.WMS
    )
  }
  for (const value of ["yes", "no", "2", "", null, ["true", "false"]]) {
    expect(
      parseURLSettings({ modelsEnabled: value }).modelsEnabled
    ).toBeUndefined()
  }
})

test("query parameters are overridden by hash parameters and duplicate keys keep the last value", () => {
  location.search = "?zoom=4&lang=en&museovirastoVectorTiles=0"
  location.hash = "#zoom=7&zoom=8.5&lang=sv"
  const settings = getSettingsFromURL()
  expect(settings.mapZoom).toBe(8.5)
  expect(settings.language).toBe(Language.SV)
  expect(settings.museovirasto.dataSource).toBe(MuseovirastoDataSource.WMS)
})

test("coordinate pairs accept encoded commas and require both finite coordinates", () => {
  location.hash = "#center=385000%2C7200000&x=0&y=-10"
  const settings = getSettingsFromURL()
  expect(settings.mapCenterCoordinates).toEqual([385000, 7200000])
  expect(settings.linkedFeature?.coordinates).toEqual([0, -10])
  for (const hash of ["#x=1", "#x=1&y=abc", "#x&y=2", "#x=1,2&y=3"]) {
    location.hash = hash
    expect(getSettingsFromURL().linkedFeature).toBeUndefined()
  }
  for (const center of ["1", "1,2,3", "1,", "Infinity,2"]) {
    location.hash = `#center=${center}`
    expect(getSettingsFromURL().mapCenterCoordinates).toBeUndefined()
  }
})

test("numeric-looking enum values, identifiers and names stay strings", () => {
  for (const year of [
    MaannousuInfoLayer.Vuosi0eaa,
    MaannousuInfoLayer.Vuosi8000eaa
  ]) {
    location.hash = `#maannousuLayer=${year}&x=1&y=2&linkedFeatureId=00123&linkedFeatureName=123`
    const settings = getSettingsFromURL()
    expect(settings.maannousuInfo.selectedLayer).toBe(year)
    expect(settings.linkedFeature?.id).toBe("00123")
    expect(settings.linkedFeature?.name).toBe("123")
  }
  const feature = {
    coordinates: [1, 2] as [number, number],
    id: "00123",
    name: "Kallio, länsi & itä",
    layer: MuseovirastoLayer.Muinaisjaannokset_piste
  }
  location.hash = createLinkedFeatureUrl(feature)
  expect(getSettingsFromURL().linkedFeature).toEqual(feature)
})

test("layer selections support single values, lists, encoded separators and none", () => {
  for (const layers of [
    [AhvenanmaaLayer.Fornminnen],
    Object.values(AhvenanmaaLayer)
  ]) {
    location.hash = stringifyURLParamsToHash({ ahvenanmaaLayer: layers })
    expect(getSettingsFromURL().ahvenanmaa.selectedLayers).toEqual(layers)
  }
  location.hash = `#ahvenanmaaLayer=${encodeURIComponent(Object.values(AhvenanmaaLayer).join(","))}`
  expect(getSettingsFromURL().ahvenanmaa.selectedLayers).toEqual(
    Object.values(AhvenanmaaLayer)
  )
  location.hash =
    "#ahvenanmaaLayer=none&muinaisjaannosTypes=none&museovirastoLayer=none"
  expect(getSettingsFromURL().ahvenanmaa.selectedLayers).toEqual([])
  expect(getSettingsFromURL().museovirasto.selectedLayers).toEqual([])
  expect(getSettingsFromURL().museovirasto.selectedMuinaisjaannosTypes).toEqual(
    []
  )
  location.hash = "#ahvenanmaaLayer=Fornminnen,invalid&lang=invalid"
  expect(getSettingsFromURL().ahvenanmaa.selectedLayers).toEqual(
    initialSettings.ahvenanmaa.selectedLayers
  )
  expect(getSettingsFromURL().language).toBe(initialSettings.language)
  for (const types of [
    [MuinaisjaannosTyyppi.taideMuistomerkit],
    [MuinaisjaannosTyyppi.taideMuistomerkit, MuinaisjaannosTyyppi.asuinpaikat]
  ]) {
    location.hash = stringifyURLParamsToHash({ muinaisjaannosTypes: types })
    expect(
      getSettingsFromURL().museovirasto.selectedMuinaisjaannosTypes
    ).toEqual(types)
  }
})

test("API bases allow HTTP(S), including localhost, and reject unusable URLs", () => {
  for (const url of [
    "https://muinaismuistot.info",
    "http://localhost:8787",
    "https://muinaismuistot-preview.antti-kekki.workers.dev"
  ]) {
    expect(
      parseURLSettings({ museovirastoApiBase: url }).museovirastoApiBase
    ).toBe(url)
  }
  for (const url of [
    "broken",
    "/api",
    "//example.com",
    "javascript:alert(1)",
    "file:///tmp/data",
    "ftp://example.com",
    "https://",
    ""
  ]) {
    expect(
      parseURLSettings({ museovirastoApiBase: url }).museovirastoApiBase
    ).toBeUndefined()
  }
})

test("settings survive URL serialization and unknown parameters are preserved", () => {
  location.hash = stringifyURLParamsToHash({
    lang: "sv",
    zoom: 8.5,
    center: [385000, 7200000],
    x: 385000,
    y: 7200000,
    linkedFeatureId: "00123",
    linkedFeatureName: "false",
    linkedFeatureLayer: MuseovirastoLayer.Muinaisjaannokset_piste,
    maannousuLayer: "0",
    maannousuEnabled: true,
    museovirastoLayer: "none",
    ahvenanmaaLayer: AhvenanmaaLayer.Fornminnen,
    mmlVanhatKartatLayer: "none",
    muinaisjaannosTypes: [MuinaisjaannosTyyppi.taideMuistomerkit],
    gtkEnabled: true,
    gtkOpacity: 0,
    viabundusYear: 1400,
    modelsEnabled: false,
    museovirastoVectorTiles: false,
    museovirastoApiBase: "http://localhost:8787",
    extra: "00123"
  })
  const settings = getSettingsFromURL()
  updateSettingsToURL(initialSettings, settings)
  expect(getSettingsFromURL()).toEqual(settings)
  expect(parseURLParams().extra).toBe("00123")
  expect(initialSettings.museovirasto.selectedLayers.length).toBeGreaterThan(0)
})

test("empty or invalid root input is harmless", () => {
  for (const value of [undefined, null, [], "bad"])
    expect(parseURLSettings(value)).toEqual({})
  expect(getSettingsFromURL()).toEqual(initialSettings)
})

test("default selections are omitted after parsing, regardless of list identity or order", () => {
  location.hash = stringifyURLParamsToHash({
    mmlVanhatKartatLayer: [
      ...initialSettings.maanmittauslaitos.vanhatKartat.selectedLayers
    ].reverse(),
    gtktLayer: [...initialSettings.gtk.selectedLayers].reverse(),
    museovirastoLayer: [
      ...initialSettings.museovirasto.selectedLayers
    ].reverse(),
    muinaisjaannosTypes: [
      ...initialSettings.museovirasto.selectedMuinaisjaannosTypes
    ].reverse(),
    muinaisjaannosDatings: [
      ...initialSettings.museovirasto.selectedMuinaisjaannosDatings
    ].reverse(),
    ahvenanmaaLayer: [...initialSettings.ahvenanmaa.selectedLayers].reverse(),
    helsinkiLayer: [...initialSettings.helsinki.selectedLayers].reverse(),
    extra: "keep"
  })
  updateSettingsToURL(initialSettings, getSettingsFromURL())
  expect(parseURLParams()).toEqual({ extra: "keep" })
})

test("restoring default settings removes previously written selection parameters", () => {
  const settings = structuredClone(initialSettings)
  settings.maanmittauslaitos.vanhatKartat.selectedLayers = []
  settings.gtk.selectedLayers = []
  settings.museovirasto.selectedLayers = []
  settings.museovirasto.selectedMuinaisjaannosTypes = []
  settings.museovirasto.selectedMuinaisjaannosDatings = []
  settings.ahvenanmaa.selectedLayers = []
  settings.helsinki.selectedLayers = []
  updateSettingsToURL(initialSettings, settings)
  expect(parseURLParams()).toEqual({
    mmlVanhatKartatLayer: "none",
    gtktLayer: "none",
    museovirastoLayer: "none",
    muinaisjaannosTypes: "none",
    muinaisjaannosDatings: "none",
    ahvenanmaaLayer: "none",
    helsinkiLayer: "none"
  })
  expect(getSettingsFromURL()).toEqual(settings)
  updateSettingsToURL(initialSettings, structuredClone(initialSettings))
  expect(parseURLParams()).toEqual({})
})

test("default coordinate arrays are compared by value while coordinate order matters", () => {
  const defaults = {
    ...initialSettings,
    mapCenterCoordinates: [385000, 7200000] as [number, number]
  }
  updateSettingsToURL(defaults, structuredClone(defaults))
  expect(parseURLParams()).toEqual({})
  updateSettingsToURL(defaults, {
    ...defaults,
    mapCenterCoordinates: [7200000, 385000]
  })
  expect(parseURLParams()).toEqual({ center: ["7200000", "385000"] })
})
