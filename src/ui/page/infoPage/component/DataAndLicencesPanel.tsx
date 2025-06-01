import React from "react"
import { Accordion } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"

export const DataAndLicencesPanel: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Accordion.Item eventKey="info.licences.title">
      <Accordion.Header as="div">{t(`info.licences.title`)}</Accordion.Header>
      <Accordion.Body>
        <h6>{t(`common.organization.Museovirasto`)}</h6>
        <p>
          <Trans
            i18nKey="info.licences.museovirasto"
            components={{ a: <a /> }}
          />
        </p>

        <h6>{t(`common.organization.Ahvenanmaan paikallishallinto`)}</h6>
        <p>
          <Trans i18nKey="info.licences.ahvenanmaa" components={{ a: <a /> }} />
        </p>

        <h6>{t(`common.organization.Maanmittauslaitos`)}</h6>
        <p>
          <Trans
            i18nKey="info.licences.maanmittauslaitos"
            components={{ a: <a /> }}
          />
        </p>
        <p>
          <Trans
            i18nKey="info.licences.maanmittauslaitosVanhatKartat"
            components={{ a: <a /> }}
          />
        </p>

        <h6>{t(`common.organization.Geologian tutkimuskeskus`)}</h6>
        <p>
          <Trans i18nKey="info.licences.gtk" components={{ a: <a /> }} />
        </p>

        <h6>{t(`common.organization.Helsingin kaupunki`)}</h6>
        <p>
          <Trans i18nKey="info.licences.helsinki" components={{ a: <a /> }} />
        </p>

        <h6>{t(`common.organization.Maannousu.info`)}</h6>
        <p>
          <Trans
            i18nKey="info.licences.maannousuInfo"
            components={{ a: <a /> }}
          />
        </p>

        <h6>{t(`settings.maisemanMuisti.title`)}</h6>
        <p>
          <Trans
            i18nKey="info.licences.maisemanmuisti"
            components={{ a: <a /> }}
          />
        </p>

        <h6>{t(`settings.3Dmodels.title`)}</h6>
        <p>
          <Trans i18nKey="info.licences.3DModels" components={{ a: <a /> }} />
        </p>

        <p>
          <Trans i18nKey="info.licences.sourceCode" components={{ a: <a /> }} />
        </p>
      </Accordion.Body>
    </Accordion.Item>
  )
}
