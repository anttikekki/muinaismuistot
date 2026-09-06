import { parseURLParams } from "../common/util/URLHashHelper"
import { initialSettings } from "../store/initialSettings"
import {
  updateAhvenanmaaLayerEnabled,
  updateAhvenanmaaLayerOpacity,
  updateAhvenanmaaSelectedLayers
} from "../store/reducers/ahvenanmaaLayer"
import {
  updateGtkLayerEnabled,
  updateGtkLayerOpacity,
  updateGtkSelectedLayers
} from "../store/reducers/gtkLayer"
import {
  updateHelsinkiLayerEnabled,
  updateHelsinkiLayerOpacity,
  updateHelsinkiSelectedLayers
} from "../store/reducers/helsinkiLayer"
import { updateLinkedFeature } from "../store/reducers/linkedFeature"
import {
  updateMmlPohjakarttaLayerEnabled,
  updateMmlPohjakarttaSelectedLayer,
  updateMmlVanhatKartatLayerEnabled,
  updateMmlVanhatKartatLayerOpacity,
  updateMmlVanhatKartatSelectedLayer
} from "../store/reducers/maanmittauslaitosLayer"
import {
  updateMaannousuInfoLayerEnabled,
  updateMaannousuInfoLayerOpacity,
  updateMaannousuInfoPlacement,
  updateMaannousuInfoSelectedLayer
} from "../store/reducers/maannousuInfoLayer"
import { updateMaisemanMuistiLayerEnabled } from "../store/reducers/maisemanMuistiLayer"
import { updateModelLayerEnabled } from "../store/reducers/modelLayer"
import {
  updateMuseovirastoDataSource,
  updateMuseovirastoLayerEnabled,
  updateMuseovirastoLayerOpacity,
  updateMuseovirastoSelectedLayers,
  updateMuseovirastoWorkerUrl,
  updateSelectMuinaisjaannosDatings,
  updateSelectMuinaisjaannosTypes
} from "../store/reducers/museovirastoLayer"
import {
  updateViabundusLayerEnabled,
  updateViabundusLayerOpacity,
  updateViabundusYear
} from "../store/reducers/viabundusLayer"
import { updateLanguage } from "../store/rootReducer"
import { MuseovirastoDataSource, Settings } from "../store/storeTypes"
import { parseURLSettings } from "./schema"

