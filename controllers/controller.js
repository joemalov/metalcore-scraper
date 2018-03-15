
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();


var db = require("../models");


router.get("/", function(req, res) {

  res.redirect("/posts");
});

router.get("/posts", function(req, res) {

  db.Post.find({}).sort({"published":-1})
    .then(function(dbPost) {
      var posts = {
        posts: dbPost
      };
      return res.render("index", posts);
    })
    .catch(function(err) {

      res.json(err);
    });
});

router.get("/scrape", function(req, res) {

  var newPosts = 0;

  request("https://www.reddit.com/r/metalcore", function(error, response, html) {

    if (error) {
      console.log('error:', error); 
      console.log('statusCode:', response && response.statusCode); 
    }

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

          console.log(dbPost);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
  });
  res.send("scrape successful");
});

router.get("/posts/:id", function(req, res) {
  
  db.Post.findOne({ _id: req.params.id })

    .populate("comments")
    .then(function(dbPost) {

      res.json(dbPost);
    })
    .catch(function(err) {

      res.json(err);
    });
});

router.post("/posts/:id", function(req, res) {

  db.Comment.create(req.body)
    .then(function(dbComment) {

      return db.Post.findOneAndUpdate({ _id: req.params.id }, {$push: { comments: dbComment._id }}, { new: true });
    })
    .then(function(dbPost) {

      res.json(dbPost);
    })
    .catch(function(err) {

      res.json(err);
    });
});

router.delete("/comments/:id", function(req, res) {

  db.Comment.remove({ _id: req.params.id })
    .then(function(dbComment) {
      res.json(dbComment);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;