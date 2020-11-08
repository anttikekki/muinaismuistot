import * as React from "react"
import {
  ArgisFeature,
  ModelFeatureProperties,
  MuseovirastoLayer,
  AhvenanmaaLayer,
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../../../common/types"
import { MuinaisjaannosPistePanel } from "./component/MuinaisjaannosPistePanel"
import {
  getFeatureID,
  getMaisemanMuistiFeaturesForArgisFeature,
  getModelsForFeature
} from "../../../common/util/featureParser"
import { MuinaisjaannosAluePanel } from "./component/MuinaisjaannosAluePanel"
import { RKYPanel } from "./component/RKYPanel"
import { MaailmanperintokohdePanel } from "./component/MaailmanperintokohdePanel"
import { SuojellutRakennuksetPanel } from "./component/SuojellutRakennuksetPanel"
import { AhvenanmaaForminnenPanel } from "./component/AhvenanmaaForminnenPanel"
import { Page, PageVisibility } from "../Page"
import { AhvenanmaaMaritimtKulturarvPanel } from "./component/AhvenanmaaMaritimtKulturarvPanel"
import { MaisemanMuistiFeatureCollapsePanel } from "./component/FeatureCollapsePanel"
import { MaisemanMuistiPanel } from "./component/MaisemanMuistiPanel"

interface PanelForFeatureProps {
  feature: ArgisFeature
  isOpen: boolean
  onToggleOpen: () => void
  models?: Array<ModelFeatureProperties>
  maisemanMuistiFeatures?: Array<
    GeoJSONFeature<MaisemanMuistiFeatureProperties>
  >
}

const PanelForArgisFeature: React.FC<PanelForFeatureProps> = ({
  feature,
  isOpen,
  onToggleOpen,
  models,
  maisemanMuistiFeatures
}) => {
  const params = {
    isOpen,
    onToggleOpen,
    models: getModelsForFeature(feature, models),
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

const getPanelId = (feature: ArgisFeature): string =>
  `${feature.layerName}-${getFeatureID(feature)}`

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
  const [openPanelId, setOpenPanelId] = React.useState("")
  const onTogglePanelOpen = (id: string) =>
    setOpenPanelId(openPanelId === id ? "" : id)

  return (
    <Page title="Valitut kohteet" visibility={visibility} hidePage={hidePage}>
      <div className="panel-group" role="tablist" aria-multiselectable="true" />
      {features.map((feature) => (
        <PanelForArgisFeature
          key={getPanelId(feature)}
          isOpen={openPanelId === getPanelId(feature)}
          onToggleOpen={() => onTogglePanelOpen(getPanelId(feature))}
          feature={feature}
          models={models}
          maisemanMuistiFeatures={maisemanMuistiFeatures}
        />
      ))}
      {features.length === 0 &&
        maisemanMuistiFeatures.length > 0 &&
        maisemanMuistiFeatures.map((feature) => (
          <MaisemanMuistiPanel
            key={feature.properties.id}
            isOpen={openPanelId === feature.properties.id.toString()}
            onToggleOpen={() =>
              onTogglePanelOpen(feature.properties.id.toString())
            }
            feature={feature}
          />
        ))}
    </Page>
  )
}