export const getSettingsFromURL = (): Settings => {
  let newSettings = initialSettings
  const {
    x,
    y,
    linkedFeatureLayer,
    linkedFeatureId,
    linkedFeatureName,
    zoom,
    center,
    lang,
    mmlLayer,
    mmlLayerEnabled,
    mmlVanhatKartatLayer,
    mmlVanhatKartatOpacity,
    mmlVanhatKartatEnabled,
    gtkOpacity,
    gtkEnabled,
    gtktLayer,
    maannousuLayer,
    maannousuOpacity,
    maannousuEnabled,
    maannousuIndex,
    museovirastoLayer,
    museovirastoOpacity,
    museovirastoEnabled,
    museovirastoVectorTiles,
    museovirastoApiBase,
    muinaisjaannosTypes,
    muinaisjaannosDatings,
    ahvenanmaaLayer,
    ahvenanmaaOpacity,
    ahvenanmaaEnabled,
    helsinkiLayer,
    helsinkiOpacity,
    helsinkiEnabled,
    viabundusYear,
    viabundusOpacity,
    viabundusEnabled,
    modelsEnabled,
    maisemanMuistiEnabled
  } = parseURLSettings(parseURLParams())

  // Museovirasto data source and Worker URL
  if (museovirastoVectorTiles === true) {
    newSettings = updateMuseovirastoDataSource(
      newSettings,
      MuseovirastoDataSource.PMTiles
    )
  } else if (museovirastoVectorTiles === false) {
    newSettings = updateMuseovirastoDataSource(
      newSettings,
      MuseovirastoDataSource.WMS
    )
  }
  if (museovirastoApiBase !== undefined) {
    newSettings = updateMuseovirastoWorkerUrl(newSettings, museovirastoApiBase)
  }

  // Linked feature
  if (x !== undefined && y !== undefined) {
    newSettings = updateLinkedFeature(newSettings, {
      coordinates: [x, y],
      layer: linkedFeatureLayer,
      id: linkedFeatureId,
      name: linkedFeatureName
    })
  }

  // Map zoom
  if (zoom !== undefined) {
    newSettings = {
      ...newSettings,
      mapZoom: zoom
    }
  }

  // Map center
  if (center !== undefined) {
    newSettings = {
      ...newSettings,
      mapCenterCoordinates: [center[0], center[1]]
    }
  }

  // Language
  if (lang !== undefined) {
    newSettings = updateLanguage(newSettings, lang)
  }

  // MML basemap layer
  if (mmlLayer !== undefined) {
    newSettings = updateMmlPohjakarttaSelectedLayer(newSettings, mmlLayer)
  }

  // MML basemap enabled
  if (mmlLayerEnabled !== undefined) {
    newSettings = updateMmlPohjakarttaLayerEnabled(newSettings, mmlLayerEnabled)
  }

  // MML vanhat kartat layers
  if (mmlVanhatKartatLayer) {
    newSettings = updateMmlVanhatKartatSelectedLayer(
      newSettings,
      mmlVanhatKartatLayer
    )
  }

  // MML vanhat kartat opacity
  if (mmlVanhatKartatOpacity !== undefined) {
    newSettings = updateMmlVanhatKartatLayerOpacity(
      newSettings,
      mmlVanhatKartatOpacity
    )
  }

  // MML vanhat kartat enabled
  if (mmlVanhatKartatEnabled !== undefined) {
    newSettings = updateMmlVanhatKartatLayerEnabled(
      newSettings,
      mmlVanhatKartatEnabled
    )
  }

  // GTK opacity
  if (gtkOpacity !== undefined) {
    newSettings = updateGtkLayerOpacity(newSettings, gtkOpacity)
  }

  // GTK enabled
  if (gtkEnabled !== undefined) {
    newSettings = updateGtkLayerEnabled(newSettings, gtkEnabled)
  }

  // GTK layers
  if (gtktLayer) {
    newSettings = updateGtkSelectedLayers(newSettings, gtktLayer)
  }

  // Maannousu.info layer
  if (maannousuLayer !== undefined) {
    newSettings = updateMaannousuInfoSelectedLayer(newSettings, maannousuLayer)
  }

  //  Maannousu.info opacity
  if (maannousuOpacity !== undefined) {
    newSettings = updateMaannousuInfoLayerOpacity(newSettings, maannousuOpacity)
  }

  // Maannousu.info enabled
  if (maannousuEnabled !== undefined) {
    newSettings = updateMaannousuInfoLayerEnabled(newSettings, maannousuEnabled)
  }

  // Maannousu.info index
  if (maannousuIndex !== undefined) {
    newSettings = updateMaannousuInfoPlacement(newSettings, maannousuIndex)
  }

  // Museovirasto layers
  if (museovirastoLayer) {
    newSettings = updateMuseovirastoSelectedLayers(
      newSettings,
      museovirastoLayer
    )
  }

  // Museovirasto opacity
  if (museovirastoOpacity !== undefined) {
    newSettings = updateMuseovirastoLayerOpacity(
      newSettings,
      museovirastoOpacity
    )
  }

  // Museovirasto enabled
  if (museovirastoEnabled !== undefined) {
    newSettings = updateMuseovirastoLayerEnabled(
      newSettings,
      museovirastoEnabled
    )
  }

  // Museovirasto muinaisjaannos types
  if (muinaisjaannosTypes) {
    newSettings = updateSelectMuinaisjaannosTypes(
      newSettings,
      muinaisjaannosTypes
    )
  }

  // Museovirasto muinaisjaannos datings
  if (muinaisjaannosDatings) {
    newSettings = updateSelectMuinaisjaannosDatings(
      newSettings,
      muinaisjaannosDatings
    )
  }

  // Ahvenanmaa layers
  if (ahvenanmaaLayer) {
    newSettings = updateAhvenanmaaSelectedLayers(newSettings, ahvenanmaaLayer)
  }

  // Ahvenanmaa opacity
  if (ahvenanmaaOpacity !== undefined) {
    newSettings = updateAhvenanmaaLayerOpacity(newSettings, ahvenanmaaOpacity)
  }

  // Ahvenanmaa enabled
  if (ahvenanmaaEnabled !== undefined) {
    newSettings = updateAhvenanmaaLayerEnabled(newSettings, ahvenanmaaEnabled)
  }

  // Helsinki layers
  if (helsinkiLayer) {
    newSettings = updateHelsinkiSelectedLayers(newSettings, helsinkiLayer)
  }

  // Helsinki opacity
  if (helsinkiOpacity !== undefined) {
    newSettings = updateHelsinkiLayerOpacity(newSettings, helsinkiOpacity)
  }

  // Helsinki enabled
  if (helsinkiEnabled !== undefined) {
    newSettings = updateHelsinkiLayerEnabled(newSettings, helsinkiEnabled)
  }

  // Viabundus year
  if (viabundusYear !== undefined) {
    newSettings = updateViabundusYear(newSettings, viabundusYear)
  }

  // Viabundus opacity
  if (viabundusOpacity !== undefined) {
    newSettings = updateViabundusLayerOpacity(newSettings, viabundusOpacity)
  }

  // Viabundus enabled
  if (viabundusEnabled !== undefined) {
    newSettings = updateViabundusLayerEnabled(newSettings, viabundusEnabled)
  }

  // 3D models enabled
  if (modelsEnabled !== undefined) {
    newSettings = updateModelLayerEnabled(newSettings, modelsEnabled)
  }

  // Maiseman muisti enabled
  if (maisemanMuistiEnabled !== undefined) {
    newSettings = updateMaisemanMuistiLayerEnabled(
      newSettings,
      maisemanMuistiEnabled
    )
  }

  return newSettings
}
