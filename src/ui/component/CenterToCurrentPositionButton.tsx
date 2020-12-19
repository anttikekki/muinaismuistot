import * as React from "react"
import { Button } from "react-bootstrap"
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
      <Button
        variant="primary"
        title={t(`common.button.positioning`)}
        onClick={onClick}
      >
        <i className="bi bi-bullseye" />
      </Button>
    </div>
  )
}
