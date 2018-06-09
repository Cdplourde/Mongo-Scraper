var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/MongoDBScraper");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

var SavedArticle = mongoose.model("SavedArticle", ArticleSchema);

module.exports = SavedArticle;