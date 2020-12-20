import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  AhvenanmaaForminnenArgisFeature,
  ModelFeatureProperties
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { AhvenanmaaTypeAndDatingField } from "../component/AhvenanmaaTypeAndDatingField"
import { Form } from "react-bootstrap"

interface Props {
  isOpen: boolean
  featureUniqueId: string
  feature: AhvenanmaaForminnenArgisFeature
  models?: Array<ModelFeatureProperties>
}

export const AhvenanmaaForminnenPanel: React.FC<Props> = ({
  isOpen,
  featureUniqueId,
  feature,
  models = []
}) => {
  const { t } = useTranslation()
  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      featureUniqueId={featureUniqueId}
      feature={feature}
      has3dModels={models.length > 0}
    >
      <Form>
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

        {isOpen && <EmbeddedModels models={models} />}
      </Form>
    </ArgisFeatureCollapsePanel>
  )
}
