export interface Settings {
  maanmittauslaitos: {
    selectedLayer: MaanmittauslaitosLayer;
    url: {
      WMTSCapabilities: string;
    };
  };
  museovirasto: {
    selectedLayers: Array<MuseovirastoLayer>;
    selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>;
    selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>;
    url: {
      export: string;
      identify: string;
      find: string;
      updateDate: string;
    };
  };
  ahvenanmaa: {
    selectedLayers: Array<AhvenanmaaLayer>;
    url: {
      export: string;
      identify: string;
      find: string;
      forminnenUpdateDate: string;
      maritimtKulturarvUpdateDate: string;
    };
  };
  models: {
    selectedLayers: Array<ModelLayer>;
    url: {
      geojson: string;
    };
  };
}

export enum LayerGroup {
  Maanmittauslaitos = "Maanmittauslaitos",
  Museovirasto = "Museovirasto",
  Ahvenanmaa = "Ahvenanmaa",
  Models = "Models",
}

export enum MaanmittauslaitosLayer {
  Maastokartta = "maastokartta",
  Taustakartta = "taustakartta",
  Ortokuva = "ortokuva",
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
  Maailmanperinto_alue = "Maailmanperinto_alue",
}

export enum AhvenanmaaLayer {
  Fornminnen = "Fornminnen",
  MaritimtKulturarv = "Maritimt kulturarv; Vrak",
}

export enum ModelLayer {
  ModelLayer = "ModelLayer",
}

export type FeatureLayer = MuseovirastoLayer | AhvenanmaaLayer | ModelLayer;

export type MuseovirastoLayerId = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

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
  [MuseovirastoLayer.Maailmanperinto_alue]: 10,
};

export type AhvenanmaaLayerId = 1 | 5;

export const getAhvenanmaaLayerId = (
  layer: AhvenanmaaLayer
): AhvenanmaaLayerId => {
  switch (layer) {
    case AhvenanmaaLayer.Fornminnen:
      return 1;
    case AhvenanmaaLayer.MaritimtKulturarv:
      return 5;
  }
};

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
  taideMuistomerkit = "taide, muistomerkit",
  tapahtumapaikat = "tapahtumapaikat",
  teollisuuskohteet = "teollisuuskohteet",
  työJaValmistuspaikat = "työ- ja valmistuspaikat",
}

export enum MuinaisjaannosAjoitus {
  moniperiodinen = "moniperiodinen",
  esihistoriallinen = "esihistoriallinen",
  kivikautinen = "kivikautinen",
  varhaismetallikautinen = "varhaismetallikautinen",
  pronssikautinen = "pronssikautinen",
  rautakautinen = "rautakautinen",
  keskiaikainen = "keskiaikainen",
  historiallinen = "historiallinen",
  moderni = "moderni",
  ajoittamaton = "ajoittamaton",
  eiMääritelty = "ei määritelty",
}

export const MuinaisjaannosAjoitusTimespan: Record<
  MuinaisjaannosAjoitus,
  string
> = {
  moniperiodinen: "",
  esihistoriallinen: "8600 eaa. - 1200 jaa.",
  kivikautinen: "8600 – 1500 eaa.",
  varhaismetallikautinen: "1500 eaa. - 200 jaa.",
  pronssikautinen: "1700 – 500 eaa.",
  rautakautinen: "500 eaa. - 1200 jaa.",
  keskiaikainen: "1200 - 1570 jaa.",
  historiallinen: "1200 jaa. -",
  moderni: "1800 jaa -",
  ajoittamaton: "",
  "ei määritelty": "",
};

/**
 * @deprecated kartor.ax does not return timing field anymore
 */
export type ForminnenAjoitus =
  | "Stenålder"
  | "Bronsålder"
  | "Brons/Ä järnålder"
  | "Äldre järnålder"
  | "Yngre järnålder"
  | "Järnålder"
  | "Järnålder/Medeltid"
  | "Medeltida"
  | "Sentida";

/**
 * @deprecated kartor.ax does not return timing field anymore
 */
export const ForminnenAjoitusTimespan: Record<ForminnenAjoitus, string> = {
  Stenålder: "8600–1500 eaa.",
  Bronsålder: "1700 – 500 eaa.",
  "Brons/Ä järnålder": "1700 eaa. – 1200 jaa.",
  "Äldre järnålder": "500 eaa. – 400 jaa.",
  "Yngre järnålder": "800 – 1200 jaa.",
  Järnålder: "500 eaa. - 1200 jaa.",
  "Järnålder/Medeltid": "500 eaa. – 1570 jaa.",
  Medeltida: "1200 - 1570 jaa.",
  Sentida: "1570 jaa. -",
};

export type MuinaisjaannosLaji =
  | "kiinteä muinaisjäännös"
  | "muu kulttuuriperintökohde";

export type GeometryTypePoint = "esriGeometryPoint";
export type GeometryTypePolygon = "esriGeometryPolygon";
export type GeometryTypePolyline = "esriGeometryPolyline";
export type GeometryType =
  | GeometryTypePoint
  | GeometryTypePolygon
  | GeometryTypePolyline;

