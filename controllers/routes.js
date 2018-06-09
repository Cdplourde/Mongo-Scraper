var cheerio = require("cheerio");
var request = require("request");
var db = require("../models/");

module.exports = function(app) {

  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/scrape", function(req, res) {
    // get all current titles in database
    dbTitles = []
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
        $(".latest-panel .story-link").each(function(i, element) {
          // store scrape results into object
          var result = {};
          result.link = $(this).attr("href");
          result.title = $(this).children(".story-meta").children("h2").text().trim();
          result.description = $(this).children(".story-meta").children(".summary").text().trim();  
          // only store new articles
          if (!dbTitles.includes(result.title)) {
            db.Article.create(result)
            .then(function(articleResult) {
              console.log(articleResult);
            })
            .catch(function(err) {
              return res.json(err);
            })       
          }
          else {
            console.log("already in db!");
          }
        });  
          res.end();    
      }
    });
  });

}