import React, { useEffect } from "react"
import { Panel } from "../../../component/Panel"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Settings } from "../../../../store/storeTypes"
import { fetchDataLatestUpdateDates } from "../../../../store/actionCreators"

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

export const DataUpdateDatesPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispacth = useDispatch()
  const dataLatestUpdateDates = useSelector(
    (settings: Settings) => settings.dataLatestUpdateDates
  )
  useEffect(() => {
    if (dataLatestUpdateDates === undefined) {
      dispacth(fetchDataLatestUpdateDates())
    }
  }, [dataLatestUpdateDates])

  return (
    <Panel title={t(`info.dataUpdates.title`)}>
      <h5>{t(`info.dataUpdates.Museoviraston aineistot`)}</h5>
      <UpdatedDate date={dataLatestUpdateDates?.museovirasto} />

      <h5>{t(`data.register.Ahvenanmaan muinaisjäännösrekisteri`)}</h5>
      <UpdatedDate date={dataLatestUpdateDates?.ahvenanmaaForminnen} />

      <h5>
        {t(`data.register.Ahvenanmaan merellinen kulttuuriperintörekisteri`)}
      </h5>
      <UpdatedDate date={dataLatestUpdateDates?.ahvenanmaaMaritimtKulturarv} />

      <h5>
        <Trans i18nKey="data.register.3Dmodels" components={{ a: <a /> }} />
      </h5>
      <UpdatedDate date={dataLatestUpdateDates?.models} />
    </Panel>
  )
}
