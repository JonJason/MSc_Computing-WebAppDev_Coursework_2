(function (window) {
	'use strict';

	function Controller(view) {
		var self = this;
		self.view = view;

		self.collections = {
			word: new app.WordCollection()
		};

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

		self.view.bind("predictionWordPicked", function (word) {
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

		API.wordnik.searchForWord(searchText, function(results) {
			self.addResults(results);
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
				self.view.render("showResultPanel");
				self.view.render("showPredictionResult", {
					words: predictions.map(x => x.name)
				});
			});
		});
	};

	Controller.prototype.addResults = function(results) {
		this.view.render("showResultPanel");
		if (results.length > 0) {
			for (var result of results) {
					this.addResult(result.word);
			}
		}
	};

	Controller.prototype.addResult = function (word) {
		var model = new app.WordModel({ word: word });
		this.collections.word.add(model);
		this.view.render("addWord", {
			id: model.get("id"),
			word: model.get("word")
		});
		this._fetchWordData(model);
	};

	Controller.prototype._fetchWordData = function(model) {
		var self = this;
		var word = model.get("word");
		var callback = function(name, value) {
			var data = {};
			data[name] = value;
			model.set(data);
			self.view.render("updateWord", {
				id: model.get("id"),
				key: "name",
				value: model.get("name")
			});
		};

		API.wordnik.getWordDefinitions(word, function(definitions) {
			// callback("definitions", definitions);
			model.set({ definitions: definitions });
			self.view.render("updateWord", {
				id: model.get("id"),
				key: "definitions",
				value: model.get("definitions")
			});
		});

		API.wordnik.getWordPhrases(word, function(phrases) {
			model.set({ phrases: phrases });
			self.view.render("updateWord", {
				id: model.get("id"),
				key: "phrases",
				value: model.get("phrases")
			});
		});

		API.wordnik.getWordAudios(word, function(audios) {
			model.set({ audios: audios });
			self.view.render("updateWord", {
				id: model.get("id"),
				key: "audios",
				value: model.get("audios")
			});
		});

		API.wordnik.getWordExamples(word, function(examples) {
			model.set({ examples: examples });
			self.view.render("updateWord", {
				id: model.get("id"),
				key: "examples",
				value: model.get("examples")
			});
		});
	};

	// Export to window
	window.app = window.app || {};
	window.app.WordController = Controller;
})(window);
