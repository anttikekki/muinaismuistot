import React from "react"
import { useTranslation } from "react-i18next"
import { Page } from "../Page"
import { FeatureList } from "../../component/feature/FeatureList"
import { FeatureTitleClickAction } from "../../component/feature/component/FeatureCollapsePanel"
import { PageId, Settings } from "../../../store/storeTypes"
import { useSelector } from "react-redux"

export const FeatureDetailsPage: React.FC = () => {
  const { t } = useTranslation()
  const features = useSelector(
    (settings: Settings) => settings.selectedFeaturesOnMap.features
  )
  const models = useSelector(
    (settings: Settings) => settings.selectedFeaturesOnMap.models
  )
  const maisemanMuistiFeatures = useSelector(
    (settings: Settings) =>
      settings.selectedFeaturesOnMap.maisemanMuistiFeatures
  )
  const maalinnoitusFeatures = useSelector(
    (settings: Settings) => settings.selectedFeaturesOnMap.maalinnoitusFeatures
  )

  return (
    <Page title={t(`details.title`)} pageId={PageId.Details}>
      <FeatureList
        titleClickAction={FeatureTitleClickAction.OpenDetails}
        features={features}
        models={models}
        maisemanMuistiFeatures={maisemanMuistiFeatures}
        maalinnoitusFeatures={maalinnoitusFeatures}
      />
    </Page>
  )
}
