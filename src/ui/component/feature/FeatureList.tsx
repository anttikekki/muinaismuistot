import React, { useCallback, useState } from "react"
import { Accordion } from "react-bootstrap"
import { ModelFeature } from "../../../common/3dModels.types"
import { isAhvenanmaaFeature } from "../../../common/ahvenanmaa.types"
import {
  AhvenanmaaLayer,
  MuseovirastoLayer
} from "../../../common/layers.types"
import {
  isMaalinnoitusKohdeFeature,
  isMaalinnoitusRajausFeature,
  isMaalinnoitusYksikkoFeature
} from "../../../common/maalinnoitusHelsinki.types"
import { isMaisemanMuistiFeature } from "../../../common/maisemanMuisti.types"
import {
  getFeatureLayer,
  isGeoJSONFeature,
  MapFeature
} from "../../../common/mapFeature.types"
import {
  isMaailmanperintoAlueFeature,
  isMaailmanperintoPisteFeature,
  isMuinaisjaannosAlueFeature,
  isMuinaisjaannosPisteFeature,
  isMuuKulttuuriperintokohdeAlueFeature,
  isMuuKulttuuriperintokohdePisteFeature,
  isRKYAlueFeature,
  isRKYPisteFeature,
  isRKYViivaFeature,
  isSuojellutRakennuksetAlueFeature,
  isSuojellutRakennuksetPisteFeature,
  isVarkAlueFeature,
  isVarkPisteFeature
} from "../../../common/museovirasto.types"
import { getFeatureID } from "../../../common/util/featureParser"
import {
  isViabundusPlaceFeature,
  isViabundusRoadFeature,
  isViabundusTownOutlineFeature
} from "../../../common/viabundus.types"
import { AhvenanmaaForminnenPanel } from "../../component/feature/panel/AhvenanmaaForminnenPanel"
import { AhvenanmaaMaritimtKulturarvPanel } from "../../component/feature/panel/AhvenanmaaMaritimtKulturarvPanel"
import { MaailmanperintokohdePanel } from "../../component/feature/panel/MaailmanperintokohdePanel"
import { MaisemanMuistiPanel } from "../../component/feature/panel/MaisemanMuistiPanel"
import { MuinaisjaannosAluePanel } from "../../component/feature/panel/MuinaisjaannosAluePanel"
import { MuinaisjaannosPistePanel } from "../../component/feature/panel/MuinaisjaannosPistePanel"
import { RKYPanel } from "../../component/feature/panel/RKYPanel"
import { SuojellutRakennuksetPanel } from "../../component/feature/panel/SuojellutRakennuksetPanel"
import {
  FeatureCollapsePanelCommonExternalProps,
  FeatureTitleClickAction
} from "./component/FeatureCollapsePanel"
import { MaalinnoitusKohdePanel } from "./panel/MaalinnoitusKohdePanel"
import { MaalinnoitusRajausPanel } from "./panel/MaalinnoitusRajausPanel"
import { MaalinnoitusYksikkoPanel } from "./panel/MaalinnoitusYksikkoPanel"
import { VarkPanel } from "./panel/VarkPanel"
import { ViabundusPlacePanel } from "./panel/ViabundusPlacePanel"
import { ViabundusRoadPanel } from "./panel/ViabundusRoadPanel"
import { ViabundusTownOutlinePanel } from "./panel/ViabundusTownOutlinePanel"

interface FeatureListProps {
  titleClickAction: FeatureTitleClickAction
  features?: MapFeature[]
  models?: ModelFeature[]
}

export const FeatureList: React.FC<FeatureListProps> = ({
  titleClickAction,
  features = [],
  models = []
}) => {
  const [openPanelId, setOpenPanelId] = useState("")
  const onTogglePanelOpen = useCallback(
    (id: string) => setOpenPanelId(openPanelId === id ? "" : id),
    [openPanelId]
  )
  const getCommonProps = (
    panelId: string
  ): FeatureCollapsePanelCommonExternalProps => {
    return {
      titleClickAction,
      isOpen: openPanelId === panelId,
      panelId,
      onToggleOpen: () => onTogglePanelOpen(panelId)
    }
  }

  return (
    <Accordion defaultActiveKey={openPanelId} activeKey={openPanelId}>
      {features.map((feature, i) => {
        const panelId = `${getFeatureLayer(feature)}-${getFeatureID(
          feature
        )}-${i}`
        const params = {
          key: panelId,
          ...getCommonProps(panelId)
        }

        if (isGeoJSONFeature(feature)) {
          if (
            isMuinaisjaannosPisteFeature(feature) ||
            isMuuKulttuuriperintokohdePisteFeature(feature)
          ) {
            return <MuinaisjaannosPistePanel feature={feature} {...params} />
          }
          if (
            isMuinaisjaannosAlueFeature(feature) ||
            isMuuKulttuuriperintokohdeAlueFeature(feature)
          ) {
            return <MuinaisjaannosAluePanel feature={feature} {...params} />
          }
          if (
            isRKYAlueFeature(feature) ||
            isRKYPisteFeature(feature) ||
            isRKYViivaFeature(feature)
          ) {
            return <RKYPanel feature={feature} {...params} />
          }
          if (
            isMaailmanperintoAlueFeature(feature) ||
            isMaailmanperintoPisteFeature(feature)
          ) {
            return <MaailmanperintokohdePanel feature={feature} {...params} />
          }
          if (
            isSuojellutRakennuksetAlueFeature(feature) ||
            isSuojellutRakennuksetPisteFeature(feature)
          ) {
            return <SuojellutRakennuksetPanel feature={feature} {...params} />
          }

          if (isMaalinnoitusYksikkoFeature(feature)) {
            return <MaalinnoitusYksikkoPanel feature={feature} {...params} />
          }
          if (isMaalinnoitusKohdeFeature(feature)) {
            return <MaalinnoitusKohdePanel feature={feature} {...params} />
          }
          if (isMaalinnoitusRajausFeature(feature)) {
            return <MaalinnoitusRajausPanel feature={feature} {...params} />
          }
          if (isVarkPisteFeature(feature) || isVarkAlueFeature(feature)) {
            return <VarkPanel feature={feature} {...params} />
          }
          if (isMaisemanMuistiFeature(feature)) {
            return (
              <MaisemanMuistiPanel
                feature={feature}
                {...params}
                models={
                  models
                    ? models
                        .filter(
                          (model) =>
                            model.properties.registryItem.type ===
                            MuseovirastoLayer.Muinaisjaannokset_piste
                        )
                        .filter(
                          (model) =>
                            model.properties.registryItem.id ===
                            feature.properties.id
                        )
                    : []
                }
              />
            )
          }
          if (isViabundusPlaceFeature(feature)) {
            return <ViabundusPlacePanel feature={feature} {...params} />
          }
          if (isViabundusRoadFeature(feature)) {
            return <ViabundusRoadPanel feature={feature} {...params} />
          }
          if (isViabundusTownOutlineFeature(feature)) {
            return <ViabundusTownOutlinePanel feature={feature} {...params} />
          }
        }
        if (isAhvenanmaaFeature(feature)) {
          switch (feature.layerName) {
            case AhvenanmaaLayer.Fornminnen:
              return <AhvenanmaaForminnenPanel feature={feature} {...params} />
            case AhvenanmaaLayer.MaritimaFornminnen:
              return (
                <AhvenanmaaMaritimtKulturarvPanel
                  feature={feature}
                  {...params}
                />
              )
          }
        }
      })}
    </Accordion>
  )
}
