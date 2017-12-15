const express = require("express");

var server = express();

server.listen(3000);

server.use(express.static("assets"));

server.set("views", "views");
server.set("view engine", "pug");

server.get("/", function(request, response) {
    response.render("home", {
        desc: 'Find events by text or image'
    })
});
