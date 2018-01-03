var UTIL = (function (UTIL) {
	'use strict';

	/**
	 * I copied the function from url below. this function is just to make the code clearer and shorter
	 * https://github.com/tastejs/todomvc/blob/gh-pages/examples/vanillajs/js/helpers.js
	 * @param {String} selector				- css selector string
	 * @param {DOM Element Object} scope	- HTML DOM Element where we want to look for an element inside
	 */
	UTIL.qs = function (selector, scope) {
		return (scope || document).querySelector(selector);
	};

	/**
	 * I copied the function from url below. this function is just to make the code clearer and shorter
	 * https://github.com/tastejs/todomvc/blob/gh-pages/examples/vanillajs/js/helpers.js
	 * @param {String} selector				- css selector string
	 * @param {DOM Element Object} scope	- DOM Element Object where we want to look for an element inside
	 */
	UTIL.qsa = function (selector, scope) {
		return (scope || document).querySelectorAll(selector);
	};

	/**
	 * I copied the function from url below. this function is just to make the code clearer and shorter
	 * https://github.com/tastejs/todomvc/blob/gh-pages/examples/vanillajs/js/helpers.js
	 * @param {DOM Element Object} element	- DOM Element Object where we want to add an event listener
	 * @param {String} name					- event name
	 * @param {Function} callback			- function that will be called when the event triggered
	 */
	UTIL.$on = function(element, name, callback, useCapture) {
		// !! (double exclamation mark) here convert the value to true or false
		element.addEventListener(name, callback, !!useCapture);
	};

	/**
	 * I copied the function from url below and modify it to
	 * enable catching event happen under the child element (the child element under the tree of child element).
	 * this function is useful to catch event occured on child element from parent
	 * https://github.com/tastejs/todomvc/blob/gh-pages/examples/vanillajs/js/helpers.js
	 * @param {DOM Element Object} parent	- DOM Element Object where we want to add an event listener
	 * @param {String} selector				- child selector
	 * @param {String} type					- child event type
	 * @param {Function} handler			- function that will be called when the event triggered
	 */
	UTIL.$delegate = function (parent, selector, type, handler) {
		function dispatchEvent(event) {
			var targetElement = event.target;
			var potentialElements = UTIL.qsa(selector, parent);
			var parentIndex = event.path.indexOf(parent);

			for (var i = 0; i < potentialElements.length; i++) {
				var childIndex = event.path.indexOf(potentialElements[i]);
				// the child element is found in the path
				// and is under the tree of parent element
				if (childIndex >= 0 && childIndex < parentIndex) {
					// add the actual selected target instead of the child element to the second parameter
					handler.call(targetElement, event, potentialElements[i]);
					return;
				}
			}
		}

		// https://developer.mozilla.org/en-US/docs/Web/Events/blur
		var useCapture = type === 'blur' || type === 'focus';

		UTIL.$on(parent, type, dispatchEvent, useCapture);
	};

	/**
	 * add class to an element
	 * @param {DOM Element Object} element	- DOM Element Object where we want to add a class to
	 * @param {String} name					- class name
	 */
	UTIL.$addClass = function(element, name) {
		element.classList.add(name);
	};

	/**
	 * remove class to an element
	 * @param {DOM Element Object} element	- DOM Element Object where we want to remove a class from
	 * @param {String} name					- class name
	 */
	UTIL.$removeClass = function(element, name) {
		element.classList.remove(name);
	};

	/**
	 * toggle class in an element
	 * @param {DOM Element Object} element	- DOM Element Object where we want to remove a class from
	 * @param {String} name					- class name
	 * @param {Boolean} state 				- state (optional)
	 */
	UTIL.$toggleClass = function(element, name, state) {
		if (state === undefined) {
			element.classList.toggle(name);
		} else {
			element.classList.toggle(name, !!state);
		}
	};

	/**
	 * return boolean indicating that the element contains a certain class or not
	 * @param {DOM Element Object} element	- DOM Element Object where we want to remove a class from
	 * @param {String} name					- class name
	 */
	UTIL.$containsClass = function(element, name) {
		return element.classList.contains(name);
	};

	/**
	 * this function is for sending a request to another server
	 * @param {String} url		- endpoint url
	 * @param {Object} options	- this parameter should consist of onLoad, type(default = "GET"),
	 * 							  isAsync (default = true). if onLoad is undefined nothing will happen
	 * 							  after the server responds
	 */
	UTIL.sendRequest = function(url, options) {
		var opt = options || {};
		opt.type = opt.type || "GET";
		var xhttp = new XMLHttpRequest();

		if (opt.isAsync !== false) {
			opt.isAsync = true;
		}

		xhttp.open(opt.type, url, opt.isAsync);

		for (var header in opt.headers) {
			if (opt.headers.hasOwnProperty(header)) {
				xhttp.setRequestHeader(header, opt.headers[header]);
			}
		}

		if (opt.isAsync) { // asynchronous request
			UTIL.$on(xhttp, "load", function() {
				opt.onLoad && opt.onLoad(this.response);
			});
			xhttp.send();
		} else { // synchronous request
			xhttp.send();
			opt.onLoad && opt.onLoad(xmlHttp.responseText);
		}
	}

	/**
	 * a method to build request URI
	 * @param {String} action	- action name
	 * @param {Array} [params]	- array of the key-value pair of parameters
	 */
    UTIL.buildRequestURI = function (base, params, suffix) {
		var uri = base;

		if (typeof suffix == "string") {
			uri += suffix; // add uri suffix
		}

		var queryStrings = [];

		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				queryStrings.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
			}
		}

		if (queryStrings.length === 0) {
			return uri;
		}

		uri += "?"; // add uri queries separator

        return uri + queryStrings.join("&");
    };

	/**
	 * capitalise a string
	 * @param {String} str	- string to be capitalised
	 */
	UTIL.capitalise = function (str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	return UTIL;
})(UTIL || {});
