
// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();

// Require db models
var db = require("../models");

// get route -> index
router.get("/", function(req, res) {
  // send us to the articles.
  res.redirect("/posts");
});

// get route, retrieves all article records from db
router.get("/posts", function(req, res) {

  db.Post.find({}).sort({"published":-1})
    .then(function(dbPost) {
      var posts = {
        posts: dbPost
      };
      return res.render("index", posts);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.get("/scrape", function(req, res) {

  var newPosts = 0;

  // First, we grab the body of the html with request
  request("https://www.reddit.com/r/metalcore", function(error, response, html) {

    if (error) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    }

    // use cheerio
    var $ = cheerio.load(html);

                $(".thing").each(function (i, element) {
                    var result = {};

                    result.title = $(this)
                        .children(".entry")
                        .children(".top-matter")
                        .children(".title")
                        .children(".title")
                        .text();
                    result.link = $(this)
                        .children(".entry")
                        .children(".top-matter")
                        .children(".title")
                        .children(".title")
                        .attr("href");
                    result.thumbnail = $(this)
                        .children(".thumbnail")
                        .children("img")
                        .attr("src");
                    db.Post.create(result)
                        .then(function (dbArticle) {
                        })
                        .catch(function (err) {
                        });

      var query = {'link':result.link};
      
      db.Post.findOneAndUpdate(query, result, {upsert:true, setDefaultsOnInsert:true, new:false})
        .then(function(dbArticle) {
          
          if (dbPost == null) {
            newPosts++;
          }

          // View the added result in the console
          console.log(dbPost);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
  });
  res.send("scrape successful");
});

// Route for grabbing a specific Article by id, populate it with its comments
router.get("/posts/:id", function(req, res) {
  
  db.Post.findOne({ _id: req.params.id })
    // populate all of the comments associated with article
    .populate("comments")
    .then(function(dbPost) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbPost);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.post("/posts/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Comment was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Comment
      return db.Post.findOneAndUpdate({ _id: req.params.id }, {$push: { comments: dbComment._id }}, { new: true });
    })
    .then(function(dbPost) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbPost);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.delete("/comments/:id", function(req, res) {
  // Delete Comment by id value provided
  db.Comment.remove({ _id: req.params.id })
    .then(function(dbComment) {
      res.json(dbComment);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;