import { Middleware } from "redux"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum, ActionTypes } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { RootState } from "../storeTypes"

const actionThatUpdateUrlParams: ReadonlyArray<ActionTypeEnum> = [
  ActionTypeEnum.CHANGE_LANGUAGE
]

export const updateUrlParametersMiddleware: Middleware<RootState> =
  (store) => (next) => (action) => {
    if (actionThatUpdateUrlParams.includes((action as ActionTypes).type)) {
      updateSettingsToURL(initialSettings, store.getState())
    }

    return next(action)
  }
