import { TFunction } from "i18next"
import {
  ArgisFeature,
  MuinaisjaannosPisteArgisFeature,
  MuinaisjaannosAlueArgisFeature,
  MuinaisjaannosAjoitus,
  MaailmanperintoAlueArgisFeature,
  MaailmanperintoPisteArgisFeature,
  MuseovirastoLayer,
  AhvenanmaaLayer,
  ModelFeatureProperties,
  GeoJSONFeature,
  FeatureLayer,
  ModelLayer,
  MaisemanMuistiLayer,
  MaisemanMuistiFeatureProperties,
  Language,
  MuinaisjaannosTyyppi,
  HelsinkiLayer,
  MaalinnoitusFeature,
  isMaalinnoitusYksikkoFeature,
  isMaalinnoitusKohdeFeature,
  MaalinnoitusKohdetyyppi,
  isMaalinnoitusRajausFeature,
  MaalinnoitusRajaustyyppi
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

export const getArgisFeatureName = (
  t: TFunction,
  feature: ArgisFeature
): string => {
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
          ?.map(({ Und_typ: subType }) =>
            t(`data.ahvenanmaa.subType.${subType}`, subType ?? "")
          )
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

export const getMaalinnoitusFeatureName = (
  t: TFunction,
  feature: MaalinnoitusFeature
): string => {
  if (isMaalinnoitusYksikkoFeature(feature)) {
    const { laji, lajinumero, yksikko } = feature.properties
    const lajiTranslation = t(`data.helsinki.yksikkoLaji.${laji}`, {
      defaultValue: laji
    })
    return `${lajinumero} ${t(`data.helsinki.yksikko.${yksikko}`, {
      defaultValue: yksikko ?? lajiTranslation
    })}`.trim()
  }
  if (isMaalinnoitusKohdeFeature(feature)) {
    const { tukikohtanumero, kohdetyyppi } = feature.properties
    return `${tukikohtanumero} ${t(`data.helsinki.kohdetyyppi.${kohdetyyppi}`, {
      defaultValue: kohdetyyppi
    })}`
  }
  if (isMaalinnoitusRajausFeature(feature)) {
    const { tukikohtanumero, lajinumero, rajaustyyppi } = feature.properties
    return `${lajinumero ?? tukikohtanumero} ${t(
      `data.helsinki.rajaustyyppi.${rajaustyyppi}`,
      {
        defaultValue: rajaustyyppi
      }
    )}`
  }
  return ""
}

export const getArgisFeatureTypeName = (
  t: TFunction,
  feature: ArgisFeature
): string | undefined => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
      return [
        isKiinteäMuinaisjäännös(feature)
          ? t(`data.featureType.Kiinteä muinaisjäännös`)
          : undefined,
        isMuuKulttuuriperintökohde(feature)
          ? t(`data.featureType.Muu kulttuuriperintökohde`)
          : undefined,
        feature.attributes.tyyppiSplitted[0]
          ? t(
              `data.museovirasto.type.${feature.attributes.tyyppiSplitted[0]}`,
              feature.attributes.tyyppiSplitted[0]
            )
          : undefined,
        feature.maisemanMuisti.length > 0
          ? t(`data.featureType.Valtakunnallisesti merkittävä muinaisjäännös`)
          : undefined
      ]
        .filter((v) => !!v)
        .join(", ")
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      if (isKiinteäMuinaisjäännös(feature)) {
        return t(`data.featureType.Kiinteä muinaisjäännös (alue)`) ?? undefined
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return (
          t(`data.featureType.Muu kulttuuriperintökohde (alue)`) ?? undefined
        )
      }
      break
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_piste:
    case MuseovirastoLayer.RKY_viiva:
      return t(`data.featureType.Rakennettu kulttuuriympäristö`) ?? undefined
    case MuseovirastoLayer.Maailmanperinto_piste:
    case MuseovirastoLayer.Maailmanperinto_alue:
      return t(`data.featureType.Maailmanperintökohde`) ?? undefined
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
      return t(`data.featureType.Rakennusperintökohde`) ?? undefined
    case AhvenanmaaLayer.Fornminnen:
      return (
        t(`data.featureType.Ahvenanmaan muinaisjäännösrekisterin kohde`) ??
        undefined
      )
    case AhvenanmaaLayer.MaritimtKulturarv:
      return (
        t(
          `data.featureType.Ahvenanmaan merellisen kulttuuriperintörekisterin kohde`
        ) ?? undefined
      )
    default:
      return undefined
  }
}

export const getMaalinnoitusFeatureTypeName = (
  t: TFunction,
  feature: MaalinnoitusFeature
): string => {
  if (isMaalinnoitusYksikkoFeature(feature)) {
    return `${t(`data.featureType.maalinnoitus`)}, ${t(
      `data.helsinki.featureType.yksikkö`
    )}`
  }
  if (isMaalinnoitusKohdeFeature(feature)) {
    return `${t(`data.featureType.maalinnoitus`)}, ${t(
      `data.helsinki.featureType.kohde`
    )}`
  }
  if (isMaalinnoitusRajausFeature(feature)) {
    return `${t(`data.featureType.maalinnoitus`)}, ${t(
      `data.helsinki.featureType.rajaus`
    )}`
  }
  return ""
}

