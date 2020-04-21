import MuseovirastoTileLayer from "../../../src/map/layer/MuseovirastoTileLayer";
import {
  Settings,
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  AhvenanmaaLayer,
} from "../../../src/common/types";
import { Extent } from "ol/extent";
import { Size } from "ol/size";
import { initialSettings } from "../../../src";

jest.setTimeout(30000);

const mapSize: Size = [1680, 445];
const mapExtent: Extent = [
  365537.11965882167,
  6671977.1335827755,
  408118.1157036613,
  6683256.028368463,
];

const createMuseovirastoTileLayer = () => {
  const showLoadingAnimationFn = jest.fn();
  const onLayerCreatedCallbackFn = jest.fn();
  return new MuseovirastoTileLayer(
    initialSettings,
    showLoadingAnimationFn,
    onLayerCreatedCallbackFn
  );
};

describe("MuseovirastoTileLayer", () => {
  describe(".identifyFeaturesAt", () => {
    it("fetch features by map coordinate from ArcGIS identify service", async () => {
      const layer = createMuseovirastoTileLayer();
      const coordinate = [385509.6344703298, 6675069.324962223];

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
      const layer = createMuseovirastoTileLayer();

      const result = await layer.findFeatures("rainiola");

      expect(result).toMatchSnapshot();
    });
  });

  describe("getDataLatestUpdateDate", () => {
    test("solves Museovirasto data latest update date", async () => {
      const layer = createMuseovirastoTileLayer();

      const result = await layer.getDataLatestUpdateDate();

      expect(result).toMatchInlineSnapshot(`2020-02-10T02:15:01.000Z`);
    });
  });
});
