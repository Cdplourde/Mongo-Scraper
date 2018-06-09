var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
require("dotenv").config();

var app = express();
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.set("port", (process.env.PORT || 3000));

app.use("/public", express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

require("./controllers/routes")(app);

app.listen(app.get("port"), function() {
  console.log("App listening on PORT " + app.get("port"));
});