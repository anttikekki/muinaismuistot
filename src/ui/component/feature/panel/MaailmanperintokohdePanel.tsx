import React from "react"
import { useTranslation } from "react-i18next"
import {
  MaailmanperintoAlueWmsFeature,
  MaailmanperintoPisteWmsFeature
} from "../../../../common/museovirasto.types"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
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
      <form>
        <Field
          label={t(`details.field.name`)}
          value={feature.properties.Nimi}
        />
        <MuseovirastoLink feature={feature} />
      </form>
    </MapFeatureCollapsePanel>
  )
}
