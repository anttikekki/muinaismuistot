import React from "react"
import { useTranslation } from "react-i18next"
import {
  MapFeatureCollapsePanel,
  FeatureTitleClickAction
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { AhvenanmaaMaritimtKulturarvArgisFeature } from "../../../../common/ahvenanmaa.types"

interface Props {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: AhvenanmaaMaritimtKulturarvArgisFeature
}

export const AhvenanmaaMaritimtKulturarvPanel: React.FC<Props> = ({
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature
}) => {
  const { t } = useTranslation()
  return (
    <MapFeatureCollapsePanel
      titleClickAction={titleClickAction}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
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

        {isOpen && <EmbeddedModels models={feature.models} />}
      </form>
    </MapFeatureCollapsePanel>
  )
}
