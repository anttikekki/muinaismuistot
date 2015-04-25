var MuinaismuistotDetailsPage = function() {
	var self = this;
	this.muinaisjaannosTunnus = null;
	this.muinaisjaannospisteData = null;
	this.apiUrl;
	this.eventListener;

	this.init = function(apiUrl) {
		this.apiUrl = apiUrl;

		$('#hide-detailsPage-button').on('click', function() {
			self.eventListener.hideDetailsPage();
		});
	};

	this.setEventListener = function(listener) {
	    this.eventListener = listener;
	};

	this.setMuinaisjaannosTunnus = function(muinaisjaannosTunnus) {
		this.muinaisjaannosTunnus = muinaisjaannosTunnus;
		this.loadMuinaisjaannospisteData(muinaisjaannosTunnus);
	};

	this.loadMuinaisjaannospisteData = function(muinaisjaannosTunnus) {
		$.ajax({
	        url: self.apiUrl + '?format=json&columns=KOHDENIMI,AJOITUS,TYYPPI,ALATYYPPI,LAJI&MJTUNNUS=' + muinaisjaannosTunnus,
	        success: function(response) {
	        	self.muinaisjaannospisteData = $.isArray(response) ? response[0] : response;
	          	self.displayData(self.muinaisjaannospisteData);
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