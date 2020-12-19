import * as React from "react"
import { Button } from "react-bootstrap"
import { Plus } from "react-bootstrap-icons"
import { useTranslation } from "react-i18next"

interface Props {
  onClick: () => void
}

export const ZoomInButton: React.FunctionComponent<Props> = ({ onClick }) => {
  const { t } = useTranslation()
  return (
    <div id="map-button-zoom-in" className="map-button">
      <Button
        variant="primary"
        title={t(`common.button.zoomIn`)}
        onClick={onClick}
      >
        <Plus aria-hidden="true" />
      </Button>
    </div>
  )
}
