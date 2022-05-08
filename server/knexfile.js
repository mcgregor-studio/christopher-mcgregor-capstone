// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
 require("dotenv").config();
 module.exports = {
  production: {
    client: "mysql",
    connection: "mysql://yzos9zy25xrsr2lt:pdhory48lppys0ry@s465z7sj4pwhp7fn.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/pt3ufuw8nhtarjjt",
  },
};