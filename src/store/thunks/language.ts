import { Language } from "../../common/layers.types"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const changeLanguageThunk =
  (language: Language): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.CHANGE_LANGUAGE,
      language
    })
    updateSettingsToURL(initialSettings, getState())
  }
