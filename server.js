// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database Configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook Mongojs configuration to the database variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});

// Main Route
app.get ("/", function(req, res) {
    
});

// Retrieve data from the database
app.get("/all", function(req, res) {
    db.scrapedData.find({}, function(error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

// Scrape data from website and place in mongodb
app.get("/scrape", function(req, res) {
    axios.get("https://www.nbc12.com/news/").then(function(response) {
        var $ = cheerio.load(response.data);
    $("").each(function(i, element) {
        var title = $(element).children("a").text();
        var link = $(element).children("a").attr("href");
    })
    })
})