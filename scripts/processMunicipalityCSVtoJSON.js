const fs = require("fs")
const path = require("path")
const https = require("https")

async function fetchMunicipalityCSV(id) {
  const url =
    "https://www.avoindata.fi/data/dataset/df2f2475-23ce-42a0-b509-cb2bb169f5f6/resource/cb261c69-9883-486b-9e41-e0560471df86/download/kuntaluettelo-laajat-tiedot-2021-01-01.csv"

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // First URL returns redirect to avoindata-prod-datasets.s3.amazonaws.com
      if (res.statusCode == 302) {
        https.get(res.headers.location, (res) => {
          let body = ""

          res.on("data", (d) => {
            body += d
          })
          res.on("end", () => {
            resolve(body)
          })
        })
      }
    })
  })
}

async function processMunicipalityCSVtoJSON() {
  const csvData = await fetchMunicipalityCSV()
  const result = csvData
    .split("\r\n")
    .map((row) => {
      const [
        KUNTANRO,
        KUNTANIMIFI,
        KUNTANIMISV,
        KUNTAMUOTO,
        KIELISYYS,
        VAALIPIIRINRO,
        VAALIPIIRIFI,
        VAALIPIIRISV,
        MAAKUNTANRO,
        MAAKUNTANIMIFI,
        MAAKUNTANIMISV
      ] = row.split(";")
      return {
        nameFI: KUNTANIMIFI,
        nameSE: KUNTANIMISV,
        regionNameFI: MAAKUNTANIMIFI,
        regionNameSE: MAAKUNTANIMISV
      }
    })
    .filter((row) => row.nameFI !== "KUNTANIMIFI") // Filter header row
    .filter((row) => !!row.nameFI) // Filter empty row at te end

  const resultfilePath = path.resolve(
    __dirname,
    "../src/common/municipality.json"
  )
  fs.writeFileSync(resultfilePath, JSON.stringify(result))
}

processMunicipalityCSVtoJSON()
