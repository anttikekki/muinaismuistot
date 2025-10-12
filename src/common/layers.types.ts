export enum Language {
  FI = "fi",
  SV = "sv"
}

export enum LayerGroup {
  MMLPohjakartta = "MMLPohjakartta",
  MMLVanhatKartat = "MMLVanhatKartat",
  GTK = "GTK",
  MaannousuInfo = "MaannousuInfo",
  Museovirasto = "Museovirasto",
  Ahvenanmaa = "Ahvenanmaa",
  Helsinki = "Helsinki",
  Models = "Models",
  MaisemanMuisti = "MaisemanMuisti",
  Viabundus = "Viabundus"
}

export enum MMLPohjakarttaLayer {
  Maastokartta = "maastokartta",
  Taustakartta = "taustakartta",
  Ortokuva = "ortokuva",
  Korkeusmalli25m = "mml_korkeusmalli_25m_2000"
}

export enum MMLVanhatKartatLayer {
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

export enum MaannousuInfoLayer {
  Vuosi10000eaa = "-10000",
  Vuosi9750eaa = "-9750",
  Vuosi9500eaa = "-9500",
  Vuosi9250eaa = "-9250",
  Vuosi9000eaa = "-9000",
  Vuosi8750eaa = "-8750",
  Vuosi8500eaa = "-8500",
  Vuosi8250eaa = "-8250",
  Vuosi8000eaa = "-8000",
  Vuosi7750eaa = "-7750",
  Vuosi7500eaa = "-7500",
  Vuosi7250eaa = "-7250",
  Vuosi7000eaa = "-7000",
  Vuosi6750eaa = "-6750",
  Vuosi6500eaa = "-6500",
  Vuosi6250eaa = "-6250",
  Vuosi6000eaa = "-6000",
  Vuosi5750eaa = "-5750",
  Vuosi5500eaa = "-5500",
  Vuosi5250eaa = "-5250",
  Vuosi5000eaa = "-5000",
  Vuosi4750eaa = "-4750",
  Vuosi4500eaa = "-4500",
  Vuosi4250eaa = "-4250",
  Vuosi4000eaa = "-4000",
  Vuosi3750eaa = "-3750",
  Vuosi3500eaa = "-3500",
  Vuosi3250eaa = "-3250",
  Vuosi3000eaa = "-3000",
  Vuosi2750eaa = "-2750",
  Vuosi2500eaa = "-2500",
  Vuosi2250eaa = "-2250",
  Vuosi2000eaa = "-2000",
  Vuosi1750eaa = "-1750",
  Vuosi1500eaa = "-1500",
  Vuosi1400eaa = "-1400",
  Vuosi1300eaa = "-1300",
  Vuosi1200eaa = "-1200",
  Vuosi1100eaa = "-1100",
  Vuosi1000eaa = "-1000",
  Vuosi900eaa = "-900",
  Vuosi800eaa = "-800",
  Vuosi700eaa = "-700",
  Vuosi600eaa = "-600",
  Vuosi500eaa = "-500",
  Vuosi400eaa = "-400",
  Vuosi300eaa = "-300",
  Vuosi200eaa = "-200",
  Vuosi100eaa = "-100",
  Vuosi0eaa = "0",
  Vuosi100aa = "100",
  Vuosi200aa = "200",
  Vuosi300aa = "300",
  Vuosi400aa = "400",
  Vuosi500aa = "500",
  Vuosi600aa = "600",
  Vuosi700aa = "700",
  Vuosi800aa = "800",
  Vuosi900aa = "900",
  Vuosi1000aa = "1000",
  Vuosi1100aa = "1100",
  Vuosi1200aa = "1200",
  Vuosi1300aa = "1300",
  Vuosi1400aa = "1400",
  Vuosi1500aa = "1500",
  Vuosi1600aa = "1600",
  Vuosi1700aa = "1700",
  Vuosi1800aa = "1800",
  Vuosi1900aa = "1900"
}

export enum MaannousuInfoGlacialLayer {
  Vuosi10000eaa = "-10000",
  Vuosi9750eaa = "-9750",
  Vuosi9500eaa = "-9500",
  Vuosi9250eaa = "-9250",
  Vuosi9000eaa = "-9000",
  Vuosi8750eaa = "-8750",
  Vuosi8500eaa = "-8500",
  Vuosi8250eaa = "-8250"
}

export enum MaannousuInfoLayerIndex {
  Top = "top",
  Bottom = "bottom"
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
  Muu_kulttuuriperintokohde_piste = "rajapinta_suojellut:muu_kulttuuriperintokohde_piste",
  VARK_alueet = "rajapinta_suojellut:vark_alueet",
  VARK_pisteet = "rajapinta_suojellut:vark_pisteet",
  Löytöpaikka_piste = "rajapinta:rajapinta_loytopaikka_piste",
  Löytöpaikka_alue = "rajapinta:rajapinta_loytopaikka_alue",
  Alakohde_piste = "rajapinta:alakohde_piste",
  Havaintokohde_piste = "rajapinta:rajapinta_havaintokohde_piste",
  Havaintokohde_alue = "rajapinta:rajapinta_havaintokohde_alue",
  Luonnonmuodostuma_piste = "rajapinta:rajapinta_luonnonmuodostuma_piste",
  Luonnonmuodostuma_alue = "rajapinta:rajapinta_luonnonmuodostuma_alue",
  Mahdollinen_muinaisjäännös_piste = "rajapinta:rajapinta_mahdollinen_muinaisjaannos_piste",
  Mahdollinen_muinaisjäännös_alue = "rajapinta:rajapinta_mahdollinen_muinaisjaannos_alue",
  Muu_kohde_piste = "rajapinta:rajapinta_muu_kohde_piste",
  Muu_kohde_alue = "rajapinta:rajapinta_muu_kohde_alue",
  PoistettuKiinteäMuijaisjäännösPiste = "rajapinta:rajapinta_poistettu_kiintea_muinaisjaannos_piste",
  PoistettuKiinteäMuijaisjäännösAlue = "rajapinta:rajapinta_poistettu_kiintea_muinaisjaannos_alue"
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

/**
 * https://gtkdata.gtk.fi/arcgis/rest/services/Rajapinnat/GTK_Maapera_WMS/MapServer/WMSServer?
 */
export enum GtkLayer {
  muinaisrannat = "muinaisrannat",
  maapera_200k_maalaji = "maapera_200k_maalaji"
}

export enum HelsinkiLayer {
  Maalinnoitus_yksikot = "Maalinnoitus_yksikot",
  Maalinnoitus_kohteet = "Maalinnoitus_kohteet",
  Maalinnoitus_rajaukset = "Maalinnoitus_rajaukset",
  Maalinnoitus_karttatekstit = "Maalinnoitus_karttatekstit"
}

export enum ViabundusLayer {
  Viabundus = "Viabundus"
}

export type FeatureLayer =
  | MuseovirastoLayer
  | AhvenanmaaLayer
  | ModelLayer
  | MaisemanMuistiLayer
  | HelsinkiLayer
  | ViabundusLayer

const allFeatureLayers = [
  Object.values(MuseovirastoLayer),
  Object.values(AhvenanmaaLayer),
  Object.values(ModelLayer),
  Object.values(MaisemanMuistiLayer),
  Object.values(HelsinkiLayer),
  Object.values(ViabundusLayer)
].flat()

export const isFeatureLayer = (layer: string): layer is FeatureLayer =>
  allFeatureLayers.includes(layer as FeatureLayer)
