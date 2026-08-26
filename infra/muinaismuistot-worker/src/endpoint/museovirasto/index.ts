import { handleFeatureBatch } from "./features-batch"
import { handleFeaturesByRegister } from "./features-by-register"
import { handleHealth } from "./health"
import { handleMetadata } from "./metadata"
import { handlePmtiles } from "./pmtiles"
import { handleSearch } from "./search"

const pmtilesPattern = new URLPattern({ pathname: "/api/museovirasto/pmtiles" })
const featureBatchPattern = new URLPattern({ pathname: "/api/museovirasto/features/batch" })
const featuresByRegisterPattern = new URLPattern({ pathname: "/api/museovirasto/features/by-register" })
const searchPattern = new URLPattern({ pathname: "/api/museovirasto/search" })
const metadataPattern = new URLPattern({ pathname: "/api/museovirasto/meta" })
const healthPattern = new URLPattern({ pathname: "/api/museovirasto/health" })

export async function handleMuseovirastoRequest(request: Request, env: Env): Promise<Response | null> {
  const url = request.url
  if (pmtilesPattern.test(url)) return handlePmtiles(request, env)
  else if (featureBatchPattern.test(url)) return handleFeatureBatch(request, env)
  else if (featuresByRegisterPattern.test(url)) return handleFeaturesByRegister(request, env)
  else if (searchPattern.test(url)) return handleSearch(request, env)
  else if (metadataPattern.test(url)) return handleMetadata(request, env)
  else if (healthPattern.test(url)) return handleHealth(request, env)
  return null
}

export { parseSingleRange } from "./pmtiles"
