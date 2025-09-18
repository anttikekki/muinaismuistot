import { Feature, Geometry, Point } from "geojson"
import { FeatureSupplementaryData } from "./featureSupplementaryData.types"
import { MuseovirastoLayer } from "./layers.types"
import { MapFeature } from "./mapFeature.types"

export enum MuinaisjaannosTyyppi {
  eiMääritelty = "ei määritelty",
  alustenHylyt = "alusten hylyt",
  asuinpaikat = "asuinpaikat",
  hautapaikat = "hautapaikat",
  kirkkorakenteet = "kirkkorakenteet",
  kivirakenteet = "kivirakenteet",
  kulkuväylät = "kulkuväylät",
  kulttiJaTarinapaikat = "kultti- ja tarinapaikat",
  luonnonmuodostumat = "luonnonmuodostumat",
  löytöpaikat = "löytöpaikat",
  maarakenteet = "maarakenteet",
  muinaisjäännösryhmät = "muinaisjäännösryhmät",
  puolustusvarustukset = "puolustusvarustukset",
  puurakenteet = "puurakenteet",
  raakaAineenHankintapaikat = "raaka-aineen hankintapaikat",
  tapahtumapaikat = "tapahtumapaikat",
  teollisuuskohteet = "teollisuuskohteet",
  taideMuistomerkit = "taide, muistomerkit",
  työJaValmistuspaikat = "työ- ja valmistuspaikat"
}

export enum MuinaisjaannosAjoitus {
  moniperiodinen = "moniperiodinen",
  esihistoriallinen = "esihistoriallinen",
  kivikautinen = "kivikautinen",
  varhaismetallikautinen = "varhaismetallikautinen",
  pronssikautinen = "pronssikautinen",
  rautakautinen = "rautakautinen",
  rautakautinenJaTaiKeskiaikainen = "rautakautinen ja/tai keskiaikainen",
  keskiaikainen = "keskiaikainen",
  historiallinen = "historiallinen",
  moderni = "moderni",
  ajoittamaton = "ajoittamaton",
  eiMääritelty = "ei määritelty"
}

export type MuinaisjaannosPisteFeatureProperties = {
  OBJECTID: number // 38962;
  mjtunnus: number // 1279;
  inspireID: string // "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/1279_P38962";
  kohdenimi: string // "Melkki länsiranta";
  kunta: string // "Helsinki"
  Laji: "kiinteä muinaisjäännös" // "kiinteä muinaisjäännös";
  tyyppi: string // "alusten hylyt, kivirakenteet";
  alatyyppi: string // "hylyt (puu), hautakummut";
  ajoitus: string // "ei määritelty, keskiaikainen";
  vedenalainen: "k" | "e"
  zala: null
  zyla: null
  KOHDE_APVM: string // "2003-04-03T00:00:00Z",
  KOHDE_MPVM: string // "2008-04-02T16:29:02.283Z",
  luontipvm: string // "2003-04-03T00:00:00Z"
  muutospvm: string // "2011-01-28T00:00:00Z"
  paikannustapa: string | null // "Null";
  paikannustarkkuus: string | null // "Ohjeellinen (10 - 100 m)";
  selite: string // "Paikannettu Paanasalon ja Puomion raportin karttaliitteen (1994) mukaan";
  url: string // "www.kyppi.fi/to.aspx?id=112.1279";
  x: number // 382363.823
  y: number // 6667893.676
  /**
   * trimmed and splitted values for easier usage
   */
  tyyppiSplitted: MuinaisjaannosTyyppi[]
  ajoitusSplitted: MuinaisjaannosAjoitus[]
  alatyyppiSplitted: string[]
}

export interface MuinaisjaannosPisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, MuinaisjaannosPisteFeatureProperties> {
  id: `muinaisjaannos_piste.${number}`
}

type MuinaisjaannosAlueFeatureProperties = {
  OBJECTID: number // 9190
  mjtunnus: number // 1000007642
  inspireID: string // "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/1000007642_A9190";
  kohdenimi: string // "Tukikohta I:tie (Mustavuori)                                                                        ";
  kunta: string // "Helsinki                                                                                            ";
  Laji: "kiinteä muinaisjäännös" // "kiinteä muinaisjäännös                                                                              ";
  lähdetiedon_ajoitus: string // "1979";
  digipvm: string // "12.3.2007 15:02:19";
  digimk: string // "PerusCD";
  Muutospvm: string // "18.3.2008 09:30:12";
  url: string // "https://www.museoverkko.fi/netsovellus/esri/broker.aspx?taulu=mjreki.dbo.T_KOHDE&tunnus=1000001634"
}

export interface MuinaisjaannosAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, MuinaisjaannosAlueFeatureProperties> {
  id: `muinaisjaannos_alue.${number}`
}

