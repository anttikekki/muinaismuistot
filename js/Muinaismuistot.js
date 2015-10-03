var Muinaismuistot = function() {
  var self = this;
  var map = null;
  var detailsPage = null;
  var settingsPage = null;
  var infoPage = null;
  var searchPage = null;
  var filterPage = null;
  var muinaismuistotData = null;
  var muinaismuistotSettings = null;

  this.init = function() {
    muinaismuistotSettings = new MuinaismuistotSettings();
    muinaismuistotSettings.init();
    muinaismuistotSettings.setEventListener({
      selectedMapBackgroundLayerChanged: function(layerName) {
        map.setVisibleBackgroundLayerName(layerName);
      },
      visibleMuinaismuistotLayersChanged: function(selectedLayerIds) {
        map.setVisibleMuinaismuistotLayers(selectedLayerIds);
      },
      filterParametersChanged: function(params) {
        map.setFilterParams(params);
      }
    });

    muinaismuistotData = new MuinaismuistotData();
    muinaismuistotData.init(muinaismuistotSettings);

    map = new MuinaismuistotMap();
    map.init(muinaismuistotData, muinaismuistotSettings);
    map.setEventListener({
      muinaisjaannosFeaturesSelected : function(muinaisjaannosFeatures) {
        detailsPage.setMuinaisjaannosFeatures(muinaisjaannosFeatures);
        showPage('detailsPage');
      }
    });

    detailsPage = new MuinaismuistotDetailsPage();
    detailsPage.init(muinaismuistotSettings);
    detailsPage.setEventListener({
      hidePage : function() {
        hidePage('detailsPage');
      }
    });

    settingsPage = new MuinaismuistotSettingsPage();
    settingsPage.init(muinaismuistotSettings);
    settingsPage.setEventListener({
      hidePage : function() {
        hidePage('settingsPage');
      }
    });

    searchPage = new MuinaismuistotSearchPage();
    searchPage.init(muinaismuistotSettings);
    searchPage.setEventListener({
      hidePage : function() {
        hidePage('searchPage');
      }
    });

    filterPage = new MuinaismuistotFilterPage();
    filterPage.init(muinaismuistotSettings);
    filterPage.setEventListener({
      hidePage : function() {
        hidePage('filterPage');
      }
    });

    infoPage = new MuinaismuistotInfoPage();
    infoPage.init();
    infoPage.setEventListener({
      hidePage : function() {
        hidePage('infoPage');
      }
    });

    $('#map-button-search').on('click', function() {
      showPage('searchPage');
    });

    $('#map-button-filter').on('click', function() {
      showPage('filterPage');
    });

    $('#map-button-info').on('click', function() {
      showPage('infoPage');
    });

    $('#map-button-settings').on('click', function() {
      showPage('settingsPage');
    });
  };

  var showPage = function(pageId) {
    $page = $('#'+pageId);

    if($page.hasClass('page-right-hidden')) {
      $page.removeClass('page-right-hidden').addClass('page-right-visible');
    }
  };

  var hidePage = function(pageId) {
    $page = $('#'+pageId);

    if($page.hasClass('page-right-visible')) {
      $page.removeClass('page-right-visible').addClass('page-right-hidden');
    }
  };
};