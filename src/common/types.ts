export enum Language {
  FI = "fi",
  SV = "sv"
}

export enum LayerGroup {
  Maanmittauslaitos = "Maanmittauslaitos",
  GTK = "GTK",
  Museovirasto = "Museovirasto",
  Ahvenanmaa = "Ahvenanmaa",
  Helsinki = "Helsinki",
  Models = "Models",
  MaisemanMuisti = "MaisemanMuisti"
}

export enum MaanmittauslaitosLayer {
  Maastokartta = "maastokartta",
  Taustakartta = "taustakartta",
  Ortokuva = "ortokuva"
}

export enum MuseovirastoLayer {
  Muinaisjaannokset_piste = "Muinaisjaannokset_piste",
  Muinaisjaannokset_alue = "Muinaisjaannokset_alue",
  Suojellut_rakennukset_piste = "Suojellut_rakennukset_piste",
  Suojellut_rakennukset_alue = "Suojellut_rakennukset_alue",
  RKY_alue = "RKY_alue",
  RKY_piste = "RKY_piste",
  RKY_viiva = "RKY_viiva",
  Maailmanperinto_piste = "Maailmanperinto_piste",
  Maailmanperinto_alue = "Maailmanperinto_alue"
}

export enum AhvenanmaaLayer {
  Fornminnen = "Fornminnen",
  MaritimtKulturarv = "Maritimt kulturarv; Vrak"
}

export enum ModelLayer {
  ModelLayer = "ModelLayer"
}

export enum MaisemanMuistiLayer {
  MaisemanMuisti = "MaisemanMuisti"
}

export enum GtkLayer {
  // kaikki = "Muinaisrannat", //(7)
  // kuroutumishavainnot = "kuroutumishavainnot", //(8)
  // rantahavainnot = "rantahavainnot", //(9)
  // Isobaasit_ylin_ranta = "ylin_ranta", //(11)
  // Isobaasit_litorina = "litorina", //(12)
  // Jääjärvet_baltia = "baltia", //(14)
  // Jääjärvet_ilomantsi = "ilomantsi", //(15)
  // Jääjärvet_pohjois_suomi = "pohjois_suomi", //(16)
  // Jääjärvet_pielinen = "pielinen", //(17)
  // Jääjärvet_saaminki = "saaminki", //(18)
  // Jääjärvet_sotkamo = "sotkamo", //(19)
  muinaisrannat = "muinaisrannat" //(20)
  // ylin_ranta_10m_korkeusmallista = "ylin_ranta_10m_korkeusmallista", //(21)
  // ylin_ranta_25m_korkeusmallista = "ylin_ranta_25m_korkeusmallista", //(22)
  // litorina_10m_korkeusmallista = "litorina_10m_korkeusmallista", //(23)
  // litorina_25m_korkeusmallista = "litorina_25m_korkeusmallista", //(24)
  // merialue = "merialue" //(25)
}

export enum HelsinkiLayer {
  Maalinnoitus_yksikot = "Maalinnoitus_yksikot",
  Maalinnoitus_kohteet = "Maalinnoitus_kohteet",
  Maalinnoitus_rajaukset = "Maalinnoitus_rajaukset",
  Maalinnoitus_karttatekstit = "Maalinnoitus_karttatekstit"
}

export type FeatureLayer =
  | MuseovirastoLayer
  | AhvenanmaaLayer
  | ModelLayer
  | MaisemanMuistiLayer
  | HelsinkiLayer

export type MuseovirastoLayerId = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const museovirastoLayerIdMap: Record<
  MuseovirastoLayer,
  MuseovirastoLayerId
> = {
  [MuseovirastoLayer.Muinaisjaannokset_piste]: 7,
  [MuseovirastoLayer.Muinaisjaannokset_alue]: 8,
  [MuseovirastoLayer.Suojellut_rakennukset_piste]: 2,
  [MuseovirastoLayer.Suojellut_rakennukset_alue]: 3,
  [MuseovirastoLayer.RKY_alue]: 4,
  [MuseovirastoLayer.RKY_piste]: 5,
  [MuseovirastoLayer.RKY_viiva]: 6,
  [MuseovirastoLayer.Maailmanperinto_piste]: 9,
  [MuseovirastoLayer.Maailmanperinto_alue]: 10
}

