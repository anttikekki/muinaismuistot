var MuinaismuistotSearchPage = function() {
	var self = this;
	var eventListener;
	var muinaismuistotData;
	var muinaismuistotSettings;

	this.init = function(data, settings) {
		muinaismuistotData = data;
		muinaismuistotSettings = settings;

		$('#hide-searchPage-button').on('click', function() {
			eventListener.hidePage();
		});
		
		$('#search-button').on('click', function() {
			search($('#search-text').val());
		});

		$("#search-form").submit(function(e) {
			e.preventDefault();
			search($('#search-text').val());
		});
	};

	this.setEventListener = function(listener) {
	    eventListener = listener;
	};

	var search = function(searchText) {
		muinaismuistotData.findFeatures(searchText, displayResults);
	};

	var displayResults = function(searchResults) {
		var htmlRows = [];
		searchResults.forEach(function(resultRow) {
			htmlRows.push(generateResultFeatureRowHtml(resultRow));
		});

		$('#search-results-container').empty().html('<div class="list-group">' + htmlRows.join('') + '</div>');
	};

	var generateResultFeatureRowHtml = function(feature) {
		var nimi = muinaismuistotData.getFeatureName(feature);
		var tyypinNimi = muinaismuistotData.getFeatureTypeName(feature);
		var iconURL = muinaismuistotData.getFeatureTypeIconURL(feature);

		return '<a href="#" class="list-group-item">' +
		    '<h4 class="list-group-item-heading">' + nimi + '</h4>' +
		    '<p class="list-group-item-text"><img src="' + iconURL + '"> ' + tyypinNimi + '</p>' +
		  '</a>';
	};
};