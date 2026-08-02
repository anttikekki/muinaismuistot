import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"

export async function ensureDirectory(directory) {
  await fs.mkdir(directory, { recursive: true })
}

export async function writeJsonAtomic(file, value) {
  await ensureDirectory(path.dirname(file))

  const temporaryFile = `${file}.${process.pid}.${crypto.randomUUID()}.tmp`
  const json = `${JSON.stringify(value, null, 2)}\n`

  try {
    await fs.writeFile(temporaryFile, json, "utf8")
    await fs.rename(temporaryFile, file)
  } catch (error) {
    await fs.rm(temporaryFile, { force: true })
    throw error
  }
}
