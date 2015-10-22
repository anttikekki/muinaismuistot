var MuinaismuistotInfoPage = function() {
	var self = this;
	var eventListener;

	this.init = function() {

		$('#hide-infoPage-button').on('click', function() {
			eventListener.hidePage();
		});
	};

	this.setEventListener = function(listener) {
	    eventListener = listener;
	};

};