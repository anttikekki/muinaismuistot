import React, { useCallback } from "react"
import { Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { LayerGroup, MuseovirastoLayer } from "../../../../common/layers.types"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { selectVisibleMuseovirastoLayerThunk } from "../../../../store/thunks/museovirastoLayer"
import { Panel } from "../../../component/Panel"
import { toggleSelection } from "../../../util"
import { LayerCheckbox } from "./LayerCheckbox"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

export const MuseovirastoLayerSelectionPanel: React.FC = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const selectedMuseovirastoLayers = useSelector(
    (settings: Settings) => settings.museovirasto.selectedLayers
  )
  const opacity = useSelector(
    (settings: Settings) => settings.museovirasto.opacity
  )
  const onSelectMuseovirastoLayer = useCallback(
    (layer: MuseovirastoLayer) =>
      dispatch(
        selectVisibleMuseovirastoLayerThunk(
          toggleSelection(layer, selectedMuseovirastoLayers)
        )
      ),
    [dispatch, selectedMuseovirastoLayers]
  )

  return (
    <Panel title={t(`settings.museovirasto.title`)}>
      <Form>
        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`}
            components={{ a: <a /> }}
          />
        </h6>
        <Form.Group className="mb-3">
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
        </Form.Group>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Maailmanperintökohteet`}
            components={{ a: <a /> }}
          />
        </h6>
        <Form.Group className="mb-3">
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
        </Form.Group>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Rakennusperintörekisteri`}
            components={{ a: <a /> }}
          />
        </h6>
        <Form.Group className="mb-3">
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
        </Form.Group>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Muinaisjäännösrekisteri`}
            components={{ a: <a /> }}
          />
        </h6>
        <Form.Group className="mb-3">
          <LayerCheckbox
            label={t(`data.featureType.Kiinteä muinaisjäännös (alue)`)}
            layer={MuseovirastoLayer.Muinaisjaannokset_alue}
            selectedLayers={selectedMuseovirastoLayers}
            onSelectLayer={onSelectMuseovirastoLayer}
          />
          <LayerCheckbox
            label={t(`data.featureType.Muu kulttuuriperintökohde (alue)`)}
            layer={MuseovirastoLayer.Muu_kulttuuriperintokohde_alue}
            selectedLayers={selectedMuseovirastoLayers}
            onSelectLayer={onSelectMuseovirastoLayer}
          />
          <LayerCheckbox
            label={t(`data.featureType.Kiinteä muinaisjäännös`)}
            layer={MuseovirastoLayer.Muinaisjaannokset_piste}
            selectedLayers={selectedMuseovirastoLayers}
            onSelectLayer={onSelectMuseovirastoLayer}
          />
          <LayerCheckbox
            label={t(`data.featureType.Muu kulttuuriperintökohde`)}
            layer={MuseovirastoLayer.Muu_kulttuuriperintokohde_piste}
            selectedLayers={selectedMuseovirastoLayers}
            onSelectLayer={onSelectMuseovirastoLayer}
          />
        </Form.Group>

        <LayerTransparencyInput
          opacity={opacity}
          layerGroup={LayerGroup.Museovirasto}
        />

        <Form.Text>{t(`settings.museovirasto.licence`)}</Form.Text>
      </Form>
    </Panel>
  )
}
