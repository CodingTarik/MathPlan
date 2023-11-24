const mysql = require('mysql2')
const path = require("path")
// Config
const config = require(path.join(__dirname, '../config.js'))


// collection of connections to the database
const pool = mysql.createPool({
    host: config.database.DB_HOST,
    user: config.database.DB_USER,
    password: config.database.DB_PASSWORD,
    database: config.database.DB_DATABASE
})


pool.query("SELECT * FROM module", function(err, results, fields) {
    console.log(results);
//mit asynch await?
}
)

