import { TFunction } from "i18next"
import {
  ArgisFeature,
  MuinaisjaannosPisteArgisFeature,
  MuinaisjaannosAlueArgisFeature,
  MuinaisjaannosAjoitus,
  MaailmanperintoAlueArgisFeature,
  MaailmanperintoPisteArgisFeature,
  AhvenanmaaForminnenArgisFeature,
  MuseovirastoLayer,
  AhvenanmaaLayer,
  ModelFeatureProperties,
  GeoJSONFeature,
  FeatureLayer,
  ModelLayer,
  MaisemanMuistiLayer,
  MaisemanMuistiFeatureProperties
} from "../types"

export const isKiinteäMuinaisjäännös = (
  feature: MuinaisjaannosPisteArgisFeature | MuinaisjaannosAlueArgisFeature
): boolean => {
  return trim(feature.attributes.laji) === "kiinteä muinaisjäännös"
}

export const isMuuKulttuuriperintökohde = (
  feature: MuinaisjaannosPisteArgisFeature | MuinaisjaannosAlueArgisFeature
): boolean => {
  return trim(feature.attributes.laji) === "muu kulttuuriperintökohde"
}

export const getFeatureName = (feature: ArgisFeature): string => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_piste:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
      return trim(feature.attributes.kohdenimi)
    case MuseovirastoLayer.Maailmanperinto_piste:
    case MuseovirastoLayer.Maailmanperinto_alue:
      return trim(feature.attributes.Nimi)
    case AhvenanmaaLayer.Fornminnen: {
      const id = trim(feature.attributes["Fornlämnings ID"])
      const name = trim(feature.attributes.Namn)
      const types =
        feature.attributes.typeAndDating
          ?.map(({ Und_typ: subType }) => subType)
          .filter((v) => !!v)
          .join(", ") ?? ""
      const suffix = [name, types].filter((v) => !!v).join(", ")
      return `${id} ${suffix}`
    }
    case AhvenanmaaLayer.MaritimtKulturarv:
      return `${trim(feature.attributes.FornID)} ${trim(
        feature.attributes.Namn
      )}`
  }
}

export const getFeatureTypeName = (
  feature: ArgisFeature,
  has3dModels: boolean = false,
  hasMaisemanMuistiFeatures: boolean = false
): string | undefined => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
      return [
        isKiinteäMuinaisjäännös(feature) ? "Kiinteä muinaisjäännös" : undefined,
        isMuuKulttuuriperintökohde(feature)
          ? "Muu kulttuuriperintökohde"
          : undefined,
        trim(feature.attributes.tyyppi),
        hasMaisemanMuistiFeatures
          ? "Valtakunnallisesti merkittävä muinaisjäännös"
          : undefined
      ]
        .filter((v) => !!v)
        .join(", ")
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      if (isKiinteäMuinaisjäännös(feature)) {
        return "Kiinteä muinaisjäännös (alue)"
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return "Muu kulttuuriperintökohde (alue)"
      }
      break
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_piste:
    case MuseovirastoLayer.RKY_viiva:
      return "Rakennettu kulttuuriympäristö"
    case MuseovirastoLayer.Maailmanperinto_piste:
    case MuseovirastoLayer.Maailmanperinto_alue:
      return "Maailmanperintökohde"
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
      return "Rakennusperintökohde"
    case AhvenanmaaLayer.Fornminnen:
      return "Ahvenanmaan muinaisjäännösrekisterin kohde"
    case AhvenanmaaLayer.MaritimtKulturarv:
      return "Ahvenamaan merellisen kulttuuriperintörekisterin kohde"
    default:
      return undefined
  }
}

export const getTypeIconURL = (
  imageName: string,
  has3dModels: boolean = false
) => `images/${imageName}${has3dModels ? "_3d" : ""}.png`

