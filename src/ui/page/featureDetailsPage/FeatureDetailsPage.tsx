import React from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { PageId, Settings } from "../../../store/storeTypes"
import { FeatureList } from "../../component/feature/FeatureList"
import { FeatureTitleClickAction } from "../../component/feature/component/FeatureCollapsePanel"
import { Page } from "../Page"

export const FeatureDetailsPage: React.FC = () => {
  const { t } = useTranslation()
  const features = useSelector(
    (settings: Settings) => settings.selectedFeaturesOnMap.features
  )
  const models = useSelector(
    (settings: Settings) => settings.selectedFeaturesOnMap.models
  )

  return (
    <Page title={t(`details.title`)} pageId={PageId.Details}>
      <FeatureList
        titleClickAction={FeatureTitleClickAction.OpenDetails}
        features={features}
        models={models}
      />
    </Page>
  )
}
