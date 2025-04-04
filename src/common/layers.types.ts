export enum Language {
  FI = "fi",
  SV = "sv"
}

export enum LayerGroup {
  Maanmittauslaitos = "Maanmittauslaitos",
  MaanmittauslaitosVanhatKartat = "MaanmittauslaitosVanhatKartat",
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

export enum MaanmittauslaitosVanhatKartatLayer {
  Venäläinen_topografinen_kartta_1871_1919 = "mml_ven_topo_21k_1871_1919",
  Venäläinen_topografinen_kartta_1870_1944 = "mml_ven_topo_42k_1870_1944",
  Venäläinen_topografinen_kartta_192x = "mml_ven_topo_42k_192x",
  Venäläinen_topografinen_kartta_1916_1917 = "mml_ven_topo_84k_1916-1917",
  Yleiskartta_1863_1879 = "mml_yleiskartta_400k_1863-1879",
  Yleiskartta_1880_1899 = "mml_yleiskartta_400k_1880-1899",
  Yleiskartta_1900_1919 = "mml_yleiskartta_400k_1900-1919",
  Yleiskartta_1920_1939 = "mml_yleiskartta_400k_1920-1939",
  Yleiskartta_1940_1972 = "mml_yleiskartta_400k_1940-1972",
  Yleiskartta_1954_1975 = "mml_yleiskartta_400k_1954-1975",
  Yleiskartta_1983_1992 = "mml_yleiskartta_400k_1983-1992",
  Yleiskartta_1996 = "mml_yleiskartta_500k_1996",
  Yleiskartta_2000 = "mml_yleiskartta_500k_2000",
  Pitäjäkartta_1912_1968 = "mml_pitajakartta_20k_1912-1968",
  Taloudellinen_kartta_1911_1970 = "mml_taloudellinen_100k_1911-1970",
  Maasto_perus_topografinen_kartta_100k_1928_1947 = "mml_topo_100k_1928_1947",
  Maasto_perus_topografinen_kartta_100k_1948_1989 = "mml_topo_100k_1948_1989",
  Maasto_perus_topografinen_kartta_20k_1924_1948 = "mml_topo_20k_1924-1948",
  Maasto_perus_topografinen_kartta_20k_1947_1959 = "mml_topo_20k_1947-1959",
  Maasto_perus_topografinen_kartta_20k_1960_1969 = "mml_topo_20k_1960-1969",
  Maasto_perus_topografinen_kartta_20k_1970_1979 = "mml_topo_20k_1970-1979",
  Maasto_perus_topografinen_kartta_20k_1980_1997 = "mml_topo_20k_1980-1997",
  Maasto_perus_topografinen_kartta_50k_1922_1946 = "mml_topo_50k_1922-1946",
  Maasto_perus_topografinen_kartta_50k_1964_2006 = "mml_topo_50k_1964-2006",
  Maasto_perus_topografinen_kartta_50k_2005_2020 = "mml_topo_50k_2005-2020"
}

export enum MuseovirastoLayer {
  Muinaisjaannokset_piste = "rajapinta_suojellut:muinaisjaannos_piste",
  Muinaisjaannokset_alue = "rajapinta_suojellut:muinaisjaannos_alue",
  Suojellut_rakennukset_piste = "rajapinta_suojellut:suojellut_rakennukset_piste",
  Suojellut_rakennukset_alue = "rajapinta_suojellut:suojellut_rakennukset_alue",
  RKY_alue = "rajapinta_suojellut:rky_alue",
  RKY_piste = "rajapinta_suojellut:rky_piste",
  RKY_viiva = "rajapinta_suojellut:rky_viiva",
  Maailmanperinto_piste = "rajapinta_suojellut:maailmanperinto_piste",
  Maailmanperinto_alue = "rajapinta_suojellut:maailmanperinto_alue",
  Muu_kulttuuriperintokohde_alue = "rajapinta_suojellut:muu_kulttuuriperintokohde_alue",
  Muu_kulttuuriperintokohde_piste = "rajapinta_suojellut:muu_kulttuuriperintokohde_piste"
}

export enum AhvenanmaaLayer {
  Fornminnen = "Fornminnen",
  MaritimaFornminnen = "Maritima fornminnen"
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
