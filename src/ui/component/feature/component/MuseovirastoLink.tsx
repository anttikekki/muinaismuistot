import React from "react"
import { Alert, Col, Row } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { Language } from "../../../../common/layers.types"
import { MuseovirastoWmsFeature } from "../../../../common/museovirasto.types"
import {
  getFeatureRegisterName,
  getFeatureRegisterURL
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
    <Alert variant="light">
      <Trans
        i18nKey="details.finnishHeritageAgencyMoreInfoLink"
        values={{ url, registerName }}
        components={{ a: <Alert.Link /> }}
      />
    </Alert>
  )
}

interface MuseovirastoLinkProps {
  feature: MuseovirastoWmsFeature
}

export const MuseovirastoLink: React.FC<MuseovirastoLinkProps> = ({
  feature
}) => {
  const { t, i18n } = useTranslation()
  const url = getFeatureRegisterURL(feature, i18n.language as Language)
  const registerName = getFeatureRegisterName(t, feature)
  if (!url) {
    return null
  }

  return (
    <Row className="mt-2">
      <Col>
        <MuseovirastoLinkDirect url={url} registerName={registerName} />
      </Col>
    </Row>
  )
}
