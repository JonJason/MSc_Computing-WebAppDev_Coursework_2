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
	UTIL.$on = function(element, name, listener, useCapture) {
		// !! (double exclamation mark) here convert the value to true or false
		element.addEventListener(name, listener, !!useCapture);
	};

	/**
	 * remove event listener from an element
	 * @param {DOM Element Object} element	- DOM Element Object where we want to add an event listener
	 * @param {String} name					- event name
	 * @param {Function} callback			- function that will be called when the event triggered
	 */
	UTIL.$off = function(element, name, listener) {
		element.removeEventListener(name, listener);
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

	/**
	 * Obtain base64 image data from file
	 * @param {String} file		- file object that is gotten from input file
	 * @param {String} callback	- callback function after the data obtained
	 */
	 UTIL.getDataUri = function(file, callback) {
		var reader = new FileReader();

		UTIL.$on(reader, "load", function(event) {
			callback && callback(reader.result.replace(/^data:image\/(.*);base64,/, ''), reader.result);
		});

		if (!!file) {
			reader.readAsDataURL(file);
		}
	};

	/**
	 * Obtain base64 image data from file
	 * @param {String} file		- file object that is gotten from input file
	 * @param {String} callback	- callback function after the data obtained
	 */
	 UTIL.parseTemplate = function(id, data) {
		 var text = UTIL.qs("#" + id).innerHTML;
		 for (var key in data) {
		 	if (data.hasOwnProperty(key)) {
				// replace all occurences by using regular expression with global modifier in the search keyword
				text = text.replace(new RegExp("{{" + key + "}}", "g"), data[key]);
		 	}
		 }

		 return text;
	};

	// get aspect ratio of object which has width and height
	UTIL.getAspectRatio = function(size) {
		return size.width/size.height;
	};

	/**
	* I copied this function from the url below.
	* https://stackoverflow.com/questions/3662821/how-to-correctly-use-innerhtml-to-create-an-element-with-possible-children-fro
	* @param {String} str		- html string
	*/
	UTIL.createElement = function (str) {
		// creates an imaginary Node Object
	    var frag = document.createDocumentFragment();

	    var elem = document.createElement('div');
	    elem.innerHTML = str;

	    while (elem.childNodes[0]) {
	        frag.appendChild(elem.childNodes[0]);
	    }
	    return frag;
	};

	/**
	* @param {String} animation	- animation function
	* @param {integer} duration - duration of the animation in millisecond
	*/
	UTIL.animate = function (animation, duration) {

		var start = null;

		function step(timestamp) {
		  if (!start) start = timestamp; // starting time
		  var progress = timestamp - start; // progress time

		  // call animation function with map progress value (0 to 1)
		  animation(UTIL.easeInOutCubic(progress, duration));

		  if (progress < duration) { // if there is still time
		    window.requestAnimationFrame(step);
		  }
		}

		window.requestAnimationFrame(step);
	};

	/**
	* ease in out cubic function, both parameter needs to be in the same unit
	* @param {integer} t		- time variable
	* @param {integer} duration - total duration
	*/
	UTIL.easeInOutCubic = function (t, duration) {
		t /= duration/2; // twice of progress (value goes from 0 to 2)

		// if progress is below 50%
		if (t < 1) { return t*t*t/2; }
		// if progress is equal to or above 50%
		if (t > 2) { t = 2; } // prevent overflow
		t = 2 - t;
		return 1 - t*t*t/2;
	};

	/**
	* deep clone function
	* @param {object|array} o	- object to clone, however, it will work for array too
	*/
	UTIL.clone = function(o) {
		var deepClone = function(obj) {
			// neither array nor object
			if (typeof obj !== "object" || obj === null) {
				return obj;
			}

			// is array
			if (obj.length !== undefined) {
				var value = [];
				// iterate through each element
				for (var element of obj) {
					// push clone of the element to the new array
					value.push(deepClone(element));
				}

				return value;
			}

			// is object.
			var val = {};
			// iterate through each property
			for (var property in obj) {
				if (obj.hasOwnProperty(property)) {
					// assign clone of the property to property of the new object
					val[property] = deepClone(obj[property]);
				}
			}
			return val;
		};

		return deepClone(o);
	};


	/**
	* compare date, month, and year
	* @param {date} date1	- date 1
	* @param {date} date2	- date 2
	*/
	UTIL.compareDate = function(date1, date2) {
		if (date1.getDate() == date2.getDate()) {
			return false;
		}

		if (date1.getMonth() == date2.getMonth()) {
			return false;
		}

		if (date1.getFullYear() == date2.getFullYear()) {
			return false;
		}

		return true;
	};

	return UTIL;
})(UTIL || {});
