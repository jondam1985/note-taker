var express = require("express");
var fs = require("fs");
var path = require("path");
var parser = require("body-parser");

var server = express();
const PORT = 3000;
server.use(parser.json());
server.use(parser.urlencoded({ extended: true }));


server.listen(PORT, function () {
    console.log("Server listening on PORT " + PORT);
})

server.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

server.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

server.use(express.static(__dirname + "/public"));

server.get("/api/notes", function (req, res) {
    var notes = (fs.readFileSync("./db/db.json", function (error) {
        if (error) { throw error };
    }))
    res.send(JSON.parse(notes));
})

server.post("/api/notes", function (req, res) {
    var title = req.body.title;
    var text = req.body.text;
    var id = Math.random();

    var notes = JSON.parse((fs.readFileSync("./db/db.json", function (error) {
        if (error) { throw error };
    })))

    notes.push(
        {
            "title": title,
            "text": text,
            "id": id
        }
    );

    fs.writeFileSync("./db/db.json", JSON.stringify(notes), function (error) {
        if (error) throw error;
    })

    res.send(notes);
})

server.delete("/api/notes/:id", function(req, res) {
    var toBeDeleted = req.params.id;
    console.log(toBeDeleted);

    var notes = JSON.parse((fs.readFileSync("./db/db.json", function (error) {
        if (error) { throw error };
    })))
    console.log(typeof notes);
    console.log(notes[0].id);

    for (var i = 0; i < notes.length; i++) {
        if (notes[i].id == toBeDeleted) {
            notes.splice(i, 1);
        }
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(notes), function (error) {
        if (error) throw error;
    })

    res.send(notes);
    
})
