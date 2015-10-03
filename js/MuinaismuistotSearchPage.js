var MuinaismuistotSearchPage = function() {
	var self = this;
	var eventListener;
	var muinaismuistotSettings;

	this.init = function(settings) {
		muinaismuistotSettings = settings;

		$('#hide-searchPage-button').on('click', function() {
			eventListener.hidePage();
		});
		
	};

	this.setEventListener = function(listener) {
	    eventListener = listener;
	};

};