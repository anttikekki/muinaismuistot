import * as React from "react"
import { Button } from "react-bootstrap"
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
      <Button
        variant="primary"
        title={t(`common.button.info`)}
        onClick={onClick}
      >
        <i className="bi bi-info-circle" />
      </Button>
    </div>
  )
}
