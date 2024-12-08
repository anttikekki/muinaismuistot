import {
  ActionTypeEnum,
  ClickedMapFeatureIdentificationCompleteAction,
  ShowLoadingAnimationAction,
  ShowPageAction
} from "./actionTypes"
import { PageId, SelectedFeaturesOnMap } from "./storeTypes"

export const clickedMapFeatureIdentificationComplete = (
  payload: SelectedFeaturesOnMap
): ClickedMapFeatureIdentificationCompleteAction => {
  return {
    type: ActionTypeEnum.CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE,
    payload
  }
}

export const showLoadingAnimation = (
  show: boolean
): ShowLoadingAnimationAction => {
  return {
    type: ActionTypeEnum.SHOW_LOADING_ANIMATION,
    show
  }
}

export const showPage = (pageId?: PageId): ShowPageAction => {
  return {
    type: ActionTypeEnum.SHOW_PAGE,
    pageId
  }
}
