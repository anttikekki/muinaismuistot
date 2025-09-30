import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { ViabundusPlaceFeature } from "../../../../common/viabundus.types"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { FeatureGeometryDownloadLink } from "../component/FeatureGeometryDownloadLink"
import { Field } from "../component/Field"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: ViabundusPlaceFeature
}

export const ViabundusPlacePanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.name`)}
          value={feature.properties.name}
          suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
        />
      </Form>
    </MapFeatureCollapsePanel>
  )
}
