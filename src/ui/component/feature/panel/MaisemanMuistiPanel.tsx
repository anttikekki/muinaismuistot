import React from "react"
import {
  ModelFeatureProperties,
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../../../../common/types"
import {
  FeatureTitleClickAction,
  MaisemanMuistiFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLinkDirect } from "../component/MuseovirastoLink"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { MaisemanMuistiField } from "../component/MaisemanMuistiField"
import { trim } from "../../../../common/util/featureParser"
import { TimespanLabel } from "../component/TimespanLabel"
import { useTranslation } from "react-i18next"

interface Props {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>
  models?: Array<GeoJSONFeature<ModelFeatureProperties>>
}

export const MaisemanMuistiPanel: React.FC<Props> = ({
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature,
  models = []
}) => {
  const { t } = useTranslation()
  return (
    <MaisemanMuistiFeatureCollapsePanel
      titleClickAction={titleClickAction}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
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

        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </MaisemanMuistiFeatureCollapsePanel>
  )
}
