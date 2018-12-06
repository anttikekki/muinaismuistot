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
        8,
        9,
        10,
        11,
        12,
        13
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
    it("deselects RKY parent and all sub layers when parameter is parent layer", function() {
      var settings = createSettings();
      var layerMap = settings.getMuinaismuistotLayerIdMap();
      settings.setSelectedMuinaismuistotLayerIds([0, 1, 2, 3]);

      settings.layerSelectionChanged(layerMap["RKY"], false);

      expect(settings.getSelectedMuinaismuistotLayerIds()).toEqual([]);
    });

    it("selects RKY parent and all sub layers when parameter is parent layer", function() {
      var settings = createSettings();
      var layerMap = settings.getMuinaismuistotLayerIdMap();
      settings.setSelectedMuinaismuistotLayerIds([]);

      settings.layerSelectionChanged(layerMap["RKY"], true);

      expect(settings.getSelectedMuinaismuistotLayerIds()).toEqual([
        0,
        1,
        2,
        3
      ]);
    });

    it("selects only 'RKY pisteet' sub layer when parameter is 'RKY pisteet' sublayer", function() {
      var settings = createSettings();
      var layerMap = settings.getMuinaismuistotLayerIdMap();
      settings.setSelectedMuinaismuistotLayerIds([]);

      settings.layerSelectionChanged(layerMap["RKY pisteet"], true);

      expect(settings.getSelectedMuinaismuistotLayerIds()).toEqual([3]);
    });

    it("selects parent RKY layer when parameter is 'RKY pisteet' sublayer and all other sublayers are selected", function() {
      var settings = createSettings();
      var layerMap = settings.getMuinaismuistotLayerIdMap();
      settings.setSelectedMuinaismuistotLayerIds([1, 2]);

      settings.layerSelectionChanged(layerMap["RKY pisteet"], true);

      expect(settings.getSelectedMuinaismuistotLayerIds()).toEqual([
        1,
        2,
        3,
        0
      ]);
    });

    it("deselects parent RKY layer when parameter is 'RKY pisteet' sublayer and all other sublayers are selected", function() {
      var settings = createSettings();
      var layerMap = settings.getMuinaismuistotLayerIdMap();
      settings.setSelectedMuinaismuistotLayerIds([0, 1, 2, 3]);

      settings.layerSelectionChanged(layerMap["RKY pisteet"], false);

      expect(settings.getSelectedMuinaismuistotLayerIds()).toEqual([1, 2]);
    });
  });
});
