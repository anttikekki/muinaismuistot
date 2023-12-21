import { FeatureSupplementaryData } from "./featureSupplementaryData.types"
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

export type MuinaisjaannosLaji =
  | "kiinteä muinaisjäännös"
  | "muu kulttuuriperintökohde"

export interface MuinaisjaannosPisteWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature<
      `muinaisjaannos_piste.${number}`,
      {
        OBJECTID: number // 38962;
        mjtunnus: number // 1279;
        inspireID: string // "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/1279_P38962";
        kohdenimi: string // "Melkki länsiranta";
        kunta: string // "Helsinki"
        laji: MuinaisjaannosLaji // "kiinteä muinaisjäännös";
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
        tyyppiSplitted: Array<MuinaisjaannosTyyppi>
        ajoitusSplitted: Array<MuinaisjaannosAjoitus>
        alatyyppiSplitted: Array<string>
      }
    > {}

export interface MuinaisjaannosAlueWmsFeature
  extends FeatureSupplementaryData,
    WmsFeature<
      `muinaisjaannos_alue.${number}`,
      {
        OBJECTID: number // 9190
        mjtunnus: number // 1000007642
        inspireID: string // "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/1000007642_A9190";
        kohdenimi: string // "Tukikohta I:tie (Mustavuori)                                                                        ";
        kunta: string // "Helsinki                                                                                            ";
        laji: MuinaisjaannosLaji // "kiinteä muinaisjäännös                                                                              ";
        lähdetiedon_ajoitus: string // "1979";
        digipvm: string // "12.3.2007 15:02:19";
        digimk: string // "PerusCD";
        Muutospvm: string // "18.3.2008 09:30:12";
        url: string // "https://www.museoverkko.fi/netsovellus/esri/broker.aspx?taulu=mjreki.dbo.T_KOHDE&tunnus=1000001634"
      }
    > {}

export interface SuojellutRakennuksetPisteArgisFeature
  extends FeatureSupplementaryData {
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
  extends FeatureSupplementaryData {
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

export interface RKYAlueArgisFeature extends FeatureSupplementaryData {
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

export interface RKYPisteArgisFeature extends FeatureSupplementaryData {
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

export interface RKYViivaArgisFeature extends FeatureSupplementaryData {
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
  extends FeatureSupplementaryData {
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
  extends FeatureSupplementaryData {
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

export type MuseovirastoWmsFeature =
  | MuinaisjaannosPisteWmsFeature
  | MuinaisjaannosAlueWmsFeature
  | SuojellutRakennuksetPisteArgisFeature
  | SuojellutRakennuksetAlueArgisFeature
  | RKYAlueArgisFeature
  | RKYPisteArgisFeature
  | RKYViivaArgisFeature
  | MaailmanperintoPisteArgisFeature
  | MaailmanperintoAlueArgisFeature

export type MuseovirastoWmsFeatureInfoResult =
  WmsFeatureInfoResult<MuseovirastoWmsFeature>

export type MuseovirastoFindResult =
  WmsFeatureInfoResult<MuseovirastoWmsFeature>
