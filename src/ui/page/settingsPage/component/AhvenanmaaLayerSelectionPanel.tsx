import * as React from "react"
import { FeatureLayer, AhvenanmaaLayer } from "../../../../common/types"
import { Panel } from "../../../component/Panel"
import { getLayerIconURLs } from "../../../../common/util/featureParser"
import { useTranslation } from "react-i18next"

interface LayerCheckboxProps<T extends FeatureLayer> {
  label: string
  layer: T
  selectedLayers: Array<T>
  onSelectLayer: (layer: T) => void
}

const LayerCheckbox = <T extends FeatureLayer>(
  props: LayerCheckboxProps<T>
) => {
  const { label, layer, selectedLayers, onSelectLayer } = props
  const isSelected = selectedLayers.includes(layer)

  return (
    <div className="checkbox sub-layer-select-checkbox-container">
      <label>
        <input
          type="checkbox"
          onChange={() => onSelectLayer(layer)}
          checked={isSelected}
        />
        {getLayerIconURLs(layer).map((url, index) => (
          <img className="feature-icon" key={index} src={url} />
        ))}

        <span>{label}</span>
      </label>
    </div>
  )
}

interface Props {
  selectedAhvenanmaaLayers: Array<AhvenanmaaLayer>
  onSelectAhvenanmaaLayer: (layer: AhvenanmaaLayer) => void
}

export const AhvenanmaaLayerSelectionPanel: React.FC<Props> = ({
  selectedAhvenanmaaLayers,
  onSelectAhvenanmaaLayer
}) => {
  const { t } = useTranslation()
  return (
    <Panel title={t(`settings.ahvenanmaa.title`)}>
      <form>
        <h5>{t(`data.register.Ahvenamaan muinaisjäännösrekisteri`)}</h5>
        <LayerCheckbox
          label={t(`common.features.Kohde`)}
          layer={AhvenanmaaLayer.Fornminnen}
          selectedLayers={selectedAhvenanmaaLayers}
          onSelectLayer={onSelectAhvenanmaaLayer}
        />

        <h5>
          {t(`data.register.Ahvenamaan merellinen kulttuuriperintörekisteri`)}
        </h5>
        <LayerCheckbox
          label={t(`common.features.Kohde`)}
          layer={AhvenanmaaLayer.MaritimtKulturarv}
          selectedLayers={selectedAhvenanmaaLayers}
          onSelectLayer={onSelectAhvenanmaaLayer}
        />
      </form>

      <small className="pull-right">{t(`settings.ahvenanmaa.licence`)}</small>
    </Panel>
  )
}
