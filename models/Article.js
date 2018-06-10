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
  },
  saved: {
    type: Boolean,
    default: false,
    required: true
  },
  note: {
    type: Array,
    default: []
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;