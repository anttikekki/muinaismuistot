import * as React from "react";
import { ArgisFeature } from "../../../data";
import { MuinaisjaannosPistePanel } from "./MuinaisjaannosPistePanel";
import { getFeatureID } from "../../../util/FeatureParser";
import { MuinaisjaannosAluePanel } from "./MuinaisjaannosAluePanel";
import { RKYPanel } from "./RKYPanel";
import { MaailmanperintokohdePanel } from "./MaailmanperintokohdePanel";
import { SuojellutRakennuksetPanel } from "./SuojellutRakennuksetPanel";
import { AhvenanmaaForminnenPanel } from "./AhvenanmaaForminnenPanel";
import { Page } from "../Page";

interface Props {
  visible: boolean;
  hidePage: () => void;
  features?: Array<ArgisFeature>;
}

const panelForFeature = (
  feature: ArgisFeature,
  onTogglePanelOpen: (id: string) => void,
  openPanelId?: string
) => {
  const id = `${feature.layerName}-${getFeatureID(feature)}`;
  const isOpen = openPanelId === id;
  const onToggleOpen = () => onTogglePanelOpen(id);
  const params = {
    key: id,
    isOpen: isOpen,
    onToggleOpen: onToggleOpen
  };

  switch (feature.layerName) {
    case "Muinaisjäännökset_piste":
      return <MuinaisjaannosPistePanel feature={feature} {...params} />;
    case "Muinaisjäännökset_alue":
      return <MuinaisjaannosAluePanel feature={feature} {...params} />;
    case "RKY_alue":
    case "RKY_viiva":
    case "RKY_piste":
      return <RKYPanel feature={feature} {...params} />;
    case "Maailmanperintö_alue":
    case "Maailmanperintö_piste":
      return <MaailmanperintokohdePanel feature={feature} {...params} />;
    case "Suojellut_rakennukset_alue":
    case "Suojellut_rakennukset_piste":
      return <SuojellutRakennuksetPanel feature={feature} {...params} />;
    case "Fornminnen":
      return <AhvenanmaaForminnenPanel feature={feature} {...params} />;
  }
};

export const FeatureDetailsPage: React.FC<Props> = ({
  visible,
  hidePage,
  features
}) => {
  const [openPanelId, setOpenPanelId] = React.useState<string>(undefined);
  const onTogglePanelOpen = (id: string) =>
    setOpenPanelId(openPanelId === id ? undefined : id);

  return (
    <Page title="Valitut kohteet" visible={visible} hidePage={hidePage}>
      <div className="panel-group" role="tablist" aria-multiselectable="true" />
      {features &&
        features.map(feature =>
          panelForFeature(feature, onTogglePanelOpen, openPanelId)
        )}
    </Page>
  );
};
