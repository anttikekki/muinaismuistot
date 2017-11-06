import 'bootstrap/dist/css/bootstrap.css';
import '../css/muinaismuistot.css';
import $ from "jquery";
import MuinaismuistotSettings from './MuinaismuistotSettings';
import MuinaismuistotURLHashHelper from './MuinaismuistotURLHashHelper';
import MuinaismuistotData from './MuinaismuistotData';
import MuinaismuistotMap from './map/MuinaismuistotMap';
import MuinaismuistotDetailsPage from './MuinaismuistotDetailsPage';
import MuinaismuistotSettingsPage from './MuinaismuistotSettingsPage';
import MuinaismuistotSearchPage from './MuinaismuistotSearchPage';
import MuinaismuistotInfoPage from './MuinaismuistotInfoPage';

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
  var visiblePageId = null;
  var loadingAnimationTimeoutID = null;

  var init = function() {
    settings = new MuinaismuistotSettings({
      selectedMapBackgroundLayerChanged: function(layerName) {
        map.setVisibleMaanmittauslaitosLayerName(layerName);
      },
      visibleMuinaismuistotLayersChanged: function(selectedLayerIds) {
        map.updateVisibleMuinaismuistotLayersFromSettings();
        settingsPage.setVisibleMuinaismuistotLayers(selectedLayerIds);
      },
      filterParametersChanged: function(params) {
        map.updateMuinaismuistotFilterParamsFromSettings();
      }
    });

    urlHashHelper = new MuinaismuistotURLHashHelper();
    data = new MuinaismuistotData(settings);

    map = new MuinaismuistotMap(settings, {
      muinaisjaannosFeaturesSelected : function(muinaisjaannosFeatures) {
        detailsPage.setMuinaisjaannosFeatures(muinaisjaannosFeatures);
        showPage('detailsPage');
      },
      showLoadingAnimation: showLoadingAnimation
    });

    detailsPage = new MuinaismuistotDetailsPage(data, settings, urlHashHelper, {
      hidePage : function() {
        hidePage('detailsPage');
      }
    });

    settingsPage = new MuinaismuistotSettingsPage(settings, {
      hidePage : function() {
        hidePage('settingsPage');
      }
    });

    searchPage = new MuinaismuistotSearchPage(data, settings, urlHashHelper, {
      hidePage : function() {
        hidePage('searchPage');
      },
      searchResultItemClicked: function() {
        hidePage('searchPage');
      },
      searchMuinaismuistoja: function(searchText, callbackFn) {
        map.searchMuinaismuistoja(searchText, callbackFn);
      }
    });

    infoPage = new MuinaismuistotInfoPage({
      hidePage : function() {
        hidePage('infoPage');
      }
    });

    $('#top-page-info-alert a').on('click', function() {
      showPage('infoPage');
    });

    $('#map-button-zoom-in').on('click', function() {
      map.zoomIn();
    });

    $('#map-button-zoom-out').on('click', function() {
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
  };

  var showPage = function(pageId) {
    var $page = $('#'+pageId);

    //Hide possible old page
    if(visiblePageId) {
      hidePage(visiblePageId);
    }

    if($page.hasClass('page-right-hidden')) {
      $page.removeClass('page-right-hidden').addClass('page-right-visible');
      visiblePageId = pageId;
    }
  };

  var hidePage = function(pageId) {
    var $page = $('#'+pageId);

    if($page.hasClass('page-right-visible')) {
      $page.removeClass('page-right-visible').addClass('page-right-hidden');
      visiblePageId = null;
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

  var showLoadingAnimation = function(show) {
    if(show) {
      loadingAnimationTimeoutID = window.setTimeout(function() {
        if(loadingAnimationTimeoutID) {
          $('#loading-animation').removeClass('hidden');
        }
      }, 300);
    }
    else {
      window.clearTimeout(loadingAnimationTimeoutID);
      loadingAnimationTimeoutID = null;
      $('#loading-animation').addClass('hidden');
    }
  };

  init();
};

$(document).ready(function() {
    new Muinaismuistot();
});
