import { FeatureSupplementaryData } from "./featureSupplementaryData.types"
import { MapFeature } from "./mapFeature.types"
import { HelsinkiLayer } from "./types"
import { WmsFeature, WmsFeatureInfoResult } from "./wms.types"

export enum MaalinnoitusYksikkoLaji {
  Asema = "asema",
  Tykkipatteri = "tykkipatteri",
  Tykkitie = "tykkitie",
  Muu = "muu"
}

export enum MaalinnoitusYksikko {
  Tulipesäke = "tulipesäke",
  Suojahuone = "suojahuone",
  Kuoppa = "kuoppa",
  Tykkiasema = "tykkiasema",
  Rakenne = "rakenne",
  Juoksuhauta = "hauta",
  Luola = "luola",
  Jalusta = "jalusta",
  Suojavalli = "suojavalli"
}

export interface MaalinnoitusYksikkoFeature
  extends WmsFeature,
    FeatureSupplementaryData {
  id: `Maalinnoitus_yksikot.${number}`
  properties: {
    id: number // 444
    /**
     * Muoto tukikohtanumero:lajinumero/yksikkönumero,yksilöivä tunniste
     */
    tunnistenumero: string // "XXI:6/11"
    /**
     * Tukikohtanumero. Kertoo pääosin roomalaisin numeroin mistä tukikohdasta on kyse.
     */
    tukikohtanumero: string // "XXI"
    /**
     * Muoto tukikohtanumero:juokseva numero; erottelee tukikohtien alaiset tutkimusalueet
     */
    lajinumero: string | null // "XXI:6"
    /**
     * Kertoo mikä on kohteen tyyppi, esim.asema, tykkipatteri
     */
    laji: MaalinnoitusYksikkoLaji | null // "asema"
    /**
     * Yksikön numero, ks.tunnistenumero
     */
    yksikkonumero: string | null // "11"
    /**
     * Yksikön lajityyppi, esim.tulipesäke, suojahuone, kuoppa
     */
    yksikko: MaalinnoitusYksikko | null // "kuoppa"
    /**
     * Lisätiedot yksiköstä, esim.yksihuoneinen, avoin/katettu
     */
    yksikkotyyppi: string | null
    /**
     * Kertoo mille vuodelle kohde sijoittuu
     */
    ajoitus: number | null // 1915
    /**
     * Mahdollinen lisähuomio ajoitus-tietoon.
     */
    ajoitushuom: string | null // "alkuvuosi"
    rakennustapa: string | null // "kallioon louhittu, koko n. 6m x 6m"
    rakennushistoria: string | null
    datanomistaja: string // "Helsingin kaupunki, KYMP"
    paivitetty_tietopalveluun: string // "2020-12-15"
  }
}

export enum MaalinnoitusKohdetyyppi {
  Asema = "asema (hauta,suojahuone, tulipesäke)",
  Luola = "luola",
  Tykkitie = "tykkitie",
  Tykkipatteri = "tykkipatteri"
}

export interface MaalinnoitusKohdeFeature
  extends WmsFeature,
    FeatureSupplementaryData {
  id: `Maalinnoitus_kohteet.${number}`
  properties: {
    id: number // 25625
    /**
     * Kohdetyyppi kertoo minkälaisesta maalinnoitus kohteesta on kyse.
     */
    kohdetyyppi: MaalinnoitusKohdetyyppi
    /**
     * Tukikohtanumero. Kertoo pääosin roomalaisin numeroin mistä tukikohdasta on kyse.
     */
    tukikohtanumero: string // "XXI"
    /**
     * Olotila kertoo kohteen tilanteesta.
     */
    olotila: string | null // "olemassaoleva, täytetty/peitetty"
    /**
     * Mittaustieto kertoo onko kohdetta mitattu.
     */
    mittaustieto: string | null // "mitattu"
    datanomistaja: string // "Helsingin kaupunki, KYMP"
    paivitetty_tietopalveluun: string // "2021-02-01"
  }
}

