import { execSync } from "child_process"
import fs from "fs"
import path from "path"

/**
 * File names from https://resource.sgu.se/oppnadata/html/jordarter/strandforskjutningsmodell-nedladdning.html
 */
const fileNames = [
  "strandforskjutning_1_900.gpkg",
  "strandforskjutning_1000_1900.gpkg",
  "strandforskjutning_2000_2900.gpkg",
  "strandforskjutning_3000_3900.gpkg",
  "strandforskjutning_4000_4900.gpkg",
  "strandforskjutning_5000_5900.gpkg",
  "strandforskjutning_6000_6900.gpkg",
  "strandforskjutning_7000_7900.gpkg",
  "strandforskjutning_8000_8900.gpkg",
  "strandforskjutning_9000_9900.gpkg",
  "strandforskjutning_10000_10900.gpkg",
  "strandforskjutning_11000_11900.gpkg",
  "strandforskjutning_12000_12900.gpkg",
  "strandforskjutning_13000_13500.gpkg"
]

const getDownloadUrl = (fileName) =>
  `https://resource.sgu.se/data/oppnadata/jord/strandforskjutningsmodell/${fileName}`

const downloadFolder = path.resolve("./1-downloaded-gpkg")
const reprojectFolder = path.resolve("./2-reprojected-gpkg")
const croppedFolder = path.resolve("./3-cropped-gpkg")

console.info(`\nStep 0: check environment`)
for (const folder of [downloadFolder, reprojectFolder, croppedFolder]) {
  if (!fs.existsSync(folder)) {
    console.info(`Folder ${folder} does not exist. Creating.`)
    fs.mkdirSync(folder)
  } else {
    console.info(`Folder ${folder} exist. Skipping directory creation.`)
  }
}

console.info(
  `\nStep 1. Download files that do not exists in "./1-downloaded-gpkg" folder`
)
for (const fileName of fileNames) {
  const filePath = `${downloadFolder}/${fileName}`
  if (fs.existsSync(filePath)) {
    console.info(`File ${fileName} exists. Skipping download.`)
    continue
  }

  const command = `curl ${getDownloadUrl(fileName)} --output ${filePath}`
  console.info(`Downloading file ${fileName}: ${command}`)
  execSync(command)
  console.info(`Downloading file ${fileName} complete`)
}

console.info(
  `\nStep 2. Change files projection from EPSG:3006 (Swedish) to EPSG:3067 (Finnish) in "./2-reprojected-gpkg" folder`
)
for (const fileName of fileNames) {
  const sourceFilePath = `${downloadFolder}/${fileName}`
  const targetFilePath = `${reprojectFolder}/${fileName}`
  if (fs.existsSync(targetFilePath)) {
    console.info(`File ${targetFilePath} exists. Skipping reproject.`)
    continue
  }

  const command = `ogr2ogr ${targetFilePath} -t_srs "EPSG:3067" ${sourceFilePath}`
  console.info(`Reprojecting ${fileName}: ${command}`)
  execSync(command)
  console.info(`Reprojecting file ${fileName} complete`)
}

console.info(
  `\nStep 3. Crop files extent to Finland in "./3-cropped-gpkg" folder`
)
for (const fileName of fileNames) {
  const sourceFilePath = `${reprojectFolder}/${fileName}`
  const targetFilePath = `${croppedFolder}/${fileName}`
  if (fs.existsSync(targetFilePath)) {
    console.info(`File ${targetFilePath} exists. Skipping crop.`)
    continue
  }

  const command = `ogr2ogr -f gpkg -clipsrc 50199.4814 6582464.0358 761274.6247 7320000.0000 ${targetFilePath} ${sourceFilePath}`
  console.info(`Cropping ${fileName}: ${command}`)
  execSync(command)
  console.info(`Cropping file ${fileName} complete`)
}

console.info(`\nGPKG preparing complete.`)
