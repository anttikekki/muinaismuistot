import * as React from "react"
import {
  ModelFeatureProperties,
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../../../../common/types"
import { MaisemanMuistiFeatureCollapsePanel } from "./FeatureCollapsePanel"
import { Field } from "./Field"
import { MuseovirastoLinkDirect } from "./MuseovirastoLink"
import { EmbeddedModels } from "./EmbeddedModels"
import { MaisemanMuistiField } from "./MaisemanMuistiField"

interface Props {
  isOpen: boolean
  onToggleOpen: () => void
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>
  models?: Array<ModelFeatureProperties>
}

export const MaisemanMuistiPanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature,
  models = []
}) => {
  return (
    <MaisemanMuistiFeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
      has3dModels={models.length > 0}
    >
      <form>
        <Field label="Kohdenimi" value={feature.properties.name} />
        <Field label="Kunta" value={feature.properties.municipality} />
        <Field label="Maakunta" value={feature.properties.region} />
        <MaisemanMuistiField />
        <MuseovirastoLinkDirect
          url={`https://www.kyppi.fi/to.aspx?id=112.${feature.properties.id}`}
          registerName="Muinaisjäännösrekisteristä"
        />

        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </MaisemanMuistiFeatureCollapsePanel>
  )
}
