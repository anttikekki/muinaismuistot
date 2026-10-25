import React, { useState } from "react"
import { Alert } from "react-bootstrap"
import { useTranslation } from "react-i18next"

export const ServiceOutageNotice: React.FC = () => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(true)

  return (
    <Alert
      variant="warning"
      className="shadow-sm"
      id="service-outage-notice"
      show={visible}
      dismissible
      closeLabel={t("common.button.close")}
      onClose={() => setVisible(false)}
    >
      <div className="d-flex gap-2">
        <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
        <div>
          <strong>{t("serviceOutage.title")}</strong>
          <p className="mt-1 mb-2">{t("serviceOutage.description")}</p>
          <a
            className="alert-link"
            href={t("serviceOutage.url")}
          >
            {t("serviceOutage.link")}
          </a>
        </div>
      </div>
    </Alert>
  )
}
