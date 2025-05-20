import React, { useCallback } from "react"
import { Button } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { ActionTypeEnum } from "../../../store/actionTypes"
import { AppDispatch, PageId } from "../../../store/storeTypes"

export const OpenSettingsPage: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const onClick = useCallback(() => {
    dispatch({
      type: ActionTypeEnum.SHOW_PAGE,
      pageId: PageId.Settings
    })
  }, [dispatch])

  return (
    <div id="map-button-settings" className="map-button">
      <Button
        variant="primary"
        size="sm"
        title={t(`common.button.settings`) ?? undefined}
        onClick={onClick}
      >
        <i className="bi bi-gear" aria-hidden="true" />
      </Button>
    </div>
  )
}
