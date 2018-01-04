(function (window) {
	'use strict';

	function Controller(view) {
		var self = this;
		self.view = view;

		self.view.bind("searchbarFocused", function () {
			self.lightenSearchbar();
		});

		self.view.bind("searchbarBlurred", function () {
			self.darkenSearchbar();
		});

		self.view.bind("triggerSearch", function (searchText) {
			self.searchForWord(searchText);
		});

		self.view.bind("fileChosen", function (filepath) {
			self.showPredictedWords(filepath);
		});
	}

	Controller.prototype.lightenSearchbar = function () {
		this.view.render("lightenSearchbar");
	};

	Controller.prototype.darkenSearchbar = function () {
		this.view.render("darkenSearchbar");
	};

    Controller.prototype.searchForWord = function (searchText) {
		var self = this;
        searchText = searchText.trim();

		if (searchText === '') { // cancel search if only whitespaces typed in the searchbar
			return;
		}

		API.wordnik.searchForWord(searchText, function(count) {
			console.log(count);
		});
    };

	Controller.prototype.showPredictedWords = function (filepath) {
		var self = this;
		self.view.render("showPredictionPanel");
		UTIL.getDataUri(filepath, function (data, fileUrl) {
			self.view.render("showThumb", {
				thumb: fileUrl
			});

			API.clarifai.getPrediction(data, function (predictions) {
				self.view.render("showPredictionResult", {
					words: predictions.map(x => x.name)
				});
			});
		});
	};

	// Export to window
	window.app = window.app || {};
	window.app.wordController = Controller;
})(window);
