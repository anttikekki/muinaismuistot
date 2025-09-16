import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { MapFeature } from "../../../../common/mapFeature.types"
import {
  isMuinaisjaannosPisteWmsFeature,
  isMuseovirastoWmsFeature,
  isMuuKulttuuriperintokohdePisteWmsFeature
} from "../../../../common/museovirasto.types"
import {
  getFeatureID,
  getFeatureName
} from "../../../../common/util/featureParser"

type Props = {
  feature: MapFeature
}

export const FeatureGeometryDownloadLink: React.FC<Props> = ({ feature }) => {
  const { t } = useTranslation()
  const [downloadUrl, setDownloadUrl] = useState("")

  useEffect(() => {
    const geoJSON = {
      type: "FeatureCollection",
      crs: {
        type: "EPSG",
        properties: {
          code: 3067 // ETRS-TM35FIN
        }
      },
      features: [cleanFeatureJSON(feature)]
    }

    // Convert JSON to Blob
    const geoJSONString = JSON.stringify(geoJSON, null, 2)
    const blob = new Blob([geoJSONString], { type: "application/geo+json" })

    // Create URL for blob
    const url = URL.createObjectURL(blob)
    setDownloadUrl(url)

    // Cleanup: revoke URL when component unmounts
    return () => URL.revokeObjectURL(url)
  }, [])

  const fileName = `${getFeatureName(t, feature)}-${getFeatureID(feature)}.geojson`

  return (
    <a
      href={downloadUrl}
      download={fileName}
      title={t("details.field.downloadGeometry")}
    >
      <i className="bi bi-download" aria-hidden="true" />
    </a>
  )
}

// Poista custom-kentät, joita featureiden haku lisää
const cleanFeatureJSON = (feature: MapFeature) => {
  if (
    isMuseovirastoWmsFeature(feature) &&
    (isMuinaisjaannosPisteWmsFeature(feature) ||
      isMuuKulttuuriperintokohdePisteWmsFeature(feature))
  ) {
    const { maisemanMuisti, models, ...cleanFeature } = feature
    const {
      tyyppiSplitted,
      ajoitusSplitted,
      alatyyppiSplitted,
      ...cleanProperties
    } = feature.properties
    return { ...cleanFeature, properties: cleanProperties }
  }

  const { maisemanMuisti, models, ...cleanFeature } = feature
  return cleanFeature
}
