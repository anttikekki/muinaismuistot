import MuseovirastoTileLayer from "../../../map/layer/MuseovirastoTileLayer";
import {
  Settings,
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus
} from "../../../data";

const mapSize = [1680, 445];
const mapExtent = [
  365537.11965882167,
  6671977.1335827755,
  408118.1157036613,
  6683256.028368463
];

const createMuseovirastoTileLayer = () => {
  const showLoadingAnimationFn = jest.fn();
  const onLayerCreatedCallbackFn = jest.fn();
  const initialSettings: Settings = {
    selectedMaanmittauslaitosLayer: MaanmittauslaitosLayer.Taustakartta,
    selectedMuseovirastoLayers: Object.values(MuseovirastoLayer),
    selectedMuinaisjaannosTypes: Object.values(MuinaisjaannosTyyppi),
    selectedMuinaisjaannosDatings: Object.values(MuinaisjaannosAjoitus)
  };
  return new MuseovirastoTileLayer(
    initialSettings,
    showLoadingAnimationFn,
    onLayerCreatedCallbackFn
  );
};

describe("MuseovirastoTileLayer", () => {
  describe(".identifyFeaturesAt", () => {
    it("fetch features by map coordinate from ArcGIS identify service", async () => {
      const museovirasto = createMuseovirastoTileLayer();
      const coordinate = [385509.6344703298, 6675069.324962223];

      const result = await museovirasto.identifyFeaturesAt(
        coordinate,
        mapSize,
        mapExtent
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe(".findFeatures", () => {
    it("fetch features from ArcGIS find service with name", async () => {
      const museovirasto = createMuseovirastoTileLayer();

      const result = await museovirasto.findFeatures("rainiola");

      expect(result).toMatchInlineSnapshot();
    });
  });
});
