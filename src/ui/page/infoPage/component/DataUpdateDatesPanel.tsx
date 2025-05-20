import React from "react"
import { Accordion } from "react-bootstrap"
import { useTranslation } from "react-i18next"

export const DataUpdateDatesPanel: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Accordion.Item eventKey="info.dataUpdates.title">
      <Accordion.Header as="div">
        {t(`info.dataUpdates.title`)}
      </Accordion.Header>
      <Accordion.Body>
        <p>
          Aineistot päivittyvät realiaikaisesti tälle sivustolle kaikkien
          tietolähteiden karttapalvelimilta.
        </p>
      </Accordion.Body>
    </Accordion.Item>
  )
}
