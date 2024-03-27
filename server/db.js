const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password: "asdasd",
    host: "localhost",
    port: 5432,
    database: "bpl"
})

module.exports = pool