const knex = require("knex");
const config = require("./knexfile"); // Import knexfile.js

const db = knex(config.development); // ✅ Load development config

module.exports = db;
