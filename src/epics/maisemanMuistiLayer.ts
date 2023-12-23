import { Epic, ofType } from "redux-observable"
import {
  ActionTypes,
  SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS
} from "../store/actionTypes"
import { tap, ignoreElements } from "rxjs/operators"
import { selectedFeatureLayersChanged } from "../map"
import { LayerGroup } from "../common/layers.types"

export const selectVisibleMaisemanMuistiLayerEpic: Epic<ActionTypes> = (
  action$
) =>
  action$.pipe(
    ofType(SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS),
    tap(() => selectedFeatureLayersChanged(LayerGroup.MaisemanMuisti)),
    ignoreElements()
  )
