(function (window) {
	"use strict";

	function View(template) {
	}

	View.prototype.render = function (viewCmd, parameter) {
		var self = this;
		var viewCommands = {
		};

		viewCommands[viewCmd]();
	};

    /**
     * to bind event happens on the interface (such as search on searchbar)
     * @param {String} event        - view event name
     * @param {Function} handler    - event handler
     */
	View.prototype.bind = function (event, handler) {
		var self = this;
	};

	// Export to window
	window.app = window.app || {};
	window.app.AboutView = View;
}(window));
