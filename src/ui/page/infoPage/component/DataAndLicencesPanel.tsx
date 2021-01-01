import * as React from "react"
import { Trans, useTranslation } from "react-i18next"
import { Panel } from "../../../component/Panel"

export const DataAndLicencesPanel: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Panel title={t(`info.licences.title`)}>
      <p>
        <Trans i18nKey="info.licences.museovirasto" components={{ a: <a /> }} />
      </p>

      <p>
        <Trans i18nKey="info.licences.ahvenanmaa" components={{ a: <a /> }} />
      </p>

      <p>
        <Trans
          i18nKey="info.licences.maanmittauslaitos"
          components={{ a: <a /> }}
        />
      </p>

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
