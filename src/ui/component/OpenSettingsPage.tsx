import * as React from "react"
import { Button } from "react-bootstrap"
import { Gear } from "react-bootstrap-icons"
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
      <Button
        variant="primary"
        title={t(`common.button.settings`)}
        onClick={onClick}
      >
        <Gear aria-hidden="true" />
      </Button>
    </div>
  )
}
