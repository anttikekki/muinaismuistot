import * as React from "react"
import { MuseovirastoLayer, FeatureLayer } from "../../../../common/types"
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
  selectedMuseovirastoLayers: Array<MuseovirastoLayer>
  onSelectMuseovirastoLayer: (layer: MuseovirastoLayer) => void
}

export const MuseovirastoLayerSelectionPanel: React.FC<Props> = ({
  selectedMuseovirastoLayers,
  onSelectMuseovirastoLayer
}) => {
  const { t, i18n } = useTranslation()
  const checkboxes = React.useMemo(
    () => (
      <form>
        <h5>
          {t(
            `data.register.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`
          )}
        </h5>
        <LayerCheckbox
          label={t(`common.features.Alue`)}
          layer={MuseovirastoLayer.RKY_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label={t(`common.features.Viiva`)}
          layer={MuseovirastoLayer.RKY_viiva}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label={t(`common.features.Rakennus`)}
          layer={MuseovirastoLayer.RKY_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />

        <h5>{t(`data.register.Maailmanperintökohteet`)}</h5>
        <LayerCheckbox
          label={t(`common.features.Alue`)}
          layer={MuseovirastoLayer.Maailmanperinto_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label={t(`common.features.Kohde`)}
          layer={MuseovirastoLayer.Maailmanperinto_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />

        <h5>{t(`data.register.Rakennusperintörekisteri`)}</h5>
        <LayerCheckbox
          label={t(`common.features.Rakennettu alue`)}
          layer={MuseovirastoLayer.Suojellut_rakennukset_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label={t(`common.features.Rakennus`)}
          layer={MuseovirastoLayer.Suojellut_rakennukset_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />

        <h5>{t(`data.register.Muinaisjäännösrekisteri`)}</h5>
        <LayerCheckbox
          label={t(`common.features.Alue`)}
          layer={MuseovirastoLayer.Muinaisjaannokset_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label={t(`common.features.Kohde`)}
          layer={MuseovirastoLayer.Muinaisjaannokset_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
      </form>
    ),
    [selectedMuseovirastoLayers, i18n.language]
  )

  return (
    <Panel title={t(`settings.museovirasto.title`)}>
      {checkboxes}

      <small className="pull-right">{t(`settings.museovirasto.licence`)}</small>
    </Panel>
  )
}
