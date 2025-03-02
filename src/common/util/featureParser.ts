import { TFunction } from "i18next"
import { ModelFeatureProperties } from "../3dModels.types"
import { isAhvenanmaaArcgisFeature } from "../ahvenanmaa.types"
import { GeoJSONFeature } from "../geojson.types"
import {
  AhvenanmaaLayer,
  FeatureLayer,
  HelsinkiLayer,
  Language,
  MaisemanMuistiLayer,
  ModelLayer,
  MuseovirastoLayer
} from "../layers.types"
import {
  MaalinnoitusKohdetyyppi,
  MaalinnoitusRajaustyyppi,
  isMaalinnoitusKohdeFeature,
  isMaalinnoitusRajausFeature,
  isMaalinnoitusYksikkoFeature
} from "../maalinnoitusHelsinki.types"
import { MaisemanMuistiFeatureProperties } from "../maisemanMuisti.types"
import { MapFeature, isArcGisFeature, isWmsFeature } from "../mapFeature.types"
import {
  MaailmanperintoAlueWmsFeature,
  MaailmanperintoPisteWmsFeature,
  MuinaisjaannosAjoitus,
  isMaailmanperintoAlueWmsFeature,
  isMaailmanperintoPisteWmsFeature,
  isMuinaisjaannosAlueWmsFeature,
  isMuinaisjaannosPisteWmsFeature,
  isMuseovirastoWmsFeature,
  isMuuKulttuuriperintokohdeAlueWmsFeature,
  isMuuKulttuuriperintokohdePisteWmsFeature,
  isRKYAlueWmsFeature,
  isRKYPisteWmsFeature,
  isRKYViivaWmsFeature,
  isSuojellutRakennuksetAlueWmsFeature,
  isSuojellutRakennuksetPisteWmsFeature
} from "../museovirasto.types"

export const getFeatureName = (t: TFunction, feature: MapFeature): string => {
  if (isWmsFeature(feature)) {
    if (
      isMaailmanperintoAlueWmsFeature(feature) ||
      isMaailmanperintoPisteWmsFeature(feature)
    ) {
      return trim(feature.properties.Nimi)
    }
    if (
      isMuinaisjaannosPisteWmsFeature(feature) ||
      isMuinaisjaannosAlueWmsFeature(feature) ||
      isMuuKulttuuriperintokohdePisteWmsFeature(feature) ||
      isMuuKulttuuriperintokohdeAlueWmsFeature(feature) ||
      isRKYAlueWmsFeature(feature) ||
      isRKYPisteWmsFeature(feature) ||
      isRKYViivaWmsFeature(feature) ||
      isSuojellutRakennuksetAlueWmsFeature(feature) ||
      isSuojellutRakennuksetPisteWmsFeature(feature)
    ) {
      return trim(feature.properties.kohdenimi)
    }
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
      return `${tukikohtanumero} ${t(
        `data.helsinki.kohdetyyppi.${kohdetyyppi}`,
        {
          defaultValue: kohdetyyppi
        }
      )}`
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
  } else if (isAhvenanmaaArcgisFeature(feature)) {
    switch (feature.layerName) {
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
      case AhvenanmaaLayer.MaritimaFornminnen:
        return `${trim(feature.attributes.FornID)} ${trim(
          feature.attributes.Namn
        )}`
    }
  }
  return ""
}

