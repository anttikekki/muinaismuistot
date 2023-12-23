import { GtkLayer } from "./layers.types"

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