export enum MaalinnoitusRajaustyyppi {
  Tukikohta = "tukikohta",
  Puolustusasema = "laji"
}

export interface MaalinnoitusRajausFeature
  extends WmsFeature,
    FeatureSupplementaryData {
  id: `"Maalinnoitus_rajaukset.${number}`
  properties: {
    id: number // 26516
    /**
     * Muoto tukikohtanumero:juokseva numero; erottelee tukikohtien alaiset tutkimusalueet
     */
    lajinumero: string | null
    /**
     * Tukikohtanumero. Kertoo pääosin roomalaisin numeroin mistä tukikohdasta on kyse.
     */
    tukikohtanumero: string | null // "XXI"
    /**
     * Kertoo koskeeko rajaus tukikohtaa vai lajia.
     */
    rajaustyyppi: MaalinnoitusRajaustyyppi | null // "tukikohta"
    datanomistaja: string // "Helsingin kaupunki, KYMP"
    paivitetty_tietopalveluun: string // "2020-12-15"
  }
}

export interface MaalinnoitusKarttatekstiFeature
  extends WmsFeature,
    FeatureSupplementaryData {
  id: `Maalinnoitus_karttatekstit.${number}`
  properties: {
    id: number // 764
    /**
     * Tukikohtanumero. Kertoo mistä tukikohdasta on kyse.
     */
    tukikohtanumero: string | null
    /**
     * Tasolla näkyvät tekstit.
     */
    teksti: string | null // "tulipesäke"
    /**
     * Kertoo miten teksti on aseteltu tasolle.
     */
    tekstisuunta: number // 0
    /**
     * Tekstikoko kertoo minkä kokoinen teksti on.
     */
    tekstikoko: number // 3
    datanomistaja: string // "Helsingin kaupunki, KYMP"
    paivitetty_tietopalveluun: string // "2020-12-15"
  }
}

/**
 * Feature propeties documentation:
 * @see https://www.hel.fi/hel2/tietokeskus/data/dokumentit/Helsingin_ensimmaisen_maailmansodan_aikaiset_maalinnoitukset_ominaisuustietojen_kuvaus.pdf
 */
export type MaalinnoitusWmsFeature =
  | MaalinnoitusYksikkoFeature
  | MaalinnoitusKohdeFeature
  | MaalinnoitusRajausFeature
  | MaalinnoitusKarttatekstiFeature

export type MaalinnoitusWmsFeatureInfoResult =
  WmsFeatureInfoResult<MaalinnoitusWmsFeature>

export const isMaalinnoitusYksikkoFeature = (
  feature: WmsFeature
): feature is MaalinnoitusYksikkoFeature =>
  feature.id.startsWith("Maalinnoitus_yksikot.")

export const isMaalinnoitusKohdeFeature = (
  feature: WmsFeature
): feature is MaalinnoitusKohdeFeature =>
  feature.id.startsWith("Maalinnoitus_kohteet.")

export const isMaalinnoitusRajausFeature = (
  feature: WmsFeature
): feature is MaalinnoitusRajausFeature =>
  feature.id.startsWith("Maalinnoitus_rajaukset.")

export const isMaalinnoitusKarttatekstiFeature = (
  feature: WmsFeature
): feature is MaalinnoitusKarttatekstiFeature =>
  feature.id.startsWith("Maalinnoitus_karttatekstit.")

export const isMaalinnoitusWmsFeature = (
  feature: MapFeature
): feature is MaalinnoitusWmsFeature => {
  return (
    "id" in feature &&
    (isMaalinnoitusYksikkoFeature(feature) ||
      isMaalinnoitusKohdeFeature(feature) ||
      isMaalinnoitusRajausFeature(feature) ||
      isMaalinnoitusKarttatekstiFeature(feature))
  )
}

export const getMaalinnoitusWmsFeatureLayerName = (
  feature: MaalinnoitusWmsFeature
): HelsinkiLayer => {
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
  throw new Error(`Tuntematon WMS Feature: ${JSON.stringify(feature)}`)
}
