var Muinaismuistot = function() {
  this.map = null;
  this.detailsPage = null;

  this.init = function() {
    this.map = new MuinaismuistotMap();
    this.map.init();

    this.detailsPage = new MuinaismuistotDetailsPage();
    this.detailsPage.init();
  };
};