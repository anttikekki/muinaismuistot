export const defaultMaankohoaminenLayer = "issjohav_1000"
const maankohoainenLayerPrefix = "issjohav_"
const maankohoaminenMinLayerYear = 0
const maankohoaminenMaxLayerYear = 14000
const missingOrBrokenMaankohoaminenLayers = [
  // Layer issjohav_1100 is missing from strandforskjutning_1000_1900.gpkg
  "issjohav_1100",
  // Following layers are broken from ogr2org crop
  "issjohav_7400",
  "issjohav_8000",
  "issjohav_8100",
  "issjohav_8400",
  "issjohav_8500",
  "issjohav_9500",
  "issjohav_9600"
]

const parseMaankohoaminenLayerYearFrom1950 = (layer: string) => {
  let layerYear = parseInt(layer.replace(maankohoainenLayerPrefix, ""))
  if (isNaN(layerYear)) {
    throw Error("Configuration error")
  }

  // issjohav_1 means year 0 from 1950
  if (layerYear === 1) {
    layerYear = 0
  }

  return layerYear
}

export const getNextMaankohoaminenLayer = (
  addYears: 100 | -100,
  currentLayer: string
): string => {
  const currentLayerYear = parseMaankohoaminenLayerYearFrom1950(currentLayer)
  let nextLayerYear = currentLayerYear + addYears

  if (
    nextLayerYear < maankohoaminenMinLayerYear ||
    nextLayerYear > maankohoaminenMaxLayerYear
  ) {
    return currentLayer
  }

  // issjohav_1 means year 0 from 1950
  if (nextLayerYear === 0) {
    nextLayerYear = 1
  }

  const nextLayerName = maankohoainenLayerPrefix + nextLayerYear
  if (missingOrBrokenMaankohoaminenLayers.includes(nextLayerName)) {
    return getNextMaankohoaminenLayer(addYears, nextLayerName)
  }

  return nextLayerName
}

export const geMaankohoaminenLayerName = (layer: string) => {
  const year = 1950 - parseMaankohoaminenLayerYearFrom1950(layer)
  return year < 0 ? `${-year} eaa.` : `${year} jaa.`
}
