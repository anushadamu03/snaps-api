/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
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

  // Flatten comments data for database insert
  const formattedComments = photos.flatMap((photo) =>
    photo.comments.map((comment) => ({
      id: comment.id,
      photo_id: photo.id, // Correctly link to the photo's ID
      name: comment.name,
      comment: comment.comment,
      timestamp: new Date(comment.timestamp).getTime(), //  Ensure correct timestamp format
    }))
  );


  // Delete all existing entries in comments table
  await knex("comments").del();

  // Insert formatted comments into database
  if (formattedComments.length > 0) {
    await knex("comments").insert(formattedComments);
  }

  console.log("✅ Comments seeded successfully!");
};