export const getFeatureTypeIconURL = (
  feature: ArgisFeature,
  has3dModels: boolean = false,
  hasMaisemanMuistiFeatures: boolean = false
): string | undefined => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
      if (isKiinteäMuinaisjäännös(feature)) {
        if (hasMaisemanMuistiFeatures) {
          return getTypeIconURL("maiseman-muisti", has3dModels)
        }
        return getTypeIconURL("muinaisjaannos_kohde", has3dModels)
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return getTypeIconURL("muu_kulttuuriperintokohde_kohde", has3dModels)
      }
      break
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      if (isKiinteäMuinaisjäännös(feature)) {
        return getTypeIconURL("muinaisjaannos_alue", has3dModels)
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return getTypeIconURL("muu-kulttuuriperintokohde-alue", has3dModels)
      }
      break
    case MuseovirastoLayer.RKY_alue:
      return getTypeIconURL("rky_alue", has3dModels)
    case MuseovirastoLayer.RKY_viiva:
      return getTypeIconURL("rky_viiva", has3dModels)
    case MuseovirastoLayer.RKY_piste:
      return getTypeIconURL("rky_piste", has3dModels)
    case MuseovirastoLayer.Maailmanperinto_alue:
      return getTypeIconURL("maailmanperinto_alue", has3dModels)
    case MuseovirastoLayer.Maailmanperinto_piste:
      return getTypeIconURL("maailmanperinto_piste", has3dModels)
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
      return getTypeIconURL("rakennusperintorekisteri_alue", has3dModels)
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return getTypeIconURL("rakennusperintorekisteri_rakennus", has3dModels)
    case AhvenanmaaLayer.Fornminnen:
      return getTypeIconURL("ahvenanmaa_muinaisjaannos", has3dModels)
    case AhvenanmaaLayer.MaritimtKulturarv:
      return getTypeIconURL("ahvenanmaa_hylky", has3dModels)
    default:
      return undefined
  }
}

export const getLayerIconURLs = (layer: FeatureLayer): Array<string> => {
  switch (layer) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
      return [
        "images/muinaisjaannos_kohde.png",
        "images/muu_kulttuuriperintokohde_kohde.png"
      ]
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      return [
        "images/muinaisjaannos_alue.png",
        "images/muu-kulttuuriperintokohde-alue.png"
      ]
    case MuseovirastoLayer.RKY_alue:
      return ["images/rky_alue.png"]
    case MuseovirastoLayer.RKY_viiva:
      return ["images/rky_viiva.png"]
    case MuseovirastoLayer.RKY_piste:
      return ["images/rky_piste.png"]
    case MuseovirastoLayer.Maailmanperinto_alue:
      return ["images/maailmanperinto_alue.png"]
    case MuseovirastoLayer.Maailmanperinto_piste:
      return ["images/maailmanperinto_piste.png"]
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
      return ["images/rakennusperintorekisteri_alue.png"]
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return ["images/rakennusperintorekisteri_rakennus.png"]
    case AhvenanmaaLayer.Fornminnen:
      return ["images/ahvenanmaa_muinaisjaannos.png"]
    case AhvenanmaaLayer.MaritimtKulturarv:
      return ["images/ahvenanmaa_hylky.png"]
    case ModelLayer.ModelLayer:
      return ["images/3d_malli_circle.png", "images/3d_malli_square.png"]
    case MaisemanMuistiLayer.MaisemanMuisti:
      return ["images/maiseman-muisti.png"]
  }
}

export const getFeatureID = (feature: ArgisFeature): string => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
    case MuseovirastoLayer.Maailmanperinto_alue:
    case MuseovirastoLayer.Maailmanperinto_piste:
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
    case AhvenanmaaLayer.Fornminnen:
    case AhvenanmaaLayer.MaritimtKulturarv:
      return feature.attributes.OBJECTID
  }
}

export const getModelsForArgisFeature = (
  feature: ArgisFeature,
  models?: Array<ModelFeatureProperties>
): Array<ModelFeatureProperties> => {
  let featureId: string | undefined
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
      featureId = feature.attributes.mjtunnus
      break
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      featureId = feature.attributes.kohdeID
      break
    case MuseovirastoLayer.RKY_alue:
      featureId = feature.attributes.ID
      break
    case AhvenanmaaLayer.Fornminnen:
      featureId = feature.attributes["Fornlämnings ID"]
      break
    case AhvenanmaaLayer.MaritimtKulturarv:
      featureId = feature.attributes.FornID
      break
  }

  return models && featureId
    ? models
        .filter((model) => model.registryItem.type === feature.layerName)
        .filter((model) => model.registryItem.id.toString() === featureId)
    : []
}

