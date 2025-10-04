import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { ViabundusTownOutlineFeature } from "../../../../common/viabundus.types"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { FeatureGeometryDownloadLink } from "../component/FeatureGeometryDownloadLink"
import { Field } from "../component/Field"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: ViabundusTownOutlineFeature
}

export const ViabundusTownOutlinePanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  const {name, fromyear, toyear} = feature.properties
  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.name`)}
          value={name}
          suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
        />

        {(fromyear || toyear) && (
                <Field
                  label={t(`details.field.dating`)}
                  value={`${fromyear ?? ""} - ${toyear ?? ""}`}
                />
              )}
      </Form>
    </MapFeatureCollapsePanel>
  )
}
