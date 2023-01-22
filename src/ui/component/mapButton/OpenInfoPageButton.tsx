import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { showPage } from "../../../store/actionCreators"
import { PageId } from "../../../store/storeTypes"

export const ShowInfoPageButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onClick = useCallback(() => {
    dispatch(showPage(PageId.Info))
  }, [dispatch])

  return (
    <div id="map-button-info" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.info`) ?? undefined}
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-info-sign" aria-hidden="true" />
      </button>
    </div>
  )
}
