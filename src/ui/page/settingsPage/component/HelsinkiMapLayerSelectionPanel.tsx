import React, { useCallback, useMemo } from "react"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { HelsinkiLayer, LayerGroup } from "../../../../common/types"
import { selectHelsinkiLayer } from "../../../../store/actionCreators"
import { Settings } from "../../../../store/storeTypes"
import { Panel } from "../../../component/Panel"
import { toggleSelection } from "../../../util"
import { FeatureImageAndLabel } from "./FeatureImageAndLabel"
import { LayerCheckbox } from "./LayerCheckbox"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

const FeatureLabelsForLayer: React.FC<{ layer: HelsinkiLayer }> = ({
  layer
}) => {
  const { t } = useTranslation()
  switch (layer) {
    case HelsinkiLayer.Maalinnoitus_kohteet:
      return (
        <>
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-asema.png"
            label={t(`data.helsinki.feature.asema`)}
          />
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-luola.png"
            label={t(`data.helsinki.feature.luola`)}
          />
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-tykkitie.png"
            label={t(`data.helsinki.feature.tykkitie`)}
          />
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-tykkipatteri.png"
            label={t(`data.helsinki.feature.tykkipatteri`)}
          />
        </>
      )
    case HelsinkiLayer.Maalinnoitus_rajaukset:
      return (
        <>
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-puolustusaseman-raja.png"
            label={t(`data.helsinki.feature.puolustusasemanRaja`)}
          />
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-tukikohdan-raja.png"
            label={t(`data.helsinki.feature.tukikohdanRaja`)}
          />
        </>
      )
    default:
      return null
  }
}

export const HelsinkiMapLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const selectedLayers = useSelector(
    (settings: Settings) => settings.helsinki.selectedLayers
  )
  const opacity = useSelector((settings: Settings) => settings.helsinki.opacity)
  const onSelectLayer = useCallback(
    (layer: HelsinkiLayer) => {
      dispatch(selectHelsinkiLayer(toggleSelection(layer, selectedLayers)))
    },
    [dispatch, selectedLayers]
  )
  const checkboxes = useMemo(
    () =>
      Object.values(HelsinkiLayer)
        .sort((a, b) =>
          t(`data.helsinki.layer.${a}`).localeCompare(
            t(`data.helsinki.layer.${b}`)
          )
        )
        .map((layer) => (
          <LayerCheckbox
            key={layer}
            label={t(`data.helsinki.layer.${layer}`)}
            layer={layer}
            selectedLayers={selectedLayers}
            onSelectLayer={onSelectLayer}
            showIcon={false}
          >
            <FeatureLabelsForLayer layer={layer} />
          </LayerCheckbox>
        )),
    [selectedLayers, onSelectLayer]
  )

  return (
    <Panel title={t(`settings.helsinki.title`)}>
      <form>
        <h5>
          <Trans
            i18nKey={`data.register.maalinnoitus`}
            components={{ a: <a /> }}
          />
        </h5>
        {checkboxes}

        <LayerTransparencyInput
          opacity={opacity}
          layerGroup={LayerGroup.Helsinki}
        />

        <small className="pull-right">{t(`settings.helsinki.licence`)}</small>
      </form>
    </Panel>
  )
}
