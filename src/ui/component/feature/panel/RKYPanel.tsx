import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import {
  RKYAlueFeature,
  RKYPisteFeature,
  RKYViivaFeature,
  isRKYAlueFeature
} from "../../../../common/museovirasto.types"
import { EmbeddedModels } from "../component/EmbeddedModels"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { FeatureGeometryDownloadLink } from "../component/FeatureGeometryDownloadLink"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: RKYPisteFeature | RKYAlueFeature | RKYViivaFeature
}

export const RKYPanel: React.FC<Props> = ({ feature, ...commonProps }) => {
  const { t } = useTranslation()
  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.featureName`)}
          value={feature.properties.kohdenimi}
          suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
        />
        {isRKYAlueFeature(feature) && (
          <Field
            label={t(`details.field.name`)}
            value={feature.properties.nimi}
          />
        )}
        <Field
          label={t(`details.field.id`)}
          value={String(feature.properties.ID)}
        />
        <MuseovirastoLink feature={feature} />
        {commonProps.isOpen && <EmbeddedModels models={feature.models} />}
      </Form>
    </MapFeatureCollapsePanel>
  )
}
