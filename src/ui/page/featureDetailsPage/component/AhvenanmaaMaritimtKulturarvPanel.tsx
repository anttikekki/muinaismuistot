import * as React from "react"
import {
  ModelFeatureProperties,
  AhvenanmaaMaritimtKulturarvArgisFeature
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "./FeatureCollapsePanel"
import { Field } from "./Field"
import { EmbeddedModels } from "./EmbeddedModels"

interface Props {
  isOpen: boolean
  onToggleOpen: () => void
  feature: AhvenanmaaMaritimtKulturarvArgisFeature
  models?: Array<ModelFeatureProperties>
}

export const AhvenanmaaMaritimtKulturarvPanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature,
  models = []
}) => {
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
        <Field label="Tarkkuus" value={feature.attributes.Precision} />
        <Field label="Tunniste" value={feature.attributes.FornID} />
        <Field label="Laki" value={feature.attributes.Lagrum} />

        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
