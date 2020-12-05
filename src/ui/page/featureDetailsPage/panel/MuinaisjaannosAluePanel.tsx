import * as React from "react"
import { MuinaisjaannosAlueArgisFeature } from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props {
  isOpen: boolean
  onToggleOpen: () => void
  feature: MuinaisjaannosAlueArgisFeature
}

export const MuinaisjaannosAluePanel: React.FC<Props> = ({
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
        <Field label="Kohdenimi" value={feature.attributes.kohdenimi} />
        <Field label="Kunta" value={feature.attributes.kunta} />
        <Field label="Laji" value={feature.attributes.laji} />
        <MuseovirastoLink feature={feature} />
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
