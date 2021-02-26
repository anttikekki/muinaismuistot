import React, { useCallback } from "react"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { GtkLayer, LayerGroup } from "../../../../common/types"
import { selectGTKLayer } from "../../../../store/actionCreators"
import { Settings } from "../../../../store/storeTypes"
import { Panel } from "../../../component/Panel"
import { toggleSelection } from "../../../util"
import { FeatureImageAndLabel } from "./FeatureImageAndLabel"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

export const GTKMapLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const selectedLayers = useSelector(
    (settings: Settings) => settings.gtk.selectedLayers
  )
  const opacity = useSelector((settings: Settings) => settings.gtk.opacity)
  const onSelectLayer = useCallback(
    (layer: GtkLayer) => {
      dispatch(selectGTKLayer(toggleSelection(layer, selectedLayers)))
    },
    [dispatch, selectedLayers]
  )

  return (
    <Panel title={t(`settings.gtk.title`)}>
      <form>
        <h5>
          <label>
            <input
              type="checkbox"
              onChange={() => onSelectLayer(GtkLayer.muinaisrannat)}
              checked={selectedLayers.includes(GtkLayer.muinaisrannat)}
            />{" "}
            <Trans
              i18nKey={`data.gtk.layer.${GtkLayer.muinaisrannat}`}
              components={{ a: <a /> }}
            />
          </label>
        </h5>

        <FeatureImageAndLabel
          iconPath="images/muinaisrannat_supra_akvaattinen.png"
          label={t(`data.gtk.feature.supra-akvaattinen`)}
        />
        <FeatureImageAndLabel
          iconPath="images/muinaisrannat_yoldia.png"
          label={t(`data.gtk.feature.yoldia`)}
        />
        <FeatureImageAndLabel
          iconPath="images/muinaisrannat_litorina.png"
          label={t(`data.gtk.feature.litorina`)}
        />

        <LayerTransparencyInput opacity={opacity} layerGroup={LayerGroup.GTK} />

        <small className="pull-right">{t(`settings.gtk.licence`)}</small>
      </form>
    </Panel>
  )
}
