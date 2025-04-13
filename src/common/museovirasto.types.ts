import { FeatureSupplementaryData } from "./featureSupplementaryData.types"
import { MapFeature } from "./mapFeature.types"
import { MuseovirastoLayer } from "./layers.types"
import { WmsFeature, WmsFeatureInfoResult } from "./wms.types"

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

export interface MuinaisjaannosPisteWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature {
  id: `muinaisjaannos_piste.${number}`
  properties: {
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
}

export interface MuinaisjaannosAlueWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature {
  id: `muinaisjaannos_alue.${number}`
  properties: {
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
}

export interface MuuKulttuuriperintokohdePisteWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature {
  id: `muu_kulttuuriperintokohde_piste.${number}`
  properties: {
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
}

export interface MuuKulttuuriperintokohdeAlueWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature {
  id: `muu_kulttuuriperintokohde_alue.${number}`
  properties: {
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
}

export interface SuojellutRakennuksetPisteWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature {
  id: `suojellut_rakennukset_piste.${number}`
  properties: {
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
}

export interface SuojellutRakennuksetAlueWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature {
  id: `suojellut_rakennukset_alue.${number}`
  properties: {
    OBJECTID: number // "2843";
    KOHDEID: number // "200928";
    inspireID: string // "http://paikkatiedot.fi/so/1000000/ps/ProtectedSite/305349_2843";
    kohdenimi: string // "Meilahden kirkko";
    kunta: string // "Helsinki                                                                                            ";
    suojeluryhmä: string // "Kirkkolaki,  ,  ,  ";
    suojelun_tila: string // "Suojeltu                                                                                            ";
    url: string // "www.kyppi.fi/to.aspx?id=130.200928";
  }
}

export interface RKYAlueWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature {
  id: `rky_alue.${number}`
  properties: {
    OBJECTID: number // "1632";
    ID: number // "1570";
    inspireID: string // "http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/1570_A1632";
    kohdenimi: string // "Pääkaupunkiseudun I maailmansodan linnoitteet";
    nimi: string // "Itä-Villinki";
    url: string // "http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=1570";
  }
}

export interface RKYPisteWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature {
  id: `rky_piste.${number}`
  properties: {
    OBJECTID: number //"31";
    ID: string //"4255";
    inspireID: string //"http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/4255_P31";
    kohdenimi: string //"Struven astemittausketju";
    url: string //"http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=4255";
  }
}

export interface RKYViivaWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature {
  id: `rky_viiva.${number}`
  properties: {
    OBJECTID: string //"69";
    ID: string //"2117";
    inspireID: string //"http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/2117_V69";
    kohdenimi: string //"Suuri Rantatie";
    url: string //"http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=2117";
    Shape: string //"Polyline";
  }
}

export interface MaailmanperintoPisteWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature {
  id: `maailmanperinto_piste.${number}`
  properties: {
    Shape: string // "Point";
    OBJECTID: string // "2";
    Nimi: string // "Struven ketju / Stuorrahanoaivi";
    URL: string // "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa#struve";
  }
}

export interface MaailmanperintoAlueWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature {
  id: `maailmanperinto_alue.${number}`
  properties: {
    OBJECTID: number // 429;
    Nimi: string // "Suomenllinna";
    URL: string // "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa#suomenlinna";
    Alue: string | null // "Suoja-alue";
  }
}

export type MuseovirastoWmsFeature =
  | MuinaisjaannosPisteWmsFeature
  | MuinaisjaannosAlueWmsFeature
  | MuuKulttuuriperintokohdePisteWmsFeature
  | MuuKulttuuriperintokohdeAlueWmsFeature
  | SuojellutRakennuksetPisteWmsFeature
  | SuojellutRakennuksetAlueWmsFeature
  | RKYAlueWmsFeature
  | RKYPisteWmsFeature
  | RKYViivaWmsFeature
  | MaailmanperintoPisteWmsFeature
  | MaailmanperintoAlueWmsFeature

export type MuseovirastoWmsFeatureInfoResult =
  WmsFeatureInfoResult<MuseovirastoWmsFeature>

export const isMuinaisjaannosPisteWmsFeature = (
  feature: WmsFeature
): feature is MuinaisjaannosPisteWmsFeature =>
  feature.id.startsWith("muinaisjaannos_piste.")

export const isMuinaisjaannosAlueWmsFeature = (
  feature: WmsFeature
): feature is MuinaisjaannosAlueWmsFeature =>
  feature.id.startsWith("muinaisjaannos_alue.")

export const isMuuKulttuuriperintokohdePisteWmsFeature = (
  feature: WmsFeature
): feature is MuuKulttuuriperintokohdePisteWmsFeature =>
  feature.id.startsWith("muu_kulttuuriperintokohde_piste.")

export const isMuuKulttuuriperintokohdeAlueWmsFeature = (
  feature: WmsFeature
): feature is MuuKulttuuriperintokohdeAlueWmsFeature =>
  feature.id.startsWith("muu_kulttuuriperintokohde_alue.")

export const isSuojellutRakennuksetPisteWmsFeature = (
  feature: WmsFeature
): feature is SuojellutRakennuksetPisteWmsFeature =>
  feature.id.startsWith("suojellut_rakennukset_piste.")

export const isSuojellutRakennuksetAlueWmsFeature = (
  feature: WmsFeature
): feature is SuojellutRakennuksetAlueWmsFeature =>
  feature.id.startsWith("suojellut_rakennukset_alue.")

export const isRKYAlueWmsFeature = (
  feature: WmsFeature
): feature is RKYAlueWmsFeature => feature.id.startsWith("rky_alue.")

export const isRKYPisteWmsFeature = (
  feature: WmsFeature
): feature is RKYPisteWmsFeature => feature.id.startsWith("rky_piste.")

export const isRKYViivaWmsFeature = (
  feature: WmsFeature
): feature is RKYViivaWmsFeature => feature.id.startsWith("rky_viiva.")

export const isMaailmanperintoPisteWmsFeature = (
  feature: WmsFeature
): feature is MaailmanperintoPisteWmsFeature =>
  feature.id.startsWith("maailmanperinto_piste.")

export const isMaailmanperintoAlueWmsFeature = (
  feature: WmsFeature
): feature is MaailmanperintoAlueWmsFeature =>
  feature.id.startsWith("maailmanperinto_alue.")

export const isMuseovirastoWmsFeature = (
  feature: MapFeature
): feature is MuseovirastoWmsFeature => {
  return (
    "id" in feature &&
    (isMuinaisjaannosPisteWmsFeature(feature) ||
      isMuinaisjaannosAlueWmsFeature(feature) ||
      isMuuKulttuuriperintokohdePisteWmsFeature(feature) ||
      isMuuKulttuuriperintokohdeAlueWmsFeature(feature) ||
      isSuojellutRakennuksetPisteWmsFeature(feature) ||
      isSuojellutRakennuksetAlueWmsFeature(feature) ||
      isRKYAlueWmsFeature(feature) ||
      isRKYPisteWmsFeature(feature) ||
      isRKYViivaWmsFeature(feature) ||
      isMaailmanperintoPisteWmsFeature(feature) ||
      isMaailmanperintoAlueWmsFeature(feature))
  )
}

export const getMuseovirastoWmsFeatureLayerName = (
  feature: MuseovirastoWmsFeature
): MuseovirastoLayer => {
  if (isMuinaisjaannosPisteWmsFeature(feature)) {
    return MuseovirastoLayer.Muinaisjaannokset_piste
  }
  if (isMuinaisjaannosAlueWmsFeature(feature)) {
    return MuseovirastoLayer.Muinaisjaannokset_alue
  }
  if (isMuuKulttuuriperintokohdePisteWmsFeature(feature)) {
    return MuseovirastoLayer.Muu_kulttuuriperintokohde_piste
  }
  if (isMuuKulttuuriperintokohdeAlueWmsFeature(feature)) {
    return MuseovirastoLayer.Muu_kulttuuriperintokohde_alue
  }
  if (isSuojellutRakennuksetPisteWmsFeature(feature)) {
    return MuseovirastoLayer.Suojellut_rakennukset_piste
  }
  if (isSuojellutRakennuksetAlueWmsFeature(feature)) {
    return MuseovirastoLayer.Suojellut_rakennukset_alue
  }
  if (isRKYAlueWmsFeature(feature)) {
    return MuseovirastoLayer.RKY_alue
  }
  if (isRKYPisteWmsFeature(feature)) {
    return MuseovirastoLayer.RKY_piste
  }
  if (isRKYViivaWmsFeature(feature)) {
    return MuseovirastoLayer.RKY_viiva
  }
  if (isMaailmanperintoAlueWmsFeature(feature)) {
    return MuseovirastoLayer.Maailmanperinto_alue
  }
  if (isMaailmanperintoPisteWmsFeature(feature)) {
    return MuseovirastoLayer.Maailmanperinto_piste
  }
  throw new Error(`Tuntematon WMS Feature: ${JSON.stringify(feature)}`)
}
