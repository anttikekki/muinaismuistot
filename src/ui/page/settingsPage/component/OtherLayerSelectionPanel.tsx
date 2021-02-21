import * as React from "react"
import {
  FeatureLayer,
  ModelLayer,
  MaisemanMuistiLayer
} from "../../../../common/types"
import { Panel } from "../../../component/Panel"
import { getLayerIconURLs } from "../../../../common/util/featureParser"
import { Trans, useTranslation } from "react-i18next"

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
  selectedModelLayers: Array<ModelLayer>
  selectedMaisemanMuistiLayers: Array<MaisemanMuistiLayer>
  onSelectModelLayer: (layer: ModelLayer) => void
  onSelectMaisemanMuistiLayer: (layer: MaisemanMuistiLayer) => void
}

export const OtherLayerSelectionPanel: React.FC<Props> = ({
  selectedModelLayers,
  selectedMaisemanMuistiLayers,
  onSelectModelLayer,
  onSelectMaisemanMuistiLayer
}) => {
  const { t } = useTranslation()
  return (
    <Panel title={t(`settings.other.title`)}>
      <form>
        <h5>
          <Trans i18nKey="data.register.3Dmodels" components={{ a: <a /> }} />
        </h5>
        <LayerCheckbox
          label={t(`common.features.3D-malli`)}
          layer={ModelLayer.ModelLayer}
          selectedLayers={selectedModelLayers}
          onSelectLayer={onSelectModelLayer}
        />

        <h5>
          <Trans
            i18nKey="data.register.maisemanMuisti"
            components={{ a: <a /> }}
          />
        </h5>
        <LayerCheckbox
          label={t(
            `common.features.Valtakunnallisesti merkittävä muinaisjäännös`
          )}
          layer={MaisemanMuistiLayer.MaisemanMuisti}
          selectedLayers={selectedMaisemanMuistiLayers}
          onSelectLayer={onSelectMaisemanMuistiLayer}
        />
      </form>
    </Panel>
  )
}
