// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PW,
      database: 'galler.ai_users',
      charset: 'utf8',
    },
  }
}