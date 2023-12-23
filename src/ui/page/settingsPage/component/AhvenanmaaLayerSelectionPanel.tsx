import React, { useCallback } from "react"
import { AhvenanmaaLayer, LayerGroup } from "../../../../common/layers.types"
import { Panel } from "../../../component/Panel"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Settings } from "../../../../store/storeTypes"
import { toggleSelection } from "../../../util"
import { selectAhvenanmaaLayers } from "../../../../store/actionCreators"
import { LayerCheckbox } from "./LayerCheckbox"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

export const AhvenanmaaLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const selectedAhvenanmaaLayers = useSelector(
    (settings: Settings) => settings.ahvenanmaa.selectedLayers
  )
  const opacity = useSelector(
    (settings: Settings) => settings.ahvenanmaa.opacity
  )
  const onSelectAhvenanmaaLayer = useCallback(
    (layer: AhvenanmaaLayer) =>
      dispatch(
        selectAhvenanmaaLayers(toggleSelection(layer, selectedAhvenanmaaLayers))
      ),
    [dispatch, selectedAhvenanmaaLayers]
  )

  return (
    <Panel title={t(`settings.ahvenanmaa.title`)}>
      <form>
        <h5>
          <Trans
            i18nKey={`data.register.nameWithLink.Ahvenanmaan muinaisjäännösrekisteri`}
            components={{ a: <a /> }}
          />
        </h5>
        <LayerCheckbox
          label={t(`common.features.Kohde`)}
          layer={AhvenanmaaLayer.Fornminnen}
          selectedLayers={selectedAhvenanmaaLayers}
          onSelectLayer={onSelectAhvenanmaaLayer}
        />

        <h5>
          <Trans
            i18nKey={`data.register.nameWithLink.Ahvenanmaan merellinen kulttuuriperintörekisteri`}
            components={{ a: <a /> }}
          />
        </h5>
        <LayerCheckbox
          label={t(`common.features.Kohde`)}
          layer={AhvenanmaaLayer.MaritimtKulturarv}
          selectedLayers={selectedAhvenanmaaLayers}
          onSelectLayer={onSelectAhvenanmaaLayer}
        />
      </form>

      <LayerTransparencyInput
        opacity={opacity}
        layerGroup={LayerGroup.Ahvenanmaa}
      />

      <small className="pull-right">{t(`settings.ahvenanmaa.licence`)}</small>
    </Panel>
  )
}
