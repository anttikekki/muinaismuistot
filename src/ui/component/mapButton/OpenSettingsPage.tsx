import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { showPage } from "../../../store/actionCreators"
import { PageId } from "../../../store/storeTypes"

export const OpenSettingsPage: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onClick = useCallback(() => {
    dispatch(showPage(PageId.Settings))
  }, [dispatch])

  return (
    <div id="map-button-settings" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.settings`) ?? undefined}
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-cog" aria-hidden="true" />
      </button>
    </div>
  )
}
