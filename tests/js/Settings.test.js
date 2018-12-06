import Settings from "../../src/js/Settings";

var createSettings = function() {
  return new Settings({
    selectedMapBackgroundLayerChanged: jest.fn(),
    visibleMuinaismuistotLayersChanged: jest.fn(),
    filterParametersChanged: jest.fn()
  });
};

describe("Settings", function() {
  describe(".getFilterParamsLayerDefinitions", function() {
    it("returns empty Muinaismyistot layer filter wheb there is no filter values", function() {
      var settings = createSettings();

      expect(settings.getFilterParamsLayerDefinitions()).toEqual("");
    });

    it("returns Muinaismuistot layer filter for one type", function() {
      var settings = createSettings();
      settings.setMuinaisjaannosFilterParameter("tyyppi", ["alusten hylyt"]);

      expect(settings.getFilterParamsLayerDefinitions()).toEqual(
        "13:(tyyppi LIKE '%alusten hylyt%')"
      );
    });

    it("returns Muinaismuistot layer filter for two types", function() {
      var settings = createSettings();
      settings.setMuinaisjaannosFilterParameter("tyyppi", [
        "alusten hylyt",
        "asuinpaikat"
      ]);

      expect(settings.getFilterParamsLayerDefinitions()).toEqual(
        "13:(tyyppi LIKE '%alusten hylyt%' OR tyyppi LIKE '%asuinpaikat%')"
      );
    });
  });
});
