import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ArgisFeature,
  ModelFeatureProperties,
  MuseovirastoLayer,
  AhvenanmaaLayer,
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties,
  MaalinnoitusFeature,
  isMaalinnoitusYksikkoFeature,
  isMaalinnoitusKohdeFeature,
  isMaalinnoitusRajausFeature
} from "../../../common/types"
import { MuinaisjaannosPistePanel } from "../../component/feature/panel/MuinaisjaannosPistePanel"
import {
  getFeatureID,
  getModelsForMaisemanMuistiFeature
} from "../../../common/util/featureParser"
import { MuinaisjaannosAluePanel } from "../../component/feature/panel/MuinaisjaannosAluePanel"
import { RKYPanel } from "../../component/feature/panel/RKYPanel"
import { MaailmanperintokohdePanel } from "../../component/feature/panel/MaailmanperintokohdePanel"
import { SuojellutRakennuksetPanel } from "../../component/feature/panel/SuojellutRakennuksetPanel"
import { AhvenanmaaForminnenPanel } from "../../component/feature/panel/AhvenanmaaForminnenPanel"
import { AhvenanmaaMaritimtKulturarvPanel } from "../../component/feature/panel/AhvenanmaaMaritimtKulturarvPanel"
import { MaisemanMuistiPanel } from "../../component/feature/panel/MaisemanMuistiPanel"
import { FeatureTitleClickAction } from "./component/FeatureCollapsePanel"
import { MaalinnoitusYksikkoPanel } from "./panel/MaalinnoitusYksikkoPanel"
import { MaalinnoitusKohdePanel } from "./panel/MaalinnoitusKohdePanel"
import { MaalinnoitusRajausPanel } from "./panel/MaalinnoitusRajausPanel"

interface FeatureListProps {
  titleClickAction: FeatureTitleClickAction
  features?: Array<ArgisFeature>
  models?: Array<GeoJSONFeature<ModelFeatureProperties>>
  maisemanMuistiFeatures?: Array<
    GeoJSONFeature<MaisemanMuistiFeatureProperties>
  >
  maalinnoitusFeatures?: Array<MaalinnoitusFeature>
}

export const FeatureList: React.FC<FeatureListProps> = ({
  titleClickAction,
  features = [],
  models = [],
  maisemanMuistiFeatures = [],
  maalinnoitusFeatures = []
}) => {
  const [openPanelId, setOpenPanelId] = useState("")
  const onTogglePanelOpen = useCallback(
    (id: string) => setOpenPanelId(openPanelId === id ? "" : id),
    [openPanelId]
  )

  return (
    <div className="panel-group" role="tablist" aria-multiselectable="true">
      {features.map((feature) => {
        const panelId = `${feature.layerName}-${getFeatureID(feature)}`
        const params = {
          key: panelId,
          titleClickAction,
          isOpen: openPanelId === panelId,
          onToggleOpen: () => onTogglePanelOpen(panelId)
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
            return (
              <AhvenanmaaMaritimtKulturarvPanel feature={feature} {...params} />
            )
        }
      })}
      {maisemanMuistiFeatures.map((feature) => {
        const panelId = `maisemanMuisti-${feature.properties.id.toString()}`
        return (
          <MaisemanMuistiPanel
            key={panelId}
            titleClickAction={titleClickAction}
            isOpen={openPanelId === panelId}
            onToggleOpen={() => onTogglePanelOpen(panelId)}
            feature={feature}
            models={getModelsForMaisemanMuistiFeature(feature, models)}
          />
        )
      })}
      {maalinnoitusFeatures.map((feature) => {
        const panelId = feature.id // Contains type prefix and unique id

        if (isMaalinnoitusYksikkoFeature(feature)) {
          return (
            <MaalinnoitusYksikkoPanel
              key={panelId}
              titleClickAction={titleClickAction}
              isOpen={openPanelId === panelId}
              onToggleOpen={() => onTogglePanelOpen(panelId)}
              feature={feature}
            />
          )
        }
        if (isMaalinnoitusKohdeFeature(feature)) {
          return (
            <MaalinnoitusKohdePanel
              key={panelId}
              titleClickAction={titleClickAction}
              isOpen={openPanelId === panelId}
              onToggleOpen={() => onTogglePanelOpen(panelId)}
              feature={feature}
            />
          )
        }
        if (isMaalinnoitusRajausFeature(feature)) {
          return (
            <MaalinnoitusRajausPanel
              key={panelId}
              titleClickAction={titleClickAction}
              isOpen={openPanelId === panelId}
              onToggleOpen={() => onTogglePanelOpen(panelId)}
              feature={feature}
            />
          )
        }
      })}
    </div>
  )
}
