var cheerio = require("cheerio");
var request = require("request");
var db = require("../models/");

module.exports = function(app) {

  app.get("/", function(req, res) {
    var hbsObject = {}
    db.Article.find({})
    .then(function(results) {
      hbsObject.articles = results;
      res.render("index", hbsObject);
    })
  });

  app.get("/saved", function(req, res) {
    var hbsObject = {}
    db.Article.find({"saved": true})
    .then(function(results) {
      hbsObject.articles = results;
      res.render("saved", hbsObject);
    });
  });

  app.get("/notes/:id?", function(req, res) {
    var hbsObject = {}
    db.Article.find({_id: req.params.id})
    .then(function(results) {
      hbsObject.note = results[0].note;
      hbsObject.id = results[0].id
      // console.log(hbsObject)
      res.send(hbsObject);
    });
  })

  app.delete("/notes/delete", function(req, res) {
    console.log(req.body);
    db.Article.update({_id: req.body.id}, {$pull:{note: req.body.note}})
    .then(function(results) {
      res.end();
    })
    .catch(function(err) {
      res.json(err);
    })
  })

  app.put("/notes/add", function(req, res) {
    console.log(req.body);
    db.Article.update({_id: req.body.id}, {$push: {note: req.body.note}})
    .then(function(results) {
      res.json({"note": req.body.note, "id": req.body.id})
    })
    .catch(function(err) {
      res.json(err);
    })
  })

  app.put("/saved", function(req, res) {
    console.log(req.body);
    db.Article.update({_id: req.body.id}, {$set: {saved: true}})
    .then(function() {
      res.end();
    })
    .catch(function(err) {
      res.json(err)
    });
  });

  app.put("/unsave", function(req, res) {
    db.Article.update({_id: req.body.id}, {$set: {saved: false}})
    .then(function() {
      res.end();
    })
    .catch(function(err) {
      res.json(err)
    });
  })

  app.post("/scrape", function(req, res) {
    // get all current titles in database
    var dbTitles = []
    db.Article.find({})
    .then(function(arts) {
      arts.forEach(art => dbTitles.push(art.title.toString()));         
    })
    .catch(function(err) {
      return res.json(err);
    });
    // scrape for current articles
    var queryString = "https://www.nytimes.com/section/us?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=U.S.&pgtype=sectionfront"
    request.get(queryString, function(err, response, body) {
      if (err) throw err;
      else {
        var $ = cheerio.load(body);
        var results = []
        $(".latest-panel .story-link").each(function(i, element) {
          // store scrape results into object
          var result = {};
          result.link = $(this).attr("href");
          result.title = $(this).children(".story-meta").children("h2").text().trim();
          result.description = $(this).children(".story-meta").children(".summary").text().trim();  
          // only store new articles
          if (!dbTitles.includes(result.title)) {
            results.push(result);
          }
        });
        if (results.length > 0) {
          db.Article.create(results)
          .then(function() {
            res.send(`${results.length}`);
          })
          .catch(function(err) {
            res.json(err);
          })
        }
        else {
          res.send(`${results.length}`);
        }  
      }
    })
  });

}