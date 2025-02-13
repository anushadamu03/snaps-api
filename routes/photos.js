const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // Add this at the top
const db = require("../db"); 
router.get("/photos", async (req, res) => {
  try {
    // Fetch photos along with their comments
    const photos = await db("photos")
      .select(
        "photos.id as photos_id", // Alias for photos.id
        "photos.photo",
        "photos.photoDescription",
        "photos.photographer",
        "photos.likes",
        "photos.timestamp",
        "photos.tags",
        "comments.id as comment_id", //  Alias for comments.id
        "comments.name as commenter",
        "comments.photo_id as comment_photo_id", // Avoid confusion
        "comments.comment",
        "comments.timestamp as comment_timestamp"
      )
      .leftJoin("comments", "photos.id", "comments.photo_id"); // LEFT JOIN to fetch related comments

    // Transform data to group comments under their respective photos
    const photoMap = {};
    photos.forEach((photo) => {
      if (!photoMap[photo.photos_id]) {
        //  Use correct alias
        photoMap[photo.photos_id] = {
          id: photo.photos_id, // Use correct alias
          photo: photo.photo,
          photoDescription: photo.photoDescription,
          photographer: photo.photographer,
          likes: photo.likes,
          timestamp: photo.timestamp,
          tags:photo.tags || "[]", // Handle null safely
          comments: [],
        };
      }

      // If there's a comment, add it to the comments array
      if (photo.comment_id && photo.comment_photo_id === photo.photos_id) {
        // Ensure correct matching
        photoMap[photo.photos_id].comments.push({
          id: photo.comment_id,
          name: photo.commenter,
          photo_id: photo.comment_photo_id, // Use correct reference
          comment: photo.comment,
          timestamp: photo.comment_timestamp,
        });
      }
    });

    // Convert object to an array of photos
    res.json(Object.values(photoMap));
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Failed to fetch photos." });
  }
});


router.get("/photos/:id", async (req, res) => {
  try {
    const photoId = req.params.id; // Get the ID from request parameters

    // Fetch photo details
    const photo = await db("photos")
      .select(
        "id",
        "photo",
        "photoDescription",
        "photographer",
        "likes",
        "timestamp",
        "tags"
      )
      .where("id", photoId)
      .first(); // Get only one photo

    if (!photo) {
      return res.status(404).json({ error: "Photo not found." });
    }

    // Convert `tags` JSON string back to an array (if stored as JSON)
    if (photo.tags) {
      photo.tags = JSON.parse(photo.tags);
    }

    // Fetch matching comments for the photo
    const comments = await db("comments")
      .select("id", "name", "comment", "timestamp")
      .where("photo_id", photoId);

    // Add comments to the photo object
    photo.comments = comments;

    res.json(photo);
  } catch (error) {
    console.error("Error fetching photo and comments:", error);
    res.status(500).json({ error: "Failed to fetch photo details." });
  }
});



// Get comments for a specific photo
router.get("/photos/:id/comments", async (req, res) => {
  const { id: photoId } = req.params; // Extract photo ID from URL

  try {
    // Check if the photo exists
    const photoExists = await db("photos").where({ id: photoId }).first();
    if (!photoExists) {
      return res.status(404).json({ error: "Photo not found." });
    }

    // Fetch only the comments related to the photo
    const comments = await db("comments")
      .select("id as id", "name as name", "comment", "timestamp")
      .where({ photo_id: photoId }).orderBy("id", "desc"); // Order comments by ID in descending order;

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});



router.post('/photos/:id/comments', async (req, res) => {
  const photoId = req.params.id;
  const { name, comment, timestamp } = req.body;

  if (!name || !comment || !timestamp) {
      return res.status(400).json({ error: 'Incomplete comment data.' });
  }

  try {
      // Check if the photo exists
      const photo = await db('photos').where({ id: photoId }).first();
      if (!photo) {
          return res.status(404).json({ error: 'Photo not found.' });
      }

      // Insert the new comment (ensure `photo_id` is included)
      const newComment = {
          id: uuidv4(),
          photo_id: photoId, 
          name,
          comment,
          timestamp
      };

      await db('comments').insert(newComment);
      console.log("Comment inserted successfully!");

      // Fetch updated comments for the photo
      const updatedComments = await db('comments').where({ photo_id: photoId });

      // Attach updated comments to the photo object
      const photoWithComments = {
          ...photo,
          comments: updatedComments
      };

      console.log(photoWithComments)

      res.status(201).json({ message: 'Comment added successfully.', photo: photoWithComments });
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to add comment.', details: error.message });
  }
});



module.exports = router;











