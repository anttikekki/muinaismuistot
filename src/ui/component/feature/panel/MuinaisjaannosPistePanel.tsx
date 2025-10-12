import React, { useMemo } from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import {
  isAlakohdePisteFeature,
  MuinaisjäännörekisteriPisteFeature
} from "../../../../common/museovirasto.types"
import {
  isMuinaisjaannosAjoitus,
  isMuinaisjaannosTyyppi,
  splitMuinaisjaannosAjoitus,
  splitMuinaisjaannosAlatyyppi,
  splitMuinaisjaannosTyyppi
} from "../../../../common/util/featureParser"
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
import { FeatureGeometryDownloadLink } from "../component/FeatureGeometryDownloadLink"
import { Field } from "../component/Field"
import { List } from "../component/List"
import { MaisemanMuistiField } from "../component/MaisemanMuistiField"
import { MuseovirastoLink } from "../component/MuseovirastoLink"
import { TimespanLabel } from "../component/TimespanLabel"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: MuinaisjäännörekisteriPisteFeature
}

export const MuinaisjaannosPistePanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  const { kohdenimi, kunta, mjtunnus } = feature.properties

  const tyypit = useMemo(() => splitMuinaisjaannosTyyppi(feature), [feature])
  const alatyypit = useMemo(
    () => splitMuinaisjaannosAlatyyppi(feature),
    [feature]
  )
  const ajoitukset = useMemo(
    () => splitMuinaisjaannosAjoitus(feature),
    [feature]
  )

  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.featureName`)}
          value={kohdenimi}
          suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
        />
        <Field label={t(`details.field.municipality`)} value={kunta} />
        <Field label={t(`details.field.dating`)}>
          <List
            data={ajoitukset}
            contentFn={(ajoitus) => (
              <div>
                <span>{t(`data.museovirasto.dating.${ajoitus}`, ajoitus)}</span>
                {isMuinaisjaannosAjoitus(ajoitus) && (
                  <TimespanLabel dating={ajoitus} />
                )}
              </div>
            )}
          />
        </Field>
        <Field label={t(`details.field.type`)}>
          <List
            data={tyypit}
            contentFn={(tyyppi) =>
              isMuinaisjaannosTyyppi(tyyppi) ? (
                <Link
                  text={t(`data.museovirasto.type.${tyyppi}`, tyyppi)}
                  url={getArkeologisenKulttuuriperinnonOpasLinkForType(tyyppi)}
                />
              ) : (
                tyyppi
              )
            }
          />
        </Field>
        <Field label={t(`details.field.subType`)}>
          <List
            data={alatyypit}
            contentFn={(alatyyppi) => (
              <Link
                text={t(`data.museovirasto.subtype.${alatyyppi}`, alatyyppi)}
                url={getArkeologisenKulttuuriperinnonOpasLinkForSubType(
                  alatyyppi
                )}
              />
            )}
          />
        </Field>
        <Field label={t(`details.field.id`)} value={String(mjtunnus)} />
        {isAlakohdePisteFeature(feature) && (
          <Field
            label={t(`details.field.alakohdetunnus`)}
            value={String(feature.properties.alakohdetunnus)}
          />
        )}

        {feature.maisemanMuisti.length > 0 && (
          <MaisemanMuistiField feature={feature.maisemanMuisti[0]} />
        )}

        <MuseovirastoLink feature={feature} />

        {commonProps.isOpen && <EmbeddedModels models={feature.models} />}
      </Form>
    </MapFeatureCollapsePanel>
  )
}
