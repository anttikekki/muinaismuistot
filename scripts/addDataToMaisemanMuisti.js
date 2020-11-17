const fs = require("fs")
const path = require("path")
const https = require("https")

const trim = (value) => {
  if (value == null) {
    //Null and undefined
    return ""
  }

  value = value.trim()
  if (value.toLowerCase() === "null") {
    return "" //For  example RKY ajoitus field may sometimes be 'Null'
  }

  //Remove trailing commas
  while (value.substr(value.length - 1, 1) === ",") {
    value = value.substring(0, value.length - 1).trim()
  }
  return value
}

async function fetchDataFromNBA(id) {
  const urlParams = new URLSearchParams({
    searchText: String(id),
    searchFields: "mjtunnus",
    contains: "false",
    layers: "7",
    f: "json",
    returnGeometry: "false",
    returnZ: "false"
  })

  const url = new URL(
    "https://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/find"
  )
  url.search = String(urlParams)

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = ""

      res.on("data", (d) => {
        body += d
      })
      res.on("end", () => {
        resolve(JSON.parse(body))
      })
    })
  })
}

const filePath = path.resolve(
  __dirname,
  "../src/maisemanmuisti/maisemanmuisti.json"
)
let data = JSON.parse(fs.readFileSync(filePath))

Promise.all(
  data.features.map(async (f, i) => {
    const id = f.properties.id
    const response = await fetchDataFromNBA(id)
    console.log("Processing item", i, " mjtunnus:", id)
    const {
      tyyppi,
      kohdenimi,
      alatyyppi,
      ajoitus
    } = response.results[0].attributes
    return {
      ...f,
      properties: {
        ...f.properties,
        registerName: kohdenimi,
        type: trim(tyyppi),
        subtype: trim(alatyyppi),
        dating: trim(ajoitus)
      }
    }
  })
).then((features) => {
  data.features = features
  fs.writeFileSync(filePath, JSON.stringify(data))
})
