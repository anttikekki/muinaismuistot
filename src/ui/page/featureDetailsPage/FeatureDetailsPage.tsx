import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  ArgisFeature,
  ModelFeatureProperties,
  MuseovirastoLayer,
  AhvenanmaaLayer,
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../../../common/types"
import { MuinaisjaannosPistePanel } from "./panel/MuinaisjaannosPistePanel"
import {
  getFeatureID,
  getMaisemanMuistiFeaturesForArgisFeature,
  getModelsForArgisFeature,
  getModelsForMaisemanMuistiFeature
} from "../../../common/util/featureParser"
import { MuinaisjaannosAluePanel } from "./panel/MuinaisjaannosAluePanel"
import { RKYPanel } from "./panel/RKYPanel"
import { MaailmanperintokohdePanel } from "./panel/MaailmanperintokohdePanel"
import { SuojellutRakennuksetPanel } from "./panel/SuojellutRakennuksetPanel"
import { AhvenanmaaForminnenPanel } from "./panel/AhvenanmaaForminnenPanel"
import { Page, PageVisibility } from "../Page"
import { AhvenanmaaMaritimtKulturarvPanel } from "./panel/AhvenanmaaMaritimtKulturarvPanel"
import { MaisemanMuistiPanel } from "./panel/MaisemanMuistiPanel"
import { Accordion } from "react-bootstrap"

interface PanelForFeatureProps {
  feature: ArgisFeature
  isOpen: boolean
  featureUniqueId: string
  models?: Array<ModelFeatureProperties>
  maisemanMuistiFeatures?: Array<
    GeoJSONFeature<MaisemanMuistiFeatureProperties>
  >
}

const PanelForArgisFeature: React.FC<PanelForFeatureProps> = ({
  feature,
  isOpen,
  featureUniqueId,
  models,
  maisemanMuistiFeatures
}) => {
  const params = {
    isOpen,
    featureUniqueId,
    models: getModelsForArgisFeature(feature, models),
    maisemanMuistiFeatures: getMaisemanMuistiFeaturesForArgisFeature(
      feature,
      maisemanMuistiFeatures
    )
  }

  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjaannokset_piste:
      return <MuinaisjaannosPistePanel feature={feature} {...params} />
    case MuseovirastoLayer.Muinaisjaannokset_alue:
      return <MuinaisjaannosAluePanel feature={feature} {...params} />
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return <RKYPanel feature={feature} {...params} />
    case MuseovirastoLayer.Maailmanperinto_alue:
    case MuseovirastoLayer.Maailmanperinto_piste:
      return <MaailmanperintokohdePanel feature={feature} {...params} />
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return <SuojellutRakennuksetPanel feature={feature} {...params} />
    case AhvenanmaaLayer.Fornminnen:
      return <AhvenanmaaForminnenPanel feature={feature} {...params} />
    case AhvenanmaaLayer.MaritimtKulturarv:
      return <AhvenanmaaMaritimtKulturarvPanel feature={feature} {...params} />
  }
  return null
}

interface FeatureDetailsPageProps {
  visibility: PageVisibility
  hidePage: () => void
  features?: Array<ArgisFeature>
  models?: Array<ModelFeatureProperties>
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
  const [openPanelId, setOpenPanelId] = React.useState<string | null>(null)

  return (
    <Page
      title={t(`details.title`)}
      visibility={visibility}
      hidePage={hidePage}
    >
      <Accordion onSelect={(eventKey) => setOpenPanelId(eventKey)}>
        {features.map((feature) => {
          const panelId = `${feature.layerName}-${getFeatureID(feature)}`
          return (
            <PanelForArgisFeature
              key={panelId}
              featureUniqueId={panelId}
              isOpen={openPanelId === panelId}
              feature={feature}
              models={models}
              maisemanMuistiFeatures={maisemanMuistiFeatures}
            />
          )
        })}
        {maisemanMuistiFeatures.map((feature) => {
          // Do not show Maiseman muisti feature if there is feature rendered above for it
          if (
            features.some(
              (argisFeature) =>
                argisFeature.layerName ===
                  MuseovirastoLayer.Muinaisjaannokset_piste &&
                argisFeature.attributes.mjtunnus ===
                  feature.properties.id.toString()
            )
          ) {
            return null
          }

          const panelId = `maisemanMuisti-${feature.properties.id.toString()}`
          return (
            <MaisemanMuistiPanel
              key={panelId}
              featureUniqueId={panelId}
              isOpen={openPanelId === panelId}
              feature={feature}
              models={getModelsForMaisemanMuistiFeature(feature, models)}
            />
          )
        })}
      </Accordion>
    </Page>
  )
}