export const getTypeIconURL = (
  imageName: string,
  has3dModels: boolean = false
) => `images/${imageName}${has3dModels ? "_3d" : ""}.png`

export const getArgisFeatureTypeIconURL = (
  feature: ArgisFeature
): string | undefined => {
  const has3dModels = feature.models.length > 0
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
      if (isKiinteäMuinaisjäännös(feature)) {
        if (feature.maisemanMuisti.length > 0) {
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

export const getMaalinnoitusFeatureIconUrl = (
  feature: MaalinnoitusFeature
): string | undefined => {
  if (isMaalinnoitusYksikkoFeature(feature)) {
    return getTypeIconURL("maalinnoitus-yksikko", false)
  }
  if (isMaalinnoitusKohdeFeature(feature)) {
    switch (feature.properties.kohdetyyppi) {
      case MaalinnoitusKohdetyyppi.Asema:
        return getTypeIconURL("maalinnoitus-asema", false)
      case MaalinnoitusKohdetyyppi.Luola:
        return getTypeIconURL("maalinnoitus-luola", false)
      case MaalinnoitusKohdetyyppi.Tykkipatteri:
        return getTypeIconURL("maalinnoitus-tykkipatteri", false)
      case MaalinnoitusKohdetyyppi.Tykkitie:
        return getTypeIconURL("maalinnoitus-tykkitie", false)
    }
  }
  if (isMaalinnoitusRajausFeature(feature)) {
    switch (feature.properties.rajaustyyppi) {
      case MaalinnoitusRajaustyyppi.Tukikohta:
        return getTypeIconURL("maalinnoitus-tukikohdan-raja", false)
      case MaalinnoitusRajaustyyppi.Puolustusasema:
        return getTypeIconURL("maalinnoitus-puolustusaseman-raja", false)
    }
  }
  return undefined
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
    case HelsinkiLayer.Maalinnoitus_kohteet:
      return [
        "images/maalinnoitus-asema.png",
        "images/maalinnoitus-luola.png",
        "images/maalinnoitus-tykkitie.png",
        "images/maalinnoitus-tykkipatteri.png"
      ]
    case HelsinkiLayer.Maalinnoitus_rajaukset:
      return [
        "images/maalinnoitus-tukikohdan-raja.png",
        "images/maalinnoitus-puolustusaseman-raja.png"
      ]
    case HelsinkiLayer.Maalinnoitus_karttatekstit:
      return ["images/maalinnoitus-teksti-viite.png"]
    case HelsinkiLayer.Maalinnoitus_yksikot:
      return ["images/maalinnoitus-yksikko.png"]
  }
}

export const getFeatureID = (feature: ArgisFeature): string => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      return feature.attributes.mjtunnus
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return feature.attributes.ID
    case MuseovirastoLayer.Maailmanperinto_alue:
    case MuseovirastoLayer.Maailmanperinto_piste:
      return feature.attributes.OBJECTID // Not a real stabile register id but data set is really small
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return feature.attributes.kohdeID
    case AhvenanmaaLayer.Fornminnen:
      return feature.attributes["Fornlämnings ID"]
    case AhvenanmaaLayer.MaritimtKulturarv:
      return feature.attributes.FornID
  }
}

export const getModelsForMaisemanMuistiFeature = (
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>,
  models?: Array<GeoJSONFeature<ModelFeatureProperties>>
): Array<GeoJSONFeature<ModelFeatureProperties>> => {
  return models
    ? models
        .filter(
          (model) =>
            model.properties.registryItem.type ===
            MuseovirastoLayer.Muinaisjaannokset_piste
        )
        .filter(
          (model) => model.properties.registryItem.id === feature.properties.id
        )
    : []
}

const getMaailmanperintoUrl = (
  feature: MaailmanperintoPisteArgisFeature | MaailmanperintoAlueArgisFeature,
  lang: Language
): string => {
  let url = feature.attributes.URL

  const hashStartIndex = url.indexOf("#")
  let hash = ""
  if (hashStartIndex !== -1) {
    hash = url.substring(hashStartIndex)
  }

  if (
    url.startsWith(
      "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa"
    )
  ) {
    // Deprecated nba.fi url. Redirect to new page does not work. Create new working url.
    url =
      "https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa" +
      hash
  }
  if (lang === Language.SV) {
    url =
      "https://www.museovirasto.fi/sv/om-oss/internationell-verksamhet/varldsarvet-i-finland" +
      hash
  }
  return url
}

export const getFeatureRegisterURL = (
  feature: ArgisFeature,
  lang: Language
): string | undefined => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue: {
      let url = `https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=${feature.attributes.mjtunnus}`
      if (lang === Language.SV) {
        url = url.replace("r_kohde_det.aspx", "rsv_kohde_det.aspx")
      }
      return url
    }
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return `https://www.kyppi.fi/palveluikkuna/rapea/read/asp/r_kohde_det.aspx?KOHDE_ID=${feature.attributes.kohdeID}`
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste: {
      let url = feature.attributes.url
      if (lang === Language.SV) {
        url = url
          .replace("www.rky.fi", "www.kulturmiljo.fi")
          .replace("r_kohde_det.aspx", "rsv_kohde_det.aspx")
      }
      return url
    }
    case MuseovirastoLayer.Maailmanperinto_alue:
    case MuseovirastoLayer.Maailmanperinto_piste:
      return getMaailmanperintoUrl(feature, lang)
  }
}

