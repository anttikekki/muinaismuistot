import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../store/storeTypes"
import { centerMapThunk } from "../../../store/thunks/centerMap"

export const CenterToCurrentPositionButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const onClick = useCallback(() => dispatch(centerMapThunk()), [dispatch])

  return (
    <div id="map-button-position" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.positioning`) ?? undefined}
        onClick={onClick}
      >
        <i className="bi bi-crosshair" aria-hidden="true" />
      </button>
    </div>
  )
}