export type AhvenanmaaLayerId = 1 | 5

export const getAhvenanmaaLayerId = (
  layer: AhvenanmaaLayer
): AhvenanmaaLayerId => {
  switch (layer) {
    case AhvenanmaaLayer.Fornminnen:
      return 1
    case AhvenanmaaLayer.MaritimtKulturarv:
      return 5
  }
}

export type GtkLayerId =
  | 7
  | 8
  | 9
  | 11
  | 12
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25

export const getGtkLayerId = (layer: GtkLayer): GtkLayerId => {
  switch (layer) {
    /*
    case GtkLayer.kaikki:
      return 7
    case GtkLayer.kuroutumishavainnot:
      return 8
    case GtkLayer.rantahavainnot:
      return 9
    case GtkLayer.Isobaasit_ylin_ranta:
      return 11
    case GtkLayer.Isobaasit_litorina:
      return 12
    case GtkLayer.Jääjärvet_baltia:
      return 14
    case GtkLayer.Jääjärvet_ilomantsi:
      return 15
    case GtkLayer.Jääjärvet_pohjois_suomi:
      return 16
    case GtkLayer.Jääjärvet_pielinen:
      return 17
    case GtkLayer.Jääjärvet_saaminki:
      return 18
    case GtkLayer.Jääjärvet_sotkamo:
      return 19
      */
    case GtkLayer.muinaisrannat:
      return 20
    /*
    case GtkLayer.ylin_ranta_10m_korkeusmallista:
      return 21
    case GtkLayer.ylin_ranta_25m_korkeusmallista:
      return 22
    case GtkLayer.litorina_10m_korkeusmallista:
      return 23
    case GtkLayer.litorina_25m_korkeusmallista:
      return 24
    case GtkLayer.merialue:
      return 25
      */
  }
}

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

export type MuinaisjaannosLaji =
  | "kiinteä muinaisjäännös"
  | "muu kulttuuriperintökohde"

export type GeometryTypePoint = "esriGeometryPoint"
export type GeometryTypePolygon = "esriGeometryPolygon"
export type GeometryTypePolyline = "esriGeometryPolyline"
export type GeometryType =
  | GeometryTypePoint
  | GeometryTypePolygon
  | GeometryTypePolyline

interface PointGeometry {
  x: number
  y: number
}

interface PolygonGeometry {
  rings: Array<Array<[number, number]>>
}

interface PolylineGeometry {
  paths: Array<Array<[number, number]>>
}

/**
 * 3D models and Maiseman muisti supplemetary data for Argis search/identify feature
 */
interface ArgisFeatureSupplementaryData {
  models: Array<GeoJSONFeature<ModelFeatureProperties>>
  maisemanMuisti: Array<GeoJSONFeature<MaisemanMuistiFeatureProperties>>
}

export interface MuinaisjaannosPisteArgisFeature
  extends ArgisFeatureSupplementaryData {
  layerId: 9
  layerName: MuseovirastoLayer.Muinaisjaannokset_piste
  attributes: {
    OBJECTID: string // "38962";
    mjtunnus: string // "1279";
    inspireID: string // "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/1279_P38962";
    kohdenimi: string // "Melkki länsiranta";
    kunta: string // "Helsinki"
    laji: MuinaisjaannosLaji // "kiinteä muinaisjäännös";
    tyyppi: string // "alusten hylyt, kivirakenteet";
    ajoitus: string // "ei määritelty, keskiaikainen";
    alatyyppi: string // "hylyt (puu), hautakummut";
    vedenalainen: string // "k";
    muutospvm: string // "10.9.2015 13:07:24";
    luontipvm: string // "2.11.2001";
    paikannustapa: string // "Null";
    paikannustarkkuus: string // "Ohjeellinen (10 - 100 m)";
    selite: string // "Paikannettu Paanasalon ja Puomion raportin karttaliitteen (1994) mukaan";
    url: string // "www.kyppi.fi/to.aspx?id=112.1279";
    x: string // "382363.823";
    y: string // "6667893.676";
    Shape: string // "Point";
    /**
     * trimmed and splitted values for easier usage
     */
    tyyppiSplitted: Array<MuinaisjaannosTyyppi>
    ajoitusSplitted: Array<MuinaisjaannosAjoitus>
    alatyyppiSplitted: Array<string>
  }
  geometryType: GeometryTypePoint
  geometry: PointGeometry
}

