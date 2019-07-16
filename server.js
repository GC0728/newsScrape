// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exhbs = require("express-handlebars");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
// Make a public static folder
app.use(express.static("public"));

// Connect MongoDB to Mongoose
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Database Configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook Mongojs configuration to the database variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//     console.log("Database Error:", error);
// });

// Scrape data from website and place in mongodb
app.get("/scrape", function(req, res) {
    axios.get("https://www.reddit.com/r/news/").then(function(response) {
        var $ = cheerio.load(response.data);
        $("article").each(function(i, element) {
        var result = {};

        result.headline = $(this)
        .find("h3")
        .text(),
        console.log(result.headline);
            

        result.url = $(this)
        .find(".BiNC74axuTz66dlnEgicY")
        .children("a")
        .attr("href");
        console.log(result.url)

        db.Article.create(result)
            .then(function(dbArticle) {
                // console.log(dbArticle);
            })
            .catch(function(err) {
                // console.log(err);
            });
        });
        res.send("Scrape Complete");


    });
});

// Main Route
app.get("/", function(req, res) {

});

// Retrieve data from the database
app.get("/all", function(req, res) {
    db.scrapedData.find({}, function(error, found) {
        if (error) {
            // console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

app.get("/articles", function(req, res) {
    res.json
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id}, {note: dbNote._id }, {new: true});
    })
    .catch(function(err) {
        res.json(err);
    })
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});