import React from "react"
import { Panel } from "../../../component/Panel"
import { useTranslation } from "react-i18next"

export const DataUpdateDatesPanel: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Panel title={t(`info.dataUpdates.title`)}>
      <p>
        Aineistot päivittyvät realiaikaisesti tälle sivustolle kaikkien
        tietolähteiden karttapalvelimilta.
      </p>
    </Panel>
  )
}
