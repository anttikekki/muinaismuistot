import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { Language } from "../../../../common/layers.types"
import { ViabundusPlaceFeature } from "../../../../common/viabundus.types"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { FeatureGeometryDownloadLink } from "../component/FeatureGeometryDownloadLink"
import { Field } from "../component/Field"

const newLineToBr = (
  text: string | undefined
): React.JSX.Element[] | undefined =>
  text?.split(/\r\n/).map((desc, i) => (
    <React.Fragment key={i}>
      {desc}
      <br />
    </React.Fragment>
  ))

const getDescription = (
  lang: string,
  fi: string | undefined,
  en: string | undefined
) => (lang === Language.EN ? (en ?? fi) : (fi ?? en))

const Settlement: React.FC<{ feature: ViabundusPlaceFeature }> = ({
  feature
}) => {
  const { t, i18n } = useTranslation()
  const {
    Is_Settlement,
    Settlement_From,
    Settlement_To,
    Settlement_DescriptionFI,
    Settlement_DescriptionEN
  } = feature.properties

  if (!Is_Settlement) {
    return
  }

  return (
    <>
      <h4>{t("data.viabundus.place.settlement")}</h4>

      {(Settlement_From || Settlement_To) && (
        <Field
          label={t(`details.field.dating`)}
          value={`${Settlement_From ?? ""} - ${Settlement_To ?? ""}`}
        />
      )}

      <Field label={t(`details.field.description`)}>
        {newLineToBr(
          getDescription(
            i18n.language,
            Settlement_DescriptionFI,
            Settlement_DescriptionEN
          )
        )}
      </Field>
    </>
  )
}

