const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Your routes go here
router.get('/tags', (req, res) => {
      const filePath = path.join(__dirname, '../data/tags.json');
    
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

    

module.exports = router;
