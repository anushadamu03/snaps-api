const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const photosRouter = require('./routes/photos');
const tagsRouter = require('./routes/tags');

const app = express();


app.use(cors());

app.use(express.json());
const PORT = process.env.PORT || 3000;
console.log(process.env.PORT)

const router = express.Router();



app.use('', photosRouter);
app.use('', tagsRouter);


// Start the server
app.listen(PORT, () => {
 
});
