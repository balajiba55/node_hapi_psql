const Pool = require('pg').Pool
const pool = new Pool({
  user: 'user_login',
  host: 'localhost',
  database: 'psqldatabase',
  password: 'password',
  port: 5432,
})

module.exports = pool;
