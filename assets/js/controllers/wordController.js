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

	// Export to window
	window.app = window.app || {};
	window.app.wordController = Controller;
})(window);
