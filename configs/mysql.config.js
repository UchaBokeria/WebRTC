// ---- REQUIRES
const mysql = require("mysql");

/**
 *
 * @alias DB_HOST
 * @alias DB_USER
 * @alias DB_PASS
 * @alias DB_NAME
 * @alias DB_CHAR
 *
 */

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: process.env.DB_CHAR,
  connectTimeout: 100000,
});

// ---- EXPORTS

module.exports = { connection: db };