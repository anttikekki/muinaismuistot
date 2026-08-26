export class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = "ValidationError"
  }
}

export function assertValid(condition, message) {
  if (!condition) throw new ValidationError(message)
}

export function formatValues(values) {
  return JSON.stringify([...values].sort())
}

export async function runValidation(main) {
  try {
    await main()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    process.stderr.write(`Error: ${message}\n`)
    process.exitCode = 1
  }
}
