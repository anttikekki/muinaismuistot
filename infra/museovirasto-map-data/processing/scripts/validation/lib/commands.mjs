import { spawnSync } from "node:child_process"
import { ValidationError } from "./diagnostics.mjs"

export function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    input: options.input,
    maxBuffer: options.maxBuffer ?? 256 * 1024 * 1024,
  })
  if (result.error) throw new ValidationError(`Could not run ${command}: ${result.error.message}`)
  if (result.status !== 0) {
    const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.status}`
    throw new ValidationError(`${command} failed: ${detail}`)
  }
  return result.stdout
}

export function runJson(command, args, options) {
  const output = runCommand(command, args, options)
  try {
    return JSON.parse(output)
  } catch (error) {
    throw new ValidationError(`${command} returned invalid JSON: ${error.message}`)
  }
}

export function quoteSqlIdentifier(value) {
  return `"${String(value).replaceAll('"', '""')}"`
}
