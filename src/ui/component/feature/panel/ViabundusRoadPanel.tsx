import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { ViabundusRoadFeature } from "../../../../common/viabundus.types"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { FeatureGeometryDownloadLink } from "../component/FeatureGeometryDownloadLink"
import { Field } from "../component/Field"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: ViabundusRoadFeature
}

export const ViabundusRoadPanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  const { fromyear, toyear, descriptionFI } = feature.properties

  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        {(fromyear || toyear) && (
          <Field
            label={t(`details.field.dating`)}
            value={`${fromyear ?? ""} - ${toyear ?? ""}`}
            suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
          />
        )}

        <Field label={t(`details.field.description`)} value={descriptionFI} />
      </Form>
    </MapFeatureCollapsePanel>
  )
}
