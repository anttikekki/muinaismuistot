import * as React from "react"
import { useTranslation } from "react-i18next"

interface Props {
  onClick: () => void
}

export const OpenSettingsPage: React.FunctionComponent<Props> = ({
  onClick
}) => {
  const { t } = useTranslation()
  return (
    <div id="map-button-settings" className="map-button">
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.settings`)}
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-cog" aria-hidden="true" />
      </button>
    </div>
  )
}