const Town: React.FC<{ feature: ViabundusPlaceFeature }> = ({ feature }) => {
  const { t, i18n } = useTranslation()
  const {
    Is_Town,
    Town_From,
    Town_To,
    Town_DescriptionFI,
    Town_DescriptionEN,
    population
  } = feature.properties

  if (!Is_Town) {
    return
  }

  return (
    <>
      <h4>{t("data.viabundus.place.town")}</h4>

      {(Town_From || Town_To) && (
        <Field
          label={t(`details.field.dating`)}
          value={`${Town_From ?? ""} - ${Town_To ?? ""}`}
        />
      )}

      {population && (
        <Field label={t(`details.field.asukasluku`)}>
          <table className="table">
            <thead>
              <tr>
                <th>{t(`data.viabundus.population.year`)}</th>
                <th>{t(`data.viabundus.population.inhabitants`)}</th>
              </tr>
            </thead>
            <tbody>
              {population.map(({ year, inhabitants }, i) => {
                return (
                  <tr key={i}>
                    <td>{year}</td>
                    <td>{inhabitants === 0 ? "<1000" : `${inhabitants}000`}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Field>
      )}

      <Field label={t(`details.field.description`)}>
        {newLineToBr(
          getDescription(i18n.language, Town_DescriptionFI, Town_DescriptionEN)
        )}
      </Field>
    </>
  )
}

const Bridge: React.FC<{ feature: ViabundusPlaceFeature }> = ({ feature }) => {
  const { t, i18n } = useTranslation()
  const {
    Is_Bridge,
    Bridge_From,
    Bridge_To,
    Bridge_DescriptionFI,
    Bridge_DescriptionEN,
    Bridge_Literature
  } = feature.properties

  if (!Is_Bridge) {
    return
  }

  return (
    <>
      <h4>{t("data.viabundus.place.bridge")}</h4>

      {(Bridge_From || Bridge_To) && (
        <Field
          label={t(`details.field.dating`)}
          value={`${Bridge_From ?? ""} - ${Bridge_To ?? ""}`}
        />
      )}

      <Field label={t(`details.field.description`)}>
        {newLineToBr(
          getDescription(
            i18n.language,
            Bridge_DescriptionFI,
            Bridge_DescriptionEN
          )
        )}
      </Field>

      {Bridge_Literature && Bridge_Literature.length > 0 && (
        <Field label={t(`details.field.lähteet`)}>
          <ul>
            {Bridge_Literature.map((literature, i) => (
              <li key={i}>
                <cite>{literature}</cite>
              </li>
            ))}
          </ul>
        </Field>
      )}
    </>
  )
}

const Fair: React.FC<{ feature: ViabundusPlaceFeature }> = ({ feature }) => {
  const { t, i18n } = useTranslation()
  const {
    Is_Fair,
    Fair_From,
    Fair_To,
    Fair_DescriptionFI,
    Fair_DescriptionEN,
    Fair_Literature,
    fairs
  } = feature.properties

  if (!Is_Fair) {
    return
  }

  return (
    <>
      <h4>{t("data.viabundus.place.fair")}</h4>

      {(Fair_From || Fair_To) && (
        <Field
          label={t(`details.field.dating`)}
          value={`${Fair_From ?? ""} - ${Fair_To ?? ""}`}
        />
      )}

      <Field label={t(`details.field.description`)}>
        {newLineToBr(
          getDescription(i18n.language, Fair_DescriptionFI, Fair_DescriptionEN)
        )}
      </Field>

      {fairs && fairs.length > 0 && (
        <Field label={t(`details.field.markkinapäivät`)}>
          <ul>
            {fairs.map((fair, i) => (
              <li key={i}>
                <b>{fair.name}:</b>
                <p>
                  {getDescription(
                    i18n.language,
                    Fair_DescriptionFI,
                    fair.descriptionEN
                  )}
                </p>
              </li>
            ))}
          </ul>
        </Field>
      )}

      {Fair_Literature && Fair_Literature.length > 0 && (
        <Field label={t(`details.field.lähteet`)}>
          <ul>
            {Fair_Literature.map((literature, i) => (
              <li key={i}>
                <cite>{literature}</cite>
              </li>
            ))}
          </ul>
        </Field>
      )}
    </>
  )
}

const Toll: React.FC<{ feature: ViabundusPlaceFeature }> = ({ feature }) => {
  const { t, i18n } = useTranslation()
  const {
    Is_Toll,
    Toll_From,
    Toll_To,
    Toll_DescriptionFI,
    Toll_DescriptionEN,
    Toll_Literature
  } = feature.properties

  if (!Is_Toll) {
    return
  }

  return (
    <>
      <h4>{t("data.viabundus.place.toll")}</h4>

      {(Toll_From || Toll_To) && (
        <Field
          label={t(`details.field.dating`)}
          value={`${Toll_From ?? ""} - ${Toll_To ?? ""}`}
        />
      )}

      <Field label={t(`details.field.description`)}>
        {newLineToBr(
          getDescription(i18n.language, Toll_DescriptionFI, Toll_DescriptionEN)
        )}
      </Field>

      {Toll_Literature && Toll_Literature.length > 0 && (
        <Field label={t(`details.field.lähteet`)}>
          <ul>
            {Toll_Literature.map((literature, i) => (
              <li key={i}>
                <cite>{literature}</cite>
              </li>
            ))}
          </ul>
        </Field>
      )}
    </>
  )
}

const Ferry: React.FC<{ feature: ViabundusPlaceFeature }> = ({ feature }) => {
  const { t, i18n } = useTranslation()
  const {
    Is_Ferry,
    Ferry_From,
    Ferry_To,
    Ferry_DescriptionFI,
    Ferry_DescriptionEN,
    Ferry_Literature
  } = feature.properties

  if (!Is_Ferry) {
    return
  }

  return (
    <>
      <h4>{t("data.viabundus.place.ferry")}</h4>

      {(Ferry_From || Ferry_To) && (
        <Field
          label={t(`details.field.dating`)}
          value={`${Ferry_From ?? ""} - ${Ferry_To ?? ""}`}
        />
      )}

      <Field label={t(`details.field.description`)}>
        {newLineToBr(
          getDescription(
            i18n.language,
            Ferry_DescriptionFI,
            Ferry_DescriptionEN
          )
        )}
      </Field>

      {Ferry_Literature && Ferry_Literature.length > 0 && (
        <Field label={t(`details.field.lähteet`)}>
          <ul>
            {Ferry_Literature.map((literature, i) => (
              <li key={i}>
                <cite>{literature}</cite>
              </li>
            ))}
          </ul>
        </Field>
      )}
    </>
  )
}

const Harbour: React.FC<{ feature: ViabundusPlaceFeature }> = ({ feature }) => {
  const { t } = useTranslation()
  const { Is_Harbour, Harbour_From, Harbour_To, Harbour_DescriptionFI } =
    feature.properties

  if (!Is_Harbour) {
    return
  }

  return (
    <>
      <h4>{t("data.viabundus.place.harbour")}</h4>

      {(Harbour_From || Harbour_To) && (
        <Field
          label={t(`details.field.dating`)}
          value={`${Harbour_From ?? ""} - ${Harbour_To ?? ""}`}
        />
      )}

      <Field
        label={t(`details.field.description`)}
        value={Harbour_DescriptionFI}
      />
    </>
  )
}

const CommonLiterature: React.FC<{ feature: ViabundusPlaceFeature }> = ({
  feature
}) => {
  const { t } = useTranslation()
  const { Node_Literature } = feature.properties

  if (!Node_Literature || Node_Literature.length === 0) {
    return
  }

  return (
    <>
      <h4>{t("details.field.yleisetLähteet")}</h4>

      <Field label={t(`details.field.lähteet`)}>
        <ul>
          {Node_Literature.map((literature, i) => (
            <li key={i}>
              <cite>{literature}</cite>
            </li>
          ))}
        </ul>
      </Field>
    </>
  )
}

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: ViabundusPlaceFeature
}

export const ViabundusPlacePanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()

  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.name`)}
          value={feature.properties.name}
          suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
        />
        <Settlement feature={feature} />
        <Town feature={feature} />
        <Bridge feature={feature} />
        <Fair feature={feature} />
        <Toll feature={feature} />
        <Ferry feature={feature} />
        <Harbour feature={feature} />
        <CommonLiterature feature={feature} />
      </Form>
    </MapFeatureCollapsePanel>
  )
}
