import {
  Settings,
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  AhvenanmaaLayer,
} from "../../src/common/types";

export const initialSettings: Settings = {
  selectedMaanmittauslaitosLayer: MaanmittauslaitosLayer.Taustakartta,
  selectedMuseovirastoLayers: Object.values(MuseovirastoLayer),
  selectedMuinaisjaannosTypes: Object.values(MuinaisjaannosTyyppi),
  selectedMuinaisjaannosDatings: Object.values(MuinaisjaannosAjoitus),
  selectedAhvenanmaaLayers: Object.values(AhvenanmaaLayer),
};
