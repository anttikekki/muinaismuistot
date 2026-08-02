import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"

export async function ensureDirectory(directory) {
  await fs.mkdir(directory, { recursive: true })
}

export async function writeJsonAtomic(file, value) {
  await writeFileAtomic(file, `${JSON.stringify(value, null, 2)}\n`)
}

export async function writeFileAtomic(file, value) {
  await ensureDirectory(path.dirname(file))

  const temporaryFile = `${file}.${process.pid}.${crypto.randomUUID()}.tmp`

  try {
    await fs.writeFile(temporaryFile, value)
    await fs.rename(temporaryFile, file)
  } catch (error) {
    await fs.rm(temporaryFile, { force: true })
    throw error
  }
}

export async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"))
}

export async function readJsonIfExists(file) {
  try {
    return await readJson(file)
  } catch (error) {
    if (error.code === "ENOENT") return undefined
    throw error
  }
}

export async function fileExists(file) {
  try {
    await fs.access(file)
    return true
  } catch (error) {
    if (error.code === "ENOENT") return false
    throw error
  }
}

export async function sha256File(file) {
  const contents = await fs.readFile(file)
  return crypto.createHash("sha256").update(contents).digest("hex")
}
