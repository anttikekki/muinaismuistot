import { searchFeaturesFromMapLayers } from "../../map"
import { ActionTypeEnum } from "../actionTypes"
import { AppThunk } from "../storeTypes"

export const searchFeaturesThunk =
  (searchText: string): AppThunk =>
  async (dispatch) => {
    dispatch({
      type: ActionTypeEnum.SEARCH_FEATURES,
      searchText
    })
    const result = await searchFeaturesFromMapLayers(searchText)
    dispatch({
      type: ActionTypeEnum.SEARCH_FEATURES_COMPLETE,
      searchResultFeatures: result
    })
  }
