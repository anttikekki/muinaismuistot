var Muinaismuistot = function() {
  this.map = null;
  this.detailsPage = null;
  this.apiUrl = null;

  this.init = function() {
    var self = this;
    this.apiUrl = window.location.href + 'api/index.php';

    this.map = new MuinaismuistotMap();
    this.map.init(this.apiUrl);
    this.map.setEventListener({
      muinaisjaannosSelected : function(muinaisjaannosTunnus) {
        self.detailsPage.setMuinaisjaannosTunnus(muinaisjaannosTunnus);
        $("#detailsPage").removeClass('page-right-hidden').addClass('page-right-visible');
      }
    });

    this.detailsPage = new MuinaismuistotDetailsPage();
    this.detailsPage.init(this.apiUrl);
    this.detailsPage.setEventListener({
      hideDetailsPage : function() {
        $("#detailsPage").removeClass('page-right-visible').addClass('page-right-hidden');
      }
    });
  };
};