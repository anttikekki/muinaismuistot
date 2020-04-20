import * as React from "react";
import {
  ArgisFeature,
  Model,
  MuseovirastoLayer,
  AhvenanmaaLayer,
} from "../../../common/types";
import { MuinaisjaannosPistePanel } from "./component/MuinaisjaannosPistePanel";
import {
  getFeatureID,
  getModelsForFeature,
} from "../../../common/util/featureParser";
import { MuinaisjaannosAluePanel } from "./component/MuinaisjaannosAluePanel";
import { RKYPanel } from "./component/RKYPanel";
import { MaailmanperintokohdePanel } from "./component/MaailmanperintokohdePanel";
import { SuojellutRakennuksetPanel } from "./component/SuojellutRakennuksetPanel";
import { AhvenanmaaForminnenPanel } from "./component/AhvenanmaaForminnenPanel";
import { Page, PageVisibility } from "../Page";
import { AhvenanmaaMaritimtKulturarvPanel } from "./component/AhvenanmaaMaritimtKulturarvPanel";

interface Props {
  visibility: PageVisibility;
  hidePage: () => void;
  features?: Array<ArgisFeature>;
  models?: Array<Model>;
}

interface PanelForFeatureProps {
  feature: ArgisFeature;
  id: string;
  onTogglePanelOpen: (id: string) => void;
  openPanelId: string;
  models?: Array<Model>;
}

const PanelForFeature: React.FC<PanelForFeatureProps> = ({
  feature,
  id,
  onTogglePanelOpen,
  openPanelId,
  models,
}) => {
  const isOpen = openPanelId === id;
  const onToggleOpen = () => onTogglePanelOpen(id);
  const params = {
    isOpen: isOpen,
    onToggleOpen: onToggleOpen,
    models: getModelsForFeature(feature, models),
  };

  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjäännökset_piste:
      return <MuinaisjaannosPistePanel feature={feature} {...params} />;
    case MuseovirastoLayer.Muinaisjäännökset_alue:
      return <MuinaisjaannosAluePanel feature={feature} {...params} />;
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return <RKYPanel feature={feature} {...params} />;
    case MuseovirastoLayer.Maailmanperintö_alue:
    case MuseovirastoLayer.Maailmanperintö_piste:
      return <MaailmanperintokohdePanel feature={feature} {...params} />;
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return <SuojellutRakennuksetPanel feature={feature} {...params} />;
    case AhvenanmaaLayer.Fornminnen:
      return <AhvenanmaaForminnenPanel feature={feature} {...params} />;
    case AhvenanmaaLayer.MaritimtKulturarv:
      return <AhvenanmaaMaritimtKulturarvPanel feature={feature} {...params} />;
  }
  return null;
};

const getPanelId = (feature: ArgisFeature): string =>
  `${feature.layerName}-${getFeatureID(feature)}`;

export const FeatureDetailsPage: React.FC<Props> = ({
  visibility,
  hidePage,
  features,
  models,
}) => {
  const [openPanelId, setOpenPanelId] = React.useState("");
  const onTogglePanelOpen = (id: string) =>
    setOpenPanelId(openPanelId === id ? "" : id);

  return (
    <Page title="Valitut kohteet" visibility={visibility} hidePage={hidePage}>
      <div className="panel-group" role="tablist" aria-multiselectable="true" />
      {features &&
        features.map((feature) => (
          <PanelForFeature
            key={getPanelId(feature)}
            id={getPanelId(feature)}
            feature={feature}
            onTogglePanelOpen={onTogglePanelOpen}
            openPanelId={openPanelId}
            models={models}
          />
        ))}
    </Page>
  );
};
