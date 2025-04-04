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
  disabled?: boolean
}

export const LayerTransparencyInput: React.FC<Props> = ({
  opacity,
  layerGroup,
  disabled
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

  return (
    <>
      <h6>{t(`settings.common.transparency`)}</h6>
      <Form.Group>
        <Form.Range
          min="0"
          max="100"
          disabled={disabled}
          onChange={onTransparencyInputChange}
          value={transparency}
        />
      </Form.Group>
    </>
  )
}
