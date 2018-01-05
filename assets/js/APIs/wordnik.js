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
            "randomWord": "/words.json/randomWord"
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
        callback([{ count: 933917, lexicality: 0, word: "eye" }]);
        return;

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
            "limit": 10
        };

        var suffix = this.getSuffix("wordsSearch", { word: word });

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                callback && callback(JSON.parse(response).searchResults);
            }
        });
    };

    api.prototype.getWordDefinitions = function (word, callback) {
        var results = [
            {"textProns":[],"sourceDictionary":"ahd-legacy","exampleUses":[],"relatedWords":[],"labels":[],"citations":[],"word":"eye","partOfSpeech":"noun","attributionText":"from The American Heritage® Dictionary of the English Language, 4th Edition","sequence":"0","text":"An organ of vision or of light sensitivity.","score":0},
            {"textProns":[],"sourceDictionary":"ahd-legacy","exampleUses":[],"relatedWords":[],"labels":[],"citations":[],"word":"eye","partOfSpeech":"noun","attributionText":"from The American Heritage® Dictionary of the English Language, 4th Edition","sequence":"1","text":"Either of a pair of hollow structures located in bony sockets of the skull, functioning together or independently, each having a lens capable of focusing incident light on an internal photosensitive retina from which nerve impulses are sent to the brain; the vertebrate organ of vision.","score":0},
            {"textProns":[],"sourceDictionary":"ahd-legacy","exampleUses":[],"relatedWords":[],"labels":[],"citations":[],"word":"eye","partOfSpeech":"noun","attributionText":"from The American Heritage® Dictionary of the English Language, 4th Edition","sequence":"2","text":"The external, visible portion of this organ together with its associated structures, especially the eyelids, eyelashes, and eyebrows.","score":0},
            {"textProns":[],"sourceDictionary":"ahd-legacy","exampleUses":[],"relatedWords":[],"labels":[],"citations":[],"word":"eye","partOfSpeech":"noun","attributionText":"from The American Heritage® Dictionary of the English Language, 4th Edition","sequence":"3","text":"The pigmented iris of this organ.","score":0}];
        var definitions = results.map(function(value, key, results) {
            return {
                text: value.text,
                partOfSpeech: value.partOfSpeech
            };
        });
        callback(results);
        return;

        var params = {
            "api_key": apiKey,
            "limit": 4,
            "includeRelated": true,
            "sourceDictionaries": "all",
            "useCanonical": false,
            "includeTags": false
        };

        var suffix = this.getSuffix("wordDef", { word: word });

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                var definitions = JSON.parse(response).map(function(value, key, results) {
                    return {
                        text: value.text,
                        partOfSpeech: value.partOfSpeech
                    };
                });
                callback && callback(definitions);
            }
        });
    };

    api.prototype.getWordPhrases = function (word, callback) {
        var results = [{"mi":13.22341297113564,"gram1":"bull's","gram2":"eye","wlmi":18.778001822813277},{"mi":11.060406598236716,"gram1":"blind","gram2":"eye","wlmi":18.355027347128342},{"mi":6.509616708765959,"gram1":"an","gram2":"eye","wlmi":17.441831460734342},{"mi":12.860168104535221,"gram1":"mind's","gram2":"eye","wlmi":17.108095617978805},{"mi":7.500977734339212,"gram1":"close","gram2":"eye","wlmi":15.972652948731257},{"mi":7.234169844942205,"gram1":"public","gram2":"eye","wlmi":15.867165042085164},{"mi":8.413859246274015,"gram1":"eye","gram2":"contact","wlmi":15.563606365778696},{"mi":13.312680309232727,"gram1":"eye-to","gram2":"eye","wlmi":15.312680309232727},{"mi":9.342463778255377,"gram1":"naked","gram2":"eye","wlmi":15.04290349639647},{"mi":11.528409000288162,"gram1":"well-defined","gram2":"eye","wlmi":14.698334001730474}];
        var phrases = results.map(function(value, key, results) {
            return { phrase: value.gram1 + "-" + value.gram2 };
        });
        callback(phrases);
        return;

        var params = {
            "api_key": apiKey,
            "limit": 10,
            "wlmi": 0,
            "useCanonical": false
        };

        var suffix = this.getSuffix("wordPhrase", { word: word });

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                var phrases = JSON.parse(response).map(function(value, key, results) {
                    return { phrase: value.gram1 + "-" + value.gram2 };
                });
                callback && callback(phrases);
            }
        });
    };

    api.prototype.getWordAudios = function (word, callback) {
        var results = [{"commentCount":0,"createdBy":"ahd","createdAt":"2009-03-15T15:32:15.000+0000","id":21188,"word":"eye","duration":0.83,"attributionText":"from The American Heritage® Dictionary of the English Language, 4th Edition","audioType":"pronunciation","fileUrl":"http://api.wordnik.com/v4/audioFile.mp3/aa462d3b79321ab450d63adca0716483a5977bab6a2e40b906efa6e778587281"},{"commentCount":0,"description":"see more at http://www.macmillandictionary.com/dictionary/american/eye","createdBy":"macmillan","createdAt":"2011-04-10T06:32:25.357+0000","id":217092,"word":"eye","duration":0.99,"attributionText":"definition of eye from Macmillan Dictionary -- free online dictionary and thesaurus","attributionUrl":"http://www.macmillandictionary.com/dictionary/american/eye","audioType":"pronunciation","fileUrl":"http://api.wordnik.com/v4/audioFile.mp3/35eb1a8cd0d2921d77ef65cf42e636b6abd41c9982f7878b42e8fac741bb2fc3"},{"commentCount":0,"description":"see more at http://www.macmillandictionary.com/dictionary/american/eye_25","createdBy":"macmillan","createdAt":"2011-04-10T06:32:25.640+0000","id":217093,"word":"eye","duration":1.01,"attributionText":"definition of eye from Macmillan Dictionary -- free online dictionary and thesaurus","attributionUrl":"http://www.macmillandictionary.com/dictionary/american/eye","audioType":"pronunciation","fileUrl":"http://api.wordnik.com/v4/audioFile.mp3/bab2e6c7e64ab1744befe213fe9debe01b3782f3c54ff99b901ba5d97f3103bf"}];
        var audios = results.map(function (value, key, results) {
            return {
                url: value.fileUrl,
                duration: value.duration,
                type: value.audioType
            };
        });
        callback(audios);
        return;

        var params = {
            "api_key": apiKey,
            "limit": 5,
            "useCanonical": false
        };

        var suffix = this.getSuffix("wordAudio", { word: word });

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                var audios = JSON.parse(response).map(function (value, key, results) {
                    return {
                        url: value.fileUrl,
                        duration: value.duration,
                        type: value.audioType
                    };
                });
                callback && callback(audios);
            }
        });
    };

    api.prototype.getWordExamples = function (word, callback) {
        var results = [{"provider":{"name":"wordnik","id":711},"rating":9079.42,"url":"http://www.gutenberg.org/dirs/1/6/3/2/16328/16328-8.txt","word":"eye","text":"If 'and-éges' be accepted, the sentence will read: _No hero ... dared look upon her, eye to eye_.","documentId":18090698,"exampleId":1171618747,"title":"Beowulf An Anglo-Saxon Epic Poem"},{"provider":{"name":"wordnik","id":711},"rating":9079.42,"url":"http://www.gutenberg.org/dirs/2/3/5/3/23530/23530-8.txt","word":"eye","text":"I looked round, and the baboon caught my eye, which told him plainly that he'd soon catch what was not at all _my eye_; and he proved that he actually thought so, for he at once put the bread-and-butter back into the boy's hands!","documentId":18082057,"exampleId":1095625729,"title":"Adventures in Many Lands"},{"provider":{"name":"wordnik","id":711},"rating":9079.42,"url":"http://www.gutenberg.org/dirs/1/3/8/2/13822/13822-8.txt","word":"eye","text":"\"If a man sell a horse which is lame, no action lyes for that, but _caveat emptor_; and when I sell a horse that has _no_ eye, there no action lies; otherwise where he has a counterfeit, false, and _bright eye_.\"","documentId":18091809,"exampleId":1177088997,"title":"Notes and Queries, Number 26, April 27, 1850"}];
        var examples = results.map(function(value, key, results) {
            return { text: value.text };
        });
        callback(examples);
        return;

        var params = {
            "api_key": apiKey,
            "limit": 4,
            "includeDuplicates": false,
            "useCanonical": false,
            "skip": 0
        };

        var suffix = this.getSuffix("wordExample", { word: word });

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                var examples = JSON.parse(response).examples.map(function(value, key, results) {
                    return { text: value.text };
                });
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
            "maxLength": -1
        };

        var suffix = this.getSuffix("randomWord", { word: word });

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                callback && callback(JSON.parse(response));
            }
        });
    };


    parent.wordnik = new api();

	return parent;
})(API || {});
