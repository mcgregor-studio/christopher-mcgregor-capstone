// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const connections = {
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PW,
      database: 'galler.ai_users',
      charset: 'utf8',
    },
  },
  production: {
    client: 'mysql',
    connection: process.env.JAWSDB_URL
  }

}
 module.exports = 
    process.env.NODE_ENV === 'production'
    ? connections.production
    : connections.development;
  ;