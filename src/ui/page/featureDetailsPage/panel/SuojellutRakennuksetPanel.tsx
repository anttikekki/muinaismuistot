import * as React from "react"
import {
  SuojellutRakennuksetPisteArgisFeature,
  SuojellutRakennuksetAlueArgisFeature,
  MuseovirastoLayer,
  ModelFeatureProperties
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"
import { EmbeddedModels } from "../component/EmbeddedModels"

interface Props {
  isOpen: boolean
  onToggleOpen: () => void
  feature:
    | SuojellutRakennuksetPisteArgisFeature
    | SuojellutRakennuksetAlueArgisFeature
  models?: Array<ModelFeatureProperties>
}

export const SuojellutRakennuksetPanel: React.FC<Props> = ({
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
        <Field label="Kohdenimi" value={feature.attributes.kohdenimi} />
        {feature.layerName == MuseovirastoLayer.Suojellut_rakennukset_piste && (
          <Field label="Rakennusnimi" value={feature.attributes.rakennusnimi} />
        )}
        <Field label="Kunta" value={feature.attributes.kunta} />
        <Field label="Suojeluryhmä" value={feature.attributes.suojeluryhmä} />
        <MuseovirastoLink feature={feature} />
        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
