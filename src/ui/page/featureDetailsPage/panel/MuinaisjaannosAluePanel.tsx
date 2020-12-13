import * as React from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
      <form>
        <Field
          label={t(`details.field.name`)}
          value={feature.attributes.kohdenimi}
        />
        <Field
          label={t(`details.field.municipality`)}
          value={feature.attributes.kunta}
        />
        <Field
          label={t(`details.field.featureType`)}
          value={feature.attributes.laji}
        />
        <MuseovirastoLink feature={feature} />
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
