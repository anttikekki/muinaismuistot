import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  ArgisFeature,
  ModelFeatureProperties,
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../../../common/types"
import { Page, PageVisibility } from "../Page"
import { FeatureList } from "../../component/feature/FeatureList"
import { FeatureTitleClickAction } from "../../component/feature/component/FeatureCollapsePanel"

interface FeatureDetailsPageProps {
  visibility: PageVisibility
  hidePage: () => void
  features?: Array<ArgisFeature>
  models?: Array<GeoJSONFeature<ModelFeatureProperties>>
  maisemanMuistiFeatures?: Array<
    GeoJSONFeature<MaisemanMuistiFeatureProperties>
  >
}

export const FeatureDetailsPage: React.FC<FeatureDetailsPageProps> = ({
  visibility,
  hidePage,
  features = [],
  models = [],
  maisemanMuistiFeatures = []
}) => {
  const { t } = useTranslation()

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
