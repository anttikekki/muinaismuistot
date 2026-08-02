export const MOUND_EXTRACTION_SCHEMA_VERSION = 1

const NULLABLE_STRING = {
  anyOf: [{ type: "string" }, { type: "null" }]
}

const NULLABLE_INTEGER = {
  anyOf: [{ type: "integer", minimum: 1 }, { type: "null" }]
}

const NULLABLE_DIRECTION = {
  anyOf: [
    { type: "string", enum: ["north", "south"] },
    { type: "null" }
  ]
}

const MEASUREMENT = {
  anyOf: [
    {
      type: "object",
      additionalProperties: false,
      properties: {
        min: { type: "number", minimum: 0 },
        max: { type: "number", minimum: 0 },
        approximate: { type: "boolean" }
      },
      required: ["min", "max", "approximate"]
    },
    { type: "null" }
  ]
}

export const MOUND_EXTRACTION_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    mjtunnus: { type: "string" },
    statedMoundCount: {
      anyOf: [
        { type: "integer", minimum: 0 },
        { type: "null" }
      ]
    },
    mounds: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceOrder: { type: "integer", minimum: 1 },
          ordinal: NULLABLE_INTEGER,
          direction: NULLABLE_DIRECTION,
          lengthM: MEASUREMENT,
          widthM: MEASUREMENT,
          diameterM: MEASUREMENT,
          heightM: MEASUREMENT,
          shape: NULLABLE_STRING,
          status: NULLABLE_STRING,
          confidence: {
            type: "string",
            enum: ["high", "medium", "low"]
          },
          needsReview: { type: "boolean" },
          evidence: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: [
          "sourceOrder",
          "ordinal",
          "direction",
          "lengthM",
          "widthM",
          "diameterM",
          "heightM",
          "shape",
          "status",
          "confidence",
          "needsReview",
          "evidence"
        ]
      }
    },
    notes: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["mjtunnus", "statedMoundCount", "mounds", "notes"]
}

export function assertMoundExtractionResult(value, expectedMjtunnus) {
  if (!isObject(value)) throw new Error("OpenAI-tulos ei ole JSON-objekti")
  if (value.mjtunnus !== expectedMjtunnus) {
    throw new Error(
      `OpenAI-tuloksen mjtunnus ${value.mjtunnus} ei vastaa ` +
        `odotettua tunnusta ${expectedMjtunnus}`
    )
  }
  if (
    value.statedMoundCount !== null &&
    (!Number.isInteger(value.statedMoundCount) || value.statedMoundCount < 0)
  ) {
    throw new Error("OpenAI-tuloksen statedMoundCount on virheellinen")
  }
  if (!Array.isArray(value.mounds)) {
    throw new Error("OpenAI-tuloksesta puuttuu mounds-taulukko")
  }
  if (!Array.isArray(value.notes) || value.notes.some((note) => typeof note !== "string")) {
    throw new Error("OpenAI-tuloksen notes on virheellinen")
  }

  const sourceOrders = new Set()
  for (const mound of value.mounds) {
    validateMound(mound)
    if (sourceOrders.has(mound.sourceOrder)) {
      throw new Error(`OpenAI-tuloksessa toistuu sourceOrder ${mound.sourceOrder}`)
    }
    sourceOrders.add(mound.sourceOrder)
  }

  return value
}

function validateMound(mound) {
  if (!isObject(mound)) throw new Error("OpenAI-tuloksen röykkiö ei ole objekti")
  if (!Number.isInteger(mound.sourceOrder) || mound.sourceOrder < 1) {
    throw new Error("OpenAI-tuloksen sourceOrder on virheellinen")
  }
  if (mound.ordinal !== null && (!Number.isInteger(mound.ordinal) || mound.ordinal < 1)) {
    throw new Error("OpenAI-tuloksen ordinal on virheellinen")
  }
  if (![null, "north", "south"].includes(mound.direction)) {
    throw new Error("OpenAI-tuloksen direction on virheellinen")
  }

  for (const field of ["lengthM", "widthM", "diameterM", "heightM"]) {
    validateMeasurement(mound[field], field)
  }
  for (const field of ["shape", "status"]) {
    if (mound[field] !== null && typeof mound[field] !== "string") {
      throw new Error(`OpenAI-tuloksen ${field} on virheellinen`)
    }
  }
  if (!["high", "medium", "low"].includes(mound.confidence)) {
    throw new Error("OpenAI-tuloksen confidence on virheellinen")
  }
  if (typeof mound.needsReview !== "boolean") {
    throw new Error("OpenAI-tuloksen needsReview on virheellinen")
  }
  if (
    !Array.isArray(mound.evidence) ||
    mound.evidence.some((evidence) => typeof evidence !== "string")
  ) {
    throw new Error("OpenAI-tuloksen evidence on virheellinen")
  }
}

function validateMeasurement(measurement, field) {
  if (measurement === null) return
  if (
    !isObject(measurement) ||
    !Number.isFinite(measurement.min) ||
    !Number.isFinite(measurement.max) ||
    measurement.min < 0 ||
    measurement.max < measurement.min ||
    typeof measurement.approximate !== "boolean"
  ) {
    throw new Error(`OpenAI-tuloksen ${field} on virheellinen`)
  }
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}
