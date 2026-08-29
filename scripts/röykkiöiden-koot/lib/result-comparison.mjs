const MEASUREMENTS = ["lengthM", "widthM", "diameterM", "heightM"]

export function createResultComparison(descriptionResults = [], pdfResults = []) {
  const descriptions = new Map(descriptionResults.map((result) => [result.mjtunnus, result]))
  const sites = pdfResults.map((pdf) => compareSiteResults(descriptions.get(pdf.mjtunnus), pdf))
  const comparable = sites.filter((site) => site.descriptionAvailable)
  const statusMatrix = {}
  for (const site of comparable) {
    const key = `${site.descriptionStatus}|${site.pdfStatus}`
    statusMatrix[key] = (statusMatrix[key] ?? 0) + 1
  }
  return {
    schemaVersion: 1,
    pdfSites: sites.length,
    comparableSites: comparable.length,
    missingDescriptionSites: sites.length - comparable.length,
    sameMoundCountSites: comparable.filter((site) => site.moundCountDifference === false).length,
    differentMoundCountSites: comparable.filter((site) => site.moundCountDifference === true).length,
    sameMeasurementSites: comparable.filter((site) => site.measurementDifference === false).length,
    differentMeasurementSites: comparable.filter((site) => site.measurementDifference === true).length,
    unpairedMeasurementSites: comparable.filter((site) => site.measurementDifference === null).length,
    differentApproximationSites: comparable.filter((site) => site.approximationDifference === true).length,
    sameStatusSites: comparable.filter((site) => site.statusDifference === false).length,
    differentStatusSites: comparable.filter((site) => site.statusDifference === true).length,
    statusMatrix,
    lists: {
      moundCountDifference: comparable.filter((site) => site.moundCountDifference).map((site) => site.mjtunnus),
      measurementDifference: comparable.filter((site) => site.measurementDifference).map((site) => site.mjtunnus),
      approximationDifference: comparable.filter((site) => site.approximationDifference).map((site) => site.mjtunnus),
      statusDifference: comparable.filter((site) => site.statusDifference).map((site) => site.mjtunnus)
    },
    sites
  }
}

export function compareSiteResults(description, pdf) {
  const descriptionAvailable = Boolean(description)
  const descriptionCount = descriptionAvailable ? inferredCount(description) : null
  const pdfCount = inferredCount(pdf)
  const moundCountDifference = descriptionAvailable ? descriptionCount !== pdfCount : null
  const moundsPairable = descriptionAvailable && !moundCountDifference && (description.mounds?.length ?? 0) === (pdf.mounds?.length ?? 0)
  const pairedMounds = moundsPairable
    ? pairMounds(description.mounds ?? [], pdf.mounds ?? [])
    : []
  const measurementDifference = !moundsPairable
    ? null
    : pairedMounds.some((pair) => pair.differingFields.length > 0)
  const approximationDifference = !moundsPairable
    ? null
    : pairedMounds.some((pair) => pair.approximationDifferingFields.length > 0)
  const descriptionStatus = description?.validation?.status ?? null
  const pdfStatus = pdf?.validation?.status ?? null
  return {
    mjtunnus: pdf.mjtunnus,
    descriptionAvailable,
    descriptionStatus,
    pdfStatus,
    statusDifference: descriptionAvailable ? descriptionStatus !== pdfStatus : null,
    descriptionCount,
    pdfCount,
    moundCountDifference,
    moundsPairable,
    measurementDifference,
    approximationDifference,
    descriptionIssues: description?.validation?.issues ?? [],
    pdfIssues: pdf?.validation?.issues ?? [],
    descriptionMounds: (description?.mounds ?? []).map(compactMound),
    pdfMounds: (pdf?.mounds ?? []).map(compactMound),
    pairedMounds
  }
}

function inferredCount(result) {
  return Number.isInteger(result?.statedMoundCount) ? result.statedMoundCount : (result?.mounds?.length ?? 0)
}

function pairMounds(descriptionMounds, pdfMounds) {
  return descriptionMounds.map((description, index) => {
    const pdf = pdfMounds[index]
    return {
      sourceOrder: description.sourceOrder ?? index + 1,
      description: compactMound(description),
      pdf: compactMound(pdf),
      differingFields: MEASUREMENTS.filter((field) => !sameMeasurementValue(description?.[field], pdf?.[field])),
      approximationDifferingFields: MEASUREMENTS.filter((field) => sameMeasurementValue(description?.[field], pdf?.[field]) && !sameApproximation(description?.[field], pdf?.[field]))
    }
  })
}

function compactMound(mound) {
  return Object.fromEntries(["sourceOrder", ...MEASUREMENTS].map((field) => [field, mound?.[field] ?? null]))
}

function sameMeasurementValue(first, second) {
  if (first == null || second == null) return first == null && second == null
  return first.min === second.min && first.max === second.max
}

function sameApproximation(first, second) {
  if (first == null || second == null) return true
  return Boolean(first.approximate) === Boolean(second.approximate)
}
