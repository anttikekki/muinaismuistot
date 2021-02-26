import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { HelsinkiLayer, LayerGroup } from "../../../../common/types"
import { selectHelsinkiLayer } from "../../../../store/actionCreators"
import { Settings } from "../../../../store/storeTypes"
import { Panel } from "../../../component/Panel"
import { toggleSelection } from "../../../util"
import { LayerCheckbox } from "./LayerCheckbox"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

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

  return (
    <Panel title={t(`settings.helsinki.title`)}>
      <form>
        <h5>{t(`data.register.maalinnoitus`)}</h5>
        {Object.values(HelsinkiLayer).map((layer) => (
          <LayerCheckbox
            key={layer}
            label={t(`data.helsinki.layer.${layer}`)}
            layer={layer}
            selectedLayers={selectedLayers}
            onSelectLayer={onSelectLayer}
          />
        ))}

        <LayerTransparencyInput
          opacity={opacity}
          layerGroup={LayerGroup.Helsinki}
        />

        <small className="pull-right">{t(`settings.helsinki.licence`)}</small>
      </form>
    </Panel>
  )
}
