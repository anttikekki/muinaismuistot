import * as React from "react"
import { useTranslation } from "react-i18next"

interface Props {
  onClick: () => void
}

export const ZoomInButton: React.FunctionComponent<Props> = ({ onClick }) => {
  const { t } = useTranslation()
  return (
    <div id="map-button-zoom-in" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.zoomIn`)}
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-plus" aria-hidden="true" />
      </button>
    </div>
  )
}
