import React from "react"
import { Button } from "react-bootstrap"
import { useTranslation } from "react-i18next"

interface Props {
  onClick: () => void
  fullscreenPossible: boolean
}

export const FullscreenButton: React.FunctionComponent<Props> = ({
  onClick,
  fullscreenPossible
}) => {
  const { t } = useTranslation()
  if (!fullscreenPossible) {
    return null
  }
  return (
    <div id="map-button-fullscreen" className="map-button">
      <Button
        variant="primary"
        size="sm"
        title={t(`common.button.fullscreen`) ?? undefined}
        onClick={onClick}
      >
        <i className="bi bi-arrows-fullscreen" aria-hidden="true" />
      </Button>
    </div>
  )
}
