var MuinaismuistotDetailsPage = function() {
	this.muinaisjaannosTunnus = null;
	this.muinaisjaannospisteData = null;
	this.apiUrl;

	this.init = function(apiUrl) {
		this.apiUrl = apiUrl;
	};

	this.pageBeforechange = function(muinaisjaannosTunnus) {
		this.muinaisjaannosTunnus = muinaisjaannosTunnus;
		this.loadMuinaisjaannospisteData(muinaisjaannosTunnus);
	};

	this.loadMuinaisjaannospisteData = function(muinaisjaannosTunnus) {
		var self = this;
		$.ajax({
	        url: self.apiUrl + '?format=json&columns=KOHDENIMI,AJOITUS,TYYPPI,ALATYYPPI,LAJI&MJTUNNUS=' + muinaisjaannosTunnus,
	        success: function(response) {
	        	self.muinaisjaannospisteData = response;
	          	self.displayData(response);
	        }
      	});
	};

	this.displayData = function(data) {
		if(!data) {
			return;
		}

		$.each(data, function(key, value) {
			$('#'+key).html(value);
		});
	};
};