export const getFeatureTypeName = (
  t: TFunction,
  feature: MapFeature
): string => {
  if (isWmsFeature(feature)) {
    if (isMuinaisjaannosPisteWmsFeature(feature)) {
      return [
        t(`data.featureType.Kiinteä muinaisjäännös`),
        feature.properties.tyyppiSplitted[0]
          ? t(
              `data.museovirasto.type.${feature.properties.tyyppiSplitted[0]}`,
              feature.properties.tyyppiSplitted[0]
            )
          : undefined,
        feature.maisemanMuisti.length > 0
          ? t(`data.featureType.Valtakunnallisesti merkittävä muinaisjäännös`)
          : undefined
      ]
        .filter((v) => !!v)
        .join(", ")
    }
    if (isMuinaisjaannosAlueWmsFeature(feature)) {
      return t(`data.featureType.Kiinteä muinaisjäännös (alue)`)
    }
    if (isMuuKulttuuriperintokohdePisteWmsFeature(feature)) {
      return t(`data.featureType.Muu kulttuuriperintökohde`)
    }
    if (isMuuKulttuuriperintokohdeAlueWmsFeature(feature)) {
      return t(`data.featureType.Muu kulttuuriperintökohde (alue)`)
    }
    if (
      isRKYAlueWmsFeature(feature) ||
      isRKYPisteWmsFeature(feature) ||
      isRKYViivaWmsFeature(feature)
    ) {
      return t(`data.featureType.Rakennettu kulttuuriympäristö`)
    }
    if (
      isMaailmanperintoAlueWmsFeature(feature) ||
      isMaailmanperintoPisteWmsFeature(feature)
    ) {
      return t(`data.featureType.Maailmanperintökohde`)
    }
    if (
      isSuojellutRakennuksetAlueWmsFeature(feature) ||
      isSuojellutRakennuksetPisteWmsFeature(feature)
    ) {
      return t(`data.featureType.Rakennusperintökohde`)
    }
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
  } else if (isAhvenanmaaArcgisFeature(feature)) {
    switch (feature.layerName) {
      case AhvenanmaaLayer.Fornminnen:
        return (
          t(`data.featureType.Ahvenanmaan muinaisjäännösrekisterin kohde`) ??
          undefined
        )
      case AhvenanmaaLayer.MaritimaFornminnen:
        return (
          t(
            `data.featureType.Ahvenanmaan merellisen kulttuuriperintörekisterin kohde`
          ) ?? undefined
        )
    }
  }
  return ""
}

export const getTypeIconURL = (
  imageName: string,
  has3dModels: boolean = false
) => `images/${imageName}${has3dModels ? "_3d" : ""}.png`

export const getFeatureTypeIconURL = (feature: MapFeature): string => {
  const has3dModels = feature.models.length > 0
  if (isWmsFeature(feature)) {
    if (isMuinaisjaannosPisteWmsFeature(feature)) {
      if (feature.maisemanMuisti.length > 0) {
        return getTypeIconURL("maiseman-muisti", has3dModels)
      }
      return getTypeIconURL("muinaisjaannos_kohde", has3dModels)
    }
    if (isMuinaisjaannosAlueWmsFeature(feature)) {
      return getTypeIconURL("muinaisjaannos_alue", has3dModels)
    }
    if (isMuuKulttuuriperintokohdePisteWmsFeature(feature)) {
      return getTypeIconURL("muu_kulttuuriperintokohde_kohde", has3dModels)
    }
    if (isMuuKulttuuriperintokohdeAlueWmsFeature(feature)) {
      return getTypeIconURL("muu-kulttuuriperintokohde-alue", has3dModels)
    }
    if (isMuuKulttuuriperintokohdePisteWmsFeature(feature)) {
      return getTypeIconURL("muu_kulttuuriperintokohde_kohde", has3dModels)
    }
    if (isMuuKulttuuriperintokohdeAlueWmsFeature(feature)) {
      return getTypeIconURL("muu-kulttuuriperintokohde-alue", has3dModels)
    }
    if (isRKYAlueWmsFeature(feature)) {
      return getTypeIconURL("rky_alue", has3dModels)
    }
    if (isRKYPisteWmsFeature(feature)) {
      return getTypeIconURL("rky_piste", has3dModels)
    }
    if (isRKYViivaWmsFeature(feature)) {
      return getTypeIconURL("rky_viiva", has3dModels)
    }
    if (isMaailmanperintoAlueWmsFeature(feature)) {
      return getTypeIconURL("maailmanperinto_alue", has3dModels)
    }
    if (isMaailmanperintoPisteWmsFeature(feature)) {
      return getTypeIconURL("maailmanperinto_piste", has3dModels)
    }
    if (isSuojellutRakennuksetAlueWmsFeature(feature)) {
      return getTypeIconURL("rakennusperintorekisteri_alue", has3dModels)
    }
    if (isSuojellutRakennuksetPisteWmsFeature(feature)) {
      return getTypeIconURL("rakennusperintorekisteri_rakennus", has3dModels)
    }
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
  } else if (isAhvenanmaaArcgisFeature(feature)) {
    switch (feature.layerName) {
      case AhvenanmaaLayer.Fornminnen:
        return getTypeIconURL("ahvenanmaa_muinaisjaannos", has3dModels)
      case AhvenanmaaLayer.MaritimaFornminnen:
        return getTypeIconURL("ahvenanmaa_hylky", has3dModels)
    }
  }
  throw new Error(`Tuntematon feature: ${JSON.stringify(feature)}`)
}

