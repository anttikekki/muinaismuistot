import React, { useCallback } from "react"
import { Accordion, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { GtkLayer, LayerGroup } from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { FeatureImageAndLabel } from "./FeatureImageAndLabel"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

export const GTKMapLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { enabled, opacity, selectedLayers } = useSelector(
    (settings: Settings) => settings.gtk
  )

  const onSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.GTK,
        enabled
      }),
    [dispatch]
  )

  const onSelectLayer = useCallback(
    (layer: GtkLayer) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.GTK,
        layers: [layer]
      }),
    [dispatch]
  )

  const title = t(`settings.gtk.title`)

  return (
    <Accordion.Item eventKey={LayerGroup.GTK}>
      <Accordion.Header as="div">
        <Form.Check
          type="switch"
          id={title}
          checked={enabled}
          onClick={(event) => event.stopPropagation()}
          onChange={() => onSwitchChange(!enabled)}
        />
        {title}
      </Accordion.Header>
      <Accordion.Body>
        <Form>
          <div className="h6">
            <Form.Check
              type="radio"
              name="GtkLayer"
              id={GtkLayer.muinaisrannat}
              onChange={() => onSelectLayer(GtkLayer.muinaisrannat)}
              checked={selectedLayers.includes(GtkLayer.muinaisrannat)}
              label={
                <Trans
                  i18nKey={`data.gtk.layer.${GtkLayer.muinaisrannat}`}
                  components={{ a: <a /> }}
                />
              }
              disabled={!enabled}
            ></Form.Check>
          </div>

          <Form.Group className="mb-4">
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
          </Form.Group>

          <div className="h6">
            <Form.Check
              type="radio"
              name="GtkLayer"
              id={GtkLayer.maapera_200k_maalaji}
              onChange={() => onSelectLayer(GtkLayer.maapera_200k_maalaji)}
              checked={selectedLayers.includes(GtkLayer.maapera_200k_maalaji)}
              label={t(`data.gtk.layer.${GtkLayer.maapera_200k_maalaji}`)}
              disabled={!enabled}
            ></Form.Check>
          </div>

          <Form.Group className="mb-4">
            <FeatureImageAndLabel
              iconPath="images/maalajit_kalliopaljastuma.png"
              label={t(`data.gtk.feature.maalajit_kalliopaljastuma`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_kalliomaa.png"
              label={t(`data.gtk.feature.maalajit_kalliomaa`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_rakka.png"
              label={t(`data.gtk.feature.maalajit_rakka`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_kivia.png"
              label={t(`data.gtk.feature.maalajit_kivia`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_sekalajitteinen_maalaji.png"
              label={t(`data.gtk.feature.maalajit_sekalajitteinen_maalaji`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_karkearakenteinen_maalaaji.png"
              label={t(`data.gtk.feature.maalajit_karkearakenteinen_maalaaji`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_hienorakenteinen_maalaji.png"
              label={t(`data.gtk.feature.maalajit_hienorakenteinen_maalaji`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_liejuinen_hienorakenteinen_maalaji.png"
              label={t(
                `data.gtk.feature.maalajit_liejuinen_hienorakenteinen_maalaji`
              )}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_savi.png"
              label={t(`data.gtk.feature.maalajit_savi`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_lieju.png"
              label={t(`data.gtk.feature.maalajit_lieju`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_paksu_turvekerros.png"
              label={t(`data.gtk.feature.maalajit_paksu_turvekerros`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_taytemaa.png"
              label={t(`data.gtk.feature.maalajit_taytemaa`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_kartoittamaton.png"
              label={t(`data.gtk.feature.maalajit_kartoittamaton`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_vesi.png"
              label={t(`data.gtk.feature.maalajit_vesi`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_soistuma.png"
              label={t(`data.gtk.feature.maalajit_soistuma`)}
            />
            <FeatureImageAndLabel
              iconPath="images/maalajit_ohut_turvekerros.png"
              label={t(`data.gtk.feature.maalajit_ohut_turvekerros`)}
            />
          </Form.Group>

          <LayerTransparencyInput
            opacity={opacity}
            layerGroup={LayerGroup.GTK}
            disabled={!enabled}
          />

          <Form.Text>{t(`settings.gtk.licence`)}</Form.Text>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  )
}
