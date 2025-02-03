const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Your routes go here
router.get('/photos', (req, res) => {
    const filePath = path.join(__dirname, '../data/photos.json');
  
    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        return res.status(500).json({ error: 'Failed to load data.' });
      }
  
      try {
        // Parse the JSON content
        const tags = JSON.parse(data);
        res.json(tags);
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
        res.status(500).json({ error: 'Invalid JSON format.' });
      }
    });
  });

router.get('/photos/:id', (req, res) => {
    const filePath = path.join(__dirname, '../data/photos.json');
    const photoId = req.params.id; // Get the ID from the request parameter
  
    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        return res.status(500).json({ error: 'Failed to load data.' });
      }
  
      try {
        const photos = JSON.parse(data); // Parse JSON file
        const photo = photos.find(item => item.id === photoId); // Find the object with matching ID
  
        if (!photo) {
          return res.status(404).json({ error: 'Photo not found.' });
        }
  
        res.json(photo); // Return the matched object
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
        res.status(500).json({ error: 'Invalid JSON format.' });
      }
    });
  });

router.post('/photos/:id/comments', (req, res) => {
    const filePath = path.join(__dirname, '../data/photos.json');
    const photoId = req.params.id; // Get the photo ID from the URL
    const newComment = req.body; // Get the new comment from the request body
  console.log("newComment==",newComment)
    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        return res.status(500).json({ error: 'Failed to load data.' });
      }
  
      try {
        const photos = JSON.parse(data); // Parse JSON file
        const photo = photos.find(item => item.id === photoId); // Find the photo by ID
  
        if (!photo) {
          return res.status(404).json({ error: 'Photo not found.' });
        }
  
        if (!newComment.name || !newComment.comment || !newComment.id || !newComment.timestamp) {
          return res.status(400).json({ error: 'Incomplete comment data.' });
        }
  
        // Add the new comment to the comments array
        photo.comments.push(newComment);
  
        // Save the updated JSON back to the file
        fs.writeFile(filePath, JSON.stringify(photos, null, 2), writeErr => {
          if (writeErr) {
            console.error('Error writing to JSON file:', writeErr);
            return res.status(500).json({ error: 'Failed to update data.' });
          }
  
          res.status(201).json({ message: 'Comment added successfully.', photo });
        });
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
        res.status(500).json({ error: 'Invalid JSON format.' });
      }
    });
  });

// GET endpoint to fetch comments by photo ID
router.get('/photos/:id/comments', (req, res) => {
    const filePath = path.join(__dirname, '../data/photos.json');
    const photoId = req.params.id;
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        return res.status(500).json({ error: 'Failed to load data.' });
      }
  
      try {
        const photos = JSON.parse(data);
        const photo = photos.find(item => item.id === photoId);
  
        if (!photo) {
          return res.status(404).json({ error: 'Photo not found.' });
        }
  
        res.status(200).json({ comments: photo.comments });
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
        res.status(500).json({ error: 'Invalid JSON format.' });
      }
    });
  });

module.exports = router;
