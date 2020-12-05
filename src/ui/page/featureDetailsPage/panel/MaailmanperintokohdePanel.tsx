import * as React from "react"
import {
  MaailmanperintoPisteArgisFeature,
  MaailmanperintoAlueArgisFeature
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props {
  isOpen: boolean
  onToggleOpen: () => void
  feature: MaailmanperintoPisteArgisFeature | MaailmanperintoAlueArgisFeature
}

export const MaailmanperintokohdePanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature
}) => {
  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
      <form>
        <Field label="Kohdenimi" value={feature.attributes.Nimi} />
        <MuseovirastoLink feature={feature} />
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
