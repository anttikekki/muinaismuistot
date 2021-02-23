import { Epic, ofType } from "redux-observable"
import { ActionTypes, SELECT_VISIBLE_MODELS_LAYERS } from "../store/actionTypes"
import { tap } from "rxjs/operators"
import { selectedFeatureLayersChanged } from "../map/MuinaismuistotMap"
import { LayerGroup } from "../common/types"

export const selectVisibleModelsLayerEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(SELECT_VISIBLE_MODELS_LAYERS),
    tap(() => selectedFeatureLayersChanged(LayerGroup.Models))
  )
