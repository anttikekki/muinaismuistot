import $ from "jquery";

export default function SearchPage(featureParser, muinaismuistotSettings, urlHashHelper, eventListener) {
	var self = this;

	var init = function() {
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

	var search = function(searchText) {
		if(!searchText || searchText.trim().length < 3) {
			$('#search-form').addClass('has-error');
			$('#search-form-error').removeClass('hidden');
			return;
		}
		$('#search-form').removeClass('has-error');
		$('#search-form-error').addClass('hidden');
		eventListener.searchMuinaismuistoja(searchText, displayResults);
	};

	var displayResults = function(searchResults) {
		var htmlRows = [];
		searchResults.forEach(function(resultRow) {
			htmlRows.push(generateResultFeatureRowHtml(resultRow));
		});

		$('#search-results-container').empty().html('<div class="list-group">' + htmlRows.join('') + '</div>');
		$('#search-result-header').removeClass('hidden');
		$('#search-result-count').html(' (' + searchResults.length + ' kpl)');

		$('#search-results-container a').on('click', function() {
			eventListener.searchResultItemClicked();
		});
	};

	var generateResultFeatureRowHtml = function(feature) {
		var nimi = featureParser.getFeatureName(feature);
		var tyypinNimi = featureParser.getFeatureTypeName(feature);
		var iconURL = featureParser.getFeatureTypeIconURL(feature);
		var coordinates = featureParser.getFeatureLocation(feature);

		return '<a href="' + urlHashHelper.createLocationHash(coordinates, feature) + '" class="list-group-item">' +
		    '<h4 class="list-group-item-heading">' + nimi + '</h4>' +
		    '<p class="list-group-item-text"><img src="' + iconURL + '"> ' + tyypinNimi + '</p>' +
		  '</a>';
	};

	init();
};
