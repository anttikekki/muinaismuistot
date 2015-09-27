var Muinaismuistot = function() {
  var self = this;
  this.map = null;
  this.detailsPage = null;
  this.settingsPage = null;
  this.muinaismuistotData = null;
  this.muinaismuistotSettings = null;

  this.init = function() {
    this.muinaismuistotSettings = new MuinaismuistotSettings();
    this.muinaismuistotSettings.init();

    this.muinaismuistotData = new MuinaismuistotData();
    this.muinaismuistotData.init(this.muinaismuistotSettings);

    this.map = new MuinaismuistotMap();
    this.map.init(this.muinaismuistotData, this.muinaismuistotSettings);
    this.map.setEventListener({
      muinaisjaannosSelected : function(muinaisjaannos) {
        self.detailsPage.setMuinaisjaannos(muinaisjaannos);
        self.showPage('detailsPage');
      }
    });

    this.detailsPage = new MuinaismuistotDetailsPage();
    this.detailsPage.init();
    this.detailsPage.setEventListener({
      hideDetailsPage : function() {
        self.hidePage('detailsPage');
      }
    });

    this.settingsPage = new MuinaismuistotSettingsPage();
    this.settingsPage.init(this.muinaismuistotSettings);
    this.settingsPage.setEventListener({
      hideSettingsPage : function() {
        self.hidePage('settingsPage');
      },
      selectedMapBackgroundLayerChanged: function(layerName) {
        self.map.setVisibleBackgroundLayerName(layerName);
      },
      visibleMuinaismuistotLayersChanged: function(selectedLayerIds) {
        self.map.setVisibleMuinaismuistotLayers(selectedLayerIds);
      }
    });

    $('#map-button-settings').on('click', function() {
      self.showPage('settingsPage');
    });
  };

  this.showPage = function(pageId) {
    $page = $('#'+pageId);

    if($page.hasClass('page-right-hidden')) {
      $page.removeClass('page-right-hidden').addClass('page-right-visible');
    }
  };

  this.hidePage = function(pageId) {
    $page = $('#'+pageId);

    if($page.hasClass('page-right-visible')) {
      $page.removeClass('page-right-visible').addClass('page-right-hidden');
    }
  };
};