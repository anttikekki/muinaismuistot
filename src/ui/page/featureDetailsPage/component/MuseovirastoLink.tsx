import * as React from "react"
import { Card } from "react-bootstrap"
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
    <Card>
      <Card.Body>
        <Card.Text>
          <Trans
            i18nKey="details.finnishHeritageAgencyMoreInfoLink"
            values={{ url, registerName }}
            components={{ a: <a /> }}
          />
        </Card.Text>
      </Card.Body>
    </Card>
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
