var Muinaismuistot = function() {
  var self = this;
  var map = null;
  var detailsPage = null;
  var settingsPage = null;
  var infoPage = null;
  var searchPage = null;
  var data = null;
  var settings = null;
  var urlHashHelper = null;

  this.init = function() {
    settings = new MuinaismuistotSettings();
    settings.init();
    settings.setEventListener({
      selectedMapBackgroundLayerChanged: function(layerName) {
        map.setVisibleBackgroundLayerName(layerName);
      },
      visibleMuinaismuistotLayersChanged: function(selectedLayerIds) {
        map.setVisibleMuinaismuistotLayers(selectedLayerIds);
        settingsPage.setVisibleMuinaismuistotLayers(selectedLayerIds);
      },
      filterParametersChanged: function(params) {
        map.setFilterParams(params);
      }
    });

    urlHashHelper = new MuinaismuistotURLHashHelper();

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
    detailsPage.init(data, settings, urlHashHelper);
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
    searchPage.init(data, settings, urlHashHelper);
    searchPage.setEventListener({
      hidePage : function() {
        hidePage('searchPage');
      },
      searchResultItemClicked: function() {
        hidePage('searchPage');
      }
    });

    infoPage = new MuinaismuistotInfoPage();
    infoPage.init();
    infoPage.setEventListener({
      hidePage : function() {
        hidePage('infoPage');
      }
    });

    $('#top-page-info-alert a').on('click', function() {
      showPage('infoPage');
    });

    $('#map-button-zoom-in').on('click', function() {
      hideTopAlert();
      map.zoomIn();
    });

    $('#map-button-zoom-out').on('click', function() {
      hideTopAlert();
      map.zoomOut();
    });

    $('#map-button-position').on('click', function() {
      map.centerToCurrentPositions();
    });

    $('#map-button-search').on('click', function() {
      showPage('searchPage');
    });

    $('#map-button-info').on('click', function() {
      showPage('infoPage');
    });

    $('#map-button-settings').on('click', function() {
      showPage('settingsPage');
    });

    window.onhashchange = function(location) {
      setMapLocationFromURLHash();
    };

    determineStartLocation();

    window.setTimeout(hideTopAlert, 8000);
  };

  var hideTopAlert = function() {
    $('#top-page-info-alert').alert('close');
  };

  var showPage = function(pageId) {
    hideTopAlert();
    var $page = $('#'+pageId);

    if($page.hasClass('page-right-hidden')) {
      $page.removeClass('page-right-hidden').addClass('page-right-visible');
    }
  };

  var hidePage = function(pageId) {
    var $page = $('#'+pageId);

    if($page.hasClass('page-right-visible')) {
      $page.removeClass('page-right-visible').addClass('page-right-hidden');
    }
  };

  var determineStartLocation = function() {
    if(urlHashHelper.parseCoordinates()) {
      setMapLocationFromURLHash();
    }
    else {
      map.centerToCurrentPositions();
    }
  };

  var setMapLocationFromURLHash = function() {
    var coordinates = urlHashHelper.parseCoordinates();
    if(coordinates) {
      map.setMapLocation(coordinates);
      map.showSelectedLocationMarker(coordinates);
    }
  };
};