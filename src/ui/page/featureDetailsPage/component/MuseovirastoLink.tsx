import * as React from "react"
import { ArgisFeature } from "../../../../common/types"
import {
  getFeatureRegisterURL,
  getFeatureRegisterName
} from "../../../../common/util/featureParser"

interface Props {
  feature: ArgisFeature
}

export const MuseovirastoLink: React.FC<Props> = ({ feature }) => {
  let url = getFeatureRegisterURL(feature)
  let registerName = getFeatureRegisterName(feature)
  if (!url) {
    return null
  }

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
