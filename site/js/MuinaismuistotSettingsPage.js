var MuinaismuistotSettingsPage = function() {
	var self = this;
	this.eventListener;

	this.init = function() {
		$('#hide-settingsPage-button').on('click', function() {
			self.eventListener.hideSettingsPage();
		});

		$("input[name='selectedMapLayer']").change(function() {
			var mapLayerName = $(this).val();
			self.eventListener.selectedMapBackgroundLayerChanged(mapLayerName);
		});
	};

	this.setEventListener = function(listener) {
	    this.eventListener = listener;
	};

	this.setSelectedMapBackgroundLayerName = function(mapName) {
		$('#map-selection-'+mapName).click();
	};

};