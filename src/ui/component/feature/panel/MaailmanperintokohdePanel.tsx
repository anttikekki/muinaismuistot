import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  MaailmanperintoPisteArgisFeature,
  MaailmanperintoAlueArgisFeature
} from "../../../../common/types"
import {
  ArgisFeatureCollapsePanel,
  FeatureTitleClickAction
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props {
  hidePage: () => void
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: MaailmanperintoPisteArgisFeature | MaailmanperintoAlueArgisFeature
}

export const MaailmanperintokohdePanel: React.FC<Props> = ({
  hidePage,
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature
}) => {
  const { t } = useTranslation()
  return (
    <ArgisFeatureCollapsePanel
      hidePage={hidePage}
      titleClickAction={titleClickAction}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
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
