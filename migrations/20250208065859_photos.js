
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("photos", (table) => {
        table.string("id").primary();
        table.string("photo").notNullable();
        table.text("photoDescription").notNullable();
        table.string("photographer").notNullable();
        table.integer("likes").defaultTo(0);
        table.bigInteger("timestamp").notNullable();
        table.json("tags");
        table.timestamp("created_at").defaultTo(knex.fn.now());
      })
      .then(() => {
        return knex.schema.createTable("comments", function (table) {
            table.string("id").primary();
            table.string("photo_id").notNullable().references("id").inTable("photos");
            table.string("name").notNullable();
            table.text("comment").notNullable();
            table.bigInteger("timestamp").notNullable();
            table.timestamp("created_at").defaultTo(knex.fn.now());
        });
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema
      .dropTable("comments") // Drop comments first to avoid foreign key issues
      .then(() => knex.schema.dropTable("photos"));
  };
  