type MuuKulttuuriperintokohdePisteFeatureProperties = {
  OBJECTID: number // 130459;
  mjtunnus: number // 1000030753;
  inspireID: string // "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/1000030753_P130459";
  kohdenimi: string // ""Luola G 22 (Herttoniemen yritysalue)";
  kunta: string // "Helsinki"
  Laji: "muu kulttuuriperintökohde" // "muu kulttuuriperintökohde"
  tyyppi: string // "puolustusvarustukset,  ,  ,  ";
  alatyyppi: string // "luolat,  ,  ,  ";
  ajoitus: string // "historiallinen, moderni,  ,  ";
  vedenalainen: "k" | "e" // "E"
  KOHDE_APVM: string // "2003-04-03T00:00:00Z",
  KOHDE_MPVM: string // "2008-04-02T16:29:02.283Z",
  luontipvm: string // "2003-04-03T00:00:00Z"
  muutospvm: string // "2011-01-28T00:00:00Z"
  paikannustapa: string | null // "Tarkastus";
  paikannustarkkuus: string | null // "Tarkka (< 10 m)";
  selite: string // "Koordinaatit luolan edestä Helsingin kantakartasta";
  url: string // "www.kyppi.fi/to.aspx?id=112.1000030753";
  x: number // 391239
  y: number // 6674656
  /**
   * trimmed and splitted values for easier usage
   */
  tyyppiSplitted: MuinaisjaannosTyyppi[]
  ajoitusSplitted: MuinaisjaannosAjoitus[]
  alatyyppiSplitted: string[]
}

export interface MuuKulttuuriperintokohdePisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, MuuKulttuuriperintokohdePisteFeatureProperties> {
  id: `muu_kulttuuriperintokohde_piste.${number}`
}

type MuuKulttuuriperintokohdeAlueFeatureProperties = {
  OBJECTID: number // 9190
  mjtunnus: number // 1000007642
  inspireID: string // "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/1000007642_A9190";
  kohdenimi: string // "Tukikohta I:tie (Mustavuori)                                                                        ";
  kunta: string // "Helsinki                                                                                            ";
  Laji: "muu kulttuuriperintökohde" // "muu kulttuuriperintökohde                                                                           ";
  lähdetiedon_ajoitus: string // "1979";
  digipvm: string // "12.3.2007 15:02:19";
  digimk: string // "PerusCD";
  Muutospvm: string // "18.3.2008 09:30:12";
  url: string // "https://www.museoverkko.fi/netsovellus/esri/broker.aspx?taulu=mjreki.dbo.T_KOHDE&tunnus=1000001634"
}

export interface MuuKulttuuriperintokohdeAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, MuuKulttuuriperintokohdeAlueFeatureProperties> {
  id: `muu_kulttuuriperintokohde_alue.${number}`
}

type SuojellutRakennuksetPisteFeatureProperties = {
  OBJECTID: number // "2843";
  KOHDEID: number // "200928";
  rakennusID: number // "305349";
  inspireID: string // "http://paikkatiedot.fi/so/1000000/ps/ProtectedSite/305349_2843";
  vtj_prt: string // "103247805B               ";
  kohdenimi: string // "Meilahden kirkko";
  rakennusnimi: string // "Kirkko                                                                                              ";
  kunta: string // "Helsinki                                                                                            ";
  suojeluryhmä: string // "Kirkkolaki,  ,  ,  ";
  suojelun_tila: string // "Suojeltu                                                                                            ";
  url: string // "www.kyppi.fi/to.aspx?id=130.200928";
  x: number // "383802.548";
  y: number // "6674739.466";
}

export interface SuojellutRakennuksetPisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, SuojellutRakennuksetPisteFeatureProperties> {
  id: `suojellut_rakennukset_piste.${number}`
}

type SuojellutRakennuksetAlueFeatureProperties = {
  OBJECTID: number // "2843";
  KOHDEID: number // "200928";
  inspireID: string // "http://paikkatiedot.fi/so/1000000/ps/ProtectedSite/305349_2843";
  kohdenimi: string // "Meilahden kirkko";
  kunta: string // "Helsinki                                                                                            ";
  suojeluryhmä: string // "Kirkkolaki,  ,  ,  ";
  suojelun_tila: string // "Suojeltu                                                                                            ";
  url: string // "www.kyppi.fi/to.aspx?id=130.200928";
}

export interface SuojellutRakennuksetAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, SuojellutRakennuksetAlueFeatureProperties> {
  id: `suojellut_rakennukset_alue.${number}`
}

type RKYAlueFeatureProperties = {
  OBJECTID: number // "1632";
  ID: number // "1570";
  inspireID: string // "http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/1570_A1632";
  kohdenimi: string // "Pääkaupunkiseudun I maailmansodan linnoitteet";
  nimi: string // "Itä-Villinki";
  url: string // "http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=1570";
}

export interface RKYAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, RKYAlueFeatureProperties> {
  id: `rky_alue.${number}`
}

type RKYPisteFeatureProperties = {
  OBJECTID: number //"31";
  ID: string //"4255";
  inspireID: string //"http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/4255_P31";
  kohdenimi: string //"Struven astemittausketju";
  url: string //"http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=4255";
}

export interface RKYPisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, RKYPisteFeatureProperties> {
  id: `rky_piste.${number}`
}

