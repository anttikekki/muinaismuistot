import React, { useCallback } from "react"
import { Accordion, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { LayerGroup, ModelLayer } from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { LayerFeatureIcons } from "../../../component/LayerFeatureIcons"

export const ModelsLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { enabled } = useSelector((settings: Settings) => settings.models)

  const onSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.Models,
        enabled
      }),
    [dispatch]
  )

  const title = t(`settings.3Dmodels.title`)

  return (
    <Accordion.Item eventKey={LayerGroup.Models}>
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
              i18nKey="data.register.nameWithLink.3Dmodels"
              components={{ a: <a /> }}
            />
          </h6>
          <Form.Group className="mb-3">
            <LayerFeatureIcons
              layer={ModelLayer.ModelLayer}
              label={t(`common.features.3D-malli`)}
            />
          </Form.Group>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  )
}
