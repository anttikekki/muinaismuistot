var Muinaismuistot = function() {
  var self = this;
  var map = null;
  var detailsPage = null;
  var settingsPage = null;
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
      hideDetailsPage : function() {
        hidePage('detailsPage');
      }
    });

    settingsPage = new MuinaismuistotSettingsPage();
    settingsPage.init(muinaismuistotSettings);
    settingsPage.setEventListener({
      hideSettingsPage : function() {
        hidePage('settingsPage');
      }
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