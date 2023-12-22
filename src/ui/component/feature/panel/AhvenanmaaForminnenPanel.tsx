import React from "react"
import { useTranslation } from "react-i18next"
import {
  ArgisFeatureCollapsePanel,
  FeatureTitleClickAction
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { AhvenanmaaTypeAndDatingField } from "../component/AhvenanmaaTypeAndDatingField"
import { AhvenanmaaForminnenArgisFeature } from "../../../../common/ahvenanmaa.types"

interface Props {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: AhvenanmaaForminnenArgisFeature
}

export const AhvenanmaaForminnenPanel: React.FC<Props> = ({
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature
}) => {
  const { t } = useTranslation()
  return (
    <ArgisFeatureCollapsePanel
      titleClickAction={titleClickAction}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
      <form>
        <Field
          label={t(`details.field.id`)}
          value={feature.attributes["Fornlämnings ID"]}
        />
        <Field
          label={t(`details.field.name`)}
          value={feature.attributes.Namn}
        />
        <Field
          label={t(`details.field.municipality`)}
          value={feature.attributes.Kommun}
        />
        <Field
          label={t(`details.field.village`)}
          value={feature.attributes.By}
        />
        <AhvenanmaaTypeAndDatingField feature={feature} />
        <Field
          label={t(`details.field.description`)}
          value={feature.attributes.Beskrivning}
        />
        <Field
          label={t(`details.field.location`)}
          value={feature.attributes.Topografi}
        />

        {isOpen && <EmbeddedModels models={feature.models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
