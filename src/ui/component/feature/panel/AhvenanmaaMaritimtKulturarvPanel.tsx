import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { AhvenanmaaMaritimtKulturarvArgisFeature } from "../../../../common/ahvenanmaa.types"
import { EmbeddedModels } from "../component/EmbeddedModels"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { FeatureGeometryDownloadLink } from "../component/FeatureGeometryDownloadLink"
import { Field } from "../component/Field"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: AhvenanmaaMaritimtKulturarvArgisFeature
}

export const AhvenanmaaMaritimtKulturarvPanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.id`)}
          value={feature.attributes.FornID}
          suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
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

        {commonProps.isOpen && <EmbeddedModels models={feature.models} />}
      </Form>
    </MapFeatureCollapsePanel>
  )
}
