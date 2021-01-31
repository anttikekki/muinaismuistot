import * as React from "react"
import { useTranslation } from "react-i18next"
import { Page, PageVisibility } from "../Page"
import { FeatureList } from "../../component/feature/FeatureList"
import { FeatureTitleClickAction } from "../../component/feature/component/FeatureCollapsePanel"
import { Settings } from "../../../store/storeTypes"
import { useSelector } from "react-redux"

interface FeatureDetailsPageProps {
  visibility: PageVisibility
  hidePage: () => void
}

export const FeatureDetailsPage: React.FC<FeatureDetailsPageProps> = ({
  visibility,
  hidePage
}) => {
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

  return (
    <Page
      title={t(`details.title`)}
      visibility={visibility}
      hidePage={hidePage}
    >
      <FeatureList
        hidePage={hidePage}
        titleClickAction={FeatureTitleClickAction.OpenDetails}
        features={features}
        models={models}
        maisemanMuistiFeatures={maisemanMuistiFeatures}
      />
    </Page>
  )
}
