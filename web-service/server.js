var port = 8080;

// load modules
var express = require("express");
var path = require("path");
var sqlite = require("sqlite3");
var bodyParser = require("body-parser");

// create new express app
var app = express();

// serve static files from the /static subdirectory
app.use(express.static(path.join(__dirname, "/static")));
// parse request body as json
app.use(bodyParser.json());

app.get("/api/tasks", function (req, res, next) {
    var query = "SELECT rowid, title, done, createdOn FROM tasks WHERE done != 1";
    db.all(query, function (error, rows) {
        if (error) {
            return next(error); // reports error to client while keeping server running
        }
        // send rows back to client as JSON
        res.json(rows);
    });
});

app.post("/api/tasks", function (req, res, next) {
    var newTask = {
        title: req.body.title,
        done: false,
        createdOn: new Date()
    };

    var query = "INSERT INTO tasks(title, done, createdOn) values(?,?,?)";
    db.run(query, [newTask.title, newTask.done, newTask.createdOn], function (error) {
        if (error) {
            return next(error);
        }
        res.status(201).json(newTask);
    });
});

app.put("/api/tasks/:rowid", function (req, res, next) {
    var query = "UPDATE tasks SET done=? WHERE rowid=?";
    db.run(query, [req.body.done, req.params.rowid], function (error) {
        if (error) {
            return next(error);
        }
        res.json(req.body);
    });
});

var db = new sqlite.Database(path.join(__dirname, "/data/tasks.db"), function (error) {
    if (error) {
        throw error;
    }

    var query = "CREATE TABLE IF NOT EXISTS tasks(title string, done int, createdOn datetime)";
    db.run(query, function (error) {
        if (error) {
            throw error;
        }
    });

    // start the server
    app.listen(port, function () {
        console.log("server is listening on http://localhost:" + port);
    });
});