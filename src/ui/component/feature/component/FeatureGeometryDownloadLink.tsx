import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { isMaisemanMuistiFeature } from "../../../../common/maisemanMuisti.types"
import {
  isEsriJSONFeature,
  MapFeature
} from "../../../../common/mapFeature.types"
import { convertFeatureFromEsriJSONtoGeoJSON } from "../../../../common/util/esriToGeoJSONConverter"
import {
  getFeatureName,
  getFeatureRegisterID
} from "../../../../common/util/featureParser"
import { isViabundusFeature } from "../../../../common/viabundus.types"

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
      features: [cleanAndConvertFeatureJSON(feature)]
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

  const fileName = `${getFeatureName(t, feature)}-${getFeatureRegisterID(feature)}.geojson`

  return (
    <a
      href={downloadUrl}
      download={fileName}
      title={t("details.field.downloadGeometry")}
    >
      <i
        className="bi bi-download"
        aria-hidden="true"
        style={{ fontSize: "1.5rem" }}
      />
    </a>
  )
}

/**
 * Poista custom-kentät, joita featureiden haku lisää.
 * Konvertoi ESRI fearuren GeoJSON featureksi.
 */
const cleanAndConvertFeatureJSON = (feature: MapFeature) => {
  if (isEsriJSONFeature(feature)) {
    return convertFeatureFromEsriJSONtoGeoJSON(feature)
  }
  if (isMaisemanMuistiFeature(feature)) {
    return feature
  }
  if (isViabundusFeature(feature)) {
    return feature
  }

  const { maisemanMuisti, models, ...cleanFeature } = feature
  return cleanFeature
}
