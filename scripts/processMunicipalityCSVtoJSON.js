const fs = require("fs")
const path = require("path")

const csvfilePath = path.resolve(
  __dirname,
  "../../kuntaluettelo-laajat-tiedot-2021-01-01.csv"
)
let csvData = String(fs.readFileSync(csvfilePath))

const result = csvData
  .split("\r\n")
  .map(row => {
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
  .filter(row => row.nameFI !== "KUNTANIMIFI")

const resultfilePath = path.resolve(
  __dirname,
  "../src/common/municipality.json"
)
fs.writeFileSync(resultfilePath, JSON.stringify(result))
