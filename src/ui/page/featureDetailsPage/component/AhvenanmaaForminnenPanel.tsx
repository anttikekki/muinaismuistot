import * as React from "react"
import {
  AhvenanmaaForminnenArgisFeature,
  ModelFeatureProperties
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "./FeatureCollapsePanel"
import { Field } from "./Field"
import { AhvenanmaaRegeringenLink } from "./AhvenanmaaRegeringenLink"
import { EmbeddedModels } from "./EmbeddedModels"
import {
  getAhvenanmaaForminneDatingText,
  getAhvenanmaaForminnenTypeText
} from "../../../../common/util/featureParser"

interface Props {
  isOpen: boolean
  onToggleOpen: () => void
  feature: AhvenanmaaForminnenArgisFeature
  models?: Array<ModelFeatureProperties>
}

export const AhvenanmaaForminnenPanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature,
  models = []
}) => {
  const id = feature.attributes["Fornlämnings ID"]
  const subFeatureAmount =
    feature.attributes.typeAndDating
      ?.map((v) => v.Antal)
      .reduce((prev, current) => prev + current, 0) || 0

  const subFeatureTypesAndDatings =
    feature.attributes.typeAndDating
      ?.map(
        (
          {
            Typ: typeId,
            Und_typ: subType,
            Typ_1: datingId,
            Undertyp: subDating
          },
          i
        ) =>
          [
            getAhvenanmaaForminnenTypeText(typeId),
            subType,
            getAhvenanmaaForminneDatingText(datingId),
            subDating
          ]
            .filter((v) => !!v)
            .join(", ")
      )
      .filter((v) => !!v) || []

  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
      has3dModels={models.length > 0}
    >
      <form>
        <Field label="Nimi" value={feature.attributes.Namn} />
        <Field label="Kunta" value={feature.attributes.Kommun} />
        <Field label="Kylä" value={feature.attributes.By} />
        <Field label="Kuvaus" value={feature.attributes.Beskrivning} />
        <Field label="Sijainti" value={feature.attributes.Topografi} />
        <Field label="Tunniste" value={id} />

        <Field label="Tyyppi ja ajoitus">
          {subFeatureTypesAndDatings.map((row, i) => (
            <p key={`${id}-${i}`}>{row}</p>
          ))}
        </Field>

        <Field label="Kohteiden lukumäärä" value={String(subFeatureAmount)} />

        <AhvenanmaaRegeringenLink feature={feature} />

        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
