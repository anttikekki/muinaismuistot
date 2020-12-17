import * as React from "react"
import { Panel } from "../../../component/Panel"
import { DataLatestUpdateDates } from "../../../../common/types"
import { Trans, useTranslation } from "react-i18next"

const UpdatedDate: React.FC<{ date: Date | null | undefined }> = ({ date }) => {
  const { t } = useTranslation()
  if (date === undefined) {
    return <p>{t(`info.dataUpdates.loading`)}</p>
  }
  if (date === null) {
    return <p>{t(`info.dataUpdates.error`)}</p>
  }
  return <p>{date.toLocaleDateString("fi")}</p>
}

interface Props {
  dataLatestUpdateDates?: DataLatestUpdateDates
}

export const DataUpdateDatesPanel: React.FC<Props> = ({
  dataLatestUpdateDates
}) => {
  const { t } = useTranslation()
  return (
    <Panel title={t(`info.dataUpdates.title`)}>
      <h5>{t(`info.dataUpdates.Museoviraston aineistot`)}</h5>
      <UpdatedDate date={dataLatestUpdateDates?.museovirasto} />

      <h5>{t(`data.register.Ahvenamaan muinaisjäännösrekisteri`)}</h5>
      <UpdatedDate date={dataLatestUpdateDates?.ahvenanmaaForminnen} />

      <h5>
        {t(`data.register.Ahvenamaan merellinen kulttuuriperintörekisteri`)}
      </h5>
      <UpdatedDate date={dataLatestUpdateDates?.ahvenanmaaMaritimtKulturarv} />

      <h5>
        <Trans i18nKey="data.register.3Dmodels" components={{ a: <a /> }} />
      </h5>
      <UpdatedDate date={dataLatestUpdateDates?.models} />
    </Panel>
  )
}
