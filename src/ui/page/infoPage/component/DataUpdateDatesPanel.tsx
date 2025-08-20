import React from "react"
import { Accordion } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"

export const DataUpdateDatesPanel: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Accordion.Item eventKey="info.dataUpdates.title">
      <Accordion.Header as="div">
        {t(`info.dataUpdates.title`)}
      </Accordion.Header>
      <Accordion.Body>
        <p>
          <Trans i18nKey={`info.dataUpdates.description`} />
        </p>
      </Accordion.Body>
    </Accordion.Item>
  )
}
