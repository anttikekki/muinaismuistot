import * as React from "react"
import { useTranslation } from "react-i18next"

interface Props {
  onClick: () => void
}

export const CenterToCurrentPositionButton: React.FunctionComponent<Props> = ({
  onClick
}) => {
  const { t } = useTranslation()
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
