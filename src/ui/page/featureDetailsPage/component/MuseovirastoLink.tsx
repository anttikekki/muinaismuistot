import * as React from "react"
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
      Lisää tietoa kohteesta Museoviraston{" "}
      <a href={url} target="_blank">
        {registerName}
      </a>
      .
    </p>
  )
}

interface MuseovirastoLinkProps {
  feature: ArgisFeature
}

export const MuseovirastoLink: React.FC<MuseovirastoLinkProps> = ({
  feature
}) => {
  const url = getFeatureRegisterURL(feature)
  const registerName = getFeatureRegisterName(feature)
  if (!url) {
    return null
  }

  return <MuseovirastoLinkDirect url={url} registerName={registerName} />
}
