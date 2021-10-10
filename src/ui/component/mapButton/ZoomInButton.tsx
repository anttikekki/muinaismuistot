import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { zoomIn } from "../../../store/actionCreators"

export const ZoomInButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const onClick = useCallback(() => dispatch(zoomIn()), [dispatch])

  return (
    <div id="map-button-zoom-in" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.zoomIn`)}
        onClick={onClick}
      >
        <i className="bi bi-plus-lg"></i>
      </button>
    </div>
  )
}
