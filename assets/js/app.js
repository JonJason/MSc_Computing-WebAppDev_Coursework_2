(function () {
    "use strict";
    var pages = {
        /**
        * Home page class.
        */
        Home: function () {
            this.view = new app.HomeView();
            this.controller = new app.HomeController(this.view);
        },

        /**
        * Word page class.
        */
        Word: function () {
            this.view = new app.WordView();
            this.controller = new app.WordController(this.view);
        },

        /**
        * About page class.
        */
        About: function () {
            this.view = new app.AboutView();
            this.controller = new app.AboutController(this.view);
        },
    }

    /**
    * Layout Class
    */
    var Layout = function() {
        this.view = new app.LayoutView();
        this.controller = new app.LayoutController(this.view);
    }

    // set up Layout
    function setupLayout (name) {
        app.layout = new Layout();
        app.layout.controller.setView(name);
    };

    // set up page
    function setupPage(name) {
        app.pages = app.pages || {};
        app.pages[name] = new pages[UTIL.capitalise(name)]();
    };

    // application setup
    function setupApp() {
        var pageName = document.body.dataset.page; // get page name which is set on each page pug file
        setupLayout(pageName);
        setupPage(pageName);
    };

    UTIL.$on(window, 'load', setupApp);
})();
