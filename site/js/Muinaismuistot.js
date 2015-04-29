var Muinaismuistot = function() {
  var self = this;
  this.map = null;
  this.detailsPage = null;
  this.apiUrl = null;

  this.init = function() {
    this.apiUrl = window.location.href + 'api/index.php';

    this.map = new MuinaismuistotMap();
    this.map.init(this.apiUrl);
    this.map.setEventListener({
      muinaisjaannosSelected : function(muinaisjaannosTunnus) {
        self.detailsPage.setMuinaisjaannosTunnus(muinaisjaannosTunnus);
        self.showPage('detailsPage');
      }
    });

    this.detailsPage = new MuinaismuistotDetailsPage();
    this.detailsPage.init(this.apiUrl);
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