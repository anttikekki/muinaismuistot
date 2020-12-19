import * as React from "react"
import { Button } from "react-bootstrap"
import { Dash } from "react-bootstrap-icons"
import { useTranslation } from "react-i18next"

interface Props {
  onClick: () => void
}

export const ZoomOutButton: React.FunctionComponent<Props> = ({ onClick }) => {
  const { t } = useTranslation()
  return (
    <div id="map-button-zoom-out" className="map-button">
      <Button
        variant="primary"
        title={t(`common.button.zoomOut`)}
        onClick={onClick}
      >
        <Dash aria-hidden="true" />
      </Button>
    </div>
  )
}
