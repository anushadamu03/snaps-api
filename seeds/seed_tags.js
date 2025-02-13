/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Clear existing data
  await knex("tags").del();

  // Tags JSON array
  const tags = [
    "Arizona", "Bridge", "Buildings", "California", "Cars",
    "Cathedral", "Columns", "Courtyard", "Florida", "House",
    "Illinois", "Missouri", "Museum", "New York", "Oregon",
    "Path", "Skyline", "Subway", "Taxi", "Tennessee",
    "Texas", "Train", "Trees", "Virginia", "Washington"
  ];

  // Insert tags into the table
  await knex("tags").insert(tags.map((tag) => ({ name: tag })));
};
