const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('Server is running successfully! ✅');
});

module.exports = app;
