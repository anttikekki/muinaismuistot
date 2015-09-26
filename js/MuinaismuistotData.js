var MuinaismuistotData = function() {
  var self = this;
  this.muinaisjaannospisteetSortByX = [];
  this.muinaisjaannospisteetSortByY = [];

  this.init = function() {
    $.ajax({
      url: 'data/Muinaisjaannospisteet_min.json',
      success: function(response) {
        self.setMuinaisjaannospisteet(response);
      }
    });
  };

  this.setMuinaisjaannospisteet = function(data) {
    this.muinaisjaannospisteetSortByX = data.sort(this.comparatorByX);
    this.muinaisjaannospisteetSortByY = data.slice().sort(this.comparatorByY);
  };

  this.comparatorByX = function(a, b) {
    return a.x - b.x;
  };

  this.comparatorByY = function(a, b) {
    return a.y - b.y;
  };
};