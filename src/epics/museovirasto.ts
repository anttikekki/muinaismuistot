import { Epic, ofType } from "redux-observable"
import {
  ActionTypes,
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING,
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE,
  SELECT_VISIBLE_MUSEOVIRASTO_LAYERS
} from "../store/actionTypes"
import { tap, ignoreElements } from "rxjs/operators"
import {
  selectedFeatureLayersChanged,
  selectedMuinaisjaannosDatingsChanged,
  selectedMuinaisjaannosTypesChanged
} from "../map"
import { LayerGroup } from "../common/types"

export const selectVisibleMuseovirastoLayerEpic: Epic<ActionTypes> = (
  action$
) =>
  action$.pipe(
    ofType(SELECT_VISIBLE_MUSEOVIRASTO_LAYERS),
    tap(() => selectedFeatureLayersChanged(LayerGroup.Museovirasto)),
    ignoreElements()
  )

export const selectVisibleMuinaisjäännösTypeEpic: Epic<ActionTypes> = (
  action$
) =>
  action$.pipe(
    ofType(SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE),
    tap(() => selectedMuinaisjaannosTypesChanged()),
    ignoreElements()
  )

export const selectVisibleMuinaisjäännösDatingEpic: Epic<ActionTypes> = (
  action$
) =>
  action$.pipe(
    ofType(SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING),
    tap(() => selectedMuinaisjaannosDatingsChanged()),
    ignoreElements()
  )
