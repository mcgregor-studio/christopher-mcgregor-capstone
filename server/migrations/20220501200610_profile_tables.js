/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
    return knex.schema
      .createTable("users", (table) => {
        table.string("g_id").primary();
        table.string("username").notNullable();
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      })
      .createTable("drawings", (table) => {
        table.string("id").primary();
        table
          .string("user_id")
          .notNullable()
          .references("g_id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.string("thumbnail").notNullable();
        table.string("lineart").notNullable();
        table.string("colours").notNullable();
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable("drawings").dropTable("users");
  };
  