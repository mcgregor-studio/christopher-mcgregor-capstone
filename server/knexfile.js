// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

 module.exports = {
  production: {
    client: "mysql",
    connection: process.env.JAWSDB_URL,
  },
};
