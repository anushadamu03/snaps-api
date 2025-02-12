const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const db = require("../db"); 



router.get('/tags', async (req, res) => {
  try {
    const tags = await db('tags').select('name'); 
    const tagNames = tags.map(tag => tag.name); 

    res.json(tagNames);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to retrieve tags.' });
  }
});



module.exports = router;

