var cheerio = require("cheerio");
var request = require("request");
var db = require("../models/Article.js");

module.exports = function(app) {

  app.get("/", function(req, res) {

    res.render("index");
  });

  app.post("/scrape", function(req, res) {
    var queryString = "https://www.nytimes.com/section/us?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=U.S.&pgtype=sectionfront"
    request.get(queryString, function(err, res, body) {
      if (err) throw err;
      else {
        var $ = cheerio.load(body);

        $(".latest-panel .story-link").each(function(i, element) {
          var result = {};
          result.link = $(this).attr("href");
          result.title = $(this).children(".story-meta").children("h2").text().trim();
          result.description = $(this).children(".story-meta").children(".summary").text().trim();

          console.log(result);
        });
      }
    });
    res.send("hi!")
  });
}
