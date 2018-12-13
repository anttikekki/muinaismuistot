import Settings from "../../src/js/Settings";

var createSettings = function() {
  return new Settings({
    selectedMapBackgroundLayerChanged: jest.fn(),
    visibleMuinaismuistotLayersChanged: jest.fn(),
    filterParametersChanged: jest.fn()
  });
};

describe("Settings", function() {
  describe(".init", function() {
    it("all layers are selected when settings is created", function() {
      var settings = createSettings();

      expect(settings.getSelectedMuinaismuistotLayerIds()).toEqual([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ]);
    });
  });

  describe(".getFilterParamsLayerDefinitions", function() {
    it("returns empty Muinaismuistot layer filter when there is no filter values", function() {
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

    it("returns Muinaismuistot layer filter for one timeperiod", function() {
      var settings = createSettings();
      settings.setMuinaisjaannosFilterParameter("ajoitus", [
        "esihistoriallinen"
      ]);

      expect(settings.getFilterParamsLayerDefinitions()).toEqual(
        "13:(ajoitus LIKE '%esihistoriallinen%')"
      );
    });

    it("returns Muinaismuistot layer filter for two timeperiods", function() {
      var settings = createSettings();
      settings.setMuinaisjaannosFilterParameter("ajoitus", [
        "esihistoriallinen",
        "rautakautinen"
      ]);

      expect(settings.getFilterParamsLayerDefinitions()).toEqual(
        "13:(ajoitus LIKE '%esihistoriallinen%' OR ajoitus LIKE '%rautakautinen%')"
      );
    });

    it("returns Muinaismuistot layer filter for two timeperiods and two types", function() {
      var settings = createSettings();
      settings.setMuinaisjaannosFilterParameter("ajoitus", [
        "esihistoriallinen",
        "rautakautinen"
      ]);
      settings.setMuinaisjaannosFilterParameter("tyyppi", [
        "alusten hylyt",
        "asuinpaikat"
      ]);

      expect(settings.getFilterParamsLayerDefinitions()).toEqual(
        "13:(tyyppi LIKE '%alusten hylyt%' OR tyyppi LIKE '%asuinpaikat%') AND (ajoitus LIKE '%esihistoriallinen%' OR ajoitus LIKE '%rautakautinen%')"
      );
    });

    it("returns empty Muinaismuistot layer filter when timeperiod and type filter have all possible values", function() {
      var settings = createSettings();
      settings.setMuinaisjaannosFilterParameter("ajoitus", [
        "moniperiodinen",
        "esihistoriallinen",
        "kivikautinen",
        "varhaismetallikautinen",
        "pronssikautinen",
        "rautakautinen",
        "keskiaikainen",
        "historiallinen",
        "moderni",
        "ajoittamaton",
        "ei määritelty"
      ]);
      settings.setMuinaisjaannosFilterParameter("tyyppi", [
        "ei määritelty",
        "alusten hylyt",
        "asuinpaikat",
        "hautapaikat",
        "kirkkorakenteet",
        "kivirakenteet",
        "kulkuväylät",
        "kultti- ja tarinapaikat",
        "luonnonmuodostumat",
        "löytöpaikat",
        "maarakenteet",
        "muinaisjäännösryhmät",
        "puolustusvarustukset",
        "puurakenteet",
        "raaka-aineen hankintapaikat",
        "taide, muistomerkit",
        "tapahtumapaikat",
        "teollisuuskohteet",
        "työ- ja valmistuspaikat"
      ]);

      expect(settings.getFilterParamsLayerDefinitions()).toEqual("");
    });
  });

  describe(".layerSelectionChanged", function() {
    it("deselects layer", function() {
      var settings = createSettings();
      var layerMap = settings.getMuinaismuistotLayerIdMap();
      settings.setSelectedMuinaismuistotLayerIds([4, 5, 6]);

      settings.layerSelectionChanged(layerMap.RKY_alue, false);

      expect(settings.getSelectedMuinaismuistotLayerIds()).toEqual([5, 6]);
    });

    it("selects layer", function() {
      var settings = createSettings();
      var layerMap = settings.getMuinaismuistotLayerIdMap();
      settings.setSelectedMuinaismuistotLayerIds([5]);

      settings.layerSelectionChanged(layerMap.RKY_alue, true);

      expect(settings.getSelectedMuinaismuistotLayerIds()).toEqual([4, 5]);
    });
  });
});
