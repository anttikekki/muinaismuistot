import * as React from "react"
import { useTranslation } from "react-i18next"

interface Props {
  onClick: () => void
}

export const ShowInfoPageButton: React.FunctionComponent<Props> = ({
  onClick
}) => {
  const { t } = useTranslation()
  return (
    <div id="map-button-info" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.info`)}
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-info-sign" aria-hidden="true" />
      </button>
    </div>
  )
}