export const getModelsForMaisemanMuistiFeature = (
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>,
  models?: Array<ModelFeatureProperties>
): Array<ModelFeatureProperties> => {
  return models
    ? models
        .filter(
          (model) =>
            model.registryItem.type ===
            MuseovirastoLayer.Muinaisjaannokset_piste
        )
        .filter((model) => model.registryItem.id === feature.properties.id)
    : []
}

export const getMaisemanMuistiFeaturesForArgisFeature = (
  feature: ArgisFeature,
  maisemanMuistiFeatures?: Array<
    GeoJSONFeature<MaisemanMuistiFeatureProperties>
  >
): Array<GeoJSONFeature<MaisemanMuistiFeatureProperties>> => {
  let featureId: string | undefined
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
      featureId = feature.attributes.mjtunnus
      break
  }

  return maisemanMuistiFeatures && featureId
    ? maisemanMuistiFeatures.filter(
        (maisemanMuistiFeature) =>
          maisemanMuistiFeature.properties.id.toString() === featureId
      )
    : []
}

const getMaailmanperintoUrl = (
  feature: MaailmanperintoPisteArgisFeature | MaailmanperintoAlueArgisFeature
): string => {
  let url = feature.attributes.URL
  if (
    url.startsWith(
      "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa"
    )
  ) {
    // Deprecated nba.fi url. Redirect to new page does not work. Create new working url.
    const hashStartIndex = url.indexOf("#")
    let hash = ""
    if (hashStartIndex !== -1) {
      hash = url.substring(hashStartIndex)
    }

    url =
      "https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa" +
      hash
  }
  return url
}

export const getFeatureRegisterURL = (
  feature: ArgisFeature
): string | undefined => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return "https://" + feature.attributes.url
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return feature.attributes.url
    case MuseovirastoLayer.Maailmanperinto_alue:
    case MuseovirastoLayer.Maailmanperinto_piste:
      return getMaailmanperintoUrl(feature)
  }
}

export const getFeatureRegisterName = (
  t: TFunction,
  feature: ArgisFeature
): string => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      return t(`data.register.fromMuinaisjaannos`)
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return t(`data.register.fromRKY`)
    case MuseovirastoLayer.Maailmanperinto_alue:
    case MuseovirastoLayer.Maailmanperinto_piste:
      return t(`data.register.fromMaailmanperinto`)
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return t(`data.register.fromRakennusperintö`)
    default:
      return ""
  }
}

export const getLayerRegisterName = (
  layer: MuseovirastoLayer | AhvenanmaaLayer
): string => {
  switch (layer) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      return "Muinaisjäännösrekisteri"
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return "Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt"
    case MuseovirastoLayer.Maailmanperinto_alue:
    case MuseovirastoLayer.Maailmanperinto_piste:
      return "Maailmanperintökohteet"
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return "Rakennusperintörekisteri"
    case AhvenanmaaLayer.Fornminnen:
      return "Ahvenamaan muinaisjäännösrekisteri"
    case AhvenanmaaLayer.MaritimtKulturarv:
      return "Ahvenamaan merellinen kulttuuriperintörekisteri"
  }
}

export const getFeatureMunicipality = (
  feature: ArgisFeature
): string | undefined => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return feature.attributes.kunta
    case AhvenanmaaLayer.Fornminnen:
    case AhvenanmaaLayer.MaritimtKulturarv:
      return feature.attributes.Kommun
    default:
      return undefined
  }
}

export const getFeatureLocation = (
  feature: ArgisFeature
): [number, number] | undefined => {
  switch (feature.geometryType) {
    case "esriGeometryPolygon":
      return feature.geometry.rings[0][0]
    case "esriGeometryPoint":
      return [feature.geometry.x, feature.geometry.y]
    case "esriGeometryPolyline":
      return feature.geometry.paths[0][0]
  }
}

export const getGeoJSONFeatureLocation = (
  feature: GeoJSONFeature<
    ModelFeatureProperties | MaisemanMuistiFeatureProperties
  >
): [number, number] => {
  switch (feature.geometry.type) {
    case "Point":
      return feature.geometry.coordinates
    case "Polygon":
      return feature.geometry.coordinates[0][0]
  }
}