export const getLayerIconURLs = (layer: FeatureLayer): Array<string> => {
  switch (layer) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
      return ["images/muinaisjaannos_kohde.png"]
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      return ["images/muinaisjaannos_alue.png"]
    case MuseovirastoLayer.Muu_kulttuuriperintokohde_piste:
      return ["images/muu_kulttuuriperintokohde_kohde.png"]
    case MuseovirastoLayer.Muu_kulttuuriperintokohde_alue:
      return ["images/muu-kulttuuriperintokohde-alue.png"]
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
    case AhvenanmaaLayer.MaritimaFornminnen:
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

export const getFeatureID = (feature: MapFeature): string => {
  if (isWmsFeature(feature)) {
    if (
      isMuinaisjaannosPisteWmsFeature(feature) ||
      isMuinaisjaannosAlueWmsFeature(feature) ||
      isMuuKulttuuriperintokohdePisteWmsFeature(feature) ||
      isMuuKulttuuriperintokohdeAlueWmsFeature(feature)
    ) {
      return String(feature.properties.mjtunnus)
    }
    if (
      isRKYAlueWmsFeature(feature) ||
      isRKYPisteWmsFeature(feature) ||
      isRKYViivaWmsFeature(feature)
    ) {
      return String(feature.properties.ID)
    }
    if (
      isMaailmanperintoAlueWmsFeature(feature) ||
      isMaailmanperintoPisteWmsFeature(feature)
    ) {
      return String(feature.properties.OBJECTID) // Not a real stabile register id but data set is really small
    }
    if (
      isSuojellutRakennuksetAlueWmsFeature(feature) ||
      isSuojellutRakennuksetPisteWmsFeature(feature)
    ) {
      return String(feature.properties.KOHDEID)
    }
    if (
      isMaalinnoitusYksikkoFeature(feature) ||
      isMaalinnoitusKohdeFeature(feature) ||
      isMaalinnoitusRajausFeature(feature)
    ) {
      return String(feature.properties.id)
    }
  } else if (isAhvenanmaaArcgisFeature(feature)) {
    switch (feature.layerName) {
      case AhvenanmaaLayer.Fornminnen:
        return feature.attributes["Fornlämnings ID"]
      case AhvenanmaaLayer.MaritimaFornminnen:
        return feature.attributes.FornID
    }
  }
  throw new Error(`Tuntematon feature: ${JSON.stringify(feature)}`)
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
  feature: MaailmanperintoPisteWmsFeature | MaailmanperintoAlueWmsFeature,
  lang: Language
): string => {
  let url = feature.properties.URL

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
  feature: MapFeature,
  lang: Language
): string | undefined => {
  if (isMuseovirastoWmsFeature(feature)) {
    if (
      isMuinaisjaannosPisteWmsFeature(feature) ||
      isMuinaisjaannosAlueWmsFeature(feature) ||
      isMuuKulttuuriperintokohdePisteWmsFeature(feature) ||
      isMuuKulttuuriperintokohdeAlueWmsFeature(feature)
    ) {
      let url = `https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=${feature.properties.mjtunnus}`
      if (lang === Language.SV) {
        url = url.replace("r_kohde_det.aspx", "rsv_kohde_det.aspx")
      }
      return url
    }
    if (
      isRKYAlueWmsFeature(feature) ||
      isRKYPisteWmsFeature(feature) ||
      isRKYViivaWmsFeature(feature)
    ) {
      let url = feature.properties.url
      if (lang === Language.SV) {
        url = url
          .replace("www.rky.fi", "www.kulturmiljo.fi")
          .replace("r_kohde_det.aspx", "rsv_kohde_det.aspx")
      }
      return url
    }
    if (
      isMaailmanperintoAlueWmsFeature(feature) ||
      isMaailmanperintoPisteWmsFeature(feature)
    ) {
      return getMaailmanperintoUrl(feature, lang)
    }
    if (
      isSuojellutRakennuksetAlueWmsFeature(feature) ||
      isSuojellutRakennuksetPisteWmsFeature(feature)
    ) {
      return `https://www.kyppi.fi/palveluikkuna/rapea/read/asp/r_kohde_det.aspx?KOHDE_ID=${feature.properties.KOHDEID}`
    }
  }
  return undefined
}

export const getFeatureRegisterName = (
  t: TFunction,
  feature: MapFeature
): string => {
  if (isMuseovirastoWmsFeature(feature)) {
    if (
      isMuinaisjaannosPisteWmsFeature(feature) ||
      isMuinaisjaannosAlueWmsFeature(feature) ||
      isMuuKulttuuriperintokohdePisteWmsFeature(feature) ||
      isMuuKulttuuriperintokohdeAlueWmsFeature(feature)
    ) {
      return t(`details.registerLink.fromMuinaisjaannos`)
    }
    if (
      isRKYAlueWmsFeature(feature) ||
      isRKYPisteWmsFeature(feature) ||
      isRKYViivaWmsFeature(feature)
    ) {
      return t(`details.registerLink.fromRKY`)
    }
    if (
      isMaailmanperintoAlueWmsFeature(feature) ||
      isMaailmanperintoPisteWmsFeature(feature)
    ) {
      return t(`details.registerLink.fromMaailmanperinto`)
    }
    if (
      isSuojellutRakennuksetAlueWmsFeature(feature) ||
      isSuojellutRakennuksetPisteWmsFeature(feature)
    ) {
      return t(`details.registerLink.fromRakennusperintö`)
    }
  }
  return ""
}

export const getLayerRegisterName = (
  t: TFunction,
  layer: MuseovirastoLayer | AhvenanmaaLayer
): string => {
  switch (layer) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
    case MuseovirastoLayer.Muu_kulttuuriperintokohde_piste:
    case MuseovirastoLayer.Muu_kulttuuriperintokohde_alue:
      return t(`data.register.name.Muinaisjäännösrekisteri`)
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return t(
        `data.register.name.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`
      )
    case MuseovirastoLayer.Maailmanperinto_alue:
    case MuseovirastoLayer.Maailmanperinto_piste:
      return t(`data.register.name.Maailmanperintökohteet`)
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return t(`data.register.name.Rakennusperintörekisteri`)
    case AhvenanmaaLayer.Fornminnen:
      return t(`data.register.name.Ahvenanmaan muinaisjäännösrekisteri`)
    case AhvenanmaaLayer.MaritimaFornminnen:
      return t(
        `data.register.name.Ahvenanmaan merellinen kulttuuriperintörekisteri`
      )
  }
}

