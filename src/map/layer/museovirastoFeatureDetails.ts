import { Geometry } from "geojson"
import { MuseovirastoFeature } from "../../common/museovirasto.types"

export interface FeatureReference {
  sourceLayer: string
  featureId: string
}

export interface FeatureBatchItem extends FeatureReference {
  logicalLayerId: string
  geometry: Geometry
  properties: Record<string, unknown> & {
    registryId: string | null
    name: string | null
    municipality: string | null
  }
}

export interface FeatureBatchResult {
  features: FeatureBatchItem[]
  missing: FeatureReference[]
}

const archaeologicalKinds: Record<string, string> = {
  kiintea_muinaisjaannos: "kiinteä muinaisjäännös",
  muu_kulttuuriperintokohde: "muu kulttuuriperintökohde",
  loytopaikka: "löytöpaikka",
  havaintokohde: "havaintokohde",
  luonnonmuodostuma: "luonnonmuodostuma",
  mahdollinen_muinaisjaannos: "mahdollinen muinaisjäännös",
  muu_kohde: "muu kohde",
  poistettu_kiintea_muinaisjaannos:
    "poistettu kiinteä muinaisjäännös (ei rauhoitettu)"
}

export function toMuseovirastoFeature(
  item: FeatureBatchItem,
  geometry: Geometry = item.geometry
): MuseovirastoFeature {
  const shortLayerId = item.logicalLayerId.split(":").slice(-1)[0] ?? "unknown"
  const properties = propertiesForLayer(item)
  return {
    type: "Feature",
    id: `${shortLayerId}.${item.featureId}`,
    geometry,
    properties,
    models: [],
    maisemanMuisti: []
  } as unknown as MuseovirastoFeature
}

function propertiesForLayer(item: FeatureBatchItem): Record<string, unknown> {
  const source = item.properties
  const objectId = Number(item.featureId)
  const registryId = source.registryId ?? ""
  const name = source.name ?? ""
  const municipality = source.municipality ?? ""
  const common = { OBJECTID: objectId }

  if (item.sourceLayer.startsWith("archaeological_")) {
    const kind = String(source.laji_key ?? "")
    return {
      ...common,
      mjtunnus: Number(registryId),
      kohdenimi: name,
      kunta: municipality,
      Laji: archaeologicalKinds[kind] ?? kind,
      tyyppi: source.types_raw ?? "",
      alatyyppi: source.subtypes_raw ?? "",
      ajoitus: source.datings_raw ?? "",
      alakohdetunnus: Number(source.subsite_id ?? 0)
    }
  }

  if (item.sourceLayer.startsWith("vark_")) {
    return {
      ...common,
      VARK_ID: Number(registryId),
      VARK_nimi: name,
      Kunta: municipality,
      Tyyppi: source.types_raw ?? "",
      Alatyyppi: source.subtypes_raw ?? "",
      Ajoitus: source.datings_raw ?? "",
      Linkki: `https://www.kyppi.fi/palveluikkuna/VARKL/asp/v_kohde_det.aspx?KOHDE_ID=${registryId}`
    }
  }

  if (item.sourceLayer.startsWith("rky_")) {
    return {
      ...common,
      ID: registryId,
      kohdenimi: name,
      nimi: source.part_name ?? "",
      url: `https://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=${registryId}`
    }
  }

  if (item.sourceLayer.startsWith("protected_building_")) {
    return {
      ...common,
      KOHDEID: Number(registryId),
      rakennusID: Number(source.building_id ?? 0),
      kohdenimi: name,
      rakennusnimi: source.building_name ?? "",
      kunta: municipality,
      suojeluryhmä: source.protection_groups_raw ?? "",
      suojelun_tila: source.protection_status ?? ""
    }
  }

  const worldHeritageUrl =
    "https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa"
  return item.sourceLayer === "world_heritage_points"
    ? { ...common, nimi: name, url: worldHeritageUrl }
    : {
        ...common,
        Nimi: name,
        URL: worldHeritageUrl,
        Alue: source.area_type ?? null
      }
}
