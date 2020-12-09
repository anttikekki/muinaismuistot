import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  ModelFeatureProperties,
  AhvenanmaaMaritimtKulturarvArgisFeature
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { EmbeddedModels } from "../component/EmbeddedModels"

interface Props {
  isOpen: boolean
  onToggleOpen: () => void
  feature: AhvenanmaaMaritimtKulturarvArgisFeature
  models?: Array<ModelFeatureProperties>
}

export const AhvenanmaaMaritimtKulturarvPanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature,
  models = []
}) => {
  const { t } = useTranslation()
  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
      has3dModels={models.length > 0}
    >
      <form>
        <Field
          label={t(`details.field.id`)}
          value={feature.attributes.FornID}
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
        <Field
          label={t(`details.field.description`)}
          value={feature.attributes.Beskrivning}
        />
        <Field
          label={t(`details.field.precision`)}
          value={feature.attributes.Precision}
        />
        <Field
          label={t(`details.field.legislation`)}
          value={feature.attributes.Lagrum}
        />

        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
