const mysql = require('mysql2')
const path = require("path")
// Config
const config = require(path.join(__dirname, '../config.js'))

async function main() {

// collection of connections to the database
const pool = mysql.createPool({
    host: config.database.DB_HOST,
    user: config.database.DB_USER,
    password: config.database.DB_PASSWORD,
    database: config.database.DB_DATABASE
}).promise()

async function showAll() {
    const result = await pool.query("SELECT * FROM module")
}

result = await showAll()
console.log(result[0])


    /* const result = await pool.query("SELECT * FROM module", function(err, results, fields) {
        console.log(results);
    }
    ) */
}