type RKYViivaFeatureProperties = {
  OBJECTID: string //"69";
  ID: string //"2117";
  inspireID: string //"http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/2117_V69";
  kohdenimi: string //"Suuri Rantatie";
  url: string //"http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=2117";
  Shape: string //"Polyline";
}

export interface RKYViivaFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, RKYViivaFeatureProperties> {
  id: `rky_viiva.${number}`
}

type MaailmanperintoPisteFeatureProperties = {
  Shape: string // "Point";
  OBJECTID: string // "2";
  Nimi: string // "Struven ketju / Stuorrahanoaivi";
  URL: string // "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa#struve";
}

export interface MaailmanperintoPisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, MaailmanperintoPisteFeatureProperties> {
  id: `maailmanperinto_piste.${number}`
}

type MaailmanperintoAlueFeatureProperties = {
  OBJECTID: number // 429;
  Nimi: string // "Suomenllinna";
  URL: string // "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa#suomenlinna";
  Alue: string | null // "Suoja-alue";
}

export interface MaailmanperintoAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, MaailmanperintoAlueFeatureProperties> {
  id: `maailmanperinto_alue.${number}`
}

export type MuseovirastoFeature =
  | MuinaisjaannosPisteFeature
  | MuinaisjaannosAlueFeature
  | MuuKulttuuriperintokohdePisteFeature
  | MuuKulttuuriperintokohdeAlueFeature
  | SuojellutRakennuksetPisteFeature
  | SuojellutRakennuksetAlueFeature
  | RKYAlueFeature
  | RKYPisteFeature
  | RKYViivaFeature
  | MaailmanperintoPisteFeature
  | MaailmanperintoAlueFeature

export type MuseovirastoFeatureInfoResult = {
  type: "FeatureCollection"
  features: MuseovirastoFeature[]
}

export const isMuinaisjaannosPisteFeature = (
  feature: Feature
): feature is MuinaisjaannosPisteFeature =>
  feature.id?.toString().startsWith("muinaisjaannos_piste.") ?? false

export const isMuinaisjaannosAlueFeature = (
  feature: Feature
): feature is MuinaisjaannosAlueFeature =>
  feature.id?.toString().startsWith("muinaisjaannos_alue.") ?? false

export const isMuuKulttuuriperintokohdePisteFeature = (
  feature: Feature
): feature is MuuKulttuuriperintokohdePisteFeature =>
  feature.id?.toString().startsWith("muu_kulttuuriperintokohde_piste.") ?? false

export const isMuuKulttuuriperintokohdeAlueFeature = (
  feature: Feature
): feature is MuuKulttuuriperintokohdeAlueFeature =>
  feature.id?.toString().startsWith("muu_kulttuuriperintokohde_alue.") ?? false

export const isSuojellutRakennuksetPisteFeature = (
  feature: Feature
): feature is SuojellutRakennuksetPisteFeature =>
  feature.id?.toString().startsWith("suojellut_rakennukset_piste.") ?? false

export const isSuojellutRakennuksetAlueFeature = (
  feature: Feature
): feature is SuojellutRakennuksetAlueFeature =>
  feature.id?.toString().startsWith("suojellut_rakennukset_alue.") ?? false

export const isRKYAlueFeature = (feature: Feature): feature is RKYAlueFeature =>
  feature.id?.toString().startsWith("rky_alue.") ?? false

export const isRKYPisteFeature = (
  feature: Feature
): feature is RKYPisteFeature =>
  feature.id?.toString().startsWith("rky_piste.") ?? false

export const isRKYViivaFeature = (
  feature: Feature
): feature is RKYViivaFeature =>
  feature.id?.toString().startsWith("rky_viiva.") ?? false

export const isMaailmanperintoPisteFeature = (
  feature: Feature
): feature is MaailmanperintoPisteFeature =>
  feature.id?.toString().startsWith("maailmanperinto_piste.") ?? false

export const isMaailmanperintoAlueFeature = (
  feature: Feature
): feature is MaailmanperintoAlueFeature =>
  feature.id?.toString().startsWith("maailmanperinto_alue.") ?? false

export const isMuseovirastoFeature = (
  feature: MapFeature
): feature is MuseovirastoFeature => {
  return (
    "id" in feature &&
    (isMuinaisjaannosPisteFeature(feature) ||
      isMuinaisjaannosAlueFeature(feature) ||
      isMuuKulttuuriperintokohdePisteFeature(feature) ||
      isMuuKulttuuriperintokohdeAlueFeature(feature) ||
      isSuojellutRakennuksetPisteFeature(feature) ||
      isSuojellutRakennuksetAlueFeature(feature) ||
      isRKYAlueFeature(feature) ||
      isRKYPisteFeature(feature) ||
      isRKYViivaFeature(feature) ||
      isMaailmanperintoPisteFeature(feature) ||
      isMaailmanperintoAlueFeature(feature))
  )
}

export const getMuseovirastoFeatureLayerName = (
  feature: MuseovirastoFeature
): MuseovirastoLayer => {
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
  throw new Error(`Tuntematon Museovirasto Feature: ${JSON.stringify(feature)}`)
}
