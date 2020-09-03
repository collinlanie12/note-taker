var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

var notes = [];
var counter = 0;

fs.readFile(__dirname + "/db.json", "utf8", function (err, data) {
    if (err) throw err;
    notes.push(data);
});

app.post("/api/notes", function (req, res) {
    counter++;
    var newNote = req.body;
    notes = JSON.parse(notes);
    req.body.id = counter;
    notes.push(newNote);
    notes = JSON.stringify(notes);
    fs.writeFile(__dirname + "/db.json", notes, "utf8", function (err) {
        if (err) throw err;
    });
    res.json(JSON.parse(notes));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/", "index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/", "notes.html"));
});

app.get("/api/notes", function (req, res) {
    return res.json(JSON.parse(notes));
});

app.delete("/api/notes/:id", function (req, res) {
    var chosen = req.params.id;
    notes = JSON.parse(notes);
    notes.splice(chosen, 1);
    notes = JSON.stringify(notes);
    fs.writeFile(__dirname + "/db.json", notes, "utf8", function (err) {
        if (err) throw err;
    });
    res.json(JSON.parse(notes));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("Server listening on PORT: " + PORT);
});
