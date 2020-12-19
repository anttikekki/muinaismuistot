import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  MaailmanperintoPisteArgisFeature,
  MaailmanperintoAlueArgisFeature
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props {
  isOpen: boolean
  featureUniqueId: string
  feature: MaailmanperintoPisteArgisFeature | MaailmanperintoAlueArgisFeature
}

export const MaailmanperintokohdePanel: React.FC<Props> = ({
  isOpen,
  featureUniqueId,
  feature
}) => {
  const { t } = useTranslation()
  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      featureUniqueId={featureUniqueId}
      feature={feature}
    >
      <form>
        <Field
          label={t(`details.field.name`)}
          value={feature.attributes.Nimi}
        />
        <MuseovirastoLink feature={feature} />
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
