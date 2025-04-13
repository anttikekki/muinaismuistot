import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { ActionTypeEnum } from "../../../store/actionTypes"
import { AppDispatch } from "../../../store/storeTypes"

export const ZoomInButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const onClick = useCallback(
    () =>
      dispatch({
        type: ActionTypeEnum.ZOOM,
        zoomDirection: "in"
      }),
    [dispatch]
  )

  return (
    <div id="map-button-zoom-in" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.zoomIn`) ?? undefined}
        onClick={onClick}
      >
        <i className="bi bi-zoom-in" aria-hidden="true" />
      </button>
    </div>
  )
}
