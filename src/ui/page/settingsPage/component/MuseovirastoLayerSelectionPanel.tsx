import React, { useCallback, useMemo } from "react"
import { LayerGroup, MuseovirastoLayer } from "../../../../common/layers.types"
import { Panel } from "../../../component/Panel"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Settings } from "../../../../store/storeTypes"
import { selectMuseovirastoLayers } from "../../../../store/actionCreators"
import { toggleSelection } from "../../../util"
import { LayerCheckbox } from "./LayerCheckbox"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

export const MuseovirastoLayerSelectionPanel: React.FC = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const selectedMuseovirastoLayers = useSelector(
    (settings: Settings) => settings.museovirasto.selectedLayers
  )
  const opacity = useSelector(
    (settings: Settings) => settings.museovirasto.opacity
  )
  const onSelectMuseovirastoLayer = useCallback(
    (layer: MuseovirastoLayer) =>
      dispatch(
        selectMuseovirastoLayers(
          toggleSelection(layer, selectedMuseovirastoLayers)
        )
      ),
    [dispatch, selectedMuseovirastoLayers]
  )

  const checkboxes = useMemo(
    () => (
      <form>
        <h5>
          <Trans
            i18nKey={`data.register.nameWithLink.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`}
            components={{ a: <a /> }}
          />
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

        <h5>
          <Trans
            i18nKey={`data.register.nameWithLink.Maailmanperintökohteet`}
            components={{ a: <a /> }}
          />
        </h5>
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

        <h5>
          <Trans
            i18nKey={`data.register.nameWithLink.Rakennusperintörekisteri`}
            components={{ a: <a /> }}
          />
        </h5>
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

        <h5>
          <Trans
            i18nKey={`data.register.nameWithLink.Muinaisjäännösrekisteri`}
            components={{ a: <a /> }}
          />
        </h5>
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

      <LayerTransparencyInput
        opacity={opacity}
        layerGroup={LayerGroup.Museovirasto}
      />

      <small className="pull-right">{t(`settings.museovirasto.licence`)}</small>
    </Panel>
  )
}
