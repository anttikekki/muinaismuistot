var MuinaismuistotDetailsPage = function() {
	var self = this;
	this.muinaisjaannos = null;
	this.eventListener;

	this.init = function() {
		$('#hide-detailsPage-button').on('click', function() {
			self.eventListener.hideDetailsPage();
		});
	};

	this.setEventListener = function(listener) {
	    this.eventListener = listener;
	};

	this.setMuinaisjaannos = function(muinaisjaannos) {
		this.muinaisjaannos = muinaisjaannos;
		if(muinaisjaannos) {
			this.displayData(muinaisjaannos);
		}
	};

	this.displayData = function(muinaisjaannos) {
		$('#Kohdenimi').html(muinaisjaannos.attributes.Kohdenimi.trim());
		$('#Ajoitus').html(muinaisjaannos.attributes.Ajoitus.trim());
		$('#Tyyppi').html(muinaisjaannos.attributes.Tyyppi.trim());
		$('#Alatyyppi').html(muinaisjaannos.attributes.Alatyyppi.trim());
		$('#Laji').html(muinaisjaannos.attributes.Laji.trim());
		$('#muinaisjaannosarekisteri-link').attr('href', muinaisjaannos.attributes.URL)
	};
};