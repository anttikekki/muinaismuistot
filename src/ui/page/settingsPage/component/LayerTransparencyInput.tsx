import React, { useCallback } from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { LayerGroup } from "../../../../common/layers.types"
import { AppDispatch } from "../../../../store/storeTypes"
import { changeLayerOpacityThunk } from "../../../../store/thunks/opacity"

interface Props {
  opacity: number
  layerGroup: LayerGroup
}

export const LayerTransparencyInput: React.FC<Props> = ({
  opacity,
  layerGroup
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const transparency = Number((1 - opacity) * 100).toFixed(0)
  const onTransparencyInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let transparency = Number(e.target.value)
      if (transparency > 100) {
        transparency = 100
      }
      const opacity = Number((1 - transparency / 100).toFixed(2))
      dispatch(changeLayerOpacityThunk(opacity, layerGroup))
    },
    [dispatch, transparency, layerGroup]
  )
  const inputId = `${layerGroup}-transparancy-input`

  return (
    <>
      <h6>{t(`settings.common.transparency`)}</h6>
      <Form.Group>
        <input
          id={inputId}
          className="form-control ms-3"
          style={{ width: "auto" }}
          type="number"
          min="0"
          max="100"
          step="5"
          onChange={onTransparencyInputChange}
          value={transparency}
        />
      </Form.Group>
    </>
  )
}
