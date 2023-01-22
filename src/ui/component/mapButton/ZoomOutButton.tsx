import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { zoomOut } from "../../../store/actionCreators"

export const ZoomOutButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const onClick = useCallback(() => dispatch(zoomOut()), [dispatch])

  return (
    <div id="map-button-zoom-out" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.zoomOut`) ?? undefined}
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-minus" aria-hidden="true" />
      </button>
    </div>
  )
}
