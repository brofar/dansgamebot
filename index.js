var express = require('express');
var ejs = require('ejs');
const bodyParser = require('body-parser');
const db = require('./db');

var app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Display Table
app.get('/', function(req, res) {
  const sql = `SELECT game, count(game) AS votes FROM Votes GROUP BY game ORDER BY count(game) DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("index", { model: rows });
  });
})

// Add Value
app.get("/add/:user/:game", (req, res) => {
  const game = req.params.game;
  const user = req.params.user;

  // select user/game from votes
  const check = `SELECT count(*) AS alreadyvoted FROM votes WHERE user = ? AND game = ?`;
  var params = [
    user.toUpperCase(),
    game.toUpperCase()
  ];
  db.get(check, params, (err, row) => {
    if (err)
      return console.error(err.message);

    if (row.alreadyvoted == 0) {
      // if length = 0 then insert
      const sql = `INSERT INTO votes (user, game) 
                    VALUES (?, ?)`;
      db.run(sql, params, (err, row) => {
        if (err) {
          res.render("error");
          return console.error(err.message);
        }
        res.render("vote", { name: game });
      });
    } else {
      // else error
      res.render("already_voted", { name: game, username: user });
    }

  });
});

app.get("/game", (req, res) => {
  res.send("You need to specify a game!");
});

// Check  Value
app.get("/game/:game", (req, res) => {
  const game = req.params.game;


  const check = `SELECT count(*) AS votes FROM votes WHERE game = ?`;
  var params = [
    game.toUpperCase()
  ];
  db.get(check, params, (err, row) => {
    if (err)
      return console.error(err.message);

    var votes = row.votes;
    res.render("vote_count", { name: game, num: votes });

  });
});

// Delete Value
app.get("/delete/:game/:pwd", (req, res) => {
  const game = req.params.game;
  const pwd = req.params.pwd;

  if (pwd == process.env['ACCESS_CODE']) {
    const check = `DELETE FROM votes WHERE game = ?`;
    var params = [
      game.toUpperCase()
    ];
    db.get(check, params, (err, row) => {
      if (err)
        return console.error(err.message);
      res.render("delete", { name: game });

    });
  }
});

// Get Top 3
app.get("/top", (req, res) => {

  const sql = `SELECT game, count(game) AS votes FROM Votes GROUP BY game ORDER BY count(game) DESC LIMIT 3`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("top", { model: rows });
  });
});

// Run server
var server = app.listen(8081, function() {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})