interface PointGeometry {
  x: number;
  y: number;
}

interface PolygonGeometry {
  rings: Array<Array<[number, number]>>;
}

interface PolylineGeometry {
  paths: Array<Array<[number, number]>>;
}

export interface MuinaisjaannosPisteArgisFeature {
  layerId: 9;
  layerName: MuseovirastoLayer.Muinaisjaannokset_piste;
  attributes: {
    OBJECTID: string; // "38962";
    mjtunnus: string; // "1279";
    inspireID: string; // "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/1279_P38962";
    kohdenimi: string; // "Melkki länsiranta";
    kunta: string; // "Helsinki"
    laji: MuinaisjaannosLaji; // "kiinteä muinaisjäännös";
    tyyppi: MuinaisjaannosTyyppi; // "alusten hylyt";
    ajoitus: MuinaisjaannosAjoitus; // "ei määritelty";
    alatyyppi: string; // "hylyt (puu)";
    vedenalainen: string; // "k";
    muutospvm: string; // "10.9.2015 13:07:24";
    luontipvm: string; // "2.11.2001";
    paikannustapa: string; // "Null";
    paikannustarkkuus: string; // "Ohjeellinen (10 - 100 m)";
    selite: string; // "Paikannettu Paanasalon ja Puomion raportin karttaliitteen (1994) mukaan";
    url: string; // "www.kyppi.fi/to.aspx?id=112.1279";
    x: string; // "382363.823";
    y: string; // "6667893.676";
    Shape: string; // "Point";
  };
  geometryType: GeometryTypePoint;
  geometry: PointGeometry;
}

export interface MuinaisjaannosAlueArgisFeature {
  layerId: 10;
  layerName: MuseovirastoLayer.Muinaisjaannokset_alue;
  attributes: {
    OBJECTID: string; // "9190";
    mjtunnus: string; // "1000007642";
    inspireID: string; // "http://paikkatiedot.fi/so/1000272/ps/ProtectedSite/1000007642_A9190";
    kohdenimi: string; // "Tukikohta I:tie (Mustavuori)                                                                        ";
    kunta: string; // "Helsinki                                                                                            ";
    laji: MuinaisjaannosLaji; // "kiinteä muinaisjäännös                                                                              ";
    lähdetiedon_ajoitus: string; // "1979";
    digipvm: string; // "12.3.2007 15:02:19";
    digimk: string; // "PerusCD";
    muutospvm: string; // "18.3.2008 09:30:12";
    url: string; // "www.kyppi.fi/to.aspx?id=112.1000007642";
    Shape: string; // "Polygon";
  };
  geometryType: GeometryTypePolygon;
  geometry: PolygonGeometry;
}

export interface SuojellutRakennuksetPisteArgisFeature {
  layerId: 2;
  layerName: MuseovirastoLayer.Suojellut_rakennukset_piste;
  attributes: {
    OBJECTID: string; // "2843";
    kohdeID: string; // "200928";
    rakennusID: string; // "305349";
    inspireID: string; // "http://paikkatiedot.fi/so/1000000/ps/ProtectedSite/305349_2843";
    vtj_prt: string; // "103247805B               ";
    kohdenimi: string; // "Meilahden kirkko";
    rakennusnimi: string; // "Kirkko                                                                                              ";
    kunta: string; // "Helsinki                                                                                            ";
    suojeluryhmä: string; // "Kirkkolaki,  ,  ,  ";
    suojelun_tila: string; // "Suojeltu                                                                                            ";
    url: string; // "www.kyppi.fi/to.aspx?id=130.200928";
    x: string; // "383802.548";
    y: string; // "6674739.466";
    Shape: string; // "Point";
  };
  geometryType: GeometryTypePoint;
  geometry: PointGeometry;
}

export interface SuojellutRakennuksetAlueArgisFeature {
  layerId: 3;
  layerName: MuseovirastoLayer.Suojellut_rakennukset_alue;
  attributes: {
    OBJECTID: string; // "2843";
    kohdeID: string; // "200928";
    inspireID: string; // "http://paikkatiedot.fi/so/1000000/ps/ProtectedSite/305349_2843";
    kohdenimi: string; // "Meilahden kirkko";
    kunta: string; // "Helsinki                                                                                            ";
    suojeluryhmä: string; // "Kirkkolaki,  ,  ,  ";
    suojelun_tila: string; // "Suojeltu                                                                                            ";
    url: string; // "www.kyppi.fi/to.aspx?id=130.200928";
    Shape: string; // "Polygon";
  };
  geometryType: GeometryTypePolygon;
  geometry: PolygonGeometry;
}

export interface RKYAlueArgisFeature {
  layerId: 4;
  layerName: MuseovirastoLayer.RKY_alue;
  attributes: {
    OBJECTID: string; // "1632";
    ID: string; // "1570";
    inspireID: string; // "http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/1570_A1632";
    kohdenimi: string; // "Pääkaupunkiseudun I maailmansodan linnoitteet";
    nimi: string; // "Itä-Villinki";
    url: string; // "http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=1570";
    SHAPE: string; // "Polygon";
  };
  geometryType: GeometryTypePolygon;
  geometry: PolygonGeometry;
}

