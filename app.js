var compression = require("compression");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
var topicRouter = require("./routes/topic");
var db = require("./password");
var url = require("url");

app.use("*", function (request, response, next) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  request.queryData = queryData.id;
  next();
});

app.post("*", function (request, response, next) {
  db.query("ALTER TABLE topic AUTO_INCREMENT=1", function (err1, result1) {
    db.query("SET @COUNT = 0;", function (err2, result2) {
      db.query(
        "UPDATE topic SET id = @COUNT:=@COUNT+1;",
        function (err3, result3) {
          next();
        }
      );
    });
  });
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(compression());

app.get("*", function (request, response, next) {
  db.query("SELECT * FROM topic", function (err, topics) {
    request.list = topics;
    next();
  });
});

app.use("/", indexRouter);

app.use("/topic", topicRouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry cant find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(5000, function () {
  console.log("Server running at http://localhost:3000/");
});
