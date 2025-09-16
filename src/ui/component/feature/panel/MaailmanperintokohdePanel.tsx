import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import {
  MaailmanperintoAlueWmsFeature,
  MaailmanperintoPisteWmsFeature
} from "../../../../common/museovirasto.types"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { FeatureGeometryDownloadLink } from "../component/FeatureGeometryDownloadLink"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: MaailmanperintoPisteWmsFeature | MaailmanperintoAlueWmsFeature
}

export const MaailmanperintokohdePanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.name`)}
          value={feature.properties.Nimi}
          suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
        />
        <MuseovirastoLink feature={feature} />
      </Form>
    </MapFeatureCollapsePanel>
  )
}
