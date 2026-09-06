import * as z from "zod/mini"

const finnaResultSchema = z.object({
  resultCount: z.number().check(z.int(), z.gte(0))
})

// Finna is supplementary data: failures must not reject the promise read by React.
export const fetchFinnaImageCount = async (
  mjtunnus: number
): Promise<number | null> => {
  try {
    const response = await fetch(
      `https://api.finna.fi/api/v1/search?field[]=resultCount&filter[]=geographic_id_str_mv:"(mjr)${mjtunnus}"&filter[]=online_boolean:"1"&filter[]=format:"0/Image/"`
    )
    if (!response.ok) return null

    const result = finnaResultSchema.safeParse(await response.json())
    return result.success ? result.data.resultCount : null
  } catch {
    return null
  }
}
