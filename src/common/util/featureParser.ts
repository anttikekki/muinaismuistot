import centroid from "@turf/centroid"
import { Feature, Position } from "geojson"
import { TFunction } from "i18next"
import { ModelFeature, isModelFeature } from "../3dModels.types"
import { isAhvenanmaaFeature } from "../ahvenanmaa.types"
import {
  AhvenanmaaLayer,
  FeatureLayer,
  HelsinkiLayer,
  Language,
  MaisemanMuistiLayer,
  ModelLayer,
  MuseovirastoLayer,
  ViabundusLayer
} from "../layers.types"
import {
  MaalinnoitusKohdetyyppi,
  MaalinnoitusRajaustyyppi,
  isMaalinnoitusKarttatekstiFeature,
  isMaalinnoitusKohdeFeature,
  isMaalinnoitusRajausFeature,
  isMaalinnoitusYksikkoFeature
} from "../maalinnoitusHelsinki.types"
import { isMaisemanMuistiFeature } from "../maisemanMuisti.types"
import {
  MapFeature,
  isEsriJSONFeature,
  isGeoJSONFeature
} from "../mapFeature.types"
import {
  MaailmanperintoAlueFeature,
  MaailmanperintoPisteFeature,
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi,
  MuseovirastoFeature,
  isAlakohdePisteFeature,
  isHavaintokohdeAlueFeature,
  isHavaintokohdePisteFeature,
  isLuonnonmuodostumaAlueFeature,
  isLuonnonmuodostumaPisteFeature,
  isLöytöpaikkaAlueFeature,
  isLöytöpaikkaPisteFeature,
  isMaailmanperintoAlueFeature,
  isMaailmanperintoPisteFeature,
  isMahdollinenMuinaisjäännösAlueFeature,
  isMahdollinenMuinaisjäännösPisteFeature,
  isMuinaisjaannosAlueFeature,
  isMuinaisjaannosPisteFeature,
  isMuinaisjäännörekisteriFeature,
  isMuinaisjäännörekisteriPisteFeature,
  isMuuKohdeAlueFeature,
  isMuuKohdePisteFeature,
  isMuuKulttuuriperintokohdeAlueFeature,
  isMuuKulttuuriperintokohdePisteFeature,
  isPoistettuKiinteäMuijaisjäännösAlueFeature,
  isPoistettuKiinteäMuijaisjäännösPisteFeature,
  isRKYAlueFeature,
  isRKYPisteFeature,
  isRKYViivaFeature,
  isSuojellutRakennuksetAlueFeature,
  isSuojellutRakennuksetPisteFeature,
  isVarkAlueFeature,
  isVarkPisteFeature
} from "../museovirasto.types"
import {
  ViabundusRoadCertainty,
  ViabundusRoadType,
  isViabundusFeature,
  isViabundusPlaceFeature,
  isViabundusRoadFeature,
  isViabundusTownOutlineFeature
} from "../viabundus.types"
import { convertFeatureFromEsriJSONtoGeoJSON } from "./esriToGeoJSONConverter"

