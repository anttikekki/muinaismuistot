import { combineEpics } from "redux-observable"
import { centerMapEpic } from "./centerMap"
import { dataUpdateDatesEpic } from "./dataUpdateDates"
import { zoomInEpic, zoomOutEpic } from "./zoom"
import { searchFeaturesEpic } from "./searchFeatures"
import { selectVisibleMaanmittauslaitosLayerEpic } from "./maanmittauslaitosLayer"
import { selectVisibleGtkLayersEpic } from "./gtkLayer"
import {
  selectVisibleMuinaisjäännösDatingEpic,
  selectVisibleMuinaisjäännösTypeEpic,
  selectVisibleMuseovirastoLayerEpic
} from "./museovirastoLayer"
import { selectVisibleAhvenanmaaLayerEpic } from "./ahvenanmaaLayer"
import { selectVisibleMaisemanMuistiLayerEpic } from "./maisemanMuistiLayer"
import { selectVisibleModelsLayerEpic } from "./modelsLayer"
import { updateUrlParametersEpic } from "./url"
import { changeLayerOpacityEpic } from "./opacity"
import { selectVisibleHelsinkiLayersEpic } from "./helsinkiLayer"
import { selectVisibleMaankohoaminenLayersEpic } from "./maankohoaminenLayers"

export const rootEpic = combineEpics(
  zoomInEpic,
  zoomOutEpic,
  centerMapEpic,
  dataUpdateDatesEpic,
  searchFeaturesEpic,
  selectVisibleMaanmittauslaitosLayerEpic,
  selectVisibleGtkLayersEpic,
  changeLayerOpacityEpic,
  selectVisibleMuseovirastoLayerEpic,
  selectVisibleAhvenanmaaLayerEpic,
  selectVisibleModelsLayerEpic,
  selectVisibleMaisemanMuistiLayerEpic,
  selectVisibleMuinaisjäännösTypeEpic,
  selectVisibleMuinaisjäännösDatingEpic,
  updateUrlParametersEpic,
  selectVisibleHelsinkiLayersEpic,
  selectVisibleMaankohoaminenLayersEpic
)
