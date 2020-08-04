let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database("db.sqlite3");

// Initialize Table
var votes  = `CREATE TABLE IF NOT EXISTS Votes
                    (user TEXT NOT NULL,
                    game TEXT NOT NULL);`

create_table (votes);

function create_table (sql) {
  db.run(sql, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of the table.");
  });
}

module.exports = db;