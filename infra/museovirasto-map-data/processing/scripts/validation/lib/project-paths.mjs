import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const validationDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")
export const mapDataDirectory = resolve(validationDirectory, "../../..")
export const repositoryDirectory = resolve(mapDataDirectory, "../..")
export const buildDirectory = resolve(mapDataDirectory, "data/build")
export const sourceDirectory = resolve(mapDataDirectory, "data/tutkija")
export const mappingPath = resolve(mapDataDirectory, "contract/layer-mapping.json")
export const vocabularyPath = resolve(mapDataDirectory, "contract/filter-vocabulary.json")
export const buildConfigPath = resolve(mapDataDirectory, "processing/config/layers.json")
