module.exports = {
  //본문을 표시해주는 함수
  HTML: function (_title, _list, _body, _writecomment) {
    return ` 
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${_title}</title>
        <meta charset="utf-8">
        <script src="/JS/colors.js"></script>
        <link rel="stylesheet" href="/CSS/style.css">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        <div id="grid">
            ${_list}
                <div id="article">
                    ${_body}
                </div>
        </div>

        ${_writecomment}

        <div id="box">
            <div id="button"> 
                <input style="font-size: 25px;" type="button" value="night" onclick="night_day_control(this)">
            </div>
        </div>

        </body>
        </html>
        `;
  },
  //본문에 목록들을 표시해주는 함수
  List: function (_filelist) {
    var list = "<ol>";
    var i = 0;
    while (i < _filelist.length) {
      list =
        list +
        `<li><a href="/topic/${_filelist[i].title}?id=${_filelist[i].id}">${_filelist[i].title}</a></li>`;
      i++;
    }
    list = list + "</ol>";
    return list;
  },
};
