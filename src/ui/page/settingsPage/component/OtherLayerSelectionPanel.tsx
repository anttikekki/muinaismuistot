import React, { useCallback } from "react"
import { ModelLayer, MaisemanMuistiLayer } from "../../../../common/types"
import { Panel } from "../../../component/Panel"
import { Trans, useTranslation } from "react-i18next"
import { LayerCheckbox } from "./LayerCheckbox"
import { useDispatch, useSelector } from "react-redux"
import { Settings } from "../../../../store/storeTypes"
import { toggleSelection } from "../../../util"
import {
  selectMaisemanMuistiLayers,
  selectModelLayers
} from "../../../../store/actionCreators"

export const OtherLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const selectedModelLayers = useSelector(
    (settings: Settings) => settings.models.selectedLayers
  )
  const selectedMaisemanMuistiLayers = useSelector(
    (settings: Settings) => settings.maisemanMuisti.selectedLayers
  )
  const onSelectModelLayer = useCallback(
    (layer: ModelLayer) =>
      dispatch(selectModelLayers(toggleSelection(layer, selectedModelLayers))),
    [dispatch, selectedModelLayers]
  )
  const onSelectMaisemanMuistiLayer = useCallback(
    (layer: MaisemanMuistiLayer) =>
      dispatch(
        selectMaisemanMuistiLayers(
          toggleSelection(layer, selectedMaisemanMuistiLayers)
        )
      ),
    [dispatch, selectedMaisemanMuistiLayers]
  )

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