export const getFeatureRegisterName = (
  t: TFunction,
  feature: ArgisFeature
): string => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      return t(`details.registerLink.fromMuinaisjaannos`)
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return t(`details.registerLink.fromRKY`)
    case MuseovirastoLayer.Maailmanperinto_alue:
    case MuseovirastoLayer.Maailmanperinto_piste:
      return t(`details.registerLink.fromMaailmanperinto`)
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return t(`details.registerLink.fromRakennusperintö`)
    default:
      return ""
  }
}

export const getLayerRegisterName = (
  t: TFunction,
  layer: MuseovirastoLayer | AhvenanmaaLayer
): string => {
  switch (layer) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      return t(`data.register.Muinaisjäännösrekisteri`)
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return t(
        `data.register.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`
      )
    case MuseovirastoLayer.Maailmanperinto_alue:
    case MuseovirastoLayer.Maailmanperinto_piste:
      return t(`data.register.Maailmanperintökohteet`)
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return t(`data.register.Rakennusperintörekisteri`)
    case AhvenanmaaLayer.Fornminnen:
      return t(`data.register.Ahvenanmaan muinaisjäännösrekisteri`)
    case AhvenanmaaLayer.MaritimtKulturarv:
      return t(`data.register.Ahvenanmaan merellinen kulttuuriperintörekisteri`)
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

export const getArgisFeatureLocation = (
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

export const getMaalinnoitusFeatureLocation = (
  feature: MaalinnoitusFeature
): [number, number] => {
  switch (feature.geometry.type) {
    case "Point":
      return feature.geometry.coordinates
    case "Polygon":
      return feature.geometry.coordinates[0]
    case "LineString":
      return feature.geometry.coordinates[0]
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
  switch (ajoitus) {
    case "esihistoriallinen":
      return t(`data.timespan.prehistoric`)
    case "kivikautinen":
      return t(`data.timespan.stoneAge`)
    case "varhaismetallikautinen":
      return t(`data.timespan.earlyMetalAge`)
    case "pronssikautinen":
      return t(`data.timespan.bronzeAge`)
    case "rautakautinen":
      return t(`data.timespan.ironAge`)
    case "keskiaikainen":
      return t(`data.timespan.middleAge`)
    case "historiallinen":
      return t(`data.timespan.historic`)
    case "moderni":
      return t(`data.timespan.modern`)
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
  t: TFunction,
  typeId: number | null
): string | undefined => {
  switch (typeId) {
    case 0:
      return t(`data.ahvenanmaa.type.Uppgifter saknas`) ?? undefined
    case 1:
      return t(`data.ahvenanmaa.type.Agrara lämningar`) ?? undefined
    case 2:
      return t(`data.ahvenanmaa.type.Bebyggelselämningar`) ?? undefined
    case 3:
      return t(`data.ahvenanmaa.type.Befästningsanläggningar`) ?? undefined
    case 4:
      return t(`data.ahvenanmaa.type.Boplatser`) ?? undefined
    case 5:
      return t(`data.ahvenanmaa.type.Gravar`) ?? undefined
    case 6:
      return (
        t(`data.ahvenanmaa.type.Industriell-/produktionsplatser`) ?? undefined
      )
    case 7:
      return t(`data.ahvenanmaa.type.Jakt och fångst`) ?? undefined
    case 8:
      return (
        t(`data.ahvenanmaa.type.Kommunikations-/maritima lämningar`) ??
        undefined
      )
    case 9:
      return t(`data.ahvenanmaa.type.Kult, offer och folktro`) ?? undefined
    case 10:
      return t(`data.ahvenanmaa.type.Ristningar och minnesmärken`) ?? undefined
    case 11:
      return t(`data.ahvenanmaa.type.Övriga lämningar`) ?? undefined
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
      return t(`data.ahvenanmaa.dating.Förhistorisk tid`) ?? undefined
    case 1:
      return t(`data.ahvenanmaa.dating.Historisk tid`) ?? undefined
    case 2:
      return t(`data.ahvenanmaa.dating.Stenålder`) ?? undefined
    case 3:
      return t(`data.ahvenanmaa.dating.Bronsålder`) ?? undefined
    case 4:
      return t(`data.ahvenanmaa.dating.Järnålder`) ?? undefined
    case 5:
      return t(`data.ahvenanmaa.dating.Medeltid`) ?? undefined
    case 6:
      return t(`data.ahvenanmaa.dating.Sentid`) ?? undefined
    case 99:
      return t(`data.ahvenanmaa.dating.Uppgifter saknas`) ?? undefined
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

  return value
    .split(", ")
    .map((v) => v.trim())
    .filter((v) => !!v)
    .map((v) => v.replace(",", ""))
    .filter((v) => !!v)
    .join(", ")
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
