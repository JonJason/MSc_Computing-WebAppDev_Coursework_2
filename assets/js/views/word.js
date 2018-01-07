(function (window) {
	"use strict";

	function View(template) {
		this.ENTER_KEY = 13;

		this.eventListener = {}; // to hold temporary eventListener

		/* search-panel */
		this.$searchPanel = UTIL.qs(".search-panel");

		// search
		this.$searchbarWrapper = UTIL.qs(".searchbar-wrapper", this.$searchPanel);
		this.$searchbar = UTIL.qs(".searchbar", this.$searchbarWrapper);
		this.$searchButton = UTIL.qs(".search-btn", this.$searchbarWrapper);

		// image uploader
		this.$imageUploader = UTIL.qs(".img-uploader", this.$searchPanel);

		// extra link
		this.$extraLinkWrapper = UTIL.qs(".extra-link-wrapper", this.$searchPanel);

		/* result-panel */
		this.$resultPanel = UTIL.qs(".result-panel");
		this.$resultWrapper = UTIL.qs(".result-wrapper", this.$resultPanel);
		this.$wordList = UTIL.qs(".word-list", this.$resultWrapper);
		this.$emptyResult = UTIL.qs(".empty-result", this.$resultWrapper);
		this.$btnGoToTop = UTIL.qs(".go-to-top", this.$resultWrapper);
		this.$btnGoToPrev = UTIL.qs(".go-to-prev", this.$resultWrapper);
		this.$btnGoToNext = UTIL.qs(".go-to-next", this.$resultWrapper);
		this.$navPosition = UTIL.qs(".nav-position", this.$resultWrapper);

		/* prediction-panel */
		this.$predictionPanel = UTIL.qs(".prediction-panel");
		this.$predictionWrapper = UTIL.qs(".prediction-wrapper", this.$predictionPanel);

		// thumb
		this.$imageWrapper = UTIL.qs(".image-wrapper", this.$predictionWrapper);
		this.$thumb = UTIL.qs(".thumbnail", this.$imageWrapper);
		this.$preloader = UTIL.qs(".preloader-overlay", this.$predictionWrapper);

		// predicted word
		this.$predictedWordWrapper = UTIL.qs(".predicted-word-wrapper", this.$predictionWrapper);
		this.$predictedWordListHeader = UTIL.qs(".list-header", this.$predictedWordWrapper);
		this.$predictedWordList = UTIL.qs(".predicted-word-list", this.$predictedWordWrapper);
	};

    /**
     * to bind event happens on the interface (such as search on searchbar)
     * @param {String} event        - view event name
     * @param {Function} handler    - event handler
     */
	View.prototype.bind = function (event, handler) {
		var self = this;
		if (event === "triggerSearch") {
            UTIL.$on(self.$searchbar, "keypress", function (event) {
                if (event.keyCode == self.ENTER_KEY) {
                    // prevent submitting the form
                    event.preventDefault();

    				handler(self.$searchbar.value);
                }
            });

			UTIL.$on(self.$searchButton, "click", function (event) {
				event.preventDefault();

				handler(self.$searchbar.value);
			});
		} else if (event === "searchbarFocused") {
			UTIL.$on(self.$searchbar, "focus", function(event) {
				handler();
			});
		} else if (event === "searchbarBlurred") {
			UTIL.$on(self.$searchbar, "blur", function(event) {
				handler();
			});
		} else if (event === "fileChosen") {
			UTIL.$on(self.$imageUploader, "change", function(event) {
				handler(self.$imageUploader.files[0]);
			});
		} else if (event === "predictionWordPicked") {
			UTIL.$delegate(self.$predictedWordList, ".predicted-word", "click", function(event, currentTarget) {
				handler(currentTarget.dataset.word, self._isPredictedWordCollapsible());
			});
		} else if (event === "wordPhraseClick") {
			UTIL.$delegate(self.$wordList, ".word-phrase", "click", function(event, currentTarget) {
				handler(currentTarget.dataset.phrase);
			});
		} else if (event === "extraLinkClick") {
			UTIL.$delegate(self.$extraLinkWrapper, ".extra-link", "click", function(event, currentTarget) {
				handler();
			});
		} else if (event === "goToTop") {
			UTIL.$on(this.$btnGoToTop, "click", function () {
				handler();
			});
		} else if (event === "previousResult") {
			UTIL.$on(this.$btnGoToPrev, "click", function () {
				handler();
			});
		} else if (event === "nextResult") {
			UTIL.$on(this.$btnGoToNext, "click", function () {
				handler();
			});
		}
	};

	View.prototype.render = function (viewCmd, parameter) {
		var self = this;
		var viewCommands = {
			lightenSearchbar: function () {
				self._ligtenSearchbar();
			},

			darkenSearchbar: function () {
				self._darkenSearchbar();
			},

			showResultPanel: function() {
				self._showResultPanel();
			},

			hideResultPanel: function() {
				self._hideResultPanel();
			},

			showPredictionPanel: function () {
				self._showPredictionPanel();
				self._showThumbPreloader("Loading");
				self._unstickPredictionPanelToHeader();
				self._makePredictedWordNotCollapsible();
				self._showThumbWrapper();
			},

			showThumb: function () {
				self._setThumb(parameter.thumb);
				self._showThumbPreloader("Predicting");
			},

			showPredictionResult: function () {
				self._hideThumbPreloader();
				self._showPredictedWords(parameter.words);
			},

			addWord: function () {
				self._addWordItem(parameter);
			},

			updateWord: function () {
				self._updateWordItem(parameter.id, parameter.key, parameter.value);
			},

			makePredictedWordCollapsible: function () {
				self._hideThumbWrapper();
				self._makePredictedWordCollapsible();
				self._stickPredictionPanelToHeader();
			},

			collapsePredictedWord: function () {
				self._collapsePredictedWord();
			},

			setActiveResult: function () {
				self._setActiveResult(parameter.scrollTop, parameter.scrollAreaHeight);
			}
		};

		viewCommands[viewCmd]();
	};

	View.prototype._ligtenSearchbar = function() {
		UTIL.$addClass(this.$searchbarWrapper, "active");
	};

	View.prototype._darkenSearchbar = function() {
		UTIL.$removeClass(this.$searchbarWrapper, "active");
	};

	View.prototype._showResultPanel = function() {
		UTIL.$addClass(this.$resultPanel, "show");
	};

	View.prototype._hideResultPanel = function() {
		UTIL.$removeClass(this.$resultPanel, "show");
	};

	View.prototype._showPredictionPanel = function() {
		UTIL.$addClass(this.$predictionPanel, "show")
	};

	View.prototype._hidePredictionPanel = function() {
		UTIL.$removeClass(this.$predictionPanel, "show")
	};

	View.prototype._showThumbWrapper = function (text) {
		UTIL.$removeClass(this.$imageWrapper, "hidden");
	};

	View.prototype._hideThumbWrapper = function () {
		UTIL.$addClass(this.$imageWrapper, "hidden");
	};

	View.prototype._collapsePredictedWord = function () {
		UTIL.$addClass(this.$predictedWordWrapper, "collapsed");
	};

	View.prototype._isPredictedWordCollapsible = function () {
		return UTIL.$containsClass(this.$predictedWordWrapper, "collapsible");
	};

	View.prototype._openPredictedWord = function () {
		UTIL.$removeClass(this.$predictedWordWrapper, "collapsed");
	};

	View.prototype._makePredictedWordCollapsible = function () {
		var self = this;
		UTIL.$addClass(self.$searchPanel, "shifted");
		UTIL.$addClass(self.$predictedWordWrapper, "collapsible");

		// save toggle collapse event listener
		self.eventListener.PWCollapsible = function () {
			UTIL.$toggleClass(self.$predictedWordWrapper, "collapsed");
		};
		// add toggle collapse event listener
		UTIL.$on(self.$predictedWordListHeader, "click", self.eventListener.PWCollapsible);
	};

	View.prototype._makePredictedWordNotCollapsible = function () {
		UTIL.$removeClass(this.$searchPanel, "shifted");
		UTIL.$removeClass(this.$predictedWordWrapper, "collapsible");
		UTIL.$removeClass(this.$predictedWordWrapper, "collapsed");

		// remove toggle collapse event listener
		UTIL.$off(this.$predictedWordListHeader, "click", this.eventListener.PWCollapsible);
		// delete toggle collapse event listener
		delete this.eventListener.PWCollapsible;
	};

	View.prototype._stickPredictionPanelToHeader = function() {
		UTIL.$addClass(this.$predictionPanel, "stick");
	};

	View.prototype._unstickPredictionPanelToHeader = function() {
		UTIL.$removeClass(this.$predictionPanel, "stick");
	};

	View.prototype._showThumbPreloader = function(text) {
		if (!!text) {
			this.$preloader.dataset.text = text;
		}
		UTIL.$addClass(this.$preloader, "show");
	};

	View.prototype._hideThumbPreloader = function() {
		UTIL.$removeClass(this.$preloader, "show");
	};

	View.prototype._setThumb = function(thumb) {
		var self = this;

		var onload = function () {
			var aspectRatio = UTIL.getAspectRatio({ width: self.$thumb.width, height: self.$thumb.height })
			UTIL.$removeClass(self.$thumb, "fit-height");
			UTIL.$removeClass(self.$thumb, "fit-width");
			if (aspectRatio >= 1) { // landscape
				UTIL.$addClass(self.$thumb, "fit-width");
			} else { // portrait
				UTIL.$addClass(self.$thumb, "fit-height");
			}
			UTIL.$off(self.$thumb, "load", onload);
		};

		UTIL.$on(this.$thumb, "load", onload);

		this.$thumb.src = thumb;
	};

	View.prototype._showPredictedWords = function(words) {
		var list = "";

		for (var word of words) {
			list += UTIL.parseTemplate("predicted_word_item", { word: word });
		}

		this.$predictedWordList.innerHTML = list;
	};

	View.prototype._addWordItem = function(data) {
		UTIL.$addClass(this.$emptyResult, "hidden");
		var wordItem = UTIL.createElement(UTIL.parseTemplate("word_item", data));
		this.$wordList.appendChild(wordItem);
	};

	View.prototype._updateWordItem = function(id, key, value) {
		var wordItem = UTIL.qs("#word_" + id, this.$wordList);
		var wrappers = {
			audios: "audio-wrapper",
			definitions: "definition-wrapper",
			phrases: "phrase-wrapper",
			examples: "example-wrapper"
		};

		var classNames = {
			audios: "audio-container",
			definitions: "word-definition-list",
			phrases: "word-phrase-list",
			examples: "word-example-list"
		};

		var templates = {
			audios: "word_audio_item",
			definitions: "word_definition_item",
			phrases: "word_phrase_item",
			examples: "word_example_item"
		};

		var parent = UTIL.qs("." + classNames[key], wordItem);
		for (var data of value) {
			var child = UTIL.createElement(UTIL.parseTemplate(templates[key], data));
			parent.appendChild(child);
		}

		var wrapper = UTIL.qs("." + wrappers[key], wordItem);
		UTIL.$removeClass(wrapper, "hidden");

		if (key == "audios") { // bind pronounce event
			var audioWrapper = parent.parentElement;

			if (value.length < 1) { // if there is no pronunciation found, hide the speaker icon
				UTIL.$addClass(audioWrapper, "no-audio");
				return;
			}

			parent.dataset.index = 0;
			var pronounce = function() {
				var audioContainer = audioWrapper.children[0];

				// get the index of the audio to play and
				// transform index to integer since dataset stored as string
				var index = parseInt(audioContainer.dataset.index);
				var audio = audioContainer.children[index];

				// transform duration to float since dataset stored as string and
				// change the unit to millisecond which is the unit used by setTimeout function
				var duration = parseFloat(audio.dataset.duration) * 1000;

				// play audio and animation
				audio.play();
				UTIL.$addClass(audioWrapper, "speaking");

				// set timeout to stop speaking animation by the duration
				setTimeout(function() {
					UTIL.$removeClass(audioWrapper, "speaking");
				}, duration);

				index++; // next audio for next play
				index = index % audioContainer.childElementCount; // reset index to 0 when reach the count
				audioContainer.dataset.index = index; // store back the next index in the dataset
			};
			UTIL.$on(audioWrapper, "click", pronounce);
		} else if (key == "examples") {
			var exampleWrapper = parent.parentElement;
			var toggleExamples = function () {
				UTIL.$toggleClass(exampleWrapper, "opened");
			};
			var exampleHeader = UTIL.qs(".example-header", exampleWrapper);
			UTIL.$on(exampleHeader, "click", toggleExamples);
		}
	};

	View.prototype._setActiveResult = function (scrollTop, scrollAreaHeight) {
		if (this.$wordList.children.length < 1) {
			return;
		}

		// visible limit (half of the scroll area from top of the scroll area)
		var cutoff = scrollAreaHeight * 0.5;
		var children = this.$wordList.children;
		for (var i = 0; i < children.length; i++) {
			// if bottom line is visually below the cutoff line
			if (children[i].offsetTop + children[i].offsetHeight - scrollTop >= cutoff) {
				// store currently visible child's index for navigation purpose
				this.$wordList.dataset.visibleChildIndex = i;
				// update nav position
				this.$navPosition.innerHTML = i + 1;

				// show navigation when scrolling further than first result
				if (i > 0) {
					UTIL.$addClass(this.$resultWrapper, "show-nav-btn");
				} else {
					UTIL.$removeClass(this.$resultWrapper, "show-nav-btn");
				}
				return;
			}
		}
	};

	View.prototype.getWordItem = function (id) {
		return UTIL.qs("#word_" + id, this.$wordList);
	};

	View.prototype.getNextWordItem = function (id) {
		var wordList = this.$wordList;
		var index = wordList.dataset.visibleChildIndex + 1;
		if (index > wordList.childElementCount - 1) { // prevent overflow
			index = wordList.childElementCount - 1;
		}
		return wordList.children[index];
	};

	View.prototype.getPrevWordItem = function (id) {
		var wordList = this.$wordList;
		var index = wordList.dataset.visibleChildIndex - 1;
		if (index < 0) { index = 0; } // prevent overflow
		return wordList.children[index];
	};

	View.prototype.getPredictedWordListHeader = function (id) {
		return this.$predictedWordListHeader;
	};

	View.prototype.getResultPanel = function () {
		return this.$resultPanel;
	};

	// Export to window
	window.app = window.app || {};
	window.app.WordView = View;
}(window));