export const getFeatureMunicipality = (
  feature: MapFeature
): string | undefined => {
  if (isMuseovirastoWmsFeature(feature)) {
    if (
      isMuinaisjaannosPisteWmsFeature(feature) ||
      isMuinaisjaannosAlueWmsFeature(feature) ||
      isSuojellutRakennuksetAlueWmsFeature(feature) ||
      isSuojellutRakennuksetPisteWmsFeature(feature)
    ) {
      return feature.properties.kunta
    }
  } else if (isAhvenanmaaArcgisFeature(feature)) {
    return feature.attributes.Kommun
  }
  return undefined
}

export const getFeatureLocation = (
  feature: MapFeature
): [number, number] | undefined => {
  if (isWmsFeature(feature)) {
    switch (feature.geometry.type) {
      case "Point":
        return feature.geometry.coordinates
      case "Polygon":
        return feature.geometry.coordinates[0]
      case "LineString":
        return feature.geometry.coordinates[0]
      case "MultiPolygon":
        return feature.geometry.coordinates[0][0]
    }
  } else if (isArcGisFeature(feature)) {
    switch (feature.geometryType) {
      case "esriGeometryPolygon":
        return feature.geometry.rings[0][0]
      /*
      case "esriGeometryPoint":
        return [feature.geometry.x, feature.geometry.y]
      case "esriGeometryPolyline":
        return feature.geometry.paths[0][0]
        */
    }
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