export const getFeatureName = (t: TFunction, feature: MapFeature): string => {
  if (isGeoJSONFeature(feature)) {
    if (
      isMaailmanperintoAlueFeature(feature) ||
      isMaailmanperintoPisteFeature(feature)
    ) {
      return trim(feature.properties.Nimi)
    }
    if (
      isMuinaisjäännörekisteriFeature(feature) ||
      isRKYAlueFeature(feature) ||
      isRKYPisteFeature(feature) ||
      isRKYViivaFeature(feature) ||
      isSuojellutRakennuksetAlueFeature(feature) ||
      isSuojellutRakennuksetPisteFeature(feature)
    ) {
      return trim(feature.properties.kohdenimi)
    }
    if (isVarkPisteFeature(feature) || isVarkAlueFeature(feature)) {
      return trim(feature.properties.VARK_nimi)
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
    if (isMaisemanMuistiFeature(feature)) {
      return `${feature.properties.name}, ${feature.properties.registerName}`
    }
    if (isViabundusPlaceFeature(feature)) {
      return feature.properties.name
    }
    if (isViabundusRoadFeature(feature)) {
      return t(`data.viabundus.road.${feature.properties.roadType}`)
    }
    if (isViabundusTownOutlineFeature(feature)) {
      return feature.properties.name
    }
  } else if (isAhvenanmaaFeature(feature)) {
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
        return `${trim(feature.attributes.MfornID)} ${trim(
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
  if (isGeoJSONFeature(feature)) {
    if (isMuinaisjaannosPisteFeature(feature)) {
      const tyypit = splitMuinaisjaannosTyyppi(feature)
      return [
        t(`data.featureType.Kiinteä muinaisjäännös`),
        tyypit[0]
          ? t(`data.museovirasto.type.${tyypit[0]}`, tyypit[0])
          : undefined,
        feature.maisemanMuisti.length > 0
          ? t(`data.featureType.Valtakunnallisesti merkittävä muinaisjäännös`)
          : undefined
      ]
        .filter((v) => !!v)
        .join(", ")
    }
    if (isMuinaisjaannosAlueFeature(feature)) {
      return t(`data.featureType.Kiinteä muinaisjäännös (alue)`)
    }
    if (isMuuKulttuuriperintokohdePisteFeature(feature)) {
      return t(`data.featureType.Muu kulttuuriperintökohde`)
    }
    if (isMuuKulttuuriperintokohdeAlueFeature(feature)) {
      return t(`data.featureType.Muu kulttuuriperintökohde (alue)`)
    }
    if (
      isRKYAlueFeature(feature) ||
      isRKYPisteFeature(feature) ||
      isRKYViivaFeature(feature)
    ) {
      return t(`data.featureType.Rakennettu kulttuuriympäristö`)
    }
    if (
      isMaailmanperintoAlueFeature(feature) ||
      isMaailmanperintoPisteFeature(feature)
    ) {
      return t(`data.featureType.Maailmanperintökohde`)
    }
    if (
      isSuojellutRakennuksetAlueFeature(feature) ||
      isSuojellutRakennuksetPisteFeature(feature)
    ) {
      return t(`data.featureType.Rakennusperintökohde`)
    }
    if (isVarkPisteFeature(feature)) {
      return t(`data.featureType.varkPiste`)
    }
    if (isVarkAlueFeature(feature)) {
      return t(`data.featureType.varkAlue`)
    }
    if (isLöytöpaikkaPisteFeature(feature)) {
      return t(`data.featureType.löytöpaikkaPiste`)
    }
    if (isLöytöpaikkaAlueFeature(feature)) {
      return t(`data.featureType.löytöpaikkaAlue`)
    }
    if (isMuuKohdePisteFeature(feature)) {
      return t(`data.featureType.muuKohdePiste`)
    }
    if (isMuuKohdeAlueFeature(feature)) {
      return t(`data.featureType.muuKohdeAlue`)
    }
    if (isLuonnonmuodostumaPisteFeature(feature)) {
      return t(`data.featureType.luonnonmuodostumaPiste`)
    }
    if (isLuonnonmuodostumaAlueFeature(feature)) {
      return t(`data.featureType.luonnonmuodostumaAlue`)
    }
    if (isHavaintokohdePisteFeature(feature)) {
      return t(`data.featureType.havaintokohdePiste`)
    }
    if (isHavaintokohdeAlueFeature(feature)) {
      return t(`data.featureType.havaintokohdeAlue`)
    }
    if (isMahdollinenMuinaisjäännösPisteFeature(feature)) {
      return t(`data.featureType.mahdollinenMuinaisjäännösPiste`)
    }
    if (isMahdollinenMuinaisjäännösAlueFeature(feature)) {
      return t(`data.featureType.mahdollinenMuinaisjäännösAlue`)
    }
    if (isAlakohdePisteFeature(feature)) {
      return t(`data.featureType.alakohdePiste`)
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
    if (isMaisemanMuistiFeature(feature)) {
      return `${t(`data.featureType.Kiinteä muinaisjäännös`)}, ${t(
        `data.featureType.Valtakunnallisesti merkittävä muinaisjäännös`
      )}`
    }
    if (isViabundusPlaceFeature(feature)) {
      const {
        Is_Town,
        Is_Settlement,
        Is_Bridge,
        Is_Fair,
        Is_Toll,
        Is_Ferry,
        Is_Harbour
      } = feature.properties
      if (Is_Town) {
        return `${t("data.viabundus.place.town")}, ${t(`data.featureType.viabundus`)}`
      } else if (Is_Settlement) {
        return `${t("data.viabundus.place.settlement")}, ${t(`data.featureType.viabundus`)}`
      } else if (Is_Bridge) {
        return `${t("data.viabundus.place.bridge")}, ${t(`data.featureType.viabundus`)}`
      } else if (Is_Fair) {
        return `${t("data.viabundus.place.fair")}, ${t(`data.featureType.viabundus`)}`
      } else if (Is_Ferry) {
        return `${t("data.viabundus.place.ferry")}, ${t(`data.featureType.viabundus`)}`
      } else if (Is_Toll) {
        return `${t("data.viabundus.place.toll")}, ${t(`data.featureType.viabundus`)}`
      } else if (Is_Harbour) {
        return `${t("data.viabundus.place.harbour")}, ${t(`data.featureType.viabundus`)}`
      }
    }
    if (isViabundusRoadFeature(feature)) {
      return t(`data.featureType.viabundus-tieverkko`)
    }
    if (isViabundusTownOutlineFeature(feature)) {
      return t(`data.featureType.viabundus-kaupungin-rajat`)
    }
  } else if (isAhvenanmaaFeature(feature)) {
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
  has3dModels = false
): string => `images/${imageName}${has3dModels ? "_3d" : ""}.png`

/**
 * Kuvien lähteet:
 *
 * Museovirasto: https://geoserver.museovirasto.fi
 * - Pisteet: request=GetLegendGraphic&LEGEND_OPTIONS=dpi:150
 * - Alueet: request=GetLegendGraphic&LEGEND_OPTIONS=dpi:70
 */
export const getFeatureTypeIconURL = (feature: MapFeature): string => {
  const has3dModels = "models" in feature ? feature.models.length > 0 : false
  if (isGeoJSONFeature(feature)) {
    if (isMuinaisjaannosPisteFeature(feature)) {
      if (feature.maisemanMuisti.length > 0) {
        return getTypeIconURL("maiseman-muisti", has3dModels)
      }
      return getTypeIconURL("muinaisjaannos_kohde", has3dModels)
    }
    if (isMuinaisjaannosAlueFeature(feature)) {
      return getTypeIconURL("muinaisjaannos_alue", has3dModels)
    }
    if (isMuuKulttuuriperintokohdePisteFeature(feature)) {
      return getTypeIconURL("muu_kulttuuriperintokohde_kohde", has3dModels)
    }
    if (isMuuKulttuuriperintokohdeAlueFeature(feature)) {
      return getTypeIconURL("muu-kulttuuriperintokohde-alue", has3dModels)
    }
    if (isMuuKulttuuriperintokohdePisteFeature(feature)) {
      return getTypeIconURL("muu_kulttuuriperintokohde_kohde", has3dModels)
    }
    if (isMuuKulttuuriperintokohdeAlueFeature(feature)) {
      return getTypeIconURL("muu-kulttuuriperintokohde-alue", has3dModels)
    }
    if (isRKYAlueFeature(feature)) {
      return getTypeIconURL("rky_alue", has3dModels)
    }
    if (isRKYPisteFeature(feature)) {
      return getTypeIconURL("rky_piste", has3dModels)
    }
    if (isRKYViivaFeature(feature)) {
      return getTypeIconURL("rky_viiva", has3dModels)
    }
    if (isMaailmanperintoAlueFeature(feature)) {
      return getTypeIconURL("maailmanperinto_alue", has3dModels)
    }
    if (isMaailmanperintoPisteFeature(feature)) {
      return getTypeIconURL("maailmanperinto_piste", has3dModels)
    }
    if (isSuojellutRakennuksetAlueFeature(feature)) {
      return getTypeIconURL("rakennusperintorekisteri_alue", has3dModels)
    }
    if (isSuojellutRakennuksetPisteFeature(feature)) {
      return getTypeIconURL("rakennusperintorekisteri_rakennus", has3dModels)
    }
    if (isVarkPisteFeature(feature)) {
      return getTypeIconURL("vark_piste", has3dModels)
    }
    if (isVarkAlueFeature(feature)) {
      return getTypeIconURL("vark_alue", has3dModels)
    }
    if (isLöytöpaikkaPisteFeature(feature)) {
      return getTypeIconURL("loytopaikka_piste", has3dModels)
    }
    if (isLöytöpaikkaAlueFeature(feature)) {
      return getTypeIconURL("loytopaikka_alue", has3dModels)
    }
    if (isMuuKohdePisteFeature(feature)) {
      return getTypeIconURL("muu_kohde_piste", has3dModels)
    }
    if (isMuuKohdeAlueFeature(feature)) {
      return getTypeIconURL("muu_kohde_alue", has3dModels)
    }
    if (isLuonnonmuodostumaPisteFeature(feature)) {
      return getTypeIconURL("luonnonmuodostuma_piste", has3dModels)
    }
    if (isLuonnonmuodostumaAlueFeature(feature)) {
      return getTypeIconURL("luonnonmuodostuma_alue", has3dModels)
    }
    if (isHavaintokohdePisteFeature(feature)) {
      return getTypeIconURL("havaintokohde_piste", has3dModels)
    }
    if (isHavaintokohdeAlueFeature(feature)) {
      return getTypeIconURL("havaintokohde_alue", has3dModels)
    }
    if (isMahdollinenMuinaisjäännösPisteFeature(feature)) {
      return getTypeIconURL("mahdollinen_muinaisjaannos_piste", has3dModels)
    }
    if (isMahdollinenMuinaisjäännösAlueFeature(feature)) {
      return getTypeIconURL("mahdollinen_muinaisjaannos_alue", has3dModels)
    }
    if (isPoistettuKiinteäMuijaisjäännösPisteFeature(feature)) {
      return getTypeIconURL(
        "poistettu_kiintea_muinaisjaannos_piste",
        has3dModels
      )
    }
    if (isPoistettuKiinteäMuijaisjäännösAlueFeature(feature)) {
      return getTypeIconURL(
        "poistettu_kiintea_muinaisjaannos_alue",
        has3dModels
      )
    }
    if (isAlakohdePisteFeature(feature)) {
      return getTypeIconURL("alakohde_piste", has3dModels)
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
    if (isMaisemanMuistiFeature(feature)) {
      return getTypeIconURL("maiseman-muisti", has3dModels)
    }
    if (isViabundusPlaceFeature(feature)) {
      const {
        Is_Town,
        Is_Settlement,
        Is_Bridge,
        Is_Ferry,
        Is_Fair,
        Is_Toll,
        Is_Harbour
      } = feature.properties
      if (Is_Town) {
        return getTypeIconURL("viabundus-kaupunki")
      } else if (Is_Settlement) {
        return getTypeIconURL("viabundus-asuttu-paikka")
      } else if (Is_Bridge) {
        return getTypeIconURL("viabundus-silta")
      } else if (Is_Ferry) {
        return getTypeIconURL("viabundus-lossi")
      } else if (Is_Fair) {
        return getTypeIconURL("viabundus-markkinat")
      } else if (Is_Toll) {
        return getTypeIconURL("viabundus-tulli")
      } else if (Is_Harbour) {
        return getTypeIconURL("viabundus-satama")
      }
      return getTypeIconURL("viabundus-maantie")
    }
    if (isViabundusRoadFeature(feature)) {
      const { roadType, certainty } = feature.properties
      switch (roadType) {
        case ViabundusRoadType.winter:
          return getTypeIconURL("viabundus-talvitie")
        case ViabundusRoadType.coast: {
          if (certainty === ViabundusRoadCertainty.Uncertain) {
            return getTypeIconURL("viabundus-vesivayla-epavarma")
          }
          return getTypeIconURL("viabundus-vesivayla")
        }
        case ViabundusRoadType.land:
        default: {
          if (certainty === ViabundusRoadCertainty.Uncertain) {
            return getTypeIconURL("viabundus-maantie-epavarma")
          }
          return getTypeIconURL("viabundus-maantie")
        }
      }
    }
    if (isViabundusTownOutlineFeature(feature)) {
      return getTypeIconURL("viabundus-kaupungin-rajat")
    }
  } else if (isAhvenanmaaFeature(feature)) {
    switch (feature.layerName) {
      case AhvenanmaaLayer.Fornminnen:
        return getTypeIconURL("ahvenanmaa_muinaisjaannos", has3dModels)
      case AhvenanmaaLayer.MaritimaFornminnen:
        return getTypeIconURL("ahvenanmaa_hylky", has3dModels)
    }
  }
  throw new Error(`Tuntematon feature: ${JSON.stringify(feature)}`)
}

export const getLayerIconURLs = (layer: FeatureLayer): string[] => {
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
    case MuseovirastoLayer.VARK_pisteet:
      return ["images/vark_piste.png"]
    case MuseovirastoLayer.VARK_alueet:
      return ["images/vark_alue.png"]
    case MuseovirastoLayer.Löytöpaikka_piste:
      return ["images/loytopaikka_piste.png"]
    case MuseovirastoLayer.Löytöpaikka_alue:
      return ["images/loytopaikka_alue.png"]
    case MuseovirastoLayer.Havaintokohde_piste:
      return [getTypeIconURL("havaintokohde_piste")]
    case MuseovirastoLayer.Havaintokohde_alue:
      return [getTypeIconURL("havaintokohde_alue")]
    case MuseovirastoLayer.Luonnonmuodostuma_piste:
      return [getTypeIconURL("luonnonmuodostuma_piste")]
    case MuseovirastoLayer.Luonnonmuodostuma_alue:
      return [getTypeIconURL("luonnonmuodostuma_alue")]
    case MuseovirastoLayer.Mahdollinen_muinaisjäännös_piste:
      return [getTypeIconURL("mahdollinen_muinaisjaannos_piste")]
    case MuseovirastoLayer.Mahdollinen_muinaisjäännös_alue:
      return [getTypeIconURL("mahdollinen_muinaisjaannos_alue")]
    case MuseovirastoLayer.Muu_kohde_piste:
      return [getTypeIconURL("muu_kohde_piste")]
    case MuseovirastoLayer.Muu_kohde_alue:
      return [getTypeIconURL("muu_kohde_alue")]
    case MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösPiste:
      return [getTypeIconURL("poistettu_kiintea_muinaisjaannos_piste")]
    case MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösAlue:
      return [getTypeIconURL("poistettu_kiintea_muinaisjaannos_alue")]
    case MuseovirastoLayer.Alakohde_piste:
      return [getTypeIconURL("alakohde_piste")]
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
    case ViabundusLayer.Viabundus:
      return ["images/viabundus-kaupunki.png"]
  }
}

export const getFeatureID = (feature: MapFeature): string => {
  if (isGeoJSONFeature(feature)) {
    if (isMuinaisjäännörekisteriFeature(feature)) {
      return String(feature.properties.mjtunnus)
    }
    if (
      isRKYAlueFeature(feature) ||
      isRKYPisteFeature(feature) ||
      isRKYViivaFeature(feature)
    ) {
      return String(feature.properties.ID)
    }
    if (
      isMaailmanperintoAlueFeature(feature) ||
      isMaailmanperintoPisteFeature(feature)
    ) {
      return String(feature.properties.OBJECTID) // Not a real stabile register id but data set is really small
    }
    if (
      isSuojellutRakennuksetAlueFeature(feature) ||
      isSuojellutRakennuksetPisteFeature(feature)
    ) {
      return String(feature.properties.KOHDEID)
    }
    if (isVarkPisteFeature(feature) || isVarkAlueFeature(feature)) {
      return String(feature.properties.VARK_ID)
    }
    if (
      isMaalinnoitusYksikkoFeature(feature) ||
      isMaalinnoitusKohdeFeature(feature) ||
      isMaalinnoitusRajausFeature(feature)
    ) {
      return String(feature.properties.id)
    }
    if (isMaisemanMuistiFeature(feature)) {
      return String(feature.properties.id)
    }
    if (isViabundusPlaceFeature(feature) || isViabundusRoadFeature(feature)) {
      return `${feature.properties.type}-${feature.properties.id}`
    }
    if (isViabundusTownOutlineFeature(feature)) {
      return `${feature.properties.type}-${feature.properties.nodesid}`
    }
  } else if (isAhvenanmaaFeature(feature)) {
    switch (feature.layerName) {
      case AhvenanmaaLayer.Fornminnen:
        return feature.attributes["Fornlämnings ID"]
      case AhvenanmaaLayer.MaritimaFornminnen:
        return feature.attributes.MfornID
    }
  }
  throw new Error(`Tuntematon feature: ${JSON.stringify(feature)}`)
}

const getMaailmanperintoUrl = (
  feature: MaailmanperintoPisteFeature | MaailmanperintoAlueFeature,
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

export const getMuinaisjaannosRegisterUrl = (
  mjtunnus: string | number,
  lang: Language
): string => {
  let url = `https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=${mjtunnus}`
  if (lang === Language.SV) {
    url = url.replace("r_kohde_det.aspx", "rsv_kohde_det.aspx")
  }
  return url
}

export const getFeatureRegisterURL = (
  feature: MapFeature,
  lang: Language
): string | undefined => {
  if (isGeoJSONFeature(feature)) {
    if (isMuinaisjäännörekisteriFeature(feature)) {
      return getMuinaisjaannosRegisterUrl(feature.properties.mjtunnus, lang)
    }
    if (
      isRKYAlueFeature(feature) ||
      isRKYPisteFeature(feature) ||
      isRKYViivaFeature(feature)
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
      isMaailmanperintoAlueFeature(feature) ||
      isMaailmanperintoPisteFeature(feature)
    ) {
      return getMaailmanperintoUrl(feature, lang)
    }
    if (
      isSuojellutRakennuksetAlueFeature(feature) ||
      isSuojellutRakennuksetPisteFeature(feature)
    ) {
      return `https://www.kyppi.fi/palveluikkuna/rapea/read/asp/r_kohde_det.aspx?KOHDE_ID=${feature.properties.KOHDEID}`
    }
    if (isVarkPisteFeature(feature) || isVarkAlueFeature(feature)) {
      return feature.properties.Linkki
    }
  }
  return undefined
}

