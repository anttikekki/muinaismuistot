import * as React from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { centerToCurrentPosition } from "../../../store/actions"

interface Props {
  onClick: () => void
}

export const CenterToCurrentPositionButton: React.FunctionComponent<Props> = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const onClick = React.useCallback(() => dispatch(centerToCurrentPosition()), [
    dispatch
  ])

  return (
    <div id="map-button-position" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.positioning`)}
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-screenshot" aria-hidden="true" />
      </button>
    </div>
  )
}
