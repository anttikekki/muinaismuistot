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
		this.loadKulttuuriymparistoData(muinaisjaannosTunnus);
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

	this.loadKulttuuriymparistoData = function(muinaisjaannosTunnus) {
		var self = this;
		var url = 'http://kulttuuriymparisto.nba.fi/netsovellus/rekisteriportaali/mjreki/read/asp/r_kohde_det1.aspx?KOHDE_ID=' + muinaisjaannosTunnus;

		$.ajax({
	        url: url,
	        success: function(response) {
	          self.parseKulttuuriymparistoData(response);
	        }
      	});
	};

	this.parseKulttuuriymparistoData = function(response) {
		var $response = $(response);
		$kuvaus = $response.find( "div:contains('Kuvaus:')");
		console.log(response);
		console.log($kuvaus);
	};
};