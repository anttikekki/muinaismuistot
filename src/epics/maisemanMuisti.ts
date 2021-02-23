import { Epic, ofType } from "redux-observable"
import {
  ActionTypes,
  SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS
} from "../store/actionTypes"
import { tap } from "rxjs/operators"
import { selectedFeatureLayersChanged } from "../map/MuinaismuistotMap"
import { LayerGroup } from "../common/types"

export const selectVisibleMaisemanMuistiLayerEpic: Epic<ActionTypes> = (
  action$
) =>
  action$.pipe(
    ofType(SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS),
    tap(() => selectedFeatureLayersChanged(LayerGroup.MaisemanMuisti))
  )
