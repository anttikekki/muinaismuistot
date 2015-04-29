var MuinaismuistotSettingsPage = function() {
	var self = this;
	this.eventListener;

	this.init = function() {
		$('#hide-settingsPage-button').on('click', function() {
			self.eventListener.hideSettingsPage();
		});
	};

	this.setEventListener = function(listener) {
	    this.eventListener = listener;
	};

};