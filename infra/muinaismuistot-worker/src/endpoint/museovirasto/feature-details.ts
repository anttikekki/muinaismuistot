export type FeatureDetailRow = {
  request_order: number
  source_layer: string | null
  feature_id: number | null
  logical_layer_id: string | null
  registry_id: string | null
  name: string | null
  municipality: string | null
  properties_json: string | null
}

export function featureResponse(row: FeatureDetailRow) {
  return {
    sourceLayer: row.source_layer,
    featureId: String(row.feature_id),
    logicalLayerId: row.logical_layer_id,
    properties: {
      ...JSON.parse(row.properties_json ?? "{}"),
      registryId: row.registry_id,
      name: row.name,
      municipality: row.municipality,
    },
  }
}
