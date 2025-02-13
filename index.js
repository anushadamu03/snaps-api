const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// const { getAllTags } = require('./routes/photos');
const photosRouter = require('./routes/photos');
const tagsRouter = require('./routes/tags');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
const PORT = process.env.PORT || 3000;
console.log(process.env.PORT)

const router = express.Router();

// GET endpoint to serve the JSON file

app.use('', photosRouter);
app.use('', tagsRouter);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
