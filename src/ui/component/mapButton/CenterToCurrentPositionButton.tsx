import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { ActionTypeEnum } from "../../../store/actionTypes"
import { AppDispatch } from "../../../store/storeTypes"

export const CenterToCurrentPositionButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const onClick = useCallback(
    () => dispatch({ type: ActionTypeEnum.CENTER_MAP_TO_CURRENT_POSITION }),
    [dispatch]
  )

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
