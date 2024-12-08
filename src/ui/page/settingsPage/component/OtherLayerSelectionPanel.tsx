import React, { useCallback } from "react"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  MaisemanMuistiLayer,
  ModelLayer
} from "../../../../common/layers.types"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { selectVisibleMaisemanMuistiLayerThunk } from "../../../../store/thunks/maisemanMuistiLayer"
import { selectVisibleModelsLayerThunk } from "../../../../store/thunks/modelsLayer"
import { Panel } from "../../../component/Panel"
import { toggleSelection } from "../../../util"
import { LayerCheckbox } from "./LayerCheckbox"

export const OtherLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const selectedModelLayers = useSelector(
    (settings: Settings) => settings.models.selectedLayers
  )
  const selectedMaisemanMuistiLayers = useSelector(
    (settings: Settings) => settings.maisemanMuisti.selectedLayers
  )
  const onSelectModelLayer = useCallback(
    (layer: ModelLayer) =>
      dispatch(
        selectVisibleModelsLayerThunk(
          toggleSelection(layer, selectedModelLayers)
        )
      ),
    [dispatch, selectedModelLayers]
  )
  const onSelectMaisemanMuistiLayer = useCallback(
    (layer: MaisemanMuistiLayer) =>
      dispatch(
        selectVisibleMaisemanMuistiLayerThunk(
          toggleSelection(layer, selectedMaisemanMuistiLayers)
        )
      ),
    [dispatch, selectedMaisemanMuistiLayers]
  )

  return (
    <Panel title={t(`settings.other.title`)}>
      <form>
        <h5>
          <Trans
            i18nKey="data.register.nameWithLink.3Dmodels"
            components={{ a: <a /> }}
          />
        </h5>
        <LayerCheckbox
          label={t(`common.features.3D-malli`)}
          layer={ModelLayer.ModelLayer}
          selectedLayers={selectedModelLayers}
          onSelectLayer={onSelectModelLayer}
        />

        <h5>
          <Trans
            i18nKey="data.register.nameWithLink.maisemanMuisti"
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
