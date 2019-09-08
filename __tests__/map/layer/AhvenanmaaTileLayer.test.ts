import MuseovirastoTileLayer from "../../../src/map/layer/MuseovirastoTileLayer";
import {
  Settings,
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus
} from "../../../src/data";
import AhvenanmaaTileLayer from "../../../src/map/layer/AhvenanmaaTileLayer";

jest.setTimeout(30000);

const mapSize = [1680, 445];
const mapExtent = [
  365537.11965882167,
  6671977.1335827755,
  408118.1157036613,
  6683256.028368463
];

const createAhvenanmaaTileLayerTileLayer = () => {
  const showLoadingAnimationFn = jest.fn();
  const onLayerCreatedCallbackFn = jest.fn();
  return new AhvenanmaaTileLayer(
    showLoadingAnimationFn,
    onLayerCreatedCallbackFn
  );
};

describe("AhvenanmaaTileLayer", () => {
  describe(".identifyFeaturesAt", () => {
    it("fetch features by map coordinate from ArcGIS identify service", async () => {
      const layer = createAhvenanmaaTileLayerTileLayer();
      const coordinate = [117212.54945776373, 6697331.888930351];

      const result = await layer.identifyFeaturesAt(
        coordinate,
        mapSize,
        mapExtent
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe(".findFeatures", () => {
    it("fetch features from ArcGIS find service with name", async () => {
      const layer = createAhvenanmaaTileLayerTileLayer();

      const result = await layer.findFeatures("Ålands enda slottsanläggning.");

      expect(result).toMatchSnapshot();
    });
  });
});
