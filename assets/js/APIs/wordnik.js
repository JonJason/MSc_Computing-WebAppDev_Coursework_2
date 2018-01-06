/**
 * ticketmaster.com API
 */
var API = (function(parent){


    var apiKey = "724a33ab8bc36327b200b041efb08bfc4f33e79890573443a";

	var api = function(){

		/**
		 * api baseURI
		 */
	    this.baseURL = "http://api.wordnik.com:80/v4";
        this.suffixes = {
            "wordsSearch": "/words.json/search/{{word}}",
            "wordDef": "/word.json/{{word}}/definitions",
            "wordPhrase": "/word.json/{{word}}/phrases",
            "wordAudio": "/word.json/{{word}}/audio",
            "wordExample": "/word.json/{{word}}/examples",
            "randomWord": "/words.json/randomWord",
            "WOTD": "/words.json/wordOfTheDay"
        };
	};

    api.prototype.getSuffix = function (action, params) {
        var suffix = this.suffixes[action];

		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				suffix = suffix.replace("{{" + key + "}}", params[key])
			}
		}
        return suffix;
    };

    api.prototype.searchForWord = function(word, callback) {

        var params = {
            "api_key": apiKey,
            "caseSensitive": true,
            "minCorpusCount": 5,
            "maxCorpusCount": -1,
            "minDictionaryCount": 1,
            "maxDictionaryCount": -1,
            "minLength": 1,
            "maxLength": -1,
            "skip": 0,
            "limit": 1
        };

        var suffix = this.getSuffix("wordsSearch", { word: word });

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                var result = JSON.parse(response).searchResults[0];
                if (result.count < 1) {
                    result = undefined;
                }
                callback && callback(result);
            }
        });
    };

    api.prototype.getWordDefinitions = function (word, callback) {

        var params = {
            "api_key": apiKey,
            "limit": 4,
            "includeRelated": true,
            "sourceDictionaries": "all",
            "useCanonical": false,
            "includeTags": false
        };

        var suffix = this.getSuffix("wordDef", { word: word });

        var mapFunction = this._getMapFunction("definitions");

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                var definitions = JSON.parse(response).map(mapFunction);
                callback && callback(definitions);
            }
        });
    };

    api.prototype.getWordPhrases = function (word, callback) {

        var params = {
            "api_key": apiKey,
            "limit": 10,
            "wlmi": 0,
            "useCanonical": false
        };

        var suffix = this.getSuffix("wordPhrase", { word: word });

        var mapFunction = this._getMapFunction("phrases");

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                var phrases = JSON.parse(response).map(mapFunction);
                callback && callback(phrases);
            }
        });
    };

    api.prototype.getWordAudios = function (word, callback) {

        var params = {
            "api_key": apiKey,
            "limit": 5,
            "useCanonical": false
        };

        var suffix = this.getSuffix("wordAudio", { word: word });
        var mapFunction = this._getMapFunction("audios");

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                var audios = JSON.parse(response).map(mapFunction);
                callback && callback(audios);
            }
        });
    };

    api.prototype.getWordExamples = function (word, callback) {

        var params = {
            "api_key": apiKey,
            "limit": 4,
            "includeDuplicates": false,
            "useCanonical": false,
            "skip": 0
        };

        var suffix = this.getSuffix("wordExample", { word: word });
        var mapFunction = this._getMapFunction("examples");

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                var examples = JSON.parse(response).examples.map(mapFunction);
                callback && callback(examples);
            }
        });
    };

    api.prototype.getRandomWord = function (callback) {
        var params = {
            "api_key": apiKey,
            "hasDictionaryDef": true,
            "minCorpusCount": 0,
            "maxCorpusCount": -1,
            "minDictionaryCount": 1,
            "maxDictionaryCount": -1,
            "minLength": 2,
            "maxLength": -1,
            "limit": 1
        };

        var suffix = this.getSuffix("randomWord");

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                callback && callback(JSON.parse(response));
            }
        });
    };

    api.prototype.getWOTD = function (callback) {
        var self = this;
        var params = {
            "api_key": apiKey
        };

        var suffix = self.getSuffix("WOTD");

        UTIL.sendRequest(UTIL.buildRequestURI(self.baseURL, params, suffix), {
            onLoad: function(response) {
                var responseObj = JSON.parse(response);
                var result = {
                    word: responseObj.word,
                    note: responseObj.note,
                    date: responseObj.publishDate
                };

                result.definitions = responseObj.definitions.map(self._getMapFunction("definitions"));
                result.examples = responseObj.examples.map(self._getMapFunction("examples"));
                callback && callback(result);
            }
        });
    };

    api.prototype._getMapFunction = function (name) {
        var map = {
            definitions: function(value, key, results) {
                return {
                    text: value.text,
                    partOfSpeech: value.partOfSpeech
                };
            },

            phrases: function(value, key, results) {
                return { phrase: value.gram1 + "-" + value.gram2 };
            },

            examples: function(value, key, results) {
                return { text: value.text };
            },

            audios: function (value, key, results) {
                return {
                    url: value.fileUrl,
                    duration: value.duration,
                    type: value.audioType
                };
            }
        };

        return map[name];
    }

    parent.wordnik = new api();

	return parent;
})(API || {});
