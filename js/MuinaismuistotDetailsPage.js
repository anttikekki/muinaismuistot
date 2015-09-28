var MuinaismuistotDetailsPage = function() {
	var self = this;
	var muinaisjaannos = null;
	var eventListener;

	this.init = function() {
		$('#hide-detailsPage-button').on('click', function() {
			eventListener.hideDetailsPage();
		});
	};

	this.setEventListener = function(listener) {
	    eventListener = listener;
	};

	this.setMuinaisjaannos = function(muinaisjaannos) {
		muinaisjaannos = muinaisjaannos;
		if(muinaisjaannos) {
			displayData(muinaisjaannos);
		}
	};

	var displayData = function(muinaisjaannos) {
		$('#Kohdenimi').html(muinaisjaannos.attributes.Kohdenimi.trim());
		$('#Ajoitus').html(muinaisjaannos.attributes.Ajoitus.trim());
		$('#Tyyppi').html(muinaisjaannos.attributes.Tyyppi.trim());
		$('#Alatyyppi').html(muinaisjaannos.attributes.Alatyyppi.trim());
		$('#Laji').html(muinaisjaannos.attributes.Laji.trim());
		$('#muinaisjaannosarekisteri-link').attr('href', muinaisjaannos.attributes.URL)
	};
};