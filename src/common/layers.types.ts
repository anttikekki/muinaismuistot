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
  Muinaisjaannokset_piste = "rajapinta:muinaisjaannos_piste",
  Muinaisjaannokset_alue = "rajapinta_suojellut:muinaisjaannos_alue",
  Suojellut_rakennukset_piste = "rajapinta_suojellut:suojellut_rakennukset_piste",
  Suojellut_rakennukset_alue = "rajapinta_suojellut:suojellut_rakennukset_alue",
  RKY_alue = "rajapinta_suojellut:rky_alue",
  RKY_piste = "rajapinta_suojellut:rky_piste",
  RKY_viiva = "rajapinta_suojellut:rky_viiva",
  Maailmanperinto_piste = "rajapinta_suojellut:maailmanperinto_piste",
  Maailmanperinto_alue = "rajapinta_suojellut:maailmanperinto_alue"
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