export interface RKYPisteArgisFeature {
  layerId: 5;
  layerName: MuseovirastoLayer.RKY_piste;
  attributes: {
    OBJECTID: string; //"31";
    ID: string; //"4255";
    inspireID: string; //"http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/4255_P31";
    kohdenimi: string; //"Struven astemittausketju";
    url: string; //"http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=4255";
    Shape: string; //"Point";
  };
  geometryType: GeometryTypePoint;
  geometry: PointGeometry;
}

export interface RKYViivaArgisFeature {
  layerId: 6;
  layerName: MuseovirastoLayer.RKY_viiva;
  attributes: {
    OBJECTID: string; //"69";
    ID: string; //"2117";
    inspireID: string; //"http://paikkatiedot.fi/so/1000034/ps/ProtectedSite/2117_V69";
    kohdenimi: string; //"Suuri Rantatie";
    url: string; //"http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=2117";
    Shape: string; //"Polyline";
  };
  geometryType: GeometryTypePolyline;
  geometry: PolylineGeometry;
}

export interface MaailmanperintoPisteArgisFeature {
  layerId: 11;
  layerName: MuseovirastoLayer.Maailmanperinto_piste;
  attributes: {
    Shape: string; // "Point";
    OBJECTID: string; // "2";
    Nimi: string; // "Struven ketju / Stuorrahanoaivi";
    URL: string; // "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa#struve";
  };
  geometryType: GeometryTypePoint;
  geometry: PointGeometry;
}

export interface MaailmanperintoAlueArgisFeature {
  layerId: 12;
  layerName: MuseovirastoLayer.Maailmanperinto_alue;
  attributes: {
    Shape: string; // "Polygon";
    OBJECTID: string; // "429";
    Nimi: string; // "Suomenllinna";
    URL: string; // "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa#suomenlinna";
    Alue: string; // "Suoja-alue";
  };
  geometryType: GeometryTypePolygon;
  geometry: PolygonGeometry;
}

export interface AhvenanmaaForminnenArgisFeature {
  layerId: 1;
  layerName: AhvenanmaaLayer.Fornminnen;
  attributes: {
    OBJECTID: string; // "1401";
    "Fornlämnings ID": string; // "Su 12.27";
    Namn: string; // "Null";
    Beskrivning: string; // "Null";
    Kommun: string; // "Sund";
    By: string; // "Kastelholm";
    Topografi: string; // "Null";
    Registrering: string; // "Null";
    Status: string; // "Fast fornlämning";
    Shape: string; // "Polygon";
    "Shape.STArea()": string; // "2581,011841";
    "Shape.STLength()": string; // "203,802335";
  };
  geometryType: GeometryTypePolygon;
  geometry: PolygonGeometry;
}

export interface AhvenanmaaMaritimtKulturarvArgisFeature {
  layerId: 5;
  layerName: AhvenanmaaLayer.MaritimtKulturarv;
  attributes: {
    OBJECTID: string; //"482"
    FornID: string; //"M1 Ha 443.2";
    Namn: string; //"Okänt";
    Beskrivning: string; //"Träfartyg, ev. en jakt. Vraket är beläget längst inne i vikbotten i den sk. Jakthamnen. Vraket mycket sönderbrutet av is- och sjögång. Enligt uppgift skall det röra sig om en slopad postjakt.";
    Kommun: string; //"Hammarland";
    By: string; //"Signildskär och Märket";
    Precision: string; //"1:20 000";
    Lagrum: string; //"2§ 1 mom Landskapslagen (2007:19) om skydd av det maritima kulturarvet";
    SHAPE: string; //"Polygon";
  };

  geometryType: GeometryTypePolygon;
  geometry: PolygonGeometry;
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
  | AhvenanmaaMaritimtKulturarvArgisFeature;

export interface ArgisIdentifyResult {
  results: Array<ArgisFeature>;
}

export interface ArgisFindResult {
  results: Array<ArgisFeature>;
}

export interface DataLatestUpdateDates {
  museovirasto: Date | null;
  ahvenanmaaForminnen: Date | null;
  ahvenanmaaMaritimtKulturarv: Date | null;
  models: Date | null;
}

export interface Model {
  registryItem: {
    name: string;
    id: number;
    type: MuseovirastoLayer | AhvenanmaaLayer;
    url: string;
    municipality: string;
  };
  model: {
    name: string;
    url: string;
  };
  author: string;
  authorUrl: string;
  licence: string;
  licenceUrl: string;
  createdDate: string;
}

type GeoJSONPointGeometry = {
  type: "Point";
  coordinates: [number, number];
};

type GeoJSONPolygonGeometry = {
  type: "Polygon";
  coordinates: Array<Array<[number, number]>>;
};

export type GeoJSONFeature = {
  type: "Feature";
  geometry: GeoJSONPointGeometry | GeoJSONPolygonGeometry;
  properties: Model;
};

export type GeoJSONResponse = {
  type: "FeatureCollection";
  features: Array<GeoJSONFeature>;
};
