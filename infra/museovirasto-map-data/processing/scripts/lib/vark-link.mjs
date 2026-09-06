export function varkLinkedMjRegistryId(rawUrl) {
  if (typeof rawUrl !== "string" || !rawUrl.trim()) return null
  try {
    const url = new URL(rawUrl)
    const id = url.searchParams.get("id") ?? url.searchParams.get("KOHDE_ID")
    return id && /^\d+$/.test(id) ? id : null
  } catch {
    return null
  }
}
