import React from "react"
import { Alert } from "react-bootstrap"
import { Trans } from "react-i18next"
import { useSelector } from "react-redux"
import { isWebGLSupported } from "../../../common/util/webGLUtils"
import { Settings } from "../../../store/storeTypes"

export const WebGLErrorMessage: React.FC = () => {
  const { enabled: maannousuInfoEnabled } = useSelector(
    (settings: Settings) => settings.maannousuInfo
  )

  if (maannousuInfoEnabled && !isWebGLSupported()) {
    return (
      <Alert variant="danger" id="webgl-global-error-message">
        <Trans i18nKey={`settings.maannousuInfo.webGLError`} />
      </Alert>
    )
  }
  return <></>
}
