import * as React from "react"
import {
  AhvenanmaaForminnenArgisFeature,
  ModelFeatureProperties
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { AhvenanmaaTypeAndDatingField } from "../component/AhvenanmaaTypeAndDatingField"

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
  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
      has3dModels={models.length > 0}
    >
      <form>
        <Field label="Tunniste" value={feature.attributes["Fornlämnings ID"]} />
        <Field label="Nimi" value={feature.attributes.Namn} />
        <Field label="Kunta" value={feature.attributes.Kommun} />
        <Field label="Kylä" value={feature.attributes.By} />
        <AhvenanmaaTypeAndDatingField feature={feature} />
        <Field label="Kuvaus" value={feature.attributes.Beskrivning} />
        <Field label="Sijainti" value={feature.attributes.Topografi} />

        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
