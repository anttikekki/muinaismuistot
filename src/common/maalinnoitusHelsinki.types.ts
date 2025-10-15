import { Feature, Geometry } from "geojson"
import { FeatureSupplementaryData } from "./featureSupplementaryData.types"

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

interface MaalinnoitusYksikkoFeatureProperties {
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

export interface MaalinnoitusYksikkoFeature
  extends Feature<Geometry, MaalinnoitusYksikkoFeatureProperties>,
    FeatureSupplementaryData {
  id: `Maalinnoitus_yksikot.${number}`
}

export enum MaalinnoitusKohdetyyppi {
  Asema = "asema (hauta,suojahuone, tulipesäke)",
  Luola = "luola",
  Tykkitie = "tykkitie",
  Tykkipatteri = "tykkipatteri"
}

interface MaalinnoitusKohdeFeatureProperties {
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

export interface MaalinnoitusKohdeFeature
  extends Feature<Geometry, MaalinnoitusKohdeFeatureProperties>,
    FeatureSupplementaryData {
  id: `Maalinnoitus_kohteet.${number}`
}

export enum MaalinnoitusRajaustyyppi {
  Tukikohta = "tukikohta",
  Puolustusasema = "laji"
}

interface MaalinnoitusRajausFeatureProperties {
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

export interface MaalinnoitusRajausFeature
  extends Feature<Geometry, MaalinnoitusRajausFeatureProperties>,
    FeatureSupplementaryData {
  id: `"Maalinnoitus_rajaukset.${number}`
}

interface MaalinnoitusKarttatekstiFeatureProperties {
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

export interface MaalinnoitusKarttatekstiFeature
  extends Feature<Geometry, MaalinnoitusKarttatekstiFeatureProperties>,
    FeatureSupplementaryData {
  id: `Maalinnoitus_karttatekstit.${number}`
}

/**
 * Feature propeties documentation:
 * @see https://www.hel.fi/hel2/tietokeskus/data/dokumentit/Helsingin_ensimmaisen_maailmansodan_aikaiset_maalinnoitukset_ominaisuustietojen_kuvaus.pdf
 */
export type MaalinnoitusFeature =
  | MaalinnoitusYksikkoFeature
  | MaalinnoitusKohdeFeature
  | MaalinnoitusRajausFeature
  | MaalinnoitusKarttatekstiFeature

export interface MaalinnoitusFeatureInfoResult {
  type: "FeatureCollection"
  features: MaalinnoitusFeature[]
}

export const isMaalinnoitusYksikkoFeature = (
  feature: Feature
): feature is MaalinnoitusYksikkoFeature =>
  feature.id?.toString().startsWith("Maalinnoitus_yksikot.") ?? false

export const isMaalinnoitusKohdeFeature = (
  feature: Feature
): feature is MaalinnoitusKohdeFeature =>
  feature.id?.toString().startsWith("Maalinnoitus_kohteet.") ?? false

export const isMaalinnoitusRajausFeature = (
  feature: Feature
): feature is MaalinnoitusRajausFeature =>
  feature.id?.toString().startsWith("Maalinnoitus_rajaukset.") ?? false

export const isMaalinnoitusKarttatekstiFeature = (
  feature: Feature
): feature is MaalinnoitusKarttatekstiFeature =>
  feature.id?.toString().startsWith("Maalinnoitus_karttatekstit.") ?? false