export interface MuinaisjaannosAlueArgisFeature
  extends ArgisFeatureSupplementaryData {
  layerId: 10
  layerName: MuseovirastoLayer.Muinaisjaannokset_alue
  attributes: {
    OBJECTID: string // "9190";
    mjtunnus: string // "1000007642";
    inspireID: string // "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/1000007642_A9190";
    kohdenimi: string // "Tukikohta I:tie (Mustavuori)                                                                        ";
    kunta: string // "Helsinki                                                                                            ";
    laji: MuinaisjaannosLaji // "kiinteä muinaisjäännös                                                                              ";
    lähdetiedon_ajoitus: string // "1979";
    digipvm: string // "12.3.2007 15:02:19";
    digimk: string // "PerusCD";
    muutospvm: string // "18.3.2008 09:30:12";
    url: string // "www.kyppi.fi/to.aspx?id=112.1000007642";
    Shape: string // "Polygon";
  }
  geometryType: GeometryTypePolygon
  geometry: PolygonGeometry
}

export interface SuojellutRakennuksetPisteArgisFeature
  extends ArgisFeatureSupplementaryData {
  layerId: 2
  layerName: MuseovirastoLayer.Suojellut_rakennukset_piste
  attributes: {
    OBJECTID: string // "2843";
    kohdeID: string // "200928";
    rakennusID: string // "305349";
    inspireID: string // "http://paikkatiedot.fi/so/1000000/ps/ProtectedSite/305349_2843";
    vtj_prt: string // "103247805B               ";
    kohdenimi: string // "Meilahden kirkko";
    rakennusnimi: string // "Kirkko                                                                                              ";
    kunta: string // "Helsinki                                                                                            ";
    suojeluryhmä: string // "Kirkkolaki,  ,  ,  ";
    suojelun_tila: string // "Suojeltu                                                                                            ";
    url: string // "www.kyppi.fi/to.aspx?id=130.200928";
    x: string // "383802.548";
    y: string // "6674739.466";
    Shape: string // "Point";
  }
  geometryType: GeometryTypePoint
  geometry: PointGeometry
}

export interface SuojellutRakennuksetAlueArgisFeature
  extends ArgisFeatureSupplementaryData {
  layerId: 3
  layerName: MuseovirastoLayer.Suojellut_rakennukset_alue
  attributes: {
    OBJECTID: string // "2843";
    kohdeID: string // "200928";
    inspireID: string // "http://paikkatiedot.fi/so/1000000/ps/ProtectedSite/305349_2843";
    kohdenimi: string // "Meilahden kirkko";
    kunta: string // "Helsinki                                                                                            ";
    suojeluryhmä: string // "Kirkkolaki,  ,  ,  ";
    suojelun_tila: string // "Suojeltu                                                                                            ";
    url: string // "www.kyppi.fi/to.aspx?id=130.200928";
    Shape: string // "Polygon";
  }
  geometryType: GeometryTypePolygon
  geometry: PolygonGeometry
}

export interface RKYAlueArgisFeature extends ArgisFeatureSupplementaryData {
  layerId: 4
  layerName: MuseovirastoLayer.RKY_alue
  attributes: {
    OBJECTID: string // "1632";
    ID: string // "1570";
    inspireID: string // "http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/1570_A1632";
    kohdenimi: string // "Pääkaupunkiseudun I maailmansodan linnoitteet";
    nimi: string // "Itä-Villinki";
    url: string // "http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=1570";
    SHAPE: string // "Polygon";
  }
  geometryType: GeometryTypePolygon
  geometry: PolygonGeometry
}

export interface RKYPisteArgisFeature extends ArgisFeatureSupplementaryData {
  layerId: 5
  layerName: MuseovirastoLayer.RKY_piste
  attributes: {
    OBJECTID: string //"31";
    ID: string //"4255";
    inspireID: string //"http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/4255_P31";
    kohdenimi: string //"Struven astemittausketju";
    url: string //"http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=4255";
    Shape: string //"Point";
  }
  geometryType: GeometryTypePoint
  geometry: PointGeometry
}

