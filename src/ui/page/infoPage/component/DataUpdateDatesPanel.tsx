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
          <ul>
            <li>
              <b>{t(`common.organization.Maanmittauslaitos`)}:</b>{" "}
              {t(`info.dataUpdates.mml`)}
            </li>
            <li>
              <b>{t(`common.organization.Museovirasto`)}:</b>{" "}
              {t(`info.dataUpdates.museovirasto`)}
            </li>
            <li>
              <b>{t(`common.organization.Ahvenanmaan paikallishallinto`)}:</b>{" "}
              {t(`info.dataUpdates.ahvenanmaa`)}
            </li>
            <li>
              <b>{t(`common.organization.Geologian tutkimuskeskus`)}:</b>{" "}
              {t(`info.dataUpdates.gtk`)}
            </li>
            <li>
              <b>{t(`common.organization.Helsingin kaupunki`)}:</b>{" "}
              {t(`info.dataUpdates.helsinki`)}
            </li>
            <li>
              <b>{t(`common.organization.viabundus`)}:</b>{" "}
              {t(`info.dataUpdates.viabundus`)}
            </li>
            <li>
              <b>{t(`common.organization.Maannousu.info`)}:</b>{" "}
              {t(`info.dataUpdates.Maannousu.info`)}
            </li>
          </ul>
        </p>
      </Accordion.Body>
    </Accordion.Item>
  )
}
