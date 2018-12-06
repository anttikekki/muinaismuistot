import MuseovirastoArcGISWMS from "../../../src/js/map/MuseovirastoArcGISWMS";
import Settings from "../../../src/js/Settings";

const mapSize = [1680, 445];
const mapExtent = [
  365537.11965882167,
  6671977.1335827755,
  408118.1157036613,
  6683256.028368463
];

const createMuseovirastoArcGISWMS = () => {
  const showLoadingAnimationFn = jest.fn();
  const onLayerCreatedCallbackFn = jest.fn();
  return new MuseovirastoArcGISWMS(
    new Settings(),
    showLoadingAnimationFn,
    onLayerCreatedCallbackFn
  );
};

describe("MuseovirastoArcGISWMS", () => {
  describe(".identifyFeaturesAt", () => {
    it("fetch features by map coordinate from ArcGIS identify service", done => {
      const museovirasto = createMuseovirastoArcGISWMS();
      const coordinate = [385509.6344703298, 6675069.324962223];

      museovirasto
        .identifyFeaturesAt(coordinate, mapSize, mapExtent)
        .then(result => {
          expect(result).toMatchSnapshot();
          done();
        });
    });
  });

  describe(".findFeatures", () => {
    it("fetch features from ArcGIS find service with name", done => {
      const museovirasto = createMuseovirastoArcGISWMS();

      museovirasto.findFeatures("kissa", result => {
        expect(result).toMatchSnapshot();
        done();
      });
    });
  });
});