/**
 * Resolves timespan in years for timing name.
 *
 * @param {string} name Timing name in SE or FI. Example: "Sentida" or "rautakautinen".
 * @return {string} timespan. Example: "1200 - 1600". Returns empty string if there is no timspan for timing name.
 */
export const getTimespanInYearsForTimingName = (
  t: TFunction,
  ajoitus: MuinaisjaannosAjoitus
): string => {
  switch (trim(ajoitus)) {
    case "esihistoriallinen":
      return t(`data.dating.timespan.prehistoric`)
    case "kivikautinen":
      return t(`data.dating.timespan.stoneAge`)
    case "varhaismetallikautinen":
      return t(`data.dating.timespan.earlyMetalAge`)
    case "pronssikautinen":
      return t(`data.dating.timespan.bronzeAge`)
    case "rautakautinen":
      return t(`data.dating.timespan.ironAge`)
    case "keskiaikainen":
      return t(`data.dating.timespan.middleAge`)
    case "historiallinen":
      return t(`data.dating.timespan.historic`)
    case "moderni":
      return t(`data.dating.timespan.modern`)
    case "moniperiodinen":
    case "ajoittamaton":
    case "ei määritelty":
    default:
      return ""
  }
}

/**
 * @see https://www.kartor.ax/datasets/fornminnen-typ-och-datering
 * @see https://kartor.regeringen.ax/dokument/metadata/Fornminnen-Typ%20och%20datering%20kodade%20v%C3%A4rden.xlsx
 */
export const getAhvenanmaaForminnenTypeText = (
  typeId: number | null
): string | undefined => {
  switch (typeId) {
    case 0:
      return "Uppgifter saknas"
    case 1:
      return "Agrara lämningar"
    case 2:
      return "Bebyggelselämningar"
    case 3:
      return "Befästningsanläggningar"
    case 4:
      return "Boplatser"
    case 5:
      return "Gravar"
    case 6:
      return "Industriell-/produktionsplatser"
    case 7:
      return "Jakt och fångst"
    case 8:
      return "Kommunikations-/maritima lämningar"
    case 9:
      return "Kult, offer och folktro"
    case 10:
      return "Ristningar och minnesmärken"
    case 11:
      return "Övriga lämningar"
    default:
      return undefined
  }
}

/**
 * @see https://www.kartor.ax/datasets/fornminnen-typ-och-datering
 * @see https://kartor.regeringen.ax/dokument/metadata/Fornminnen-Typ%20och%20datering%20kodade%20v%C3%A4rden.xlsx
 */
export const getAhvenanmaaForminneDatingText = (
  t: TFunction,
  datingId: number | null
): string | undefined => {
  switch (datingId) {
    case 0:
      return t(`data.dating.main.prehistoric`)
    case 1:
      return t(`data.dating.main.historic`)
    case 2:
      return t(`data.dating.main.stoneAge`)
    case 3:
      return t(`data.dating.main.bronzeAge`)
    case 4:
      return t(`data.dating.main.ironAge`)
    case 5:
      return t(`data.dating.main.middleAge`)
    case 6:
      return t(`data.dating.main.modern`) // Sentid
    case 99:
      return t(`data.dating.main.dataMissing`)
    default:
      return undefined
  }
}

export const trim = (value: string | undefined | null): string => {
  if (!value) {
    return ""
  }

  value = value.trim()
  if (value.toLowerCase() === "null") {
    return "" //For  example RKY ajoitus field may sometimes be 'Null'
  }

  //Remove prefix commas
  while (value.substr(0, 1) === ",") {
    value = value.substring(1).trim()
  }

  //Remove trailing commas
  while (value.substr(value.length - 1, 1) === ",") {
    value = value.substring(0, value.length - 1).trim()
  }
  return value
}

export const getGeoJSONDataLatestUpdateDate = (
  features: Array<GeoJSONFeature<ModelFeatureProperties>>
): Date => {
  let dates = features.map((feature) =>
    new Date(feature.properties.createdDate).getTime()
  )
  dates = Array.from(new Set(dates)) // Make unique
  return new Date(Math.max.apply(null, dates))
}