export const getFeatureRegisterName = (
  t: TFunction,
  feature: MapFeature
): string => {
  if (isGeoJSONFeature(feature)) {
    if (isMuinaisjäännörekisteriFeature(feature)) {
      return t(`details.registerLink.fromMuinaisjaannos`)
    }
    if (
      isRKYAlueFeature(feature) ||
      isRKYPisteFeature(feature) ||
      isRKYViivaFeature(feature)
    ) {
      return t(`details.registerLink.fromRKY`)
    }
    if (
      isMaailmanperintoAlueFeature(feature) ||
      isMaailmanperintoPisteFeature(feature)
    ) {
      return t(`details.registerLink.fromMaailmanperinto`)
    }
    if (
      isSuojellutRakennuksetAlueFeature(feature) ||
      isSuojellutRakennuksetPisteFeature(feature)
    ) {
      return t(`details.registerLink.fromRakennusperintö`)
    }
    if (isVarkPisteFeature(feature) || isVarkAlueFeature(feature)) {
      return t(`details.registerLink.fromVark`)
    }
  }
  return ""
}

export const getFeatureLayer = (feature: MapFeature): FeatureLayer => {
  if (isGeoJSONFeature(feature)) {
    // Museovirasto
    if (isMuinaisjaannosPisteFeature(feature)) {
      return MuseovirastoLayer.Muinaisjaannokset_piste
    }
    if (isMuinaisjaannosAlueFeature(feature)) {
      return MuseovirastoLayer.Muinaisjaannokset_alue
    }
    if (isMuuKulttuuriperintokohdePisteFeature(feature)) {
      return MuseovirastoLayer.Muu_kulttuuriperintokohde_piste
    }
    if (isMuuKulttuuriperintokohdeAlueFeature(feature)) {
      return MuseovirastoLayer.Muu_kulttuuriperintokohde_alue
    }
    if (isSuojellutRakennuksetPisteFeature(feature)) {
      return MuseovirastoLayer.Suojellut_rakennukset_piste
    }
    if (isSuojellutRakennuksetAlueFeature(feature)) {
      return MuseovirastoLayer.Suojellut_rakennukset_alue
    }
    if (isRKYAlueFeature(feature)) {
      return MuseovirastoLayer.RKY_alue
    }
    if (isRKYPisteFeature(feature)) {
      return MuseovirastoLayer.RKY_piste
    }
    if (isRKYViivaFeature(feature)) {
      return MuseovirastoLayer.RKY_viiva
    }
    if (isMaailmanperintoAlueFeature(feature)) {
      return MuseovirastoLayer.Maailmanperinto_alue
    }
    if (isMaailmanperintoPisteFeature(feature)) {
      return MuseovirastoLayer.Maailmanperinto_piste
    }
    if (isVarkPisteFeature(feature)) {
      return MuseovirastoLayer.VARK_pisteet
    }
    if (isVarkAlueFeature(feature)) {
      return MuseovirastoLayer.VARK_alueet
    }
    if (isLöytöpaikkaPisteFeature(feature)) {
      return MuseovirastoLayer.Löytöpaikka_piste
    }
    if (isLöytöpaikkaAlueFeature(feature)) {
      return MuseovirastoLayer.Löytöpaikka_alue
    }
    if (isMuuKohdePisteFeature(feature)) {
      return MuseovirastoLayer.Muu_kohde_piste
    }
    if (isMuuKohdeAlueFeature(feature)) {
      return MuseovirastoLayer.Muu_kohde_alue
    }
    if (isLuonnonmuodostumaPisteFeature(feature)) {
      return MuseovirastoLayer.Luonnonmuodostuma_piste
    }
    if (isLuonnonmuodostumaAlueFeature(feature)) {
      return MuseovirastoLayer.Luonnonmuodostuma_alue
    }
    if (isHavaintokohdePisteFeature(feature)) {
      return MuseovirastoLayer.Havaintokohde_piste
    }
    if (isHavaintokohdeAlueFeature(feature)) {
      return MuseovirastoLayer.Havaintokohde_alue
    }
    if (isMahdollinenMuinaisjäännösPisteFeature(feature)) {
      return MuseovirastoLayer.Mahdollinen_muinaisjäännös_piste
    }
    if (isMahdollinenMuinaisjäännösAlueFeature(feature)) {
      return MuseovirastoLayer.Mahdollinen_muinaisjäännös_alue
    }
    if (isPoistettuKiinteäMuijaisjäännösPisteFeature(feature)) {
      return MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösPiste
    }
    if (isPoistettuKiinteäMuijaisjäännösAlueFeature(feature)) {
      return MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösAlue
    }
    if (isAlakohdePisteFeature(feature)) {
      return MuseovirastoLayer.Alakohde_piste
    }

    // Helsinki: Maalinnoitus
    if (isMaalinnoitusYksikkoFeature(feature)) {
      return HelsinkiLayer.Maalinnoitus_yksikot
    }
    if (isMaalinnoitusKohdeFeature(feature)) {
      return HelsinkiLayer.Maalinnoitus_kohteet
    }
    if (isMaalinnoitusRajausFeature(feature)) {
      return HelsinkiLayer.Maalinnoitus_rajaukset
    }
    if (isMaalinnoitusKarttatekstiFeature(feature)) {
      return HelsinkiLayer.Maalinnoitus_karttatekstit
    }

    // Maiseman muisti
    if (isMaisemanMuistiFeature(feature)) {
      return MaisemanMuistiLayer.MaisemanMuisti
    }

    // 3D-mallit
    if (isModelFeature(feature)) {
      return ModelLayer.ModelLayer
    }

    // Viabundus
    if (isViabundusFeature(feature)) {
      return ViabundusLayer.Viabundus
    }
  }
  if (isEsriJSONFeature(feature)) {
    if (isAhvenanmaaFeature(feature)) {
      return feature.layerName
    }
  }
  throw new Error(`Tuntematon feature ${JSON.stringify(feature)}`)
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
    case MuseovirastoLayer.Löytöpaikka_piste:
    case MuseovirastoLayer.Löytöpaikka_alue:
    case MuseovirastoLayer.Havaintokohde_piste:
    case MuseovirastoLayer.Havaintokohde_alue:
    case MuseovirastoLayer.Luonnonmuodostuma_piste:
    case MuseovirastoLayer.Luonnonmuodostuma_alue:
    case MuseovirastoLayer.Mahdollinen_muinaisjäännös_piste:
    case MuseovirastoLayer.Mahdollinen_muinaisjäännös_alue:
    case MuseovirastoLayer.Muu_kohde_piste:
    case MuseovirastoLayer.Muu_kohde_alue:
    case MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösPiste:
    case MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösAlue:
    case MuseovirastoLayer.Alakohde_piste:
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
    case MuseovirastoLayer.VARK_pisteet:
    case MuseovirastoLayer.VARK_alueet:
      return t(`data.register.name.vark`)
    case MuseovirastoLayer.Löytöpaikka_piste:
    case MuseovirastoLayer.Löytöpaikka_alue:
      return t(`data.register.name.Löytöpaikat`)
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
  if (isGeoJSONFeature(feature)) {
    if (isMuinaisjäännörekisteriFeature(feature)) {
      return feature.properties.kunta
    }
    if (isMaisemanMuistiFeature(feature)) {
      return feature.properties.municipality
    }
  } else if (isAhvenanmaaFeature(feature)) {
    switch (feature.layerName) {
      case AhvenanmaaLayer.Fornminnen:
        return feature.attributes.Kommun
    }
  }
  return undefined
}

