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

		self.view.bind("goToPage", function (page) {
			self.goToPage(page);
		});
	}

	Controller.prototype.lightenSearchbar = function () {
		this.view.render("lightenSearchbar");
	};

	Controller.prototype.darkenSearchbar = function () {
		this.view.render("darkenSearchbar");
	};

    Controller.prototype.searchForWord = function (searchText) {
        searchText = searchText.trim();

		if (searchText === '') {
			return;
		}

		// go to word page with searchText as keyword
		window.location.href = UTIL.buildRequestURI(window.location.origin, { q: searchText }, "word");
    };

	Controller.prototype.goToPage = function (page) {
		// go to a page
		window.location.href = UTIL.buildRequestURI(window.location.origin, {}, page);
	};

	// Export to window
	window.app = window.app || {};
	window.app.HomeController = Controller;
})(window);
