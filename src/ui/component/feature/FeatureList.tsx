import React, { useCallback, useState } from "react"
import {
  MuseovirastoLayer,
  AhvenanmaaLayer
} from "../../../common/layers.types"
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
import { GeoJSONFeature } from "../../../common/geojson.types"
import { ModelFeatureProperties } from "../../../common/3dModels.types"
import { MaisemanMuistiFeatureProperties } from "../../../common/maisemanMuisti.types"
import {
  isMaalinnoitusKohdeFeature,
  isMaalinnoitusRajausFeature,
  isMaalinnoitusYksikkoFeature
} from "../../../common/maalinnoitusHelsinki.types"
import {
  MapFeature,
  getFeatureLayerName,
  isWmsFeature
} from "../../../common/mapFeature.types"
import {
  isMaailmanperintoAlueWmsFeature,
  isMaailmanperintoPisteWmsFeature,
  isMuinaisjaannosAlueWmsFeature,
  isMuinaisjaannosPisteWmsFeature,
  isRKYAlueWmsFeature,
  isRKYPisteWmsFeature,
  isRKYViivaWmsFeature,
  isSuojellutRakennuksetAlueWmsFeature,
  isSuojellutRakennuksetPisteWmsFeature
} from "../../../common/museovirasto.types"
import { isAhvenanmaaArcgisFeature } from "../../../common/ahvenanmaa.types"

interface FeatureListProps {
  titleClickAction: FeatureTitleClickAction
  features?: Array<MapFeature>
  models?: Array<GeoJSONFeature<ModelFeatureProperties>>
  maisemanMuistiFeatures?: Array<
    GeoJSONFeature<MaisemanMuistiFeatureProperties>
  >
}

export const FeatureList: React.FC<FeatureListProps> = ({
  titleClickAction,
  features = [],
  models = [],
  maisemanMuistiFeatures = []
}) => {
  const [openPanelId, setOpenPanelId] = useState("")
  const onTogglePanelOpen = useCallback(
    (id: string) => setOpenPanelId(openPanelId === id ? "" : id),
    [openPanelId]
  )

  return (
    <div className="panel-group" role="tablist" aria-multiselectable="true">
      {features.map((feature, i) => {
        const panelId = `${getFeatureLayerName(feature)}-${getFeatureID(
          feature
        )}-${i}`
        const params = {
          key: panelId,
          titleClickAction,
          isOpen: openPanelId === panelId,
          onToggleOpen: () => onTogglePanelOpen(panelId)
        }

        if (isWmsFeature(feature)) {
          if (isMuinaisjaannosPisteWmsFeature(feature)) {
            return <MuinaisjaannosPistePanel feature={feature} {...params} />
          }
          if (isMuinaisjaannosAlueWmsFeature(feature)) {
            return <MuinaisjaannosAluePanel feature={feature} {...params} />
          }
          if (
            isRKYAlueWmsFeature(feature) ||
            isRKYPisteWmsFeature(feature) ||
            isRKYViivaWmsFeature(feature)
          ) {
            return <RKYPanel feature={feature} {...params} />
          }
          if (
            isMaailmanperintoAlueWmsFeature(feature) ||
            isMaailmanperintoPisteWmsFeature(feature)
          ) {
            return <MaailmanperintokohdePanel feature={feature} {...params} />
          }
          if (
            isSuojellutRakennuksetAlueWmsFeature(feature) ||
            isSuojellutRakennuksetPisteWmsFeature(feature)
          ) {
            return <SuojellutRakennuksetPanel feature={feature} {...params} />
          }

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
        }
        if (isAhvenanmaaArcgisFeature(feature)) {
          switch (feature.layerName) {
            case AhvenanmaaLayer.Fornminnen:
              return <AhvenanmaaForminnenPanel feature={feature} {...params} />
            case AhvenanmaaLayer.MaritimtKulturarv:
              return (
                <AhvenanmaaMaritimtKulturarvPanel
                  feature={feature}
                  {...params}
                />
              )
          }
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
    </div>
  )
}
