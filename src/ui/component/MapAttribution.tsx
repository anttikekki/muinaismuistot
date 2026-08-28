import React, { useCallback } from "react"
import { Dropdown } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { ActionTypeEnum } from "../../store/actionTypes"
import { AppDispatch, PageId, Settings } from "../../store/storeTypes"

export const MapAttribution: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const settings = useSelector((state: Settings) => state)

  const showLicences = useCallback(() => {
    dispatch({ type: ActionTypeEnum.SHOW_PAGE, pageId: PageId.Info })
  }, [dispatch])

  const sources = [
    settings.maanmittauslaitos.basemap.enabled ||
    settings.maanmittauslaitos.vanhatKartat.enabled
      ? "mml"
      : undefined,
    settings.museovirasto.enabled &&
    settings.museovirasto.selectedLayers.length > 0
      ? "museovirasto"
      : undefined,
    settings.ahvenanmaa.enabled && settings.ahvenanmaa.selectedLayers.length > 0
      ? "ahvenanmaa"
      : undefined,
    settings.gtk.enabled && settings.gtk.selectedLayers.length > 0
      ? "gtk"
      : undefined,
    settings.helsinki.enabled && settings.helsinki.selectedLayers.length > 0
      ? "helsinki"
      : undefined,
    settings.maannousuInfo.enabled ? "maannousuInfo" : undefined,
    settings.viabundus.enabled ? "viabundus" : undefined,
    settings.models.enabled ? "models" : undefined,
    settings.maisemanMuisti.enabled ? "maisemanMuisti" : undefined
  ].filter((source): source is string => source !== undefined)

  return (
    <Dropdown id="map-attribution" drop="up" align="end">
      <Dropdown.Toggle
        size="sm"
        variant="light"
        title={t("mapAttribution.title")}
      >
        <i className="bi bi-info-circle me-1" aria-hidden="true" />
        {t("mapAttribution.button")}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Header>{t("mapAttribution.title")}</Dropdown.Header>
        <div className="map-attribution-sources">
          {sources.map((source) => (
            <div key={source}>
              <Trans
                i18nKey={`mapAttribution.sources.${source}`}
                components={{ a: <a target="_blank" rel="noreferrer" /> }}
              />
            </div>
          ))}
        </div>
        <Dropdown.Divider />
        <Dropdown.Item as="button" onClick={showLicences}>
          {t("mapAttribution.showAll")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