export const getFeatureLocation = (
  feature: MapFeature
): Position | undefined => {
  if (isGeoJSONFeature(feature)) {
    return getGeoJSONFeatureLocation(feature)
  } else if (isEsriJSONFeature(feature)) {
    const geojsonFeature = convertFeatureFromEsriJSONtoGeoJSON(feature)
    return getGeoJSONFeatureLocation(geojsonFeature)
  }
}

export const getGeoJSONFeatureLocation = (feature: Feature): Position => {
  switch (feature.geometry.type) {
    case "Point":
      return feature.geometry.coordinates
    case "MultiPoint":
    case "LineString":
    case "MultiLineString":
    case "Polygon":
    case "MultiPolygon":
    case "GeometryCollection":
      return centroid(feature).geometry.coordinates
  }
}

export const isMuinaisjaannosTyyppi = (
  dating: string
): dating is MuinaisjaannosTyyppi =>
  Object.values(MuinaisjaannosTyyppi).includes(dating as MuinaisjaannosTyyppi)

export const isMuinaisjaannosAjoitus = (
  dating: string
): dating is MuinaisjaannosAjoitus =>
  Object.values(MuinaisjaannosAjoitus).includes(dating as MuinaisjaannosAjoitus)

export const splitMuinaisjaannosTyyppi = (
  feature: MuseovirastoFeature
): string[] => {
  const tyypit = (() => {
    if (isMuinaisjäännörekisteriPisteFeature(feature)) {
      return [feature.properties.tyyppi]
    }
    if (isVarkPisteFeature(feature) || isVarkAlueFeature(feature)) {
      return [feature.properties.Tyyppi]
    }
    return []
  })()

  return tyypit.flatMap((tyyppi) =>
    trim(tyyppi)
      .replace("taide, muistomerkit", "taide-muistomerkit")
      .split(", ")
      .map((t) => (t === "taide-muistomerkit" ? "taide, muistomerkit" : t))
  )
}

