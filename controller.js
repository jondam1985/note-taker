var express = require("express");
var fs = require("fs");
var path = require("path");

var server = express();
const PORT = 3000;

server.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
})

server.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"))
})

server.use("/static", express.static(__dirname + "Develop/public/assets/css"));
server.use("/static", express.static(__dirname + "Develop/public/assets/js"));

server.get("/api/notes", function(req, res) {
    var notes = (fs.readFile("./Develop/db/db.json", function(error) {
        if (error) { throw error };
    }))
    res.json(notes);
})


server.listen(PORT, function() {
    console.log("Server listening on PORT " + PORT);
  })

function notes() {(fs.readFile("./Develop/db/db.json", function(error, res) {
    var read = JSON.parse(res);
    console.log(read);
    console.log(read[0].title);
}))};

notes();