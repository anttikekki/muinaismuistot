import React, { useCallback } from "react"
import { Button } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { ActionTypeEnum } from "../../../store/actionTypes"
import { AppDispatch, PageId } from "../../../store/storeTypes"

export const ShowInfoPageButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const onClick = useCallback(() => {
    dispatch({
      type: ActionTypeEnum.SHOW_PAGE,
      pageId: PageId.Info
    })
  }, [dispatch])

  return (
    <div id="map-button-info" className="map-button">
      <Button
        variant="primary"
        size="sm"
        title={t(`common.button.info`) ?? undefined}
        onClick={onClick}
      >
        <i className="bi bi-info-circle" aria-hidden="true" />
      </Button>
    </div>
  )
}
