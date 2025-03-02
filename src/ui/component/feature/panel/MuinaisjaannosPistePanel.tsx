import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import {
  MuinaisjaannosPisteWmsFeature,
  MuuKulttuuriperintokohdePisteWmsFeature
} from "../../../../common/museovirasto.types"
import {
  getArkeologisenKulttuuriperinnonOpasLinkForSubType,
  getArkeologisenKulttuuriperinnonOpasLinkForType
} from "../../../../common/util/wikiLinkHelper"
import { Link } from "../../Link"
import { EmbeddedModels } from "../component/EmbeddedModels"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MaisemanMuistiField } from "../component/MaisemanMuistiField"
import { MuseovirastoLink } from "../component/MuseovirastoLink"
import { TimespanLabel } from "../component/TimespanLabel"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature:
    | MuinaisjaannosPisteWmsFeature
    | MuuKulttuuriperintokohdePisteWmsFeature
}

function renderList<T extends string>(
  data: Array<T>,
  contentFn: (row: T) => JSX.Element
) {
  if (data.length === 0) {
    return null
  }
  if (data.length === 1) {
    return contentFn(data[0])
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
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  const {
    kohdenimi,
    kunta,
    ajoitusSplitted,
    tyyppiSplitted,
    alatyyppiSplitted
  } = feature.properties
  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field label={t(`details.field.featureName`)} value={kohdenimi} />
        <Field label={t(`details.field.municipality`)} value={kunta} />
        <Field label={t(`details.field.dating`)}>
          {renderList(ajoitusSplitted, (ajoitus) => (
            <div>
              <span>{t(`data.museovirasto.dating.${ajoitus}`, ajoitus)}</span>
              <TimespanLabel dating={ajoitus} />
            </div>
          ))}
        </Field>
        <Field label={t(`details.field.type`)}>
          {renderList(tyyppiSplitted, (tyyppi) => {
            return (
              <Link
                text={t(`data.museovirasto.type.${tyyppi}`, tyyppi)}
                url={getArkeologisenKulttuuriperinnonOpasLinkForType(tyyppi)}
              />
            )
          })}
        </Field>
        <Field label={t(`details.field.subType`)}>
          {renderList(alatyyppiSplitted, (alatyyppi) => {
            return (
              <Link
                text={t(`data.museovirasto.subtype.${alatyyppi}`, alatyyppi)}
                url={getArkeologisenKulttuuriperinnonOpasLinkForSubType(
                  alatyyppi
                )}
              />
            )
          })}
        </Field>

        {feature.maisemanMuisti.length > 0 && (
          <MaisemanMuistiField feature={feature.maisemanMuisti[0]} />
        )}

        <MuseovirastoLink feature={feature} />

        {commonProps.isOpen && <EmbeddedModels models={feature.models} />}
      </Form>
    </MapFeatureCollapsePanel>
  )
}
