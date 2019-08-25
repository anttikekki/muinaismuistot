export enum MaanmittauslaitosLayer {
  Maastokartta = "maastokartta",
  Taustakartta = "taustakartta",
  Ortokuva = "ortokuva"
}

export enum MuseovirastoLayer {
  Muinaisjäännökset_piste = "Muinaisjäännökset_piste",
  Muinaisjäännökset_alue = "Muinaisjäännökset_alue",
  Suojellut_rakennukset_piste = "Suojellut_rakennukset_piste",
  Suojellut_rakennukset_alue = "Suojellut_rakennukset_alue",
  RKY_alue = "RKY_alue",
  RKY_piste = "RKY_piste",
  RKY_viiva = "RKY_viiva",
  Maailmanperintö_piste = "Maailmanperintö_piste",
  Maailmanperintö_alue = "Maailmanperintö_alue"
}

export type MuseovirastoLayerId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const museovirastoLayerIdMap: Record<
  MuseovirastoLayer,
  MuseovirastoLayerId
> = {
  [MuseovirastoLayer.Muinaisjäännökset_piste]: 0,
  [MuseovirastoLayer.Muinaisjäännökset_alue]: 1,
  [MuseovirastoLayer.Suojellut_rakennukset_piste]: 2,
  [MuseovirastoLayer.Suojellut_rakennukset_alue]: 3,
  [MuseovirastoLayer.RKY_alue]: 4,
  [MuseovirastoLayer.RKY_piste]: 5,
  [MuseovirastoLayer.RKY_viiva]: 6,
  [MuseovirastoLayer.Maailmanperintö_piste]: 7,
  [MuseovirastoLayer.Maailmanperintö_alue]: 8
};

export type MuinaisjaannosTyyppi =
  | "ei määritelty"
  | "alusten hylyt"
  | "asuinpaikat"
  | "hautapaikat"
  | "kirkkorakenteet"
  | "kivirakenteet"
  | "kulkuväylät"
  | "kultti- ja tarinapaikat"
  | "luonnonmuodostumat"
  | "löytöpaikat"
  | "maarakenteet"
  | "muinaisjäännösryhmät"
  | "puolustusvarustukset"
  | "puurakenteet"
  | "raaka-aineen hankintapaikat"
  | "taide, muistomerkit"
  | "tapahtumapaikat"
  | "teollisuuskohteet"
  | "työ- ja valmistuspaikat";

export const muinaisjaannosTyyppiAllValues: ReadonlyArray<
  MuinaisjaannosTyyppi
> = [
  "ei määritelty",
  "alusten hylyt",
  "asuinpaikat",
  "hautapaikat",
  "kirkkorakenteet",
  "kivirakenteet",
  "kulkuväylät",
  "kultti- ja tarinapaikat",
  "luonnonmuodostumat",
  "löytöpaikat",
  "maarakenteet",
  "muinaisjäännösryhmät",
  "puolustusvarustukset",
  "puurakenteet",
  "raaka-aineen hankintapaikat",
  "taide, muistomerkit",
  "tapahtumapaikat",
  "teollisuuskohteet",
  "työ- ja valmistuspaikat"
];

export type MuinaisjaannosAjoitus =
  | "moniperiodinen"
  | "esihistoriallinen"
  | "kivikautinen"
  | "varhaismetallikautinen"
  | "pronssikautinen"
  | "rautakautinen"
  | "keskiaikainen"
  | "historiallinen"
  | "moderni"
  | "ajoittamaton"
  | "ei määritelty";

export const muinaisjaannosAjoitusAllValues: ReadonlyArray<
  MuinaisjaannosAjoitus
> = [
  "moniperiodinen",
  "esihistoriallinen",
  "kivikautinen",
  "varhaismetallikautinen",
  "pronssikautinen",
  "rautakautinen",
  "keskiaikainen",
  "historiallinen",
  "moderni",
  "ajoittamaton",
  "ei määritelty"
];

export interface ArgisFeature {}

export interface ArgisIdentifyResult {
  results: Array<ArgisFeature>;
}
