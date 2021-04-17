var template = require("../lib/template.js");
var express = require("express");
var router = express.Router();

router.get("/", function (request, response) {
  var title = "Welcome";
  var description = "Hello, Node.js";
  var list = template.List(request.list);
  var html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}`,
    `<div id="control_button"><button><a href="/topic/create">create</a></button></div>`
  );
  response.send(html);
});

module.exports = router;