export interface RKYViivaArgisFeature extends ArgisFeatureSupplementaryData {
  layerId: 6
  layerName: MuseovirastoLayer.RKY_viiva
  attributes: {
    OBJECTID: string //"69";
    ID: string //"2117";
    inspireID: string //"http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/2117_V69";
    kohdenimi: string //"Suuri Rantatie";
    url: string //"http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=2117";
    Shape: string //"Polyline";
  }
  geometryType: GeometryTypePolyline
  geometry: PolylineGeometry
}

export interface MaailmanperintoPisteArgisFeature
  extends ArgisFeatureSupplementaryData {
  layerId: 11
  layerName: MuseovirastoLayer.Maailmanperinto_piste
  attributes: {
    Shape: string // "Point";
    OBJECTID: string // "2";
    Nimi: string // "Struven ketju / Stuorrahanoaivi";
    URL: string // "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa#struve";
  }
  geometryType: GeometryTypePoint
  geometry: PointGeometry
}

export interface MaailmanperintoAlueArgisFeature
  extends ArgisFeatureSupplementaryData {
  layerId: 12
  layerName: MuseovirastoLayer.Maailmanperinto_alue
  attributes: {
    Shape: string // "Polygon";
    OBJECTID: string // "429";
    Nimi: string // "Suomenllinna";
    URL: string // "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa#suomenlinna";
    Alue: string // "Suoja-alue";
  }
  geometryType: GeometryTypePolygon
  geometry: PolygonGeometry
}

export interface AhvenanmaaTypeAndDatingFeatureProperties {
  FornID: string // "Jo 18.10"
  Typ: number | null // 3
  Und_typ: string | null // "fältbefästning"
  Typ_1: number | null // 6
  Undertyp: string | null // "1900-tal"
  Antal: number // 1
}

export interface AhvenanmaaForminnenArgisFeature
  extends ArgisFeatureSupplementaryData {
  layerId: 1
  layerName: AhvenanmaaLayer.Fornminnen
  attributes: {
    OBJECTID: string // "1401";
    "Fornlämnings ID": string // "Su 12.27";
    Namn: string // "Null";
    Beskrivning: string // "Null";
    Kommun: string // "Sund";
    By: string // "Kastelholm";
    Topografi: string // "Null";
    Registrering: string // "Null";
    Status: string // "Fast fornlämning";
    Shape: string // "Polygon";
    "Shape.STArea()": string // "2581,011841";
    "Shape.STLength()": string // "203,802335";
    /**
     * Fetched from separata data source in AhvenanmaaTileLayer
     * @see https://www.kartor.ax/datasets/fornminnen-typ-och-datering
     */
    typeAndDating?: Array<AhvenanmaaTypeAndDatingFeatureProperties>
  }
  geometryType: GeometryTypePolygon
  geometry: PolygonGeometry
}

export interface AhvenanmaaMaritimtKulturarvArgisFeature
  extends ArgisFeatureSupplementaryData {
  layerId: 5
  layerName: AhvenanmaaLayer.MaritimtKulturarv
  attributes: {
    OBJECTID: string //"482"
    FornID: string //"M1 Ha 443.2";
    Namn: string //"Okänt";
    Beskrivning: string //"Träfartyg, ev. en jakt. Vraket är beläget längst inne i vikbotten i den sk. Jakthamnen. Vraket mycket sönderbrutet av is- och sjögång. Enligt uppgift skall det röra sig om en slopad postjakt.";
    Kommun: string //"Hammarland";
    By: string //"Signildskär och Märket";
    Precision: string //"1:20 000";
    Lagrum: string //"2§ 1 mom Landskapslagen (2007:19) om skydd av det maritima kulturarvet";
    SHAPE: string //"Polygon";
  }

  geometryType: GeometryTypePolygon
  geometry: PolygonGeometry
}

export type ArgisFeature =
  | MuinaisjaannosPisteArgisFeature
  | MuinaisjaannosAlueArgisFeature
  | SuojellutRakennuksetPisteArgisFeature
  | SuojellutRakennuksetAlueArgisFeature
  | RKYAlueArgisFeature
  | RKYPisteArgisFeature
  | RKYViivaArgisFeature
  | MaailmanperintoPisteArgisFeature
  | MaailmanperintoAlueArgisFeature
  | AhvenanmaaForminnenArgisFeature
  | AhvenanmaaMaritimtKulturarvArgisFeature

export type ArgisFeatureLayer = MuseovirastoLayer | AhvenanmaaLayer

