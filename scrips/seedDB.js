var mongoose = require("mongoose");
var db = require("../models");

mongoose.connect(process.env.MONGODB_UR || "mongodb://localhost/mongoHeadlines");

var DBseed = {
    title: "Testing Title",
    body: "Testing body"
};

db.Note
    .remove({})
    .then(() => db.Note.collection.insert(DBseed))
    .then(data => {
        console.log(data.result.n + " records inserted");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });