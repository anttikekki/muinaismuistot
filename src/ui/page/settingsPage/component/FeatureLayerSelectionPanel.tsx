import * as React from "react"
import {
  MuseovirastoLayer,
  FeatureLayer,
  AhvenanmaaLayer,
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
  selectedMuseovirastoLayers: Array<MuseovirastoLayer>
  selectedAhvenanmaaLayers: Array<AhvenanmaaLayer>
  selectedModelLayers: Array<ModelLayer>
  selectedMaisemanMuistiLayers: Array<MaisemanMuistiLayer>
  onSelectMuseovirastoLayer: (layer: MuseovirastoLayer) => void
  onSelectAhvenanmaaLayer: (layer: AhvenanmaaLayer) => void
  onSelectModelLayer: (layer: ModelLayer) => void
  onSelectMaisemanMuistiLayer: (layer: MaisemanMuistiLayer) => void
}

export const FeatureLayerSelectionPanel: React.FC<Props> = ({
  selectedMuseovirastoLayers,
  selectedAhvenanmaaLayers,
  selectedModelLayers,
  selectedMaisemanMuistiLayers,
  onSelectMuseovirastoLayer,
  onSelectAhvenanmaaLayer,
  onSelectModelLayer,
  onSelectMaisemanMuistiLayer
}) => {
  const { t } = useTranslation()
  return (
    <Panel title={t(`settings.layers.title`)}>
      <form>
        <h5>
          {t(
            `data.register.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`
          )}
        </h5>
        <LayerCheckbox
          label={t(`settings.layers.Alueet`)}
          layer={MuseovirastoLayer.RKY_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label={t(`settings.layers.Viivat`)}
          layer={MuseovirastoLayer.RKY_viiva}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label={t(`settings.layers.Pisteet`)}
          layer={MuseovirastoLayer.RKY_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />

        <h5>{t(`data.register.Maailmanperintökohteet`)}</h5>
        <LayerCheckbox
          label={t(`settings.layers.Alueet`)}
          layer={MuseovirastoLayer.Maailmanperinto_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label={t(`settings.layers.Pisteet`)}
          layer={MuseovirastoLayer.Maailmanperinto_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />

        <h5>{t(`data.register.Rakennusperintörekisteri`)}</h5>
        <LayerCheckbox
          label={t(`settings.layers.Rakennetut alueet`)}
          layer={MuseovirastoLayer.Suojellut_rakennukset_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label={t(`settings.layers.Rakennukset`)}
          layer={MuseovirastoLayer.Suojellut_rakennukset_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />

        <h5>{t(`data.register.Muinaisjäännösrekisteri`)}</h5>
        <LayerCheckbox
          label={t(`settings.layers.Alueet`)}
          layer={MuseovirastoLayer.Muinaisjaannokset_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label={t(`settings.layers.Pisteet`)}
          layer={MuseovirastoLayer.Muinaisjaannokset_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />

        <h5>{t(`data.register.Ahvenamaan muinaisjäännösrekisteri`)}</h5>
        <LayerCheckbox
          label={t(`settings.layers.Kohde`)}
          layer={AhvenanmaaLayer.Fornminnen}
          selectedLayers={selectedAhvenanmaaLayers}
          onSelectLayer={onSelectAhvenanmaaLayer}
        />

        <h5>
          {t(`data.register.Ahvenamaan merellinen kulttuuriperintörekisteri`)}
        </h5>
        <LayerCheckbox
          label={t(`settings.layers.Kohde`)}
          layer={AhvenanmaaLayer.MaritimtKulturarv}
          selectedLayers={selectedAhvenanmaaLayers}
          onSelectLayer={onSelectAhvenanmaaLayer}
        />

        <h5>
          <Trans i18nKey="data.register.3Dmodels" components={{ a: <a /> }} />
        </h5>
        <LayerCheckbox
          label={t(`settings.layers.3D-mallit`)}
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
            `settings.layers.Valtakunnallisesti merkittävät muinaisjäännökset`
          )}
          layer={MaisemanMuistiLayer.MaisemanMuisti}
          selectedLayers={selectedMaisemanMuistiLayers}
          onSelectLayer={onSelectMaisemanMuistiLayer}
        />
      </form>
    </Panel>
  )
}
