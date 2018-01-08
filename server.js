const express = require("express");

var server = express();

server.listen(3000);

server.use("/assets", express.static(__dirname + "/assets"));
server.use("/node_modules", express.static(__dirname + "/node_modules"));

server.set("views", "views");
server.set("view engine", "pug");

server.get("/", function(request, response) {
    response.render("home", {
        page: "home",
        desc: "Learn English Fun!"
    });
});

server.get("/word", function(request, response) {
    response.render("word", {
        page: "word",
        desc: "English word definition and music with it in the lyrics"
    });
});

server.get("/help", function(request, response) {
    response.render("help", {
        page: "help",
        desc: "How to Use English Crawler Application"
    });
});

server.get("/about", function(request, response) {
    response.render("about", {
        page: "about",
        desc: "All about us and how to contact us"
    });
});
