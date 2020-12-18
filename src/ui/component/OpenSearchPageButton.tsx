import * as React from "react"
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
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.search`)}
        onClick={onClick}
      >
        <span className="glyphicon glyphicon-search" aria-hidden="true" />
      </button>
    </div>
  )
}
