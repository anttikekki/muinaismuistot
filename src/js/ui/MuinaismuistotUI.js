import 'bootstrap/dist/css/bootstrap.css';
import '../../css/muinaismuistot.css';
import $ from "jquery";
import FeatureDetailsPage from './FeatureDetailsPage';
import SettingsPage from './SettingsPage';
import SearchPage from './SearchPage';
import InfoPage from './InfoPage';
import FeatureParser from '../util/FeatureParser';

export default function MuinaismuistotUI(settings, urlHashHelper, eventListeners) {
  var detailsPage;
  var settingsPage;
  var infoPage;
  var searchPage;
  var featureParser;
  var visiblePageId = null;
  var loadingAnimationTimeoutID = null;

  var init = function() {
    featureParser = new FeatureParser(settings);
    detailsPage = new FeatureDetailsPage(featureParser, settings, urlHashHelper, {
      hidePage : function() {
        hidePage('detailsPage');
      }
    });

    settingsPage = new SettingsPage(settings, {
      hidePage : function() {
        hidePage('settingsPage');
      }
    });

    searchPage = new SearchPage(featureParser, settings, urlHashHelper, {
      hidePage : function() {
        hidePage('searchPage');
      },
      searchResultItemClicked: function() {
        hidePage('searchPage');
      },
      searchMuinaismuistoja: function(searchText, callbackFn) {
        eventListeners.searchMuinaismuistoja(searchText, callbackFn);
      }
    });

    infoPage = new InfoPage({
      hidePage : function() {
        hidePage('infoPage');
      }
    });

    $('#map-button-zoom-in').on('click', function() {
      eventListeners.zoomIn();
    });

    $('#map-button-zoom-out').on('click', function() {
      eventListeners.zoomOut();
    });

    $('#map-button-position').on('click', function() {
      eventListeners.centerToCurrentPositions();
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

  this.showLoadingAnimation = function(show) {
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

  this.muinaisjaannosFeaturesSelected = function(muinaisjaannosFeatures) {
    detailsPage.setMuinaisjaannosFeatures(muinaisjaannosFeatures);
    showPage('detailsPage');
  };

  this.visibleMuinaismuistotLayersChanged = function(selectedLayerIds) {
    settingsPage.setVisibleMuinaismuistotLayers(selectedLayerIds);
  }

  init();
};
