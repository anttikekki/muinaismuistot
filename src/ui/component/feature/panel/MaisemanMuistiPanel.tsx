import React from "react"
import { useTranslation } from "react-i18next"
import { ModelFeatureProperties } from "../../../../common/3dModels.types"
import { GeoJSONFeature } from "../../../../common/geojson.types"
import { MaisemanMuistiFeatureProperties } from "../../../../common/maisemanMuisti.types"
import { trim } from "../../../../common/util/featureParser"
import { EmbeddedModels } from "../component/EmbeddedModels"
import {
  FeatureCollapsePanelCommonExternalProps,
  MaisemanMuistiFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MaisemanMuistiField } from "../component/MaisemanMuistiField"
import { MuseovirastoLinkDirect } from "../component/MuseovirastoLink"
import { TimespanLabel } from "../component/TimespanLabel"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>
  models?: Array<GeoJSONFeature<ModelFeatureProperties>>
}

export const MaisemanMuistiPanel: React.FC<Props> = ({
  feature,
  models = [],
  ...commonProps
}) => {
  const { t } = useTranslation()
  return (
    <MaisemanMuistiFeatureCollapsePanel feature={feature} {...commonProps}>
      <form>
        <Field
          label={t(`details.field.featureName`)}
          value={feature.properties.registerName}
        />
        <Field
          label={t(`details.field.municipality`)}
          value={feature.properties.municipality}
        />
        <Field
          label={t(`details.field.region`)}
          value={feature.properties.region}
        />
        <Field label={t(`details.field.dating`)}>
          <p>
            <span>{trim(feature.properties.dating)}</span>{" "}
            <TimespanLabel dating={feature.properties.dating} />
          </p>
        </Field>
        <Field
          label={t(`details.field.type`)}
          value={feature.properties.type}
        />
        <Field
          label={t(`details.field.subType`)}
          value={feature.properties.subtype}
        />
        <MaisemanMuistiField feature={feature} />
        <MuseovirastoLinkDirect
          url={`https://www.kyppi.fi/to.aspx?id=112.${feature.properties.id}`}
          registerName="Muinaisjäännösrekisteristä"
        />

        {commonProps.isOpen && <EmbeddedModels models={models} />}
      </form>
    </MaisemanMuistiFeatureCollapsePanel>
  )
}