export interface ArgisIdentifyResult<T = ArgisFeature> {
  results: Array<T>
}

export interface ArgisFindResult {
  results: Array<ArgisFeature>
}

export interface DataLatestUpdateDates {
  museovirasto: Date | null
  ahvenanmaaForminnen: Date | null
  ahvenanmaaMaritimtKulturarv: Date | null
  models: Date | null
}

export interface ModelFeatureProperties {
  registryItem: {
    name: string
    id: string | number
    type: MuseovirastoLayer | AhvenanmaaLayer
    url: string
    municipality: string
  }
  model: {
    name: string
    url: string
  }
  author: string
  authorUrl: string
  licence: string
  licenceUrl: string
  createdDate: string
}

export interface MaisemanMuistiFeatureProperties {
  id: number
  number: number
  name: string
  municipality: string
  region: string
  registerName: string
  type: string
  subtype: string
  dating: MuinaisjaannosAjoitus
}

type GeoJSONPointGeometry = {
  type: "Point"
  coordinates: [number, number]
}

type GeoJSONPolygonGeometry = {
  type: "Polygon"
  coordinates: Array<Array<[number, number]>>
}

export type GeoJSONFeature<PROPERTIES> = {
  type: "Feature"
  geometry: GeoJSONPointGeometry | GeoJSONPolygonGeometry
  properties: PROPERTIES
}

export type GeoJSONResponse<PROPERTIES> = {
  type: "FeatureCollection"
  features: Array<GeoJSONFeature<PROPERTIES>>
}

export type WmsGeometryPoint = {
  type: "Point"
  coordinates: [number, number]
}

export type WmsGeometryLineString = {
  type: "LineString"
  coordinates: Array<[number, number]>
}

export type WmsGeometryPolygon = {
  type: "Polygon"
  coordinates: Array<[number, number]>
}

export type WmsGeometry =
  | WmsGeometryPoint
  | WmsGeometryLineString
  | WmsGeometryPolygon

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

export type MaalinnoitusYksikkoFeature = {
  type: "Feature"
  id: string // "Maalinnoitus_yksikot.444"
  geometry: WmsGeometry
  geometry_name: "geom"
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

export type MaalinnoitusKohdeFeature = {
  type: "Feature"
  id: string // "Maalinnoitus_kohteet.25625"
  geometry: WmsGeometry
  geometry_name: "geom"
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

export type MaalinnoitusRajausFeature = {
  type: "Feature"
  id: string // "Maalinnoitus_rajaukset.26516"
  geometry: WmsGeometry
  geometry_name: "geom"
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

export type MaalinnoitusKarttatekstiFeature = {
  type: "Feature"
  id: string // "Maalinnoitus_karttatekstit.764"
  geometry: WmsGeometry
  geometry_name: "geom"
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
export type MaalinnoitusFeature =
  | MaalinnoitusYksikkoFeature
  | MaalinnoitusKohdeFeature
  | MaalinnoitusRajausFeature
  | MaalinnoitusKarttatekstiFeature

export type MaalinnoitusWmsFeatureInfoResult = {
  type: "FeatureCollection"
  features: Array<MaalinnoitusFeature>
  totalFeatures: "unknown"
  numberReturned: number
  timeStamp: string // "2021-02-28T18:56:20.579Z"
  crs: {
    type: "name"
    properties: {
      name: "urn:ogc:def:crs:EPSG::3067"
    }
  }
}

export const isMaalinnoitusYksikkoFeature = (
  feature: MaalinnoitusFeature
): feature is MaalinnoitusYksikkoFeature =>
  feature.id.startsWith("Maalinnoitus_yksikot.")

export const isMaalinnoitusKohdeFeature = (
  feature: MaalinnoitusFeature
): feature is MaalinnoitusKohdeFeature =>
  feature.id.startsWith("Maalinnoitus_kohteet.")

export const isMaalinnoitusRajausFeature = (
  feature: MaalinnoitusFeature
): feature is MaalinnoitusRajausFeature =>
  feature.id.startsWith("Maalinnoitus_rajaukset.")

export const isMaalinnoitusKarttatekstiFeature = (
  feature: MaalinnoitusFeature
): feature is MaalinnoitusKarttatekstiFeature =>
  feature.id.startsWith("Maalinnoitus_karttatekstit.")
