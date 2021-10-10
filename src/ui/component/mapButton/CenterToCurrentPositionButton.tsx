import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { centerToCurrentPosition } from "../../../store/actionCreators"

export const CenterToCurrentPositionButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const onClick = useCallback(
    () => dispatch(centerToCurrentPosition()),
    [dispatch]
  )

  return (
    <div id="map-button-position" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.positioning`)}
        onClick={onClick}
      >
        <i className="bi bi-geo-alt-fill"></i>
      </button>
    </div>
  )
}
