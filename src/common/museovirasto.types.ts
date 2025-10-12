import { Feature, Geometry, Point } from "geojson"
import { FeatureSupplementaryData } from "./featureSupplementaryData.types"
import { MuseovirastoLayer } from "./layers.types"

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

type MuuKulttuuriperintokohdePisteFeatureProperties =
  MuinaisjaannosPisteFeatureProperties & {
    Laji: "muu kulttuuriperintökohde"
  }

export interface MuuKulttuuriperintokohdePisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, MuuKulttuuriperintokohdePisteFeatureProperties> {
  id: `muu_kulttuuriperintokohde_piste.${number}`
}

type MuuKulttuuriperintokohdeAlueFeatureProperties =
  MuinaisjaannosAlueFeatureProperties & {
    Laji: "muu kulttuuriperintökohde"
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

type VarkAlueFeatureProperties = {
  VARK_ID: number // 100952
  VARK_nimi: string // "Bembölen myllynpaikka"
  Mj_kohde: string //"Bembölen myllynpaikka"
  Mj_kohde2: string | null // null
  MJ_kohde3: string | null // null
  Mj_tunnus: string //"1000014112"
  Mj_tunnus2: string | null // null
  Kohde_lkm: number // 1
  Ajoitus: string //"historiallinen"
  Ajoitus2: string //"ei määritelty"
  Tyyppi: string //"työ- ja valmistuspaikat"
  Alatyyppi: string //"vesimyllyt"
  Poikkeava: string // "e"
  Pinta_ala: number // 0.7967
  Kunta: string //"Espoo"
  Maakunta: string //"Uusimaa"
  Alva_museo: string //"Espoon kaupunginmuseo"
  Luontipvm: string //"27.09.2019"
  Digipvm: string //"27.09.2019"
  Muutospvm: string | null //null
  Linkki: string //"https://www.kyppi.fi/vark.aspx?id=1000014112"
}

export interface VarkAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, VarkAlueFeatureProperties> {
  id: `vark_alueet.${number}`
}

type VarkPisteFeatureProperties = {
  VARK_ID: number // 100952
  VARK_nimi: string // "Bembölen myllynpaikka"
  Mj_kohde: string //"Bembölen myllynpaikka"
  Mj_kohde2: string | null // null
  MJ_kohde3: string | null // null
  Mj_tunnus: string //"1000014112"
  Mj_tunnus2: string | null // null
  Kohde_lkm: number // 1
  Ajoitus: string //"historiallinen"
  Ajoitus2: string //"ei määritelty"
  Tyyppi: string //"työ- ja valmistuspaikat"
  Alatyyppi: string //"vesimyllyt"
  Poikkeava: string // "e"
  Pinta_ala: number // 0.7967
  Kunta: string //"Espoo"
  Maakunta: string //"Uusimaa"
  Alva_museo: string //"Espoon kaupunginmuseo"
  Luontipvm: string //"27.09.2019"
  Digipvm: string //"27.09.2019"
  Muutospvm: string | null //null
  Linkki: string //"https://www.kyppi.fi/vark.aspx?id=1000014112"
}

export interface VarkPisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, VarkPisteFeatureProperties> {
  id: `vark_pisteet.${number}`
}

export type LöytöpaikkaPisteFeatureProperties =
  MuinaisjaannosPisteFeatureProperties & {
    Laji: "löytöpaikka" // "löytöpaikka";
  }

export interface LöytöpaikkaPisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, LöytöpaikkaPisteFeatureProperties> {
  id: `rajapinta_loytopaikka_piste.${number}`
}

type LöytöpaikkaAlueFeatureProperties = MuinaisjaannosAlueFeatureProperties & {
  Laji: "löytöpaikka"
}

export interface LöytöpaikkaAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, LöytöpaikkaAlueFeatureProperties> {
  id: `rajapinta_loytopaikka_alue.${number}`
}

export type MuuKohdePisteFeatureProperties =
  MuinaisjaannosPisteFeatureProperties & {
    Laji: "muu kohde"
  }

export interface MuuKohdePisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, MuuKohdePisteFeatureProperties> {
  id: `rajapinta_muu_kohde_piste.${number}`
}

type MuuKohdeAlueFeatureProperties = MuinaisjaannosAlueFeatureProperties & {
  Laji: "muu kohde"
}

export interface MuuKohdeAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, MuuKohdeAlueFeatureProperties> {
  id: `rajapinta_muu_kohde_alue.${number}`
}

export type LuonnonmuodostumaPisteFeatureProperties =
  MuinaisjaannosPisteFeatureProperties & {
    Laji: "luonnonmuodostuma"
  }

export interface LuonnonmuodostumaPisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, LuonnonmuodostumaPisteFeatureProperties> {
  id: `rajapinta_luonnonmuodostuma_piste.${number}`
}

type LuonnonmuodostumaAlueFeatureProperties =
  MuinaisjaannosAlueFeatureProperties & {
    Laji: "luonnonmuodostuma"
  }

export interface LuonnonmuodostumaAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, LuonnonmuodostumaAlueFeatureProperties> {
  id: `rajapinta_luonnonmuodostuma_alue.${number}`
}

export type HavaintokohdePisteFeatureProperties =
  MuinaisjaannosPisteFeatureProperties & {
    Laji: "havaintokohde"
  }

export interface HavaintokohdePisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, HavaintokohdePisteFeatureProperties> {
  id: `rajapinta_havaintokohde_piste.${number}`
}

type HavaintokohdeAlueFeatureProperties =
  MuinaisjaannosAlueFeatureProperties & {
    Laji: "havaintokohde"
  }

export interface HavaintokohdeAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, HavaintokohdeAlueFeatureProperties> {
  id: `rajapinta_havaintokohde_alue.${number}`
}

export type MahdollinenMuinaisjäännösPisteFeatureProperties =
  MuinaisjaannosPisteFeatureProperties & {
    Laji: "mahdollinen muinaisjäännös"
  }

export interface MahdollinenMuinaisjäännösPisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, MahdollinenMuinaisjäännösPisteFeatureProperties> {
  id: `rajapinta_mahdollinen_muinaisjaannos_piste.${number}`
}

type MahdollinenMuinaisjäännösAlueFeatureProperties =
  MuinaisjaannosAlueFeatureProperties & {
    Laji: "mahdollinen muinaisjäännös"
  }

export interface MahdollinenMuinaisjäännösAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, MahdollinenMuinaisjäännösAlueFeatureProperties> {
  id: `rajapinta_mahdollinen_muinaisjaannos_alue.${number}`
}

type PoistettuKiinteäMuijaisjäännösPisteFeatureProperties =
  MuinaisjaannosPisteFeatureProperties & {
    Laji: "poistettu kiinteä muinaisjäännös (ei rauhoitettu)"
  }

export interface PoistettuKiinteäMuijaisjäännösPisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, PoistettuKiinteäMuijaisjäännösPisteFeatureProperties> {
  id: `rajapinta_poistettu_kiintea_muinaisjaannos_piste.${number}`
}

type PoistettuKiinteäMuijaisjäännösAlueFeatureProperties =
  MuinaisjaannosAlueFeatureProperties & {
    Laji: "poistettu kiinteä muinaisjäännös (ei rauhoitettu)"
  }

export interface PoistettuKiinteäMuijaisjäännösAlueFeature
  extends FeatureSupplementaryData,
    Feature<Geometry, PoistettuKiinteäMuijaisjäännösAlueFeatureProperties> {
  id: `rajapinta_poistettu_kiintea_muinaisjaannos_alue.${number}`
}

export type AlakohdePisteFeatureProperties =
  MuinaisjaannosPisteFeatureProperties & {
    alakohdetunnus: number
    Laji: string // Kaikki Muinaisjäännösrekisterin muut feature-lajit
  }

export interface AlakohdePisteFeature
  extends FeatureSupplementaryData,
    Feature<Point, AlakohdePisteFeatureProperties> {
  id: `alakohde_piste.${number}`
}

export type MuseovirastoFeature =
  | MuinaisjäännörekisteriPisteFeature
  | MuinaisjäännörekisteriAlueFeature
  | SuojellutRakennuksetPisteFeature
  | SuojellutRakennuksetAlueFeature
  | RKYAlueFeature
  | RKYPisteFeature
  | RKYViivaFeature
  | MaailmanperintoPisteFeature
  | MaailmanperintoAlueFeature
  | VarkPisteFeature
  | VarkAlueFeature

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

export const isVarkPisteFeature = (
  feature: Feature
): feature is VarkPisteFeature =>
  feature.id?.toString().startsWith("vark_pisteet.") ?? false

export const isVarkAlueFeature = (
  feature: Feature
): feature is VarkAlueFeature =>
  feature.id?.toString().startsWith("vark_alueet.") ?? false

export const isLöytöpaikkaPisteFeature = (
  feature: Feature
): feature is LöytöpaikkaPisteFeature =>
  feature.id?.toString().startsWith("rajapinta_loytopaikka_piste.") ?? false

export const isLöytöpaikkaAlueFeature = (
  feature: Feature
): feature is LöytöpaikkaAlueFeature =>
  feature.id?.toString().startsWith("rajapinta_loytopaikka_alue.") ?? false

export const isMuuKohdePisteFeature = (
  feature: Feature
): feature is MuuKohdePisteFeature =>
  feature.id?.toString().startsWith("rajapinta_muu_kohde_piste.") ?? false

export const isMuuKohdeAlueFeature = (
  feature: Feature
): feature is MuuKohdeAlueFeature =>
  feature.id?.toString().startsWith("rajapinta_muu_kohde_alue.") ?? false

export const isLuonnonmuodostumaPisteFeature = (
  feature: Feature
): feature is LuonnonmuodostumaPisteFeature =>
  feature.id?.toString().startsWith("rajapinta_luonnonmuodostuma_piste.") ??
  false

export const isLuonnonmuodostumaAlueFeature = (
  feature: Feature
): feature is LuonnonmuodostumaAlueFeature =>
  feature.id?.toString().startsWith("rajapinta_luonnonmuodostuma_piste.") ??
  false

export const isAlakohdePisteFeature = (
  feature: Feature
): feature is AlakohdePisteFeature =>
  feature.id?.toString().startsWith("alakohde_piste.") ?? false

export const isHavaintokohdePisteFeature = (
  feature: Feature
): feature is HavaintokohdePisteFeature =>
  feature.id?.toString().startsWith("rajapinta_havaintokohde_piste.") ?? false

export const isHavaintokohdeAlueFeature = (
  feature: Feature
): feature is HavaintokohdeAlueFeature =>
  feature.id?.toString().startsWith("rajapinta_havaintokohde_alue.") ?? false

export const isMahdollinenMuinaisjäännösPisteFeature = (
  feature: Feature
): feature is MahdollinenMuinaisjäännösPisteFeature =>
  feature.id
    ?.toString()
    .startsWith("rajapinta_mahdollinen_muinaisjaannos_piste.") ?? false

export const isMahdollinenMuinaisjäännösAlueFeature = (
  feature: Feature
): feature is MahdollinenMuinaisjäännösAlueFeature =>
  feature.id
    ?.toString()
    .startsWith("rajapinta_mahdollinen_muinaisjaannos_alue.") ?? false

export const isPoistettuKiinteäMuijaisjäännösPisteFeature = (
  feature: Feature
): feature is PoistettuKiinteäMuijaisjäännösPisteFeature =>
  feature.id
    ?.toString()
    .startsWith("rajapinta_poistettu_kiintea_muinaisjaannos_piste.") ?? false

export const isPoistettuKiinteäMuijaisjäännösAlueFeature = (
  feature: Feature
): feature is PoistettuKiinteäMuijaisjäännösAlueFeature =>
  feature.id
    ?.toString()
    .startsWith("rajapinta_poistettu_kiintea_muinaisjaannos_alue.") ?? false

export const isMuinaisjäännörekisteriFeature = (
  feature: Feature
): feature is
  | MuinaisjäännörekisteriPisteFeature
  | MuinaisjäännörekisteriAlueFeature =>
  isMuinaisjäännörekisteriPisteFeature(feature) ||
  isMuinaisjäännörekisteriAlueFeature(feature)

export type MuinaisjäännörekisteriPisteFeature =
  | MuinaisjaannosPisteFeature
  | MuuKulttuuriperintokohdePisteFeature
  | LöytöpaikkaPisteFeature
  | MuuKohdePisteFeature
  | LuonnonmuodostumaPisteFeature
  | AlakohdePisteFeature
  | HavaintokohdePisteFeature
  | MahdollinenMuinaisjäännösPisteFeature
  | PoistettuKiinteäMuijaisjäännösPisteFeature

export const isMuinaisjäännörekisteriPisteFeature = (
  feature: Feature
): feature is MuinaisjäännörekisteriPisteFeature =>
  isMuinaisjaannosPisteFeature(feature) ||
  isMuuKulttuuriperintokohdePisteFeature(feature) ||
  isLöytöpaikkaPisteFeature(feature) ||
  isMuuKohdePisteFeature(feature) ||
  isLuonnonmuodostumaPisteFeature(feature) ||
  isHavaintokohdePisteFeature(feature) ||
  isMahdollinenMuinaisjäännösPisteFeature(feature) ||
  isPoistettuKiinteäMuijaisjäännösPisteFeature(feature) ||
  isAlakohdePisteFeature(feature)

export type MuinaisjäännörekisteriAlueFeature =
  | MuinaisjaannosAlueFeature
  | MuuKulttuuriperintokohdeAlueFeature
  | LöytöpaikkaAlueFeature
  | MuuKohdeAlueFeature
  | LuonnonmuodostumaAlueFeature
  | MahdollinenMuinaisjäännösAlueFeature
  | PoistettuKiinteäMuijaisjäännösAlueFeature

export const isMuinaisjäännörekisteriAlueFeature = (
  feature: Feature
): feature is MuinaisjäännörekisteriAlueFeature =>
  isMuinaisjaannosAlueFeature(feature) ||
  isMuuKulttuuriperintokohdeAlueFeature(feature) ||
  isLöytöpaikkaAlueFeature(feature) ||
  isMuuKohdeAlueFeature(feature) ||
  isLuonnonmuodostumaAlueFeature(feature) ||
  isMahdollinenMuinaisjäännösAlueFeature(feature) ||
  isPoistettuKiinteäMuijaisjäännösAlueFeature(feature) ||
  isHavaintokohdeAlueFeature(feature)

export const getMuseovirastoFeatureNameField = (
  layer: MuseovirastoLayer
): string => {
  switch (layer) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
    case MuseovirastoLayer.Muu_kulttuuriperintokohde_alue:
    case MuseovirastoLayer.Muu_kulttuuriperintokohde_piste:
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_piste:
    case MuseovirastoLayer.RKY_viiva:
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
      return `kohdenimi`
    case MuseovirastoLayer.Maailmanperinto_piste:
    case MuseovirastoLayer.Maailmanperinto_alue:
      return `Nimi`
    case MuseovirastoLayer.VARK_pisteet:
    case MuseovirastoLayer.VARK_alueet:
      return `VARK_nimi`
  }
}

export const getMuseovirastoFeatureIdField = (
  layer: MuseovirastoLayer
): string | undefined => {
  switch (layer) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
    case MuseovirastoLayer.Muinaisjaannokset_alue:
    case MuseovirastoLayer.Muu_kulttuuriperintokohde_alue:
    case MuseovirastoLayer.Muu_kulttuuriperintokohde_piste:
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
      return "mjtunnus"
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return "KOHDEID"
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_piste:
    case MuseovirastoLayer.RKY_viiva:
      return `ID`
    case MuseovirastoLayer.VARK_pisteet:
    case MuseovirastoLayer.VARK_alueet:
      return `VARK_ID`
    case MuseovirastoLayer.Maailmanperinto_piste:
    case MuseovirastoLayer.Maailmanperinto_alue:
      return undefined
  }
}
