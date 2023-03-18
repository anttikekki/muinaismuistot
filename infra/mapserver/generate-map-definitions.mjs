import fs from "fs"

/**
 * File names from https://resource.sgu.se/oppnadata/html/jordarter/strandforskjutningsmodell-nedladdning.html
 */
const fileNames = [
  { file: "strandforskjutning_1_900.gpkg", min: 0, max: 900 },
  { file: "strandforskjutning_1000_1900.gpkg", min: 1000, max: 1900 },
  { file: "strandforskjutning_2000_2900.gpkg", min: 2000, max: 2900 },
  { file: "strandforskjutning_3000_3900.gpkg", min: 3000, max: 3900 },
  { file: "strandforskjutning_4000_4900.gpkg", min: 4000, max: 4900 },
  { file: "strandforskjutning_5000_5900.gpkg", min: 5000, max: 5900 },
  { file: "strandforskjutning_6000_6900.gpkg", min: 6000, max: 6900 },
  { file: "strandforskjutning_7000_7900.gpkg", min: 7000, max: 7900 },
  { file: "strandforskjutning_8000_8900.gpkg", min: 8000, max: 8900 },
  { file: "strandforskjutning_9000_9900.gpkg", min: 9000, max: 9900 },
  { file: "strandforskjutning_10000_10900.gpkg", min: 10000, max: 10900 },
  { file: "strandforskjutning_11000_11900.gpkg", min: 11000, max: 11900 },
  { file: "strandforskjutning_12000_12900.gpkg", min: 12000, max: 12900 },
  { file: "strandforskjutning_13000_13500.gpkg", min: 13000, max: 13500 }
]
const missingOrBrokenLayers = [
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
const extent = "50199.4814 6582464.0358 761274.6247 7320000.0000"

const createLayerDefinition = (fileName, layerName, year) => {
  const yearName = year < 0 ? `${-year} eaa.` : `${year} jaa.`
  return `
  LAYER
      NAME "${layerName}"
      TYPE POLYGON
      STATUS ON
      CONNECTIONTYPE OGR
      CONNECTION "${fileName}"
      DATA "${layerName}"
      EXTENT ${extent}
      PROCESSING "CLOSE_CONNECTION=DEFER"
      METADATA
          "wms_title"           "Vuosi ${yearName}"
      END
      CLASS
          STYLE
              COLOR "#c9ecfa"
              OUTLINECOLOR 0 0 0
              WIDTH 1
          END #style
      END #class
  END #layer
`
}

const startYear = 1950
const layerStepYears = 100
let yearsFrom1950 = 0
let layerDefs = ""

for (const { file, max } of fileNames) {
  while (yearsFrom1950 <= max) {
    let layerSuffix = yearsFrom1950

    // There is no issjohav_0 but there is issjohav_1
    if (layerSuffix === 0) {
      layerSuffix = 1
    }
    const layerName = `issjohav_${layerSuffix}`
    if (missingOrBrokenLayers.includes(layerName)) {
      yearsFrom1950 += layerStepYears
      continue
    }
    layerDefs += createLayerDefinition(
      file,
      layerName,
      startYear - yearsFrom1950
    )
    yearsFrom1950 += layerStepYears
  }
}

const result = `
MAP
    NAME "Maankohoaminen"
    EXTENT ${extent}
    PROJECTION
        "init=epsg:3067"
    END
    WEB
        METADATA
            "wms_title"           "WMS Maankohoaminen Server"
            "wms_onlineresource"  "http://localhost:8080/?map=/etc/mapserver/mapserver.map"
            "wms_srs"             "EPSG:3067"
            "wms_enable_request"  "GetMap GetFeatureInfo GetCapabilities"
        END
    END
    ${layerDefs}
END #map
`

fs.writeFileSync("./mapserver.map", result)
