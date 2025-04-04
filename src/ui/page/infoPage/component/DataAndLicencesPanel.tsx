import React from "react"
import { Trans, useTranslation } from "react-i18next"
import { Panel } from "../../../component/Panel"

export const DataAndLicencesPanel: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Panel title={t(`info.licences.title`)}>
      <h6>{t(`common.organization.Museovirasto`)}</h6>
      <p>
        <Trans i18nKey="info.licences.museovirasto" components={{ a: <a /> }} />
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

      <h6>{t(`settings.other.title`)}</h6>
      <p>
        <Trans
          i18nKey="info.licences.maisemanmuisti"
          components={{ a: <a /> }}
        />
      </p>

      <p>
        <Trans i18nKey="info.licences.3DModels" components={{ a: <a /> }} />
      </p>

      <p>
        <Trans i18nKey="info.licences.sourceCode" components={{ a: <a /> }} />
      </p>
    </Panel>
  )
}
