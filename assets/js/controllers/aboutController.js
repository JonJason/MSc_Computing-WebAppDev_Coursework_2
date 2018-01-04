(function (window) {
	'use strict';

	function Controller(view) {
		var self = this;
		self.view = view;
	}

	// Export to window
	window.app = window.app || {};
	window.app.AboutController = Controller;
})(window);
