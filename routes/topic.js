var template = require("../lib/template.js");
var db = require("../password.js");
var express = require("express");
var router = express.Router();

router.get("/create", function (request, response) {
  var title = "CREATE";
  var list = template.List(request.list);
  var html = template.HTML(
    title,
    list,
    `
      <h2>${title}</h2>
      <div id="comment_box_line">
          <form action="/topic/create_process" method="post">
              <input type="text" placeholder="title....." name="title" id="comment_input_box">
              <p><textarea placeholder="description....." name="description" id="comment_textarea" cols="30" rows="10"></textarea></p>
              <p><input type="text" placeholder="author" name="name"></p>
              <p><textarea type="text" placeholder="profile....." name="profile"></textarea></p>
              <input type="submit" value="create">
          </form>
      </div>
      `,
    ""
  );
  response.send(html);
});

router.post("/create_process", function (request, response) {
  var title = request.body.title;
  var description = request.body.description;
  var name = request.body.name;
  var profile = request.body.profile;
  db.query(
    "INSERT INTO author(name, profile) VALUES (?, ?)",
    [name, profile],
    function (err1, result1) {
      db.query(
        "INSERT INTO topic(title, description, created, author_id) VALUES (?, ?, NOW(), ?)",
        [title, description, result1.insertId],
        function (err2, result2) {
          response.redirect(`/topic/${title}?id=${result2.insertId}`);
        }
      );
    }
  );
});

router.get("/update/:pageId", function (request, response) {
  db.query(
    "SELECT * FROM author LEFT JOIN topic ON topic.author_id = author.id WHERE topic.id = ?",
    [request.queryData],
    function (err, result) {
      var id = result[0].id;
      var title = result[0].title;
      var description = result[0].description;
      var name = result[0].name;
      var profile = result[0].profile;
      var list = template.List(request.list);
      var html = template.HTML(
        title,
        list,
        `
                    <h2>UPDATE</h2>
                    <div id="comment_box_line">
                        <form action="/topic/update_process" method="post">
                            <input type="hidden" name="id" value="${id}">
                            <input type="text" placeholder="title....." name="title" id="comment_input_box" value="${title}">
                            <p><textarea placeholder="description....." name="description" id="comment_textarea" cols="30" rows="10">${description}</textarea></p>
                            <p><input type="text" placeholder="author" name="name" value="${name}"></p>
                            <p><textarea type="text" placeholder="profile....." name="profile">${profile}</textarea></p>
                            <input type="submit" value="update">
                        </form>
                    </div>
                    `,
        `<div id="control_button">
                      <button><a href="/topic/create">create</a></button>
                      <button><a href="/topic/update/${title}?id=${id}">update</a></button>
                     </div>`
      );
      response.send(html);
    }
  );
});

router.post("/update_process", function (request, response) {
  var id = request.body.id;
  var title = request.body.title;
  var description = request.body.description;
  var name = request.body.name;
  var profile = request.body.profile;
  db.query(
    "SELECT * FROM topic WHERE topic.id = ?",
    [id],
    function (err1, result1) {
      db.query(
        "UPDATE topic SET title = ?, description = ? WHERE topic.id = ?",
        [title, description, id],
        function (err2, result2) {
          db.query(
            "UPDATE author SET name = ?, profile = ? WHERE author.id = ?",
            [name, profile, result1[0].author_id],
            function (err3, result3) {
              response.redirect(`/topic/${title}?id=${id}`);
            }
          );
        }
      );
    }
  );
});

router.post("/delete_process", function (request, response) {
  var id = request.body.id;
  db.query(
    "SELECT * FROM topic WHERE topic.id =?",
    [id],
    function (err1, result1) {
      db.query(
        "DELETE FROM author WHERE author.id = ?",
        [result1[0].author_id],
        function (err3, result3) {
          db.query(
            "DELETE FROM topic WHERE topic.id = ?",
            [id],
            function (err2, result2) {
              response.redirect("/");
            }
          );
        }
      );
    }
  );
});

router.get("/:pageId", function (request, response, next) {
  db.query(
    "SELECT * FROM author LEFT JOIN topic ON topic.author_id = author.id WHERE topic.id = ?",
    [request.queryData],
    function (err, topic) {
      if (err) {
        next(err);
      } else {
        var title = topic[0].title;
        var description = topic[0].description;
        var list = template.List(request.list);
        var html = template.HTML(
          title,
          list,
          `<h2>${title}</h2><p>${description}</p>
          <p>By ${topic[0].name}</p>
          <p>profile: ${topic[0].profile}</p>`,
          `
            <div id="control_button">
            <button><a href="/topic/create">create</a></button>
            <button><a href="/topic/update/${title}?id=${topic[0].id}">update</a></button>
            <form action="/topic/delete_process" method="post" style="margin: 10px">
              <input type="hidden" name="id" value="${topic[0].id}">
              <input type="submit" value="delete">
            </form>
            </div>
            `
        );
        response.send(html);
      }
    }
  );
});

module.exports = router;
