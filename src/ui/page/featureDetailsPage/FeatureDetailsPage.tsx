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
  getModelsForArgisFeature,
  getModelsForMaisemanMuistiFeature
} from "../../../common/util/featureParser"
import { MuinaisjaannosAluePanel } from "./component/MuinaisjaannosAluePanel"
import { RKYPanel } from "./component/RKYPanel"
import { MaailmanperintokohdePanel } from "./component/MaailmanperintokohdePanel"
import { SuojellutRakennuksetPanel } from "./component/SuojellutRakennuksetPanel"
import { AhvenanmaaForminnenPanel } from "./component/AhvenanmaaForminnenPanel"
import { Page, PageVisibility } from "../Page"
import { AhvenanmaaMaritimtKulturarvPanel } from "./component/AhvenanmaaMaritimtKulturarvPanel"
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
  const [openPanelId, setOpenPanelId] = React.useState("")
  const onTogglePanelOpen = (id: string) =>
    setOpenPanelId(openPanelId === id ? "" : id)

  return (
    <Page title="Valitut kohteet" visibility={visibility} hidePage={hidePage}>
      <div className="panel-group" role="tablist" aria-multiselectable="true" />
      {features.map((feature) => {
        const panelId = `${feature.layerName}-${getFeatureID(feature)}`
        return (
          <PanelForArgisFeature
            key={panelId}
            isOpen={openPanelId === panelId}
            onToggleOpen={() => onTogglePanelOpen(panelId)}
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
            isOpen={openPanelId === panelId}
            onToggleOpen={() => onTogglePanelOpen(panelId)}
            feature={feature}
            models={getModelsForMaisemanMuistiFeature(feature, models)}
          />
        )
      })}
    </Page>
  )
}
