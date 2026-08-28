import React, { useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { MuseovirastoDataSource, Settings } from "../../../../store/storeTypes"

interface MuseovirastoMetadata {
  publishedAt?: string
}

export const DataUpdateDatesPanel: React.FC = () => {
  const { i18n, t } = useTranslation()
  const { dataSource, url } = useSelector(
    (settings: Settings) => settings.museovirasto
  )
  const [museovirastoPublishedAt, setMuseovirastoPublishedAt] = useState<
    Date | null | undefined
  >(undefined)

  useEffect(() => {
    if (dataSource !== MuseovirastoDataSource.PMTiles) return

    const controller = new AbortController()

    fetch(new URL("/api/museovirasto/meta", url.worker), {
      headers: { accept: "application/json" },
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(`Metadata request failed: ${response.status}`)
        const metadata = (await response.json()) as MuseovirastoMetadata
        const publishedAt = metadata.publishedAt
          ? new Date(metadata.publishedAt)
          : null
        setMuseovirastoPublishedAt(
          publishedAt && !Number.isNaN(publishedAt.getTime())
            ? publishedAt
            : null
        )
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setMuseovirastoPublishedAt(null)
      })

    return () => controller.abort()
  }, [dataSource, url.worker])

  const museovirastoUpdateText = (() => {
    if (dataSource !== MuseovirastoDataSource.PMTiles) {
      return t("info.dataUpdates.museovirastoRealtime")
    }
    if (museovirastoPublishedAt === undefined) {
      return t("info.dataUpdates.museovirastoLoading")
    }
    if (museovirastoPublishedAt === null) {
      return t("info.dataUpdates.museovirastoUnavailable")
    }

    const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(museovirastoPublishedAt)

    return t("info.dataUpdates.museovirasto", { date })
  })()

  return (
    <Accordion.Item eventKey="info.dataUpdates.title">
      <Accordion.Header as="div">
        {t(`info.dataUpdates.title`)}
      </Accordion.Header>
      <Accordion.Body>
        <Trans i18nKey={`info.dataUpdates.description`} />
        <ul>
          <li>
            <b>{t(`common.organization.Maanmittauslaitos`)}:</b>{" "}
            {t(`info.dataUpdates.mml`)}
          </li>
          <li>
            <b>{t(`common.organization.Museovirasto`)}:</b>{" "}
            {museovirastoUpdateText}
          </li>
          <li>
            <b>{t(`common.organization.Ahvenanmaan paikallishallinto`)}:</b>{" "}
            {t(`info.dataUpdates.ahvenanmaa`)}
          </li>
          <li>
            <b>{t(`common.organization.Geologian tutkimuskeskus`)}:</b>{" "}
            {t(`info.dataUpdates.gtk`)}
          </li>
          <li>
            <b>{t(`common.organization.Helsingin kaupunki`)}:</b>{" "}
            {t(`info.dataUpdates.helsinki`)}
          </li>
          <li>
            <b>{t(`common.organization.viabundus`)}:</b>{" "}
            {t(`info.dataUpdates.viabundus`)}
          </li>
          <li>
            <b>{t(`common.organization.Maannousu.info`)}:</b>{" "}
            {t(`info.dataUpdates.Maannousu.info`)}
          </li>
        </ul>
      </Accordion.Body>
    </Accordion.Item>
  )
}
