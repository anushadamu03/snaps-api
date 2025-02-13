// Update with your config settings.

const knex = require("knex");
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "Password",
      database: "snaps_db",
    },
  },

  staging: {
    client: "mysql2",
    connection: {
      database: "snaps_db",
      user: "root",
      password: "Password",
    },
   
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

 
};
