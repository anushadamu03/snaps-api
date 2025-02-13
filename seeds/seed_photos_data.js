/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 *
 */

const fs = require("fs");
const path = require("path");

exports.seed = async function (knex) {
  // Read JSON file
  const jsonData = fs.readFileSync(
    path.join(__dirname, "../data/photos.json"),
    "utf-8"
  );

  // Parse JSON to JavaScript object
  const photos = JSON.parse(jsonData);

  // Convert `tags` array to JSON string before inserting into database
  const formattedPhotos = photos.map((photo) => ({
    id: photo.id,
    photo: photo.photo,
    photoDescription: photo.photoDescription,
    photographer: photo.photographer,
    likes: photo.likes,
    timestamp: photo.timestamp,
    tags: JSON.stringify(photo.tags),
  }));
  
  // Delete all existing entries
  await knex("photos").del();

  // Insert JSON data into the database
  if (formattedPhotos.length > 0) {
    await knex("photos").insert(formattedPhotos);
  }

  console.log("Photos seeded successfully!");
};

