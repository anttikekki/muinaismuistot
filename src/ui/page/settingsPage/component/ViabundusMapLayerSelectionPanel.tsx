import React, { useCallback } from "react"
import { Accordion, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { LayerGroup } from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { FeatureImageAndLabel } from "./FeatureImageAndLabel"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

export const ViabundusMapLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { enabled, opacity, selectedYear } = useSelector(
    (settings: Settings) => settings.viabundus
  )

  const onSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.Viabundus,
        enabled
      }),
    [dispatch]
  )
  const onYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const year = Number(e.target.value)
      dispatch({
        type: ActionTypeEnum.SELECT_VIABUNDUS_YEAR,
        year
      })
    },
    [dispatch]
  )

  const title = t(`settings.viabundus.title`)

  return (
    <Accordion.Item eventKey={LayerGroup.Viabundus}>
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
          <h6>
            <Trans
              i18nKey={`data.register.nameWithLink.viabundus`}
              components={{ a: <a /> }}
            />
          </h6>

          <Form.Group className="mb-4">
            <FeatureImageAndLabel
              iconPath="images/viabundus-kaupunki.png"
              label={t(`data.viabundus.place.town`)}
            />
            <FeatureImageAndLabel
              iconPath="images/viabundus-asuttu-paikka.png"
              label={t(`data.viabundus.place.settlement`)}
            />
            <FeatureImageAndLabel
              iconPath="images/viabundus-silta.png"
              label={t(`data.viabundus.place.bridge`)}
            />
            <FeatureImageAndLabel
              iconPath="images/viabundus-satama.png"
              label={t(`data.viabundus.place.harbour`)}
            />
            <FeatureImageAndLabel
              iconPath="images/viabundus-lossi.png"
              label={t(`data.viabundus.place.ferry`)}
            />
            <FeatureImageAndLabel
              iconPath="images/viabundus-tulli.png"
              label={t(`data.viabundus.place.toll`)}
            />
            <FeatureImageAndLabel
              iconPath="images/viabundus-maantie.png"
              label={t(`data.viabundus.road.land`)}
            />
            <FeatureImageAndLabel
              iconPath="images/viabundus-talvitie.png"
              label={t(`data.viabundus.road.winter`)}
            />
            <FeatureImageAndLabel
              iconPath="images/viabundus-vesivayla.png"
              label={t(`data.viabundus.road.coast`)}
            />
          </Form.Group>

          <h6>
            <Trans
              i18nKey={`settings.viabundus.year`}
              values={{ selectedYear }}
            />
          </h6>
          <Form.Range
            min="1350"
            max="1650"
            disabled={!enabled}
            onChange={onYearChange}
            value={selectedYear}
          />

          <LayerTransparencyInput
            opacity={opacity}
            layerGroup={LayerGroup.Viabundus}
            disabled={!enabled}
          />

          <Form.Text>
            <Trans
              i18nKey="settings.viabundus.licence"
              components={{ a: <a /> }}
            />
          </Form.Text>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  )
}
