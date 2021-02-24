import { combineEpics } from "redux-observable"
import { centerMapEpic } from "./centerMap"
import { dataUpdateDatesEpic } from "./dataUpdateDates"
import { zoomInEpic, zoomOutEpic } from "./zoom"
import { searchFeaturesEpic } from "./searchFeatures"
import { selectVisibleMaanmittauslaitosLayerEpic } from "./maanmittauslaitos"
import { changeGtkLayerOpacityEpic, selectVisibleGtkLayersEpic } from "./gtk"
import {
  selectVisibleMuinaisjäännösDatingEpic,
  selectVisibleMuinaisjäännösTypeEpic,
  selectVisibleMuseovirastoLayerEpic
} from "./museovirasto"
import { selectVisibleAhvenanmaaLayerEpic } from "./ahvenanmaa"
import { selectVisibleMaisemanMuistiLayerEpic } from "./maisemanMuisti"
import { selectVisibleModelsLayerEpic } from "./models"
import { updateUrlParametersEpic } from "./url"

export const rootEpic = combineEpics(
  zoomInEpic,
  zoomOutEpic,
  centerMapEpic,
  dataUpdateDatesEpic,
  searchFeaturesEpic,
  selectVisibleMaanmittauslaitosLayerEpic,
  selectVisibleGtkLayersEpic,
  changeGtkLayerOpacityEpic,
  selectVisibleMuseovirastoLayerEpic,
  selectVisibleAhvenanmaaLayerEpic,
  selectVisibleModelsLayerEpic,
  selectVisibleMaisemanMuistiLayerEpic,
  selectVisibleMuinaisjäännösTypeEpic,
  selectVisibleMuinaisjäännösDatingEpic,
  updateUrlParametersEpic
)
