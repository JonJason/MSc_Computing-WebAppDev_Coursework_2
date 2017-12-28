(function (window) {
	'use strict';

	function Controller(view) {
		var self = this;
		self.view = view;

		self.view.bind("triggerSearch", function (searchText) {
			self.searchForWord(searchText);
		});
	}

	// Export to window
	window.app = window.app || {};
	window.app.HomeController = Controller;
})(window);
