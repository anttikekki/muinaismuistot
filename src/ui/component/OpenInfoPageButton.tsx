import * as React from "react"
import { Button } from "react-bootstrap"
import { Info } from "react-bootstrap-icons"
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
        <Info aria-hidden="true" />
      </Button>
    </div>
  )
}
