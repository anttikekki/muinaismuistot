var Muinaismuistot = function() {
  var self = this;
  this.map = null;
  this.detailsPage = null;
  this.settingsPage = null;
  this.muinaismuistotData = null;

  this.init = function() {
    this.muinaismuistotData = new MuinaismuistotData();
    this.muinaismuistotData.init();

    this.map = new MuinaismuistotMap();
    this.map.init(this.muinaismuistotData);
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
    this.settingsPage.init();
    this.settingsPage.setSelectedMapBackgroundLayerName(this.map.getVisibleBackgroundLayerName());
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

    //Update selected muinausmuisto layers initial situation
    this.map.setVisibleMuinaismuistotLayers(this.settingsPage.getSelectedMuinaismuistotLayerIds());

    $('#map-button-settings').on('click', function() {
      self.showPage('settingsPage');
    });

    // Use FastClick to eliminate the 300ms delay between a physical tap
    // and the firing of a click event on mobile browsers.
    // See http://updates.html5rocks.com/2013/12/300ms-tap-delay-gone-away
    // for more information.
    //FastClick.attach(document.body);
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