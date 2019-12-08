var express = require("express");
var fs = require("fs");
var path = require("path");
var parser = require("body-parser");

var server = express();
const PORT = process.env.PORT || 3000;//sets up dynamic port
server.use(parser.json()); //used to parse request content
server.use(parser.urlencoded({ extended: true })); //used to parse encoded requests in url

//Starts the server
server.listen(PORT, function () {
    console.log("Server listening on PORT " + PORT);
})
//Serves users with index.html when they navigate to homepage
server.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})
//Server user with notes.html when they navigate to notes page
server.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})
//Sets up public folder to fetch static files such as js or css
server.use(express.static(__dirname + "/public"));
//Responds with a json object when users make a get request (this renders in the page all existing notes)
server.get("/api/notes", function (req, res) {
    var notes = (fs.readFileSync("./db/db.json", function (error) {
        if (error) { throw error };
    }))
    res.send(JSON.parse(notes));
})
//Adds a new note to the db.json file and renders it in the page along all existing notes
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
//Deletes a specific note from the db.json using and id value and renders in the page the remaining notes
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
