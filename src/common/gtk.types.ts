import { GtkLayer } from "./layers.types"

/**
 * https://gtkdata.gtk.fi/arcgis/rest/services/Rajapinnat/GTK_Maapera_WMS/MapServer/WMSServer?
 */
export type GtkLayerId = 20 | 53

export const getGtkLayerId = (layer: GtkLayer): GtkLayerId => {
  switch (layer) {
    case GtkLayer.muinaisrannat:
      return 20
    case GtkLayer.maapera_200k_maalaji:
      return 53
  }
}
