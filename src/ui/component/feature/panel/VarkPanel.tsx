import React, { useMemo } from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { Language } from "../../../../common/layers.types"
import {
  VarkAlueFeature,
  VarkPisteFeature
} from "../../../../common/museovirasto.types"
import {
  getMuinaisjaannosRegisterUrl,
  isMuinaisjaannosTyyppi,
  isVarkAjoitus,
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
import { VarkTimespanLabel } from "../component/TimespanLabel"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: VarkPisteFeature | VarkAlueFeature
}

export const VarkPanel: React.FC<Props> = ({ feature, ...commonProps }) => {
  const { t, i18n } = useTranslation()
  const { VARK_ID, VARK_nimi, Kunta, Maakunta, Mj_kohde, Mj_tunnus } =
    feature.properties

  const tyypit = useMemo(() => splitMuinaisjaannosTyyppi(feature), [feature])
  const alatyypit = useMemo(
    () => splitMuinaisjaannosAlatyyppi(feature),
    [feature]
  )
  const ajoitukset = useMemo(
    () => splitMuinaisjaannosAjoitus(feature),
    [feature]
  )
  const muinaisjäännökset = useMemo(() => {
    const mjTunnukset = Mj_tunnus.split(", ").filter((x) => !!x)
    const mjNimet = Mj_kohde.split(", ").filter((x) => !!x)
    return mjTunnukset.map((mjTunnus, i) => [mjNimet[i], mjTunnus])
  }, [feature])

  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.featureName`)}
          value={VARK_nimi}
          suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
        />
        <Field label={t(`details.field.municipality`)} value={Kunta} />
        <Field label={t(`details.field.region`)} value={Maakunta} />
        <Field label={t(`details.field.dating`)}>
          <List
            data={ajoitukset}
            contentFn={(ajoitus) => (
              <div>
                <span>
                  {t(`data.museovirasto.varkAjoitus.${ajoitus}`, ajoitus)}
                </span>
                {isVarkAjoitus(ajoitus) && (
                  <VarkTimespanLabel dating={ajoitus} />
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
                  key={tyyppi}
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
        <Field label={t(`data.featureType.Kiinteä muinaisjäännös`)}>
          <List
            data={muinaisjäännökset}
            contentFn={([nimi, mjtunnus]) => (
              <Link
                text={nimi}
                url={getMuinaisjaannosRegisterUrl(
                  mjtunnus,
                  i18n.language as Language
                )}
              />
            )}
          />
        </Field>
        <Field label={t(`details.field.varkId`)} value={String(VARK_ID)} />

        {feature.maisemanMuisti.length > 0 && (
          <MaisemanMuistiField feature={feature.maisemanMuisti[0]} />
        )}

        <MuseovirastoLink feature={feature} />

        {commonProps.isOpen && <EmbeddedModels models={feature.models} />}
      </Form>
    </MapFeatureCollapsePanel>
  )
}
