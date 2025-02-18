import React from "react"
import { useTranslation } from "react-i18next"
import { AhvenanmaaForminnenArgisFeature } from "../../../../common/ahvenanmaa.types"
import { AhvenanmaaTypeAndDatingField } from "../component/AhvenanmaaTypeAndDatingField"
import { EmbeddedModels } from "../component/EmbeddedModels"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: AhvenanmaaForminnenArgisFeature
}

export const AhvenanmaaForminnenPanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
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

        {commonProps.isOpen && <EmbeddedModels models={feature.models} />}
      </form>
    </MapFeatureCollapsePanel>
  )
}
