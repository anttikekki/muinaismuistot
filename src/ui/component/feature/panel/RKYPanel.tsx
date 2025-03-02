import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import {
  RKYAlueWmsFeature,
  RKYPisteWmsFeature,
  RKYViivaWmsFeature,
  isRKYAlueWmsFeature
} from "../../../../common/museovirasto.types"
import { EmbeddedModels } from "../component/EmbeddedModels"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: RKYPisteWmsFeature | RKYAlueWmsFeature | RKYViivaWmsFeature
}

export const RKYPanel: React.FC<Props> = ({ feature, ...commonProps }) => {
  const { t } = useTranslation()
  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.featureName`)}
          value={feature.properties.kohdenimi}
        />
        {isRKYAlueWmsFeature(feature) && (
          <Field
            label={t(`details.field.name`)}
            value={feature.properties.nimi}
          />
        )}
        <MuseovirastoLink feature={feature} />
        {commonProps.isOpen && <EmbeddedModels models={feature.models} />}
      </Form>
    </MapFeatureCollapsePanel>
  )
}
