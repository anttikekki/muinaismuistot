var MuinaismuistotDetailsPage = function() {
	this.muinaisjaannosTunnus = null;
	this.muinaisjaannosData = null;
	this.apiUrl;

	this.init = function(apiUrl) {
		this.apiUrl = apiUrl;
	};

	this.pageBeforechange = function(muinaisjaannosTunnus) {
		this.muinaisjaannosTunnus = muinaisjaannosTunnus;
		this.loadMuinaisjaannosData(muinaisjaannosTunnus);
	};

	this.loadMuinaisjaannosData = function(muinaisjaannosTunnus) {
		var self = this;
		$.ajax({
	        url: self.apiUrl + '?format=json&columns=KOHDENIMI,AJOITUS,TYYPPI,ALATYYPPI,LAJI&MJTUNNUS=' + muinaisjaannosTunnus,
	        success: function(response) {
	          self.setMuinaisjaannosData(response);
	        }
      });
	};

	this.setMuinaisjaannosData = function(data) {
		this.muinaisjaannosData = data;
		if(!data) {
			return;
		}

		$.each(data, function(key, value) {
			$('#'+key).html(value);
		});
	};
};