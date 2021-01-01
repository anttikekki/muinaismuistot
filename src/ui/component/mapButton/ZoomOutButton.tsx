import * as React from "react"
import { useTranslation } from "react-i18next"

interface Props {
  onClick: () => void
}

export const ZoomOutButton: React.FunctionComponent<Props> = ({ onClick }) => {
  const { t } = useTranslation()
  return (
    <div id="map-button-zoom-out" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.zoomOut`)}
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-minus" aria-hidden="true" />
      </button>
    </div>
  )
}
