import * as z from "zod/mini"
import {
  AhvenanmaaLayer,
  FeatureLayer,
  GtkLayer,
  HelsinkiLayer,
  isFeatureLayer,
  Language,
  MaannousuInfoLayer,
  MaannousuInfoLayerIndex,
  MMLPohjakarttaLayer,
  MMLVanhatKartatLayer,
  MuseovirastoLayer
} from "../common/layers.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../common/museovirasto.types"
import { EMPTY_SELECTION } from "./types"

// Invalid fields are omitted independently, preserving valid settings in the link.
const optionalParam = <T extends z.ZodMiniType>(schema: T) =>
  z.catch(z.optional(schema), undefined)

// Do not coerce null, empty strings, booleans or arrays into numbers.
const numericParam = (schema: z.ZodMiniNumber) =>
  z.pipe(
    z.transform((value: unknown) =>
      typeof value === "string" && value.trim() !== "" ? Number(value) : value
    ),
    schema
  )

const coordinate = numericParam(z.number())
const opacity = optionalParam(
  numericParam(z.number().check(z.gte(0), z.lte(1)))
)
const enabled = optionalParam(
  z.pipe(
    z.transform((value: unknown) => {
      if (value === "1" || value === 1) return true
      if (value === "0" || value === 0) return false
      if (typeof value === "string") {
        if (value.toLowerCase() === "true") return true
        if (value.toLowerCase() === "false") return false
      }
      return value
    }),
    z.boolean()
  )
)

const selection = <T extends Record<string, string>>(values: T) => {
  const item = z.enum(values)
  return optionalParam(
    z.pipe(
      z.transform((value: unknown) => {
        if (value === EMPTY_SELECTION) return []
        if (typeof value === "string") {
          // Preserve commas inside enum values; also accept encoded list separators.
          return Object.values(values).includes(value)
            ? [value]
            : value.split(",")
        }
        return value
      }),
      z.array(item)
    )
  )
}

export const urlSettingsSchema = z.object({
  x: optionalParam(coordinate),
  y: optionalParam(coordinate),
  linkedFeatureLayer: optionalParam(
    z.custom<FeatureLayer>(
      (value) => typeof value === "string" && isFeatureLayer(value)
    )
  ),
  linkedFeatureId: optionalParam(z.string()),
  linkedFeatureName: optionalParam(z.string()),
  // OpenLayers View defaults to zoom levels 0–28.
  zoom: optionalParam(numericParam(z.number().check(z.gte(0), z.lte(28)))),
  center: optionalParam(
    z.pipe(
      z.transform((value: unknown) =>
        typeof value === "string" ? value.split(",") : value
      ),
      z.tuple([coordinate, coordinate])
    )
  ),
  lang: optionalParam(z.enum(Language)),
  mmlLayer: optionalParam(z.enum(MMLPohjakarttaLayer)),
  mmlLayerEnabled: enabled,
  mmlVanhatKartatLayer: selection(MMLVanhatKartatLayer),
  mmlVanhatKartatOpacity: opacity,
  mmlVanhatKartatEnabled: enabled,
  gtkOpacity: opacity,
  gtkEnabled: enabled,
  gtktLayer: selection(GtkLayer),
  maannousuLayer: optionalParam(z.enum(MaannousuInfoLayer)),
  maannousuOpacity: opacity,
  maannousuEnabled: enabled,
  maannousuIndex: optionalParam(z.enum(MaannousuInfoLayerIndex)),
  museovirastoLayer: selection(MuseovirastoLayer),
  museovirastoOpacity: opacity,
  museovirastoEnabled: enabled,
  museovirastoVectorTiles: enabled,
  museovirastoApiBase: optionalParam(z.url({ protocol: /^https?$/ })),
  muinaisjaannosTypes: selection(MuinaisjaannosTyyppi),
  muinaisjaannosDatings: selection(MuinaisjaannosAjoitus),
  ahvenanmaaLayer: selection(AhvenanmaaLayer),
  ahvenanmaaOpacity: opacity,
  ahvenanmaaEnabled: enabled,
  helsinkiLayer: selection(HelsinkiLayer),
  helsinkiOpacity: opacity,
  helsinkiEnabled: enabled,
  viabundusYear: optionalParam(
    numericParam(z.number().check(z.int(), z.gte(1350), z.lte(1650)))
  ),
  viabundusOpacity: opacity,
  viabundusEnabled: enabled,
  modelsEnabled: enabled,
  maisemanMuistiEnabled: enabled
})

export type URLSettings = z.infer<typeof urlSettingsSchema>

export const parseURLSettings = (params: unknown): URLSettings => {
  const result = urlSettingsSchema.safeParse(params)
  const settings = result.success ? result.data : {}
  if (settings.x === undefined || settings.y === undefined) {
    delete settings.x
    delete settings.y
  }
  return settings
}
