/*jshint eqeqeq:false */
(function (window) {
	'use strict';

	function DBStorage(name) {
		this._name = name;
        var DB = this._getDB();
		if (!DB) {
			var data = {
				WOTDs: []
			};

            this._saveDB(data)
		}
	}

    DBStorage.prototype._getDB = function () {
        return JSON.parse(localStorage.getItem(this._name));
    };

    DBStorage.prototype._saveDB = function (data) {
        localStorage.setItem(this._name, JSON.stringify(data));
    };

    DBStorage.prototype.getAllWOTD = function (WOTD) {
        return this._getDB().WOTDs;
    };

    DBStorage.prototype.getWOTDByDate = function (date) {
        return this.getAllWOTD().find(function(WOTD) {
            return UTIL.compareDate(new Date(WOTD.date), date);
        });
    };

    DBStorage.prototype.saveWOTD = function (data) {
        delete data.id;
        var DB = this._getDB();
        var date = new Date(data.date);
        if (this.getWOTDByDate(date)) {
            var WOTDs = DB.WOTDs;
            var index = DB.WOTDs.findIndex(function (WOTD) {
                return UTIL.compareDate(new Date(WOTD.date), date);
            });
            DB.WOTDs[index] = data;
        } else {
            DB.WOTDs.push(data);
        }

        this._saveDB(DB);
    };

    DBStorage.prototype.getTodayWOTD = function () {
        return this.getWOTDByDate(new Date());
    };

	// Export to window
	window.app = window.app || {};
	window.app.DB = new DBStorage("event-crawler.com");
})(window);
