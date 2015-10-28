var Muinaismuistot = function() {
  var self = this;
  var map = null;
  var detailsPage = null;
  var settingsPage = null;
  var infoPage = null;
  var searchPage = null;
  var filterPage = null;
  var data = null;
  var settings = null;

  this.init = function() {
    settings = new MuinaismuistotSettings();
    settings.init();
    settings.setEventListener({
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

    data = new MuinaismuistotData();
    data.init(settings);

    map = new MuinaismuistotMap();
    map.init(data, settings);
    map.setEventListener({
      muinaisjaannosFeaturesSelected : function(muinaisjaannosFeatures) {
        detailsPage.setMuinaisjaannosFeatures(muinaisjaannosFeatures);
        showPage('detailsPage');
      }
    });

    detailsPage = new MuinaismuistotDetailsPage();
    detailsPage.init(data, settings);
    detailsPage.setEventListener({
      hidePage : function() {
        hidePage('detailsPage');
      }
    });

    settingsPage = new MuinaismuistotSettingsPage();
    settingsPage.init(settings);
    settingsPage.setEventListener({
      hidePage : function() {
        hidePage('settingsPage');
      }
    });

    searchPage = new MuinaismuistotSearchPage();
    searchPage.init(data, settings);
    searchPage.setEventListener({
      hidePage : function() {
        hidePage('searchPage');
      }
    });

    filterPage = new MuinaismuistotFilterPage();
    filterPage.init(settings);
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

    $('#map-button-position').on('click', function() {
      map.centerToCurrentPositions();
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

    window.onhashchange = function(location) {
      map.setMapLocation(window.location.hash);
    };
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