export const splitMuinaisjaannosAlatyyppi = (
  feature: MuseovirastoFeature
): string[] => {
  const alatyypit = (() => {
    if (isMuinaisjäännörekisteriPisteFeature(feature)) {
      return [feature.properties.alatyyppi]
    }
    if (isVarkPisteFeature(feature) || isVarkAlueFeature(feature)) {
      return [feature.properties.Alatyyppi]
    }
    return []
  })()

  const alatyyppiSplitted = alatyypit.flatMap((alatyyppi) =>
    trim(alatyyppi)
      .replace("rajamerkit, puu", "rajamerkit-puu")
      .split(", ")
      .map((t) => (t === "rajamerkit-puu" ? "rajamerkit, puu" : t))
  )
  // Poistetaan "ei määritelty", jos on joku muukin alatyyppi
  return alatyyppiSplitted.length > 1
    ? alatyyppiSplitted.filter((tyyppi) => tyyppi !== "ei määritelty")
    : alatyyppiSplitted
}

export const splitMuinaisjaannosAjoitus = (
  feature: MuseovirastoFeature
): string[] => {
  const ajoitus = (() => {
    if (isMuinaisjäännörekisteriPisteFeature(feature)) {
      return [feature.properties.ajoitus]
    }
    if (isVarkPisteFeature(feature) || isVarkAlueFeature(feature)) {
      return [feature.properties.Ajoitus, feature.properties.Ajoitus2]
    }
    return []
  })()

  const ajoitusSplitted = ajoitus.flatMap((ajoitus) =>
    trim(ajoitus).split(", ")
  )

  // Poistetaan "ei määritelty", jos on joku muukin ajoitus
  return ajoitusSplitted.length > 1
    ? ajoitusSplitted.filter(
        (tyyppi) => tyyppi !== MuinaisjaannosAjoitus.eiMääritelty
      )
    : ajoitusSplitted
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
  features: ModelFeature[]
): Date => {
  let dates = features.map((feature) =>
    new Date(feature.properties.createdDate).getTime()
  )
  dates = Array.from(new Set(dates)) // Make unique
  return new Date(Math.max.apply(null, dates))
}
