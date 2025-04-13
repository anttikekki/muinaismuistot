import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { ActionTypeEnum } from "../../../store/actionTypes"
import { AppDispatch, PageId } from "../../../store/storeTypes"

export const OpenSearchPageButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const onClick = useCallback(() => {
    dispatch({
      type: ActionTypeEnum.SHOW_PAGE,
      pageId: PageId.Search
    })
  }, [dispatch])

  return (
    <div id="map-button-search" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.search`) ?? undefined}
        onClick={onClick}
      >
        <i className="bi bi-search" aria-hidden="true" />
      </button>
    </div>
  )
}
