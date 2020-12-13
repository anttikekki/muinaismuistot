import * as React from "react"
import { Trans, useTranslation } from "react-i18next"
import { ArgisFeature } from "../../../../common/types"
import {
  getFeatureRegisterURL,
  getFeatureRegisterName
} from "../../../../common/util/featureParser"

interface MuseovirastoLinkDirectProps {
  url: string
  registerName: string
}

export const MuseovirastoLinkDirect: React.FC<MuseovirastoLinkDirectProps> = ({
  url,
  registerName
}) => {
  return (
    <p className="well">
      <Trans i18nKey="details.finnishHeritageAgencyMoreInfoLink">
        Lisää tietoa kohteesta Museoviraston{" "}
        <a href={url} target="_blank">
          {{ registerName }}
        </a>
        .
      </Trans>
    </p>
  )
}

interface MuseovirastoLinkProps {
  feature: ArgisFeature
}

export const MuseovirastoLink: React.FC<MuseovirastoLinkProps> = ({
  feature
}) => {
  const { t } = useTranslation()
  const url = getFeatureRegisterURL(feature)
  const registerName = getFeatureRegisterName(t, feature)
  if (!url) {
    return null
  }

  return <MuseovirastoLinkDirect url={url} registerName={registerName} />
}
