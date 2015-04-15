var Muinaismuistot = function() {
  this.map = null;
  this.detailsPage = null;
  this.apiUrl = null;

  this.init = function() {
    var self = this;
    this.apiUrl = window.location.href + 'api/index.php';

    this.map = new MuinaismuistotMap();
    this.map.init(this.apiUrl);

    this.detailsPage = new MuinaismuistotDetailsPage();
    this.detailsPage.init(this.apiUrl);

    $.mobile.pageContainer.pagecontainer({
      beforechange: function( event, ui ) {
        self.detailsPage.pageBeforechange(ui.options.muinaisjaannosTunnus);
      },
      change: function( event, ui ) {

      }
    });
  };
};