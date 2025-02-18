import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../store/storeTypes"
import { zoomOutThunk } from "../../../store/thunks/zoom"

export const ZoomOutButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const onClick = useCallback(() => dispatch(zoomOutThunk()), [dispatch])

  return (
    <div id="map-button-zoom-out" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.zoomOut`) ?? undefined}
        onClick={onClick}
      >
        <i className="bi bi-zoom-out" aria-hidden="true" />
      </button>
    </div>
  )
}
