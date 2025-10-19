import React from "react"
import { Accordion } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"

export const VersionHistoryPanel: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Accordion.Item eventKey="Versiohistoria">
      <Accordion.Header as="div">
        {t("info.versionHistory.title")}
      </Accordion.Header>
      <Accordion.Body>
        <h6>10/2025</h6>
        <Trans
          i18nKey="info.versionHistory.2025-10"
          components={{ a: <a /> }}
        />

        <h6>09/2025</h6>
        <Trans
          i18nKey="info.versionHistory.2025-09"
          components={{ a: <a /> }}
        />

        <h6>5/2025</h6>
        <Trans
          i18nKey="info.versionHistory.2025-05"
          components={{ a: <a /> }}
        />

        <h6>4/2025</h6>
        <Trans
          i18nKey="info.versionHistory.2025-04"
          components={{ a: <a /> }}
        />

        <h6>1/2024</h6>
        <Trans
          i18nKey="info.versionHistory.2024-01"
          components={{ a: <a /> }}
        />

        <h6>12/2023</h6>
        <Trans
          i18nKey="info.versionHistory.2023-12"
          components={{ a: <a /> }}
        />

        <h6>4/2022</h6>
        <Trans
          i18nKey="info.versionHistory.2022-04"
          components={{ a: <a /> }}
        />

        <h6>3/2021</h6>
        <Trans
          i18nKey="info.versionHistory.2021-03"
          components={{ a: <a /> }}
        />

        <h6>2/2021</h6>
        <Trans
          i18nKey="info.versionHistory.2021-02"
          components={{ a: <a /> }}
        />

        <h6>1/2021</h6>
        <Trans
          i18nKey="info.versionHistory.2021-01"
          components={{ a: <a /> }}
        />

        <h6>11/2020</h6>
        <Trans
          i18nKey="info.versionHistory.2020-11"
          components={{ a: <a />, img: <img /> }}
        />

        <h6>4/2020</h6>
        <Trans
          i18nKey="info.versionHistory.2020-04"
          components={{ a: <a />, img: <img /> }}
        />

        <h6>2/2020</h6>
        <Trans
          i18nKey="info.versionHistory.2020-02"
          components={{ a: <a /> }}
        />

        <h6>8/2019</h6>
        <Trans
          i18nKey="info.versionHistory.2019-08"
          components={{ a: <a /> }}
        />

        <h6>12/2018</h6>
        <Trans
          i18nKey="info.versionHistory.2018-12"
          components={{ a: <a /> }}
        />

        <h6>11/2017</h6>
        <Trans
          i18nKey="info.versionHistory.2017-11"
          components={{ a: <a /> }}
        />

        <h6>10/2015</h6>
        <Trans
          i18nKey="info.versionHistory.2015-10"
          components={{ a: <a /> }}
        />
      </Accordion.Body>
    </Accordion.Item>
  )
}
