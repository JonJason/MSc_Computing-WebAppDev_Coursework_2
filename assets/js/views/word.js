(function (window) {
	"use strict";

	function View(template) {
		this.ENTER_KEY = 13;

		/* search-panel */
		this.$searchPanel = UTIL.qs(".search-panel");
		// search
		this.$searchbarWrapper = UTIL.qs(".searchbar-wrapper", this.$searchPanel);
		this.$searchbar = UTIL.qs(".searchbar", this.$searchbarWrapper);
		this.$searchButton = UTIL.qs(".search-btn", this.$searchbarWrapper);

		// image uploader
		this.$imageUploader = UTIL.qs(".img-uploader", this.$searchPanel);

		/* result-panel */
		this.$resultPanel = UTIL.qs(".result-panel");
		this.$predictionPanel = UTIL.qs(".prediction-panel", this.$resultPanel);
		this.$thumb = UTIL.qs(".thumbnail", this.$predictionPanel);
		this.$preloader = UTIL.qs(".preloader-overlay", this.$predictionPanel);
		this.$predictedWordList = UTIL.qs(".predicted-word-list", this.$predictionPanel);
		this.$resultWrapper = UTIL.qs(".result-wrapper", this.$resultPanel);
		this.$wordList = UTIL.qs(".word-list", this.$resultWrapper);
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
				handler(currentTarget.dataset.word);
			});
		};
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
				self._hideSearchPanel();
				self._showResultPanel();
			},

			showSearchPanel: function() {
				self._showSearchPanel();
				self._hideResultPanel();
			},

			showPredictionPanel: function () {
				self._showPredictionPanel();
				self._showThumbPreloader("Loading");
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

	View.prototype._showSearchPanel = function() {
		UTIL.$removeClass(this.$searchPanel, "hidden");
	};

	View.prototype._hideSearchPanel = function() {
		UTIL.$addClass(this.$searchPanel, "hidden");
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
		var wordItem = UTIL.createElement(UTIL.parseTemplate("word_item", data));
		this.$wordList.appendChild(wordItem);
	};

	View.prototype._updateWordItem = function(id, key, value) {
		var wordItem = UTIL.qs("#word_" + id, this.$wordList);
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

	// Export to window
	window.app = window.app || {};
	window.app.WordView = View;
}(window));
