import * as React from "react"
import {
  MuinaisjaannosPisteArgisFeature,
  ModelFeatureProperties,
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { TimespanLabel } from "../component/TimespanLabel"
import { MuseovirastoLink } from "../component/MuseovirastoLink"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { MaisemanMuistiField } from "../component/MaisemanMuistiField"
import { useTranslation } from "react-i18next"

interface Props {
  isOpen: boolean
  featureUniqueId: string
  feature: MuinaisjaannosPisteArgisFeature
  models?: Array<ModelFeatureProperties>
  maisemanMuistiFeatures?: Array<
    GeoJSONFeature<MaisemanMuistiFeatureProperties>
  >
}

function renderList<T extends string>(
  data: Array<T>,
  contentFn: (row: T) => JSX.Element
) {
  if (data.length === 0) {
    return null
  }
  if (data.length === 1) {
    return <p>{contentFn(data[0])}</p>
  }

  return (
    <ul>
      {data.map((row) => (
        <li key={row}>{contentFn(row)}</li>
      ))}
    </ul>
  )
}

export const MuinaisjaannosPistePanel: React.FC<Props> = ({
  isOpen,
  featureUniqueId,
  feature,
  models = [],
  maisemanMuistiFeatures = []
}) => {
  const { t } = useTranslation()
  const {
    kohdenimi,
    kunta,
    ajoitusSplitted,
    tyyppiSplitted,
    alatyyppiSplitted,
    laji
  } = feature.attributes
  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      featureUniqueId={featureUniqueId}
      feature={feature}
      has3dModels={models.length > 0}
      hasMaisemanMuistiFeatures={maisemanMuistiFeatures.length > 0}
    >
      <form>
        <Field label={t(`details.field.featureName`)} value={kohdenimi} />
        <Field label={t(`details.field.municipality`)} value={kunta} />
        <Field label={t(`details.field.dating`)}>
          {renderList(ajoitusSplitted, (ajoitus) => (
            <>
              <span>{t(`data.museovirasto.dating.${ajoitus}`, ajoitus)}</span>{" "}
              <TimespanLabel dating={ajoitus} />
            </>
          ))}
        </Field>
        <Field label={t(`details.field.type`)}>
          {renderList(tyyppiSplitted, (tyyppi) =>
            t(`data.museovirasto.type.${tyyppi}`, tyyppi)
          )}
        </Field>
        <Field label={t(`details.field.subType`)}>
          {renderList(alatyyppiSplitted, (alatyyppi) =>
            t(`data.museovirasto.subtype.${alatyyppi}`, alatyyppi)
          )}
        </Field>
        <Field
          label={t(`details.field.featureType`)}
          value={t(`data.museovirasto.featureType.${laji}`, laji)}
        />

        {maisemanMuistiFeatures.length > 0 && (
          <MaisemanMuistiField feature={maisemanMuistiFeatures[0]} />
        )}

        <MuseovirastoLink feature={feature} />

        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
