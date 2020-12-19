import * as React from "react"
import { Button } from "react-bootstrap"
import { Search } from "react-bootstrap-icons"
import { useTranslation } from "react-i18next"

interface Props {
  onClick: () => void
}

export const OpenSearchPageButton: React.FunctionComponent<Props> = ({
  onClick
}) => {
  const { t } = useTranslation()
  return (
    <div id="map-button-search" className="map-button">
      <Button
        variant="primary"
        title={t(`common.button.search`)}
        onClick={onClick}
      >
        <Search aria-hidden="true" />
      </Button>
    </div>
  )
}
