const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

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
        "comments.id as comment_id", // Alias for comments.id
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
        // Use correct alias
        photoMap[photo.photos_id] = {
          id: photo.photos_id, // ✅ Use correct alias
          photo: photo.photo,
          photoDescription: photo.photoDescription,
          photographer: photo.photographer,
          likes: photo.likes,
          timestamp: photo.timestamp,
          tags: photo.tags, // Handle null safely
          comments: [],
        };
      }

      // If there's a comment, add it to the comments array
      if (photo.comment_id && photo.comment_photo_id === photo.photos_id) {
        //  Ensure correct matching
        photoMap[photo.photos_id].comments.push({
          id: photo.comment_id,
          name: photo.commenter,
          photo_id: photo.comment_photo_id, //  Use correct reference
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
      .where({ photo_id: photoId });

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

module.exports = router;














// -------------------------------------------------------old

// Your routes go here
// router.get("/photos", (req, res) => {
//   const filePath = path.join(__dirname, "../data/photos.json");

//   // Read the JSON file
//   fs.readFile(filePath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading JSON file:", err);
//       return res.status(500).json({ error: "Failed to load data." });
//     }

//     try {
//       // Parse the JSON content
//       const tags = JSON.parse(data);
//       res.json(tags);
//     } catch (parseErr) {
//       console.error("Error parsing JSON:", parseErr);
//       res.status(500).json({ error: "Invalid JSON format." });
//     }
//   });
// });

// router.get("/photos/:id", (req, res) => {
//   const filePath = path.join(__dirname, "../data/photos.json");
//   const photoId = req.params.id; // Get the ID from the request parameter

//   // Read the JSON file
//   fs.readFile(filePath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading JSON file:", err);
//       return res.status(500).json({ error: "Failed to load data." });
//     }

//     try {
//       const photos = JSON.parse(data); // Parse JSON file
//       const photo = photos.find((item) => item.id === photoId); // Find the object with matching ID

//       if (!photo) {
//         return res.status(404).json({ error: "Photo not found." });
//       }

//       res.json(photo); // Return the matched object
//     } catch (parseErr) {
//       console.error("Error parsing JSON:", parseErr);
//       res.status(500).json({ error: "Invalid JSON format." });
//     }
//   });
// });


// router.get("/photos/:id/comments", (req, res) => {
//   const filePath = path.join(__dirname, "../data/photos.json");
//   const photoId = req.params.id;

//   fs.readFile(filePath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading JSON file:", err);
//       return res.status(500).json({ error: "Failed to load data." });
//     }

//     try {
//       const photos = JSON.parse(data);
//       const photo = photos.find((item) => item.id === photoId);

//       if (!photo) {
//         return res.status(404).json({ error: "Photo not found." });
//       }

//       res.status(200).json({ comments: photo.comments });
//     } catch (parseErr) {
//       console.error("Error parsing JSON:", parseErr);
//       res.status(500).json({ error: "Invalid JSON format." });
//     }
//   });
// });



// ----wrong---

// router.post('/photos/:id/comments', (req, res) => {
//     const filePath = path.join(__dirname, '../data/photos.json');
//     const photoId = req.params.id; // Get the photo ID from the URL
//     const newComment = req.body; // Get the new comment from the request body
//   console.log("newComment==",newComment)
//     // Read the JSON file
//     fs.readFile(filePath, 'utf8', (err, data) => {
//       if (err) {
//         console.error('Error reading JSON file:', err);
//         return res.status(500).json({ error: 'Failed to load data.' });
//       }

//       try {
//         const photos = JSON.parse(data); // Parse JSON file
//         const photo = photos.find(item => item.id === photoId); // Find the photo by ID

//         if (!photo) {
//           return res.status(404).json({ error: 'Photo not found.' });
//         }

//         if (!newComment.name || !newComment.comment || !newComment.id || !newComment.timestamp) {
//           return res.status(400).json({ error: 'Incomplete comment data.' });
//         }

//         // Add the new comment to the comments array
//         photo.comments.push(newComment);

//         // Save the updated JSON back to the file
//         fs.writeFile(filePath, JSON.stringify(photos, null, 2), writeErr => {
//           if (writeErr) {
//             console.error('Error writing to JSON file:', writeErr);
//             return res.status(500).json({ error: 'Failed to update data.' });
//           }

//           res.status(201).json({ message: 'Comment added successfully.', photo });
//         });
//       } catch (parseErr) {
//         console.error('Error parsing JSON:', parseErr);
//         res.status(500).json({ error: 'Invalid JSON format.' });
//       }
//     });
//   });